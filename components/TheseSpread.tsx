"use client";

/* The Theses — section 4. Each thesis is one full screen; as the
   visitor scrolls through, the photo cross-fades into the next and
   the text changes. Cinematic, magazine-spread feel. Real data from
   app/concepts/theses-data.ts mirrored here for the homepage. */

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const THESES = [
  {
    num: "I",
    slug: "slowness",
    claim: "Luxury moves slowly. We build to match.",
    applies: "Jewellery · Hospitality · Heritage retail",
    photo:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=2000&q=85&auto=format&fit=crop",
  },
  {
    num: "II",
    slug: "ai-presence",
    claim: "Your next customer is asking ChatGPT, not Google.",
    applies: "Every category, increasingly",
    photo:
      "https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=2000&q=85&auto=format&fit=crop",
  },
  {
    num: "III",
    slug: "considered-detail",
    claim: "A website is judged by its smallest detail.",
    applies: "Real estate · Property · Considered purchases",
    photo:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&q=85&auto=format&fit=crop",
  },
  {
    num: "IV",
    slug: "trust-through-restraint",
    claim: "Trust is built by what you do not say.",
    applies: "Private healthcare · Professional services",
    photo:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=2000&q=85&auto=format&fit=crop",
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
      style={{ height: `${THESES.length * 100}vh`, background: "var(--cl-bg)" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Photos stack — each fades in as we hit its segment */}
        {THESES.map((t, i) => (
          <ThesisPhoto
            key={t.slug}
            src={t.photo}
            index={i}
            total={THESES.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Dark wash for legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Section eyebrow */}
        <div className="absolute top-12 left-0 right-0 text-center z-10 px-6">
          <div className="text-[10px] uppercase tracking-[0.32em] text-white/70">
            <span style={{ color: "#c9a96e" }}>●</span> Four Theses · How we
            think
          </div>
        </div>

        {/* Text stack — each fades in/out across its segment */}
        {THESES.map((t, i) => (
          <ThesisText
            key={t.slug}
            thesis={t}
            index={i}
            total={THESES.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Progress dots */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          {THESES.map((t, i) => (
            <ProgressDot
              key={t.slug}
              index={i}
              total={THESES.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Photo for a single thesis ──────────────────────────────── */
function ThesisPhoto({
  src,
  index,
  total,
  progress,
}: {
  src: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each thesis owns 1/total of the scroll. Photo fades in around
  // index/total and out around (index+1)/total. Last photo holds
  // past the end of its segment by simply staying at opacity 1.
  const seg = 1 / total;
  const fadeIn = Math.max(0, index === 0 ? 0 : index * seg - seg * 0.25);
  const fullIn = Math.min(1, index * seg + seg * 0.1);
  const isLast = index === total - 1;
  const fadeOut = isLast ? 1 : Math.min(1, (index + 1) * seg - seg * 0.05);
  const fullOut = isLast ? 1 : Math.min(1, (index + 1) * seg + seg * 0.2);

  const opacity = useTransform(
    progress,
    isLast ? [fadeIn, fullIn, 1] : [fadeIn, fullIn, fadeOut, fullOut],
    isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );

  // Slow Ken-Burns zoom as you read each thesis
  const scale = useTransform(
    progress,
    [index * seg, (index + 1) * seg],
    [1.05, 1.15]
  );

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "saturate(0.9) brightness(0.95)" }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Text for a single thesis ───────────────────────────────── */
function ThesisText({
  thesis,
  index,
  total,
  progress,
}: {
  thesis: (typeof THESES)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const fadeIn = Math.min(1, index * seg + seg * 0.05);
  const fullIn = Math.min(1, index * seg + seg * 0.2);
  const fullOut = Math.min(1, (index + 1) * seg - seg * 0.2);
  const fadeOut = Math.min(1, (index + 1) * seg - seg * 0.05);

  const opacity = useTransform(
    progress,
    [fadeIn, fullIn, fullOut, fadeOut],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [fadeIn, fullIn, fullOut, fadeOut],
    [24, 0, 0, -24]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center px-6 z-10"
    >
      <div className="max-w-[920px] text-center">
        <div className="text-[10px] uppercase tracking-[0.32em] text-white/60 mb-6">
          Thesis {thesis.num}
        </div>
        <h3
          className="cl-display"
          style={{
            fontSize: "clamp(2.25rem, 6vw, 5rem)",
            color: "#fff",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
          }}
        >
          {thesis.claim}
        </h3>
        <div className="mt-8 text-[10px] uppercase tracking-[0.28em] text-white/60">
          Applies to · {thesis.applies}
        </div>
        <Link
          href={`/concepts#${thesis.slug}`}
          className="inline-flex items-center gap-2 mt-10 px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.2em] border border-white/30 text-white hover:bg-white hover:text-black transition-colors duration-500"
        >
          Read this thesis <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── Progress dot ───────────────────────────────────────────── */
function ProgressDot({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const scale = useTransform(
    progress,
    [index * seg, index * seg + seg * 0.2, (index + 1) * seg],
    [0.7, 1.2, 0.7]
  );
  const opacity = useTransform(
    progress,
    [index * seg, index * seg + seg * 0.2, (index + 1) * seg],
    [0.4, 1, 0.4]
  );
  return (
    <motion.span
      style={{ scale, opacity }}
      className="block w-1.5 h-1.5 rounded-full"
      aria-hidden
    >
      <span
        className="block w-full h-full rounded-full"
        style={{ background: "#fff" }}
      />
    </motion.span>
  );
}
