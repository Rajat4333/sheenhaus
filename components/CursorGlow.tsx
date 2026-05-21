"use client";
import { useEffect, useRef, useState } from "react";

type CursorState = "default" | "hover" | "cta";

export default function CursorGlow() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const stateRef = useRef<CursorState>("default");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let mouseX = -200, mouseY = -200;
    let ringX = -200, ringY = -200;
    let glowX = -200, glowY = -200;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${glowX}px`;
        glowRef.current.style.top = `${glowY}px`;
      }
      raf = requestAnimationFrame(tick);
    };

    const setState = (next: CursorState, nextLabel = "") => {
      if (stateRef.current === next && label === nextLabel) return;
      stateRef.current = next;
      setLabel(nextLabel);
      if (ringRef.current) ringRef.current.dataset.state = next;
      if (dotRef.current) dotRef.current.dataset.state = next;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest<HTMLElement>(
        "[data-cursor], a, button, summary, [role='button']"
      );
      if (!interactive) {
        setState("default");
        return;
      }
      const kind = interactive.dataset.cursor;
      const text = interactive.dataset.cursorText;
      if (kind === "cta") {
        setState("cta", text || "Go →");
      } else {
        setState("hover", "");
      }
    };

    const onOut = (e: MouseEvent) => {
      const related = e.relatedTarget as Node | null;
      if (!related) setState("default");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onOut);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onOut);
      cancelAnimationFrame(raf);
    };
  }, [label]);

  return (
    <>
      <div ref={glowRef} className="cursor-glow hidden lg:block" />
      <div ref={ringRef} className="cursor-ring hidden lg:flex" data-state="default">
        {label}
      </div>
      <div ref={dotRef} className="cursor-dot hidden lg:block" data-state="default" />
    </>
  );
}
