"use client";

// Vertical bar chart — distribution of Sheenhaus Scores across the
// audited set, bucketed in 20-point bands. Bars rise from the
// baseline on scroll-in with a small stagger; hover a bar to see
// the brands in that band.

import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { isAudit, type Row } from "./types";

const BANDS = [
  { label: "0–20", lo: 0, hi: 20, tone: "Critical" },
  { label: "20–40", lo: 20, hi: 40, tone: "Costing you clients" },
  { label: "40–60", lo: 40, hi: 60, tone: "Drifting" },
  { label: "60–80", lo: 60, hi: 80, tone: "Workmanlike" },
  { label: "80–100", lo: 80, hi: 100, tone: "Considered" },
];

export default function ScoreDistribution({ rows }: { rows: Row[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hover, setHover] = useState<number | null>(null);

  /* Canonical market-cap rank — same anonymisation policy as the rest
     of the report. House 01 = largest by market cap. */
  const rankByDomain = useMemo(() => {
    const byMcap = [...rows].sort(
      (a, b) => b.brand.marketCapCr - a.brand.marketCapCr
    );
    return new Map(byMcap.map((r, i) => [r.brand.domain, i + 1]));
  }, [rows]);

  const buckets = useMemo(() => {
    return BANDS.map((b) => {
      const members = rows
        .filter((r) => isAudit(r.audit))
        .filter((r) => {
          const s = (r.audit as { score: number }).score;
          return s >= b.lo && s < b.hi;
        });
      return { ...b, members };
    });
  }, [rows]);

  const maxCount = Math.max(1, ...buckets.map((b) => b.members.length));

  return (
    <div ref={ref} className="relative">
      <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
      <div className="grid grid-cols-5 gap-3 md:gap-6 items-end h-[280px] md:h-[340px] min-w-[480px] md:min-w-0">
        {buckets.map((b, i) => {
          const count = b.members.length;
          const heightPct = (count / maxCount) * 100;
          return (
            <button
              key={b.label}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="group relative h-full flex flex-col justify-end text-left cursor-default"
            >
              <span className="absolute -top-2 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">
                {count > 0 ? count : ""}
              </span>
              <motion.div
                className="w-full rounded-t-sm"
                style={{
                  background:
                    i < 2
                      ? "linear-gradient(180deg, rgba(138,106,53,0.4) 0%, rgba(138,106,53,0.7) 100%)"
                      : i < 4
                      ? "linear-gradient(180deg, rgba(138,106,53,0.55) 0%, rgba(138,106,53,0.85) 100%)"
                      : "linear-gradient(180deg, #8a6a35 0%, #c9a96e 100%)",
                  transformOrigin: "bottom",
                }}
                initial={{ height: 0 }}
                animate={inView ? { height: `${heightPct}%` } : { height: 0 }}
                transition={{
                  duration: 1.0,
                  delay: 0.1 + i * 0.08,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
              />
              <div className="mt-3 pt-3 border-t border-border">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">
                  {b.label}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim mt-1 leading-tight">
                  {b.tone}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      </div>

      {/* Hover detail panel — replaces the chart's caption with the
          brands in the highlighted band when one is selected. */}
      <div className="mt-8 min-h-[3rem]">
        {hover !== null && buckets[hover].members.length > 0 ? (
          <div className="border-t border-border pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              {buckets[hover].label} · {buckets[hover].tone}
            </span>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {buckets[hover].members.map((m) => {
                const rank = rankByDomain.get(m.brand.domain) ?? 0;
                return (
                <li
                  key={m.brand.domain}
                  className="font-serif text-base md:text-lg text-text"
                >
                  House {String(rank).padStart(2, "0")}
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint ml-2">
                    {isAudit(m.audit) && m.audit.score} / 100
                  </span>
                </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
            Hover a band to see the houses in it.
          </p>
        )}
      </div>
    </div>
  );
}
