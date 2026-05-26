"use client";

/* Hero orbital — layered 3D centerpiece.
   Center: pearl/iridescent sphere (the original signature orb).
   Mid:    a tilted translucent gold torus ring, slow self-rotation.
   Orbit:  three satellite shapes circling on different planes / phases.
   Field:  ~220 background particles drifting, very faint.
   Tilt:   mouse parallax — the whole rig pitches subtly.
   Designed to feel cinematic without scroll-scrubbing the section. */

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

/* ─── Center pearl sphere ───────────────────────────────────── */
function PearlCore() {
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
        envMapIntensity={0.85}
      />
    </mesh>
  );
}

/* ─── Tilted gold ring — slow spin in its own plane ─────────── */
function GoldRing() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ring.current) return;
    const t = state.clock.getElapsedTime();
    ring.current.rotation.z = t * 0.18;
  });
  return (
    <mesh ref={ring} rotation={[0.62, 0.22, 0]}>
      <torusGeometry args={[2.05, 0.035, 24, 220]} />
      <meshPhysicalMaterial
        color="#c9a96e"
        metalness={0.9}
        roughness={0.18}
        clearcoat={1}
        clearcoatRoughness={0.05}
        envMapIntensity={1.4}
      />
    </mesh>
  );
}

/* ─── Secondary thinner ring, crossed axis ──────────────────── */
function ThinRing() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ring.current) return;
    const t = state.clock.getElapsedTime();
    ring.current.rotation.x = t * 0.11;
  });
  return (
    <mesh ref={ring} rotation={[1.18, 0.4, 0.3]}>
      <torusGeometry args={[2.55, 0.012, 16, 200]} />
      <meshPhysicalMaterial
        color="#d4b888"
        metalness={0.95}
        roughness={0.22}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

/* ─── Orbiting satellite ────────────────────────────────────── */
function Satellite({
  radius,
  speed,
  phase,
  size,
  color,
  tilt = 0,
  emissive = "#5a4220",
}: {
  radius: number;
  speed: number;
  phase: number;
  size: number;
  color: string;
  tilt?: number;
  emissive?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const a = t * speed + phase;
    ref.current.position.x = Math.cos(a) * radius;
    ref.current.position.y = Math.sin(a + tilt) * radius * 0.28;
    ref.current.position.z = Math.sin(a) * radius;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.7}
        roughness={0.22}
        clearcoat={0.6}
        emissive={emissive}
        emissiveIntensity={0.25}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

/* ─── Background particle field — faint drifting stars ──────── */
function ParticleField({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a spherical shell behind/around the centerpiece
      const r = 4 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 2;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.012;
    ref.current.rotation.x = Math.sin(t * 0.04) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#8a6a35"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Group: full orbital rig, parallax-tilted ──────────────── */
function OrbitalRig({ orbitalOnly = false }: { orbitalOnly?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    // Spring-damped tilt towards mouse position
    group.current.rotation.y +=
      (target.current.x * 0.28 - group.current.rotation.y) * 0.05;
    group.current.rotation.x +=
      (-target.current.y * 0.18 - group.current.rotation.x) * 0.05;
  });

  return (
    <group ref={group}>
      <ParticleField />
      <GoldRing />
      <ThinRing />
      {/* Pearl core suppressed when the rig is used as ambient backdrop
          behind another focal element (e.g., the SH monogram). */}
      {!orbitalOnly && <PearlCore />}
      <Satellite radius={2.05} speed={0.45} phase={0} size={0.10} color="#d4b888" />
      <Satellite radius={2.05} speed={0.45} phase={(Math.PI * 2) / 3} size={0.08} color="#c9a96e" />
      <Satellite radius={2.55} speed={0.32} phase={Math.PI / 2} size={0.06} color="#e0c79a" tilt={0.6} emissive="#3a2a14" />
      <Satellite radius={1.75} speed={0.62} phase={Math.PI} size={0.05} color="#ede0c8" tilt={-0.4} emissive="#1a1612" />
    </group>
  );
}

/* ─── WebGL gate + 2D fallback ──────────────────────────────── */
export default function HeroOrbital({
  size = 380,
  orbitalOnly = false,
}: {
  size?: number;
  /** When true, skips rendering the pearl core (the rig becomes an
      ambient backdrop — rings, satellites, particles only). */
  orbitalOnly?: boolean;
}) {
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
        camera={{ position: [0, 0, 5.4], fov: 35 }}
        dpr={[1, 1.7]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ pointerEvents: "none" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        {/* Studio environment — cream + bronze + cool rim */}
        <Environment resolution={256}>
          <Lightformer intensity={3.0} color="#fff6e8" position={[3, 5, 3]} scale={[4, 4, 1]} />
          <Lightformer intensity={1.6} color="#e8d4a4" position={[-3, 1, 2]} scale={[3, 5, 1]} />
          <Lightformer intensity={1.0} color="#c8dce8" position={[0, -4, -1]} scale={[6, 3, 1]} />
          <Lightformer intensity={0.7} color="#d4a870" position={[2, -2, 3]} scale={[2, 2, 1]} />
        </Environment>

        <directionalLight position={[3, 4, 3]} intensity={1.0} color="#fff8f0" />
        <directionalLight position={[-1, -2, -1]} intensity={0.3} color="#c8d8e8" />

        <OrbitalRig orbitalOnly={orbitalOnly} />
      </Canvas>
    </span>
  );
}
