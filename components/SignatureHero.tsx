"use client";

/* Hero — taut single-screen pitch.
   Orb + headline + CTAs + stats, all visible without scrolling.
   No sticky scrub, no 300vh wrapper — scroll lands straight into
   ProcessDiagram which carries the storytelling. */

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";

/* Nav sphere — 14 px dot. 2D gradient until three.js hydrates. */
const WordmarkSphere = dynamic(() => import("@/components/WordmarkSphere"), {
  ssr: false,
  loading: () => (
    <span
      className="inline-block w-3.5 h-3.5 rounded-full"
      style={{
        background:
          "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 60%, #c9b89e 100%)",
      }}
      aria-hidden="true"
    />
  ),
});

/* Hero orbital — layered 3D rig (pearl core + gold ring + satellites + particles). */
const HeroOrbital = dynamic(() => import("@/components/HeroOrbital"), {
  ssr: false,
  loading: () => (
    <span
      className="block rounded-full"
      style={{
        width: 380,
        height: 380,
        background:
          "radial-gradient(circle at 35% 32%, #ede0c8 0%, #c9b89e 40%, #8a6a35 72%, #3a2a18 100%)",
        opacity: 0.45,
      }}
      aria-hidden="true"
    />
  ),
});

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";

const NAV = [
  { href: "/state-of-premium/jewellery", label: "WORK" },
  { href: "/signs", label: "DIAGNOSTIC" },
  { href: "/audit", label: "AUDIT" },
  { href: "/concepts", label: "THESES" },
];

export default function SignatureHero() {
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Mouse parallax for sphere tilt ─────────────────────── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sphereTiltX = useSpring(useTransform(mouseY, [-400, 400], [8, -8]), { stiffness: 50, damping: 18 });
  const sphereTiltY = useSpring(useTransform(mouseX, [-600, 600], [-8, 8]), { stiffness: 50, damping: 18 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Stats counter — fires on mount once entrance settles ── */
  const [statsActive, setStatsActive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStatsActive(true), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="theme-clinical relative overflow-hidden"
      style={{ minHeight: "100vh", background: "var(--cl-bg)" }}
    >
      {/* Ambient drifting mesh blobs */}
      <div className="cl-mesh absolute inset-0" aria-hidden>
        <span />
      </div>

      {/* Slow iridescent conic shimmer */}
      <div
        className="sheen-conic absolute inset-0 pointer-events-none"
        style={{ opacity: 0.45 }}
        aria-hidden
      />

      {/* ── Floating pill nav ──────────────────────────────── */}
      <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="inline-flex items-center gap-1 px-2 py-2 rounded-full bg-white/85 backdrop-blur-md border"
          style={{
            borderColor: "var(--cl-stroke)",
            boxShadow: "0 4px 24px -8px rgba(0,0,0,0.06)",
          }}
        >
          <Link
            href="/"
            data-magnetic
            className="inline-flex items-center gap-2 pl-3 pr-3 py-1.5"
          >
            <WordmarkSphere size={14} />
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
                data-magnetic
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
            data-magnetic
            className="ml-1 px-4 py-1.5 text-xs rounded-full transition-opacity hover:opacity-85"
            style={{ background: "var(--cl-pill-bg)", color: "var(--cl-pill-ink)" }}
          >
            Book a call
          </a>
        </motion.div>
      </nav>

      {/* ── Main content column ────────────────────────────── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 text-center gap-0">

        {/* Hero orb — atmospheric halo + parallax tilt */}
        <div className="mb-6 md:mb-8 relative flex items-center justify-center">
          {/* Soft atmospheric halo — bleeds beyond the canvas */}
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              width: 560,
              height: 560,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(220,200,160,0.32) 0%, rgba(210,195,170,0.12) 40%, transparent 72%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "cl-halo-drift 10s ease-in-out infinite",
            }}
          />
          {/* Second outer glow ring */}
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              width: 760,
              height: 760,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(200,215,230,0.10) 0%, transparent 65%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* SH monogram — the hero centerpiece. Mouse parallax tilt +
              gentle drift float. No orbital rig competing for attention;
              the brand mark stands alone. */}
          <MonogramMark
            rotateX={sphereTiltX}
            rotateY={sphereTiltY}
          />
        </div>

        {/* Tag pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          className="inline-flex flex-wrap items-center justify-center gap-2 mb-8"
        >
          <Tag glyph="▲" label="Considered" />
          <Tag glyph="✦" label="Automated" />
          <Tag glyph="◐" label="AI-native" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
          className="cl-display text-[clamp(2.25rem,5.5vw,4.75rem)] leading-[1.05] tracking-[-0.028em]"
          style={{ color: "var(--cl-ink)" }}
        >
          <span className="block">End-to-end tech for businesses</span>
          <span className="block">
            with <em>big</em> <ShimmerWord word="ambition" />.
          </span>
        </motion.h1>

        {/* Subhead + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.72, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex flex-col items-center gap-7 mt-7"
        >
          <p
            className="text-[15px] md:text-base max-w-xl"
            style={{ color: "var(--cl-ink-soft)" }}
          >
            Cinematic websites. Workflows that run themselves. AI built into the
            surface. Hand-coded for businesses that refuse to look like everyone else.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/audit" data-magnetic className="cta-primary">
              Audit your site <span aria-hidden>→</span>
            </Link>
            <Link
              href="/state-of-premium/jewellery"
              data-magnetic
              className="cta-ghost"
            >
              Read the field report <span aria-hidden>→</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-14 md:mt-16 max-w-[920px] w-full"
        >
          <div
            className="text-[10px] uppercase tracking-[0.28em] mb-7 text-center"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            <span style={{ color: "#8a6a35" }}>●</span> The studio
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-12">
            <Trophy value={3}   suffix=""      label="Engagements at a time" delay={0}   active={statsActive} />
            <Trophy value={14}  suffix=" days" label="From brief to launch"  delay={0.2} active={statsActive} />
            <Trophy value={100} suffix="%"     label="Hand-coded"            delay={0.4} active={statsActive} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Tag pill ────────────────────────────────────────────────── */
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

/* ── Shimmer word ────────────────────────────────────────────── */
function ShimmerWord({ word }: { word: string }) {
  return <span className="shimmer-word">{word}</span>;
}

/* ── Trophy — animated counter ───────────────────────────────── */
function Trophy({
  value, suffix, label, delay, active,
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
      if (t < start) { raf = requestAnimationFrame(tick); return; }
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

/* ── SH monogram — the brand mark, layered over the orbital rig
   Loads /public/sheenhaus-monogram.png. If missing, the component
   hides itself silently. Transparent PNGs render directly; white-
   background PNGs are cleaned up by mix-blend-mode: multiply
   against the cream theme. */
function MonogramMark({
  rotateX,
  rotateY,
}: {
  rotateX: import("framer-motion").MotionValue<number>;
  rotateY: import("framer-motion").MotionValue<number>;
}) {
  const [missing, setMissing] = useState(false);
  if (missing) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.86, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.3, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
      className="pointer-events-none relative"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        zIndex: 1,
        // Gentle ambient drift — feels alive, never distracting
        animation: "cl-halo-drift 9s ease-in-out infinite",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/sheenhaus-monogram.png"
        alt="Sheenhaus"
        onError={() => setMissing(true)}
        style={{
          width: 360,
          maxWidth: "none", // override Tailwind's img max-width:100%
          height: "auto",
          display: "block",
          mixBlendMode: "multiply",
        }}
      />
    </motion.div>
  );
}
