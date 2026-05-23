"use client";

// The verdict reveal — a one-shot moment where a sentence resolves
// the way an audit resolves a verdict. Section enters with a blurred
// placeholder, a mono "scanning" ticker sweeps across it like a
// progress bar, and the real sentence fades into focus underneath.
//
// Used once on the homepage as the *Who This Is For* set-piece —
// the visual moment is directly tied to the Audit proposition.
// Does not loop; fires once when scrolled into view.

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Word = { text: string; italic?: boolean };

export default function VerdictReveal({
  words,
  scanDurationMs = 1800,
  className = "",
}: {
  words: Word[];
  scanDurationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  // Three phases:
  //  - "idle":     blurred placeholder visible, no scan yet
  //  - "scanning": bronze line sweeps L→R, mono ticker runs
  //  - "resolved": sentence fully in focus, scan elements faded out
  const [phase, setPhase] = useState<"idle" | "scanning" | "resolved">("idle");

  useEffect(() => {
    if (!inView) return;
    // Tiny delay so the visitor sees the blurred state for a beat
    // before the scan starts — feels like the page registers them.
    const t1 = setTimeout(() => setPhase("scanning"), 240);
    const t2 = setTimeout(
      () => setPhase("resolved"),
      240 + scanDurationMs
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView, scanDurationMs]);

  const sentenceText = words.map((w) => w.text).join(" ");

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      aria-label={sentenceText}
    >
      {/* SCAN LAYER — sits absolutely above the sentence during the
          scanning phase, then fades out. Includes the bronze sweep
          line and the mono ticker readout. */}
      <ScanLayer phase={phase} scanDurationMs={scanDurationMs} />

      {/* SENTENCE — blurred + dimmed during idle/scanning, sharpens
          into focus on "resolved". One block, animates as a whole
          rather than word-by-word so the focus pull reads as a
          single camera move. */}
      <motion.div
        aria-hidden="true"
        initial={{ filter: "blur(14px)", opacity: 0.35 }}
        animate={
          phase === "resolved"
            ? { filter: "blur(0px)", opacity: 1 }
            : { filter: "blur(14px)", opacity: 0.35 }
        }
        transition={{
          duration: phase === "resolved" ? 1.1 : 0.4,
          ease: [0.2, 0.7, 0.2, 1],
        }}
        style={{ willChange: "filter, opacity" }}
      >
        {words.map((w, i) => {
          const last = i === words.length - 1;
          return (
            <span key={i}>
              {w.italic ? (
                <em className="italic-accent">{w.text}</em>
              ) : (
                w.text
              )}
              {!last && " "}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ─── Scan layer ────────────────────────────────────────────────── */

function ScanLayer({
  phase,
  scanDurationMs,
}: {
  phase: "idle" | "scanning" | "resolved";
  scanDurationMs: number;
}) {
  const active = phase === "idle" || phase === "scanning";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -m-4 overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {/* Bronze vertical scan line — sweeps from 0% to 100% across
          the sentence box while phase === "scanning". Stays at 0 in
          idle so the moment has a held beat before motion begins. */}
      <motion.div
        className="absolute top-0 bottom-0 w-px"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, #8a6a35 30%, #c9a96e 50%, #8a6a35 70%, transparent 100%)",
          boxShadow: "0 0 12px rgba(138, 106, 53, 0.6)",
          left: 0,
        }}
        initial={{ x: "-2%" }}
        animate={{
          x: phase === "scanning" ? "100%" : phase === "resolved" ? "100%" : "-2%",
        }}
        transition={{
          duration: phase === "scanning" ? scanDurationMs / 1000 : 0,
          ease: [0.4, 0.0, 0.2, 1],
        }}
      />

      {/* Mono ticker — top-right corner, runs through fake audit
          phrases in sync with the scan. Tiny detail, but ties the
          moment to the audit identity. */}
      <ScanTicker phase={phase} scanDurationMs={scanDurationMs} />
    </motion.div>
  );
}

/* ─── Ticker copy ──────────────────────────────────────────────── */

const TICKER_LINES = [
  "Reading the page…",
  "Cross-checking the twelve signs…",
  "Composing the verdict…",
];

function ScanTicker({
  phase,
  scanDurationMs,
}: {
  phase: "idle" | "scanning" | "resolved";
  scanDurationMs: number;
}) {
  const [advancedLine, setAdvancedLine] = useState(0);
  // The displayed line resets to 0 whenever we're not in the scanning
  // phase — derived rather than stored, so we don't fight React's
  // "no setState in effect" rule on phase changes.
  const line = phase === "scanning" ? advancedLine : 0;

  useEffect(() => {
    if (phase !== "scanning") return;
    const step = scanDurationMs / TICKER_LINES.length;
    const intervals: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < TICKER_LINES.length; i++) {
      intervals.push(setTimeout(() => setAdvancedLine(i), step * i));
    }
    return () => intervals.forEach(clearTimeout);
  }, [phase, scanDurationMs]);

  return (
    <div className="absolute -top-7 right-0 flex items-center gap-2.5">
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
      <motion.span
        key={line}
        className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint whitespace-nowrap"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
      >
        {TICKER_LINES[line]}
      </motion.span>
    </div>
  );
}
