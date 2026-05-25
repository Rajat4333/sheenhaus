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
          {/* Scanner ring — the audit, drawn. Twelve ticks for the
              twelve signs; the sweeping arc reads as "in progress". */}
          <ScannerRing />
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

/* ─── Scanner dial — 12 ticks for 12 signs, a slow sweeping needle ─ */
function ScannerRing() {
  const ticks = Array.from({ length: 12 });
  return (
    <motion.svg
      viewBox="0 0 100 100"
      width="80"
      height="80"
      className="block mx-auto mb-7"
      aria-hidden
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {/* Faint outer dial */}
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(26,22,18,0.14)" strokeWidth="0.6" />
      {/* Inner ring — quieter, anchors the needle visually */}
      <circle cx="50" cy="50" r="6" fill="none" stroke="rgba(138,106,53,0.25)" strokeWidth="0.6" />

      {/* Twelve ticks — coords rounded so SSR + client serialise identically */}
      {ticks.map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const inner = i % 3 === 0 ? 30 : 33.5;
        const x1 = (50 + Math.cos(a) * 38).toFixed(3);
        const y1 = (50 + Math.sin(a) * 38).toFixed(3);
        const x2 = (50 + Math.cos(a) * inner).toFixed(3);
        const y2 = (50 + Math.sin(a) * inner).toFixed(3);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(26,22,18,0.55)"
            strokeWidth={i % 3 === 0 ? "1.1" : "0.6"}
          />
        );
      })}

      {/* Sweeping needle — single bronze line, anchored at center, tip at outer ring */}
      <motion.line
        x1="50" y1="50" x2="50" y2="14"
        stroke="#8a6a35"
        strokeWidth="1.2"
        strokeLinecap="round"
        style={{ transformOrigin: "50px 50px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      {/* Center pin */}
      <circle cx="50" cy="50" r="1.6" fill="#1a1612" />
    </motion.svg>
  );
}
