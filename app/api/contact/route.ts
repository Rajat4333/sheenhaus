// POST /api/contact — handles the contact form on /contact.
//
// Validates minimal fields, then emails hello@sheenhaus.com via Resend
// (same SDK + env vars as the audit-email route). Returns 200 on
// success, 4xx on validation, 500 on send failure.

import { NextResponse } from "next/server";
import { Resend } from "resend";

export const maxDuration = 15;

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  projectType?: string;
  timeline?: string;
  message?: string;
};

const RECIPIENT = process.env.RESEND_TO_EMAIL || "hello@sheenhaus.com";

function esc(s: string | undefined): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderHtml(p: ContactPayload): string {
  const row = (label: string, val: string | undefined) =>
    val
      ? `<tr><td style="padding:8px 16px 8px 0;color:#8a7d68;font:11px 'IBM Plex Mono',monospace;letter-spacing:0.18em;text-transform:uppercase;vertical-align:top;width:32%">${label}</td><td style="padding:8px 0;color:#1a1612;font:14px 'Instrument Serif',Georgia,serif;line-height:1.55">${esc(val)}</td></tr>`
      : "";

  return `<!doctype html><html><body style="margin:0;padding:32px 24px;background:#f4efe6;font-family:'Instrument Serif',Georgia,serif;color:#1a1612">
    <div style="max-width:580px;margin:0 auto">
      <div style="font:11px 'IBM Plex Mono',monospace;letter-spacing:0.32em;text-transform:uppercase;color:#8a6a35;margin-bottom:24px">● Sheenhaus · New enquiry</div>
      <h1 style="font:400 28px 'Instrument Serif',Georgia,serif;letter-spacing:-0.02em;margin:0 0 24px;color:#1a1612">${esc(p.name) || "Anonymous"} <span style="font:11px 'IBM Plex Mono',monospace;letter-spacing:0.18em;color:#8a7d68;text-transform:uppercase;margin-left:8px">via /contact</span></h1>
      <table style="width:100%;border-collapse:collapse;margin-bottom:32px;border-top:1px solid #d3cbb8">
        ${row("Email", p.email)}
        ${row("Company / URL", p.company)}
        ${row("Project type", p.projectType)}
        ${row("Timeline", p.timeline)}
      </table>
      ${p.message ? `<div style="border-top:1px solid #d3cbb8;padding-top:20px"><div style="font:11px 'IBM Plex Mono',monospace;letter-spacing:0.18em;text-transform:uppercase;color:#8a7d68;margin-bottom:12px">Message</div><p style="margin:0;font:16px/1.7 'Instrument Serif',Georgia,serif;color:#1a1612;white-space:pre-wrap">${esc(p.message)}</p></div>` : ""}
      <div style="margin-top:48px;padding-top:16px;border-top:1px solid #d3cbb8;font:10px 'IBM Plex Mono',monospace;letter-spacing:0.22em;text-transform:uppercase;color:#8a7d68">Reply directly to this email to respond.</div>
    </div>
  </body></html>`;
}

export async function POST(req: Request) {
  let payload: ContactPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Minimal validation — name + email + message are the only required fields
  if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
    return NextResponse.json(
      { error: "missing_required", fields: ["name", "email", "message"] },
      { status: 400 }
    );
  }
  // Loose email shape check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL || "Sheenhaus <hello@sheenhaus.com>";

  if (!apiKey) {
    // Dev / unconfigured environment — log + return success so the UI
    // still shows the confirmation state. Visible in server logs.
    console.warn("[/api/contact] RESEND_API_KEY missing — enquiry not sent:", payload);
    return NextResponse.json({ ok: true, devModeNoSend: true });
  }

  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({
      from,
      to: RECIPIENT,
      replyTo: payload.email,
      subject: `New enquiry · ${payload.name} — ${payload.projectType || "general"}`,
      html: renderHtml(payload),
    });
  } catch (err) {
    console.error("[/api/contact] Resend send failed:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
