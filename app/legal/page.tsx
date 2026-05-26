/* /legal — single editorial page combining privacy, terms, acceptable
 * use, and the editorial / trademark notice.
 *
 * Written as prose, not legalese — the rule is: each clause should be
 * understood by a founder reading it on a phone in two minutes. This
 * page is a baseline good-faith publication; for procurement-grade
 * contracts, separate per-engagement terms live in each signed SOW.
 *
 * Jurisdiction: India (Sheenhaus is a Delhi-based studio). The page
 * speaks to international visitors using GDPR / DPDP principles. */

import Link from "next/link";
import type { Metadata } from "next";
import ClinicalNavbar from "@/components/ClinicalNavbar";
import ClinicalFooter from "@/components/ClinicalFooter";

export const metadata: Metadata = {
  title: "Legal — Sheenhaus",
  description:
    "Privacy, terms of use, acceptable use, and the editorial notice for Sheenhaus reports.",
  robots: { index: false, follow: true },
};

const LAST_UPDATED = "26 May 2026";
const EMAIL = "hello@sheenhaus.com";

export default function LegalPage() {
  return (
    <main className="theme-clinical" style={{ background: "var(--cl-bg)" }}>
      <ClinicalNavbar />

      {/* Masthead */}
      <section className="relative z-10 shell pt-40 sm:pt-48 md:pt-56 pb-12 max-w-3xl">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid">
            Legal · Sheenhaus
          </span>
        </div>
        <h1 className="display-serif font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.025em] mt-10 max-w-[20ch]">
          The short, <em className="italic-accent">readable</em> version.
        </h1>
        <p className="text-text-mid text-[17px] mt-10 leading-[1.8] max-w-2xl">
          What we collect, what we don&rsquo;t, how the audit tool can be
          used, and how third-party brand names appear in our reports.
          Plain language, no dark patterns. If anything here is unclear,
          write to{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-accent underline-offset-4 hover:underline"
          >
            {EMAIL}
          </a>
          .
        </p>
        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
          Last updated · {LAST_UPDATED}
        </div>

        {/* Quick anchors */}
        <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
          <a href="#privacy" className="hover:text-accent transition-colors">
            01 · Privacy
          </a>
          <a href="#terms" className="hover:text-accent transition-colors">
            02 · Terms of use
          </a>
          <a href="#audit" className="hover:text-accent transition-colors">
            03 · Audit acceptable use
          </a>
          <a href="#reports" className="hover:text-accent transition-colors">
            04 · Reports + trademarks
          </a>
          <a href="#liability" className="hover:text-accent transition-colors">
            05 · Liability + jurisdiction
          </a>
        </nav>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* 01 · Privacy */}
      <Section id="privacy" numeral="I" label="Privacy">
        <h2 className="display-serif font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] leading-[1.15] tracking-[-0.015em] text-text mt-6 mb-4">What we collect, what we don&rsquo;t.</h2>
        <P>
          Sheenhaus is a small studio. We collect as little as possible
          and we do not sell or share what we collect.
        </P>
        <SubHeading>The site itself</SubHeading>
        <P>
          We use Vercel Analytics for aggregate page-view counts. It is
          cookie-less, IP-anonymised, and we cannot identify individual
          visitors from it. No third-party advertising trackers, no
          retargeting pixels, no session recording.
        </P>
        <SubHeading>The audit tool ({"/audit"})</SubHeading>
        <P>
          When you submit a URL we fetch the public homepage of that URL
          (the same way any visitor or search engine does), run a
          Lighthouse audit, and apply our twelve-signs heuristic to the
          response. We retain the audit result for our internal records
          for up to twelve months and may use anonymised aggregate
          statistics in future research, with no URL or identifier
          attached.
        </P>
        <P>
          If you choose to receive the report by email, your email
          address is used only to send that one report. We do not add
          you to a newsletter, marketing list, or any third-party
          service. We do not sell or share email addresses.
        </P>
        <SubHeading>The contact form ({"/contact"})</SubHeading>
        <P>
          Fields you fill in (name, email, company, project type,
          timeline, message) are emailed to{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-accent underline-offset-4 hover:underline"
          >
            {EMAIL}
          </a>{" "}
          via Resend (our transactional-email provider). We respond from
          the same inbox. We do not import the data into any CRM or
          marketing platform.
        </P>
        <SubHeading>Your rights</SubHeading>
        <P>
          You may request a copy of the personal data we hold about you,
          ask for it to be corrected, or ask for it to be deleted at any
          time. We will action requests within thirty days. Write to{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-accent underline-offset-4 hover:underline"
          >
            {EMAIL}
          </a>
          {"."} If you are in the UK or EU, you also retain your rights
          under the UK GDPR and EU GDPR; if you are in India, the
          provisions of the Digital Personal Data Protection Act, 2023
          (DPDP) apply.
        </P>
      </Section>

      <Divider />

      {/* 02 · Terms of use */}
      <Section id="terms" numeral="II" label="Terms of use">
        <h2 className="display-serif font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] leading-[1.15] tracking-[-0.015em] text-text mt-6 mb-4">Using this site.</h2>
        <P>
          By accessing sheenhaus.com you agree to use the site for the
          editorial and diagnostic purposes for which it is provided.
          You may not attempt to disrupt the service, scrape data at
          volume, or use the audit tool to systematically target
          third-party sites in a way that would harm the operator of
          those sites.
        </P>
        <P>
          The content of this site &mdash; including the twelve-signs
          essays, the State of Premium reports, the audit methodology
          and the typography &mdash; is published as editorial work by
          Sheenhaus. You may quote, screenshot or link to it for your
          own commentary or research with appropriate attribution. You
          may not republish the work in its entirety or pass it off as
          your own.
        </P>
      </Section>

      <Divider />

      {/* 03 · Audit acceptable use */}
      <Section id="audit" numeral="III" label="Audit acceptable use">
        <h2 className="display-serif font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] leading-[1.15] tracking-[-0.015em] text-text mt-6 mb-4">What the audit tool is for.</h2>
        <P>
          The audit tool is a public diagnostic. By submitting a URL you
          confirm one of the following:
        </P>
        <Bullets>
          <li>
            You have authority over the URL (it is your site or you have
            permission to audit it on the owner&rsquo;s behalf), <em>or</em>
          </li>
          <li>
            The URL is publicly accessible and your use of the audit is
            for editorial, journalistic, comparative or diagnostic
            research.
          </li>
        </Bullets>
        <P>
          The audit produces a composite &ldquo;Sheenhaus Score&rdquo;
          based on the twelve signs and a Lighthouse pass. This score is
          one studio&rsquo;s opinion, not an industry standard. It
          reflects a single point-in-time measurement and may differ
          from later measurements. The score should not be used to make
          unilateral commercial claims about a third party.
        </P>
        <P>
          You may not use the audit tool to harass a third party,
          generate misleading reports about a competitor, or
          systematically target a category of businesses without an
          editorial purpose. We reserve the right to refuse service to
          accounts or IP addresses that appear to be using the tool in
          bad faith.
        </P>
      </Section>

      <Divider />

      {/* 04 · Reports + trademarks */}
      <Section id="reports" numeral="IV" label="Reports + trademarks">
        <h2 className="display-serif font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] leading-[1.15] tracking-[-0.015em] text-text mt-6 mb-4">
          How we treat third-party names in published research.
        </h2>
        <P>
          Sheenhaus publishes editorial audits of specific premium
          categories (the <em>State of Premium</em> series). In published
          volumes, individual companies are referred to by their{" "}
          <em>market-capitalisation rank</em> only (House 01 = largest)
          and are not named. The editorial point of each volume is the
          category, not any individual company.
        </P>
        <P>
          All company names, brand marks, and trademarks remain the
          property of their respective owners. Any mention of a
          third-party trademark in our editorial commentary is made
          under the principles of <em>nominative fair use</em> &mdash;
          that is, used solely to identify the entity in factual
          reference, not to suggest affiliation, endorsement, or
          sponsorship.
        </P>
        <P>
          Any company that is the subject of a measurement and wishes
          to dispute, correct, or annotate a published statement may
          write to{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-accent underline-offset-4 hover:underline"
          >
            {EMAIL}
          </a>
          {"."} We will publish a correction or right-of-reply within
          fourteen days.
        </P>
      </Section>

      <Divider />

      {/* 05 · Liability + jurisdiction */}
      <Section id="liability" numeral="V" label="Liability + jurisdiction">
        <h2 className="display-serif font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] leading-[1.15] tracking-[-0.015em] text-text mt-6 mb-4">The unavoidable boilerplate, brief.</h2>
        <P>
          The site, the audit tool, the reports and any other content
          published at sheenhaus.com are provided <em>as is</em>, without
          warranty of any kind. Sheenhaus is not liable for any direct,
          indirect, incidental or consequential damages arising from the
          use of, or inability to use, the content of this site.
        </P>
        <P>
          Reports and audit results are <em>editorial commentary</em> and
          do <em>not</em> constitute investment, legal, tax, or financial
          advice. They are intended to inform conversation, not to drive
          unilateral commercial decisions.
        </P>
        <P>
          These terms and any disputes arising from your use of
          sheenhaus.com are governed by the laws of India, with
          jurisdiction in the courts of New Delhi. If you are accessing
          this site from outside India, applicable consumer-protection
          laws in your jurisdiction may continue to apply where
          mandatory.
        </P>
      </Section>

      {/* Closing */}
      <section className="relative z-10 shell pt-16 pb-32 text-center">
        <p className="text-text-mid text-[15px] max-w-xl mx-auto leading-[1.85] italic font-serif">
          If you read this far, thank you. Plain-language legal pages
          are not a marketing exercise &mdash; they are part of doing
          serious work in public.
        </p>
        <Link
          href="/"
          data-link-style="bronze"
          className="inline-block mt-12 font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim"
        >
          ← Back to home
        </Link>
      </section>
      <ClinicalFooter />
    </main>
  );
}

/* ── Helpers ───────────────────────────────────────────────── */

function Section({
  id,
  numeral,
  label,
  children,
}: {
  id: string;
  numeral: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative z-10 shell section-pad max-w-3xl scroll-mt-32"
    >
      <div className="flex items-baseline gap-4">
        <span className="font-serif italic text-2xl text-accent leading-none">
          {numeral}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mid">
          {label}
        </span>
      </div>
      <div className="mt-8 space-y-6">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-text-mid text-[15px] leading-[1.85] max-w-2xl">
      {children}
    </p>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint mt-8 mb-2">
      {children}
    </h3>
  );
}

function Bullets({ children }: { children: React.ReactNode }) {
  return (
    <ul className="text-text-mid text-[15px] leading-[1.85] max-w-2xl space-y-3 my-2">
      {children}
    </ul>
  );
}

function Divider() {
  return (
    <div className="shell">
      <div className="hairline" />
    </div>
  );
}
