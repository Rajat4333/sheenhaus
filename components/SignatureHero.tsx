"use client";

/* Signature hero — static cream background, a silent macro video
   masked inside the headline's emphasis word, three live counters
   pulled from the real jewellery audit dataset, and two clear CTAs.
   Built to be the visitor's first 6 seconds. */

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";

const NAV = [
  { href: "/state-of-premium/jewellery", label: "WORK" },
  { href: "/signs", label: "DIAGNOSTIC" },
  { href: "/audit", label: "AUDIT" },
  { href: "/concepts", label: "THESES" },
];

export default function SignatureHero() {
  return (
    <section
      className="theme-clinical relative min-h-screen w-full overflow-hidden"
      style={{ background: "var(--cl-bg)" }}
    >

      {/* Floating pill nav */}
      <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="inline-flex items-center gap-1 px-2 py-2 rounded-full bg-white/85 backdrop-blur-md border"
          style={{
            borderColor: "var(--cl-stroke)",
            boxShadow: "0 4px 24px -8px rgba(0,0,0,0.06)",
          }}
        >
          <Link href="/" className="inline-flex items-center gap-2 pl-3 pr-3 py-1.5">
            <span
              className="inline-block w-3.5 h-3.5 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 60%, #c9b89e 100%)",
              }}
              aria-hidden="true"
            />
            <span className="text-sm tracking-tight" style={{ color: "var(--cl-ink)" }}>
              sheenhaus
            </span>
          </Link>
          <span className="w-px h-4 mx-1" style={{ background: "var(--cl-stroke)" }} />
          <div className="hidden md:flex items-center gap-0.5">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase rounded-full transition-colors duration-300 hover:bg-black/[0.03]"
                style={{ color: "var(--cl-ink-soft)" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 px-4 py-1.5 text-xs rounded-full transition-opacity hover:opacity-85"
            style={{ background: "var(--cl-pill-bg)", color: "var(--cl-pill-ink)" }}
          >
            Book a call
          </a>
        </motion.div>
      </nav>

      {/* Hero block — centered single column */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-6 pt-28 md:pt-32 pb-16 text-center">
        {/* Tag pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          <Tag glyph="▲" label="AI Discoverability" />
          <Tag glyph="✦" label="Hand-coded" />
          <Tag glyph="◐" label="Now booking Q3 2026" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
          className="cl-display text-[clamp(2.25rem,5.5vw,4.75rem)] leading-[1.05] tracking-[-0.028em]"
          style={{ color: "var(--cl-ink)" }}
        >
          <span className="block">A digital studio for brands whose</span>
          <span className="block">
            <em>offline</em> presence already <ShimmerWord word="outruns" />
          </span>
          <span className="block">their site.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-7 text-[15px] md:text-base max-w-xl mx-auto"
          style={{ color: "var(--cl-ink-soft)" }}
        >
          A boutique studio crafting hand-coded, AI-discoverable websites for
          premium businesses. Mumbai · Dubai · New York · London.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/audit" className="cta-primary">
            Audit your site <span aria-hidden>→</span>
          </Link>
          <Link href="/state-of-premium/jewellery" className="cta-ghost">
            Read the field report <span aria-hidden>→</span>
          </Link>
        </motion.div>

        {/* Counters row — centered */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-16 md:mt-20 mx-auto max-w-[920px]"
        >
          <div
            className="text-[10px] uppercase tracking-[0.28em] mb-8"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            <span style={{ color: "#8a6a35" }}>●</span> Live from the field —
            India&rsquo;s listed jewellery houses, audited
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-12">
            <Trophy value={7} suffix="" label="Listed houses" delay={1.4} />
            <Trophy value={52} suffix="/100" label="Median score" delay={1.6} />
            <Trophy value={1} suffix=" of 7" label="Breaks 60" delay={1.8} />
          </div>
          <div className="mt-8">
            <Link
              href="/state-of-premium/jewellery"
              className="text-[11px] tracking-[0.22em] uppercase underline-offset-4 hover:underline transition-colors"
              style={{ color: "#8a6a35" }}
            >
              ₹4.4 lakh crore of offline brand · read the verdict →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.28em] uppercase flex flex-col items-center gap-3"
        style={{ color: "var(--cl-ink-faint)" }}
      >
        <span>Scroll</span>
        <span className="w-px h-10 bg-current opacity-40 animate-pulse-slow" />
      </motion.div>
    </section>
  );
}

/* ───────── Tag pill — quiet, fixed glyph + label ───────────── */
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

/* ───────── Shimmer word ───────────────────────────────────────
   A slow bronze→cream→bronze gradient drifts across the word's
   letterforms via background-clip: text. The Hermès / Loro Piana
   "gold catching light" trick — premium and instantly readable. */
function ShimmerWord({ word }: { word: string }) {
  return <span className="shimmer-word">{word}</span>;
}

/* ───────── Trophy — big counted number + label ───────────────── */
function Trophy({
  value,
  suffix,
  label,
  delay,
  align = "center",
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  align?: "left" | "center";
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
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
  }, [value, delay]);

  return (
    <div className={align === "left" ? "text-left" : "text-center"}>
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
          style={{ color: "var(--cl-ink-faint)", letterSpacing: "-0.02em" }}
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

