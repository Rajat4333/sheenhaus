"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import RevealOnScroll from "@/components/RevealOnScroll";
import CursorGlow from "@/components/CursorGlow";

const CAL_LINK = "https://cal.com/sheenhaus/intro";
const WA_LINK = "https://wa.me/91XXXXXXXXXX?text=Hi%20Sheenhaus%2C%20I%27d%20like%20to%20discuss%20a%20project";

/* ─── SERVICES ─── */
const SERVICES = [
  {
    icon: "✦",
    title: "Premium Redesign",
    desc: "We rebuild your website from the ground up. Hand-coded, mobile-first, designed to feel as premium as your physical brand. No templates. No shortcuts.",
  },
  {
    icon: "◎",
    title: "AI Discoverability",
    desc: "We make ChatGPT, Claude, and Google AI recommend your business. When someone asks AI for the best in your category — you show up. Nobody else offers this.",
  },
  {
    icon: "↻",
    title: "Ongoing Growth",
    desc: "Your site isn't a one-time project. We continuously improve it — seasonal campaigns, performance monitoring, content updates, and monthly AI visibility reports.",
  },
];

/* ─── WHO IS THIS FOR ─── */
const VERTICALS = [
  { icon: "💎", title: "Jewellery & Luxury Retail", desc: "Your showroom costs millions. Your website was built by your POS vendor. Customers choose competitors because their site feels more premium." },
  { icon: "🏗️", title: "Real Estate & Developers", desc: "You sell premium properties. Your website has popup ads, stock photos, and auto-playing videos. Buyers judge the property by the website first." },
  { icon: "🏥", title: "Healthcare & Clinics", desc: "Patients compare providers online before choosing. If your site looks like a government portal, they'll pick the practice that inspires confidence." },
  { icon: "🏨", title: "Hotels & Hospitality", desc: "Guests pay premium for the experience. Your website should give them a taste before they book — not a template with blurry photos." },
  { icon: "🏭", title: "Manufacturers & B2B", desc: "You supply to Fortune 500 companies. Your website looks like it was built a decade ago. Global buyers judge your credibility digitally." },
  { icon: "⚖️", title: "Professional Services", desc: "Law firms, financial advisors, consultancies charging premium rates — with websites that undermine the expertise you bring. First impressions happen online now." },
];

/* ─── PROCESS ─── */
const STEPS = [
  { num: "01", title: "Audit", desc: "We study your current site, your competitors, and your customers. You get an honest report — what's broken, what's missing, what's possible.", time: "Days 1–3" },
  { num: "02", title: "Design", desc: "You see the actual design within 7 days. Not a wireframe — the real thing. Your brand looking premium before a single line of code is written.", time: "Days 4–10" },
  { num: "03", title: "Build", desc: "Hand-coded, fast, mobile-first. Every page loads in under 2 seconds. Every interaction feels intentional. No WordPress. No templates.", time: "Days 11–18" },
  { num: "04", title: "Launch", desc: "We handle deployment, SEO setup, schema markup, and AI discoverability optimization. Then we stick around — because premium doesn't stop at launch.", time: "Days 19–21" },
];

/* ─── FAQ ─── */
const FAQS = [
  { q: "How much does a project cost?", a: "Every project is scoped based on your needs. A typical premium redesign ranges from $3,000–$20,000 depending on complexity, e-commerce, AI discoverability, or ongoing support. We'll give you a clear number after a 15-minute call — no surprises." },
  { q: "How long does it take?", a: "3-4 weeks from kickoff to launch. You'll see the complete design within 7 days — not a wireframe, the actual thing. We move fast because we build in-house. No outsourcing, no handoff delays." },
  { q: "I'm based in the US/UAE/Europe. How does timezone work?", a: "We maintain overlap hours for calls, and the rest works in your favour — you send feedback at end of day, we implement overnight, you wake up to updates. Most clients say the timezone actually makes things faster." },
  { q: "What is AI discoverability?", a: "When customers ask ChatGPT or Google AI for the best in your category — does your name come up? We structure your content and add technical markup so AI models recognize and recommend your business. It's SEO for the AI era." },
  { q: "How do payments work internationally?", a: "We accept wire transfer, Wise (TransferWise), and PayPal. Standard terms: 50% upfront to start, 50% on delivery. Monthly retainers billed on your preferred method. Clean and transparent." },
  { q: "Why a boutique studio over a big agency?", a: "You work directly with the people who build your site — not a salesperson who hands you off to a junior. Big agencies charge $30K-$100K+ and pass your project through 5 departments. We deliver the same quality, faster and for a fraction of the cost." },
];

/* ─── FAQ ITEM ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        className="w-full flex justify-between items-center py-6 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[15px] sm:text-base font-medium text-text group-hover:text-accent transition-colors pr-4">
          {q}
        </span>
        <motion.span
          className="text-xl text-text-dim flex-shrink-0"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          +
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-sm text-text-dim leading-relaxed max-w-2xl">
          {a}
        </p>
      </motion.div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function Home() {
  return (
    <>
      <CursorGlow />
      <Navbar />

      {/* Ambient glow orbs */}
      <div className="fixed top-[-300px] right-[-200px] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.05)_0%,transparent_60%)] pointer-events-none z-0" />
      <div className="fixed bottom-[-400px] left-[-300px] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.03)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative z-10 pt-40 pb-28 md:pt-52 md:pb-36 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-accent bg-accent-dim border border-accent-mid px-5 py-2 rounded-full mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
          Working with brands across US, UAE, Europe &amp; India
        </motion.div>

        <motion.h1
          className="font-serif text-[clamp(3rem,7vw,5.5rem)] leading-[1.06] tracking-[-0.035em] max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          We make premium brands look{" "}
          <em className="italic gradient-text">premium</em> online
        </motion.h1>

        <motion.p
          className="text-text-mid text-lg md:text-xl max-w-xl mt-7 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Your product is world-class. Your showroom is stunning. Your website
          was built by your IT vendor as an afterthought. We fix that — in 3
          weeks, wherever you are.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-accent text-bg px-8 py-4 rounded-xl text-[15px] font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(52,211,153,0.2)] transition-all duration-300"
          >
            Book a Free Call →
          </a>
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-2.5 border border-border-light text-text px-8 py-4 rounded-xl text-[15px] font-medium hover:border-accent hover:text-accent transition-all duration-300"
          >
            See Our Work
          </a>
        </motion.div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 mb-28">
        <RevealOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-border rounded-2xl overflow-hidden">
            {[
              { num: "3 weeks", label: "Average delivery time" },
              { num: "4 countries", label: "US, UAE, Europe & India" },
              { num: "0", label: "Templates used. Ever." },
              { num: "AI-first", label: "SEO + AI discoverability built in" },
            ].map((stat) => (
              <div key={stat.label} className="bg-bg-surface p-8 md:p-10 text-center">
                <div className="font-serif text-3xl md:text-4xl text-accent leading-tight">
                  {stat.num}
                </div>
                <div className="text-xs text-text-dim mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>

      {/* ═══════════ WHO IS THIS FOR ═══════════ */}
      <section className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <RevealOnScroll>
          <p className="section-line font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-4">
            Who This Is For
          </p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] leading-[1.15] tracking-tight max-w-2xl">
            You&apos;ve built something great.
            <br />
            Your website doesn&apos;t show it.
          </h2>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
          {VERTICALS.map((v, i) => (
            <RevealOnScroll key={v.title} delay={i * 0.08}>
              <div className="hover-glow bg-bg-surface border border-border rounded-2xl p-7 hover:border-accent-mid hover:-translate-y-1 transition-all duration-400 h-full">
                <span className="text-3xl mb-4 block">{v.icon}</span>
                <h3 className="font-serif text-xl mb-2">{v.title}</h3>
                <p className="text-sm text-text-dim leading-relaxed">{v.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ═══════════ SERVICES ═══════════ */}
      <section id="services" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <RevealOnScroll>
          <p className="section-line font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-4">
            What We Do
          </p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] leading-[1.15] tracking-tight max-w-2xl mb-4">
            Your digital presence should match your ambition
          </h2>
          <p className="text-text-mid max-w-xl leading-relaxed">
            We work with established businesses whose offline excellence isn&apos;t
            reflected online. Across the US, UAE, Europe, and India — the gap is everywhere.
          </p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-4 mt-14">
          {SERVICES.map((s, i) => (
            <RevealOnScroll key={s.title} delay={i * 0.1}>
              <div className="hover-glow bg-bg-surface border border-border rounded-2xl p-8 hover:border-border-light hover:-translate-y-1 transition-all duration-400 h-full">
                <div className="w-12 h-12 rounded-[12px] bg-accent-dim border border-accent-mid flex items-center justify-center text-xl mb-5">
                  {s.icon}
                </div>
                <h3 className="font-serif text-[22px] tracking-tight mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-text-dim leading-relaxed">{s.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ═══════════ PORTFOLIO / BEFORE-AFTER ═══════════ */}
      <section id="work" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <RevealOnScroll>
          <p className="section-line font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-4">
            Our Work
          </p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] leading-[1.15] tracking-tight max-w-2xl mb-4">
            The gap between how you look offline and online
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <div className="mt-14 bg-bg-surface-2 border border-border rounded-2xl overflow-hidden p-6 md:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
              <h3 className="font-serif text-2xl">Heritage Jewellers</h3>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent bg-accent-dim px-4 py-1.5 rounded-md">
                Luxury Retail · Dubai
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Before */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-red-500/8 text-red-400 font-mono text-[10px] uppercase tracking-[0.15em] text-center py-3 border-b border-border">
                  Before
                </div>
                <div className="bg-[#1a1a1a] h-64 md:h-80 flex items-center justify-center p-6">
                  <div className="w-full max-w-[280px] bg-[#f5f5f5] rounded-md overflow-hidden border border-[#ddd] shadow-lg">
                    <div className="bg-[#cc0000] px-3 py-1.5 flex gap-2">
                      {["HOME", "BRANDS", "SHOP", "CONTACT"].map((t) => (
                        <span key={t} className="text-white text-[5px] font-sans">{t}</span>
                      ))}
                    </div>
                    <div className="bg-gradient-to-b from-yellow-400 to-orange-400 px-3 py-4 text-center">
                      <p className="text-[7px] font-bold text-gray-800 font-serif">★ WELCOME TO HERITAGE JEWELLERS ★</p>
                      <p className="text-[4.5px] text-gray-600 mt-1">INDIA&apos;S MOST TRUSTED BRAND SINCE 1985</p>
                    </div>
                    <div className="p-2 grid grid-cols-3 gap-1">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white border border-gray-200 rounded-sm p-1">
                          <div className="bg-gray-200 h-6 rounded-sm mb-1" />
                          <div className="bg-gray-300 h-[3px] w-4/5 rounded-sm mb-0.5" />
                          <div className="bg-gray-200 h-[3px] w-1/2 rounded-sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-accent-dim text-accent font-mono text-[10px] uppercase tracking-[0.15em] text-center py-3 border-b border-border">
                  After · Sheenhaus
                </div>
                <div className="bg-gradient-to-br from-[#0a1a12] to-[#0d1f16] h-64 md:h-80 flex items-center justify-center p-6">
                  <div className="w-full max-w-[280px] bg-[#0a0b0d] rounded-md overflow-hidden border border-[#222] shadow-lg">
                    <div className="px-3 py-2 flex justify-between items-center border-b border-[#1a1a1a]">
                      <div className="w-4 h-4 bg-accent rounded" />
                      <div className="flex gap-2">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="w-3 h-[2px] bg-[#444] rounded-sm" />
                        ))}
                      </div>
                    </div>
                    <div className="px-4 py-8 text-center">
                      <p className="text-[10px] text-gray-100 font-serif">Crafted for generations</p>
                      <p className="text-[4px] text-gray-500 mt-2 leading-relaxed max-w-[80%] mx-auto">
                        Where heritage meets contemporary design. Every piece tells the story of India&apos;s finest artisans.
                      </p>
                      <div className="mx-auto mt-3 w-10 h-[10px] bg-accent rounded" />
                    </div>
                    <div className="px-3 pb-3 grid grid-cols-3 gap-1.5">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-[#111] border border-[#1a1a1a] rounded p-1.5">
                          <div className="bg-gradient-to-br from-[#0a2018] to-[#0d2a1e] h-5 rounded mb-1" />
                          <div className="bg-[#2a2a2a] h-[2px] w-3/4 rounded-sm mb-0.5" />
                          <div className="bg-[#1e1e1e] h-[2px] w-1/2 rounded-sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-text-dim mt-6 leading-relaxed max-w-3xl">
              A multi-generational luxury jeweller with 50+ showrooms across the Middle East.
              Their website was built by their POS vendor. We transformed it into a premium
              digital experience that matches the grandeur of their physical stores.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* ═══════════ PROCESS ═══════════ */}
      <section id="process" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <RevealOnScroll>
          <p className="section-line font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-4">
            How We Work
          </p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] leading-[1.15] tracking-tight max-w-2xl mb-4">
            Four steps. Three weeks. Zero templates.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border rounded-2xl overflow-hidden mt-14">
            {STEPS.map((s) => (
              <div key={s.num} className="bg-bg-surface p-8 md:p-10 hover:bg-bg-surface-2 transition-colors duration-300">
                <span className="font-serif text-5xl text-accent/20 leading-none block mb-5">
                  {s.num}
                </span>
                <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-text-dim leading-relaxed">{s.desc}</p>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent block mt-5">
                  {s.time}
                </span>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ═══════════ AI SECTION ═══════════ */}
      <section className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <RevealOnScroll>
          <p className="section-line font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-4">
            What Nobody Else Offers
          </p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] leading-[1.15] tracking-tight max-w-2xl mb-4">
            We make AI recommend your business
          </h2>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-2 gap-12 mt-14">
          <RevealOnScroll>
            <div className="bg-bg-surface-2 border border-border rounded-2xl p-8 font-mono text-sm">
              <div className="text-text-mid pb-4 mb-4 border-b border-border leading-relaxed">
                <span className="text-text">User:</span> &quot;What are the best luxury
                jewellery stores in Dubai for bridal collections?&quot;
              </div>
              <div className="text-text-dim leading-[2]">
                &quot;Some of the most trusted names include{" "}
                <span className="text-accent font-semibold">Al Fardan Jewellers</span>,
                known for their handcrafted bridal collections and four-decade legacy.
                They specialize in bespoke diamond and gold sets with...&quot;
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <div className="flex flex-col gap-6">
              {[
                { title: "AI-optimized content structure", desc: "We write and structure your content so AI models understand and recommend your business for relevant queries." },
                { title: "Schema markup & structured data", desc: "Technical SEO that tells Google, ChatGPT, and Claude exactly what your business does, where you are, and why you matter." },
                { title: "Monthly AI visibility reports", desc: "We track which AI queries mention your brand vs. competitors. You see the score improve every month." },
              ].map((p) => (
                <div key={p.title} className="flex gap-4">
                  <div className="w-7 h-7 rounded-lg bg-accent-dim border border-accent-mid flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold mb-1">{p.title}</h4>
                    <p className="text-sm text-text-dim leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ═══════════ ABOUT ═══════════ */}
      <section id="about" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <RevealOnScroll>
          <p className="section-line font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-4">
            Who We Are
          </p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] leading-[1.15] tracking-tight max-w-2xl mb-4">
            A boutique studio. Senior talent only.
          </h2>
          <p className="text-text-mid max-w-xl leading-relaxed">
            No juniors, no outsourcing, no handoffs. The people you talk to are the people
            who build your site. Based in India, serving clients worldwide.
          </p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-4 mt-14">
          {[
            { role: "Engineering & Design", name: "Rajat Aggarwal", school: "NSIT Delhi · Full-Stack Engineer", desc: "Engineer with deep experience in cloud infrastructure, performance optimization, and building systems that scale. Every site we deliver is hand-coded for speed, responsiveness, and premium feel." },
            { role: "Strategy & Client Success", name: "Partner Name", school: "XLRI Jamshedpur · Product & Growth", desc: "Product strategist who translates business goals into digital experiences that convert. Manages client relationships from first call to launch — ensuring every pixel serves a purpose." },
          ].map((p, i) => (
            <RevealOnScroll key={p.name} delay={i * 0.1}>
              <div className="bg-bg-surface border border-border rounded-2xl p-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                  {p.role}
                </span>
                <h3 className="font-serif text-2xl mt-1.5">{p.name}</h3>
                <p className="text-sm text-text-dim mt-1 mb-3">{p.school}</p>
                <p className="text-sm text-text-mid leading-relaxed">{p.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ═══════════ BOLD QUOTE ═══════════ */}
      <RevealOnScroll>
        <div className="relative z-10 py-20 px-6 md:px-12 max-w-4xl mx-auto text-center">
          <blockquote className="font-serif text-[clamp(1.4rem,3.5vw,2rem)] leading-[1.45] tracking-tight text-text-mid">
            &quot;Your website was probably built by whoever handles your billing software.
            That&apos;s like asking your{" "}
            <em className="italic gradient-text">accountant to design your showroom.</em>
            &quot; We exist because these are two very different jobs.
          </blockquote>
        </div>
      </RevealOnScroll>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ═══════════ FAQ ═══════════ */}
      <section id="faq" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <RevealOnScroll>
          <p className="section-line font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-4">
            Common Questions
          </p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] leading-[1.15] tracking-tight">
            Things you&apos;re probably wondering
          </h2>
        </RevealOnScroll>

        <div className="mt-12 max-w-2xl">
          {FAQS.map((f) => (
            <RevealOnScroll key={f.q}>
              <FAQItem q={f.q} a={f.a} />
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section id="contact" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="text-center relative">
            <h2 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.12] tracking-tight max-w-3xl mx-auto">
              Your brand deserves{" "}
              <em className="italic gradient-text">better</em> than a template
            </h2>
            <p className="text-text-mid text-lg max-w-lg mx-auto mt-5 leading-relaxed">
              Book a 15-minute intro call. We&apos;ll look at your current website, show you
              what&apos;s possible, and give you an honest assessment — wherever you are in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <a
                href={CAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-accent text-bg px-8 py-4 rounded-xl text-[15px] font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(52,211,153,0.2)] transition-all duration-300"
              >
                📅 Book a Free Call
              </a>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 border border-border-light text-text px-8 py-4 rounded-xl text-[15px] font-medium hover:border-[#25D366] hover:text-[#25D366] transition-all duration-300"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative z-10 border-t border-border py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-serif text-lg">Sheenhaus</span>
            <span className="w-px h-4 bg-border" />
            <span className="text-text-dim text-xs">
              Based in India · Serving US, UAE, Europe &amp; beyond · © 2026
            </span>
          </div>
          <div className="flex gap-6">
            <a href="mailto:hello@sheenhaus.com" className="text-text-dim text-sm hover:text-accent transition-colors">
              hello@sheenhaus.com
            </a>
            <a href="#" className="text-text-dim text-sm hover:text-accent transition-colors">
              Twitter
            </a>
            <a href="#" className="text-text-dim text-sm hover:text-accent transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

      {/* ═══════════ WHATSAPP FLOAT ═══════════ */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-7 right-7 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform duration-300"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
