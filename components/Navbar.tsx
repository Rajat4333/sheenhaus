"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
];

const CAL_LINK = "https://cal.com/sheenhaus/intro";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-bg/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-accent rounded-[10px] flex items-center justify-center font-serif text-xl text-bg transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-105">
              S
            </div>
            <span className="font-serif text-[22px] tracking-tight text-text">
              Sheenhaus
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text-mid hover:text-text transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-bg px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="w-6 h-0.5 bg-text block"
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-text block"
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-text block"
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl pt-24 px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-2xl font-serif text-text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href={CAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-bg px-8 py-4 rounded-xl text-center text-lg font-semibold mt-4"
                onClick={() => setMobileOpen(false)}
              >
                Book a Call
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
