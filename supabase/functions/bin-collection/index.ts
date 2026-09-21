// Supabase Edge Function: computes the next bin/waste collection due for
// this property. Fetched and parsed server-side because Cornwall Council's
// PDF can't be read directly from the browser, and this app has no server
// of its own besides Supabase. Deployed with --no-verify-jwt since this is
// public, non-sensitive, read-only data.
//
// The PDF ("Food waste, recycling and rubbish collection calendar") is a
// 12-month grid (Mo/Tu/We/Th/Fr columns per month, 3 month-rows of 4
// months each). It states the base collection weekday in text ("Your
// collection day is Monday") plus a short list of named holiday-shift
// exceptions (e.g. "Rubbish and food waste due on Monday 29 December will
// be collected on Tuesday 30 December.") — that text is enough to compute
// *which day* the next collection falls on (see findNextCollectionDate
// below).
//
// But WHICH BIN (black bin/rubbish vs green bin/recycling) is due each
// Monday is only shown via cell shading in the grid — dark green cells are
// black-bin weeks, light green cells are green-bin weeks (confirmed against
// the legend: "Recycling and food waste collection days." sits next to a
// light-green swatch, "Rubbish and food waste collection days." next to a
// dark-green swatch) — there's no way to recover that from plain extracted
// text. So this also walks the PDF's low-level drawing operators (via
// pdfjs-dist, which unpdf wraps) to find every shaded Monday cell's fill
// color and position, cross-references that against the day-number and
// month-header text positions to build a full (date -> bin type) map for
// the whole 12-month grid, and looks up the collection date in it.
//
// Both the plain text (for the date logic) and the shading map are built
// from a SINGLE page.getTextContent()/getOperatorList() pass. An earlier
// version called unpdf's high-level extractText() first and then read the
// operator list separately — even from a second, independent document
// proxy — and the operator list consistently came back empty on that
// second pass (unpdf ships its own vendored pdfjs-dist bundle with some
// shared/global state that a prior extractText() call leaves disrupted).
// Reconstructing the merged text from the same textContent.items this
// function already needs sidesteps that entirely.
import { getDocumentProxy } from "npm:unpdf@0.12.1";
import { OPS } from "npm:pdfjs-dist@4.7.76/legacy/build/pdf.mjs";

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
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function sameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
  const out: { due: Date; collected: Date }[] = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const [, , dueDay, dueMonthName, , newDay, newMonthName] = m;
    const dueMonth = MONTHS[dueMonthName.toLowerCase()];
    const newMonth = MONTHS[newMonthName.toLowerCase()];
    if (dueMonth === undefined || newMonth === undefined) continue;
    const dueYear = monthYear[dueMonth];
    if (dueYear === undefined) continue;
    const newYear = monthYear[newMonth] ?? dueYear;
    out.push({
      due: new Date(dueYear, dueMonth, parseInt(dueDay, 10)),
      collected: new Date(newYear, newMonth, parseInt(newDay, 10)),
    });
  }
  return out;
}

// Which shaded-cell fill color means which bin, confirmed against the
// PDF's own legend swatches (RGB 0-255, as pdfjs's setFillRGBColor reports
// them for this document's device-RGB fills).
const BIN_COLORS: Record<"black" | "green", [number, number, number]> = {
  green: [121, 188, 67], // light green -> "Recycling and food waste collection days."
  black: [0, 67, 50], // dark green -> "Rubbish and food waste collection days."
};

function matchBinColor(rgb: unknown): "black" | "green" | null {
  if (!Array.isArray(rgb)) return null;
  for (const [label, [r, g, b]] of Object.entries(BIN_COLORS)) {
    if (rgb[0] === r && rgb[1] === g && rgb[2] === b) return label as "black" | "green";
  }
  return null;
}

// Parses the PDF's single page once: reconstructs the plain merged text
// (for the date logic, in place of unpdf's extractText — see the header
// comment for why) and builds the (date -> bin type) map from cell
// shading, in the same pass.
async function parsePdf(doc: any): Promise<{ text: string; binTypeMap: Map<string, "black" | "green"> }> {
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale: 1 });
  const pageHeight = viewport.height;

  const textContent = await page.getTextContent();
  const items: { str: string; x: number; y: number }[] = [];
  const rawStrings: string[] = [];
  for (const raw of textContent.items) {
    if (typeof raw?.str !== "string" || !Array.isArray(raw.transform)) continue;
    rawStrings.push(raw.str);
    const str = raw.str.trim();
    if (!str) continue;
    items.push({ str, x: raw.transform[4], y: pageHeight - raw.transform[5] });
  }
  const text = rawStrings.join(" ").replace(/\s+/g, " ").trim();

  const monthHeaders: { x: number; y: number; month: number; year: number }[] = [];
  const headerRe = new RegExp(`^(${MONTH_NAMES.join("|")})\\s+(\\d{4})$`);
  for (const it of items) {
    const m = it.str.match(headerRe);
    if (m) monthHeaders.push({ x: it.x, y: it.y, month: MONTH_NAMES.indexOf(m[1]), year: parseInt(m[2], 10) });
  }
  const dayItems = items.filter(it => /^\d{1,2}$/.test(it.str));

  const opList = await page.getOperatorList();
  const opNames: Record<number, string> = {};
  for (const [name, val] of Object.entries(OPS)) opNames[val as number] = name;

  let currentColor: "black" | "green" | null = null;
  let opsSinceColor = 0;
  const cellRects: { x0: number; y0: number; x1: number; y1: number; color: "black" | "green" }[] = [];

  for (let i = 0; i < opList.fnArray.length; i++) {
    const name = opNames[opList.fnArray[i]];
    const args = opList.argsArray[i];
    if (name === "setFillRGBColor") {
      currentColor = matchBinColor(args);
      opsSinceColor = 0;
    } else if (name === "constructPath") {
      opsSinceColor++;
      if (currentColor && opsSinceColor <= 3) {
        const [subOps, coords] = args as [number[], number[]];
        const isPureRect = subOps.length > 0 && subOps.every(s => s === OPS.rectangle);
        if (isPureRect) {
          for (let k = 0; k + 3 < coords.length; k += 4) {
            const [x, y, w, h] = coords.slice(k, k + 4);
            // Only grid cells (~16.4pt wide), not the ~11.3pt legend swatches.
            if (Math.abs(w) < 13) continue;
            const yA = pageHeight - y;
            const yB = pageHeight - (y + h);
            cellRects.push({ x0: x, x1: x + w, y0: Math.min(yA, yB), y1: Math.max(yA, yB), color: currentColor });
          }
        }
      }
    }
  }

  const map = new Map<string, "black" | "green">();
  for (const r of cellRects) {
    let header: typeof monthHeaders[0] | null = null;
    for (const h of monthHeaders) {
      if (h.x >= r.x0 - 2 && h.x <= r.x1 + 2 && h.y < r.y0 && (!header || h.y > header.y)) header = h;
    }
    if (!header) continue;

    const dayItem = dayItems.find(d => d.x >= r.x0 - 1 && d.x <= r.x1 + 1 && d.y >= r.y0 - 1 && d.y <= r.y1 + 1);
    if (!dayItem) continue;

    const date = new Date(header.year, header.month, parseInt(dayItem.str, 10));
    map.set(dateKey(date), r.color);
  }

  return { text, binTypeMap: map };
}

const BIN_LABEL: Record<"black" | "green", string> = { black: "Black bin", green: "Green bin" };

function formatMessage(date: Date, binType?: "black" | "green", movedFrom?: Date) {
  const dayName = DAY_NAMES[date.getDay()];
  const formatted = date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const typePart = binType ? `${BIN_LABEL[binType]} — ` : "";
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
    const { text, binTypeMap } = await parsePdf(doc);

    // Europe/London wall-clock "now", so day-granularity comparisons match
    // what a UK reader means by "today" regardless of the server's own TZ.
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/London" }));
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const base = baseCollectionDay(text);
    const scheduled = nextWeekday(base, today);
    const monthYear = buildMonthYearMap(text);
    const exceptions = findExceptions(text, monthYear);
    const shifted = exceptions.find(e => sameDate(e.due, scheduled));

    // The bin type follows the ORIGINALLY scheduled Monday's shading, even
    // when an exception moves the pickup to a different day.
    const binType = binTypeMap.get(dateKey(scheduled));

    const message = shifted
      ? formatMessage(shifted.collected, binType, shifted.due)
      : formatMessage(scheduled, binType);

    return new Response(
      JSON.stringify({
        found: true,
        message,
        debug: {
          baseDayName: DAY_NAMES[base],
          scheduled: scheduled.toISOString(),
          exceptionsFound: exceptions.length,
          binTypeMapSize: binTypeMap.size,
          binType: binType ?? null,
          textLength: text.length,
        },
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
