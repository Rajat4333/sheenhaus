"use client";

/* SignatureHero — taut single-screen light-theme hero.
 *
 * Cream/clinical theme. No 3D, no monogram, no side rails. A clean
 * editorial composition: floating pill nav at top, positioning tags,
 * the headline, subhead, CTAs, and the studio-stats row. Everything
 * visible without scrolling.
 *
 * Acts as the placeholder while the "elegant luxury" direction is
 * decided. */

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/* Drafting grid — bronze hairline grid with CAD-style cursor crosshair
   + nearest-intersection marker + coordinate readout + slow random cell
   illumination. Canvas-based, client-only. */
const DraftingGrid = dynamic(
  () => import("@/components/DraftingGrid"),
  { ssr: false }
);

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

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";

const NAV = [
  { href: "/state-of-premium/jewellery", label: "WORK" },
  { href: "/signs", label: "DIAGNOSTIC" },
  { href: "/audit", label: "AUDIT" },
  { href: "/concepts", label: "THESES" },
];

export default function SignatureHero() {
  /* Scroll-driven fly-out — no sticky wrapper. The section is a plain
     100vh. As the user scrolls, the section naturally scrolls up off
     the page AND its content tips/flies away at the same time. By the
     time the hero has fully left the viewport (100vh of scroll), the
     fly-out is complete and ProcessDiagram has fully arrived in its
     place. One continuous motion. */
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    /* progress = 0 when section top = viewport top (you're on the hero)
       progress = 1 when section bottom = viewport top (hero just left) */
    offset: ["start start", "end start"],
  });

  /* "Fly out" — text rushes toward the camera, blurs, and fades. */
  const scale      = useTransform(scrollYProgress, [0, 0.85], [1, 1.55]);
  const translateZ = useTransform(scrollYProgress, [0, 0.85], [0, 420]);
  const translateY = useTransform(scrollYProgress, [0, 0.85], [0, -110]);
  /* Stay solid through the first half, collapse opacity by 70% so the
     content is fully gone well before the section exits. */
  const opacity    = useTransform(scrollYProgress, [0, 0.35, 0.65, 0.8], [1, 1, 0.15, 0]);
  /* Motion blur ramps only in the back half — keeps the type readable. */
  const filter     = useTransform(scrollYProgress, [0, 0.3, 0.8], ["blur(0px)", "blur(0px)", "blur(10px)"]);

  return (
    <section
      ref={ref}
      className="theme-clinical relative overflow-hidden"
      style={{
        background: "var(--cl-bg)",
        minHeight: "100vh",
        height: "100vh",
        /* Perspective lives on the section so the rotated content
           reads as 3D depth. */
        perspective: 1600,
        perspectiveOrigin: "50% 35%",
      }}
    >
      {/* Drafting grid — bronze hairlines + CAD crosshair behind content.
          STAYS ANCHORED — never rotates. */}
      <DraftingGrid />

      {/* Floating pill nav — stays anchored above the content stack. */}
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
            className="inline-flex items-center gap-2 pl-3 pr-3 py-1.5"
          >
            <WordmarkSphere size={14} />
            <span
              className="text-sm tracking-tight"
              style={{ color: "var(--cl-ink)" }}
            >
              sheenhaus
            </span>
          </Link>
          <span
            className="w-px h-4 mx-1"
            style={{ background: "var(--cl-stroke)" }}
          />
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
            style={{
              background: "var(--cl-pill-bg)",
              color: "var(--cl-pill-ink)",
            }}
          >
            Book a call
          </a>
        </motion.div>
      </nav>

      {/* Main content — code stream, headline, subhead, CTAs. This is
          the layer that flips. Everything outside it (grid, nav, cream
          background) stays anchored. */}
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 pt-28 pb-16 text-center gap-0"
        style={
          reducedMotion
            ? undefined
            : {
                scale,
                translateZ,
                y: translateY,
                opacity,
                filter,
                transformOrigin: "center center",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity, filter",
              }
        }
      >
        {/* Live code stream — cycles through short snippets above the H1 */}
        <CodeStream />

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
          className="cl-display text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1.05] tracking-[-0.028em]"
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
          transition={{ duration: 0.95, delay: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex flex-col items-center gap-8 mt-10 md:mt-12"
        >
          <p
            className="text-[15px] md:text-base max-w-xl"
            style={{ color: "var(--cl-ink-soft)" }}
          >
            Cinematic websites. Workflows that run themselves. AI built into the
            surface. Hand-coded for businesses that refuse to look like everyone else.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/audit" className="cta-primary">
              Audit your site <span aria-hidden>→</span>
            </Link>
            <Link href="/state-of-premium/jewellery" className="cta-ghost">
              Read the field report <span aria-hidden>→</span>
            </Link>
          </div>
        </motion.div>

        {/* Tiny editorial credit at the bottom of the section — a hallmark. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1.0, delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.32em] uppercase pointer-events-none"
          style={{
            color: "var(--cl-ink-faint)",
            fontFamily: "var(--font-ibm-plex-mono), monospace",
          }}
          aria-hidden
        >
          Sheenhaus · Studio · Delhi · MMXXVI
        </motion.div>
      </motion.div>
    </section>
  );
}


function ShimmerWord({ word }: { word: string }) {
  return <span className="shimmer-word">{word}</span>;
}

/* ── CodeStream — a small mono "live terminal" above the headline.
 *
 * Cycles through short, plausible code/CLI snippets that represent
 * each phase of the studio's work (audit, build, agent, shader). Each
 * snippet holds for ~4.5s then crossfades to the next via
 * AnimatePresence. Coloured by hand — keywords bronze, comments dim,
 * results in the soft-ink tone.
 *
 * Fixed minHeight so the layout doesn't shift as snippets change. A
 * blinking bronze caret sits at the end of the last line.
 *
 * Tech signal without redundancy — nothing else on the page shows
 * code blocks. */

interface Snippet {
  label: string;
  lines: Array<Array<{ text: string; tone?: "key" | "dim" | "num" | "str" | "result" }>>;
}

const SNIPPETS: Snippet[] = [
  {
    label: "sheen/audit · live",
    lines: [
      [
        { text: "$ ", tone: "dim" },
        { text: "sheen audit ", tone: "key" },
        { text: "tanishq.com", tone: "str" },
      ],
      [
        { text: "→ craft ", tone: "result" },
        { text: "24", tone: "num" },
        { text: " · ai ", tone: "result" },
        { text: "12", tone: "num" },
        { text: " · trust ", tone: "result" },
        { text: "38", tone: "num" },
      ],
    ],
  },
  {
    label: "sheen/build · cinematic",
    lines: [
      [
        { text: "const ", tone: "key" },
        { text: "hero = ", tone: "result" },
        { text: "render", tone: "key" },
        { text: "(<Signature />)" },
      ],
      [
        { text: "// ", tone: "dim" },
        { text: "lighthouse ", tone: "dim" },
        { text: "96", tone: "num" },
        { text: " · paint ", tone: "dim" },
        { text: "0.42s", tone: "num" },
      ],
    ],
  },
  {
    label: "sheen/agent · running",
    lines: [
      [
        { text: "on", tone: "key" },
        { text: "(", tone: "result" },
        { text: "'lead.new'", tone: "str" },
        { text: ", ", tone: "result" },
        { text: "route", tone: "key" },
        { text: ")", tone: "result" },
      ],
      [
        { text: "// ", tone: "dim" },
        { text: "47", tone: "num" },
        { text: " workflows · ", tone: "dim" },
        { text: "0", tone: "num" },
        { text: " misroutes", tone: "dim" },
      ],
    ],
  },
  {
    label: "sheen/material · gpu",
    lines: [
      [
        { text: "vec3 ", tone: "key" },
        { text: "sheen = ", tone: "result" },
        { text: "mix", tone: "key" },
        { text: "(bronze, cream, n)", tone: "result" },
      ],
      [
        { text: "// ", tone: "dim" },
        { text: "shader ", tone: "dim" },
        { text: "0.6ms", tone: "num" },
        { text: " · GPU resident", tone: "dim" },
      ],
    ],
  },
  {
    label: "sheen/deploy · ok",
    lines: [
      [
        { text: "$ ", tone: "dim" },
        { text: "git push ", tone: "key" },
        { text: "production", tone: "str" },
      ],
      [
        { text: "→ ", tone: "result" },
        { text: "12", tone: "num" },
        { text: " routes · ", tone: "result" },
        { text: "edge", tone: "key" },
        { text: " · live in ", tone: "result" },
        { text: "23s", tone: "num" },
      ],
    ],
  },
];

const TONE_COLOR: Record<NonNullable<Snippet["lines"][number][number]["tone"]> | "default", string> = {
  default: "var(--cl-ink-soft)",
  key: "#8a6a35",
  dim: "rgba(138,125,104,0.65)",
  num: "#75582b",
  str: "rgba(60,40,16,0.85)",
  result: "rgba(74,66,51,0.85)",
};

function CodeStream() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % SNIPPETS.length);
    }, 4600);
    return () => window.clearInterval(id);
  }, []);

  const snip = SNIPPETS[idx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      className="w-full max-w-xl mb-9 md:mb-11 text-left"
      aria-hidden
      style={{
        fontFamily: "var(--font-ibm-plex-mono), monospace",
        fontSize: 11.5,
        lineHeight: 1.65,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -3, filter: "blur(2px)" }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          /* Fixed minHeight stops layout shift across snippet changes */
          style={{ minHeight: 70 }}
        >
          {/* Label header — `// sheen/path · status` */}
          <div
            style={{
              fontSize: 9.5,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(138,125,104,0.75)",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#8a6a35",
                boxShadow: "0 0 0 0 rgba(138,106,53,0.55)",
                animation: "cl-status-pulse 2.2s ease-out infinite",
              }}
            />
            <span>// {snip.label}</span>
          </div>
          {/* Code body */}
          {snip.lines.map((line, lineIdx) => {
            const isLast = lineIdx === snip.lines.length - 1;
            return (
              <div key={lineIdx} style={{ whiteSpace: "pre" }}>
                {line.map((tok, ti) => (
                  <span
                    key={ti}
                    style={{ color: TONE_COLOR[tok.tone || "default"] }}
                  >
                    {tok.text}
                  </span>
                ))}
                {/* Blinking caret at end of last line */}
                {isLast && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 7,
                      height: 13,
                      marginLeft: 4,
                      verticalAlign: "-2px",
                      background: "#8a6a35",
                      animation: "cl-caret-blink 1s steps(2) infinite",
                    }}
                  />
                )}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
