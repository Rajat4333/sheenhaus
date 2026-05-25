"use client";

import { useEffect } from "react";

/* Lenis smooth scroll — initialised once at the app root.
   Works transparently with framer-motion's useScroll because
   Lenis still drives window.scrollY; it just smooths the travel. */
export default function SmoothScrollProvider() {
  useEffect(() => {
    let rafId: number;

    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  return null;
}
