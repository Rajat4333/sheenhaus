"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* Custom magnetic cursor — renders on fine-pointer devices only.
   - Inner dot: fast, tight spring — always exactly on the pointer
   - Outer ring: slower spring — lags behind for a trail effect
   - On [data-magnetic] elements: ring expands and dot snaps toward center
   Add `data-magnetic` to any interactive element to activate the pull. */
export default function MagneticCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const dotX = useSpring(mouseX, { damping: 30, stiffness: 700, mass: 0.2 });
  const dotY = useSpring(mouseY, { damping: 30, stiffness: 700, mass: 0.2 });
  const ringX = useSpring(mouseX, { damping: 22, stiffness: 220, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 22, stiffness: 220, mass: 0.5 });

  const ringScale = useMotionValue(1);
  const ringSc = useSpring(ringScale, { damping: 18, stiffness: 260 });

  const isCoarse = useRef(false);

  useEffect(() => {
    isCoarse.current = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse.current) return;

    let hovered = false;

    const onMove = (e: MouseEvent) => {
      const el = (e.target as Element)?.closest("[data-magnetic]");

      if (el) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        mouseX.set(cx + dx * 0.28);
        mouseY.set(cy + dy * 0.28);
        if (!hovered) { hovered = true; ringScale.set(2.6); }
      } else {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        if (hovered) { hovered = false; ringScale.set(1); }
      }
    };

    const onLeave = () => { mouseX.set(-200); mouseY.set(-200); };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY, ringScale]);

  return (
    <>
      {/* Inner dot */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: dotX, y: dotY,
          translateX: "-50%", translateY: "-50%",
          width: 5, height: 5,
          borderRadius: "50%",
          background: "#1a1a1a",
        }}
      />
      {/* Outer ring */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: ringX, y: ringY,
          translateX: "-50%", translateY: "-50%",
          scale: ringSc,
          width: 28, height: 28,
          borderRadius: "50%",
          border: "1px solid rgba(26,26,26,0.25)",
        }}
      />
    </>
  );
}
