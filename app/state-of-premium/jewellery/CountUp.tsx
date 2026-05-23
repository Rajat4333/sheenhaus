"use client";

// A number that counts from 0 → target when scrolled into view.
// Used for the three aggregate verdict figures. One-shot.

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function CountUp({
  target,
  suffix = "",
  durationMs = 1400,
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  durationMs?: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / durationMs);
      // easeOutQuart — fast then settle, feels confident
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
