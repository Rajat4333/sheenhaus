"use client";

/* Studio close — section 6. One short paragraph in serif, then two
   contact pills. Quiet on purpose. The closing chord. */

import { motion } from "framer-motion";
import Link from "next/link";

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";

export default function StudioClose() {
  return (
    <section
      className="theme-clinical relative overflow-hidden"
      style={{ background: "var(--cl-bg)" }}
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6 py-32 md:py-48 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div
            className="text-[10px] uppercase tracking-[0.32em] mb-8"
            style={{ color: "var(--cl-ink-faint)" }}
          >
            <span style={{ color: "#8a6a35" }}>●</span> The Studio
          </div>
          <h2
            className="cl-display"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              color: "var(--cl-ink)",
              lineHeight: 1.2,
              letterSpacing: "-0.022em",
              maxWidth: "26ch",
              margin: "0 auto",
            }}
          >
            The studio is <em>always open</em> for ambitious work.
          </h2>
          <p
            className="mt-8 text-[15px] max-w-md mx-auto"
            style={{ color: "var(--cl-ink-soft)" }}
          >
            Working with three businesses at a time, end-to-end. Bring us
            something cinematic, something automated, something that should
            already exist.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
            >
              Book a call <span aria-hidden>→</span>
            </a>
            <a href="mailto:hello@sheenhaus.com" className="cta-ghost">
              hello@sheenhaus.com <span aria-hidden>→</span>
            </a>
          </div>
        </motion.div>

        {/* Footer hairline + mark */}
        <div className="mt-32 pt-10 border-t" style={{ borderColor: "var(--cl-stroke)" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 60%, #c9b89e 100%)",
                }}
                aria-hidden
              />
              <span
                className="text-[13px] tracking-tight"
                style={{ color: "var(--cl-ink)" }}
              >
                sheenhaus
              </span>
            </Link>
            <div
              className="text-[10px] uppercase tracking-[0.28em]"
              style={{ color: "var(--cl-ink-faint)" }}
            >
              © Sheenhaus {new Date().getFullYear()} · End-to-end tech for ambitious businesses
            </div>
            {/* Editorial / trademark notice — kept restrained so the
                hero footer stays elegant. Protects published reports
                that name third-party brands. */}
            <div
              className="text-[9px] tracking-[0.18em] uppercase max-w-md leading-[1.7] mt-1"
              style={{ color: "var(--cl-ink-faint)", opacity: 0.6 }}
            >
              All third-party brand names and trademarks remain the property
              of their respective owners. Published audits are editorial
              commentary on public information.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

