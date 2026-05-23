// Generates a 60-frame sequence of a slowly rotating sculptural form
// (a thin elliptical ring + faint inner ring) lit from one side with warm
// bronze. Each frame is a standalone SVG written to /public/sequence/.
//
// Run: node scripts/generate-sequence.mjs
//
// To replace with real 3D renders later: delete /public/sequence/*.svg and
// drop in numbered PNG/JPG frames using the same naming (0000.svg → 0000.png).
// The ScrollCanvas component auto-resolves either extension.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// SVG sources live alongside the script (not in /public — they don't ship).
// The bake step reads from here and writes WebP to /public/sequence/.
const outDir = resolve(__dirname, "./sequence-source");
mkdirSync(outDir, { recursive: true });

const FRAME_COUNT = 60;
const W = 1600;
const H = 1000;

const lerp = (a, b, t) => a + (b - a) * t;

function frame(i) {
  const t = i / (FRAME_COUNT - 1); // 0 .. 1
  // Rotation around vertical axis — ellipse width oscillates
  // 0 = front-on (narrow ellipse), 0.25 = profile (full circle), 0.5 = front-on again
  const angle = t * Math.PI * 2; // one full rotation
  const ellipseRx = 280 * Math.abs(Math.cos(angle)) + 30; // 30..310
  const ellipseRy = 280;

  // Light position drifts slightly as the form rotates
  const lightX = lerp(0.3, 0.7, (Math.sin(angle) + 1) / 2);
  const lightY = 0.4;

  // The "edge" highlight on the ring — strongest at perpendicular views
  const edgeIntensity = Math.abs(Math.sin(angle * 2));

  // A second, smaller ring rotated 90° offset — adds depth
  const innerEllipseRx = 280 * Math.abs(Math.cos(angle + Math.PI / 2)) + 20;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <radialGradient id="bg" cx="${lightX * 100}%" cy="${lightY * 100}%" r="80%">
      <stop offset="0%"   stop-color="#f8f3e8" />
      <stop offset="45%"  stop-color="#f0eadc" />
      <stop offset="100%" stop-color="#e6dec9" />
    </radialGradient>

    <linearGradient id="ring-bronze" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#8a6a35" />
      <stop offset="40%"  stop-color="#c9a96e" />
      <stop offset="55%"  stop-color="#e7d4a4" />
      <stop offset="70%"  stop-color="#c9a96e" />
      <stop offset="100%" stop-color="#75582b" />
    </linearGradient>

    <linearGradient id="ring-bronze-inner" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#8a6a35" stop-opacity="0.4" />
      <stop offset="50%"  stop-color="#c9a96e" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#75582b" stop-opacity="0.4" />
    </linearGradient>

    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="14" />
      <feOffset dx="0" dy="22" result="shadow" />
      <feColorMatrix in="shadow" type="matrix" values="
        0 0 0 0 0.1
        0 0 0 0 0.08
        0 0 0 0 0.06
        0 0 0 0.25 0" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" />
      <feColorMatrix values="0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0 0
                             0 0 0 0.05 0" />
      <feComposite in2="SourceGraphic" operator="in" />
    </filter>
  </defs>

  <!-- Backdrop -->
  <rect width="100%" height="100%" fill="url(#bg)" />

  <!-- Subtle diagonal sheen -->
  <rect width="100%" height="100%" opacity="0.4" fill="url(#bg)" style="mix-blend-mode: overlay" />

  <!-- The form -->
  <g transform="translate(${W / 2} ${H / 2})" filter="url(#softShadow)">
    <!-- Outer ring (the main sculptural form) -->
    <ellipse
      cx="0" cy="0"
      rx="${ellipseRx}" ry="${ellipseRy}"
      fill="none"
      stroke="url(#ring-bronze)"
      stroke-width="${4 + edgeIntensity * 4}"
      opacity="${0.85 + edgeIntensity * 0.15}"
    />

    <!-- Inner ring (perpendicular axis, adds depth) -->
    <ellipse
      cx="0" cy="0"
      rx="${innerEllipseRx}" ry="${ellipseRy * 0.86}"
      fill="none"
      stroke="url(#ring-bronze-inner)"
      stroke-width="1.5"
    />

    <!-- Centre point — tiny bronze dot -->
    <circle cx="0" cy="0" r="3" fill="#8a6a35" opacity="0.5" />
  </g>

  <!-- Grain overlay -->
  <rect width="100%" height="100%" filter="url(#grain)" opacity="0.5" />
</svg>`;
}

for (let i = 0; i < FRAME_COUNT; i++) {
  const id = String(i).padStart(4, "0");
  writeFileSync(resolve(outDir, `${id}.svg`), frame(i));
}

console.log(`Wrote ${FRAME_COUNT} frames to ${outDir}/`);
