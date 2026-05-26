"use client";

/* First-visit ritual.
 *
 * Fires once per browser (localStorage flag). On the very first visit the
 * full viewport is covered by a cream overlay; a horizontal bronze scan line
 * sweeps top-to-bottom, "drawing" the SH monogram by progressively revealing
 * it via clip-path. The studio caption appears below, then the whole
 * overlay fades out and the page is exposed.
 *
 * Returning visitors get nothing — instant load, no ceremony.
 *
 * Z-index 90 sits above PageTransition (80) so even if a route change fires
 * during the ritual (unlikely), the ritual stays on top.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const FIRST_VISIT_KEY = "sheenhaus_first_visit_done";
// 1.2s draw + ~0.6s hold + 0.7s fade = 2.5s total visible ceremony
// 1.2s draw + ~0.6s hold + 0.7s fade = 2.5s total visible ceremony
const RITUAL_MS = 2500;

export default function FirstVisit() {
  // null = unknown (server, pre-effect). true/false = decided.
  const [showing, setShowing] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    try {
      const seen = window.localStorage.getItem(FIRST_VISIT_KEY);
      if (seen) {
        setShowing(false);
        return;
      }
      // First visit — show the ritual. Persist the "seen" flag only when the
      // ritual *completes*, so that StrictMode's double-invocation of effects
      // in development doesn't suppress the visual (the first pass would set
      // the flag, the second pass would see it and hide).
      setShowing(true);
      timer = setTimeout(() => {
        if (cancelled) return;
        try { window.localStorage.setItem(FIRST_VISIT_KEY, String(Date.now())); } catch {}
        setShowing(false);
      }, RITUAL_MS);
    } catch {
      // Privacy mode / no storage — skip the ritual rather than persist nothing.
      setShowing(false);
    }
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Nothing rendered until we've checked localStorage (avoids SSR/hydration
  // flash of an overlay for returning visitors).
  if (showing === null) return null;

  return (
    <AnimatePresence>
      {showing && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--color-bg-surface) 0%, var(--color-bg) 60%, var(--color-bg-surface-2) 100%)",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
          }}
        >
          {/* Monogram, ~240px wide. Outer wrapper fades in + scales up.
              The "drawing" reveal is done as a foreground cream rectangle
              covering the monogram that fades + slides off downward,
              exposing the gold mark beneath. This pattern uses only
              opacity and y — properties framer-motion always animates
              reliably across renderers. */}
          <motion.div
            className="relative"
            style={{ width: 240, height: 320, overflow: "hidden" }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {/* The monogram itself — fully present, multiply-blended */}
            <div className="absolute inset-0">
              <Image
                src="/sheenhaus-monogram.png"
                alt=""
                fill
                priority
                sizes="240px"
                style={{ objectFit: "contain", mixBlendMode: "multiply" }}
              />
            </div>

            {/* Cream cover — starts fully covering, slides off downward
                while shrinking, revealing the monogram top-to-bottom. */}
            <motion.div
              className="absolute inset-x-0 top-0 bottom-0"
              style={{
                background:
                  "linear-gradient(180deg, var(--color-bg-surface) 0%, var(--color-bg) 100%)",
              }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 320, opacity: 0.8 }}
              transition={{
                y: { duration: 1.2, delay: 0.3, ease: [0.4, 0, 0.6, 1] },
                opacity: { duration: 0.4, delay: 1.1 },
              }}
            />

            {/* Bronze scan line that rides the cover's lower edge — gives
                the "being drawn / engraved by light" feel. */}
            <motion.div
              className="absolute left-0 right-0"
              style={{
                height: 2,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(138,106,53,0.9) 25%, rgba(201,169,110,1) 50%, rgba(138,106,53,0.9) 75%, transparent 100%)",
                boxShadow:
                  "0 0 14px 3px rgba(201,169,110,0.55), 0 0 4px 1px rgba(255,240,200,0.6)",
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: 320, opacity: [0, 1, 1, 0] }}
              transition={{
                y: { duration: 1.2, delay: 0.3, ease: [0.4, 0, 0.6, 1] },
                opacity: {
                  duration: 1.2,
                  delay: 0.3,
                  times: [0, 0.08, 0.92, 1],
                },
              }}
            />
          </motion.div>

          {/* Studio caption — appears after the monogram completes its draw */}
          <motion.div
            className="absolute bottom-[18vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.5, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div
              className="text-[10px] tracking-[0.42em] uppercase"
              style={{
                color: "var(--color-text-faint)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Sheenhaus · Studio
            </div>
            <div
              className="text-[11px] italic"
              style={{
                color: "var(--color-text-dim)",
                fontFamily: "var(--font-serif)",
              }}
            >
              welcome.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
