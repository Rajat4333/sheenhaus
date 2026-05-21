"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#studio", label: "Studio" },
  { href: "#contact", label: "Contact" },
];

const CAL_LINK = "https://cal.com/sheenhaus/intro";

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
          scrolled
            ? "bg-bg/75 backdrop-blur-xl border-b border-border"
            : "bg-transparent border-b border-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.0, delay: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="shell flex items-center justify-between h-[88px]">
          {/* Logomark + wordmark — placeholder until real logo lands */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            data-cursor="hover"
          >
            <span className="relative w-9 h-9 inline-flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-accent/50" />
              <span className="absolute inset-[5px] rounded-full border border-accent/25" />
              <span className="font-serif italic text-accent text-base leading-none">
                S
              </span>
            </span>
            <span className="font-serif text-[22px] tracking-tight text-text leading-none">
              Sheenhaus
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-12">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cursor="hover"
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mid hover:text-text transition-colors duration-500"
              >
                {link.label}
              </a>
            ))}
            <div className="hidden lg:flex items-center gap-3 pl-6 border-l border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dim">
                Booking Q3
              </span>
            </div>
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="cta"
              data-cursor-text="Book"
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent hover:text-accent-bright transition-colors duration-500"
            >
              Book a call →
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-cursor="hover"
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
              <a
                href={CAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-bronze mt-6 self-start"
                onClick={() => setMobileOpen(false)}
              >
                Book a call
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
