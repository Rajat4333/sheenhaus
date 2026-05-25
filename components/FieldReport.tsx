"use client";

/* The Field Report — section 3. Pulls the real jewellery-listed-2026
   dataset, shows the verdict in big numbers, animates a category
   bar chart, and ends with a CTA into the full report. Background
   is a slow Ken-Burns gold-macro still. */

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Real aggregate values from data/jewellery-listed-2026.json
// (computed once at build time; see app/state-of-premium/jewellery
// for the live-aggregated version).
const STATS = {
  n: 7,
  auditable: 6,
  median: 52,
  breaks60: 1,
  lakhCr: "4.4",
  templatePct: 100,
  exposedCmsPct: 67,
  missingSchemaPct: 100,
};

const CATEGORY_BARS = [
  { label: "Craft", value: 18 },
  { label: "Trust", value: 41 },
  { label: "Performance", value: 36 },
  { label: "AI Discoverability", value: 22 },
];

export default function FieldReport() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      className="theme-clinical relative overflow-hidden"
      style={{ background: "var(--cl-bg)" }}
      initial={{ opacity: 0, filter: "blur(14px)", y: 32 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.3, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {/* Quiet bronze halo — replaces the invisible gold-macro photo
          with a focused warm wash behind the median score. */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0) 65%)",
          filter: "blur(80px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 py-32 md:py-44">
        {/* Eyebrow */}
        <div
          className="text-[10px] uppercase tracking-[0.32em] mb-8 text-center"
          style={{ color: "var(--cl-ink-faint)" }}
        >
          <span style={{ color: "#8a6a35" }}>●</span> Field Report · One example
          · The jewellery houses
        </div>

        {/* Big claim */}
        <h2
          className="cl-display text-center mx-auto"
          style={{
            fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
            color: "var(--cl-ink)",
            lineHeight: 1.05,
            maxWidth: "20ch",
          }}
        >
          Most businesses build serious brands offline. Then{" "}
          <em>hand the digital surface</em> to whoever was cheapest.
        </h2>

        {/* The big number block */}
        <div className="mt-20 md:mt-28 grid md:grid-cols-[1fr_1.2fr] gap-16 md:gap-24 items-start">
          {/* Big median */}
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.28em]"
              style={{ color: "var(--cl-ink-faint)" }}
            >
              Median Sheenhaus Score
            </div>
            <div
              className="cl-display tabular-nums mt-3 flex items-baseline gap-2"
              style={{
                fontSize: "clamp(4.5rem, 12vw, 9rem)",
                color: "var(--cl-ink)",
                letterSpacing: "-0.035em",
                lineHeight: 0.95,
                paddingBottom: "0.04em",
              }}
            >
              <CountUp to={STATS.median} active={inView} />
              <span
                style={{
                  color: "var(--cl-ink-faint)",
                  fontSize: "0.22em",
                  letterSpacing: "-0.01em",
                }}
              >
                / 100
              </span>
            </div>
            <div
              className="text-[11px] uppercase tracking-[0.22em] mt-4"
              style={{ color: "#8a6a35" }}
            >
              {STATS.breaks60} of {STATS.n} houses break 60.
            </div>
            <p
              className="mt-8 text-[15px] leading-[1.85] max-w-md"
              style={{ color: "var(--cl-ink-soft)" }}
            >
              We ran the Sheenhaus Audit against every publicly-listed Indian
              jewellery company — seven houses, from Tanishq down to P. N.
              Gadgil. The country&rsquo;s largest house refuses to be audited
              at all. The same pattern shows up across the businesses we audit
              elsewhere — clinics, agencies, restaurants, D2C brands.
            </p>
          </div>

          {/* Category bars — flippable card. Front = diagnosis,
              back = prescription (what we'd fix if hired). Toggles
              on hover (desktop) or tap (touch). */}
          <DiagnosisCard active={inView} />
        </div>

        {/* Verdict line */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-24 md:mt-32 text-center"
        >
          <p
            className="cl-display italic mx-auto"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              color: "var(--cl-ink)",
              lineHeight: 1.25,
              maxWidth: "26ch",
            }}
          >
            &ldquo;Every business spends years building a brand. Then sends customers to a website that undoes it.&rdquo;
          </p>
          <div
            className="mt-6 text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            — The Sheenhaus Field Report, 2026
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/state-of-premium/jewellery"
            className="cta-primary"
          >
            Read the full report <span aria-hidden>→</span>
          </Link>
          <Link href="/audit" className="cta-ghost">
            Audit your site <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

/* ─── Animated bar ────────────────────────────────────────────── */
function Bar({
  label,
  value,
  delay,
  active,
}: {
  label: string;
  value: number;
  delay: number;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <span
        className="w-32 text-[12px]"
        style={{ color: "var(--cl-ink-soft)" }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-[3px] rounded-full overflow-hidden"
        style={{ background: "var(--cl-stroke-soft)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              value < 30
                ? "#c54a3a"
                : value < 50
                ? "#8a6a35"
                : value < 70
                ? "#3a8a6a"
                : "#10b981",
          }}
          initial={{ width: 0 }}
          animate={{ width: active ? `${value}%` : 0 }}
          transition={{ duration: 1.2, delay, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </div>
      <span
        className="w-10 text-right text-[12px] tabular-nums"
        style={{ color: "var(--cl-ink-soft)" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── DiagnosisCard — flippable specimen ─────────────────────
   Front = the category bar chart (diagnosis).
   Back = the list of fixes we'd ship if hired (prescription).
   Pure CSS 3D, no extra deps. Hover on desktop, tap on touch. */
function DiagnosisCard({ active }: { active: boolean }) {
  const [flipped, setFlipped] = useState(false);

  const FIXES = [
    { label: "Rebuild on Next.js + Vercel", impact: "Sub-1s LCP" },
    { label: "Hand-coded type system, three weights", impact: "Identity restored" },
    { label: "JSON-LD schema for AI assistants", impact: "Discoverable" },
    { label: "Automate post-purchase journey", impact: "5h/week saved" },
    { label: "Internal dashboard for inventory", impact: "Single source of truth" },
  ];

  return (
    <div
      className="diagnosis-card"
      data-flipped={flipped ? "true" : "false"}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((v) => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((v) => !v);
        }
      }}
      aria-label={
        flipped
          ? "Showing what we'd fix. Click to see the diagnosis again."
          : "Showing diagnosis. Click to see what we'd fix."
      }
    >
      {/* FRONT — diagnosis */}
      <div className="diagnosis-card-face diagnosis-card-front space-y-7">
        <div className="flex items-center justify-between">
          <div
            className="text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            Diagnosis · Average across the sample
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.28em]"
            style={{
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              color: "#8a6a35",
            }}
          >
            Flip →
          </div>
        </div>
        {CATEGORY_BARS.map((c, i) => (
          <Bar
            key={c.label}
            label={c.label}
            value={c.value}
            delay={0.3 + i * 0.12}
            active={active}
          />
        ))}
        <div
          className="text-[11px] uppercase tracking-[0.22em]"
          style={{ color: "var(--cl-ink-faint)" }}
        >
          <span style={{ color: "#8a6a35" }}>100%</span> built on templates ·
          100% invisible to AI assistants
        </div>
      </div>

      {/* BACK — prescription */}
      <div className="diagnosis-card-face diagnosis-card-back">
        <div className="flex items-center justify-between mb-6">
          <div
            className="text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            Prescription · What we&rsquo;d ship
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.28em]"
            style={{
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              color: "#8a6a35",
            }}
          >
            ← Diagnosis
          </div>
        </div>
        <ul className="space-y-4">
          {FIXES.map((f, i) => (
            <li
              key={i}
              className="grid grid-cols-[auto_1fr_auto] gap-4 items-baseline pb-3 border-b"
              style={{ borderColor: "var(--cl-stroke)" }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                  color: "#8a6a35",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-[14px]"
                style={{ color: "var(--cl-ink)" }}
              >
                {f.label}
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.22em] text-right"
                style={{ color: "var(--cl-ink-faint)" }}
              >
                {f.impact}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Number that counts up from 0 when it comes into view ─── */
function CountUp({ to, active }: { to: number; active: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active]);
  return <span>{n}</span>;
}
