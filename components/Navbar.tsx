"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#studio", label: "Studio" },
  { href: "/#contact", label: "Contact" },
];

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? "bg-bg/70 backdrop-blur-xl" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.0, delay: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="shell flex items-center justify-between h-[88px]">
          {/* Wordmark only — clean type, no mark. Luxury studios
              (Aesop, Aman, Loro Piana, The Row) all use wordmark navbars. */}
          <Link
            href="/"
            className="font-serif text-[26px] tracking-[-0.02em] text-text leading-none"
          >
            Sheenhaus
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mid hover:text-text transition-colors duration-700"
              >
                {link.label}
              </a>
            ))}
            {/* Quiet Audit CTA — bordered pill with a live dot. Distinct
                enough to read as an action, restrained enough not to
                shout above the wordmark. */}
            <Link
              href="/audit"
              className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent/40 hover:border-accent text-text hover:text-accent font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-700"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
              Audit your site
            </Link>
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-text hover:text-accent transition-colors duration-700"
            >
              Reserve <span aria-hidden>→</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="w-6 h-px bg-text block"
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="w-6 h-px bg-text block"
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="w-6 h-px bg-text block"
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-bg/97 backdrop-blur-xl pt-28 px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="font-serif text-4xl text-text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.1 }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex flex-col gap-4 mt-6">
                <Link
                  href="/audit"
                  className="btn-bronze self-start"
                  onClick={() => setMobileOpen(false)}
                >
                  Audit your site <span aria-hidden>→</span>
                </Link>
                <a
                  href={CAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost self-start"
                  onClick={() => setMobileOpen(false)}
                >
                  Reserve
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
