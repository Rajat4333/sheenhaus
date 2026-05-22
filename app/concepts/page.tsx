"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const CAL_LINK = "https://cal.com/sheenhaus/intro";

type Concept = {
  num: string;
  slug: string;
  name: string;
  sector: string;
  brief: string;
  notes: string[];
  swatch: string;
};

const CONCEPTS: Concept[] = [
  {
    num: "001",
    slug: "jewellery",
    name: "A Jewellery House",
    sector: "Luxury Retail · Dubai",
    brief:
      "An imagined redesign for a multi-generational jewellery house with twenty showrooms across the Gulf. The current site reads like a product catalogue; our concept reframes it as a digital atelier — slow-paced, photographic, anchored in heritage.",
    notes: [
      "Editorial layout led by craft macro photography",
      "Collection pages designed as printed lookbooks",
      "Atelier visit booking as the primary action",
      "AI discoverability tuned for bridal and bespoke queries",
    ],
    swatch:
      "linear-gradient(135deg, #2a1f17 0%, #4a3520 50%, #c9a96e 100%)",
  },
  {
    num: "002",
    slug: "hotel",
    name: "A Boutique Hotel",
    sector: "Hospitality · Maldives",
    brief:
      "A concept for an independent island resort competing against five-star chains. The brief: a website that conveys the feeling of arrival — silence, light, water — without resorting to autoplay video or generic stock photography.",
    notes: [
      "Single-page editorial structure, no traditional navigation",
      "Imagery sequenced like a film",
      "Direct booking with minimal form friction",
      "Schema markup for AI travel queries",
    ],
    swatch:
      "linear-gradient(135deg, #0e1a16 0%, #1f3a2c 50%, #2d4a3a 100%)",
  },
  {
    num: "003",
    slug: "real-estate",
    name: "A Real Estate Group",
    sector: "Premium Property · New York",
    brief:
      "An exploration for a developer selling ultra-premium residential properties. The category is full of websites with popup ads and stock interiors. Our concept treats each property as a publication — a hardback book printed in HTML.",
    notes: [
      "Per-property microsites, each art-directed",
      "Slow-pacing animation, no autoplay video",
      "Discreet enquiry flow, no public price disclosure",
      "Concierge handoff baked into the architecture",
    ],
    swatch:
      "linear-gradient(135deg, #1a1612 0%, #2a2218 60%, #6b5a3a 100%)",
  },
  {
    num: "004",
    slug: "healthcare",
    name: "A Surgical Practice",
    sector: "Private Healthcare · Bangalore",
    brief:
      "A concept for a private surgical practice serving international patients. The category defaults to clinical-looking sites that undermine the surgeon's craft. Our concept positions the practice as a consultancy — calm, considered, profoundly human.",
    notes: [
      "Surgeon-led narrative, not service-led",
      "Outcomes presented as case studies, not testimonials",
      "International patient journey detailed end-to-end",
      "AI discoverability tuned for procedure-specific queries",
    ],
    swatch:
      "linear-gradient(135deg, #14110e 0%, #2a2218 50%, #4a3a2a 100%)",
  },
];

export default function ConceptsPage() {
  return (
    <>
      <Navbar />

      {/* Ambient warm orbs */}
      <div className="fixed top-[-300px] right-[-200px] w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(138,106,53,0.08)_0%,transparent_60%)] pointer-events-none z-0" />
      <div className="fixed bottom-[-400px] left-[-300px] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(45,74,58,0.06)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* MASTHEAD */}
      <section className="relative z-10 shell pt-40 sm:pt-48 md:pt-56 pb-20">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid">
            Studio Concepts
          </span>
        </div>
        <h1 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[22ch]">
          Four <em className="italic-accent">self-initiated</em> studies in
          how premium brands should look online.
        </h1>
        <p className="text-text-mid text-[17px] max-w-2xl mt-10 leading-[1.8]">
          These are exploratory studio concepts, not commissioned engagements.
          We make them to test ideas, to demonstrate craft, and to give
          prospective clients something tangible to react to before a brief
          exists. Full briefs available on request.
        </p>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* CONCEPTS */}
      {CONCEPTS.map((c, i) => (
        <section
          key={c.slug}
          id={c.slug}
          className="relative z-10 shell section-pad scroll-mt-24"
        >
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20 items-start">
            {/* Left meta column */}
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent whitespace-nowrap">
                {c.num} · Concept
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mid whitespace-nowrap">
                {c.sector}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim whitespace-nowrap">
                Year · 2026
              </span>
            </div>

            {/* Right content column */}
            <div>
              <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-[-0.03em] max-w-[22ch]">
                {c.name}
              </h2>

              <p className="text-text-mid text-[17px] leading-[1.8] mt-10 max-w-2xl">
                {c.brief}
              </p>

              {/* Concept visual — gradient placeholder until real imagery */}
              <div
                className="relative w-full aspect-[16/9] mt-14 overflow-hidden rounded-sm"
                style={{
                  background: c.swatch,
                  boxShadow:
                    "0 30px 80px -20px rgba(26, 22, 18, 0.18)",
                }}
              >
                <div
                  className="absolute inset-0 mix-blend-overlay opacity-40 pointer-events-none"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.5'/%3E%3C/svg%3E\")",
                  }}
                />
                <div className="absolute inset-0 flex items-end p-10">
                  <span
                    className="font-serif italic text-2xl md:text-3xl tracking-[-0.02em]"
                    style={{ color: "#f0ebe0" }}
                  >
                    {c.name}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-14 border-t border-border">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent block mt-6 mb-2">
                  Approach
                </span>
                <ul className="divide-y divide-border">
                  {c.notes.map((n, ni) => (
                    <li
                      key={ni}
                      className="grid grid-cols-[40px_1fr] gap-6 py-5"
                    >
                      <span className="font-mono text-[11px] tracking-[0.18em] text-text-dim">
                        {String(ni + 1).padStart(2, "0")}
                      </span>
                      <span className="font-serif text-lg md:text-xl leading-snug text-text">
                        {n}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {i < CONCEPTS.length - 1 && (
            <div className="mt-32 hairline" />
          )}
        </section>
      ))}

      {/* CTA */}
      <section className="relative z-10 shell section-pad text-center">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid">
            Have a brief?
          </span>
        </div>
        <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[20ch] mx-auto">
          We work on{" "}
          <em className="italic-accent">three</em> engagements at a time.
        </h2>
        <p className="text-text-mid text-[17px] max-w-xl mx-auto mt-8 leading-[1.8]">
          If something here resonates with your business, book a twenty-minute
          introduction. We will study your current site and give you an honest
          assessment.
        </p>
        <div className="flex flex-col items-center gap-6 mt-14">
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="cta"
            data-cursor-text="Schedule"
            className="btn-bronze"
          >
            Book a call <span aria-hidden>→</span>
          </a>
          <Link
            href="/"
            data-cursor="hover"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim hover:text-accent transition-colors duration-500"
          >
            ← Back to the studio
          </Link>
        </div>
      </section>
    </>
  );
}
