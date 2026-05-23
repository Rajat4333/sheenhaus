"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useScroll, useMotionValueEvent, motion, useTransform, type MotionValue } from "framer-motion";

const FRAME_COUNT = 60;
// WebP baked from the SVG generator via scripts/bake-sequence.mjs.
// Pre-rasterised so the canvas redraw on every scroll tick is just a
// memcpy — no SVG filter recomputation per frame.
const FRAME_EXT = "webp";
const FRAME_PATH = (i: number) =>
  `/sequence/${String(i).padStart(4, "0")}.${FRAME_EXT}`;

/**
 * Scroll-pinned canvas that scrubs through 60 frames as the user scrolls
 * the outer container. The frames are a slow rotation of a bronze
 * sculptural ring; can be replaced with real 3D renders later by dropping
 * numbered PNG/JPG files into /public/sequence/.
 *
 * @param scrollHeight - Outer container height. Higher = slower scrub.
 *                       Default 400vh = 4 viewports of scroll = ~1 frame per
 *                       ~6.6vh of scroll. Feels deliberate without dragging.
 */
export default function ScrollCanvas({
  scrollHeight = "400vh",
  children,
}: {
  scrollHeight?: string;
  children?: (scrollYProgress: MotionValue<number>) => ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastFrameRef = useRef(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Pre-load all frames. SVGs are tiny (~4KB each), this is ~240KB total
  // and resolves quickly. Once loaded, we draw them directly to canvas.
  useEffect(() => {
    let cancelled = false;
    const loaded: HTMLImageElement[] = new Array(FRAME_COUNT);
    let resolvedCount = 0;

    const finish = () => {
      if (cancelled) return;
      if (resolvedCount === FRAME_COUNT) {
        imagesRef.current = loaded;
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loaded[i] = img;
        resolvedCount++;
        finish();
      };
      img.onerror = () => {
        resolvedCount++;
        finish();
      };
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Stable draw function — depends on nothing that changes mid-render
  const draw = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[frameIndex];
    if (!img) return;

    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const imgRatio = img.width / img.height;
    const canvasRatio = cw / ch;

    let dw: number, dh: number, ox: number, oy: number;
    // Object-fit: contain — preserve the whole frame, letterboxed against
    // the cream background. Object-fit: cover would crop into the form.
    if (imgRatio > canvasRatio) {
      dw = cw;
      dh = cw / imgRatio;
      ox = 0;
      oy = (ch - dh) / 2;
    } else {
      dh = ch;
      dw = ch * imgRatio;
      ox = (cw - dw) / 2;
      oy = 0;
    }

    // Page bg is cream — paint it so canvas pixels outside the image area
    // match perfectly when the form letterboxes
    ctx.fillStyle = "#f4efe6";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, ox, oy, dw, dh);
  }, []);

  // Size the canvas to match the device pixel ratio for crisp drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext("2d");
      ctx?.scale(dpr, dpr);
      draw(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [isLoaded, draw]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isLoaded) return;
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.floor(latest * FRAME_COUNT))
    );
    if (frameIndex === lastFrameRef.current) return;
    lastFrameRef.current = frameIndex;
    requestAnimationFrame(() => draw(frameIndex));
  });

  // Initial paint once loaded
  useEffect(() => {
    if (isLoaded) draw(0);
  }, [isLoaded, draw]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-bg">
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
          aria-hidden="true"
        />
        {children?.(scrollYProgress)}
      </div>
    </div>
  );
}

/* ─── Section overlay — fades in/out at given scroll thresholds ─────── */

export function ScrollOverlaySection({
  scrollYProgress,
  start,
  end,
  align = "left",
  children,
}: {
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
  align?: "left" | "center" | "right";
  children: ReactNode;
}) {
  // Clamp to [0,1] and force strict monotonic increases.
  // framer-motion's WAAPI backend rejects duplicate/inverted stops.
  const fadeIn  = Math.max(0,    Math.min(start, 1));
  const holdIn  = Math.max(fadeIn + 0.001, Math.min(start + 0.06, 1));
  const holdOut = Math.max(holdIn + 0.001, Math.min(end - 0.04, 1));
  const fadeOut = Math.max(holdOut + 0.001, Math.min(end + 0.04, 1));

  const opacity = useTransform(
    scrollYProgress,
    [fadeIn, holdIn, holdOut, fadeOut],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [fadeIn, fadeOut],
    [40, -40]
  );

  const alignClass =
    align === "center"
      ? "items-center text-center"
      : align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 pointer-events-none flex flex-col justify-center shell ${alignClass}`}
    >
      <div className="pointer-events-auto">{children}</div>
    </motion.div>
  );
}
