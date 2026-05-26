"use client";

/* CurlNoiseField — animated bronze flow field on cream.
 *
 * What it is:
 *   A full-bleed canvas. ~1800 invisible particles move through a 2D
 *   curl-noise-like vector field (sampling smooth value noise and using
 *   the angle as the direction of travel). Each frame, each particle
 *   draws a 1-px bronze line segment from its previous position to its
 *   current — and the canvas is *partially* faded with a translucent
 *   cream rectangle each frame, leaving lingering tails that
 *   gracefully evaporate (~2s ghost time).
 *
 *   The cursor exerts a soft repulsion within 150px so particles bend
 *   around it like silk being parted.
 *
 *   The flow field is parameterised by a slowly-advancing time scalar
 *   so the global flow morphs over ~minutes; the pattern never
 *   repeats.
 *
 *   prefers-reduced-motion → renders a single static frame, no rAF loop.
 */

import { useEffect, useRef } from "react";

/* ─── Inline value-noise (2D + time) ─────────────────────────
 * Cheap, deterministic, no external dep. Smoothstepped value noise
 * over a small permutation table. Good-enough for the flow look. */
const P = new Uint8Array(512);
{
  const base = new Uint8Array(256);
  for (let i = 0; i < 256; i++) base[i] = i;
  // Stable shuffle with a fixed seed so the texture is consistent
  let seed = 1337;
  for (let i = 255; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) | 0;
    const j = (seed >>> 0) % (i + 1);
    const tmp = base[i];
    base[i] = base[j];
    base[j] = tmp;
  }
  for (let i = 0; i < 512; i++) P[i] = base[i & 255];
}
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function noise2d(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = P[P[X] + Y] / 255;
  const ab = P[P[X] + ((Y + 1) & 255)] / 255;
  const ba = P[P[(X + 1) & 255] + Y] / 255;
  const bb = P[P[(X + 1) & 255] + ((Y + 1) & 255)] / 255;
  return lerp(lerp(aa, ba, u), lerp(ab, bb, u), v); // 0..1
}

/* ─── Particle state ───────────────────────────────────────── */
interface Particle {
  x: number;
  y: number;
  px: number; // previous x for trail segment
  py: number; // previous y
  vx: number; // velocity (smoothed for inertia)
  vy: number;
  life: number; // 0..1 — used to respawn at random intervals so the field stays balanced
  speedMul: number; // baseline speed (slight per-particle variation)
}

interface Props {
  /** Particle count. Default 1800. Mobile reduces this automatically. */
  count?: number;
  /** CSS color of the trail line. */
  color?: string;
  /** Alpha of the cream wipe each frame (controls trail length).
      Higher = shorter tails. */
  fadeAlpha?: number;
  /** Cream fill colour for the fade. Should match the page background. */
  fadeColor?: string;
  /** Cursor repulsion radius in CSS pixels. */
  cursorRadius?: number;
  /** Class name applied to the wrapping div. */
  className?: string;
  /** Inline style for the wrapping div. */
  style?: React.CSSProperties;
}

export default function CurlNoiseField({
  count = 1800,
  color = "rgba(138,106,53,0.55)",
  fadeAlpha = 0.025,
  fadeColor = "244,239,230",
  cursorRadius = 150,
  className = "",
  style,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Mobile? Drop particle count for perf.
    const mobile = window.innerWidth < 720;
    const N = mobile ? Math.floor(count * 0.4) : count;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    const particles: Particle[] = [];
    const mouse = { x: -1e6, y: -1e6, active: false };
    let rafId = 0;
    let running = true;
    let t0 = performance.now();

    /* Size the canvas to its wrapper. Particles are reseeded on resize
       so they stay within the visible area. */
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
      // Repaint the cream backdrop fully (clears old trails on resize)
      ctx.fillStyle = `rgba(${fadeColor},1)`;
      ctx.fillRect(0, 0, W, H);
      seedParticles();
    };

    const seedParticles = () => {
      particles.length = 0;
      for (let i = 0; i < N; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        particles.push({
          x,
          y,
          px: x,
          py: y,
          vx: 0,
          vy: 0,
          life: Math.random(),
          speedMul: 0.6 + Math.random() * 0.9,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -1e6;
      mouse.y = -1e6;
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        t0 = performance.now();
        rafId = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(rafId);
      }
    };

    const NOISE_SCALE = 0.0042; // larger → tighter swirls
    const TIME_SCALE = 0.00009; // larger → flow morphs faster
    const BASE_SPEED = 0.65; // px per frame baseline
    const INERTIA = 0.86; // velocity smoothing (0..1)

    const step = (now: number) => {
      const tt = (now - t0) * TIME_SCALE;

      // Cream wipe to fade old trails. Lower alpha → longer tails.
      ctx.fillStyle = `rgba(${fadeColor},${fadeAlpha})`;
      ctx.fillRect(0, 0, W, H);

      // Single beginPath for all particles — much faster than per-particle.
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.9;
      ctx.lineCap = "round";
      ctx.beginPath();

      const r2 = cursorRadius * cursorRadius;

      for (let i = 0; i < N; i++) {
        const p = particles[i];
        // Sample noise at position + time → angle
        const n = noise2d(p.x * NOISE_SCALE, p.y * NOISE_SCALE + tt);
        const angle = n * Math.PI * 4; // full rotations
        let fx = Math.cos(angle);
        let fy = Math.sin(angle);

        // Cursor repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const strength = (1 - d / cursorRadius);
            // Push away from cursor, with falloff
            fx += (dx / d) * strength * 2.2;
            fy += (dy / d) * strength * 2.2;
          }
        }

        // Smoothed velocity (inertia)
        p.vx = p.vx * INERTIA + fx * (1 - INERTIA);
        p.vy = p.vy * INERTIA + fy * (1 - INERTIA);

        // Step
        p.px = p.x;
        p.py = p.y;
        p.x += p.vx * BASE_SPEED * p.speedMul;
        p.y += p.vy * BASE_SPEED * p.speedMul;

        // Respawn drifters that leave the canvas, plus occasional
        // life-based respawn so trails don't all collect in attractors.
        p.life += 0.0008;
        if (
          p.x < -10 ||
          p.x > W + 10 ||
          p.y < -10 ||
          p.y > H + 10 ||
          p.life > 1
        ) {
          p.x = Math.random() * W;
          p.y = Math.random() * H;
          p.px = p.x;
          p.py = p.y;
          p.vx = 0;
          p.vy = 0;
          p.life = 0;
          continue;
        }

        // Draw trail segment
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
      }

      ctx.stroke();
    };

    const loop = (now: number) => {
      if (!running) return;
      step(now);
      rafId = requestAnimationFrame(loop);
    };

    // Initial paint
    resize();

    if (reduced) {
      // One static frame, no loop
      step(performance.now());
      return () => {};
    }

    // Resize watcher — debounced via rAF
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    rafId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, color, fadeAlpha, fadeColor, cursorRadius]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}
