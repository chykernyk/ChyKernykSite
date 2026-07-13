// Supabase Edge Function: best-effort read of the next bin/waste collection
// due for this property, from Cornwall Council's "My Area" lookup. Fetched
// server-side because that page can't be called directly from the browser
// (no CORS headers of its own), and this app has no server of its own
// besides Supabase. Deployed with --no-verify-jwt since this is public,
// non-sensitive, read-only data.
//
// NOTE: Cornwall Council's page format hasn't been confirmed yet (it may
// render collection dates via a client-side API call rather than in the
// initial HTML, in which case this won't find anything). The `debug` field
// always carries a text snippet of what was actually fetched, specifically
// so the real output can be inspected and the regex below adjusted without
// needing to guess blind.
const SOURCE_URL = "https://www.cornwall.gov.uk/my-area/?Postcode=TR2%205du&Uprn=100040046921";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

Deno.serve(async req => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const res = await fetch(SOURCE_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ChyKernykSite/1.0; +https://chykernyk.co.uk)" },
    });
    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

    // Look for a bin/waste type near a date-like string within a short
    // window, e.g. "Recycling ... Monday 21 July" or "Rubbish - 21/07/2026".
    const match = text.match(
      /(rubbish|refuse|recycling|garden waste|food waste)[^.]{0,60}?((?:\d{1,2}[\/\s]\w+[\/\s]?\d{0,4})|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
    );

    return new Response(
      JSON.stringify({
        found: !!match,
        message: match ? `Next collection: ${match[1]} — ${match[2]}` : null,
        debug: text.slice(0, 4000),
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
