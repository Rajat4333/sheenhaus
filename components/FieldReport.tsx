"use client";

/* The Field Report — section 3. Pulls the real jewellery-listed-2026
   dataset, shows the verdict in big numbers, animates a category
   bar chart, and ends with a CTA into the full report. Background
   is a slow Ken-Burns gold-macro still. */

import { motion, useInView } from "framer-motion";
import Image from "next/image";
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
    <section
      ref={ref}
      className="theme-clinical relative overflow-hidden"
      style={{ background: "var(--cl-bg)" }}
    >
      {/* Background image — slow drifting macro of gold work */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 ken-burns">
          <Image
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=2400&q=85&auto=format&fit=crop"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ filter: "saturate(0.85) brightness(1.05)" }}
            priority={false}
          />
        </div>
        {/* Cream wash to keep the background quiet */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.88) 50%, rgba(255,255,255,0.95) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 py-32 md:py-44">
        {/* Eyebrow */}
        <div
          className="text-[10px] uppercase tracking-[0.32em] mb-8 text-center"
          style={{ color: "var(--cl-ink-faint)" }}
        >
          <span style={{ color: "#8a6a35" }}>●</span> Field Report · Chapter 01 ·
          Jewellery
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
          India&rsquo;s listed jewellers built{" "}
          <em>₹{STATS.lakhCr} lakh crore</em> of offline brand. Their websites
          are not part of that work.
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
              at all.
            </p>
          </div>

          {/* Category bars */}
          <div className="space-y-7">
            <div
              className="text-[10px] uppercase tracking-[0.28em] mb-2"
              style={{ color: "var(--cl-ink-faint)" }}
            >
              Average across the sample
            </div>
            {CATEGORY_BARS.map((c, i) => (
              <Bar
                key={c.label}
                label={c.label}
                value={c.value}
                delay={0.3 + i * 0.12}
                active={inView}
              />
            ))}
            <div
              className="text-[11px] uppercase tracking-[0.22em] mt-6"
              style={{ color: "var(--cl-ink-faint)" }}
            >
              <span style={{ color: "#8a6a35" }}>{STATS.templatePct}%</span>{" "}
              built on templates · {STATS.missingSchemaPct}% invisible to AI
              assistants
            </div>
          </div>
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
            &ldquo;A category that has not noticed the web changed.&rdquo;
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
    </section>
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
