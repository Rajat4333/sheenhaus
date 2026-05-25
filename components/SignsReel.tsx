"use client";

/* The 12 Signs section.

   Desktop (≥768px): horizontal film reel — page pins vertically
   and the cards scrub sideways as you scroll. Cinematic but
   intentionally scroll-jacked.

   Mobile (<768px): a normal vertical list of the same 12 signs +
   the CTA card. No scroll interception, no friction, just thumb-
   scroll through them. Same data, same fill-on-scroll effect on
   each number. */

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Sign = { num: string; title: string; symptom: string };

const SIGNS: Sign[] = [
  { num: "01", title: "The header was built by your billing software vendor.", symptom: "Three-column nav · dropdown for every department" },
  { num: "02", title: "A pop-up offers a 10% discount within four seconds of arrival.", symptom: "Newsletter modal · spin-the-wheel · exit-intent" },
  { num: "03", title: "The hero is an autoplay video of stock-photo customers laughing.", symptom: "B-roll of a model with a martini · turntable of the lobby" },
  { num: "04", title: "Every photograph is a stock photograph.", symptom: "The same Unsplash interior on three competitors' sites" },
  { num: "05", title: "The address bar ends in .aspx or /index.php?id=27.", symptom: "Footer reads 'Powered by [CMS name]' in 8pt grey" },
  { num: "06", title: "There are six different font weights on the home page.", symptom: "Bold heading · regular-italic next sentence · black price" },
  { num: "07", title: "The contact page is a form with sixteen fields.", symptom: "Required budget dropdown · service checkboxes · captcha" },
  { num: "08", title: "Every section heading uses the word 'Solutions'.", symptom: "'Holistic Solutions' · 'End-to-End Solutions'" },
  { num: "09", title: "There are testimonial carousels with five-star ratings.", symptom: "Quotes attributed to 'Sarah K., Verified Buyer'" },
  { num: "10", title: "The site loads at five seconds on a desktop, ten on cellular.", symptom: "Three jQuery sliders · twelve trackers · a 4MB hero" },
  { num: "11", title: "Every page has the same hero photograph.", symptom: "Skyline + sunset crossfade on home, about, contact, 404" },
  { num: "12", title: "ChatGPT cannot name your brand when asked about your category.", symptom: "Your name is not in the model's answer" },
];

/* Responsive switch — listens to a single matchMedia query. The
   horizontal reel is heavier (12 cards × scroll-driven motion
   values + sticky height of 13×100vh), so on small screens we
   skip mounting it entirely and render the lightweight list. */
function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

export default function SignsReel() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <DesktopReel /> : <MobileList />;
}

/* ────────────────────────────────────────────────────────────────
 * MOBILE — vertical list, no scroll interception
 * ──────────────────────────────────────────────────────────────── */
function MobileList() {
  return (
    <section
      className="theme-clinical relative py-24 px-6"
      style={{ background: "var(--cl-bg)" }}
    >
      <div className="max-w-[640px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="text-[10px] uppercase tracking-[0.32em] mb-4"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            <span style={{ color: "#8a6a35" }}>●</span> The Diagnostic
          </div>
          <h2
            className="cl-display"
            style={{
              fontSize: "clamp(1.75rem, 7vw, 2.5rem)",
              color: "var(--cl-ink)",
              lineHeight: 1.1,
            }}
          >
            Twelve signs your website is <em>costing you</em> clients.
          </h2>
          <p
            className="mt-5 text-[14px] mx-auto"
            style={{ color: "var(--cl-ink-soft)" }}
          >
            Patterns we see on premium-brand websites whose offline brand
            already outruns their digital presence.
          </p>
        </div>

        {/* List */}
        <div className="space-y-12">
          {SIGNS.map((s, i) => (
            <MobileSignRow key={s.num} sign={s} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div
            className="text-[10px] uppercase tracking-[0.32em] mb-4"
            style={{ color: "#8a6a35" }}
          >
            ● End of diagnostic
          </div>
          <h3
            className="cl-display"
            style={{
              fontSize: "clamp(1.75rem, 7vw, 2.5rem)",
              color: "var(--cl-ink)",
              lineHeight: 1.1,
            }}
          >
            Recognise your site here?
          </h3>
          <p
            className="mt-5 text-[14px] mx-auto"
            style={{ color: "var(--cl-ink-soft)" }}
          >
            Run the same twelve checks against your own URL — twenty seconds,
            no email required.
          </p>
          <div className="mt-8 flex flex-col gap-3 items-stretch">
            <Link href="/audit" className="cta-primary">
              Audit your site <span aria-hidden>→</span>
            </Link>
            <Link href="/signs" className="cta-ghost">
              Read each sign in full <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* A single sign row in the mobile list. Uses useInView for the
   number's ink-fill on entry — no global scroll listener needed. */
function MobileSignRow({ sign, index }: { sign: Sign; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <article ref={ref} className="grid grid-cols-[auto_1fr] gap-5 items-baseline">
      <div
        className="cl-display tabular-nums sign-number"
        style={
          {
            fontSize: "clamp(2.5rem, 12vw, 4rem)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            paddingBottom: "0.08em",
            paddingRight: "0.04em",
            ["--fill" as string]: inView ? "100%" : "0%",
            transition: "--fill 0.8s cubic-bezier(0.2, 0.7, 0.2, 1)",
          } as React.CSSProperties
        }
      >
        {sign.num}
      </div>
      <div className="self-center">
        <h3
          className="cl-display"
          style={{
            fontSize: "clamp(1rem, 4.5vw, 1.25rem)",
            color: "var(--cl-ink)",
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
          }}
        >
          {sign.title}
        </h3>
        <p
          className="mt-3 text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "var(--cl-ink-faint)" }}
        >
          — {sign.symptom}
        </p>
        <div
          className="mt-2 text-[10px] uppercase tracking-[0.28em]"
          style={{ color: "#8a6a35" }}
        >
          Sign {index + 1} of 12
        </div>
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────
 * DESKTOP — horizontal film reel, scroll-jacked
 * ──────────────────────────────────────────────────────────────── */
function DesktopReel() {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });

  // Translate the strip horizontally so every card — including the
  // end-of-reel CTA card — lands centred at the same 20vw mark by
  // scroll's end. Total cards = SIGNS.length + 1 (12 signs + CTA).
  const x = useTransform(
    scrollYProgress,
    [0.05, 1],
    [`0vw`, `-${SIGNS.length * 60}vw`]
  );

  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={wrap}
      className="theme-clinical relative"
      style={{ height: `${(SIGNS.length + 1) * 100}vh`, background: "var(--cl-bg)" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Section header — fades out quickly as the reel starts */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.03], [1, 0]) }}
          className="absolute top-24 left-0 right-0 text-center z-10 px-6"
        >
          <div
            className="text-[10px] uppercase tracking-[0.32em] mb-4"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            <span style={{ color: "#8a6a35" }}>●</span> The Diagnostic
          </div>
          <h2
            className="cl-display"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              color: "var(--cl-ink)",
              lineHeight: 1.05,
            }}
          >
            Twelve signs your website is{" "}
            <em>costing you</em> clients.
          </h2>
          <p
            className="mt-5 text-[14px] max-w-xl mx-auto"
            style={{ color: "var(--cl-ink-soft)" }}
          >
            Scroll. Each sign is a pattern we see on premium-brand websites whose
            offline brand already outruns their digital presence.
          </p>
        </motion.div>

        {/* The horizontal track */}
        <motion.div
          style={{ x }}
          className="absolute left-[20vw] top-0 bottom-0 flex items-center"
        >
          {SIGNS.map((s, i) => (
            <SignCard
              key={s.num}
              sign={s}
              index={i}
              total={SIGNS.length}
              scrollYProgress={scrollYProgress}
            />
          ))}

          {/* End-of-reel CTA card */}
          <div
            className="shrink-0 flex flex-col items-center justify-center text-center px-12"
            style={{ width: "60vw", height: "70vh" }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.32em] mb-6"
              style={{ color: "#8a6a35" }}
            >
              ● End of diagnostic
            </div>
            <h3
              className="cl-display"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                color: "var(--cl-ink)",
                lineHeight: 1.05,
                maxWidth: "20ch",
              }}
            >
              Recognise your site here?
            </h3>
            <p
              className="mt-6 text-[15px] max-w-md mx-auto"
              style={{ color: "var(--cl-ink-soft)" }}
            >
              Run the same twelve checks against your own URL — twenty seconds,
              no email required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/audit" className="cta-primary">
                Audit your site <span aria-hidden>→</span>
              </Link>
              <Link href="/signs" className="cta-ghost">
                Read each sign in full <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Progress rail at bottom */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[280px] h-px"
          style={{ background: "var(--cl-stroke)" }}
        >
          <motion.div
            className="h-full"
            style={{ width: progress, background: "#8a6a35" }}
          />
        </div>

        {/* Counter — current sign of 12 */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.05, 0.1], [0, 1]) }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.28em]"
        >
          <SignCounter scrollYProgress={scrollYProgress} total={SIGNS.length} />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── A single sign card on the desktop strip ─────────────────── */
function SignCard({
  sign,
  index,
  total,
  scrollYProgress,
}: {
  sign: Sign;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const seg = 1 / (total + 1);
  const segStart = index * seg;
  const segMid = index * seg + seg * 0.6;
  const fillPct = useTransform(
    scrollYProgress,
    [segStart, segMid],
    ["0%", "100%"]
  );
  return (
    <article
      className="shrink-0 flex flex-col justify-center px-8 md:px-16"
      style={{ width: "60vw", height: "70vh" }}
    >
      <div className="grid grid-cols-[auto_1fr] gap-8 md:gap-16 items-baseline">
        <div className="text-left">
          <motion.div
            className="cl-display tabular-nums sign-number"
            style={
              {
                fontSize: "clamp(5rem, 12vw, 9rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                paddingBottom: "0.08em",
                paddingRight: "0.04em",
                ["--fill" as string]: fillPct,
              } as React.CSSProperties
            }
          >
            {sign.num}
          </motion.div>
          <div
            className="text-[10px] uppercase tracking-[0.28em] mt-4"
            style={{ color: "#8a6a35" }}
          >
            Sign {index + 1} of 12
          </div>
        </div>
        <div className="self-center">
          <h3
            className="cl-display"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.75rem)",
              color: "var(--cl-ink)",
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              maxWidth: "22ch",
            }}
          >
            {sign.title}
          </h3>
          <p
            className="mt-6 text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            — {sign.symptom}
          </p>
        </div>
      </div>
    </article>
  );
}

/* ─── Sign counter ────────────────────────────────────────────── */
function SignCounter({
  scrollYProgress,
  total,
}: {
  scrollYProgress: MotionValue<number>;
  total: number;
}) {
  const display = useTransform(scrollYProgress, (p) => {
    const n = Math.min(total, Math.max(1, Math.ceil(p * total)));
    return `${String(n).padStart(2, "0")} / ${total}`;
  });
  return (
    <motion.span style={{ color: "var(--cl-ink-soft)" }}>{display}</motion.span>
  );
}
