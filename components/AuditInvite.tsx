"use client";

/* The Audit invite — section 5. A single beat: big claim, a stylised
   input field that mimics the audit on /audit, and a primary CTA.
   On submit we route to /audit with the typed URL preserved in the
   hash, so the audit page can prefill (or the visitor can retype). */

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* Strip any scheme the user pasted ("https://", "http://", or
   typo'd variants like "https:/", "http:") plus leading "//" and
   "www.". The visible "https://" prefix label means the field
   always reads as the bare host; the server adds the scheme back.

   Two flavours:
   - stripScheme: lossless on the tail (keeps trailing space the
     user may still be typing). Used in onChange.
   - normalise: also trims surrounding whitespace. Used at submit. */
function stripScheme(raw: string): string {
  return raw
    .replace(/^\s*https?:?\/{0,2}/i, "")
    .replace(/^\/+/, "")
    .replace(/^www\./i, "");
}
function normalise(raw: string): string {
  return stripScheme(raw).trim();
}

export default function AuditInvite() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = normalise(value);
    if (!cleaned) return;
    try {
      sessionStorage.setItem("sh:audit-url", cleaned);
    } catch {}
    router.push("/audit");
  };

  return (
    <section
      className="theme-clinical relative overflow-hidden"
      style={{ background: "var(--cl-bg)" }}
    >
      {/* Soft bronze glow behind */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(245,215,175,0.35) 0%, rgba(245,215,175,0) 70%)",
          filter: "blur(70px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-[900px] mx-auto px-6 py-32 md:py-48 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {/* Audit specimen — a quiet preview of what a real audit
              result looks like. 12 vertical ticks for the 12 signs,
              eight detected (tall + bronze), four clean (short + grey).
              The numbers below are the same shape every visitor will
              see when they paste their own URL. */}
          <AuditSpecimen />
          <div
            className="text-[10px] uppercase tracking-[0.32em] mb-6"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            <span style={{ color: "#8a6a35" }}>●</span> Run it on your own site
          </div>
          <h2
            className="cl-display"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: "var(--cl-ink)",
              lineHeight: 1.05,
              letterSpacing: "-0.028em",
            }}
          >
            Twelve signs. One score. <em>Twenty seconds.</em>
          </h2>
          <p
            className="mt-6 text-[15px] max-w-lg mx-auto"
            style={{ color: "var(--cl-ink-soft)" }}
          >
            We&rsquo;ve already run this against India&rsquo;s listed jewellery
            houses. See where your own site sits.
          </p>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-14 mx-auto inline-flex flex-col items-stretch"
          style={{ maxWidth: "min(640px, calc(100vw - 48px))" }}
        >
          <div className="audit-field group">
            <span
              className="audit-field-prefix"
              aria-hidden
              style={{ color: "var(--cl-ink-faint)" }}
            >
              https://
            </span>
            <input
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="yourbrand.com"
              value={value}
              maxLength={253}
              onChange={(e) => {
                // Always strip schemes/www as the user types or pastes
                // so the visible field reads as just the host. Doesn't
                // trim trailing whitespace — that would fight typing.
                setValue(stripScheme(e.target.value));
              }}
              className="audit-field-input"
              aria-label="Your website URL"
              size={Math.max(value.length || 14, 14)}
            />
            <button
              type="submit"
              disabled={!value.trim()}
              className="audit-field-btn"
              aria-label="Run audit"
            >
              <span>Run audit</span>
              <span aria-hidden>→</span>
            </button>
          </div>
          <div
            className="mt-4 text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            No email required · Results in your browser
          </div>
        </motion.form>
      </div>
    </section>
  );
}

/* ─── Audit specimen — a quiet sample of an audit result ─────
   12 vertical bars: 8 are tall + bronze (signs detected), 4 are
   short + grey (signs clean). A score number, a verdict word, a
   /100 denominator. Animates in once on scroll. Reads as "this
   is the actual shape of the deliverable". */
function AuditSpecimen() {
  // Heights per bar (0-1). Tall+bronze = sign detected, short+grey = clean.
  // Mix is intentionally roughly average for the jewellery dataset.
  const BARS: Array<[number, boolean]> = [
    [0.85, true],   // 01 nav
    [0.72, true],   // 02 popup
    [0.18, false],  // 03 video hero — clean
    [0.78, true],   // 04 stock photos
    [0.62, true],   // 05 url
    [0.20, false],  // 06 weights — clean
    [0.55, true],   // 07 form
    [0.18, false],  // 08 solutions — clean
    [0.50, true],   // 09 testimonials
    [0.92, true],   // 10 performance — worst
    [0.22, false],  // 11 repeated hero — clean
    [0.88, true],   // 12 AI discoverability
  ];
  const detected = BARS.filter(([, b]) => b).length;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
      className="mx-auto mb-10 inline-flex flex-col items-center gap-4"
      style={{
        padding: "20px 28px",
        background: "rgba(255,253,248,0.55)",
        border: "1px solid var(--cl-stroke)",
        borderRadius: 8,
        backdropFilter: "blur(6px)",
        boxShadow: "0 8px 28px -16px rgba(58,42,20,0.18)",
      }}
    >
      {/* Top caption */}
      <div className="text-[9px] uppercase tracking-[0.26em] text-center"
           style={{ color: "var(--cl-ink-faint)", fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
        Audit · Specimen <span style={{ opacity: 0.5 }}>·</span> SH-2026-01
      </div>

      {/* The 12 bars */}
      <div className="flex items-end gap-[6px]" style={{ height: 56 }}>
        {BARS.map(([h, hit], i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.55,
              delay: 0.25 + i * 0.045,
              ease: [0.2, 0.7, 0.2, 1],
            }}
            style={{
              display: "inline-block",
              width: 5,
              height: `${Math.round(h * 56)}px`,
              background: hit ? "#8a6a35" : "rgba(26,22,18,0.16)",
              borderRadius: 1,
              transformOrigin: "bottom",
            }}
            aria-hidden
          />
        ))}
      </div>

      {/* Score + verdict row */}
      <div className="flex items-baseline gap-3 mt-1">
        <motion.span
          className="cl-display tabular-nums leading-none"
          style={{
            fontSize: 30,
            color: "var(--cl-ink)",
            letterSpacing: "-0.03em",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          52
        </motion.span>
        <span className="text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "var(--cl-ink-faint)", fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
          / 100 · Drifting
        </span>
      </div>

      {/* Bottom caption */}
      <div className="text-[9px] uppercase tracking-[0.26em]"
           style={{ color: "#8a6a35", fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
        {detected} of {BARS.length} signs detected
      </div>
    </motion.figure>
  );
}

