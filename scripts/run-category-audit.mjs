#!/usr/bin/env node
// Run the Sheenhaus audit against a curated list of brand domains,
// then write the aggregated results to data/<slug>-<year>.json for
// build-time consumption by the category-audit page.
//
// Usage:
//   node scripts/run-category-audit.mjs
//
// Requires:
//   - A running dev server on http://localhost:3003 (configurable via API_BASE)
//
// Pacing: 8s between requests to be gentle on PageSpeed's free tier and
// on the audited sites themselves. With ~7 sites that's ~1 minute total.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const API_BASE = process.env.API_BASE || "http://localhost:3003";

/* ─── The set ──────────────────────────────────────────────────────
 * India's publicly-listed jewellery houses (Screener Q-snapshot 2026).
 * For Titan we audit Tanishq (the consumer-facing jewellery brand);
 * other entries are the canonical public site. */
const SET = {
  slug: "jewellery-listed",
  year: 2026,
  vertical: "Jewellery",
  framing: "India's publicly-listed jewellery houses",
  // displayName is what we render on the page
  // domain is what we feed the audit API
  // tickerInfo is structured financial context for the editorial layer
  brands: [
    {
      displayName: "Tanishq",
      parent: "Titan Company",
      ticker: "TITAN",
      domain: "tanishq.co.in",
      marketCapCr: 362199,
      qtrSalesCr: 26920,
      pe: 70.36,
    },
    {
      displayName: "Kalyan Jewellers",
      parent: null,
      ticker: "KALYANKJIL",
      domain: "kalyanjewellers.net",
      marketCapCr: 36393.76,
      qtrSalesCr: 10274.94,
      pe: 26.41,
    },
    {
      displayName: "Thangamayil Jewellery",
      parent: null,
      ticker: "THANGAMAYL",
      domain: "thangamayil.com",
      marketCapCr: 11864.94,
      qtrSalesCr: 2839.17,
      pe: 33.57,
    },
    {
      displayName: "PC Jeweller",
      parent: null,
      ticker: "PCJEWELLER",
      domain: "pcjeweller.com",
      marketCapCr: 8127.72,
      qtrSalesCr: 875.38,
      pe: 12.37,
    },
    {
      displayName: "Sky Gold & Diamonds",
      parent: null,
      ticker: "SKYGOLD",
      domain: "skygold.co.in",
      marketCapCr: 7278.3,
      qtrSalesCr: 1767.68,
      pe: 31.74,
    },
    {
      displayName: "BlueStone",
      parent: "Bluestone Jewel Ltd",
      ticker: "BLUESTONE",
      domain: "bluestone.com",
      marketCapCr: 7229.53,
      qtrSalesCr: 681.47,
      pe: 487.17,
    },
    {
      displayName: "P. N. Gadgil & Sons",
      parent: null,
      ticker: "PNGJL",
      domain: "pngadgilandsons.com",
      marketCapCr: 7134.19,
      qtrSalesCr: 3544.31,
      pe: 17.3,
    },
  ],
};

const DELAY_MS = 8000;

async function audit(domain) {
  const url = `https://${domain}`;
  const res = await fetch(`${API_BASE}/api/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    throw new Error(`audit ${domain}: HTTP ${res.status}`);
  }
  return res.json();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(
    `Running ${SET.brands.length} audits against ${API_BASE} ` +
      `(~${Math.round((SET.brands.length * DELAY_MS) / 1000)}s pacing)\n`
  );

  const results = [];
  for (const brand of SET.brands) {
    process.stdout.write(`  ${brand.domain.padEnd(28)} `);
    const t0 = Date.now();
    try {
      const data = await audit(brand.domain);
      const dt = ((Date.now() - t0) / 1000).toFixed(1);
      if (data.unreachable) {
        console.log(`× ${data.reason}${data.status ? ` (${data.status})` : ""}  [${dt}s]`);
      } else if (data.selfReferential) {
        console.log(`= self-ref  [${dt}s]`);
      } else {
        console.log(
          `${String(data.score).padStart(3)}/100 · ${data.signs.length} signs · ${
            data.pagespeed ? "live" : "html-only"
          }  [${dt}s]`
        );
      }
      results.push({ brand, audit: data });
    } catch (err) {
      console.log(`✗ ${err.message}`);
      results.push({ brand, audit: { error: err.message } });
    }
    await sleep(DELAY_MS);
  }

  const payload = {
    set: {
      slug: SET.slug,
      year: SET.year,
      vertical: SET.vertical,
      framing: SET.framing,
    },
    generatedAt: new Date().toISOString(),
    results,
  };

  const outPath = resolve(ROOT, "data", `${SET.slug}-${SET.year}.json`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`\nWrote ${outPath}`);

  // Quick aggregate summary so we can read the result at a glance
  const scored = results.filter((r) => typeof r.audit.score === "number");
  if (scored.length) {
    const scores = scored.map((r) => r.audit.score).sort((a, b) => a - b);
    const median = scores[Math.floor(scores.length / 2)];
    const min = scores[0];
    const max = scores[scores.length - 1];
    console.log(
      `\nAggregate: median ${median} · range ${min}–${max} · n=${scored.length}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
