"use client";

/* StudioIntro — the cream landing strip immediately under the
 * cinematic hero. Holds the conversion CTAs (audit / field report),
 * the studio stats counter row, and the three positioning tags.
 *
 * Lives in the existing clinical theme so the rest of the site looks
 * unchanged. Acts as the visual handoff from the dark cinematic
 * hero into ProcessDiagram below. */

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function StudioIntro() {
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setStatsActive(true);
      },
      { threshold: 0.25 }
    );
    const el = document.getElementById("studio-stats");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="theme-clinical relative"
      style={{ background: "var(--cl-bg)" }}
    >
      <div className="max-w-[1100px] mx-auto px-6 pt-20 md:pt-28 pb-20 md:pb-28">
        {/* Tag pills — restate the positioning */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
        >
          <Tag glyph="▲" label="Considered" />
          <Tag glyph="✦" label="Automated" />
          <Tag glyph="◐" label="AI-native" />
        </motion.div>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="text-center text-[15px] md:text-base max-w-xl mx-auto"
          style={{ color: "var(--cl-ink-soft)" }}
        >
          Cinematic websites. Workflows that run themselves. AI built into the
          surface. Hand-coded for businesses that refuse to look like everyone
          else.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/audit" className="cta-primary">
            Audit your site <span aria-hidden>→</span>
          </Link>
          <Link
            href="/state-of-premium/jewellery"
            className="cta-ghost"
          >
            Read the field report <span aria-hidden>→</span>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          id="studio-stats"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.95, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-16 md:mt-20"
        >
          <div
            className="text-[10px] uppercase tracking-[0.28em] mb-7 text-center"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            <span style={{ color: "#8a6a35" }}>●</span> The studio
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-12">
            <Trophy
              value={3}
              suffix=""
              label="Engagements at a time"
              delay={0}
              active={statsActive}
            />
            <Trophy
              value={14}
              suffix=" days"
              label="From brief to launch"
              delay={0.2}
              active={statsActive}
            />
            <Trophy
              value={100}
              suffix="%"
              label="Hand-coded"
              delay={0.4}
              active={statsActive}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Tag({ glyph, label }: { glyph: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-[0.18em] uppercase"
      style={{
        background: "var(--cl-tag-bg)",
        color: "var(--cl-ink-soft)",
        border: "1px solid var(--cl-stroke)",
      }}
    >
      <span style={{ color: "var(--cl-ink)", opacity: 0.6 }}>{glyph}</span>
      <span>{label}</span>
    </span>
  );
}

function Trophy({
  value,
  suffix,
  label,
  delay,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  active: boolean;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now() + delay * 1000;
    const dur = 1400;
    const tick = (t: number) => {
      if (t < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, delay, active]);

  return (
    <div className="text-center">
      <div
        className="cl-display tabular-nums leading-none"
        style={{
          fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
          color: "var(--cl-ink)",
          letterSpacing: "-0.035em",
        }}
      >
        {n}
        <span
          className="text-base md:text-lg"
          style={{
            color: "var(--cl-ink-faint)",
            letterSpacing: "-0.02em",
          }}
        >
          {suffix}
        </span>
      </div>
      <div
        className="mt-3 text-[10px] uppercase tracking-[0.22em]"
        style={{
          color: "var(--cl-ink-faint)",
          fontFamily: "var(--font-ibm-plex-mono), monospace",
        }}
      >
        {label}
      </div>
    </div>
  );
}
