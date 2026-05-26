"use client";

/* DraftingGrid — luxury-CAD background.
 *
 * A bronze hairline grid on cream — like an architect's drafting paper.
 * Subtle by default; alive when you interact with it.
 *
 * Layers (back to front):
 *   1. Minor grid lines — 80px squares, ~6% bronze
 *   2. Major grid lines — every 5 cells (400px), ~10% bronze, slightly thicker
 *   3. Random cell illuminations — every ~2.5s a single cell briefly
 *      gains ~7-10% opacity then fades, like a surveyor's measurement
 *      tick on the page
 *   4. Cursor crosshair — thin dashed hairlines extending from cursor to
 *      the grid edges, with the *nearest grid intersection* highlighted
 *      by a small bronze dot
 *   5. Coordinate readout — a tiny mono "x · y" label following the
 *      cursor, like a CAD program reporting position
 *
 * Entrance:
 *   Grid lines sweep in from left to right over ~1.3s on mount.
 *
 * Reduced motion: static grid, no crosshair, no lights.
 */

import { useEffect, useRef } from "react";

interface CellLight {
  col: number;
  row: number;
  born: number;
  life: number;
  peakAlpha: number;
}

interface Props {
  cellSize?: number;
  /** Width of the alley around the typography where the grid is dimmed
      so the headline / CTAs always read clearly. Set to 0 to disable. */
  centerFadeRadius?: number;
}

export default function DraftingGrid({
  cellSize = 80,
  centerFadeRadius = 320,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const coord = coordRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let revealStart = performance.now();
    let lastSpawn = performance.now();
    /* `overContent` mirrors the same content-hit-test used for the
       coord readout — when true, suppress ALL crosshair drawing too. */
    const mouse = { x: -1e6, y: -1e6, active: false, overContent: false };
    const lights: CellLight[] = [];
    let rafId = 0;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* Pre-computed paths reduce per-frame work. */
    const drawGrid = (reveal: number) => {
      const cutoff = W * reveal;
      // Minor lines
      ctx.strokeStyle = "rgba(138,106,53,0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Vertical
      for (let x = 0; x <= W; x += cellSize) {
        if (x > cutoff) break;
        const sx = Math.floor(x) + 0.5;
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, H);
      }
      // Horizontal
      for (let y = 0; y <= H; y += cellSize) {
        const sy = Math.floor(y) + 0.5;
        ctx.moveTo(0, sy);
        ctx.lineTo(cutoff, sy);
      }
      ctx.stroke();

      // Major lines (every 5 cells = 400px)
      ctx.strokeStyle = "rgba(138,106,53,0.13)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= W; x += cellSize * 5) {
        if (x > cutoff) break;
        const sx = Math.floor(x) + 0.5;
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, H);
      }
      for (let y = 0; y <= H; y += cellSize * 5) {
        const sy = Math.floor(y) + 0.5;
        ctx.moveTo(0, sy);
        ctx.lineTo(cutoff, sy);
      }
      ctx.stroke();
    };

    const drawLights = (now: number) => {
      for (let i = lights.length - 1; i >= 0; i--) {
        const l = lights[i];
        const t = (now - l.born) / l.life;
        if (t >= 1) {
          lights.splice(i, 1);
          continue;
        }
        // sin curve so it fades in and out smoothly
        const alpha = Math.sin(t * Math.PI) * l.peakAlpha;
        ctx.fillStyle = `rgba(138,106,53,${alpha})`;
        ctx.fillRect(l.col * cellSize, l.row * cellSize, cellSize, cellSize);
      }
    };

    const drawCrosshair = () => {
      if (!mouse.active || mouse.overContent) return;

      ctx.strokeStyle = "rgba(138,106,53,0.32)";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(0, mouse.y);
      ctx.lineTo(W, mouse.y);
      ctx.moveTo(mouse.x, 0);
      ctx.lineTo(mouse.x, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Nearest grid intersection
      const nx = Math.round(mouse.x / cellSize) * cellSize;
      const ny = Math.round(mouse.y / cellSize) * cellSize;
      // Distance hairline (cursor to nearest intersection)
      ctx.strokeStyle = "rgba(138,106,53,0.55)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      // The intersection dot
      ctx.fillStyle = "rgba(138,106,53,0.9)";
      ctx.beginPath();
      ctx.arc(nx, ny, 3.2, 0, Math.PI * 2);
      ctx.fill();
      // Inner highlight
      ctx.fillStyle = "rgba(255,240,210,0.7)";
      ctx.beginPath();
      ctx.arc(nx, ny, 1.2, 0, Math.PI * 2);
      ctx.fill();
    };

    /* Centre fade — multiplicative cream wipe in the middle so the
       grid never competes with the headline / CTAs. */
    const drawCenterFade = () => {
      if (!centerFadeRadius) return;
      const cx = W / 2;
      const cy = H / 2;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerFadeRadius);
      grad.addColorStop(0, "rgba(244,239,230,0.78)");
      grad.addColorStop(0.55, "rgba(244,239,230,0.5)");
      grad.addColorStop(1, "rgba(244,239,230,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    };

    const spawnLight = (now: number) => {
      const cols = Math.floor(W / cellSize);
      const rows = Math.floor(H / cellSize);
      // Prefer cells away from the center so they don't fight the headline
      const cx = cols / 2;
      const cy = rows / 2;
      for (let attempt = 0; attempt < 6; attempt++) {
        const c = Math.floor(Math.random() * cols);
        const r = Math.floor(Math.random() * rows);
        const dist = Math.hypot(c - cx, r - cy);
        if (dist > cols * 0.18 || attempt === 5) {
          lights.push({
            col: c,
            row: r,
            born: now,
            life: 1400 + Math.random() * 1600,
            peakAlpha: 0.07 + Math.random() * 0.06,
          });
          return;
        }
      }
    };

    const loop = (now: number) => {
      ctx.clearRect(0, 0, W, H);

      const elapsed = (now - revealStart) / 1000;
      const revealRaw = Math.min(1, elapsed / 1.3);
      // ease out cubic
      const reveal = 1 - Math.pow(1 - revealRaw, 3);

      drawGrid(reveal);
      drawCenterFade();
      drawLights(now);
      drawCrosshair();

      if (now - lastSpawn > 2200 + Math.random() * 2200) {
        spawnLight(now);
        lastSpawn = now;
      }

      rafId = requestAnimationFrame(loop);
    };

    /* Hide the coord readout when the cursor sits over real content
       (headline, subhead, CTAs, code stream, nav). The crosshair itself
       keeps drawing so the grid still feels alive. */
    const CONTENT_SEL = "h1, h2, h3, p, a, button, nav, label, input, textarea, code";

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // Only count "in bounds" hovers — otherwise crosshair shows when
      // cursor is over other sections.
      mouse.active = x >= 0 && y >= 0 && x <= W && y <= H;
      mouse.x = x;
      mouse.y = y;

      if (mouse.active) {
        const hit = document.elementFromPoint(e.clientX, e.clientY);
        mouse.overContent = !!hit?.closest(CONTENT_SEL);
      } else {
        mouse.overContent = false;
      }

      if (coord && mouse.active && !mouse.overContent) {
        coord.style.left = `${x + 14}px`;
        coord.style.top = `${y + 14}px`;
        coord.style.opacity = "0.9";
        coord.textContent = `x ${Math.round(x)} · y ${Math.round(y)}`;
      } else if (coord) {
        coord.style.opacity = "0";
      }
    };
    const onLeave = () => {
      mouse.active = false;
      if (coord) coord.style.opacity = "0";
    };

    resize();

    if (reduced) {
      drawGrid(1);
      drawCenterFade();
      return () => {};
    }

    const ro = new ResizeObserver(() => {
      resize();
      revealStart = performance.now(); // re-sweep on resize so the new area animates in
    });
    ro.observe(wrap);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) cancelAnimationFrame(rafId);
        else rafId = requestAnimationFrame(loop);
      }
    );

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [cellSize, centerFadeRadius]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      {/* Coordinate readout — DOM text following the cursor */}
      <div
        ref={coordRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: 0,
          transition: "opacity 0.25s ease",
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(138,106,53,0.95)",
          pointerEvents: "none",
          background: "rgba(244,239,230,0.85)",
          padding: "2px 6px",
          borderRadius: 2,
          border: "0.5px solid rgba(138,106,53,0.35)",
          whiteSpace: "nowrap",
        }}
      >
        x 0 · y 0
      </div>
    </div>
  );
}
