/* /state-of-premium — volume index for the State of Premium report
 * series.
 *
 * Editorial-magazine treatment: a masthead, a numbered list of
 * published volumes (Vol. I = Jewellery), and a quiet teaser of what
 * comes next. Each card links to the full report. */

import Link from "next/link";
import type { Metadata } from "next";
import ClinicalNavbar from "@/components/ClinicalNavbar";
import ClinicalFooter from "@/components/ClinicalFooter";

export const metadata: Metadata = {
  title: "State of Premium — Sheenhaus",
  description:
    "Editorial audits of how premium categories are showing up online. One sector, one volume, every quarter.",
  openGraph: {
    title: "State of Premium — Sheenhaus",
    description:
      "Editorial audits of how premium categories are showing up online.",
    type: "website",
  },
};

interface Volume {
  numeral: string;
  rom: string;
  title: string;
  href: string | null;
  date: string;
  excerpt: string;
  meta: string;
  status: "published" | "in-progress" | "planned";
}

const VOLUMES: Volume[] = [
  {
    numeral: "01",
    rom: "I",
    title: "Listed jewellery",
    href: "/state-of-premium/jewellery",
    date: "May 2026",
    excerpt:
      "We audited every publicly-listed Indian jewellery company. The category trades at ₹4.4 lakh crore offline; its digital surface trades at template-shop.",
    meta: "Seven houses · Median Sheenhaus Score 43 · Six measurable · One not measured",
    status: "published",
  },
  {
    numeral: "02",
    rom: "II",
    title: "Premium D2C apparel",
    href: null,
    date: "Q3 2026",
    excerpt:
      "Founder-led labels building serious offline reputation while shipping on shopify-default themes. The audit looks at twelve houses in fine apparel, ranging from heritage textiles to direct-to-consumer atelier.",
    meta: "In research",
    status: "in-progress",
  },
  {
    numeral: "03",
    rom: "III",
    title: "Boutique professional practice",
    href: null,
    date: "Q4 2026",
    excerpt:
      "Plastic surgeons, fertility clinics, dental specialists, boutique law firms. Founder-led practices whose digital presence undermines the premium pricing they command offline.",
    meta: "Planned",
    status: "planned",
  },
];

export default function StateOfPremiumIndex() {
  return (
    <main className="theme-clinical" style={{ background: "var(--cl-bg)" }}>
      <ClinicalNavbar />

      {/* Masthead */}
      <section className="relative z-10 shell pt-40 sm:pt-48 md:pt-56 pb-16 max-w-4xl">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid">
            The Audit · A periodic series
          </span>
        </div>
        <h1 className="display-serif font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[16ch]">
          State of <em className="italic-accent">premium.</em>
        </h1>
        <p className="text-text-mid text-[17px] max-w-2xl mt-10 leading-[1.8]">
          One premium category, audited end-to-end, every quarter. We run
          the same public methodology against every brand in a sector and
          publish what the data shows. Houses are referred to throughout
          each volume by market-cap rank only &mdash; the editorial point
          is the category, not any one company.
        </p>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* Volume list */}
      <section className="relative z-10 shell section-pad">
        <ul className="space-y-20 md:space-y-28">
          {VOLUMES.map((vol) => {
            const isPublished = vol.status === "published";
            const Card = isPublished
              ? VolumeCardLink
              : VolumeCardStatic;
            return (
              <li key={vol.numeral}>
                <Card vol={vol} />
              </li>
            );
          })}
        </ul>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* Methodology + commission */}
      <section className="relative z-10 shell section-pad max-w-3xl">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
              Methodology
            </span>
            <p className="text-text-mid text-[15px] mt-5 leading-[1.85]">
              Each volume runs the same public audit defined in our
              twelve-signs diagnostic. We score the public homepage of
              every named company in a category at a single point in time.
              All measurements are date-stamped. Brand names are
              anonymised; companies are referred to by their market-cap
              rank. Right of reply &mdash; any house that disputes a
              measurement is welcome to write in for a correction within
              fourteen days.
            </p>
            <Link
              href="/signs"
              className="inline-block mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-accent underline-offset-4 hover:underline"
            >
              Read the twelve signs →
            </Link>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
              Commission a volume
            </span>
            <p className="text-text-mid text-[15px] mt-5 leading-[1.85]">
              If you run a trade association, an investor newsletter, or
              you&rsquo;re a founder in a category we haven&rsquo;t covered
              yet &mdash; we accept a small number of commissioned audits
              each quarter. Get in touch with the sector and the names you
              want covered; we&rsquo;ll come back with scope, timing and
              terms.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-accent underline-offset-4 hover:underline"
            >
              Start a conversation →
            </Link>
          </div>
        </div>
      </section>
      <ClinicalFooter />
    </main>
  );
}

/* ─── Card variants ─────────────────────────────────────────── */

function VolumeCardLink({ vol }: { vol: Volume }) {
  return (
    <Link
      href={vol.href!}
      className="group block grid md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-start"
    >
      <VolumeCardInner vol={vol} linkable />
    </Link>
  );
}

function VolumeCardStatic({ vol }: { vol: Volume }) {
  return (
    <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-start">
      <VolumeCardInner vol={vol} />
    </div>
  );
}

function VolumeCardInner({
  vol,
  linkable = false,
}: {
  vol: Volume;
  linkable?: boolean;
}) {
  return (
    <>
      {/* Roman numeral */}
      <div className="md:w-28 flex-shrink-0 flex md:flex-col items-baseline md:items-start gap-4 md:gap-2">
        <span
          className="font-serif italic text-[clamp(3rem,6vw,4.5rem)] leading-none text-text"
          style={{ fontFeatureSettings: '"smcp"' }}
        >
          {vol.rom}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
          Vol. {vol.numeral}
        </span>
      </div>
      {/* Content */}
      <div>
        <div className="flex items-baseline gap-4 mb-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-faint">
            {vol.date}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            ·
          </span>
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
              vol.status === "published"
                ? "text-accent"
                : vol.status === "in-progress"
                ? "text-text-mid"
                : "text-text-faint"
            }`}
          >
            {vol.status === "published"
              ? "Published"
              : vol.status === "in-progress"
              ? "In research"
              : "Planned"}
          </span>
        </div>
        <h2
          className={`font-serif text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] text-text ${
            linkable
              ? "transition-colors group-hover:text-accent"
              : ""
          }`}
        >
          {vol.title}
        </h2>
        <p className="text-text-mid text-[16px] mt-5 leading-[1.85] max-w-2xl">
          {vol.excerpt}
        </p>
        <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">
          {vol.meta}
        </div>
        {linkable && (
          <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            Read the volume <span aria-hidden>→</span>
          </div>
        )}
      </div>
    </>
  );
}
