"use client";

/* The Theses — magazine-spread treatment. Each thesis is its own
   composition: a bespoke generative visual that embodies the claim,
   paired with editorial typography. No stock photos. Alternating
   sides. Stays inside the cream clinical theme so the section feels
   continuous with the rest of the page, not spliced in. */

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

type Thesis = {
  num: string;        // Roman numeral
  index: number;      // 0-3 for the sticky scroll math
  slug: string;
  claim: string;
  pullquote: string;  // shorter restatement, italic, beneath the claim
  applies: string;
};

const THESES: Thesis[] = [
  {
    num: "I",
    index: 0,
    slug: "slowness",
    claim: "Luxury moves slowly. We build to match.",
    pullquote: "Slowness is the signal.",
    applies: "Jewellery · Hospitality · Heritage retail",
  },
  {
    num: "II",
    index: 1,
    slug: "ai-presence",
    claim: "Your next customer is asking ChatGPT, not Google.",
    pullquote: "The buyer's first stop is no longer your site.",
    applies: "Every category, increasingly",
  },
  {
    num: "III",
    index: 2,
    slug: "considered-detail",
    claim: "A website is judged by its smallest detail.",
    pullquote: "Buyers read kerning before copy.",
    applies: "Real estate · Property · Considered purchases",
  },
  {
    num: "IV",
    index: 3,
    slug: "trust-through-restraint",
    claim: "Trust is built by what you do not say.",
    pullquote: "Restraint is a claim, too.",
    applies: "Private healthcare · Professional services",
  },
];

export default function ThesesSpread() {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={wrap}
      className="theme-clinical relative"
      style={{ height: `${THESES.length * 80}vh`, background: "var(--cl-bg)" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Section eyebrow — visible across all four theses */}
        <div className="absolute top-10 left-0 right-0 text-center z-30 px-6 pointer-events-none">
          <div
            className="text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            <span style={{ color: "#8a6a35" }}>●</span> Four theses · how we
            think
          </div>
        </div>

        {/* Big numeral page-number, bottom-left, magazine style */}
        <ThesisProgressNumeral progress={scrollYProgress} />

        {/* Quiet vertical hairline on the right — magazine column rule */}
        <div
          className="absolute right-12 top-1/4 bottom-1/4 w-px z-10"
          style={{ background: "var(--cl-stroke)" }}
          aria-hidden
        />

        {/* Four thesis panels — fade in/out across their segment */}
        {THESES.map((t) => (
          <ThesisPanel
            key={t.slug}
            thesis={t}
            total={THESES.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── One thesis panel ──────────────────────────────────────── */
function ThesisPanel({
  thesis,
  total,
  progress,
}: {
  thesis: Thesis;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const i = thesis.index;
  const isLast = i === total - 1;

  const fadeIn = Math.max(0, i === 0 ? 0 : i * seg - seg * 0.2);
  const fullIn = Math.min(1, i * seg + seg * 0.15);
  const fullOut = isLast ? 1 : Math.min(1, (i + 1) * seg - seg * 0.15);
  const fadeOut = isLast ? 1 : Math.min(1, (i + 1) * seg + seg * 0.05);

  const opacity = useTransform(
    progress,
    isLast ? [fadeIn, fullIn, 1] : [fadeIn, fullIn, fullOut, fadeOut],
    isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );

  // Pointer-events: only the active panel intercepts clicks, so the
  // "Read this thesis" link on the panel underneath isn't stolen by
  // an invisible-but-overlapping panel above it.
  const pointerEvents = useTransform(opacity, (o) =>
    o > 0.5 ? "auto" : "none"
  );

  // Local 0→1 progress within this thesis's own scroll segment
  const localProgress = useTransform(progress, [i * seg, (i + 1) * seg], [0, 1]);

  // Alternating sides: I & III visual-left, II & IV visual-right
  const visualLeft = i % 2 === 0;

  return (
    <motion.div
      style={{ opacity, pointerEvents }}
      className="absolute inset-0 z-20 flex items-center justify-center px-8 md:px-20"
    >
      <div
        className="grid w-full max-w-[1300px] gap-8 md:gap-20 items-center grid-cols-1 md:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]"
      >
        {/* Visual */}
        <div
          className={`${visualLeft ? "order-1" : "order-2"} flex items-center justify-center`}
        >
          <ThesisVisual slug={thesis.slug} progress={localProgress} />
        </div>

        {/* Text */}
        <div className={`${visualLeft ? "order-2" : "order-1"} flex flex-col`}>
          <div className="flex items-baseline gap-4 mb-8">
            <span
              className="cl-display"
              style={{
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                color: "#8a6a35",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
              }}
            >
              {thesis.num}
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.28em]"
              style={{
                color: "var(--cl-ink-faint)",
                fontFamily: "var(--font-ibm-plex-mono), monospace",
              }}
            >
              Thesis {String(i + 1).padStart(2, "0")} / 04
            </span>
          </div>

          <h3
            className="cl-display"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 3.25rem)",
              color: "var(--cl-ink)",
              lineHeight: 1.08,
              letterSpacing: "-0.022em",
            }}
          >
            {thesis.claim}
          </h3>

          <p
            className="mt-6 cl-display italic"
            style={{
              fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
              color: "var(--cl-ink-soft)",
              lineHeight: 1.4,
            }}
          >
            {thesis.pullquote}
          </p>

          <div
            className="mt-10 w-12 h-px"
            style={{ background: "#8a6a35" }}
            aria-hidden
          />

          <div
            className="mt-5 text-[10px] uppercase tracking-[0.28em]"
            style={{
              color: "var(--cl-ink-faint)",
              fontFamily: "var(--font-ibm-plex-mono), monospace",
            }}
          >
            Applies to · {thesis.applies}
          </div>

          <Link
            href={`/concepts#${thesis.slug}`}
            data-magnetic
            className="inline-flex items-center gap-2 mt-8 text-[11px] uppercase tracking-[0.22em] self-start pb-1 border-b transition-colors duration-300"
            style={{ color: "var(--cl-ink)", borderColor: "var(--cl-stroke)" }}
          >
            Read this thesis <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Per-thesis generative visual ──────────────────────────── */
function ThesisVisual({
  slug,
  progress,
}: {
  slug: string;
  progress: MotionValue<number>;
}) {
  if (slug === "slowness") return <VisualSlowness progress={progress} />;
  if (slug === "ai-presence") return <VisualAI progress={progress} />;
  if (slug === "considered-detail") return <VisualDetail progress={progress} />;
  return <VisualRestraint progress={progress} />;
}

/* ─── I. Slowness — a slow draw + a settling clock ──────────── */
function VisualSlowness({ progress }: { progress: MotionValue<number> }) {
  const outerPath  = useTransform(progress, [0, 1], [0, 1]);
  const innerPath  = useTransform(progress, [0, 1], [0, 0.92]);
  const minuteRot  = useTransform(progress, [0, 1], [0, 80]);
  const hourRot    = useTransform(progress, [0, 1], [0, 12]);

  return (
    <div className="relative aspect-square w-full max-w-[460px]">
      {/* Soft halo — echoes the hero orb */}
      <div
        className="absolute inset-[18%] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(220,200,160,0.32) 0%, rgba(210,195,170,0.10) 50%, transparent 75%)",
        }}
        aria-hidden
      />
      <svg viewBox="0 0 400 400" width="100%" height="100%" className="relative">
        <circle
          cx="200" cy="200" r="150"
          fill="none" stroke="rgba(26,22,18,0.08)" strokeWidth="0.6"
        />
        <motion.path
          d="M 200 60 C 280 60, 340 120, 340 200 C 340 280, 280 340, 200 340 C 120 340, 60 280, 60 200 C 60 120, 120 60, 200 60 Z"
          fill="none"
          stroke="#8a6a35"
          strokeWidth="1.3"
          strokeLinecap="round"
          style={{ pathLength: outerPath }}
        />
        <motion.path
          d="M 200 110 Q 290 110, 290 200 Q 290 290, 200 290 Q 110 290, 110 200 Q 110 110, 200 110"
          fill="none"
          stroke="rgba(138,106,53,0.45)"
          strokeWidth="0.8"
          strokeLinecap="round"
          style={{ pathLength: innerPath }}
        />
        <motion.line
          x1="200" y1="200" x2="200" y2="160"
          stroke="#1a1612" strokeWidth="1" strokeLinecap="round"
          style={{ rotate: minuteRot, transformOrigin: "200px 200px" }}
        />
        <motion.line
          x1="200" y1="200" x2="200" y2="180"
          stroke="#8a6a35" strokeWidth="1.4" strokeLinecap="round"
          style={{ rotate: hourRot, transformOrigin: "200px 200px" }}
        />
        <circle cx="200" cy="200" r="2" fill="#1a1612" />
      </svg>
      <div className="absolute -bottom-2 left-0 right-0 text-center">
        <span
          className="text-[10px] uppercase tracking-[0.28em]"
          style={{
            color: "var(--cl-ink-faint)",
            fontFamily: "var(--font-ibm-plex-mono), monospace",
          }}
        >
          Plate I · The slow draw
        </span>
      </div>
    </div>
  );
}

/* ─── II. AI presence — a streamed chat answer ───────────────── */
function VisualAI({ progress }: { progress: MotionValue<number> }) {
  const FULL_ANSWER =
    "The best fine-jewellery houses in Delhi for wedding sets are Sunita Shekhawat, Hazoorilal, and Sheenhaus-listed brands with verified provenance. Most pieces are made-to-order — book a consultation 4–6 weeks ahead.";
  const charCount = useTransform(progress, [0.05, 0.9], [0, FULL_ANSWER.length]);
  const [text, setText] = useState("");
  useMotionValueEvent(charCount, "change", (v) => {
    setText(FULL_ANSWER.slice(0, Math.round(v)));
  });

  return (
    <div className="relative w-full max-w-[520px]">
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{
          background: "rgba(255,253,248,0.7)",
          border: "1px solid var(--cl-stroke)",
          boxShadow: "0 12px 40px -16px rgba(58,42,20,0.18)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: "rgba(26,22,18,0.18)" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "rgba(26,22,18,0.18)" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "rgba(26,22,18,0.18)" }} />
          </div>
          <span
            className="text-[9px] uppercase tracking-[0.22em]"
            style={{
              color: "var(--cl-ink-faint)",
              fontFamily: "var(--font-ibm-plex-mono), monospace",
            }}
          >
            ChatGPT · 14:32
          </span>
        </div>
        <div className="flex justify-end mb-4">
          <div
            className="rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] text-[13px]"
            style={{
              background: "rgba(26,22,18,0.06)",
              color: "var(--cl-ink)",
              lineHeight: 1.4,
            }}
          >
            best fine jewellery houses in delhi for wedding
          </div>
        </div>
        <div className="flex justify-start">
          <div
            className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-[92%] text-[13px]"
            style={{
              background: "rgba(245,232,200,0.45)",
              color: "var(--cl-ink)",
              lineHeight: 1.55,
              minHeight: 96,
            }}
          >
            {text}
            <motion.span
              className="inline-block w-[7px] h-[14px] ml-0.5 align-middle"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.0, repeat: Infinity, ease: "linear" }}
            >
              <span className="block w-full h-full" style={{ background: "#8a6a35" }} />
            </motion.span>
          </div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span
          className="text-[10px] uppercase tracking-[0.28em]"
          style={{
            color: "var(--cl-ink-faint)",
            fontFamily: "var(--font-ibm-plex-mono), monospace",
          }}
        >
          Plate II · A buyer, asking
        </span>
      </div>
    </div>
  );
}

/* ─── III. Considered detail — a type-specimen letter under measure ── */
function VisualDetail({ progress }: { progress: MotionValue<number> }) {
  const showBaseline = useTransform(progress, [0.05, 0.18], [0, 1]);
  const showXHeight  = useTransform(progress, [0.20, 0.33], [0, 1]);
  const showAscender = useTransform(progress, [0.35, 0.48], [0, 1]);
  const showKerning  = useTransform(progress, [0.50, 0.63], [0, 1]);
  const showCaption  = useTransform(progress, [0.65, 0.78], [0, 1]);

  return (
    <div className="relative aspect-[7/5] w-full max-w-[560px]">
      <svg viewBox="0 0 560 400" width="100%" height="100%">
        {[60, 120, 180, 240, 300, 360, 420, 480].map((x) => (
          <line key={x} x1={x} y1="30" x2={x} y2="370" stroke="rgba(26,22,18,0.04)" strokeWidth="0.5" />
        ))}
        {[80, 140, 200, 260, 320].map((y) => (
          <line key={y} x1="30" y1={y} x2="530" y2={y} stroke="rgba(26,22,18,0.04)" strokeWidth="0.5" />
        ))}

        <text
          x="180" y="300"
          fontFamily="var(--font-instrument-serif), serif"
          fontSize="290"
          fontWeight="400"
          fill="var(--cl-ink)"
          letterSpacing="-8"
        >
          h
        </text>
        <text
          x="320" y="300"
          fontFamily="var(--font-instrument-serif), serif"
          fontSize="290"
          fontWeight="400"
          fontStyle="italic"
          fill="#8a6a35"
          letterSpacing="-8"
        >
          s
        </text>

        <motion.g style={{ opacity: showBaseline }}>
          <line x1="60" y1="300" x2="460" y2="300" stroke="#8a6a35" strokeWidth="0.8" strokeDasharray="2 3" />
          <text x="468" y="304" fontSize="10" fill="#8a6a35" fontFamily="var(--font-ibm-plex-mono), monospace" letterSpacing="1">baseline</text>
        </motion.g>
        <motion.g style={{ opacity: showXHeight }}>
          <line x1="60" y1="178" x2="460" y2="178" stroke="rgba(26,22,18,0.4)" strokeWidth="0.6" strokeDasharray="2 3" />
          <text x="468" y="182" fontSize="10" fill="rgba(26,22,18,0.55)" fontFamily="var(--font-ibm-plex-mono), monospace" letterSpacing="1">x-height</text>
        </motion.g>
        <motion.g style={{ opacity: showAscender }}>
          <line x1="60" y1="80" x2="460" y2="80" stroke="rgba(26,22,18,0.4)" strokeWidth="0.6" strokeDasharray="2 3" />
          <text x="468" y="84" fontSize="10" fill="rgba(26,22,18,0.55)" fontFamily="var(--font-ibm-plex-mono), monospace" letterSpacing="1">ascender</text>
        </motion.g>
        <motion.g style={{ opacity: showKerning }}>
          <line x1="290" y1="320" x2="290" y2="350" stroke="#8a6a35" strokeWidth="0.8" />
          <line x1="320" y1="320" x2="320" y2="350" stroke="#8a6a35" strokeWidth="0.8" />
          <line x1="290" y1="338" x2="320" y2="338" stroke="#8a6a35" strokeWidth="0.8" />
          <text x="245" y="365" fontSize="9" fill="#8a6a35" fontFamily="var(--font-ibm-plex-mono), monospace" letterSpacing="1">kerning −12</text>
        </motion.g>
      </svg>
      <motion.div
        style={{ opacity: showCaption }}
        className="absolute -bottom-2 left-0 right-0 text-center"
      >
        <span
          className="text-[10px] uppercase tracking-[0.28em]"
          style={{
            color: "var(--cl-ink-faint)",
            fontFamily: "var(--font-ibm-plex-mono), monospace",
          }}
        >
          Plate III · A single character, considered
        </span>
      </motion.div>
    </div>
  );
}

/* ─── IV. Restraint — whitespace as positive subject ────────── */
function VisualRestraint({ progress }: { progress: MotionValue<number> }) {
  // A "page" with most of its lines removed. The visual subject is
  // the silence between marks. Three text-lines fade in, then they
  // erase themselves one by one, leaving a single em-dash. Margins
  // are annotated like a type-specimen — restraint, measured.
  const pageFrame = useTransform(progress, [0.00, 0.18], [0, 1]);
  // Each line: fade in 0.10→0.30, hold, fade out at its own time.
  const line1Op   = useTransform(progress, [0.10, 0.30, 0.60, 0.70], [0, 1, 1, 0]);
  const line2Op   = useTransform(progress, [0.10, 0.30, 0.48, 0.58], [0, 1, 1, 0]);
  const line3Op   = useTransform(progress, [0.10, 0.30, 0.35, 0.45], [0, 1, 1, 0]);
  const dashIn    = useTransform(progress, [0.72, 0.84], [0, 1]);
  const annotIn   = useTransform(progress, [0.85, 0.96], [0, 1]);

  return (
    <div className="relative aspect-[4/5] w-full max-w-[400px]">
      <svg viewBox="0 0 400 500" width="100%" height="100%">
        {/* The page itself — a faint bordered rectangle */}
        <motion.rect
          x="60" y="50" width="280" height="400"
          fill="none"
          stroke="rgba(26,22,18,0.18)"
          strokeWidth="0.8"
          style={{ pathLength: pageFrame }}
        />
        {/* Cream wash inside the page for warmth */}
        <motion.rect
          x="60" y="50" width="280" height="400"
          fill="rgba(245,232,200,0.18)"
          style={{ opacity: pageFrame }}
        />

        {/* Three text lines — fade in, then erase one by one */}
        <motion.rect
          x="92" y="140" width="216" height="3" rx="0.5"
          fill="rgba(26,22,18,0.55)"
          style={{ opacity: line1Op }}
        />
        <motion.rect
          x="92" y="160" width="186" height="3" rx="0.5"
          fill="rgba(26,22,18,0.55)"
          style={{ opacity: line2Op }}
        />
        <motion.rect
          x="92" y="180" width="204" height="3" rx="0.5"
          fill="rgba(26,22,18,0.55)"
          style={{ opacity: line3Op }}
        />

        {/* The em-dash — what remains */}
        <motion.text
          x="200" y="270"
          textAnchor="middle"
          fontSize="64"
          fontFamily="var(--font-instrument-serif), serif"
          fontStyle="italic"
          fill="#8a6a35"
          style={{ opacity: dashIn }}
        >
          —
        </motion.text>

        {/* Margin annotations — whitespace, named */}
        <motion.g style={{ opacity: annotIn }}>
          {/* Top margin */}
          <line x1="60" y1="50" x2="60" y2="100" stroke="#8a6a35" strokeWidth="0.6" />
          <line x1="60" y1="100" x2="60" y2="50" stroke="#8a6a35" strokeWidth="0.6" />
          <line x1="55" y1="50" x2="65" y2="50" stroke="#8a6a35" strokeWidth="0.6" />
          <line x1="55" y1="100" x2="65" y2="100" stroke="#8a6a35" strokeWidth="0.6" />
          <text
            x="32" y="78"
            fontSize="9"
            fill="#8a6a35"
            fontFamily="var(--font-ibm-plex-mono), monospace"
            letterSpacing="1"
            textAnchor="middle"
            transform="rotate(-90 32 78)"
          >
            margin
          </text>

          {/* Bottom margin — what was removed */}
          <line x1="60" y1="320" x2="60" y2="450" stroke="#8a6a35" strokeWidth="0.6" />
          <line x1="55" y1="320" x2="65" y2="320" stroke="#8a6a35" strokeWidth="0.6" />
          <line x1="55" y1="450" x2="65" y2="450" stroke="#8a6a35" strokeWidth="0.6" />
          <text
            x="32" y="390"
            fontSize="9"
            fill="#8a6a35"
            fontFamily="var(--font-ibm-plex-mono), monospace"
            letterSpacing="1"
            textAnchor="middle"
            transform="rotate(-90 32 390)"
          >
            unsaid
          </text>

          {/* Caption line at bottom of page */}
          <text
            x="200" y="430"
            textAnchor="middle"
            fontSize="9"
            fill="rgba(26,22,18,0.45)"
            fontFamily="var(--font-ibm-plex-mono), monospace"
            letterSpacing="1"
          >
            three lines removed
          </text>
        </motion.g>
      </svg>
      <div className="absolute -bottom-2 left-0 right-0 text-center">
        <span
          className="text-[10px] uppercase tracking-[0.28em]"
          style={{
            color: "var(--cl-ink-faint)",
            fontFamily: "var(--font-ibm-plex-mono), monospace",
          }}
        >
          Plate IV · The page, mostly blank
        </span>
      </div>
    </div>
  );
}

/* ─── Magazine-style numeric progress ──────────────────────── */
function ThesisProgressNumeral({ progress }: { progress: MotionValue<number> }) {
  const [num, setNum] = useState("I");
  useMotionValueEvent(progress, "change", (p) => {
    const idx = Math.min(THESES.length - 1, Math.max(0, Math.floor(p * THESES.length + 0.001)));
    setNum(THESES[idx].num);
  });
  return (
    <div className="absolute bottom-10 left-10 z-30 pointer-events-none flex items-baseline gap-3">
      <span
        className="cl-display"
        style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          color: "var(--cl-ink-faint)",
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
        }}
      >
        {num}
      </span>
      <span
        className="text-[10px] uppercase tracking-[0.28em]"
        style={{
          color: "var(--cl-ink-faint)",
          fontFamily: "var(--font-ibm-plex-mono), monospace",
        }}
      >
        / IV
      </span>
    </div>
  );
}
