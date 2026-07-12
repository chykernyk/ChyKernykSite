// Supabase Edge Function: sends an email notification whenever a new row is
// inserted into public.visitor_entries. Triggered by a Database Webhook
// (Database > Webhooks in the Supabase dashboard), not called from the app.
//
// Required secrets (supabase secrets set):
//   SMTP_HOST         e.g. smtp.ionos.co.uk
//   SMTP_PORT         e.g. 587
//   SMTP_USER         the IONOS mailbox username, e.g. contact@chykernyk.co.uk
//   SMTP_PASS         the IONOS mailbox password
//   NOTIFY_TO         recipient address, e.g. contact@chykernyk.co.uk
//   WEBHOOK_SECRET    random shared secret; must match the custom header
//                     configured on the Database Webhook so this function
//                     only accepts requests that actually came from Supabase
import nodemailer from "npm:nodemailer@6.9.16";

Deno.serve(async req => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const expectedSecret = Deno.env.get("WEBHOOK_SECRET");
  if (!expectedSecret || req.headers.get("x-webhook-secret") !== expectedSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await req.json();
  const record = payload?.record;
  if (payload?.type !== "INSERT" || !record) {
    return new Response("Ignored", { status: 200 });
  }

  const transporter = nodemailer.createTransport({
    host: Deno.env.get("SMTP_HOST"),
    port: Number(Deno.env.get("SMTP_PORT")),
    secure: Number(Deno.env.get("SMTP_PORT")) === 465,
    auth: {
      user: Deno.env.get("SMTP_USER"),
      pass: Deno.env.get("SMTP_PASS"),
    },
  });

  const entryDate = record.entry_date
    ? new Date(record.entry_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "unknown date";
  const photoCount = Array.isArray(record.photo_urls) ? record.photo_urls.length : 0;

  await transporter.sendMail({
    from: Deno.env.get("SMTP_USER"),
    to: Deno.env.get("NOTIFY_TO"),
    subject: `New Visitors Book entry from ${record.name ?? "a guest"}`,
    text: [
      `${record.name ?? "A guest"} signed the Visitors Book.`,
      `Date: ${entryDate}`,
      "",
      record.message ?? "",
      "",
      photoCount > 0 ? `${photoCount} photo${photoCount > 1 ? "s" : ""} attached.` : "No photos attached.",
    ].join("\n"),
  });

  return new Response("OK", { status: 200 });
});
