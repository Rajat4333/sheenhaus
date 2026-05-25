"use client";

/* WordmarkSphere — a tiny pearlescent sphere that replaces the 2D
   gradient dot next to the "sheenhaus" wordmark in the nav. The
   sphere rotates slowly on its own and an additional 360° as the
   page scrolls top-to-bottom. The kind of detail a buyer notices
   on the second glance.

   Loaded via next/dynamic with ssr:false so it never blocks first
   paint; a 2D gradient dot is the loading fallback. ~150KB of JS
   that arrives after the page is interactive.

   If WebGL is unavailable (very old browsers, sandboxed envs, or
   prefers-reduced-motion), the component cleanly falls back to the
   same 2D dot the loading state uses. */

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/* Static 2D fallback — exact same look as the dynamic loader so the
   handoff is invisible. */
function FallbackDot({ size }: { size: number }) {
  return (
    <span
      className="inline-block rounded-full"
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 60%, #c9b89e 100%)",
      }}
      aria-hidden="true"
    />
  );
}

/* Feature-detect WebGL once at module load. */
function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

function Sphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      setScrollProgress(Math.min(1, window.scrollY / max));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Slow ambient rotation + extra 360° driven by scroll progress.
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.15 + scrollProgress * Math.PI * 2;
    meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      {/* Pearlescent / iridescent material — refractive glass tinted
          bronze. The "house of sheen" made physical. */}
      <MeshTransmissionMaterial
        thickness={0.4}
        roughness={0.05}
        transmission={0.85}
        ior={1.45}
        chromaticAberration={0.08}
        backside
        color="#d8c39a"
        attenuationColor="#8a6a35"
        attenuationDistance={1.2}
      />
    </mesh>
  );
}

export default function WordmarkSphere({ size = 14 }: { size?: number }) {
  // WebGL detection on mount — if unavailable or the user has asked
  // for reduced motion, render the 2D dot instead of an empty box.
  const [canRender3D, setCanRender3D] = useState(false);
  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setCanRender3D(hasWebGL() && !reducedMotion);
  }, []);

  if (!canRender3D) return <FallbackDot size={size} />;

  return (
    <span
      className="wordmark-sphere inline-block"
      aria-hidden
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.4], fov: 35 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ pointerEvents: "none" }}
        // If WebGL creation fails at runtime (rare on real browsers),
        // bubble up so React reports — the FallbackDot above handles
        // the common cases.
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // transparent background
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 2]} intensity={1.6} />
        <directionalLight position={[-2, -1, 1]} intensity={0.5} color="#c9b89e" />
        <Sphere />
      </Canvas>
    </span>
  );
}
