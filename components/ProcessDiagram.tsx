"use client";

/* The Process Diagram — rebuilt with:
   - meshPhysicalMaterial + Lightformer environment per node (proper metallic sheen)
   - Each shape has a unique rotation personality
   - Hover: node lifts + brightens
   - Connecting line: flowing animated beacon dot travels node→node→node
   - Entrance: staggered scale + rotateY spin-reveal
   - Scroll-triggered sequential reveal */

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type NodeKind = "audit" | "build" | "automate";

const NODES: Array<{ kind: NodeKind; code: string; title: string; body: string }> = [
  {
    kind: "audit",
    code: "01",
    title: "Audit",
    body: "We measure where your current surface is leaking customers — performance, structure, AI visibility, the small details premium buyers read.",
  },
  {
    kind: "build",
    code: "02",
    title: "Build",
    body: "We rebuild the website by hand. Cinematic where it earns it. Restrained where it doesn't. AI-native from the first line of code.",
  },
  {
    kind: "automate",
    code: "03",
    title: "Automate",
    body: "Workflows behind the surface — intake, onboarding, lead routing, internal tools. The wiring that runs your business once the site converts.",
  },
];

/* ─── Per-shape rotation personality ────────────────────────── */
function NodeMesh({ kind, hovered }: { kind: NodeKind; hovered: boolean }) {
  const mesh  = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!mesh.current || !group.current) return;

    if (kind === "audit") {
      // Icosahedron: tumbles on all axes — angular, restless
      mesh.current.rotation.x = t * 0.28;
      mesh.current.rotation.y = t * 0.19;
      mesh.current.rotation.z = t * 0.11;
      group.current.position.y = Math.sin(t * 0.55) * 0.06;
    } else if (kind === "build") {
      // Torus: slow dignified roll on X + drift
      mesh.current.rotation.x = t * 0.18;
      mesh.current.rotation.z = t * 0.09;
      group.current.position.y = Math.sin(t * 0.45 + 1.2) * 0.05;
    } else {
      // Sphere: smooth spin on Y + slight tilt
      mesh.current.rotation.y = t * 0.35;
      mesh.current.rotation.x = Math.sin(t * 0.18) * 0.22;
      group.current.position.y = Math.sin(t * 0.65 + 2.4) * 0.06;
    }

    // Hover: subtle scale pulse
    const target = hovered ? 1.08 : 1.0;
    group.current.scale.lerp(
      new THREE.Vector3(target, target, target),
      0.06
    );
  });

  return (
    <group ref={group}>
      <mesh ref={mesh}>
        {kind === "audit"    && <icosahedronGeometry args={[0.82, 0]} />}
        {kind === "build"    && <torusGeometry args={[0.65, 0.26, 24, 72]} />}
        {kind === "automate" && <sphereGeometry args={[0.72, 64, 64]} />}
        {/* Matte stone/chalk — premium, not glossy */}
        <meshPhysicalMaterial
          color={kind === "audit" ? "#ccc8c0" : kind === "build" ? "#d8d2c6" : "#e0dbd2"}
          metalness={0.04}
          roughness={kind === "audit" ? 0.55 : kind === "build" ? 0.48 : 0.42}
          sheen={0.18}
          sheenRoughness={0.6}
          sheenColor="#b8956a"
          envMapIntensity={hovered ? 1.0 : 0.6}
        />
      </mesh>

      {/* Automate satellites */}
      {kind === "automate" && (
        <>
          <Satellite radius={1.25} speed={0.55} phase={0} />
          <Satellite radius={1.25} speed={0.55} phase={(Math.PI * 2) / 3} />
          <Satellite radius={1.25} speed={0.55} phase={(Math.PI * 4) / 3} />
        </>
      )}
    </group>
  );
}

function Satellite({ radius, speed, phase }: { radius: number; speed: number; phase: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.x = Math.cos(t * speed + phase) * radius;
    ref.current.position.z = Math.sin(t * speed + phase) * radius;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshPhysicalMaterial color="#d4b888" metalness={0.5} roughness={0.2} emissive="#8a6a35" emissiveIntensity={0.4} />
    </mesh>
  );
}

/* ─── Canvas for one node ────────────────────────────────────── */
function NodeCanvas({ kind, hovered }: { kind: NodeKind; hovered: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 35 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power", failIfMajorPerformanceCaveat: false }}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Environment resolution={128}>
        <Lightformer intensity={4.0} color="#ffffff" position={[3, 5, 3]} scale={[3, 3, 1]} />
        <Lightformer intensity={2.0} color="#f0e8d8" position={[-3, 1, 2]} scale={[3, 4, 1]} />
        <Lightformer intensity={1.2} color="#dde8f0" position={[0, -4, -1]} scale={[5, 3, 1]} />
        <Lightformer intensity={1.0} color="#fff8f0" position={[0, 3, -2]} scale={[4, 2, 1]} />
      </Environment>
      <directionalLight position={[3, 4, 3]} intensity={1.2} color="#ffffff" />
      <NodeMesh kind={kind} hovered={hovered} />
    </Canvas>
  );
}

/* ─── Data flow line between nodes ───────────────────────────── */
const PACKETS = [
  { delay: 0,    size: 7, color: "#8a6a35", glow: "rgba(138,106,53,0.55)" },
  { delay: 0.55, size: 4, color: "#b8906a", glow: "rgba(184,144,106,0.4)" },
  { delay: 1.1,  size: 7, color: "#8a6a35", glow: "rgba(138,106,53,0.55)" },
  { delay: 1.65, size: 4, color: "#b8906a", glow: "rgba(184,144,106,0.4)" },
];

function FlowLine({ inView }: { inView: boolean }) {
  return (
    <div className="hidden md:block absolute top-[108px] left-[calc(16.66%+28px)] right-[calc(16.66%+28px)] pointer-events-none">
      {/* Base hairline */}
      <motion.div
        className="absolute inset-0 top-1/2 -translate-y-1/2"
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(26,22,18,0.12) 10%, rgba(26,22,18,0.12) 90%, transparent 100%)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
      />
      {/* Dashed overlay — visual rhythm */}
      <motion.div
        className="absolute inset-0 top-1/2 -translate-y-1/2"
        style={{
          height: 1,
          backgroundImage: "repeating-linear-gradient(90deg, rgba(138,106,53,0.22) 0px, rgba(138,106,53,0.22) 12px, transparent 12px, transparent 24px)",
        }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.0 }}
      />
      {/* Data packets */}
      {inView && PACKETS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 ${p.size + 5}px ${Math.ceil(p.size / 2)}px ${p.glow}`,
            left: 0,
          }}
          animate={{
            left: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2.4,
            ease: "linear",
            repeat: Infinity,
            delay: p.delay + 1.2,
            repeatDelay: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ─── 2D fallback ────────────────────────────────────────────── */
function NodeFallback({ kind }: { kind: NodeKind }) {
  const shapes = {
    audit:    "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
    build:    "none",
    automate: "none",
  };
  return (
    <div className="w-full h-full flex items-center justify-center" aria-hidden>
      <span
        className="block"
        style={{
          width: 80, height: 80,
          background: "radial-gradient(circle at 30% 30%, #c9a96e 0%, #8a6a35 50%, #3a2a14 100%)",
          borderRadius: kind === "automate" ? "50%" : kind === "build" ? "50%" : "4px",
          clipPath: shapes[kind] !== "none" ? shapes[kind] : undefined,
        }}
      />
    </div>
  );
}

function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

/* ─── Main section ──────────────────────────────────────────── */
export default function ProcessDiagram() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [canRender3D, setCanRender3D] = useState(false);
  const [hovered, setHovered] = useState<NodeKind | null>(null);
  // If the section is already visible on mount (scroll restoration), skip entrance animation
  const [skipEntrance, setSkipEntrance] = useState(false);

  useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setCanRender3D(hasWebGL() && !reduced);
    // Check if element is already in viewport on mount
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) setSkipEntrance(true);
    }
  }, []);

  return (
    <section
      ref={ref}
      className="theme-clinical relative overflow-hidden"
      style={{ background: "var(--cl-bg)" }}
    >
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-32 md:py-44">

        {/* Eyebrow */}
        <motion.div
          className="text-[10px] uppercase tracking-[0.32em] mb-6 text-center"
          style={{ color: "var(--cl-ink-faint)" }}
          initial={skipEntrance ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span style={{ color: "#8a6a35" }}>●</span> How we work
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="cl-display text-center mx-auto"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            color: "var(--cl-ink)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            maxWidth: "22ch",
          }}
          initial={skipEntrance ? false : { opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
        >
          Three steps. <em>End to end.</em>
        </motion.h2>

        <motion.p
          className="mt-6 text-[15px] max-w-lg mx-auto text-center"
          style={{ color: "var(--cl-ink-soft)" }}
          initial={skipEntrance ? false : { opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
        >
          We measure what&rsquo;s broken, rebuild the surface, then automate
          everything that happens behind it. One small team, three deliverables.
        </motion.p>

        {/* Diagram */}
        <div className="mt-20 md:mt-28 relative">
          <FlowLine inView={inView} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
            {NODES.map((n, i) => (
              <motion.div
                key={n.kind}
                initial={skipEntrance ? false : { opacity: 0, scale: 0.65, rotateY: -30 }}
                animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
                transition={{ duration: 1.0, delay: skipEntrance ? 0 : 0.4 + i * 0.22, ease: [0.2, 0.7, 0.2, 1] }}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center text-center cursor-default"
                style={{ perspective: 800 }}
                onMouseEnter={() => setHovered(n.kind)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* 3D node */}
                <motion.div
                  style={{ width: 220, height: 220 }}
                  animate={{ filter: hovered === n.kind ? "drop-shadow(0 0 20px rgba(201,169,110,0.45))" : "none" }}
                  transition={{ duration: 0.4 }}
                >
                  {canRender3D ? (
                    <NodeCanvas kind={n.kind} hovered={hovered === n.kind} />
                  ) : (
                    <NodeFallback kind={n.kind} />
                  )}
                </motion.div>

                {/* Code */}
                <motion.div
                  className="mt-2 text-[11px] uppercase tracking-[0.32em]"
                  style={{ fontFamily: "var(--font-ibm-plex-mono), monospace", color: "#8a6a35" }}
                  animate={{ opacity: hovered === n.kind ? 1 : 0.65 }}
                >
                  {n.code}
                </motion.div>

                {/* Title */}
                <h3
                  className="cl-display mt-3"
                  style={{
                    fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                    color: "var(--cl-ink)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {n.title}
                </h3>

                {/* Body */}
                <p
                  className="mt-4 text-[14px] leading-[1.7] max-w-[36ch]"
                  style={{ color: "var(--cl-ink-soft)" }}
                >
                  {n.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
