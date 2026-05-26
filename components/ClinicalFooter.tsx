/* ClinicalFooter — a minimal legal-and-mark footer for every
 * non-homepage in the clinical theme.
 *
 * Renders: hairline → wordmark · copyright · legal links → tiny
 * trademark notice. Designed to be quiet and easy to scan; the only
 * "active" elements are the three legal links.
 *
 * The homepage uses StudioClose as its richer brand-close component;
 * this footer is the lightweight equivalent for inner pages so visitors
 * can always reach /legal from anywhere.
 */

import Link from "next/link";

export default function ClinicalFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="theme-clinical relative"
      style={{ background: "var(--cl-bg)" }}
      aria-label="Footer"
    >
      <div className="shell pt-16 pb-12 border-t" style={{ borderColor: "var(--cl-stroke)" }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link href="/" className="inline-flex items-center">
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
            © Sheenhaus {year} · End-to-end tech for ambitious businesses
          </div>
          <nav
            className="flex items-center gap-5 text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "var(--cl-ink-faint)" }}
            aria-label="Legal"
          >
            <Link
              href="/legal#privacy"
              className="hover:opacity-100 opacity-80 transition-opacity"
            >
              Privacy
            </Link>
            <span aria-hidden style={{ opacity: 0.4 }}>
              ·
            </span>
            <Link
              href="/legal#terms"
              className="hover:opacity-100 opacity-80 transition-opacity"
            >
              Terms
            </Link>
            <span aria-hidden style={{ opacity: 0.4 }}>
              ·
            </span>
            <Link
              href="/legal"
              className="hover:opacity-100 opacity-80 transition-opacity"
            >
              Legal
            </Link>
          </nav>
        </div>
        {/* Editorial / trademark notice */}
        <div
          className="text-[9px] tracking-[0.18em] uppercase max-w-2xl leading-[1.7] mt-8"
          style={{ color: "var(--cl-ink-faint)", opacity: 0.6 }}
        >
          All third-party brand names and trademarks remain the property of
          their respective owners. Published audits are editorial commentary
          on public information.
        </div>
      </div>
    </footer>
  );
}
