"use client";

/* Services — the four concrete deliverables, in code-list style.
   Each row has its own SVG glyph and reveals a sample deliverable
   on hover. Quiet until the visitor leans in, then earns its space. */

import { motion, useInView } from "framer-motion";
import { useRef, useState, type ReactElement } from "react";

type Service = {
  code: string;
  title: string;
  body: string;
  sample: string;
  Glyph: (props: { active: boolean }) => ReactElement;
};

/* ─── SVG glyphs — drawn, not decorative ────────────────────── */
function GlyphSite({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden>
      <rect x="6" y="10" width="52" height="44" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="20" x2="58" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11" cy="15" r="1" fill="currentColor" />
      <circle cx="15" cy="15" r="1" fill="currentColor" />
      <motion.line
        x1="14" y1="32" x2="50" y2="32"
        stroke="currentColor" strokeWidth="1.5"
        animate={{ pathLength: active ? 1 : 0.55 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      />
      <motion.line
        x1="14" y1="40" x2="42" y2="40"
        stroke="currentColor" strokeWidth="1.5" opacity="0.55"
        animate={{ pathLength: active ? 1 : 0.4 }}
        transition={{ duration: 0.7, delay: 0.05, ease: [0.2, 0.7, 0.2, 1] }}
      />
      <motion.line
        x1="14" y1="48" x2="36" y2="48"
        stroke="currentColor" strokeWidth="1.5" opacity="0.35"
        animate={{ pathLength: active ? 1 : 0.25 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
      />
    </svg>
  );
}

function GlyphFlow({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden>
      <circle cx="12" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="52" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="44" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 22 Q 24 32, 28 42" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" />
      <path d="M48 22 Q 40 32, 36 42" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" />
      <motion.circle
        cx="20" cy="28" r="1.6" fill="currentColor"
        animate={{ cx: active ? [16, 28, 32] : 20, cy: active ? [22, 36, 42] : 28, opacity: active ? [1, 1, 0] : 0.7 }}
        transition={{ duration: 1.6, repeat: active ? Infinity : 0, ease: "linear" }}
      />
      <motion.circle
        cx="44" cy="28" r="1.6" fill="currentColor"
        animate={{ cx: active ? [48, 36, 32] : 44, cy: active ? [22, 36, 42] : 28, opacity: active ? [1, 1, 0] : 0.7 }}
        transition={{ duration: 1.6, delay: 0.4, repeat: active ? Infinity : 0, ease: "linear" }}
      />
    </svg>
  );
}

function GlyphAI({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden>
      <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <motion.circle
        cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"
        animate={{ scale: active ? [1, 1.12, 1] : 1, opacity: active ? [0.5, 0.2, 0.5] : 0.5 }}
        transition={{ duration: 2, repeat: active ? Infinity : 0, ease: "easeInOut" }}
        style={{ transformOrigin: "32px 32px" }}
      />
      <circle cx="32" cy="32" r="3" fill="currentColor" />
      <line x1="32" y1="12" x2="32" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="32" y1="58" x2="32" y2="52" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="32" x2="6" y2="32" stroke="currentColor" strokeWidth="1.5" />
      <line x1="58" y1="32" x2="52" y2="32" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GlyphPanel({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden>
      <rect x="6" y="10" width="52" height="44" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="16" width="14" height="32" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <line x1="30" y1="20" x2="52" y2="20" stroke="currentColor" strokeWidth="1.2" />
      <motion.rect
        x="30" y="26" width="22" height="4" rx="1" fill="currentColor" opacity="0.45"
        animate={{ width: active ? [10, 22, 22] : 22 }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
      />
      <motion.rect
        x="30" y="34" width="16" height="4" rx="1" fill="currentColor" opacity="0.3"
        animate={{ width: active ? [6, 16, 16] : 16 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
      />
      <motion.rect
        x="30" y="42" width="20" height="4" rx="1" fill="currentColor" opacity="0.2"
        animate={{ width: active ? [8, 20, 20] : 20 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
      />
    </svg>
  );
}

const SERVICES: Service[] = [
  {
    code: "01",
    title: "Cinematic websites",
    body: "Hand-coded sites with bespoke motion, 3D moments where they earn it, and the kind of typography buyers notice on second glance.",
    sample: "e.g. brand site for a jewellery house — sub-1s LCP, kinetic type, schema-clean.",
    Glyph: GlyphSite,
  },
  {
    code: "02",
    title: "Workflow automation",
    body: "The wiring that runs your business. Zapier, Make, custom Node — built once, monitored, owned by you.",
    sample: "e.g. lead intake → enrichment → routing → calendar, fully owned.",
    Glyph: GlyphFlow,
  },
  {
    code: "03",
    title: "AI-native integrations",
    body: "Site-level (chat, content generation), ops-level (intake triage, lead scoring), customer-facing (assistants that know your product).",
    sample: "e.g. an assistant trained on your catalogue that converts on-site.",
    Glyph: GlyphAI,
  },
  {
    code: "04",
    title: "Internal tools",
    body: "Admin panels, dashboards, the boring software that saves your team five hours a week. Built lean. Built to last.",
    sample: "e.g. a single dashboard replacing four spreadsheets and a WhatsApp group.",
    Glyph: GlyphPanel,
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section
      ref={ref}
      className="theme-clinical relative overflow-hidden"
      style={{ background: "var(--cl-bg)" }}
    >
      <div className="relative z-10 max-w-[1000px] mx-auto px-6 py-32 md:py-44">
        {/* Eyebrow */}
        <div
          className="text-[10px] uppercase tracking-[0.32em] mb-6 text-center"
          style={{ color: "var(--cl-ink-faint)" }}
        >
          <span style={{ color: "#8a6a35" }}>●</span> What we ship
        </div>

        {/* Heading */}
        <h2
          className="cl-display text-center mx-auto"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            color: "var(--cl-ink)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            maxWidth: "20ch",
          }}
        >
          Four <em>capabilities</em>. One small team.
        </h2>
        <p
          className="mt-6 text-[15px] max-w-lg mx-auto text-center"
          style={{ color: "var(--cl-ink-soft)" }}
        >
          We work on engagements end-to-end. Most clients hire us for one of
          these and discover they wanted all four.
        </p>

        {/* List */}
        <div className="mt-16 md:mt-20 max-w-3xl mx-auto">
          {SERVICES.map((s, i) => {
            const active = hovered === s.code;
            const Glyph = s.Glyph;
            return (
              <motion.article
                key={s.code}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + i * 0.12,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
                onMouseEnter={() => setHovered(s.code)}
                onMouseLeave={() => setHovered(null)}
                className="services-row grid grid-cols-[auto_auto_1fr] gap-5 md:gap-10 py-8 md:py-10 border-t items-start"
                style={{ borderColor: "var(--cl-stroke)" }}
              >
                <div
                  className="text-[11px] uppercase tracking-[0.22em] pt-2"
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                    color: "#8a6a35",
                  }}
                >
                  {s.code}
                </div>
                <motion.div
                  className="services-glyph"
                  style={{ color: active ? "#8a6a35" : "var(--cl-ink)" }}
                  animate={{ y: active ? -2 : 0 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <Glyph active={active} />
                </motion.div>
                <div>
                  <h3
                    className="cl-display"
                    style={{
                      fontSize: "clamp(1.25rem, 2.8vw, 1.75rem)",
                      color: "var(--cl-ink)",
                      lineHeight: 1.25,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="mt-3 text-[15px] leading-[1.7] max-w-prose"
                    style={{ color: "var(--cl-ink-soft)" }}
                  >
                    {s.body}
                  </p>
                  <motion.p
                    className="mt-3 text-[12px] italic max-w-prose"
                    style={{ color: "#8a6a35" }}
                    initial={false}
                    animate={{ opacity: active ? 1 : 0, height: active ? "auto" : 0, marginTop: active ? 12 : 0 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                  >
                    {s.sample}
                  </motion.p>
                </div>
              </motion.article>
            );
          })}
          {/* Bottom hairline to close the list */}
          <div
            className="border-t"
            style={{ borderColor: "var(--cl-stroke)" }}
          />
        </div>
      </div>
    </section>
  );
}
