"use client";

// Horizontal bars — one row per Sign, length = % of the sample
// exhibiting that sign. Sorted by prevalence (most common first).
// Each row sweeps right on scroll-in.

import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { isAudit, type Row } from "./types";

const ALL_SIGNS: Array<{ num: string; title: string }> = [
  { num: "01", title: "Built on a template / page-builder stack" },
  { num: "02", title: "Popups, modals, or chat widgets at arrival" },
  { num: "03", title: "Autoplay video in the hero" },
  { num: "04", title: "Stock photography from common providers" },
  { num: "05", title: "Exposed CMS scaffolding in URLs" },
  { num: "06", title: "Too many font weights — type system not under control" },
  { num: "07", title: "Bloated contact form (4+ fields)" },
  { num: "08", title: "Heavy use of 'Solutions' / generic B2B copy" },
  { num: "09", title: "Testimonial carousel or homepage hero rotator" },
  { num: "10", title: "Page loads slowly on cellular" },
  { num: "11", title: "Same hero photograph reused across pages" },
  { num: "12", title: "Missing structured data for AI discoverability" },
];

export default function SignPrevalence({ rows }: { rows: Row[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [hover, setHover] = useState<string | null>(null);

  /* Canonical market-cap rank — anonymisation policy applied here too. */
  const rankByDomain = useMemo(() => {
    const byMcap = [...rows].sort(
      (a, b) => b.brand.marketCapCr - a.brand.marketCapCr
    );
    return new Map(byMcap.map((r, i) => [r.brand.domain, i + 1]));
  }, [rows]);

  const data = useMemo(() => {
    const auditable = rows.filter((r) => isAudit(r.audit));
    const total = auditable.length || 1;
    return ALL_SIGNS.map((s) => {
      const hits = auditable.filter((r) =>
        (r.audit as { signs: Array<{ num: string }> }).signs.some(
          (h) => h.num === s.num
        )
      );
      return {
        ...s,
        count: hits.length,
        pct: Math.round((hits.length / total) * 100),
        hits,
      };
    }).sort((a, b) => b.count - a.count);
  }, [rows]);

  return (
    <div ref={ref}>
      <ul className="divide-y divide-border">
        {data.map((s, i) => {
          const isHovered = hover === s.num;
          return (
            <li
              key={s.num}
              onMouseEnter={() => setHover(s.num)}
              onMouseLeave={() => setHover(null)}
              className="py-5"
            >
              <Link
                href={`/signs#${s.num}`}
                className="block group"
                aria-label={`Read the essay on sign ${s.num}: ${s.title}`}
              >
                <div className="grid grid-cols-[28px_1fr_44px] gap-3 md:grid-cols-[40px_1fr_60px] md:gap-6 items-baseline">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-text-dim">
                    {s.num}
                  </span>
                  <span className="font-serif text-base md:text-lg leading-tight text-text group-hover:text-accent transition-colors duration-500">
                    {s.title}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.18em] text-text-mid text-right tabular-nums">
                    {s.pct}%
                  </span>
                </div>
                <div className="mt-3 ml-[40px] md:ml-[64px] h-px bg-border overflow-hidden">
                  <motion.div
                    className="h-full origin-left"
                    style={{
                      background:
                        s.pct >= 80
                          ? "linear-gradient(90deg, #8a6a35 0%, #c9a96e 100%)"
                          : s.pct >= 50
                          ? "linear-gradient(90deg, rgba(138,106,53,0.85) 0%, #8a6a35 100%)"
                          : "linear-gradient(90deg, rgba(138,106,53,0.5) 0%, rgba(138,106,53,0.85) 100%)",
                      width: `${s.pct}%`,
                      height: "2px",
                      marginTop: "-1px",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{
                      duration: 1.0,
                      delay: 0.15 + i * 0.06,
                      ease: [0.2, 0.7, 0.2, 1],
                    }}
                  />
                </div>
                {isHovered && s.hits.length > 0 && (
                  <div className="mt-3 ml-[40px] md:ml-[64px]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">
                      {s.hits
                        .map((h) => {
                          const rank = rankByDomain.get(h.brand.domain) ?? 0;
                          return `House ${String(rank).padStart(2, "0")}`;
                        })
                        .slice(0, 4)
                        .join(" · ")}
                      {s.hits.length > 4 && ` · +${s.hits.length - 4} more`}
                    </span>
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
