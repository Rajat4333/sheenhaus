// Bakes /public/sequence/*.svg → *.webp using sharp.
// SVG frames are cheap to *generate* but expensive to *rasterize on every
// scroll tick* (their feGaussianBlur + feTurbulence filters re-run each
// time the canvas redraws). Baking once to a pixel buffer = scroll is fast.
//
// WebP at quality 82 + 1600×1000 = ~25-40 KB per frame.
// 60 frames ≈ ~2MB total — still smaller than the reference repo's 15MB.
//
// Run: node scripts/bake-sequence.mjs
// Re-run any time you regenerate the SVGs.

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Read SVGs from script-adjacent sources, write WebPs to /public/sequence/
// where the ScrollCanvas component loads them at runtime.
const srcDir = resolve(__dirname, "./sequence-source");
const outDir = resolve(__dirname, "../public/sequence");
await mkdir(outDir, { recursive: true });

const files = (await readdir(srcDir)).filter((f) => f.endsWith(".svg")).sort();
console.log(`Baking ${files.length} SVG frames → WebP…`);

const start = Date.now();
let total = 0;

for (const f of files) {
  const svgPath = join(srcDir, f);
  const outPath = join(outDir, f.replace(/\.svg$/, ".webp"));
  const buf = await readFile(svgPath);
  const out = await sharp(buf, { density: 144 })
    .resize(1600, 1000, { fit: "contain", background: "#f4efe6" })
    .webp({ quality: 82 })
    .toBuffer();
  await writeFile(outPath, out);
  total += out.length;
}

const ms = Date.now() - start;
console.log(
  `Wrote ${files.length} WebP frames in ${ms}ms · ` +
    `total ${(total / 1024).toFixed(0)} KB ` +
    `(avg ${(total / files.length / 1024).toFixed(1)} KB/frame)`,
);

