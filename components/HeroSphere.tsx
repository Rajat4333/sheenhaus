"use client";

/* Hero orb — 200px pearl sphere.
   Uses MeshPhysicalMaterial with iridescence + clearcoat and
   drei Lightformers to build an environment map entirely in-memory —
   no HDR network request, no CDN dependency, works offline.
   metalness=0 so directional lights are the primary illumination;
   clearcoat+iridescence add the pearl/champagne sheen on top. */

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function PearlSphere() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.22;
    mesh.current.rotation.x = Math.sin(t * 0.09) * 0.18;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhysicalMaterial
        color="#e8dcc8"
        metalness={0.0}
        roughness={0.12}
        clearcoat={1}
        clearcoatRoughness={0.02}
        iridescence={1.0}
        iridescenceIOR={1.8}
        iridescenceThicknessRange={[80, 500] as [number, number]}
        sheen={0.5}
        sheenRoughness={0.25}
        sheenColor="#c9a96e"
        envMapIntensity={0.8}
      />
    </mesh>
  );
}

export default function HeroSphere({ size = 200 }: { size?: number }) {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      setCanRender(!!gl && !reduced);
    } catch {
      setCanRender(false);
    }
  }, []);

  if (!canRender) {
    return (
      <span
        className="block rounded-full"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 35% 32%, #ede0c8 0%, #c9b89e 40%, #8a6a35 72%, #3a2a18 100%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, display: "inline-block" }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ pointerEvents: "none" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        {/* Environment built entirely from Lightformers — no network request */}
        <Environment resolution={256}>
          {/* Warm key from upper-right */}
          <Lightformer
            intensity={3}
            color="#fff6e8"
            position={[3, 5, 3]}
            scale={[4, 4, 1]}
          />
          {/* Champagne fill from left */}
          <Lightformer
            intensity={1.5}
            color="#e8d4a4"
            position={[-3, 1, 2]}
            scale={[3, 5, 1]}
          />
          {/* Cool pearl rim from below */}
          <Lightformer
            intensity={0.8}
            color="#c8dce8"
            position={[0, -4, -1]}
            scale={[6, 3, 1]}
          />
          {/* Soft bronze bounce */}
          <Lightformer
            intensity={0.6}
            color="#d4a870"
            position={[2, -2, 3]}
            scale={[2, 2, 1]}
          />
        </Environment>

        {/* Extra direct lights for crisp highlights */}
        <directionalLight position={[3, 4, 3]} intensity={1.0} color="#fff8f0" />
        <directionalLight position={[-1, -2, -1]} intensity={0.3} color="#c8d8e8" />

        <PearlSphere />
      </Canvas>
    </span>
  );
}
