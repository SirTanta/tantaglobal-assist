import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type CapturePayload = {
  email: string;
  intent: string;
  source_bot?: string;
  source_site?: string;
  audience?: "employer" | "candidate" | null;
  transcript?: Array<{ role: string; text: string }>;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as CapturePayload | null;
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const email = (body.email || "").trim().toLowerCase();
  const intent = (body.intent || "").trim();
  if (!isValidEmail(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  if (!intent || intent.length < 3) return NextResponse.json({ error: "Intent required" }, { status: 400 });

  const sourceBot = body.source_bot || "tala";
  const sourceSite = body.source_site || "tantaglobal-assist";
  const audience = body.audience === "employer" || body.audience === "candidate" ? body.audience : null;
  const transcript = Array.isArray(body.transcript) ? body.transcript.slice(-20) : [];

  let leadId: string | null = null;
  const thosUrl = process.env.THOS_SUPABASE_URL;
  const thosKey = process.env.THOS_SUPABASE_SERVICE_KEY;
  if (thosUrl && thosKey) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(thosUrl, thosKey);
      const { data, error } = await supabase
        .from("bot_leads")
        .insert({
          source_bot: sourceBot,
          source_site: sourceSite,
          email,
          intent,
          qualified_for: audience,
          transcript,
        })
        .select("id")
        .single();
      if (error) console.error("[Tala/Capture] Supabase error:", error.message);
      else leadId = data?.id ?? null;
    } catch (err) {
      console.error("[Tala/Capture] Supabase exception:", err);
    }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromAddress = process.env.RESEND_FROM_EMAIL || "TantaGlobal Assist <hello@tantaglobal.com>";
      const notifyDefault = audience === "candidate"
        ? "candidates@tantaglobal.com"
        : audience === "employer"
        ? "employers@tantaglobal.com"
        : "hello@tantaglobal.com";
      const notifyTo = process.env.LEAD_NOTIFICATION_EMAIL || notifyDefault;

      const notifyHtml = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#f4f6f6;margin:0;padding:32px 16px;color:#0d2326">
<table width="600" cellpadding="0" cellspacing="0" align="center" style="background:#ffffff;border:1px solid rgba(13,92,99,0.18);border-radius:12px;overflow:hidden;max-width:600px;width:100%">
  <tr><td style="background:#0d5c63;padding:18px 28px">
    <span style="color:#ffffff;font-weight:800;font-size:16px;letter-spacing:0.04em">TGA · TALA</span>
    <span style="color:rgba(255,255,255,0.65);font-size:11px;margin-left:12px;text-transform:uppercase;letter-spacing:0.2em">New lead</span>
  </td></tr>
  <tr><td style="height:2px;background:linear-gradient(90deg,transparent,#0d5c63,transparent)"></td></tr>
  <tr><td style="padding:24px 28px">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.65">
      <tr><td style="padding-bottom:6px"><strong>Email:</strong> <a href="mailto:${esc(email)}" style="color:#0d5c63">${esc(email)}</a></td></tr>
      <tr><td style="padding-bottom:6px"><strong>Source bot:</strong> ${esc(sourceBot)} · ${esc(sourceSite)}</td></tr>
      ${audience ? `<tr><td style="padding-bottom:6px"><strong>Audience:</strong> ${esc(audience)}</td></tr>` : ""}
      <tr><td style="padding-top:8px;padding-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#0d5c63;font-weight:700">Intent</td></tr>
      <tr><td style="background:#f4f6f6;border-left:3px solid #0d5c63;padding:12px 14px;border-radius:0 6px 6px 0">${esc(intent)}</td></tr>
      ${transcript.length ? `
      <tr><td style="padding-top:16px;padding-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#0d5c63;font-weight:700">Last ${transcript.length} messages</td></tr>
      <tr><td style="padding-bottom:4px">
        ${transcript.map((m) => `<div style="margin-bottom:6px;font-size:12px;color:#3a4a4d"><strong style="color:${m.role === "user" ? "#0d2326" : "#0d5c63"}">${esc(m.role)}:</strong> ${esc(m.text).slice(0, 320)}</div>`).join("")}
      </td></tr>` : ""}
    </table>
  </td></tr>
  <tr><td style="padding:12px 28px;background:#f4f6f6;font-size:11px;color:#0d5c63">
    ${leadId ? `Lead id: ${esc(leadId)}` : "Lead not persisted to Supabase (env missing)"}
  </td></tr>
</table>
</body></html>`;

      const confirmHtml = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#f4f6f6;margin:0;padding:32px 16px;color:#0d2326">
<table width="600" cellpadding="0" cellspacing="0" align="center" style="background:#ffffff;border:1px solid rgba(13,92,99,0.18);border-radius:12px;overflow:hidden;max-width:600px;width:100%">
  <tr><td style="background:#0d5c63;padding:22px 28px">
    <span style="color:#ffffff;font-weight:800;font-size:18px">TANTAGLOBAL ASSIST</span>
  </td></tr>
  <tr><td style="height:2px;background:linear-gradient(90deg,transparent,#0d5c63,transparent)"></td></tr>
  <tr><td style="padding:28px">
    <p style="margin:0 0 12px;font-size:20px;font-weight:700;color:#0d2326">Got it. We'll be in touch.</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:#3a4a4d">
      Thanks for the note. The TGA Assist team will follow up directly to scope the right next step ${audience === "employer" ? "for your role brief" : audience === "candidate" ? "for your application" : ""}. We keep the workflow lean — academy-certified candidates, scoped briefs, and clean handoffs.
    </p>
    <p style="margin:0;font-size:13px;color:#0d5c63">— TantaGlobal Assist · Cebu, PH + Rio Rancho, NM</p>
  </td></tr>
</table>
</body></html>`;

      await Promise.all([
        resend.emails.send({
          from: fromAddress,
          to: notifyTo,
          subject: `[Tala] New lead · ${audience || "general"} · ${email}`,
          html: notifyHtml,
          replyTo: email,
        }),
        resend.emails.send({
          from: fromAddress,
          to: email,
          subject: "TantaGlobal Assist — we received your note",
          html: confirmHtml,
        }),
      ]);
    } catch (err) {
      console.error("[Tala/Capture] Resend exception:", err);
    }
  }

  return NextResponse.json({ ok: true, leadId });
}
