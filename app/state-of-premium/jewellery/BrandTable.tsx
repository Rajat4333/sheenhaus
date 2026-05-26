"use client";

/* Anonymised per-house table. Brand names, tickers and domains are
   omitted by editorial choice — the report is a study of the category,
   not of any one company. Houses are labelled by their rank in
   descending market capitalisation (House 01 = largest). */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { isAudit, isUnreachable, type Row } from "./types";

type SortKey = "score" | "marketCap" | "qtrSales";

export default function BrandTable({ rows }: { rows: Row[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [asc, setAsc] = useState(false);

  /* Canonical market-cap rank — assigned once, used everywhere even
     if the user sorts by a different column. */
  const rankByDomain = useMemo(() => {
    const byMcap = [...rows].sort(
      (a, b) => b.brand.marketCapCr - a.brand.marketCapCr
    );
    return new Map(byMcap.map((r, i) => [r.brand.domain, i + 1]));
  }, [rows]);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let av = 0;
      let bv = 0;
      switch (sortKey) {
        case "score":
          av = isAudit(a.audit) ? a.audit.score : -1;
          bv = isAudit(b.audit) ? b.audit.score : -1;
          break;
        case "marketCap":
          av = a.brand.marketCapCr;
          bv = b.brand.marketCapCr;
          break;
        case "qtrSales":
          av = a.brand.qtrSalesCr;
          bv = b.brand.qtrSalesCr;
          break;
      }
      return asc ? av - bv : bv - av;
    });
    return copy;
  }, [rows, sortKey, asc]);

  const setSort = (k: SortKey) => {
    if (k === sortKey) setAsc(!asc);
    else {
      setSortKey(k);
      setAsc(false);
    }
  };

  return (
    <div>
      {/* Sort controls — quiet mono buttons */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
        <span>Sort by</span>
        <SortBtn label="Audit score" k="score" current={sortKey} asc={asc} onClick={setSort} />
        <SortBtn label="Market cap" k="marketCap" current={sortKey} asc={asc} onClick={setSort} />
        <SortBtn label="Qtr sales" k="qtrSales" current={sortKey} asc={asc} onClick={setSort} />
      </div>

      <ul className="divide-y divide-border border-t border-border">
        {sorted.map((r, i) => {
          const rank = rankByDomain.get(r.brand.domain) ?? 0;
          return (
          <motion.li
            key={r.brand.domain}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.04,
              ease: [0.2, 0.7, 0.2, 1],
            }}
            className="py-6 grid grid-cols-1 md:grid-cols-[1.6fr_0.8fr_0.9fr_1fr] gap-3 md:gap-6 items-baseline"
          >
            {/* House — anonymised rank label only */}
            <div>
              <div className="font-serif text-lg md:text-xl text-text leading-tight">
                House {String(rank).padStart(2, "0")}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint mt-1">
                By market cap · publicly listed
              </div>
            </div>

            {/* Market cap */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">
                Market cap
              </div>
              <div className="font-serif text-base text-text mt-1 tabular-nums">
                ₹{(r.brand.marketCapCr / 1000).toFixed(1)}k cr
              </div>
            </div>

            {/* Qtr sales */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">
                Quarterly sales
              </div>
              <div className="font-serif text-base text-text mt-1 tabular-nums">
                ₹{r.brand.qtrSalesCr.toLocaleString("en-IN", { maximumFractionDigits: 0 })} cr
              </div>
            </div>

            {/* Audit score */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">
                Sheenhaus Score
              </div>
              {isAudit(r.audit) ? (
                <div className="flex items-baseline gap-3 mt-1">
                  <span
                    className="font-serif text-2xl md:text-3xl tabular-nums leading-none"
                    style={{
                      color:
                        r.audit.score >= 70
                          ? "var(--color-accent)"
                          : "var(--color-text)",
                    }}
                  >
                    {r.audit.score}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">
                    {r.audit.signs.length} signs
                  </span>
                </div>
              ) : isUnreachable(r.audit) ? (
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mt-2">
                  Not measured · {r.audit.reason}
                </div>
              ) : (
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint mt-2">
                  —
                </div>
              )}
            </div>
          </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function SortBtn({
  label,
  k,
  current,
  asc,
  onClick,
}: {
  label: string;
  k: SortKey;
  current: SortKey;
  asc: boolean;
  onClick: (k: SortKey) => void;
}) {
  const active = k === current;
  return (
    <button
      type="button"
      onClick={() => onClick(k)}
      className={`font-mono uppercase tracking-[0.22em] transition-colors duration-500 ${
        active ? "text-accent" : "text-text-mid hover:text-text"
      }`}
    >
      {label}
      {active && <span className="ml-1.5">{asc ? "↑" : "↓"}</span>}
    </button>
  );
}
