// Supabase Edge Function: reads the live "traffic light" running status for
// the St Mawes Ferry from falriver.co.uk and returns it as small JSON.
// Fetched server-side because the source page can't be called directly from
// the browser (no CORS headers of its own), and this app has no backend of
// its own besides Supabase. Deployed with --no-verify-jwt since this is
// public, non-sensitive, read-only data.
const SOURCE_URL = "https://www.falriver.co.uk/ferries/st-mawes-ferry";

const LEVELS: Record<string, string> = {
  "running": "green",
  "not-running": "red",
  "disruption": "amber",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

function unknownResponse() {
  return new Response(
    JSON.stringify({ level: "unknown", message: "Live status unavailable — check the timetable.", checkedAt: new Date().toISOString() }),
    { headers: corsHeaders },
  );
}

Deno.serve(async req => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const res = await fetch(SOURCE_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ChyKernykSite/1.0; +https://chykernyk.co.uk)" },
    });
    if (!res.ok) return unknownResponse();

    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

    const match = text.match(/(Running|Not-running|Disruption)\s*\/\s*St Mawes Ferry:\s*(.+?)(?:\s*Green\s*\/\s*running|$)/i);
    if (!match) return unknownResponse();

    const level = LEVELS[match[1].toLowerCase()] ?? "unknown";
    const message = `${match[1]} / St Mawes Ferry: ${match[2].trim()}`;

    return new Response(
      JSON.stringify({ level, message, checkedAt: new Date().toISOString() }),
      { headers: corsHeaders },
    );
  } catch {
    return unknownResponse();
  }
});
