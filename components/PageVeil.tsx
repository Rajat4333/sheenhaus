"use client";
import { useEffect, useState } from "react";

/**
 * Veil resolves when the page is genuinely paint-ready, not on a fixed timer.
 *
 * Resolution signal:
 *   1. Wait for window.load (all assets — including fonts — fetched)
 *   2. Then requestIdleCallback (browser has nothing more to do)
 *   3. Honour a minimum of 1.4s so the wordmark intro can still land
 *   4. Hard fallback of 4s so the veil can never get stuck
 */
const MIN_INTRO_MS = 800;
const HARD_TIMEOUT_MS = 2500;

export default function PageVeil() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let resolved = false;
    let hardTimer: ReturnType<typeof setTimeout> | null = null;

    const resolve = () => {
      if (resolved) return;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_INTRO_MS - elapsed);
      setTimeout(() => {
        resolved = true;
        setDone(true);
        if (hardTimer) clearTimeout(hardTimer);
      }, wait);
    };

    const onReady = () => {
      // Wait one idle frame after load so the first paint has actually flushed
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
          .requestIdleCallback(resolve, { timeout: 800 });
      } else {
        setTimeout(resolve, 50);
      }
    };

    if (document.readyState === "complete") {
      onReady();
    } else {
      window.addEventListener("load", onReady, { once: true });
    }

    // Hard ceiling — veil can never be stuck longer than this
    hardTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        setDone(true);
      }
    }, HARD_TIMEOUT_MS);

    return () => {
      window.removeEventListener("load", onReady);
      if (hardTimer) clearTimeout(hardTimer);
    };
  }, []);

  if (done) return null;

  return (
    <div className="page-veil" aria-hidden="true">
      <span className="page-veil-mark font-serif">
        Sheen<em>haus</em>
      </span>
    </div>
  );
}
