// Server component — reads the category audit dataset at build time
// and composes the page. Interactive charts are client islands.
//
// Generated dataset path: data/jewellery-listed-2026.json
// Regenerate with: node scripts/run-category-audit.mjs

import type { Metadata } from "next";
import Link from "next/link";
import ClinicalNavbar from "@/components/ClinicalNavbar";
import ClinicalFooter from "@/components/ClinicalFooter";
import dataset from "@/data/jewellery-listed-2026.json";
import { type Dataset, type Row, isAudit, isUnreachable } from "./types";
import CountUp from "./CountUp";
import ScoreDistribution from "./ScoreDistribution";
import SignPrevalence from "./SignPrevalence";
import BrandTable from "./BrandTable";
import HouseConstellation from "./HouseConstellation";

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";
const TYPED_DATASET = dataset as unknown as Dataset;

export const metadata: Metadata = {
  title: "The Audit · India's listed jewellery houses, 2026 · Sheenhaus",
  description:
    "We ran our public audit against the seven publicly-listed Indian jewellery companies. Houses are referred to by their market-cap rank. By our methodology, the median Sheenhaus Score is 42. None of the measurable houses scored above 60. One house returned HTTP 403 to our automated request and could not be measured.",
};

/* ─── Aggregate helpers ────────────────────────────────────────── */

function aggregate(rows: Row[]) {
  const auditable = rows.filter((r) => isAudit(r.audit));
  const unreachable = rows.filter((r) => isUnreachable(r.audit));
  const scores = auditable
    .map((r) => (r.audit as { score: number }).score)
    .sort((a, b) => a - b);
  const median =
    scores.length === 0
      ? 0
      : scores.length % 2
      ? scores[(scores.length - 1) / 2]
      : Math.round((scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2);

  const templatePct = pctWithSign(auditable, "01");
  const exposedCmsPct = pctWithSign(auditable, "05");
  const missingSchemaPct = pctWithSign(auditable, "12");

  // Average craft, trust, performance across the auditable set
  const avg = (k: "craft" | "trust" | "performance" | "discoverability") =>
    auditable.length === 0
      ? 0
      : Math.round(
          auditable.reduce(
            (acc, r) =>
              acc + ((r.audit as { scores: Record<string, number> }).scores[k] || 0),
            0
          ) / auditable.length
        );

  return {
    n: rows.length,
    auditable: auditable.length,
    unreachable: unreachable.length,
    median,
    range: scores.length ? [scores[0], scores[scores.length - 1]] : [0, 0],
    templatePct,
    exposedCmsPct,
    missingSchemaPct,
    avgCraft: avg("craft"),
    avgTrust: avg("trust"),
    avgPerf: avg("performance"),
    avgDisc: avg("discoverability"),
  };
}

function pctWithSign(rows: Row[], num: string): number {
  if (rows.length === 0) return 0;
  const hits = rows.filter((r) =>
    isAudit(r.audit) && r.audit.signs.some((s) => s.num === num)
  ).length;
  return Math.round((hits / rows.length) * 100);
}

/* ─── Page ─────────────────────────────────────────────────────── */

export default function JewelleryStatePage() {
  const rows = TYPED_DATASET.results;
  const agg = aggregate(rows);

  // Total market cap audited — the financial scale of the offline
  // brands set against the digital quality we observed
  const totalMcapCr = rows.reduce((acc, r) => acc + r.brand.marketCapCr, 0);
  const totalMcapLakhCr = (totalMcapCr / 100000).toFixed(1);

  return (
    <main className="theme-clinical" style={{ background: "var(--cl-bg)", minHeight: "100vh" }}>
      <ClinicalNavbar />

      {/* MASTHEAD */}
      <section className="relative z-10 shell pt-40 sm:pt-48 md:pt-56 pb-16">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid">
            The Audit · Chapter 01 · Jewellery
          </span>
        </div>
        <h1 className="display-serif font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[22ch]">
          India&rsquo;s listed jewellers built{" "}
          <em className="italic-accent">₹{totalMcapLakhCr} lakh crore</em> of
          offline brand. Their websites are not part of that work.
        </h1>
        <p className="text-text-mid text-[17px] max-w-2xl mt-10 leading-[1.8]">
          We ran our public audit against every publicly-listed Indian
          jewellery company &mdash; seven houses, referred to throughout this
          report by their market-cap rank (House 01 = largest). By our
          methodology the median Sheenhaus Score is{" "}
          <span className="text-accent">{agg.median}/100</span>. None of the
          six measurable houses scored above 60. The largest by market cap
          returned HTTP 403 to our automated request and could not be scored.
          What follows is what the data we could collect shows.
        </p>

        {/* Constellation — the entire category, in one image. */}
        <HouseConstellation rows={rows} />
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* THE VERDICT — aggregate numbers */}
      <section className="relative z-10 shell section-pad">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20 items-start">
          <div>
            <ChapterMark numeral="I" label="The verdict" />
            <h2 className="display-serif font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] mt-6 max-w-[18ch]">
              A category that has not noticed{" "}
              <em className="italic-accent">the web changed.</em>
            </h2>
          </div>
          <div className="space-y-12">
            <Stat
              label="Median Sheenhaus Score"
              value={<CountUp target={agg.median} />}
              caption={`Range ${agg.range[0]}–${agg.range[1]} across ${agg.auditable} measurable houses. The largest by market cap returned HTTP 403 to our automated request and was not scored.`}
            />
            <Stat
              label="Built on template / page-builder stacks"
              value={<CountUp target={agg.templatePct} suffix="%" />}
              caption="Every auditable house ships some combination of WordPress, Shopify, Wix or similar — visible in the page source within seconds of opening Inspector."
            />
            <Stat
              label="Exposing CMS scaffolding in URLs"
              value={<CountUp target={agg.exposedCmsPct} suffix="%" />}
              caption="`.php`, `?id=27`, `/wp-content/`. A small detail. Premium buyers read it as a signal of the rest."
            />
            <Stat
              label="Missing structured data for AI assistants"
              value={<CountUp target={agg.missingSchemaPct} suffix="%" />}
              caption="When a buyer asks ChatGPT or Claude for the best Indian jeweller in 2026, the model relies on JSON-LD schema to read each brand. Most of the sample is invisible to it."
            />
          </div>
        </div>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* SCORE DISTRIBUTION */}
      <section className="relative z-10 shell section-pad">
        <ChapterMark numeral="II" label="Distribution" />
        <h2 className="display-serif font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] mt-6 max-w-[24ch]">
          The whole sample sits in the lower half of the scale.
        </h2>
        <p className="text-text-mid text-[16px] max-w-2xl mt-6 leading-[1.8]">
          Each band groups the houses by their composite score. A score of 70+
          is what we&rsquo;d expect of a brand that has commissioned its site;
          below 50 is where the digital surface actively undermines the
          offline brand. The whole listed-jewellery sample sits in the lower
          two-thirds of the scale.
        </p>
        <div className="mt-16">
          <ScoreDistribution rows={rows} />
        </div>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* SIGN PREVALENCE */}
      <section className="relative z-10 shell section-pad">
        <ChapterMark numeral="III" label="The twelve signs · prevalence" />
        <h2 className="display-serif font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] mt-6 max-w-[24ch]">
          The same patterns repeat across every house.
        </h2>
        <p className="text-text-mid text-[16px] max-w-2xl mt-6 leading-[1.8]">
          Each row shows the percentage of the auditable sample exhibiting
          that sign. The patterns at the top are not isolated lapses &mdash;
          they are how the category builds websites. Click any sign to read
          why it costs the brand.
        </p>
        <div className="mt-16">
          <SignPrevalence rows={rows} />
        </div>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* PER-BRAND TABLE */}
      <section className="relative z-10 shell section-pad">
        <ChapterMark numeral="IV" label="The houses, in order" />
        <h2 className="display-serif font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] mt-6 max-w-[24ch]">
          The audit, side by side with the balance sheet.
        </h2>
        <p className="text-text-mid text-[16px] max-w-2xl mt-6 leading-[1.8]">
          Sort by audit score, market capitalisation, or quarterly sales.
          The gap between the financial size of the offline brand and the
          craft of its digital presence is the brief, in one row.
        </p>
        <div className="mt-12">
          <BrandTable rows={rows} />
        </div>
      </section>

      {/* CLOSING BEAT */}
      <section className="relative z-10 shell section-pad text-center">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid">
            Where this leaves you
          </span>
        </div>
        <h2 className="display-serif font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[22ch] mx-auto">
          The category is{" "}
          <em className="italic-accent">collectively undefended.</em>
        </h2>
        <p className="text-text-mid text-[17px] max-w-2xl mx-auto mt-10 leading-[1.8]">
          The brand that closes this gap first &mdash; not with a flashier
          site, but with the kind of restrained, considered, AI-readable
          digital presence its showrooms already are &mdash; will own the
          category online for a decade. We&rsquo;d like to help build it.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-14">
          <Link href="/audit" className="btn-bronze">
            Audit your own site <span aria-hidden>→</span>
          </Link>
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Book a call <span aria-hidden>→</span>
          </a>
        </div>

        {/* Methodology + legal — small, restrained, never the focus */}
        <div className="mt-24 pt-12 border-t border-border max-w-2xl mx-auto text-left space-y-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
              Methodology
            </span>
            <p className="text-text-mid text-[14px] mt-4 leading-[1.85]">
              We audited the homepage of each company on{" "}
              <strong className="font-medium">
                {new Date(TYPED_DATASET.generatedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </strong>{" "}
              using the same heuristics that power the public{" "}
              <Link href="/audit" className="text-accent underline-offset-4 hover:underline">
                /audit
              </Link>{" "}
              tool. Financial figures are from Screener.in for the most recent
              quarter. Scores are computed from twelve weighted detectors
              outlined in our{" "}
              <Link href="/signs" className="text-accent underline-offset-4 hover:underline">
                twelve signs
              </Link>{" "}
              diagnostic. Houses are anonymised throughout this report and
              referred to only by their market-cap rank (House 01 = largest).
              The largest by market cap returned HTTP 403 to our automated
              request and could not be scored &mdash; the same behaviour
              visitors see when sharing the URL on Slack or WhatsApp.
            </p>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
              Right of reply
            </span>
            <p className="text-text-mid text-[14px] mt-4 leading-[1.85]">
              The Sheenhaus Score is one studio&rsquo;s composite metric, not an
              industry standard. Any brand named here that disputes a specific
              measurement is welcome to write to{" "}
              <a
                href="mailto:hello@sheenhaus.com"
                className="text-accent underline-offset-4 hover:underline"
              >
                hello@sheenhaus.com
              </a>{" "}
              &mdash; we will publish a correction or a clarification within
              fourteen days.
            </p>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
              Notice
            </span>
            <p className="text-text-faint text-[12px] mt-4 leading-[1.85]">
              This report is editorial commentary on publicly accessible
              websites. All company names, brand marks and trademarks remain
              the property of their respective owners and are used here under
              nominative fair use for the purpose of comparative analysis. The
              report does not constitute investment, legal or financial advice.
              Audit results reflect a single point-in-time measurement on the
              date noted above; current state may differ.
            </p>
          </div>
        </div>

        <Link
          href="/"
          data-link-style="bronze"
          className="inline-block mt-12 font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim"
        >
          ← Back to the studio
        </Link>
      </section>
      <ClinicalFooter />
    </main>
  );
}

/* ─── ChapterMark — small Roman numeral + label, like a printed report ─ */
function ChapterMark({ numeral, label }: { numeral: string; label: string }) {
  return (
    <div className="inline-flex items-baseline gap-4">
      <span
        className="display-serif font-serif"
        style={{
          fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: "#8a6a35",
        }}
      >
        {numeral}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-faint">
        {label}
      </span>
    </div>
  );
}

/* ─── Stat row — label, big number, small caption ─── */
function Stat({
  label,
  value,
  caption,
}: {
  label: string;
  value: React.ReactNode;
  caption: string;
}) {
  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-faint">
        {label}
      </span>
      <div className="display-serif font-serif text-[clamp(3rem,8vw,6rem)] leading-none tracking-[-0.035em] mt-3 text-text">
        {value}
      </div>
      <p className="text-text-mid text-[15px] mt-4 max-w-md leading-[1.8]">
        {caption}
      </p>
    </div>
  );
}
