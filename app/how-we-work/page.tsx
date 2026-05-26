/* /how-we-work — the studio's operating model.
 *
 * Engagement structures, timeline, time-zone, what we ship, what we
 * don't ship. Written for an international prospect (US / UK / Dubai)
 * who needs to know we operate professionally before they care about
 * the work. */

import Link from "next/link";
import type { Metadata } from "next";
import ClinicalNavbar from "@/components/ClinicalNavbar";
import ClinicalFooter from "@/components/ClinicalFooter";

export const metadata: Metadata = {
  title: "How we work — Sheenhaus",
  description:
    "Three engagement structures, fourteen-day delivery, async-first across UK / EU / Middle East / US Pacific. How a Sheenhaus engagement runs from brief to launch.",
};

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";

export default function HowWeWork() {
  return (
    <main className="theme-clinical" style={{ background: "var(--cl-bg)" }}>
      <ClinicalNavbar />

      {/* Masthead */}
      <section className="relative z-10 shell pt-40 sm:pt-48 md:pt-56 pb-12 max-w-4xl">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid whitespace-nowrap">
            How we work · The studio operating model
          </span>
        </div>
        <h1 className="display-serif font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[18ch]">
          A small studio. Three engagements at a time.{" "}
          <em className="italic-accent">Built end-to-end.</em>
        </h1>
        <p className="text-text-mid text-[17px] max-w-2xl mt-10 leading-[1.8]">
          We hold ourselves to one quality of work and to one cadence. We
          don&rsquo;t scale by hiring or by templating &mdash; we scale by
          refusing engagements that don&rsquo;t fit. Three structures
          below describe what we accept; everything else, politely, we
          don&rsquo;t.
        </p>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* Three engagement structures */}
      <section className="relative z-10 shell section-pad">
        <ChapterMark numeral="I" label="The three engagements" />
        <div className="space-y-24 md:space-y-32 mt-16">
          <Engagement
            roman="I"
            name="Audit"
            duration="1 week"
            tagline="One week. One question: what's leaking your customers, and how do we fix it?"
            description="We score your existing site against the Sheenhaus twelve-signs methodology, identify the specific failures that are leaking premium buyers, and deliver a written report with prioritised recommendations. Useful as a standalone diagnostic or as the first phase of a longer engagement."
            deliverables={[
              "Audit report (15-25pp PDF) with the twelve signs scored",
              "Lighthouse + AI-visibility + structural diagnostics",
              "Prioritised remediation list with effort + impact estimates",
              "Two follow-up calls — one to walk through the report, one to scope the rebuild if you commission it",
            ]}
            credit="If you commission the Build engagement within 60 days, the Audit is credited against it."
          />
          <Engagement
            roman="II"
            name="Build"
            duration="14 – 28 days"
            tagline="The cinematic, AI-native rebuild. Hand-coded from line one."
            description="A complete rebuild of your public website on a modern stack (Next.js, React, GLSL where it earns it, Sheenhaus's typography system). We script the work into fortnightly sprints with a fixed launch date. Two-week engagements ship a tight 5–8-page site; four-week engagements ship a larger brand surface with editorial sections, motion, and integrations."
            deliverables={[
              "Full website rebuild on Next.js (or your stack, if there's a reason)",
              "Custom motion + 3D where it serves the brand — never gimmicks",
              "AI-readable structured data, schema, and content surface",
              "Hand-off pack: docs, design tokens, CMS guide, deployment pipeline",
            ]}
            credit="Fixed scope. Fixed launch date. No retainer locks in."
          />
          <Engagement
            roman="III"
            name="Operate"
            duration="Ongoing"
            tagline="Workflow automation, AI integrations, ongoing surface work. A studio retainer behind your business."
            description="After a Build (or, less commonly, on its own), we run as your remote technical team — landing the small but compounding work that keeps the surface moving and the workflows running. Capped at four hours per business day so the work stays craft, not throughput."
            deliverables={[
              "Workflow automations (Zapier / Make / custom Node)",
              "AI-native integrations (search, content, agents, intake)",
              "Editorial surface work — new sections, reports, campaigns",
              "Monthly written readout: what shipped, what didn't, what's next",
            ]}
            credit="Month-to-month. Cancel any time. No exit clauses."
          />
        </div>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* How a project actually runs */}
      <section className="relative z-10 shell section-pad max-w-4xl">
        <ChapterMark numeral="II" label="What a Build week looks like" />
        <h2 className="display-serif font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] mt-6 max-w-[20ch]">
          One cadence. Async-first. Written down.
        </h2>
        <p className="text-text-mid text-[16px] mt-6 leading-[1.85] max-w-2xl">
          We work in fortnightly sprints with two live calls per week.
          Everything is written down: a shared Linear board, a weekly
          looms, a Slack channel that quiets down outside working hours.
          You always know what shipped, what didn&rsquo;t, and why.
        </p>
        <ol className="mt-14 space-y-12">
          <Phase
            day="Day 0"
            name="Brief & scope-lock"
            body="A one-hour live call to lock the brief, the scope, and the launch date. We produce a written one-pager you sign off before any code is written. Scope is fixed; we say no to changes that don't fit, in writing."
          />
          <Phase
            day="Day 1 – 4"
            name="Architecture & systems"
            body="Information architecture, design tokens, motion direction, content surface. The plumbing for the next ten days. You see a Loom every day; you respond async."
          />
          <Phase
            day="Day 5 – 11"
            name="Build"
            body="Hand-coded section by section. Daily preview link. Two live calls (Tue, Fri) to walk through what shipped and what's blocked. AI-readable schema and content structure shipped alongside the visual layer."
          />
          <Phase
            day="Day 12 – 13"
            name="Polish & QA"
            body="Lighthouse 95+ everywhere. AI assistant compatibility tested. Real-device QA. Content review with your team."
          />
          <Phase
            day="Day 14"
            name="Launch"
            body="Go-live during your business hours, in your time zone. We sit on the line for the first 90 minutes. The hand-off pack arrives the same day."
          />
        </ol>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* Time zone + how we communicate */}
      <section className="relative z-10 shell section-pad max-w-4xl">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <ChapterMark numeral="III" label="Time zone" />
            <p className="text-text-mid text-[16px] mt-6 leading-[1.85]">
              The studio is based in <strong className="font-medium text-text">Delhi (IST · UTC+5:30)</strong>. We hold working hours from
              09:00 to 22:00 IST &mdash; which gives us overlap with the UK
              workday, the entire EU and Middle East workday, and US
              Pacific morning. Live calls are scheduled in your time zone,
              never ours.
            </p>
            <table className="mt-8 w-full font-mono text-[11px] uppercase tracking-[0.18em] text-text-faint">
              <tbody className="border-t border-border">
                <tr className="border-b border-border">
                  <td className="py-3 pr-4">London / Dubai</td>
                  <td className="py-3 text-accent">8+ hours overlap</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 pr-4">New York</td>
                  <td className="py-3 text-accent">3–4 hours overlap, evenings IST</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 pr-4">San Francisco</td>
                  <td className="py-3 text-accent">2 hours overlap, late nights IST</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <ChapterMark numeral="IV" label="How we communicate" />
            <ul className="mt-6 space-y-5 text-text-mid text-[16px] leading-[1.7]">
              <Bullet>
                <strong className="font-medium text-text">Slack channel</strong> for the engagement &mdash; replies within four working hours, quieter outside.
              </Bullet>
              <Bullet>
                <strong className="font-medium text-text">Two live calls per week</strong> &mdash; scheduled in your time zone, 30 minutes each, written agenda.
              </Bullet>
              <Bullet>
                <strong className="font-medium text-text">Loom updates</strong> on days without a call &mdash; you watch on your own time, react async.
              </Bullet>
              <Bullet>
                <strong className="font-medium text-text">Linear board</strong> for the work itself &mdash; visible to you, always.
              </Bullet>
              <Bullet>
                <strong className="font-medium text-text">Written readout</strong> at the end of every week &mdash; what shipped, what didn&rsquo;t, what&rsquo;s next.
              </Bullet>
            </ul>
          </div>
        </div>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* What we don't do */}
      <section className="relative z-10 shell section-pad max-w-4xl">
        <ChapterMark numeral="V" label="What we don't do" />
        <h2 className="display-serif font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] mt-6 max-w-[20ch]">
          The negative space matters as much as the work.
        </h2>
        <ul className="mt-12 space-y-4 text-text-mid text-[16px] leading-[1.85]">
          <li><strong className="font-medium text-text">No templates.</strong> Every site is hand-coded. We use design systems, not page builders.</li>
          <li><strong className="font-medium text-text">No procurement battles.</strong> If your buyer needs a 30-page RFP, we&rsquo;re probably the wrong studio.</li>
          <li><strong className="font-medium text-text">No agency middlemen.</strong> You work with the same two people from brief to launch.</li>
          <li><strong className="font-medium text-text">No hourly billing.</strong> Fixed scope, fixed launch date — every engagement.</li>
          <li><strong className="font-medium text-text">No NDAs at first contact.</strong> We&rsquo;ll sign one before we see anything sensitive, never before.</li>
          <li><strong className="font-medium text-text">No retainers we can&rsquo;t cancel.</strong> Operate is month-to-month, no exit fee.</li>
          <li><strong className="font-medium text-text">No surprise scope changes.</strong> If you change the brief, we re-scope in writing first.</li>
        </ul>
      </section>

      {/* Closing CTA */}
      <section className="relative z-10 shell section-pad text-center">
        <h2 className="display-serif font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.025em] max-w-[22ch] mx-auto">
          That&rsquo;s the model.{" "}
          <em className="italic-accent">Want to start a conversation?</em>
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-14">
          <Link href="/contact" className="btn-bronze">
            Send a brief <span aria-hidden>→</span>
          </Link>
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Book a 30-minute call <span aria-hidden>→</span>
          </a>
        </div>
      </section>
      <ClinicalFooter />
    </main>
  );
}

/* ── Sub-components ────────────────────────────────────────── */

function ChapterMark({ numeral, label }: { numeral: string; label: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="font-serif italic text-2xl text-accent leading-none">
        {numeral}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mid">
        {label}
      </span>
    </div>
  );
}

function Engagement({
  roman,
  name,
  duration,
  tagline,
  description,
  deliverables,
  credit,
}: {
  roman: string;
  name: string;
  duration: string;
  tagline: string;
  description: string;
  deliverables: string[];
  credit: string;
}) {
  return (
    <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-start">
      <div className="md:w-32 flex-shrink-0 flex md:flex-col items-baseline md:items-start gap-3 md:gap-2">
        <span className="font-serif italic text-[clamp(2.5rem,5vw,4rem)] leading-none text-text">
          {roman}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
          {duration}
        </span>
      </div>
      <div>
        <div className="flex items-baseline gap-4 flex-wrap mb-3">
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-text">
            {name}
          </h2>
        </div>
        <p className="font-serif italic text-text-mid text-[18px] md:text-[20px] mt-2 leading-[1.5] max-w-2xl">
          {tagline}
        </p>
        <p className="text-text-mid text-[16px] mt-5 leading-[1.85] max-w-2xl">
          {description}
        </p>
        <div className="mt-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
            What you get
          </span>
          <ul className="mt-3 space-y-2 text-text-mid text-[15px] leading-[1.8] max-w-2xl">
            {deliverables.map((d) => (
              <li key={d} className="flex gap-3">
                <span className="text-accent shrink-0">·</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-text-faint leading-[1.6] max-w-2xl">
          {credit}
        </p>
      </div>
    </div>
  );
}

function Phase({
  day,
  name,
  body,
}: {
  day: string;
  name: string;
  body: string;
}) {
  return (
    <li className="grid md:grid-cols-[auto_1fr] gap-4 md:gap-12 items-baseline">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent md:w-28 shrink-0">
        {day}
      </span>
      <div>
        <div className="font-serif text-[20px] md:text-[22px] text-text">
          {name}
        </div>
        <p className="text-text-mid text-[15px] mt-2 leading-[1.85] max-w-2xl">
          {body}
        </p>
      </div>
    </li>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="text-accent shrink-0 mt-1.5">·</span>
      <span>{children}</span>
    </li>
  );
}
