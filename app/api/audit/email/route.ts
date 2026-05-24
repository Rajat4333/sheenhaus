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

  // ─── Reusable cell — two-row structure, fixed inner heights so that
  //    labels and numbers always sit on the same baseline regardless of
  //    label length or number digit count. This is the spine of the
  //    report's visual symmetry.
  const cell = ({
    label,
    value,
    accent = false,
  }: {
    label: string;
    value: string | number;
    accent?: boolean;
  }) => `
      <td align="center" valign="middle" style="padding:24px 8px;border:1px solid #e8e2d5;width:25%;background:#f8f4eb;">
        <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.22em;color:#8a7a5a;height:14px;line-height:14px;">${escapeHtml(label)}</div>
        <div style="font-family:Georgia,'Instrument Serif',serif;font-size:36px;line-height:36px;height:42px;letter-spacing:-0.02em;color:${accent ? "#8a6a35" : "#1a1612"};margin-top:14px;">${value}</div>
      </td>`;

  const categoryCells = (Object.keys(audit.scores) as Category[])
    .map((cat) =>
      cell({
        label: CATEGORY_LABEL[cat],
        value: audit.scores[cat],
        accent: audit.scores[cat] >= 70,
      })
    )
    .join("");

  const signRows = audit.signs
    .map(
      (s) => `
      <tr>
        <td valign="middle" style="padding:16px 0;border-bottom:1px solid #e8e2d5;font-family:'IBM Plex Mono',monospace;font-size:11px;color:#8a7a5a;letter-spacing:0.12em;width:48px;text-align:left;">${s.num}</td>
        <td valign="middle" style="padding:16px 0;border-bottom:1px solid #e8e2d5;font-family:Georgia,'Instrument Serif',serif;font-size:17px;color:#1a1612;line-height:1.5;text-align:left;">${escapeHtml(s.title)}</td>
        <td valign="middle" style="padding:16px 0;border-bottom:1px solid #e8e2d5;font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:${s.severity === "high" ? "#8a6a35" : "#6b6356"};text-align:right;width:80px;">${s.severity}</td>
      </tr>`
    )
    .join("");

  const lighthouseBlock = audit.pagespeed
    ? `
    <tr><td style="padding-top:48px;" align="center">
      <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#8a7a5a;padding-bottom:18px;">Lighthouse · Mobile</div>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0;">
        <tr>
          ${cell({ label: "Performance", value: audit.pagespeed.performance, accent: audit.pagespeed.performance >= 70 })}
          ${cell({ label: "Accessibility", value: audit.pagespeed.accessibility, accent: audit.pagespeed.accessibility >= 70 })}
          ${cell({ label: "SEO", value: audit.pagespeed.seo, accent: audit.pagespeed.seo >= 70 })}
          ${cell({ label: "Best Practices", value: audit.pagespeed.bestPractices, accent: audit.pagespeed.bestPractices >= 70 })}
        </tr>
      </table>
      ${
        audit.pagespeed.lcp != null
          ? `<div style="font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.22em;color:#8a7a5a;margin-top:18px;text-align:center;">LCP ${(audit.pagespeed.lcp / 1000).toFixed(1)}s${audit.pagespeed.cls != null ? `  ·  CLS ${audit.pagespeed.cls.toFixed(3)}` : ""}${audit.pagespeed.tbt != null ? `  ·  TBT ${Math.round(audit.pagespeed.tbt)}ms` : ""}</div>`
          : ""
      }
    </td></tr>`
    : "";

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4efe6;font-family:Georgia,'Instrument Serif',serif;color:#1a1612;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4efe6;padding:48px 20px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:620px;background:#f4efe6;">

          <!-- ── Eyebrow ── -->
          <tr><td align="center" style="font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#8a7a5a;padding-bottom:8px;">— Sheenhaus · The Audit —</td></tr>

          <!-- ── Headline ── -->
          <tr><td align="center" style="padding-top:24px;font-family:Georgia,'Instrument Serif',serif;font-size:32px;line-height:1.2;letter-spacing:-0.02em;color:#1a1612;">Your audit for <em style="color:#8a6a35;">${escapeHtml(hostname)}</em>.</td></tr>

          <!-- ── Hairline ── -->
          <tr><td style="padding:40px 0;"><div style="height:1px;background:#e8e2d5;width:60px;margin:0 auto;"></div></td></tr>

          <!-- ── Score ── -->
          <tr><td align="center">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#8a7a5a;">Sheenhaus Score</div>
            <div style="font-family:Georgia,'Instrument Serif',serif;font-size:96px;line-height:1;letter-spacing:-0.04em;color:${audit.score >= 70 ? "#8a6a35" : "#1a1612"};margin-top:12px;">${audit.score}<span style="font-size:28px;color:#a8a094;letter-spacing:0;"> / 100</span></div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#8a6a35;margin-top:14px;">${scoreBand(audit.score)}</div>
          </td></tr>

          <!-- ── Category breakdown ── -->
          <tr><td style="padding-top:48px;" align="center">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#8a7a5a;padding-bottom:18px;">By category</div>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0;">
              <tr>${categoryCells}</tr>
            </table>
          </td></tr>

          ${lighthouseBlock}

          ${
            audit.signs.length > 0
              ? `<tr><td style="padding-top:48px;" align="center">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:#8a6a35;padding-bottom:8px;">Signs we found · ${audit.signs.length} of 12</div>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:10px;border-top:1px solid #e8e2d5;">${signRows}</table>
          </td></tr>`
              : ""
          }

          <!-- ── Hairline before CTA ── -->
          <tr><td style="padding:56px 0 32px 0;"><div style="height:1px;background:#e8e2d5;width:60px;margin:0 auto;"></div></td></tr>

          <!-- ── CTA ── -->
          <tr><td align="center">
            <div style="font-family:Georgia,'Instrument Serif',serif;font-size:22px;line-height:1.4;color:#1a1612;font-style:italic;max-width:380px;margin:0 auto;">Want us to walk through this with you?</div>
            <div style="margin-top:24px;">
              <a href="https://cal.com/sheenhaus-yseo4c" style="display:inline-block;background:#8a6a35;color:#f4efe6;padding:14px 28px;font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;text-decoration:none;">Book a call →</a>
            </div>
          </td></tr>

          <!-- ── Footer ── -->
          <tr><td align="center" style="padding-top:56px;font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.22em;color:#a8a094;">Sheenhaus · The studio for premium brands · sheenhaus.com</td></tr>

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
