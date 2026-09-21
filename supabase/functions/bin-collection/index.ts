// Supabase Edge Function: computes the next bin/waste collection due for
// this property. Fetched and parsed server-side because Cornwall Council's
// PDF can't be read directly from the browser, and this app has no server
// of its own besides Supabase. Deployed with --no-verify-jwt since this is
// public, non-sensitive, read-only data.
//
// The PDF ("Food waste, recycling and rubbish collection calendar") is a
// plain monthly grid of weekday numbers under "Mo Tu We Th Fr" headers —
// it does NOT print which Mondays are recycling vs rubbish weeks in text,
// only via cell shading, which text extraction can't see. So this doesn't
// try to recover the fortnightly recycling/rubbish alternation; it only
// answers "which day is the next collection", which the document states
// outright ("Your collection day is Monday") plus a short list of named
// exceptions around Christmas (e.g. "Rubbish and food waste due on Monday
// 29 December will be collected on Tuesday 30 December."). Those exception
// sentences are the only place a day number sits next to a month name in
// the whole document, which is why an earlier version of this function —
// that scanned for any "day month" mention and took the soonest one — only
// ever found the Christmas dates, all year round.
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

function sameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// The document's own statement of the base collection weekday, e.g. "Your
// collection day is Monday" — falls back to Monday if that sentence isn't
// found, since that's the only weekday this property has ever been on.
function baseCollectionDay(text: string): number {
  const m = text.match(/collection day is (\w+)/i);
  if (m) {
    const idx = DAY_NAMES.findIndex(d => d.toLowerCase() === m[1].toLowerCase());
    if (idx !== -1) return idx;
  }
  return 1;
}

// The soonest date (today or later) that falls on the given weekday.
function nextWeekday(base: number, today: Date): Date {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = (base - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
}

// The calendar's month headers ("December 2025", "January 2026", ...) give
// away which year each month belongs to — needed because the Christmas
// exception sentences below name a day and month but never a year.
function buildMonthYearMap(text: string): Record<number, number> {
  const map: Record<number, number> = {};
  const re = /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    map[MONTHS[m[1].toLowerCase()]] = parseInt(m[2], 10);
  }
  return map;
}

// Finds every "<Type> and food waste due on <Day> <D> <Month> will be
// collected on <Day> <D> <Month>" sentence — the only holiday-shift notes
// the document contains (typically just Christmas, but this doesn't assume
// there's exactly one, in case a future year's PDF adds a New Year one too).
function findExceptions(text: string, monthYear: Record<number, number>) {
  const re = /(rubbish|recycling)\s+and\s+food\s+waste\s+due\s+on\s+\w+\s+(\d{1,2})\s+(\w+)\s+will\s+be\s+collected\s+on\s+(\w+)\s+(\d{1,2})\s+(\w+)/gi;
  const out: { due: Date; collected: Date; binType: string }[] = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const [, binType, dueDay, dueMonthName, , newDay, newMonthName] = m;
    const dueMonth = MONTHS[dueMonthName.toLowerCase()];
    const newMonth = MONTHS[newMonthName.toLowerCase()];
    if (dueMonth === undefined || newMonth === undefined) continue;
    const dueYear = monthYear[dueMonth];
    if (dueYear === undefined) continue;
    const newYear = monthYear[newMonth] ?? dueYear;
    out.push({
      due: new Date(dueYear, dueMonth, parseInt(dueDay, 10)),
      collected: new Date(newYear, newMonth, parseInt(newDay, 10)),
      binType,
    });
  }
  return out;
}

function formatMessage(date: Date, binType?: string, movedFrom?: Date) {
  const dayName = DAY_NAMES[date.getDay()];
  const formatted = date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const typePart = binType ? `${binType[0].toUpperCase()}${binType.slice(1)} and food waste — ` : "";
  const movedPart = movedFrom
    ? ` (moved from ${DAY_NAMES[movedFrom.getDay()]} ${movedFrom.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} due to Christmas)`
    : "";
  return `Next collection: ${typePart}${dayName} ${formatted}${movedPart}`;
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
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const base = baseCollectionDay(text);
    const scheduled = nextWeekday(base, today);
    const monthYear = buildMonthYearMap(text);
    const exceptions = findExceptions(text, monthYear);
    const shifted = exceptions.find(e => sameDate(e.due, scheduled));

    const message = shifted
      ? formatMessage(shifted.collected, shifted.binType, shifted.due)
      : formatMessage(scheduled);

    return new Response(
      JSON.stringify({
        found: true,
        message,
        debug: { baseDayName: DAY_NAMES[base], scheduled: scheduled.toISOString(), exceptionsFound: exceptions.length, textLength: text.length },
      }),
      { headers: corsHeaders },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ found: false, error: String(err) }),
      { headers: corsHeaders },
    );
  }
});
