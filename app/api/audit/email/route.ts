// POST /api/audit/email — sends the audit report as an HTML email via Resend.
//
// We keep the report as HTML in the inbox rather than a PDF attachment.
// Generating PDFs server-side requires Puppeteer/Chromium on Vercel
// (heavy cold start, separate runtime) for marginal benefit — most
// recipients screenshot or print-to-PDF from the email anyway, and an
// HTML email renders better on mobile than an A4 PDF.

import { NextResponse } from "next/server";
import { Resend } from "resend";

export const maxDuration = 15;

type Category = "performance" | "craft" | "trust" | "discoverability";

type SignHit = {
  num: string;
  title: string;
  category: Category;
  severity: "low" | "medium" | "high";
};

type AuditPayload = {
  url: string;
  score: number;
  scores: Record<Category, number>;
  signs: SignHit[];
  pagespeed: {
    performance: number;
    accessibility: number;
    seo: number;
    bestPractices: number;
    lcp: number | null;
    cls: number | null;
    tbt: number | null;
  } | null;
};

const CATEGORY_LABEL: Record<Category, string> = {
  performance: "Performance",
  craft: "Craft",
  trust: "Trust",
  discoverability: "AI Discoverability",
};

function scoreBand(n: number): string {
  if (n >= 85) return "Considered";
  if (n >= 70) return "Workmanlike";
  if (n >= 50) return "Drifting";
  if (n >= 30) return "Costing you clients";
  return "Critical";
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function renderEmailHtml(audit: AuditPayload): string {
  const hostname = (() => {
    try {
      return new URL(audit.url).hostname;
    } catch {
      return audit.url;
    }
  })();

  const signRows = audit.signs
    .map(
      (s) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #e8e2d5;font-family:'IBM Plex Mono',monospace;font-size:11px;color:#8a7a5a;letter-spacing:0.12em;width:40px;vertical-align:top;">${s.num}</td>
        <td style="padding:14px 0;border-bottom:1px solid #e8e2d5;font-family:Georgia,'Instrument Serif',serif;font-size:17px;color:#1a1612;line-height:1.5;">${escapeHtml(s.title)}</td>
        <td style="padding:14px 0;border-bottom:1px solid #e8e2d5;font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:${s.severity === "high" ? "#8a6a35" : "#6b6356"};text-align:right;vertical-align:top;">${s.severity}</td>
      </tr>`
    )
    .join("");

  const categoryRows = (Object.keys(audit.scores) as Category[])
    .map(
      (cat) => `
      <td style="padding:18px;border:1px solid #e8e2d5;width:25%;vertical-align:top;">
        <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.22em;color:#8a7a5a;">${CATEGORY_LABEL[cat]}</div>
        <div style="font-family:Georgia,'Instrument Serif',serif;font-size:38px;line-height:1;margin-top:10px;color:${audit.scores[cat] >= 70 ? "#8a6a35" : "#1a1612"};">${audit.scores[cat]}</div>
      </td>`
    )
    .join("");

  const lighthouseBlock = audit.pagespeed
    ? `
    <tr>
      <td style="padding:24px 0 0 0;">
        <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#8a7a5a;border-top:1px solid #e8e2d5;padding-top:24px;">Lighthouse · Mobile</div>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:14px;">
          <tr>
            <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#6b6356;width:25%;">Performance<br/><span style="font-family:Georgia,serif;font-size:26px;color:#1a1612;letter-spacing:0;">${audit.pagespeed.performance}</span></td>
            <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#6b6356;width:25%;">Accessibility<br/><span style="font-family:Georgia,serif;font-size:26px;color:#1a1612;letter-spacing:0;">${audit.pagespeed.accessibility}</span></td>
            <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#6b6356;width:25%;">SEO<br/><span style="font-family:Georgia,serif;font-size:26px;color:#1a1612;letter-spacing:0;">${audit.pagespeed.seo}</span></td>
            <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#6b6356;width:25%;">Best Practices<br/><span style="font-family:Georgia,serif;font-size:26px;color:#1a1612;letter-spacing:0;">${audit.pagespeed.bestPractices}</span></td>
          </tr>
        </table>
        ${audit.pagespeed.lcp != null ? `<div style="font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#8a7a5a;margin-top:14px;">LCP ${(audit.pagespeed.lcp / 1000).toFixed(1)}s${audit.pagespeed.cls != null ? ` · CLS ${audit.pagespeed.cls.toFixed(3)}` : ""}${audit.pagespeed.tbt != null ? ` · TBT ${Math.round(audit.pagespeed.tbt)}ms` : ""}</div>` : ""}
      </td>
    </tr>`
    : "";

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4efe6;font-family:Georgia,'Instrument Serif',serif;color:#1a1612;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4efe6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:620px;background:#f4efe6;">
          <tr><td style="font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#8a7a5a;">— Sheenhaus · The Audit</td></tr>
          <tr><td style="padding-top:32px;font-family:Georgia,'Instrument Serif',serif;font-size:34px;line-height:1.15;letter-spacing:-0.02em;color:#1a1612;">Your audit for <em style="color:#8a6a35;">${escapeHtml(hostname)}</em>.</td></tr>
          <tr><td style="padding-top:40px;">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#8a7a5a;">Sheenhaus Score</div>
            <div style="font-family:Georgia,'Instrument Serif',serif;font-size:96px;line-height:1;letter-spacing:-0.04em;color:${audit.score >= 70 ? "#8a6a35" : "#1a1612"};margin-top:6px;">${audit.score}<span style="font-size:28px;color:#a8a094;"> / 100</span></div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#8a6a35;margin-top:10px;">${scoreBand(audit.score)}</div>
          </td></tr>
          <tr><td style="padding-top:32px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;">
              <tr>${categoryRows}</tr>
            </table>
          </td></tr>
          ${lighthouseBlock}
          ${
            audit.signs.length > 0
              ? `<tr><td style="padding-top:36px;">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#8a6a35;border-top:1px solid #e8e2d5;padding-top:24px;">Signs we found · ${audit.signs.length} of 12</div>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:10px;">${signRows}</table>
          </td></tr>`
              : ""
          }
          <tr><td style="padding:48px 0 0 0;border-top:1px solid #e8e2d5;margin-top:48px;">
            <div style="font-family:Georgia,'Instrument Serif',serif;font-size:22px;line-height:1.4;color:#1a1612;font-style:italic;">Want us to walk through this with you?</div>
            <div style="margin-top:16px;">
              <a href="https://cal.com/sheenhaus-yseo4c" style="display:inline-block;background:#8a6a35;color:#f4efe6;padding:14px 26px;font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;text-decoration:none;">Book a call →</a>
            </div>
          </td></tr>
          <tr><td style="padding-top:48px;font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.22em;color:#a8a094;">Sheenhaus · The studio for premium brands · sheenhaus.com</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Sheenhaus <hello@sheenhaus.com>";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 }
    );
  }

  let body: { email?: string; audit?: AuditPayload };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address" },
      { status: 400 }
    );
  }

  const audit = body.audit;
  if (
    !audit ||
    typeof audit.url !== "string" ||
    typeof audit.score !== "number" ||
    !audit.scores ||
    !Array.isArray(audit.signs)
  ) {
    return NextResponse.json(
      { error: "Audit data missing or malformed" },
      { status: 400 }
    );
  }

  const hostname = (() => {
    try {
      return new URL(audit.url).hostname;
    } catch {
      return audit.url;
    }
  })();

  const html = renderEmailHtml(audit);

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: `Your Sheenhaus audit · ${hostname} · ${audit.score}/100`,
    html,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Could not send the email" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, id: data?.id ?? null });
}
