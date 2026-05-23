"use client";

// A cursor-anchored image plate that fades in when the parent is
// hovered, follows the pointer with smooth spring easing, and fades
// out on leave. The image floats *outside* the hoverable element's
// rectangle — fixed-positioned to the viewport — so it can sit
// wherever the visitor's eye is, like a magazine plate revealed in
// passing.
//
// Used on the four vertical cards. The hover surface is the parent
// (any positioned element that wraps <HoverImage> as a sibling of
// its main content). HoverImage itself listens to mouse/pointer
// events on the *parent's* DOM node via its own enter/move/leave
// handlers, attached through a ref escape.

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function HoverImage({
  src,
  alt = "",
  parentRef,
  width = 340,
  height = 440,
}: {
  src: string;
  alt?: string;
  // Ref to the hoverable parent element. We attach listeners to it
  // so the image reveals/hides based on the parent's hover state,
  // and tracks the cursor position within the document.
  parentRef: React.RefObject<HTMLElement | null>;
  width?: number;
  height?: number;
}) {
  const [hovered, setHovered] = useState(false);

  // Cursor position, smoothed by a spring so the image trails the
  // cursor with weight rather than snapping to it
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 120, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 120, damping: 22, mass: 0.6 });

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const onEnter = (e: PointerEvent) => {
      // Skip on touch / coarse pointers — hover images are a
      // desktop-only flourish; on mobile they'd compete with the
      // card content for space.
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX);
      my.set(e.clientY);
      setHovered(true);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const onLeave = () => setHovered(false);

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [parentRef, mx, my]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30 hidden md:block"
      style={{
        x,
        y,
        width,
        height,
        // Centre the plate on the cursor with a small downward
        // offset, so it sits below-right of the pointer like a
        // magazine plate revealed in passing
        translateX: "-50%",
        translateY: "-50%",
        marginLeft: 120,
        marginTop: 20,
      }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={
        hovered
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.94 }
      }
      transition={{
        opacity: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] },
        scale: { duration: 0.9, ease: [0.2, 0.7, 0.2, 1] },
      }}
    >
      <div
        className="relative w-full h-full overflow-hidden rounded-sm"
        style={{ boxShadow: "0 20px 60px -15px rgba(26, 22, 18, 0.35)" }}
      >
        {/* Plain <img> rather than next/image — the plate is hover-only,
            non-LCP, and we want to avoid the runtime cost of next/image's
            loader machinery for an image that may never render in a given
            session. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: "grayscale(0.35) contrast(1.08) brightness(0.82)",
          }}
        />
        {/* Warm bronze wash binds the plate to the cream palette */}
        <div
          className="absolute inset-0 mix-blend-multiply pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,17,14,0.25) 0%, rgba(74,53,32,0.18) 100%)",
          }}
        />
      </div>
    </motion.div>
  );
}
