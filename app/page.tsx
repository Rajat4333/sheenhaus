"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import RevealOnScroll from "@/components/RevealOnScroll";
import CapabilitiesMarquee from "@/components/CapabilitiesMarquee";
import StatusStrip from "@/components/StatusStrip";
import RecognitionStrip from "@/components/RecognitionStrip";
import SelectedWork from "@/components/SelectedWork";

const CAL_LINK = "https://cal.com/sheenhaus/intro";
const MAIL_LINK = "mailto:hello@sheenhaus.com";

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
  },
  {
    title: "Real estate & developers",
    desc: "You sell premium properties. Your website has popup ads, stock photography, and auto-playing videos. Buyers judge the project by the website first.",
  },
  {
    title: "Hospitality & hotels",
    desc: "Guests pay premium for the experience. Your website should give them a taste before they book — not a CMS template with blurry photos.",
  },
  {
    title: "Healthcare & clinics",
    desc: "Patients compare providers online before choosing. If your site looks like a government portal, they pick the practice that inspires confidence.",
  },
  {
    title: "Manufacturers & B2B",
    desc: "You supply Fortune 500 companies. Your website looks like it was built a decade ago. Global procurement teams judge credibility digitally first.",
  },
  {
    title: "Professional services",
    desc: "Law firms, financial advisors, consultancies charging premium rates — with websites that undermine the expertise you bring to every client meeting.",
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

/* ─── Live clock ─── */
function LiveClock() {
  const [time, setTime] = useState("");
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
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dim">
      {time || "— IST"}
    </span>
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
        data-cursor="hover"
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
        <p className="pb-8 text-base text-text-mid leading-[1.7] max-w-2xl">
          {a}
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Section eyebrow ─── */
function Eyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="section-eyebrow">
      <span className="num">({num})</span>
      <span>—</span>
      <span className="label">{label}</span>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function Home() {
  return (
    <>
      <Navbar />

      {/* Ambient warm orbs */}
      <div className="fixed top-[-300px] right-[-200px] w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.05)_0%,transparent_60%)] pointer-events-none z-0" />
      <div className="fixed bottom-[-400px] left-[-300px] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(45,74,58,0.05)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative z-10 pt-44 md:pt-56 pb-20 shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <Eyebrow num="00" label="A Digital Studio · Est. 2026" />
        </motion.div>

        <motion.h1
          className="font-serif text-[clamp(3.5rem,11vw,11rem)] leading-[1.0] tracking-[-0.04em] mt-10 max-w-[18ch] pb-2"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.0, ease: [0.2, 0.7, 0.2, 1] }}
        >
          We craft the
          <br />
          digital presence of
          <br />
          <em className="italic-accent gradient-text">premium</em> brands.
        </motion.h1>

        <motion.div
          className="flex flex-col sm:flex-row gap-5 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.3, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="cta"
            data-cursor-text="Book"
            className="btn-bronze"
          >
            Book a call <span aria-hidden>→</span>
          </a>
          <a
            href="#work"
            data-cursor="hover"
            className="btn-ghost"
          >
            View the work <span aria-hidden>→</span>
          </a>
        </motion.div>
      </section>

      {/* ═══════════ STATUS STRIP ═══════════ */}
      <section className="relative z-10 shell mt-4">
        <StatusStrip />
      </section>

      {/* ═══════════ CAPABILITIES MARQUEE ═══════════ */}
      <section className="relative z-10 mt-24">
        <CapabilitiesMarquee />
      </section>

      {/* ═══════════ PRINCIPLES ═══════════ */}
      <section className="relative z-10 shell pt-24">
        <div className="flex items-baseline justify-between mb-10 gap-6">
          <Eyebrow num="01" label="Principles" />
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
          <Eyebrow num="02" label="Who This Is For" />
          <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[20ch]">
            You have built something{" "}
            <em className="italic-accent">remarkable.</em> Your website does not
            show it.
          </h2>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-24">
          {VERTICALS.map((v, i) => (
            <div
              key={v.title}
              className="hover-glow border-t border-border py-12 pr-10 last:border-b sm:last:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b sm:[&:nth-last-child(-n+2)]:border-b"
            >
              <span className="font-mono text-[11px] tracking-[0.18em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl mt-4 leading-tight tracking-tight">
                {v.title}
              </h3>
              <p className="text-[15px] text-text-mid leading-[1.7] mt-4 max-w-sm">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* ═══════════ SERVICES ═══════════ */}
      <section id="services" className="relative z-10 shell section-pad">
        <RevealOnScroll>
          <Eyebrow num="03" label="What We Do" />
          <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[22ch]">
            Three disciplines.{" "}
            <em className="italic-accent">One studio.</em> Always senior. Never
            outsourced.
          </h2>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-px bg-border mt-24 rounded-sm overflow-hidden">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="hover-glow bg-bg p-10 md:p-14 hover:bg-bg-surface transition-colors duration-700"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                ({s.num})
              </span>
              <h3 className="font-serif text-3xl md:text-4xl mt-6 tracking-tight leading-tight">
                {s.title}
              </h3>
              <p className="text-[15px] text-text-mid leading-[1.75] mt-6">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ EDITORIAL PHOTO ANCHOR ═══════════ */}
      <section className="relative z-10 mt-12">
        <div className="relative w-full aspect-[21/9] md:aspect-[21/8] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #14110e 0%, #2a1f17 35%, #4a3520 70%, #1a1612 100%)",
              filter: "grayscale(0.4) contrast(1.05)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg" />
          {/* Light film grain inside the panel */}
          <div
            className="absolute inset-0 mix-blend-overlay opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.5'/%3E%3C/svg%3E\")",
            }}
          />
          <div className="absolute inset-0 flex items-end">
            <div className="shell w-full pb-16">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                — From the studio
              </span>
              <p className="font-serif italic-accent text-[clamp(1.5rem,3.5vw,2.5rem)] leading-[1.25] tracking-[-0.02em] mt-4 max-w-3xl text-text">
                Most premium businesses have spent decades building an offline
                brand and three weeks building their online presence. We close
                that gap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STUDIO CONCEPTS ═══════════ */}
      <section id="work" className="relative z-10 shell section-pad">
        <div className="flex items-baseline justify-between gap-8 mb-16">
          <div>
            <Eyebrow num="04" label="Studio Concepts" />
            <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[20ch]">
              A small set of{" "}
              <em className="italic-accent">self-initiated</em> explorations.
            </h2>
          </div>
          <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint text-right">
            2026
            <br />
            <span className="text-text-dim">Index · Four concepts</span>
          </span>
        </div>
        <SelectedWork />
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-dim mt-12 max-w-md leading-[1.8]">
          These are self-initiated studio explorations,
          <br />
          not commissioned engagements. Full briefs available on request.
        </p>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* ═══════════ PROCESS ═══════════ */}
      <section id="process" className="relative z-10 shell section-pad">
        <Eyebrow num="05" label="How We Work" />
        <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[22ch]">
          Four phases.{" "}
          <em className="italic-accent">Three weeks.</em> Zero templates.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border mt-24 rounded-sm overflow-hidden">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="bg-bg p-10 md:p-12 hover:bg-bg-surface transition-colors duration-700"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                {s.time}
              </span>
              <div className="font-serif text-7xl md:text-8xl text-accent/15 leading-none mt-6">
                {s.num}
              </div>
              <h3 className="font-serif text-2xl mt-4 tracking-tight">
                {s.title}
              </h3>
              <p className="text-sm text-text-mid leading-[1.75] mt-4">
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
        <Eyebrow num="06" label="What Nobody Else Offers" />
        <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[22ch]">
          We engineer AI to{" "}
          <em className="italic-accent">recommend</em> your business.
        </h2>

        <div className="grid lg:grid-cols-2 gap-16 mt-24 items-start">
          <div className="bg-bg-surface border border-border rounded-sm p-10 font-mono text-sm">
            <div className="text-text-dim pb-4 mb-4 border-b border-border leading-relaxed">
              <span className="text-accent">{"> user_query"}</span>
              <p className="text-text-mid mt-2 leading-[1.7]">
                What are the best luxury jewellery houses in Dubai for bridal
                collections?
              </p>
            </div>
            <div className="text-text-mid leading-[1.9]">
              <span className="text-accent">{"> model_response"}</span>
              <p className="text-text mt-2 leading-[1.9]">
                Among the most trusted houses,{" "}
                <span className="text-accent">
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
              <div key={p.title} className="flex gap-6 group">
                <span className="font-mono text-[11px] tracking-[0.18em] text-accent pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="font-serif text-2xl text-text mb-2 tracking-tight">
                    {p.title}
                  </h4>
                  <p className="text-[15px] text-text-mid leading-[1.75]">
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
        <Eyebrow num="07" label="The Studio" />
        <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[22ch]">
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
            <div key={p.role} className="bg-bg p-10 md:p-14">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                {p.role}
              </span>
              <h3 className="font-serif text-3xl mt-6 mb-5 leading-[1.15] tracking-tight">
                {p.headline}
              </h3>
              <p className="text-[15px] text-text-mid leading-[1.75]">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ MASSIVE QUOTE ═══════════ */}
      <section className="relative z-10 shell py-40 md:py-56">
        <blockquote className="font-serif text-[clamp(2rem,5vw,4.5rem)] leading-[1.12] tracking-[-0.025em] text-text max-w-[20ch] mx-auto text-center">
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
        <Eyebrow num="08" label="Common Questions" />
        <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] mt-8 max-w-[22ch]">
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
      <section id="contact" className="relative z-10 shell section-pad text-center">
        <Eyebrow num="09" label="Begin a Conversation" />
        <h2 className="font-serif text-[clamp(2.8rem,7vw,6rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[18ch] mx-auto">
          Your brand deserves{" "}
          <em className="italic-accent gradient-text">better</em> than a
          template.
        </h2>
        <p className="text-text-mid text-[17px] max-w-xl mx-auto mt-8 leading-[1.7]">
          Book a twenty-minute introduction. We will study your current site,
          show you what is possible, and give you an honest assessment —
          wherever you are in the world.
        </p>
        <div className="flex flex-col items-center gap-6 mt-14">
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="cta"
            data-cursor-text="Book"
            className="btn-bronze"
          >
            Book a call <span aria-hidden>→</span>
          </a>
          <a
            href={MAIL_LINK}
            data-cursor="hover"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim hover:text-accent transition-colors duration-500"
          >
            Or write to us → hello@sheenhaus.com
          </a>
        </div>
      </section>

      {/* ═══════════ STUDIO INDEX FOOTER ═══════════ */}
      <footer className="relative z-10 mt-20 border-t border-border">
        <div className="shell py-16">
          {/* Massive wordmark */}
          <div className="font-serif text-[clamp(4rem,18vw,18rem)] leading-[1.0] tracking-[-0.05em] text-text pb-4">
            Sheen<em className="italic-accent gradient-text">haus</em>
          </div>

          <div className="grid md:grid-cols-4 gap-12 mt-20 pt-12 border-t border-border">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
                The Studio
              </span>
              <p className="text-text-mid text-sm leading-[1.7] mt-4">
                A boutique digital studio crafting the presence of premium
                brands. Mumbai · Dubai · New York · London.
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
                Reach
              </span>
              <div className="flex flex-col gap-3 mt-4">
                <a
                  href={MAIL_LINK}
                  data-cursor="hover"
                  className="text-text text-sm hover:text-accent transition-colors duration-500"
                >
                  hello@sheenhaus.com
                </a>
                <a
                  href={CAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="text-text-mid text-sm hover:text-accent transition-colors duration-500"
                >
                  Book a call →
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
                  { label: "FAQ", href: "#faq" },
                  { label: "Contact", href: "#contact" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    data-cursor="hover"
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
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
              Sheenhaus Studio · India · © 2026
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
              Crafted by the studio. Every pixel.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
