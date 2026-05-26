"use client";

/* Route-change curtain transition.
 *
 * Listens to the App Router's pathname. On every route change after the first
 * render, a full-viewport cream curtain slides up from the bottom, covering
 * the screen for ~250ms. While it's covering, the SH monogram fades in with a
 * gold light-sweep passing across it (~700ms reveal). Then the curtain slides
 * further up off the top of the screen, revealing the new page underneath.
 *
 * Total timeline: ~1.15s. Skipped entirely on the very first render so
 * regular first-load isn't punished. The initial-load veil (PageVeil) stays
 * mounted separately and handles its own concern.
 */

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function PageTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    // Skip first mount — no transition on initial page load.
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    setActive(true);
    const t = setTimeout(() => setActive(false), 1150);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--color-bg-surface) 0%, var(--color-bg) 60%, var(--color-bg-surface-2) 100%)",
          }}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* Monogram with cinematic reveal */}
          <motion.div
            className="relative"
            style={{ width: 200, height: 260 }}
            initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(2px)" }}
            transition={{
              opacity: { duration: 0.4, delay: 0.25 },
              scale: { duration: 0.55, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] },
              filter: { duration: 0.4, delay: 0.25 },
            }}
          >
            <Image
              src="/sheenhaus-monogram.png"
              alt=""
              fill
              priority
              sizes="200px"
              style={{ objectFit: "contain", mixBlendMode: "multiply" }}
            />
            {/* Vertical highlight band sweeping L → R across the monogram —
                "light passing over engraved metal". */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-0 bottom-0 w-1/3"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,248,228,0.85) 50%, transparent 100%)",
                  mixBlendMode: "overlay",
                }}
                initial={{ left: "-40%" }}
                animate={{ left: "120%" }}
                transition={{
                  duration: 0.75,
                  delay: 0.3,
                  ease: [0.4, 0, 0.6, 1],
                }}
              />
            </div>
          </motion.div>

          {/* Subtle plate caption — mono small caps, draws the eye while the
              monogram resolves. */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.85, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="absolute bottom-[12vh] left-1/2 -translate-x-1/2 text-[10px] tracking-[0.42em] uppercase"
            style={{
              color: "var(--color-text-faint)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Sheenhaus · Studio
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
