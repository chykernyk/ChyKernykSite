// Supabase Edge Function: best-effort read of the next bin/waste collection
// due for this property, from Cornwall Council's published collection round
// PDF. Fetched and parsed server-side because that file can't be read
// directly from the browser, and this app has no server of its own besides
// Supabase. Deployed with --no-verify-jwt since this is public,
// non-sensitive, read-only data.
//
// NOTE: this council PDF's exact layout hasn't been confirmed by hand (it
// can't be fetched from the sandbox this was written in), so the date/type
// matching below is a best-effort heuristic over the extracted text rather
// than a known fixed format. The `debug` field always carries a slice of
// that extracted text, specifically so the real output can be inspected and
// the matching tuned without needing to guess blind.
import { extractText, getDocumentProxy } from "npm:unpdf@0.12.1";

const SOURCE_URL = "https://www.cornwall.gov.uk/media/rggnvze3/monfort1new.pdf";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const MONTHS: Record<string, number> = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
  may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7,
  sep: 8, sept: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
};
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const BIN_TYPE_RE = /(rubbish|refuse|recycling|garden waste|food waste|black bin|green bin|blue bag)/gi;

function lastKeyword(str: string) {
  let last: string | null = null, m;
  const re = new RegExp(BIN_TYPE_RE.source, "gi");
  while ((m = re.exec(str)) !== null) last = m[1];
  return last;
}
function firstKeyword(str: string) {
  const m = str.match(new RegExp(BIN_TYPE_RE.source, "i"));
  return m ? m[1] : null;
}

// Finds every day-month(-year) date mention in the text, then returns the
// soonest one that's today or later, along with whichever bin-type keyword
// sits closest to it (checked after the date first, then before), bounded
// so it can't bleed into a neighbouring date entry.
function findNextCollection(text: string, now: Date) {
  const dateRe = /(\d{1,2})(?:st|nd|rd|th)?\s+(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s*(\d{4})?/gi;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const all: { date: Date; start: number; end: number }[] = [];
  let m;
  while ((m = dateRe.exec(text)) !== null) {
    const day = parseInt(m[1], 10);
    const month = MONTHS[m[2].toLowerCase()];
    const year = m[3] ? parseInt(m[3], 10) : now.getFullYear();
    if (month === undefined || day < 1 || day > 31) continue;
    let date = new Date(year, month, day);
    if (!m[3] && date < today) date = new Date(year + 1, month, day);
    all.push({ date, start: m.index, end: m.index + m[0].length });
  }
  if (all.length === 0) return null;

  const upcoming = all.filter(c => c.date >= today).sort((a, b) => a.date.getTime() - b.date.getTime());
  if (upcoming.length === 0) return null;
  const best = upcoming[0];

  const byPos = [...all].sort((a, b) => a.start - b.start);
  const posIdx = byPos.findIndex(c => c.start === best.start);
  const prevEnd = posIdx > 0 ? byPos[posIdx - 1].end : Math.max(0, best.start - 80);
  const nextStart = posIdx < byPos.length - 1 ? byPos[posIdx + 1].start : Math.min(text.length, best.end + 80);
  const before = text.slice(prevEnd, best.start);
  const after = text.slice(best.end, nextStart);
  const binType = firstKeyword(after) || lastKeyword(before);

  const dayName = DAY_NAMES[best.date.getDay()];
  const formatted = best.date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return `Next collection: ${binType ? binType[0].toUpperCase() + binType.slice(1) + " — " : ""}${dayName} ${formatted}`;
}

Deno.serve(async req => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const res = await fetch(SOURCE_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ChyKernykSite/1.0; +https://chykernyk.co.uk)" },
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const bytes = new Uint8Array(await res.arrayBuffer());
    const doc = await getDocumentProxy(bytes);
    const { text: rawText } = await extractText(doc, { mergePages: true });
    const text = rawText.replace(/\s+/g, " ").trim();

    // Europe/London wall-clock "now", so day-granularity comparisons match
    // what a UK reader means by "today" regardless of the server's own TZ.
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/London" }));
    const message = findNextCollection(text, now);

    return new Response(
      JSON.stringify({ found: !!message, message, debug: text.slice(0, 4000) }),
      { headers: corsHeaders },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ found: false, error: String(err) }),
      { headers: corsHeaders },
    );
  }
});
