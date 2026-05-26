"use client";

/* HouseConstellation — a quiet hero visual for the report masthead.
   Seven dots, one per jewellery house. X position = market-cap rank
   (biggest left). Y position = Sheenhaus audit score (higher = better
   digital craft). Dot size = market capitalisation. The single chart
   tells the report's whole thesis at a glance: financial size does
   not correlate with digital quality. Unreachable houses (Tanishq)
   appear as a dashed ring above the chart, off-axis. */

import { motion } from "framer-motion";
import { type Row, isAudit, isUnreachable } from "./types";

const W = 880;
const H = 260;
const PAD_X = 72;
const PAD_TOP = 36;
const PAD_BOT = 64;

function yForScore(s: number): number {
  const t = Math.max(0, Math.min(100, s)) / 100;
  return H - PAD_BOT - t * (H - PAD_BOT - PAD_TOP);
}

function rForMcap(mcap: number, minMcap: number, maxMcap: number): number {
  // sqrt scale — premium-house spread is wide (Tanishq parent dwarfs the rest)
  const a = Math.sqrt(Math.max(1, mcap));
  const lo = Math.sqrt(Math.max(1, minMcap));
  const hi = Math.sqrt(Math.max(1, maxMcap));
  const t = (a - lo) / Math.max(0.0001, hi - lo);
  return 5 + t * 14; // 5..19 px radius
}

export default function HouseConstellation({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null;

  // Sort by market cap descending — biggest brand on the left
  const sorted = [...rows].sort(
    (a, b) => b.brand.marketCapCr - a.brand.marketCapCr
  );

  const stepX = (W - 2 * PAD_X) / Math.max(1, sorted.length - 1);
  const maxMcap = Math.max(...sorted.map((r) => r.brand.marketCapCr));
  const minMcap = Math.min(...sorted.map((r) => r.brand.marketCapCr));

  const points = sorted.map((r, i) => {
    const audit = isAudit(r.audit) ? r.audit : null;
    const blocked = isUnreachable(r.audit);
    const score = audit?.score ?? null;
    const x = PAD_X + i * stepX;
    // Blocked houses float just below the top edge, separate from scored points
    const y = score !== null ? yForScore(score) : PAD_TOP - 12;
    const radius = rForMcap(r.brand.marketCapCr, minMcap, maxMcap);
    // Anonymised label by market-cap rank. Brand names omitted for legal
    // restraint — the editorial point is the *category*, not any one house.
    const rankLabel = `HOUSE ${String(i + 1).padStart(2, "0")}`;
    return { x, y, radius, score, blocked, brand: r.brand, rankLabel };
  });

  // Build a connecting path through only the scored points, in their on-screen order
  const scoredPath = points
    .filter((p) => p.score !== null)
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  return (
    <motion.figure
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.0, ease: [0.2, 0.7, 0.2, 1] }}
      className="mt-12 max-w-3xl"
    >
      <div className="flex items-center justify-between mb-3 gap-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-text-faint">
          Constellation · The seven houses
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-text-faint">
          X · Market cap &nbsp;·&nbsp; Y · Sheenhaus score
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        className="block"
        aria-label="A scatter of seven jewellery houses showing market cap versus Sheenhaus audit score."
      >
        {/* "Commissioned" threshold line — score 70. Label sits BELOW
            the line on the right side, so it never collides with the
            Tanishq blocked-dot labels at the upper-left of the chart. */}
        <line
          x1={PAD_X}
          y1={yForScore(70)}
          x2={W - PAD_X}
          y2={yForScore(70)}
          stroke="rgba(138,106,53,0.32)"
          strokeWidth="0.6"
          strokeDasharray="2 4"
        />
        <text
          x={W - PAD_X - 4}
          y={yForScore(70) + 12}
          textAnchor="end"
          fontSize="9"
          fill="rgba(138,106,53,0.7)"
          fontFamily="var(--font-ibm-plex-mono), monospace"
          letterSpacing="1"
        >
          70 · COMMISSIONED
        </text>

        {/* "Drifting" line — score 50. Same right-anchored treatment. */}
        <line
          x1={PAD_X}
          y1={yForScore(50)}
          x2={W - PAD_X}
          y2={yForScore(50)}
          stroke="rgba(26,22,18,0.10)"
          strokeWidth="0.6"
        />
        <text
          x={W - PAD_X - 4}
          y={yForScore(50) + 12}
          textAnchor="end"
          fontSize="9"
          fill="rgba(26,22,18,0.45)"
          fontFamily="var(--font-ibm-plex-mono), monospace"
          letterSpacing="1"
        >
          50 · DRIFTING
        </text>

        {/* Connecting path — the trajectory of the category as you walk from biggest to smallest */}
        {scoredPath && (
          <motion.path
            d={scoredPath}
            fill="none"
            stroke="rgba(138,106,53,0.45)"
            strokeWidth="0.8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          />
        )}

        {/* The dots */}
        {points.map((p, i) => {
          const labelY = Math.min(H - 38, p.y + p.radius + 18);
          return (
            <g key={p.brand.ticker || i}>
              {p.blocked ? (
                <>
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r={p.radius}
                    fill="none"
                    stroke="rgba(26,22,18,0.4)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + i * 0.08,
                      ease: [0.2, 0.7, 0.2, 1],
                    }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  />
                  <text
                    x={p.x}
                    y={p.y + p.radius + 14}
                    textAnchor="middle"
                    fontSize="9"
                    fill="rgba(26,22,18,0.55)"
                    fontFamily="var(--font-ibm-plex-mono), monospace"
                    letterSpacing="1"
                  >
                    NOT MEASURED
                  </text>
                </>
              ) : (
                <>
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r={p.radius}
                    fill="#8a6a35"
                    opacity={0.85}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.85 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.4 + i * 0.08,
                      ease: [0.2, 0.7, 0.2, 1],
                    }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  />
                  <text
                    x={p.x}
                    y={p.y - p.radius - 6}
                    textAnchor="middle"
                    fontSize="11"
                    fill="var(--cl-ink)"
                    fontFamily="var(--font-ibm-plex-mono), monospace"
                    letterSpacing="0.5"
                  >
                    {p.score}
                  </text>
                </>
              )}
              {/* Anonymised house rank beneath */}
              <text
                x={p.x}
                y={labelY + 16}
                textAnchor="middle"
                fontSize="9"
                fill="rgba(26,22,18,0.55)"
                fontFamily="var(--font-ibm-plex-mono), monospace"
                letterSpacing="0.5"
              >
                {p.rankLabel}
              </text>
            </g>
          );
        })}

        {/* X axis hairline */}
        <line
          x1={PAD_X}
          y1={H - PAD_BOT}
          x2={W - PAD_X}
          y2={H - PAD_BOT}
          stroke="rgba(26,22,18,0.15)"
          strokeWidth="0.6"
        />
        {/* X axis endpoint labels */}
        <text
          x={PAD_X}
          y={H - 10}
          fontSize="9"
          fill="rgba(26,22,18,0.45)"
          fontFamily="var(--font-ibm-plex-mono), monospace"
          letterSpacing="1"
        >
          ← BIGGEST OFFLINE
        </text>
        <text
          x={W - PAD_X}
          y={H - 10}
          textAnchor="end"
          fontSize="9"
          fill="rgba(26,22,18,0.45)"
          fontFamily="var(--font-ibm-plex-mono), monospace"
          letterSpacing="1"
        >
          SMALLEST →
        </text>
      </svg>

      <figcaption className="mt-4 text-[12px] leading-[1.7] text-text-mid italic font-serif max-w-[60ch]">
        Dot size scales with market capitalisation. The largest house, by some
        distance, is the one we could not audit at all.
      </figcaption>
    </motion.figure>
  );
}

/* Shorten brand names for the small mono label */
function abbreviate(name: string): string {
  // Common patterns: "Titan Company Ltd", "P. N. Gadgil Jewellers", "Kalyan Jewellers India Ltd"
  return name
    .replace(/\b(Limited|Ltd\.?|Company|Co\.?|India|Pvt|Private)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()
    .slice(0, 14);
}
