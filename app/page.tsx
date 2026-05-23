"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RevealOnScroll from "@/components/RevealOnScroll";
import CapabilitiesMarquee from "@/components/CapabilitiesMarquee";
import StatusStrip from "@/components/StatusStrip";
import RecognitionStrip from "@/components/RecognitionStrip";
import SelectedWork from "@/components/SelectedWork";
import ScrollSentence from "@/components/ScrollSentence";
import HeroScroll, { HeroMoment } from "@/components/HeroScroll";
import VerdictReveal from "@/components/VerdictReveal";
import HoverImage from "@/components/HoverImage";

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";
const MAIL_LINK = "mailto:hello@sheenhaus.com";
const INSTAGRAM_LINK = "https://www.instagram.com/sheenhaus_/";

/* ─── SERVICES ─── */
const SERVICES = [
  {
    num: "I",
    title: "Brand-led redesign",
    desc: "We rebuild your website from first principles — handcoded, art-directed, designed to feel as considered as your physical brand. No templates. No page builders. No shortcuts.",
  },
  {
    num: "II",
    title: "AI discoverability",
    desc: "We engineer your presence so ChatGPT, Claude, and Google AI recommend you. When prospects ask AI for the best in your category, you surface first. Almost no studio does this yet.",
  },
  {
    num: "III",
    title: "Ongoing stewardship",
    desc: "Your site is not a one-time project. We continuously refine it — seasonal campaigns, performance monitoring, content systems, and monthly AI visibility reports.",
  },
];

/* ─── VERTICALS ─── */
const VERTICALS = [
  {
    title: "Jewellery & luxury retail",
    desc: "Your showroom costs crores. Your website was built by your POS vendor. Clients choose competitors whose site feels more considered than yours.",
    thesis: "slowness",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&q=85&auto=format&fit=crop",
  },
  {
    title: "Real estate & developers",
    desc: "You sell premium properties. Your website has popup ads, stock photography, and auto-playing videos. Buyers judge the project by the website first.",
    thesis: "considered-detail",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85&auto=format&fit=crop",
  },
  {
    title: "Hospitality & hotels",
    desc: "Guests pay premium for the experience. Your website should give them a taste before they book — not a CMS template with blurry photos.",
    thesis: "slowness",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=85&auto=format&fit=crop",
  },
  {
    title: "Private healthcare",
    desc: "Patients compare providers online before choosing. If your site looks like a government portal, they pick the practice that inspires confidence.",
    thesis: "trust-through-restraint",
    image:
      "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=900&q=85&auto=format&fit=crop",
  },
];

/* ─── PROCESS ─── */
const STEPS = [
  {
    num: "01",
    title: "Audit",
    desc: "We study your current site, your competitors, and your clients. You get an honest report — what is broken, what is missing, what is possible.",
    time: "Week 1",
  },
  {
    num: "02",
    title: "Design",
    desc: "You see the actual design within seven days. Not a wireframe — the real artefact. Your brand looking considered before a single line of code is written.",
    time: "Week 2",
  },
  {
    num: "03",
    title: "Build",
    desc: "Handcoded, fast, mobile-first. Every page loads in under two seconds. Every interaction is intentional. No WordPress. No templates.",
    time: "Week 3",
  },
  {
    num: "04",
    title: "Launch",
    desc: "We handle deployment, SEO, schema markup, and AI discoverability. Then we stay — because premium does not stop at launch.",
    time: "Week 4",
  },
];

/* ─── FAQ ─── */
const FAQS = [
  {
    q: "How much does an engagement cost?",
    a: "Every project is scoped to your needs. A typical engagement ranges from $8,000 to $40,000 depending on scope, e-commerce, ongoing stewardship, and AI work. You will have a clear number after a twenty-minute call — no surprises.",
  },
  {
    q: "How long does it take?",
    a: "Three to four weeks from kickoff to launch. You see the complete design within seven days — not a wireframe, the actual artefact. We move quickly because we build in-house. No outsourcing, no junior handoffs.",
  },
  {
    q: "How does timezone work for international clients?",
    a: "We hold overlap hours for calls and the rest works in your favour — you send feedback at end of day, we implement overnight, you wake up to progress. Most clients say the timezone actually makes things faster.",
  },
  {
    q: "What exactly is AI discoverability?",
    a: "When clients ask ChatGPT or Google AI for the best in your category, does your name surface? We structure your content and add technical markup so AI models recognise and recommend your business. It is SEO for the AI era — a discipline most studios have not yet learned.",
  },
  {
    q: "How do payments work internationally?",
    a: "We accept wire transfer, Wise, and PayPal. Standard terms: fifty percent on kickoff, fifty percent on delivery. Monthly retainers billed on your preferred method. Mutual NDA on request.",
  },
  {
    q: "Why a boutique studio rather than a large agency?",
    a: "You work directly with the people who build your site — not a salesperson who hands you to a junior team. Large agencies charge $30K to $100K and pass your project through five departments. We deliver the same quality faster, at a fraction of the cost.",
  },
];

/* ─── Live clock + Studio status ─── */
function LiveClock() {
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<"open" | "after-hours">("after-hours");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const ist = d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
        hour12: false,
      });
      setTime(`${ist} IST`);

      // Studio hours: 10:00–19:00 IST, Mon–Sat
      const istHour = Number(
        d.toLocaleString("en-GB", {
          hour: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      );
      const istDay = new Date(
        d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      ).getDay(); // 0 = Sun
      const isWeekday = istDay >= 1 && istDay <= 6;
      const isWorking = isWeekday && istHour >= 10 && istHour < 19;
      setStatus(isWorking ? "open" : "after-hours");
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dim whitespace-nowrap">
        {time || "— IST"}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status === "open" ? "bg-accent animate-pulse-slow" : "bg-text-faint"
          }`}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint whitespace-nowrap">
          {status === "open" ? "Studio · Open" : "Studio · After Hours"}
        </span>
      </div>
    </div>
  );
}

/* ─── FAQ item ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        className="w-full flex justify-between items-baseline gap-8 py-7 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="font-serif text-xl md:text-2xl text-text group-hover:text-accent transition-colors duration-500 leading-tight">
          {q}
        </span>
        <motion.span
          className="font-mono text-base text-text-dim flex-shrink-0"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        >
          +
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-8 text-base text-text-mid leading-[1.8] max-w-2xl">
          {a}
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Section tag (quiet, no numbering) ─── */
function Tag({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-3">
      <span className="w-6 h-px bg-accent" />
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mid">
        {label}
      </span>
    </div>
  );
}

/* ─── Vertical card — one of the four "Who This Is For" tiles ───
   Each card owns its own ref so HoverImage can subscribe to its
   pointer events and reveal a cursor-anchored image plate on
   first hover. */
function VerticalCard({
  v,
  i,
  isLeftCol,
}: {
  v: (typeof VERTICALS)[number];
  i: number;
  isLeftCol: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  return (
    <>
      <Link
        ref={cardRef}
        href={`/concepts#${v.thesis}`}
        className={`vertical-card group relative block border-b border-border pt-14 pb-20 px-2 ${
          isLeftCol
            ? "md:pr-10 md:border-r md:border-border"
            : "md:pl-10"
        }`}
      >
        {/* Header row — title left, faint numeral right */}
        <div className="flex items-start justify-between gap-6">
          <h3 className="font-serif text-2xl md:text-3xl leading-tight tracking-tight max-w-[14ch] transition-colors duration-700 group-hover:text-accent">
            {v.title}
          </h3>
          <span className="vertical-card-num font-mono text-[10px] tracking-[0.22em] text-text-faint pt-2 flex-shrink-0 transition-all duration-700 group-hover:text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>
        <p className="text-[15px] text-text-mid leading-[1.8] mt-6 max-w-md transition-colors duration-700 group-hover:text-text">
          {v.desc}
        </p>

        {/* Hover sweep line — bronze rule along the top edge */}
        <span
          aria-hidden="true"
          className="vertical-card-sweep pointer-events-none absolute top-0 left-0 right-0 h-px origin-left scale-x-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-x-100"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #8a6a35 35%, #c9a96e 50%, #8a6a35 65%, transparent 100%)",
          }}
        />

        {/* Hover read-more cue, bottom-left */}
        <span
          aria-hidden="true"
          className="absolute left-2 md:left-0 bottom-5 inline-flex items-center gap-3 opacity-0 -translate-x-2 transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:opacity-100 group-hover:translate-x-0"
        >
          <span className="w-5 h-px bg-accent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Read the thesis →
          </span>
        </span>
      </Link>

      {/* Cursor-anchored image plate — fades in on first hover,
          follows the cursor with smoothed spring easing, fades
          out on leave. Desktop only. */}
      <HoverImage src={v.image} alt="" parentRef={cardRef} />
    </>
  );
}

/* ─── MAIN PAGE ─── */
export default function Home() {
  return (
    <>
      <Navbar />

      {/* Ambient warm orbs */}
      <div className="fixed top-[-300px] right-[-200px] w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(138,106,53,0.08)_0%,transparent_60%)] pointer-events-none z-0" />
      <div className="fixed bottom-[-400px] left-[-300px] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(45,74,58,0.06)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* HERO — three scroll-directed editorial moments inside one
          sticky viewport. Visitor scrolls through ~3 viewports of
          held silence; moments cross-fade in sequence with a subtle
          y-parallax. No canvas, no frames, no Three.js. */}
      <HeroScroll>
        {(scrollYProgress) => (
          <>
            {/* Moment 1 — opener (0–35%). Single coordinated reveal:
                eyebrow → headline → hairline draws across → scroll cue.
                Lands within ~1.2s of first paint so the page never
                reads as blank cream. */}
            <HeroMoment
              scrollYProgress={scrollYProgress}
              start={0.0}
              end={0.32}
              align="left"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.15,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
              >
                <div className="inline-flex items-center gap-3">
                  <span className="w-6 h-px bg-accent" />
                  <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-text-mid whitespace-nowrap">
                    A Digital Studio · Est. 2026
                  </span>
                </div>
              </motion.div>

              <motion.h1
                className="display-serif font-serif text-text text-[clamp(3rem,9vw,8rem)] leading-[1.02] tracking-[-0.035em] mt-8 max-w-[18ch] pb-2"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.3,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
              >
                We craft the digital presence of{" "}
                <em className="italic-accent shine">premium</em> brands.
              </motion.h1>

              {/* Bronze hairline rule — draws itself across the page
                  below the headline. Quiet but unmistakably *premium*:
                  the kind of detail Aesop and Aman use to signal that
                  the page is active without adding visual noise. */}
              <motion.div
                aria-hidden="true"
                className="mt-12 h-px origin-left"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(138,106,53,0.5) 20%, #8a6a35 50%, rgba(138,106,53,0.5) 80%, transparent 100%)",
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  scaleX: { duration: 1.6, delay: 0.9, ease: [0.2, 0.7, 0.2, 1] },
                  opacity: { duration: 0.6, delay: 0.9 },
                }}
              />

              {/* Two-column meta row: live scroll cue on the left,
                  the studio's quiet status on the right. Gives the
                  first paint *content* in the lower half of the
                  viewport so it never reads as empty. */}
              <motion.div
                className="flex items-center justify-between mt-8 gap-8 max-w-[42rem]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 1.2,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-faint inline-flex items-center gap-3">
                  <motion.span
                    aria-hidden="true"
                    className="block w-px h-6 bg-accent"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  Scroll to begin
                </span>
                <span className="hidden sm:inline-flex font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
                  Accepting briefs · 2026
                </span>
              </motion.div>
            </HeroMoment>

            {/* Moment 2 — positioning, italic, centered (38–62%) */}
            <HeroMoment
              scrollYProgress={scrollYProgress}
              start={0.38}
              end={0.62}
              align="center"
            >
              <p className="font-serif italic-accent text-text text-[clamp(2rem,5vw,4rem)] leading-[1.15] tracking-[-0.025em] max-w-[20ch] mx-auto">
                For brands whose offline work
                <br />
                already speaks for itself.
              </p>
            </HeroMoment>

            {/* Moment 3 — invitation + CTAs (68–98%) */}
            <HeroMoment
              scrollYProgress={scrollYProgress}
              start={0.68}
              end={0.98}
              align="left"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mid">
                Accepting briefs · 2026
              </span>
              <h2 className="display-serif font-serif text-text text-[clamp(2.5rem,7vw,6rem)] leading-[1.04] tracking-[-0.03em] mt-6 max-w-[18ch]">
                Begin with a{" "}
                <em className="italic-accent">conversation.</em>
              </h2>
              <div className="flex flex-col sm:flex-row flex-wrap gap-5 mt-10">
                <Link href="/audit" className="btn-bronze">
                  Audit your site <span aria-hidden>→</span>
                </Link>
                <a
                  href={CAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  Book a call <span aria-hidden>→</span>
                </a>
                <a href="#work" className="btn-ghost">
                  View the work <span aria-hidden>↓</span>
                </a>
              </div>
            </HeroMoment>
          </>
        )}
      </HeroScroll>

      {/* STATUS STRIP */}
      <section className="relative z-10 shell mt-16">
        <StatusStrip />
      </section>

      {/* CAPABILITIES MARQUEE */}
      <section className="relative z-10 mt-28">
        <CapabilitiesMarquee />
      </section>

      {/* ═══════════ HELD BEAT ═══════════
          Scroll-directed sentence: one held moment between the
          marquee's motion and the Principles section. The whole
          sentence resolves as the visitor scrolls through ~180vh —
          the cinematic move here is restraint, not spectacle. */}
      <ScrollSentence
        eyebrow="A note from the studio"
        words={[
          { text: "Most" },
          { text: "of" },
          { text: "what" },
          { text: "passes" },
          { text: "for" },
          { text: "premium" },
          { text: "online" },
          { text: "is" },
          { text: "just" },
          { text: "expensive" },
          { text: "in" },
          { text: "a" },
          { text: "hurry." },
          { text: "We" },
          { text: "build" },
          { text: "sites" },
          { text: "that" },
          { text: "earn" },
          { text: "the" },
          { text: "silence", italic: true },
          { text: "around", italic: true },
          { text: "them.", italic: true },
        ]}
      />

      {/* ═══════════ PRINCIPLES ═══════════ */}
      <section className="relative z-10 shell pt-24">
        <div className="flex items-baseline justify-between mb-10 gap-6">
          <Tag label="Principles" />
          <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
            How we work, before any brief
          </span>
        </div>
        <RecognitionStrip />
      </section>

      <div className="shell mt-16">
        <div className="hairline" />
      </div>

      {/* ═══════════ WHO IS THIS FOR ═══════════ */}
      <section className="relative z-10 shell section-pad">
        <RevealOnScroll>
          <Tag label="Who This Is For" />
        </RevealOnScroll>
        <VerdictReveal
          className="display-serif font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[20ch] block"
          words={[
            { text: "You" },
            { text: "have" },
            { text: "built" },
            { text: "something" },
            { text: "remarkable.", italic: true },
            { text: "Your" },
            { text: "website" },
            { text: "does" },
            { text: "not" },
            { text: "show" },
            { text: "it." },
          ]}
        />

        <div className="grid md:grid-cols-2 mt-24 border-t border-border">
          {VERTICALS.map((v, i) => (
            <VerticalCard
              key={v.title}
              v={v}
              i={i}
              isLeftCol={i % 2 === 0}
            />
          ))}
        </div>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* DIAGNOSTIC CTA — bridges 'Who This Is For' to 'Services' with
          a soft-sell into the long-form /signs essay. Editorial moment,
          not a banner. */}
      <section className="relative z-10 shell section-pad">
        <RevealOnScroll>
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-end">
            <div>
              <Tag label="A Diagnostic" />
              <h2 className="display-serif font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[22ch]">
                Twelve <em className="italic-accent">signs</em> your website is
                costing you clients.
              </h2>
              <p className="text-text-mid text-[17px] max-w-2xl mt-10 leading-[1.8]">
                A quiet read for any premium business whose offline brand
                already outruns its digital presence. Tick the patterns that
                apply to your own site &mdash; popup discounts, stock
                photography, ERP-vendor headers, AI invisibility &mdash; and
                you have a brief.
              </p>
            </div>
            <Link
              href="/signs"
              className="btn-bronze self-start lg:self-end whitespace-nowrap"
            >
              Read the diagnostic <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </RevealOnScroll>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* SERVICES */}
      <section id="services" className="relative z-10 shell section-pad">
        <RevealOnScroll>
          <Tag label="What We Do" />
          <h2 className="display-serif font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[22ch]">
            Three disciplines.{" "}
            <em className="italic-accent">One studio.</em> Always senior. Never
            outsourced.
          </h2>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-px bg-border mt-24 rounded-sm overflow-hidden">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="lift-card group bg-bg p-10 md:p-14 hover:bg-bg-surface transition-colors duration-700"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-accent transition-all duration-700 group-hover:tracking-[0.28em]">
                ({s.num})
              </span>
              <h3 className="font-serif text-3xl md:text-4xl mt-6 tracking-tight leading-tight transition-colors duration-700 group-hover:text-accent">
                {s.title}
              </h3>
              <p className="text-[15px] text-text-mid leading-[1.8] mt-6 transition-colors duration-700 group-hover:text-text">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* THESES */}
      <section id="work" className="relative z-10 shell section-pad">
        <div className="flex items-baseline justify-between gap-8 mb-16">
          <div>
            <Tag label="Theses (04)" />
            <h2 className="display-serif font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[22ch]">
              Four <em className="italic-accent">positions</em> we hold,
              before any brief.
            </h2>
          </div>
          <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint text-right whitespace-nowrap">
            2026
            <br />
            <span className="text-text-dim">Index (04)</span>
          </span>
        </div>
        <SelectedWork />
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-dim mt-12 max-w-md leading-[1.8]">
          These are commitments we make to every client
          <br />
          before the engagement begins. Read each in full →
        </p>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* ═══════════ PROCESS ═══════════ */}
      <section id="process" className="relative z-10 shell section-pad">
        <Tag label="How We Work" />
        <h2 className="display-serif font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[22ch]">
          Four phases.{" "}
          <em className="italic-accent">Three weeks.</em> Zero templates.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border mt-24 rounded-sm overflow-hidden">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="lift-card group bg-bg p-10 md:p-12 hover:bg-bg-surface transition-colors duration-700"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-accent transition-all duration-700 group-hover:tracking-[0.28em]">
                {s.time}
              </span>
              <div className="font-serif text-7xl md:text-8xl text-accent/15 leading-none mt-6 transition-colors duration-700 group-hover:text-accent/40">
                {s.num}
              </div>
              <h3 className="font-serif text-2xl mt-4 tracking-tight transition-colors duration-700 group-hover:text-accent">
                {s.title}
              </h3>
              <p className="text-sm text-text-mid leading-[1.8] mt-4 transition-colors duration-700 group-hover:text-text">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* ═══════════ AI SECTION ═══════════ */}
      <section className="relative z-10 shell section-pad">
        <Tag label="What Nobody Else Offers" />
        <h2 className="display-serif font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[22ch]">
          We engineer AI to{" "}
          <em className="italic-accent">recommend</em> your business.
        </h2>

        <div className="grid lg:grid-cols-2 gap-16 mt-24 items-start">
          <div className="bg-bg-surface border border-border rounded-sm p-10 font-mono text-sm">
            <div className="text-text-dim pb-4 mb-4 border-b border-border leading-relaxed">
              <span className="text-accent">{"> user_query"}</span>
              <p className="text-text-mid mt-2 leading-[1.8]">
                What are the best luxury jewellery houses in Dubai for bridal
                collections?
              </p>
            </div>
            <div className="text-text-mid leading-[1.9]">
              <span className="text-accent">{"> model_response"}</span>
              <p className="text-text mt-2 leading-[1.9]">
                Among the most trusted houses,{" "}
                <span className="text-accent whitespace-nowrap">
                  Al Fardan Jewellers
                </span>{" "}
                stands out — known for handcrafted bridal collections and a
                four-decade legacy. They specialise in bespoke diamond and
                gold sets...
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {[
              {
                title: "AI-optimised content structure",
                desc: "We write and structure your content so AI models understand and recommend your business for the queries that matter to you.",
              },
              {
                title: "Schema markup & structured data",
                desc: "Technical SEO that tells Google, ChatGPT, and Claude exactly what your business does, where you operate, and why you matter.",
              },
              {
                title: "Monthly AI visibility reports",
                desc: "We track which AI queries mention your brand versus competitors. You watch the score improve month over month.",
              },
            ].map((p, i) => (
              <div key={p.title} className="lift-row flex gap-6 group">
                <span className="lift-row-num font-mono text-[11px] tracking-[0.18em] text-accent pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="font-serif text-2xl text-text mb-2 tracking-tight transition-colors duration-700 group-hover:text-accent">
                    {p.title}
                  </h4>
                  <p className="text-[15px] text-text-mid leading-[1.8] transition-colors duration-700 group-hover:text-text">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* ═══════════ STUDIO / ABOUT ═══════════ */}
      <section id="studio" className="relative z-10 shell section-pad">
        <Tag label="The Studio" />
        <h2 className="display-serif font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[22ch]">
          A boutique studio. <em className="italic-accent">Senior</em> talent
          only.
        </h2>
        <p className="text-text-mid max-w-xl leading-[1.8] mt-6 text-[15px]">
          No juniors. No outsourcing. No handoffs. The people you speak with
          are the people who build your site. Based in India, serving clients
          worldwide.
        </p>

        <div className="grid md:grid-cols-2 gap-px bg-border mt-20 rounded-sm overflow-hidden">
          {[
            {
              role: "Engineering & design",
              headline: "Handcoded, never templated",
              desc: "Every site is built from scratch by senior engineers with deep experience in cloud infrastructure, performance, and design systems. No WordPress, no page builders — only clean code optimised for speed and craft.",
            },
            {
              role: "Strategy & client success",
              headline: "Built around your business",
              desc: "We translate business objectives into digital experiences that convert. Direct collaboration from first call to launch — no account managers, no handoffs, no junior staff learning on your engagement.",
            },
          ].map((p) => (
            <div key={p.role} className="lift-card group bg-bg p-10 md:p-14 hover:bg-bg-surface transition-colors duration-700">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-all duration-700 group-hover:tracking-[0.28em]">
                {p.role}
              </span>
              <h3 className="font-serif text-3xl mt-6 mb-5 leading-[1.15] tracking-tight transition-colors duration-700 group-hover:text-accent">
                {p.headline}
              </h3>
              <p className="text-[15px] text-text-mid leading-[1.8] transition-colors duration-700 group-hover:text-text">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ MASSIVE QUOTE ═══════════ */}
      <section className="relative z-10 shell py-40 md:py-56">
        <blockquote className="display-serif font-serif text-[clamp(2rem,5vw,4.5rem)] leading-[1.12] tracking-[-0.025em] text-text max-w-[20ch] mx-auto text-center">
          Your website was built by whoever handles your billing software. That
          is like asking your accountant to{" "}
          <em className="italic-accent gradient-text">design your showroom.</em>
        </blockquote>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-faint text-center mt-12">
          — From the studio
        </p>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* ═══════════ FAQ ═══════════ */}
      <section id="faq" className="relative z-10 shell section-pad">
        <Tag label="Common Questions" />
        <h2 className="display-serif font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[22ch]">
          Things you&apos;re{" "}
          <em className="italic-accent">probably</em> wondering.
        </h2>

        <div className="mt-20 max-w-3xl">
          {FAQS.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section id="contact" className="relative z-10 shell pt-32 md:pt-40 pb-24 md:pb-32 text-center">
        <Tag label="Begin a Conversation" />
        <h2 className="display-serif font-serif text-[clamp(2.8rem,7vw,6rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[18ch] mx-auto">
          Your brand deserves{" "}
          <em className="italic-accent gradient-text">better</em> than a
          template.
        </h2>
        <p className="text-text-mid text-[17px] max-w-xl mx-auto mt-8 leading-[1.8]">
          Book a twenty-minute introduction. We will study your current site,
          show you what is possible, and give you an honest assessment —
          wherever you are in the world.
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
          <a
            href={MAIL_LINK}
            data-link-style="bronze"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim"
          >
            Or write to us → hello@sheenhaus.com
          </a>
        </div>
      </section>

      {/* ═══════════ STUDIO INDEX FOOTER ═══════════ */}
      <footer className="relative z-10 border-t border-border">
        <div className="shell py-16">
          {/* Massive wordmark */}
          <div className="font-serif text-[clamp(4rem,18vw,18rem)] leading-[1.0] tracking-[-0.05em] text-text pb-4 text-center">
            Sheen<em className="italic-accent gradient-text">haus</em>
          </div>

          <div className="grid md:grid-cols-4 gap-12 mt-20 pt-12 border-t border-border">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
                The Studio
              </span>
              <p className="text-text-mid text-sm leading-[1.8] mt-4">
                A boutique digital studio crafting the presence of premium
                brands.
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dim mt-4 whitespace-nowrap">
                Mumbai · Dubai · New York · London
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
                Reach
              </span>
              <div className="flex flex-col gap-3 mt-4">
                <a
                  href={MAIL_LINK}
                  data-link-style="bronze"
                  className="text-text text-sm"
                >
                  hello@sheenhaus.com
                </a>
                <a
                  href={CAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-mid text-sm hover:text-accent transition-colors duration-500"
                >
                  Book a call →
                </a>
                <a
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-mid text-sm hover:text-accent transition-colors duration-500"
                >
                  Instagram →
                </a>
              </div>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
                Index
              </span>
              <div className="flex flex-col gap-3 mt-4">
                {[
                  { label: "Work", href: "#work" },
                  { label: "Studio", href: "#studio" },
                  { label: "Audit", href: "/audit" },
                  { label: "Diagnostic", href: "/signs" },
                  { label: "FAQ", href: "#faq" },
                  { label: "Contact", href: "#contact" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="text-text-mid text-sm hover:text-accent transition-colors duration-500"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
                Status
              </span>
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-mid">
                    Accepting briefs
                  </span>
                </div>
                <LiveClock />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-14 pt-8 border-t border-border">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint whitespace-nowrap">
              Sheenhaus Studio · India · © 2026
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint whitespace-nowrap">
              Crafted by the studio. Every pixel.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
