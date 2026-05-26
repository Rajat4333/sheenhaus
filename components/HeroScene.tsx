"use client";

/* HeroScene — the 3D engine inside SignatureHero.
 *
 * Scene contents:
 *   • SH monogram: a textured plane in real 3D space. The PNG is
 *     preprocessed once (luminance → inverse alpha) so the white
 *     background becomes transparent and the gold parts read as
 *     metallic gold on the dark environment. MeshPhysicalMaterial
 *     handles the brushed-gold PBR look + env-map reflections.
 *   • Lighting: champagne-gold Lightformer rig — warm key from
 *     upper-right, cool fill below, soft rim from behind.
 *   • Atmospheric particles: a Three.js point cloud of ~140 dust
 *     specks drifting around the monogram.
 *   • Camera: at z=8, slow micro-orbit + mouse-driven tilt
 *     (max 2-4°), as the brief requests.
 *
 * Postprocessing:
 *   - Bloom on the gold emissive
 *   - Vignette for cinematic falloff
 *   - Noise as subtle additional grain
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ─── Texture preprocessor — gold-on-transparent PNG ───────────
 * The source PNG is gold-on-white. To use it cleanly in a dark 3D
 * environment we draw it to an offscreen canvas, then for each pixel
 * compute (1 - luminance) → alpha. This makes white pixels fully
 * transparent and gold pixels fully opaque.
 *
 * Runs once on mount; result cached in component state.
 */
function useMonogramTexture(src: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i],
          g = px[i + 1],
          b = px[i + 2];
        // Perceptual luminance
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        // White (lum≈1) → transparent. Gold (lum~0.4–0.7) → opaque.
        // Smoothstep so edges anti-alias cleanly.
        const a = Math.max(0, Math.min(1, (0.98 - lum) / 0.4));
        px[i + 3] = Math.round(a * 255);
      }
      ctx.putImageData(data, 0, 0);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 16;
      tex.needsUpdate = true;
      setTexture(tex);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return texture;
}

/* ─── Monogram mesh ─────────────────────────────────────────── */
function Monogram({ texture }: { texture: THREE.Texture }) {
  const meshRef = useRef<THREE.Mesh>(null);
  /* Aspect of the source PNG dictates the plane's aspect ratio.
     The image is roughly portrait — width/height ~0.78. Set a height
     of 4.6 units so the silhouette fills the centre comfortably. */
  const aspect = useMemo(() => {
    const w = (texture.image as HTMLCanvasElement).width;
    const h = (texture.image as HTMLCanvasElement).height;
    return w / h;
  }, [texture]);
  const height = 3.4;
  const width = height * aspect;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    /* Slow continuous drift — micro-rotation, never spinning */
    meshRef.current.rotation.y = Math.sin(t * 0.22) * 0.14;
    meshRef.current.rotation.x = Math.sin(t * 0.18) * 0.06;
    /* Gentle vertical breath + sit slightly above centre so the
       SHEENHAUS wordmark below has clean room. */
    meshRef.current.position.y = 0.7 + Math.sin(t * 0.4) * 0.08;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.7, 0]}>
      <planeGeometry args={[width, height, 1, 1]} />
      <meshPhysicalMaterial
        map={texture}
        transparent
        alphaTest={0.04}
        side={THREE.DoubleSide}
        metalness={0.92}
        roughness={0.22}
        envMapIntensity={2.4}
        emissive={"#d6b378"}
        emissiveIntensity={0.55}
        emissiveMap={texture}
        color={"#f0d8a0"}
      />
    </mesh>
  );
}

/* ─── Drifting gold particles inside the canvas ─────────────── */
function DustField({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a slab around the monogram with depth variance
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, [count]);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.015;
    ref.current.position.y = Math.sin(t * 0.1) * 0.2;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={"#d6b378"}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Camera rig — slow drift + mouse-driven micro-tilt ─────── */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Slow ambient drift around the origin
    const driftX = Math.sin(t * 0.12) * 0.12;
    const driftY = Math.cos(t * 0.09) * 0.08;
    // Mouse-driven offset (max ~0.35 units → ~2.5° at z=8)
    const targetX = driftX + mouse.current.x * 0.28;
    const targetY = driftY + -mouse.current.y * 0.18;
    // Spring toward target
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─── Entrance — camera dollies in from z=12 → z=8 ─────────── */
function IntroDolly() {
  const { camera } = useThree();
  const startedAt = useRef(performance.now());
  useFrame(() => {
    const elapsed = (performance.now() - startedAt.current) / 1000;
    const dur = 2.4;
    const p = Math.min(1, elapsed / dur);
    /* easeOutExpo */
    const e = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
    const z = 12 - (12 - 8) * e;
    camera.position.z = z;
  });
  return null;
}

/* ─── Scene root ────────────────────────────────────────────── */
function Scene() {
  const texture = useMonogramTexture("/sheenhaus-monogram.png");

  return (
    <>
      {/* Champagne-gold Lightformer rig — no HDRI fetch */}
      <Environment resolution={256}>
        {/* Warm key from upper right */}
        <Lightformer
          intensity={4.5}
          color="#ffd9a0"
          position={[4, 5, 3]}
          scale={[6, 4, 1]}
        />
        {/* Soft fill from left */}
        <Lightformer
          intensity={2.2}
          color="#c9a96e"
          position={[-5, 1, 2]}
          scale={[5, 6, 1]}
        />
        {/* Cool rim from behind */}
        <Lightformer
          intensity={1.6}
          color="#8a98b0"
          position={[0, 2, -5]}
          scale={[8, 4, 1]}
        />
        {/* Warm under-light */}
        <Lightformer
          intensity={1.2}
          color="#b08846"
          position={[0, -4, 1]}
          scale={[6, 2, 1]}
        />
      </Environment>

      {/* Direct lights — sharpen the brushed-metal specular */}
      <directionalLight
        position={[3, 5, 3]}
        intensity={1.0}
        color="#fff0d0"
      />
      <directionalLight
        position={[-3, -1, -2]}
        intensity={0.35}
        color="#8a98b0"
      />
      <ambientLight intensity={0.15} color="#1a1410" />

      {/* Scene depth fog — pulls back the dust */}
      <fog attach="fog" args={["#050403", 7, 18]} />

      {texture && <Monogram texture={texture} />}
      <DustField />
      <CameraRig />
      <IntroDolly />
    </>
  );
}

/* ─── Canvas wrapper ────────────────────────────────────────── */
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 32 }}
      dpr={[1, 2]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl }) => gl.setClearColor(0x050403, 1)}
    >
      <Scene />
      <EffectComposer multisampling={4}>
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.18} darkness={0.78} />
        <Noise
          opacity={0.05}
          blendFunction={BlendFunction.OVERLAY}
          premultiply={false}
        />
      </EffectComposer>
    </Canvas>
  );
}
