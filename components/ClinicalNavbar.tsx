"use client";

/* The clinical-theme navbar — same floating pill as the homepage
   hero, lifted into a reusable component so every inner page
   (/audit, /signs, /concepts, /state-of-premium/jewellery) wears
   the same chrome. Single source of truth for the inner-page nav. */

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/state-of-premium/jewellery", label: "WORK" },
  { href: "/signs", label: "DIAGNOSTIC" },
  { href: "/audit", label: "AUDIT" },
  { href: "/concepts", label: "THESES" },
];

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";

export default function ClinicalNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="inline-flex items-center gap-1 px-2 py-2 rounded-full bg-white/85 backdrop-blur-md border"
          style={{
            borderColor: "var(--cl-stroke)",
            boxShadow: "0 4px 24px -8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 pl-3 pr-3 py-1.5"
          >
            <span
              className="inline-block w-3.5 h-3.5 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 60%, #c9b89e 100%)",
              }}
              aria-hidden="true"
            />
            <span
              className="text-sm tracking-tight"
              style={{ color: "var(--cl-ink)" }}
            >
              sheenhaus
            </span>
          </Link>

          <span
            className="w-px h-4 mx-1"
            style={{ background: "var(--cl-stroke)" }}
          />

          <div className="hidden md:flex items-center gap-0.5">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase rounded-full transition-colors duration-300 hover:bg-black/[0.03]"
                style={{ color: "var(--cl-ink-soft)" }}
              >
                {n.label}
              </Link>
            ))}
          </div>

          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 px-4 py-1.5 text-xs rounded-full transition-opacity hover:opacity-85 hidden sm:inline-flex items-center"
            style={{ background: "var(--cl-pill-bg)", color: "var(--cl-pill-ink)" }}
          >
            Book a call
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1 p-2 ml-1"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="w-4 h-px block"
              style={{ background: "var(--cl-ink)" }}
              animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="w-4 h-px block"
              style={{ background: "var(--cl-ink)" }}
              animate={open ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="w-4 h-px block"
              style={{ background: "var(--cl-ink)" }}
              animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            />
          </button>
        </motion.div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 pt-28 px-8 md:hidden"
            style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-6">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="cl-display text-4xl"
                    style={{ color: "var(--cl-ink)" }}
                  >
                    {n.label.toLowerCase()}
                  </Link>
                </motion.div>
              ))}
              <a
                href={CAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="cta-primary self-start mt-4"
              >
                Book a call <span aria-hidden>→</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
