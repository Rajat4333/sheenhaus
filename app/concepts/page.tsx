"use client";
import Link from "next/link";
import ClinicalNavbar from "@/components/ClinicalNavbar";
import ClinicalFooter from "@/components/ClinicalFooter";
import ThesesView from "./ThesesView";

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";

export default function ConceptsPage() {
  return (
    <main className="theme-clinical" style={{ background: "var(--cl-bg)", minHeight: "100vh" }}>
      <ClinicalNavbar />

      {/* MASTHEAD */}
      <section className="relative z-10 shell pt-40 sm:pt-48 md:pt-56 pb-20">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid whitespace-nowrap">
            Theses (04) · The Studio
          </span>
        </div>
        <h1 className="display-serif font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[22ch]">
          Four <em className="italic-accent">positions</em> on how premium
          brands should behave online.
        </h1>
        <p className="text-text-mid text-[17px] max-w-2xl mt-10 leading-[1.8]">
          These are the convictions that shape every brief we accept. They are
          not lessons learned from other people&apos;s case studies. They are
          the standards we hold ourselves to before a client engagement begins.
          Read them as commitments — to you, before we have met.
        </p>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* THESES with dual-axis filter */}
      <ThesesView />

      {/* CTA */}
      <section className="relative z-10 shell pt-32 md:pt-40 pb-24 md:pb-32 text-center">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid whitespace-nowrap">
            Have a brief?
          </span>
        </div>
        <h2 className="display-serif font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[20ch] mx-auto">
          We work on{" "}
          <em className="italic-accent">three</em> engagements at a time.
        </h2>
        <p className="text-text-mid text-[17px] max-w-xl mx-auto mt-8 leading-[1.8]">
          If any of these positions resonates with the brand you are building,
          book a twenty-minute introduction. We will study your current site
          and give you an honest assessment.
        </p>
        <div className="flex flex-col items-center gap-6 mt-14">
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-bronze"
          >
            Book a call <span aria-hidden>→</span>
          </a>
          <Link
            href="/"
            data-link-style="bronze"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim"
          >
            ← Back to the studio
          </Link>
        </div>
      </section>
      <ClinicalFooter />
    </main>
  );
}
