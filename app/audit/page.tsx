"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";

type Category = "performance" | "craft" | "trust" | "discoverability";

type SignHit = {
  num: string;
  title: string;
  category: Category;
  severity: "low" | "medium" | "high";
};

type AuditResult = {
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

// Special response when someone audits sheenhaus.com itself
type SelfReferentialResponse = {
  selfReferential: true;
  url: string;
  message: string;
  followUp: string;
  aside?: string;
};

// Special response when we couldn't fetch the URL (blocked, 404, timeout, etc.)
type UnreachableResponse = {
  unreachable: true;
  url: string;
  reason: "blocked" | "not-found" | "server-error" | "unreachable" | "timeout";
  status?: number;
  headline: string;
  body: string;
};

type ApiResponse = AuditResult | SelfReferentialResponse | UnreachableResponse;

function isSelfReferential(r: ApiResponse): r is SelfReferentialResponse {
  return "selfReferential" in r && r.selfReferential === true;
}
function isUnreachable(r: ApiResponse): r is UnreachableResponse {
  return "unreachable" in r && r.unreachable === true;
}
function isAuditResult(r: ApiResponse): r is AuditResult {
  return !isSelfReferential(r) && !isUnreachable(r);
}

const CATEGORY_LABEL: Record<Category, string> = {
  performance: "Performance",
  craft: "Craft",
  trust: "Trust",
  discoverability: "AI Discoverability",
};

const CATEGORY_DESC: Record<Category, string> = {
  performance:
    "How quickly the site loads on a phone over cellular. Premium buyers feel this before they read anything.",
  craft:
    "Whether the design reads as commissioned for the brand, or assembled from a template.",
  trust:
    "How the site handles claims, social proof, and the contact moment. Restraint reads as confidence.",
  discoverability:
    "Whether AI models (ChatGPT, Claude, Gemini) can read your brand and recommend you in their answers.",
};

function scoreBand(n: number): string {
  if (n >= 85) return "Considered";
  if (n >= 70) return "Workmanlike";
  if (n >= 50) return "Drifting";
  if (n >= 30) return "Costing you clients";
  return "Critical";
}

function scoreColor(n: number): string {
  if (n >= 70) return "var(--color-accent)";
  if (n >= 50) return "var(--color-text-mid)";
  return "var(--color-text)";
}

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data);
      }
    } catch {
      setError("Could not reach the audit service. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Ambient warm orbs */}
      <div className="fixed top-[-300px] right-[-200px] w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(138,106,53,0.08)_0%,transparent_60%)] pointer-events-none z-0" />
      <div className="fixed bottom-[-400px] left-[-300px] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(45,74,58,0.06)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* MASTHEAD */}
      <section className="relative z-10 shell pt-40 sm:pt-48 md:pt-56 pb-12">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid whitespace-nowrap">
            The Audit
          </span>
        </div>
        <h1 className="display-serif font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[22ch]">
          Audit your website against the{" "}
          <em className="italic-accent">Twelve Signs</em>.
        </h1>
        <p className="text-text-mid text-[17px] max-w-2xl mt-10 leading-[1.8]">
          Paste your URL. We will fetch the site, run a real Lighthouse pass,
          and check it against the twelve patterns premium businesses
          unknowingly tolerate. You get a single score, a per-category
          breakdown, and the specific signs that apply &mdash; in under twenty
          seconds.
        </p>
      </section>

      {/* FORM */}
      <section className="relative z-10 shell pb-16">
        <form
          onSubmit={onSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-3xl"
        >
          <input
            // `text` not `url` — `type=url` triggers the browser's native
            // "Please enter a URL" validation when the user types
            // 'yourbrand.com' without a scheme. We normalise server-side
            // (and again here, defensively, when blocking the disabled state).
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="yourbrand.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            required
            className="flex-1 px-6 py-5 bg-bg-surface border border-border rounded-sm font-mono text-[14px] text-text placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors duration-500 disabled:opacity-60"
            aria-label="Website URL to audit"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="btn-bronze whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-bg animate-pulse-slow" />
                Auditing…
              </span>
            ) : (
              <>
                Run the audit <span aria-hidden>&rarr;</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.18em] text-text-mid max-w-3xl">
            <span style={{ color: "var(--color-accent)" }}>—</span> {error}
          </p>
        )}

        {loading && (
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-text-faint max-w-3xl">
            Fetching the site · Running Lighthouse · Cross-checking signs &mdash;
            this usually takes 15&ndash;30 seconds.
          </p>
        )}
      </section>

      {/* RESULT */}
      {result && isSelfReferential(result) && (
        <SelfReferentialDisplay result={result} />
      )}
      {result && isUnreachable(result) && (
        <UnreachableDisplay result={result} />
      )}
      {result && isAuditResult(result) && (
        <AuditResultDisplay result={result} />
      )}

      {/* CTA shown only when we have a normal audit result */}
      {result && isAuditResult(result) && (
        <section className="relative z-10 shell pt-32 md:pt-40 pb-24 md:pb-32 text-center">
          <div className="inline-flex items-center gap-3">
            <span className="w-6 h-px bg-accent" />
            <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid whitespace-nowrap">
              Want a deeper read?
            </span>
          </div>
          <h2 className="display-serif font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[22ch] mx-auto">
            Book a <em className="italic-accent">twenty-minute</em> conversation.
          </h2>
          <p className="text-text-mid text-[17px] max-w-xl mx-auto mt-8 leading-[1.8]">
            We will walk through your audit in person, name what we would do
            first, and give you an honest assessment &mdash; no deck, no
            proposal.
          </p>
          <div className="flex flex-col items-center gap-6 mt-14">
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-bronze"
            >
              Book a call <span aria-hidden>&rarr;</span>
            </a>
            <Link
              href="/signs"
              data-link-style="bronze"
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim"
            >
              ← Read the full diagnostic
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

/* ─── Self-referential display ─────────────────────────────────────── */
// Shown when someone tries to audit sheenhaus.com itself. Editorial
// non-answer; confident, not defensive.

function SelfReferentialDisplay({
  result,
}: {
  result: SelfReferentialResponse;
}) {
  return (
    <section className="relative z-10 shell pb-12 max-w-3xl">
      <div className="border-t border-border pt-16">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-faint whitespace-nowrap">
          On auditing the studio
        </span>
        <p className="display-serif font-serif text-[clamp(2rem,5vw,4rem)] leading-[1.12] tracking-[-0.025em] mt-8 text-text">
          <em className="italic-accent">{result.message}</em>
        </p>
        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-text-mid mt-10">
          — {result.followUp}
        </p>
        {result.aside && (
          <p className="font-serif italic-accent text-xl md:text-2xl leading-snug text-text-mid mt-10 max-w-xl">
            {result.aside}
          </p>
        )}
      </div>
    </section>
  );
}

/* ─── Unreachable display ──────────────────────────────────────────── */
// Shown when the audit could not fetch the URL — blocked by CDN/WAF,
// 404, timeout, etc. Reframes the failure as an invitation rather
// than a dead-end error.

function UnreachableDisplay({ result }: { result: UnreachableResponse }) {
  const eyebrowByReason: Record<UnreachableResponse["reason"], string> = {
    blocked: "Audit blocked at the firewall",
    "not-found": "URL not found",
    "server-error": "Site responded with an error",
    unreachable: "Site could not be reached",
    timeout: "Site took too long to respond",
  };
  return (
    <section className="relative z-10 shell pb-12 max-w-3xl">
      <div className="border-t border-border pt-16">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-faint whitespace-nowrap">
          {eyebrowByReason[result.reason]}
          {result.status ? ` · HTTP ${result.status}` : ""}
        </span>
        <h2 className="display-serif font-serif text-[clamp(2rem,5vw,4rem)] leading-[1.12] tracking-[-0.025em] mt-8 max-w-[22ch] text-text">
          <em className="italic-accent">{result.headline}</em>
        </h2>
        <p className="text-text-mid text-[17px] mt-10 leading-[1.8] max-w-2xl">
          {result.body}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim mt-10">
          URL · {new URL(result.url).hostname}
        </p>

        <div className="flex flex-col sm:flex-row items-start gap-5 mt-10">
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-bronze"
          >
            Book a call <span aria-hidden>&rarr;</span>
          </a>
          <Link
            href="/signs"
            data-link-style="bronze"
            className="inline-flex items-center font-mono text-[11px] uppercase tracking-[0.22em] text-text-mid py-5"
          >
            Read the diagnostic instead &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Result display ────────────────────────────────────────────────── */

function AuditResultDisplay({ result }: { result: AuditResult }) {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || emailSending) return;
    setEmailSending(true);
    setEmailError(null);
    try {
      const res = await fetch("/api/audit/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), audit: result }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEmailError(
          data.error ||
            "We could not send the report. Try again, or book a call and we'll send it manually."
        );
      } else {
        setEmailSent(true);
      }
    } catch {
      setEmailError(
        "We could not reach the email service. Try again in a moment."
      );
    } finally {
      setEmailSending(false);
    }
  };

  const isHtmlOnly = result.pagespeed === null;

  return (
    <section className="relative z-10 shell pb-12 max-w-5xl">
      {/* Optional banner when Lighthouse couldn't run — usually because
          PAGESPEED_API_KEY isn't set, or because PageSpeed rate-limited us. */}
      {isHtmlOnly && (
        <div className="border-t border-border pt-8 mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-faint max-w-3xl leading-[1.8]">
            <span style={{ color: "var(--color-accent)" }}>—</span> HTML-only
            audit · Lighthouse mobile data was not available this run. The
            score below reflects what we can detect from the markup; the full
            audit (performance, accessibility, mobile-friendliness) requires a
            twenty-minute conversation.
          </p>
        </div>
      )}

      {/* Headline score */}
      <div className="border-t border-border pt-12">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-faint">
          Sheenhaus Score · {new URL(result.url).hostname}
        </span>
        <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start mt-8">
          <div>
            <div
              className="display-serif font-serif text-[clamp(6rem,18vw,14rem)] leading-none tracking-[-0.04em] tabular-nums"
              style={{ color: scoreColor(result.score) }}
            >
              {result.score}
              <span className="text-text-faint text-[0.4em] align-top ml-3">
                / 100
              </span>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent mt-4">
              {scoreBand(result.score)}
            </p>
          </div>
          <div className="md:pt-6">
            <p className="font-serif italic-accent text-2xl md:text-3xl leading-snug text-text">
              {result.score >= 70
                ? "Your site is doing the work. A few patterns to address."
                : result.score >= 50
                ? "The bones are there. The details are costing you."
                : "Your offline brand already outruns this. Time to close the gap."}
            </p>
            <p className="text-text-mid text-[15px] leading-[1.85] mt-6 max-w-xl">
              {result.signs.length === 0
                ? "We did not detect any of the twelve patterns from our diagnostic. Lighthouse covers the rest."
                : `We found ${result.signs.length} of 12 patterns from our diagnostic. Each is detailed below.`}
            </p>
          </div>
        </div>
      </div>

      {/* Per-category breakdown */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border mt-16 rounded-sm overflow-hidden">
        {(Object.keys(result.scores) as Category[]).map((cat) => (
          <div key={cat} className="bg-bg p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
              {CATEGORY_LABEL[cat]}
            </span>
            <div
              className="display-serif font-serif text-5xl tracking-[-0.03em] leading-none mt-4 tabular-nums"
              style={{ color: scoreColor(result.scores[cat]) }}
            >
              {result.scores[cat]}
            </div>
            <p className="text-[13px] text-text-mid leading-[1.7] mt-4">
              {CATEGORY_DESC[cat]}
            </p>
          </div>
        ))}
      </div>

      {/* PageSpeed details (if available) */}
      {result.pagespeed && (
        <div className="mt-12 border-t border-border pt-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-faint">
            Lighthouse · Mobile
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
            {[
              { label: "Performance", v: result.pagespeed.performance },
              { label: "Accessibility", v: result.pagespeed.accessibility },
              { label: "SEO", v: result.pagespeed.seo },
              { label: "Best Practices", v: result.pagespeed.bestPractices },
            ].map(({ label, v }) => (
              <div key={label}>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-mid">
                  {label}
                </div>
                <div
                  className="font-serif text-3xl mt-1 tabular-nums"
                  style={{ color: scoreColor(v) }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
          {result.pagespeed.lcp != null && (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim mt-6">
              LCP {(result.pagespeed.lcp / 1000).toFixed(1)}s ·{" "}
              {result.pagespeed.cls != null &&
                `CLS ${result.pagespeed.cls.toFixed(3)} · `}
              {result.pagespeed.tbt != null &&
                `TBT ${Math.round(result.pagespeed.tbt)}ms`}
            </p>
          )}
        </div>
      )}

      {/* Signs found */}
      {result.signs.length > 0 && (
        <div className="mt-16">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            Signs we found
          </span>
          <ul className="divide-y divide-border mt-6">
            {result.signs.map((s) => (
              <li
                key={s.num}
                className="grid grid-cols-[40px_1fr_auto] gap-6 py-5 items-baseline"
              >
                <span className="font-mono text-[11px] tracking-[0.18em] text-text-dim">
                  {s.num}
                </span>
                <span className="font-serif text-lg md:text-xl leading-snug text-text">
                  {s.title}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.22em] whitespace-nowrap"
                  style={{
                    color:
                      s.severity === "high"
                        ? "var(--color-accent)"
                        : "var(--color-text-mid)",
                  }}
                >
                  {s.severity}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/signs"
            data-link-style="bronze"
            className="inline-block mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-text-mid"
          >
            Read the full essay on each sign &rarr;
          </Link>
        </div>
      )}

      {/* Soft email gate — optional emailed report */}
      <div className="mt-16 border-t border-border pt-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-faint">
          Want this in your inbox?
        </span>
        {emailSent ? (
          <p className="font-serif italic-accent text-xl text-text mt-4 max-w-xl leading-snug">
            Sent. The report is on its way to{" "}
            <span className="text-accent">{email}</span>.
          </p>
        ) : (
          <>
            <form
              onSubmit={onEmailSubmit}
              className="flex flex-col sm:flex-row gap-3 mt-4 max-w-2xl"
            >
              <input
                type="email"
                placeholder="you@yourbrand.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={emailSending}
                className="flex-1 px-5 py-4 bg-bg-surface border border-border rounded-sm font-mono text-[13px] text-text placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors duration-500 disabled:opacity-60"
              />
              <button
                type="submit"
                className="btn-ghost whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!email.trim() || emailSending}
              >
                {emailSending ? "Sending…" : "Email the report"}
              </button>
            </form>
            {emailError && (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-text-mid max-w-2xl">
                <span style={{ color: "var(--color-accent)" }}>—</span>{" "}
                {emailError}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
