"use client";

/* SystemDiagram — the studio's pipeline, drawn behind the hero, with
 * interactive nodes that describe each stage on hover.
 *
 * Six nodes (BRIEF → AUDIT → BUILD → AGENT → DEPLOY → AUTO) sit around
 * the perimeter and connect in a clockwise cycle of bezier hairlines.
 *
 * Always-on motion:
 *   • Small bronze data packets traverse each path on staggered loops
 *     via native SVG <animateMotion>, so the diagram looks alive at
 *     idle.
 *   • Nodes with status="run" pulse their status dot.
 *
 * Hover:
 *   • Hovered node card gains a brighter stroke + scale-up.
 *   • A bronze "ping" radiates outward from the node.
 *   • The two adjacent edges brighten and thicken.
 *   • A small mono description card appears next to the node with the
 *     stage's role.
 *
 * Cropping:
 *   ViewBox is 1200×800 with `xMidYMid slice` so the SVG fills the
 *   section by cropping the longer axis. All interactive elements are
 *   inset well inside x: 280–920 / y: 100–720 so they remain visible at
 *   common viewport sizes (mobile aside — see reduced-motion path).
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Node {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  status: "ok" | "run" | "queue";
}

const NODES: Node[] = [
  {
    id: "brief",
    label: "BRIEF",
    description: "Goals, audience, success metrics. The pitch we accept or decline.",
    x: 340,
    y: 130,
    status: "queue",
  },
  {
    id: "audit",
    label: "AUDIT",
    description: "Lighthouse, schema, AI visibility. Twelve signs scored.",
    x: 860,
    y: 130,
    status: "run",
  },
  {
    id: "build",
    label: "BUILD",
    description: "Hand-coded. Cinematic where it earns it. AI-native from line one.",
    x: 900,
    y: 400,
    status: "run",
  },
  {
    id: "agent",
    label: "AGENT",
    description: "Workflows behind the surface. Intake, routing, internal tools.",
    x: 860,
    y: 670,
    status: "ok",
  },
  {
    id: "deploy",
    label: "DEPLOY",
    description: "Ship, monitor, measure. Lighthouse 95+ before launch.",
    x: 340,
    y: 670,
    status: "ok",
  },
  {
    id: "auto",
    label: "AUTO",
    description: "Ongoing systems running themselves once the site converts.",
    x: 300,
    y: 400,
    status: "ok",
  },
];

interface Edge {
  id: string;
  from: string;
  to: string;
  d: string;
}

const EDGES: Edge[] = [
  { id: "brief-audit",    from: "brief",    to: "audit",    d: "M 388 130 C 500 60, 700 60, 812 130" },
  { id: "audit-build",    from: "audit",    to: "build",    d: "M 860 145 C 920 220, 940 320, 900 385" },
  { id: "build-agent",    from: "build",    to: "agent",    d: "M 900 415 C 940 480, 920 580, 860 655" },
  { id: "agent-deploy",   from: "agent",    to: "deploy",   d: "M 812 670 C 700 740, 500 740, 388 670" },
  { id: "deploy-auto",    from: "deploy",   to: "auto",     d: "M 340 655 C 260 580, 260 480, 300 415" },
  { id: "auto-brief",     from: "auto",     to: "brief",    d: "M 300 385 C 260 320, 260 220, 340 145" },
];

const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

export default function SystemDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);

  const adjacentEdgeIds = hovered
    ? EDGES.filter((e) => e.from === hovered || e.to === hovered).map((e) => e.id)
    : [];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0"
      aria-hidden
      style={{
        overflow: "hidden",
        /* Container itself doesn't capture events — only the
           rendered (filled) shapes inside do. SVG elements with
           fill="none" naturally pass clicks through, so the
           connecting paths and registration marks won't block the
           CTAs underneath the central typography. */
        pointerEvents: "auto",
      }}
    >
      {/* ── Corner registration marks ─────────────────────────── */}
      {[
        { x: 250, y: 70 },
        { x: 950, y: 70 },
        { x: 950, y: 730 },
        { x: 250, y: 730 },
      ].map((c, i) => (
        <motion.g
          key={`reg-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }}
          style={{ pointerEvents: "none" }}
        >
          <line x1={c.x - 6} y1={c.y} x2={c.x + 6} y2={c.y} stroke="#8a6a35" strokeWidth="0.8" />
          <line x1={c.x} y1={c.y - 6} x2={c.x} y2={c.y + 6} stroke="#8a6a35" strokeWidth="0.8" />
          <circle cx={c.x} cy={c.y} r="2.2" fill="none" stroke="#8a6a35" strokeWidth="0.6" />
        </motion.g>
      ))}

      {/* ── Connecting paths ──────────────────────────────────── */}
      {EDGES.map((e, i) => {
        const isAdjacent = adjacentEdgeIds.includes(e.id);
        return (
          <motion.path
            key={e.id}
            d={e.d}
            stroke={isAdjacent ? "rgba(138,106,53,0.85)" : "rgba(138,106,53,0.4)"}
            strokeWidth={isAdjacent ? 1.4 : 0.9}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 1.3, delay: 0.4 + i * 0.18, ease: [0.4, 0, 0.4, 1] },
              opacity: { duration: 0.5, delay: 0.4 + i * 0.18 },
              stroke: { duration: 0.25 },
              strokeWidth: { duration: 0.25 },
            }}
            style={{ pointerEvents: "none" }}
          />
        );
      })}

      {/* ── Data packets — slow continuous flow ──────────────── */}
      {EDGES.map((e, i) => (
        <g key={`pkt-${e.id}`} style={{ pointerEvents: "none" }}>
          <circle r="2.6" fill="#8a6a35" opacity="0">
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.06;0.94;1"
              dur="5.2s"
              begin={`${2.4 + i * 0.62}s`}
              repeatCount="indefinite"
            />
            <animateMotion
              path={e.d}
              dur="5.2s"
              begin={`${2.4 + i * 0.62}s`}
              repeatCount="indefinite"
              rotate="auto"
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.42 0 0.58 1"
            />
          </circle>
          <circle r="5" fill="rgba(138,106,53,0.18)" opacity="0">
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.06;0.94;1"
              dur="5.2s"
              begin={`${2.4 + i * 0.62}s`}
              repeatCount="indefinite"
            />
            <animateMotion
              path={e.d}
              dur="5.2s"
              begin={`${2.4 + i * 0.62}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* ── Nodes ────────────────────────────────────────────── */}
      {NODES.map((n, i) => (
        <NodeCard
          key={n.id}
          node={n}
          delay={0.8 + i * 0.14}
          index={i}
          isHovered={hovered === n.id}
          onHover={(id) => setHovered(id)}
        />
      ))}

      {/* ── Hover description card ───────────────────────────── */}
      <AnimatePresence>
        {hovered && (
          <HoverInfo node={NODE_BY_ID[hovered]} />
        )}
      </AnimatePresence>

      {/* ── Edition stamp ────────────────────────────────────── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.0, delay: 2.6 }}
        style={{ pointerEvents: "none" }}
      >
        <text
          x={920}
          y={770}
          fontFamily="var(--font-ibm-plex-mono), monospace"
          fontSize="9"
          letterSpacing="2"
          fill="rgba(138,106,53,0.7)"
          textAnchor="end"
        >
          Pipeline · v1 · 2026
        </text>
      </motion.g>
    </svg>
  );
}

/* ── Node card with hover state ───────────────────────────── */
function NodeCard({
  node,
  delay,
  index,
  isHovered,
  onHover,
}: {
  node: Node;
  delay: number;
  index: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const statusFill =
    node.status === "ok"
      ? "#8a6a35"
      : node.status === "run"
      ? "#c9a96e"
      : "#8a7d68";
  const w = Math.max(96, node.label.length * 9 + 36);
  const h = 30;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
      style={{
        cursor: "default",
        transformBox: "fill-box",
        transformOrigin: "center",
      }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Invisible larger hit-zone so the hover doesn't flicker
          when crossing internal edges. */}
      <rect
        x={node.x - w / 2 - 6}
        y={node.y - h / 2 - 6}
        width={w + 12}
        height={h + 12}
        fill="transparent"
        style={{ pointerEvents: "auto" }}
      />

      {/* "Ping" — expanding ring on hover, restarts each time */}
      {isHovered && (
        <motion.circle
          key={`ping-${Math.random()}`}
          cx={node.x}
          cy={node.y}
          r={h / 2}
          fill="none"
          stroke="rgba(201,169,110,0.8)"
          strokeWidth="1"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 2.4 }}
          transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
        />
      )}

      {/* Card outline + cream fill */}
      <motion.rect
        x={node.x - w / 2}
        y={node.y - h / 2}
        width={w}
        height={h}
        rx={1.5}
        fill="rgba(244,239,230,0.95)"
        stroke={isHovered ? "rgba(138,106,53,0.95)" : "rgba(138,106,53,0.55)"}
        strokeWidth={isHovered ? 1.2 : 0.8}
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      />

      {/* Step number — top-left of the card */}
      <text
        x={node.x - w / 2 + 7}
        y={node.y - h / 2 + 9}
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="6.5"
        letterSpacing="1"
        fill={isHovered ? "rgba(138,106,53,0.95)" : "rgba(138,106,53,0.65)"}
        style={{ pointerEvents: "none" }}
      >
        {String(index + 1).padStart(2, "0")}
      </text>

      {/* Status indicator dot */}
      {node.status === "run" ? (
        <motion.circle
          cx={node.x - w / 2 + 12}
          cy={node.y + 2}
          r="2.4"
          fill={statusFill}
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.8, repeat: Infinity, delay }}
          style={{ pointerEvents: "none" }}
        />
      ) : (
        <circle
          cx={node.x - w / 2 + 12}
          cy={node.y + 2}
          r="2.2"
          fill={statusFill}
          opacity={node.status === "ok" ? 0.85 : 0.5}
          style={{ pointerEvents: "none" }}
        />
      )}

      {/* Label */}
      <text
        x={node.x + 8}
        y={node.y + 3.5}
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="10"
        letterSpacing="2.4"
        fill={isHovered ? "rgba(60,40,16,1)" : "rgba(138,106,53,0.9)"}
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
      >
        {node.label}
      </text>
    </motion.g>
  );
}

/* ── Hover info — small card with description ─────────────── */
function HoverInfo({ node }: { node: Node }) {
  /* Position the info card adaptively based on which side of the
     diagram the node is on, so it never floats off-screen. */
  const onLeftSide = node.x < 600;
  const cardW = 270;
  const cardH = 70;
  const cardX = onLeftSide ? node.x + 60 : node.x - 60 - cardW;
  const cardY = node.y - cardH / 2;
  /* Connector line from node card edge to info card. */
  const lineX1 = onLeftSide ? node.x + 50 : node.x - 50;
  const lineX2 = onLeftSide ? cardX : cardX + cardW;

  return (
    <motion.g
      initial={{ opacity: 0, x: onLeftSide ? -6 : 6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: onLeftSide ? -4 : 4 }}
      transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
      style={{ pointerEvents: "none" }}
    >
      {/* Connector */}
      <line
        x1={lineX1}
        y1={node.y}
        x2={lineX2}
        y2={node.y}
        stroke="rgba(138,106,53,0.7)"
        strokeWidth="0.8"
        strokeDasharray="2 3"
      />
      <circle cx={lineX2} cy={node.y} r="2" fill="#8a6a35" />

      {/* Card */}
      <rect
        x={cardX}
        y={cardY}
        width={cardW}
        height={cardH}
        rx={2}
        fill="rgba(244,239,230,0.97)"
        stroke="rgba(138,106,53,0.6)"
        strokeWidth="0.8"
      />
      {/* "Stage" eyebrow */}
      <text
        x={cardX + 12}
        y={cardY + 14}
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="7"
        letterSpacing="2.5"
        fill="rgba(138,106,53,0.7)"
      >
        STAGE · {node.label}
      </text>
      {/* Description — wrapped manually into two lines for SVG */}
      {wrapDescription(node.description, 38).map((line, i) => (
        <text
          key={i}
          x={cardX + 12}
          y={cardY + 32 + i * 14}
          fontFamily="var(--font-instrument-serif), Georgia, serif"
          fontSize="12"
          fill="rgba(26,22,18,0.92)"
        >
          {line}
        </text>
      ))}
    </motion.g>
  );
}

/* Naive line-wrap for the SVG <text> (no flex / word-wrap in SVG). */
function wrapDescription(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > maxChars) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
    if (lines.length === 1 && current.length > maxChars) break;
  }
  if (current && lines.length < 2) lines.push(current);
  return lines.slice(0, 2);
}
