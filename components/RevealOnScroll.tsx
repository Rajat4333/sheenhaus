"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.01 });
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFallback(true), 600);
    return () => clearTimeout(t);
  }, []);

  const show = isInView || fallback;

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : 0,
      x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
