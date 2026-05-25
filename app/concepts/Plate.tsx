"use client";

/* Plate — the bespoke generative visual for each thesis on /concepts.
   Mirrors the homepage ThesesSpread plates but self-animates on
   inView instead of being driven by sticky-scroll progress. One
   stable composition per thesis: slowness clock / AI chat / type
   specimen / restraint page. Replaces stock photography. */

import { motion, useInView, useMotionValue, animate, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ANIM_DURATION = 3.6; // seconds for 0 → 1 progress

type Slug = "slowness" | "ai-presence" | "considered-detail" | "trust-through-restraint";

export default function Plate({ slug }: { slug: Slug }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(progress, 1, {
      duration: ANIM_DURATION,
      ease: [0.2, 0.7, 0.2, 1],
    });
    return () => controls.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div
      ref={ref}
      className="relative w-full rounded-sm overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(245,232,200,0.45) 0%, rgba(255,253,248,0.85) 100%)",
        border: "1px solid var(--cl-stroke)",
        aspectRatio: "16/9",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
        {slug === "slowness" && <VisualSlowness progress={progress} />}
        {slug === "ai-presence" && <VisualAI progress={progress} />}
        {slug === "considered-detail" && <VisualDetail progress={progress} />}
        {slug === "trust-through-restraint" && <VisualRestraint progress={progress} />}
      </div>
      {/* Plate caption — typeset like a museum label */}
      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[10px] uppercase tracking-[0.28em]"
           style={{ color: "var(--cl-ink-faint)", fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
        <span>Plate · {plateLabel(slug)}</span>
        <span>Sheenhaus · 2026</span>
      </div>
    </div>
  );
}

function plateLabel(slug: Slug): string {
  if (slug === "slowness") return "The slow draw";
  if (slug === "ai-presence") return "A buyer, asking";
  if (slug === "considered-detail") return "A single character, considered";
  return "The page, mostly blank";
}

/* ─── I. Slowness ───────────────────────────────────────────── */
function VisualSlowness({ progress }: { progress: MotionValue<number> }) {
  const outerPath = useTransform(progress, [0, 1], [0, 1]);
  const innerPath = useTransform(progress, [0, 1], [0, 0.92]);
  const minuteRot = useTransform(progress, [0, 1], [0, 80]);
  const hourRot   = useTransform(progress, [0, 1], [0, 12]);
  return (
    <div className="relative aspect-square h-full max-h-[360px]">
      <div
        className="absolute inset-[18%] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(220,200,160,0.32) 0%, rgba(210,195,170,0.10) 50%, transparent 75%)",
        }}
      />
      <svg viewBox="0 0 400 400" width="100%" height="100%" className="relative">
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(26,22,18,0.08)" strokeWidth="0.6" />
        <motion.path
          d="M 200 60 C 280 60, 340 120, 340 200 C 340 280, 280 340, 200 340 C 120 340, 60 280, 60 200 C 60 120, 120 60, 200 60 Z"
          fill="none" stroke="#8a6a35" strokeWidth="1.3" strokeLinecap="round"
          style={{ pathLength: outerPath }}
        />
        <motion.path
          d="M 200 110 Q 290 110, 290 200 Q 290 290, 200 290 Q 110 290, 110 200 Q 110 110, 200 110"
          fill="none" stroke="rgba(138,106,53,0.45)" strokeWidth="0.8" strokeLinecap="round"
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
    </div>
  );
}

/* ─── II. AI presence ───────────────────────────────────────── */
function VisualAI({ progress }: { progress: MotionValue<number> }) {
  const FULL_ANSWER =
    "The best fine-jewellery houses in Delhi for wedding sets are Sunita Shekhawat, Hazoorilal, and Sheenhaus-listed brands with verified provenance. Most pieces are made-to-order — book a consultation 4–6 weeks ahead.";
  const charCount = useTransform(progress, [0.05, 0.9], [0, FULL_ANSWER.length]);
  const [text, setText] = useState("");
  useEffect(() => {
    const un = charCount.on("change", (v) => setText(FULL_ANSWER.slice(0, Math.round(v))));
    return un;
  }, [charCount]);
  return (
    <div className="relative w-full max-w-[520px]">
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{
          background: "rgba(255,253,248,0.85)",
          border: "1px solid var(--cl-stroke)",
          boxShadow: "0 12px 40px -16px rgba(58,42,20,0.18)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: "rgba(26,22,18,0.18)" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "rgba(26,22,18,0.18)" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "rgba(26,22,18,0.18)" }} />
          </div>
          <span className="text-[9px] uppercase tracking-[0.22em]"
                style={{ color: "var(--cl-ink-faint)", fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
            ChatGPT · 14:32
          </span>
        </div>
        <div className="flex justify-end mb-4">
          <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] text-[13px]"
               style={{ background: "rgba(26,22,18,0.06)", color: "var(--cl-ink)", lineHeight: 1.4 }}>
            best fine jewellery houses in delhi for wedding
          </div>
        </div>
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-[92%] text-[13px]"
               style={{
                 background: "rgba(245,232,200,0.45)",
                 color: "var(--cl-ink)",
                 lineHeight: 1.55,
                 minHeight: 96,
               }}>
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
    </div>
  );
}

/* ─── III. Considered detail ────────────────────────────────── */
function VisualDetail({ progress }: { progress: MotionValue<number> }) {
  const showBaseline = useTransform(progress, [0.05, 0.18], [0, 1]);
  const showXHeight  = useTransform(progress, [0.20, 0.33], [0, 1]);
  const showAscender = useTransform(progress, [0.35, 0.48], [0, 1]);
  const showKerning  = useTransform(progress, [0.50, 0.63], [0, 1]);
  return (
    <div className="relative w-full max-w-[560px]" style={{ aspectRatio: "7/5" }}>
      <svg viewBox="0 0 560 400" width="100%" height="100%">
        {[60, 120, 180, 240, 300, 360, 420, 480].map((x) => (
          <line key={x} x1={x} y1="30" x2={x} y2="370" stroke="rgba(26,22,18,0.04)" strokeWidth="0.5" />
        ))}
        {[80, 140, 200, 260, 320].map((y) => (
          <line key={y} x1="30" y1={y} x2="530" y2={y} stroke="rgba(26,22,18,0.04)" strokeWidth="0.5" />
        ))}
        <text x="180" y="300" fontFamily="var(--font-instrument-serif), serif" fontSize="290" fontWeight="400" fill="var(--cl-ink)" letterSpacing="-8">h</text>
        <text x="320" y="300" fontFamily="var(--font-instrument-serif), serif" fontSize="290" fontWeight="400" fontStyle="italic" fill="#8a6a35" letterSpacing="-8">s</text>
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
    </div>
  );
}

/* ─── IV. Restraint ─────────────────────────────────────────── */
function VisualRestraint({ progress }: { progress: MotionValue<number> }) {
  const pageFrame = useTransform(progress, [0.00, 0.18], [0, 1]);
  const line1Op   = useTransform(progress, [0.10, 0.30, 0.60, 0.70], [0, 1, 1, 0]);
  const line2Op   = useTransform(progress, [0.10, 0.30, 0.48, 0.58], [0, 1, 1, 0]);
  const line3Op   = useTransform(progress, [0.10, 0.30, 0.35, 0.45], [0, 1, 1, 0]);
  const dashIn    = useTransform(progress, [0.72, 0.84], [0, 1]);
  const annotIn   = useTransform(progress, [0.85, 0.96], [0, 1]);
  return (
    <div className="relative w-full max-w-[400px]" style={{ aspectRatio: "4/5" }}>
      <svg viewBox="0 0 400 500" width="100%" height="100%">
        <motion.rect x="60" y="50" width="280" height="400" fill="none" stroke="rgba(26,22,18,0.18)" strokeWidth="0.8" style={{ pathLength: pageFrame }} />
        <motion.rect x="60" y="50" width="280" height="400" fill="rgba(245,232,200,0.18)" style={{ opacity: pageFrame }} />
        <motion.rect x="92" y="140" width="216" height="3" rx="0.5" fill="rgba(26,22,18,0.55)" style={{ opacity: line1Op }} />
        <motion.rect x="92" y="160" width="186" height="3" rx="0.5" fill="rgba(26,22,18,0.55)" style={{ opacity: line2Op }} />
        <motion.rect x="92" y="180" width="204" height="3" rx="0.5" fill="rgba(26,22,18,0.55)" style={{ opacity: line3Op }} />
        <motion.text x="200" y="270" textAnchor="middle" fontSize="64" fontFamily="var(--font-instrument-serif), serif" fontStyle="italic" fill="#8a6a35" style={{ opacity: dashIn }}>
          —
        </motion.text>
        <motion.g style={{ opacity: annotIn }}>
          <line x1="60" y1="50" x2="60" y2="100" stroke="#8a6a35" strokeWidth="0.6" />
          <line x1="55" y1="50" x2="65" y2="50" stroke="#8a6a35" strokeWidth="0.6" />
          <line x1="55" y1="100" x2="65" y2="100" stroke="#8a6a35" strokeWidth="0.6" />
          <text x="32" y="78" fontSize="9" fill="#8a6a35" fontFamily="var(--font-ibm-plex-mono), monospace" letterSpacing="1" textAnchor="middle" transform="rotate(-90 32 78)">margin</text>
          <line x1="60" y1="320" x2="60" y2="450" stroke="#8a6a35" strokeWidth="0.6" />
          <line x1="55" y1="320" x2="65" y2="320" stroke="#8a6a35" strokeWidth="0.6" />
          <line x1="55" y1="450" x2="65" y2="450" stroke="#8a6a35" strokeWidth="0.6" />
          <text x="32" y="390" fontSize="9" fill="#8a6a35" fontFamily="var(--font-ibm-plex-mono), monospace" letterSpacing="1" textAnchor="middle" transform="rotate(-90 32 390)">unsaid</text>
          <text x="200" y="430" textAnchor="middle" fontSize="9" fill="rgba(26,22,18,0.45)" fontFamily="var(--font-ibm-plex-mono), monospace" letterSpacing="1">three lines removed</text>
        </motion.g>
      </svg>
    </div>
  );
}
