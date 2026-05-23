"use client";

// A single sentence that resolves word-by-word as the viewer scrolls
// through a tall sticky region. The sentence sits centered, the page
// behind it remains still, and each word lifts from faint to full
// weight on its own scroll beat. Released cleanly into whatever
// follows below.
//
// One sentence, one held beat. No camera moves, no particles,
// no parallax stack. The cinematic moment is *restraint*.

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type Props = {
  // The sentence, split into word chunks. Use a leading "<em>" / "</em>"
  // wrapped fragment by passing an italic flag per word, or split the
  // sentence around the italicised phrase manually using the structure
  // below. Kept dumb on purpose — the caller composes the shape.
  words: { text: string; italic?: boolean }[];
  // Mono eyebrow shown above the sentence. Optional.
  eyebrow?: string;
  // Total scroll distance the moment occupies (default 180vh). Longer
  // = slower reveal, more held silence.
  scrollHeight?: string;
};

export default function ScrollSentence({
  words,
  eyebrow,
  scrollHeight = "180vh",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // start: when the top of the section hits the viewport bottom
    // end:   when the bottom of the section hits the viewport top
    offset: ["start end", "end start"],
  });

  // The reveal range maps to the *middle* of the scroll window — we
  // pad on either side so words don't start lifting before the section
  // is in view, and the held beat continues briefly after the last
  // word resolves.
  const revealStart = 0.18;
  const revealEnd = 0.72;
  const revealSpan = revealEnd - revealStart;

  const eyebrowOpacity = useTransform(
    scrollYProgress,
    [revealStart - 0.04, revealStart + 0.04],
    [0, 1]
  );

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: scrollHeight }}
      aria-label={words.map((w) => w.text).join(" ")}
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="shell w-full">
          {eyebrow && (
            <motion.div
              className="inline-flex items-center gap-3 mb-10"
              style={{ opacity: eyebrowOpacity }}
            >
              <span className="w-6 h-px bg-accent" />
              <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid whitespace-nowrap">
                {eyebrow}
              </span>
            </motion.div>
          )}
          <p
            className="display-serif font-serif text-[clamp(2.25rem,6.5vw,5.5rem)] leading-[1.08] tracking-[-0.025em] max-w-[22ch]"
            aria-hidden="true"
          >
            {words.map((w, i) => {
              const t = i / Math.max(1, words.length - 1);
              const wordStart = revealStart + t * revealSpan * 0.85;
              const wordEnd = wordStart + revealSpan * 0.12;
              return (
                <Word
                  key={i}
                  text={w.text}
                  italic={!!w.italic}
                  start={wordStart}
                  end={wordEnd}
                  scrollYProgress={scrollYProgress}
                  last={i === words.length - 1}
                />
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}

function Word({
  text,
  italic,
  start,
  end,
  scrollYProgress,
  last,
}: {
  text: string;
  italic: boolean;
  start: number;
  end: number;
  scrollYProgress: MotionValue<number>;
  last: boolean;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.16, 1]);
  const y = useTransform(scrollYProgress, [start, end], [8, 0]);

  return (
    <>
      <motion.span
        style={{
          opacity,
          y,
          display: "inline-block",
          color: italic ? "var(--color-accent)" : "var(--color-text)",
          fontStyle: italic ? "italic" : "normal",
          willChange: "opacity, transform",
        }}
      >
        {text}
      </motion.span>
      {!last && " "}
    </>
  );
}
