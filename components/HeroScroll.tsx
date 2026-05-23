"use client";

// Scroll-directed hero — three editorial moments inside one sticky
// viewport. As the visitor scrolls through ~300vh of outer container,
// the three moments cross-fade in sequence, each with a small parallax
// y-drift to give the impression of camera motion past stationary type.
//
// No canvas, no frames, no parallax stack. Just typography, opacity,
// and a single translation per moment. The whole hero is ~3 viewports
// of held scroll — long enough to feel directed, short enough not to
// frustrate.

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

export default function HeroScroll({
  children,
}: {
  children: (scrollYProgress: MotionValue<number>) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <HeroProgress scrollYProgress={scrollYProgress} />
        {/* Render-prop children — parent composes the three moments
            while we own the scroll source. */}
        <div className="absolute inset-0">{children(scrollYProgress)}</div>
      </div>
    </div>
  );
}

/* ─── Per-moment overlay — fades in/out at given scroll thresholds ─── */

export function HeroMoment({
  scrollYProgress,
  start,
  end,
  align = "left",
  children,
}: {
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
  align?: "left" | "center";
  children: ReactNode;
}) {
  // Clamp + force strict monotonic stops (framer-motion's WAAPI
  // backend rejects duplicates or inverted ranges).
  const fadeIn = Math.max(0, Math.min(start, 1));
  const holdIn = Math.max(fadeIn + 0.001, Math.min(start + 0.06, 1));
  const holdOut = Math.max(holdIn + 0.001, Math.min(end - 0.06, 1));
  const fadeOut = Math.max(holdOut + 0.001, Math.min(end + 0.02, 1));

  const opacity = useTransform(
    scrollYProgress,
    [fadeIn, holdIn, holdOut, fadeOut],
    [0, 1, 1, 0]
  );
  // Slow parallax drift — content enters from below, exits slightly above
  const y = useTransform(scrollYProgress, [fadeIn, fadeOut], [60, -60]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 flex flex-col justify-center shell ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      <div className="w-full max-w-none">{children}</div>
    </motion.div>
  );
}

/* ─── Progress rail — thin bronze line bottom of viewport ─── */

function HeroProgress({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      aria-hidden="true"
      className="absolute bottom-0 left-0 right-0 h-px bg-accent origin-left z-20 pointer-events-none"
      style={{ scaleX, opacity: 0.5 }}
    />
  );
}
