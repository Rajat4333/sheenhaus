"use client";

/* HeroScrollFlip — pinned 3D scroll-flip wrapper around SignatureHero.
 *
 * The hero stays pinned to the viewport while the scroll happens; the
 * scroll progress drives a perspective rotation that tilts the hero
 * back like a sheet of paper falling away. By the time the wrapper
 * finishes its scroll, the hero is fully rotated and the next section
 * (ProcessDiagram) flows in beneath it.
 *
 *   wrapper.height = 180vh
 *   inner sticky = 100vh, pinned for the first 80vh of scroll
 *
 * Reduced motion: rotation is disabled (the flip is purely decorative).
 */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import SignatureHero from "@/components/SignatureHero";

export default function HeroScrollFlip() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    /* Drive 0→1 across the full pinned range. start-start = wrapper top
       reaches viewport top; end-end = wrapper bottom reaches viewport
       bottom. */
    offset: ["start start", "end end"],
  });

  /* Flip ramp — most of the rotation happens in the first 70% of scroll
     so the hero is mostly gone by the time the sticky releases. */
  const rotateX     = useTransform(scrollYProgress, [0, 0.7, 1], [0, 65, 78]);
  const translateZ  = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const translateY  = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const scale       = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  /* Fade only at the tail end so the user reads the flip clearly */
  const opacity     = useTransform(scrollYProgress, [0, 0.6, 0.95, 1], [1, 1, 0.4, 0]);
  /* Brighten the rotated face slightly so the angled top doesn't look
     prematurely dim against the cream */
  const filter      = useTransform(
    scrollYProgress,
    [0, 1],
    ["brightness(1) blur(0px)", "brightness(0.94) blur(2px)"]
  );

  if (reducedMotion) {
    return (
      <div ref={ref} style={{ minHeight: "100vh" }}>
        <SignatureHero />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        height: "180vh",
        position: "relative",
        // Establish stacking context so the sticky inner doesn't leak
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          /* Perspective is on the parent of the rotated element so the
             3D tilt has depth. */
          perspective: 1600,
          perspectiveOrigin: "50% 35%",
          /* Hide overflow so the rotated hero doesn't bleed into the
             next section before the sticky releases. */
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            rotateX,
            translateZ,
            translateY,
            scale,
            opacity,
            filter,
            transformOrigin: "center bottom",
            transformStyle: "preserve-3d",
            /* willChange tells the compositor to keep this element on
               its own layer — smoother 3D rotation on mid-tier GPUs. */
            willChange: "transform, opacity",
          }}
        >
          <SignatureHero />
        </motion.div>
      </div>
    </div>
  );
}
