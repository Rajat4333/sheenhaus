"use client";
import Link from "next/link";
import ClinicalNavbar from "@/components/ClinicalNavbar";
import { useInView } from "framer-motion";
import { useRef } from "react";

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";

type Sign = {
  num: string;
  title: string;
  body: string[];
  // Tell-tale phrase a prospect should look for on their own site
  symptom: string;
  // Inline diagnostic glyph — a small line illustration of the bad pattern
  glyph: keyof typeof GLYPHS;
};

/* ─── Diagnostic glyphs — one per sign ────────────────────────
   Small line drawings (64×64 viewBox) of the bad pattern itself.
   Bronze stroke on cream. Subtle hover-state lift handled by the
   parent article. The page becomes scannable instead of monotone. */
const GLYPHS = {
  nav: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <rect x="6" y="14" width="52" height="10" rx="1" />
      {/* over-stuffed nav: dropdowns */}
      <line x1="11" y1="19" x2="17" y2="19" />
      <line x1="20" y1="19" x2="26" y2="19" />
      <line x1="29" y1="19" x2="35" y2="19" />
      <line x1="38" y1="19" x2="44" y2="19" />
      <line x1="47" y1="19" x2="53" y2="19" />
      {/* fallout dropdown panels */}
      <rect x="20" y="28" width="14" height="22" rx="0.6" opacity="0.5" />
      <line x1="22" y1="33" x2="32" y2="33" opacity="0.5" />
      <line x1="22" y1="38" x2="32" y2="38" opacity="0.5" />
      <line x1="22" y1="43" x2="32" y2="43" opacity="0.5" />
    </svg>
  ),
  popup: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      {/* underlying page */}
      <rect x="6" y="6" width="52" height="52" rx="2" opacity="0.25" />
      {/* popup modal */}
      <rect x="14" y="18" width="40" height="32" rx="1" fill="rgba(245,232,200,0.5)" />
      <circle cx="50" cy="22" r="2" fill="none" />
      <line x1="48.5" y1="20.5" x2="51.5" y2="23.5" />
      <line x1="51.5" y1="20.5" x2="48.5" y2="23.5" />
      {/* 10% badge */}
      <text x="33" y="38" textAnchor="middle" fontSize="9" fontFamily="serif" fontStyle="italic" fill="currentColor" stroke="none">10%</text>
      <text x="33" y="46" textAnchor="middle" fontSize="4" fontFamily="monospace" letterSpacing="1" fill="currentColor" stroke="none">OFF</text>
    </svg>
  ),
  videohero: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <rect x="6" y="10" width="52" height="44" rx="1.5" />
      {/* play button */}
      <polygon points="27,26 27,42 41,34" fill="currentColor" stroke="none" />
      {/* smiley overlay */}
      <circle cx="50" cy="18" r="4" />
      <circle cx="48.5" cy="17" r="0.5" fill="currentColor" />
      <circle cx="51.5" cy="17" r="0.5" fill="currentColor" />
      <path d="M 48 19 Q 50 20.5, 52 19" />
    </svg>
  ),
  stockphoto: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      {/* three identical thumbnails */}
      <rect x="6" y="18" width="16" height="14" rx="0.8" />
      <circle cx="10" cy="22" r="1.2" />
      <path d="M 8 30 L 13 25 L 17 28 L 21 24" />
      <rect x="24" y="18" width="16" height="14" rx="0.8" />
      <circle cx="28" cy="22" r="1.2" />
      <path d="M 26 30 L 31 25 L 35 28 L 39 24" />
      <rect x="42" y="18" width="16" height="14" rx="0.8" />
      <circle cx="46" cy="22" r="1.2" />
      <path d="M 44 30 L 49 25 L 53 28 L 57 24" />
      {/* "all same" label */}
      <text x="32" y="42" textAnchor="middle" fontSize="6" fontFamily="monospace" letterSpacing="1" fill="currentColor" stroke="none">SAME × 3</text>
    </svg>
  ),
  url: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      {/* browser url bar */}
      <rect x="4" y="22" width="56" height="20" rx="10" />
      <circle cx="11" cy="32" r="2" />
      <line x1="11" y1="34" x2="13" y2="36" />
      {/* exposed url string */}
      <text x="17" y="35" fontSize="5" fontFamily="monospace" letterSpacing="0.4" fill="currentColor" stroke="none">/page.aspx?id=27</text>
    </svg>
  ),
  weights: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      {/* six A's of different weights, getting heavier */}
      <text x="6" y="42" fontSize="22" fontFamily="serif" fontWeight="100" fill="currentColor" stroke="none">A</text>
      <text x="17" y="42" fontSize="22" fontFamily="serif" fontWeight="300" fill="currentColor" stroke="none">A</text>
      <text x="28" y="42" fontSize="22" fontFamily="serif" fontWeight="500" fill="currentColor" stroke="none">A</text>
      <text x="39" y="42" fontSize="22" fontFamily="serif" fontWeight="700" fill="currentColor" stroke="none" fontStyle="italic">A</text>
      <text x="50" y="42" fontSize="22" fontFamily="sans-serif" fontWeight="900" fill="currentColor" stroke="none">A</text>
    </svg>
  ),
  form: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      {/* sixteen-field form */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={i}>
          <line x1={i < 4 ? 8 : 34} y1={12 + (i % 4) * 9} x2={i < 4 ? 28 : 54} y2={12 + (i % 4) * 9} />
          <line
            x1={i < 4 ? 8 : 34}
            y1={15 + (i % 4) * 9}
            x2={i < 4 ? 26 : 52}
            y2={15 + (i % 4) * 9}
            opacity="0.45"
          />
        </g>
      ))}
      {/* submit button */}
      <rect x="20" y="50" width="24" height="6" rx="3" />
    </svg>
  ),
  solutions: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      {/* three section headings, all start with the same word */}
      <text x="6" y="20" fontSize="6" fontFamily="serif" fill="currentColor" stroke="none">Holistic</text>
      <text x="22" y="20" fontSize="6.5" fontFamily="serif" fontWeight="700" fill="currentColor" stroke="none" fontStyle="italic">Solutions</text>
      <text x="6" y="34" fontSize="6" fontFamily="serif" fill="currentColor" stroke="none">End-to-End</text>
      <text x="28" y="34" fontSize="6.5" fontFamily="serif" fontWeight="700" fill="currentColor" stroke="none" fontStyle="italic">Solutions</text>
      <text x="6" y="48" fontSize="6" fontFamily="serif" fill="currentColor" stroke="none">Trusted</text>
      <text x="22" y="48" fontSize="6.5" fontFamily="serif" fontWeight="700" fill="currentColor" stroke="none" fontStyle="italic">Solutions</text>
    </svg>
  ),
  stars: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      {/* five stars in a row */}
      {[0, 1, 2, 3, 4].map((i) => (
        <polygon
          key={i}
          points={`${10 + i * 11},20 ${12 + i * 11},25 ${17 + i * 11},25 ${13 + i * 11},29 ${15 + i * 11},34 ${10 + i * 11},31 ${5 + i * 11},34 ${7 + i * 11},29 ${3 + i * 11},25 ${8 + i * 11},25`}
          fill="currentColor"
        />
      ))}
      {/* carousel dots */}
      <circle cx="22" cy="46" r="1.5" fill="currentColor" />
      <circle cx="30" cy="46" r="1.5" fill="none" />
      <circle cx="38" cy="46" r="1.5" fill="none" />
      <circle cx="46" cy="46" r="1.5" fill="none" />
      {/* attribution */}
      <text x="32" y="56" textAnchor="middle" fontSize="4" fontFamily="monospace" letterSpacing="0.5" fill="currentColor" stroke="none">— SARAH K., VERIFIED</text>
    </svg>
  ),
  perf: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      {/* gauge */}
      <path d="M 12 44 A 20 20 0 0 1 52 44" />
      <line x1="12" y1="44" x2="14" y2="42" />
      <line x1="52" y1="44" x2="50" y2="42" />
      <line x1="32" y1="24" x2="32" y2="22" />
      {/* needle pointing deep into the red */}
      <line x1="32" y1="44" x2="48" y2="32" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="32" cy="44" r="1.6" fill="currentColor" />
      {/* value */}
      <text x="32" y="56" textAnchor="middle" fontSize="6" fontFamily="monospace" letterSpacing="0.5" fill="currentColor" stroke="none">8.4s LCP</text>
    </svg>
  ),
  repeat: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      {/* four identical small pages, each with same skyline hero */}
      {[0, 1, 2, 3].map((i) => {
        const x = 4 + (i % 2) * 28;
        const y = 6 + Math.floor(i / 2) * 28;
        return (
          <g key={i}>
            <rect x={x} y={y} width="24" height="22" rx="0.8" />
            {/* skyline silhouette */}
            <path d={`M ${x + 2} ${y + 16} L ${x + 5} ${y + 12} L ${x + 8} ${y + 14} L ${x + 11} ${y + 9} L ${x + 14} ${y + 12} L ${x + 17} ${y + 8} L ${x + 20} ${y + 13} L ${x + 22} ${y + 16}`} />
            {/* sun */}
            <circle cx={x + 18} cy={y + 7} r="1.6" fill="currentColor" />
          </g>
        );
      })}
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      {/* chat bubble */}
      <path d="M 6 14 L 58 14 Q 60 14, 60 16 L 60 44 Q 60 46, 58 46 L 36 46 L 28 54 L 30 46 L 8 46 Q 6 46, 6 44 Z" />
      {/* answer with brand absent */}
      <line x1="12" y1="22" x2="40" y2="22" opacity="0.7" />
      <line x1="12" y1="28" x2="50" y2="28" opacity="0.55" />
      <line x1="12" y1="34" x2="46" y2="34" opacity="0.4" />
      {/* the missing slot */}
      <line x1="12" y1="40" x2="22" y2="40" opacity="0.4" />
      <rect x="24" y="37.5" width="20" height="5" rx="0.6" fill="none" strokeDasharray="2 2" opacity="0.5" />
    </svg>
  ),
};

const SIGNS: Sign[] = [
  {
    num: "01",
    title: "The header was built by your billing software vendor.",
    symptom: "Three‑column nav with a dropdown for every department.",
    glyph: "nav",
    body: [
      "Premium businesses outgrow the website their POS, CRM, or ERP vendor bundled with the system five years ago. The header is always the give-away: a dropdown for every department, a search bar nobody uses, a contact form that emails the IT manager.",
      "If your visitor is a buyer evaluating a fifteen-crore jewellery commission or a seven-figure property, they are looking for one signal — that the people behind the site understand what they are selling. A POS vendor's template cannot give that signal. It cannot.",
    ],
  },
  {
    num: "02",
    title: "A pop-up offers a 10% discount within four seconds of arrival.",
    symptom: "Newsletter modal · WhatsApp bubble · spin-the-wheel · exit-intent.",
    glyph: "popup",
    body: [
      "Discount popups are designed for performance-marketing funnels — direct-to-consumer brands optimising cost per acquisition. They work for hoodie companies. They are a category error for any business whose value proposition is the absence of urgency.",
      "A high-net-worth buyer does not need a five-percent discount on a Maldives villa. They need to be convinced that the villa is for them. The popup is not just useless — it is evidence that the brand does not know its own buyer.",
    ],
  },
  {
    num: "03",
    title: "The hero is an autoplay video of stock-photo customers laughing.",
    symptom: "B-roll of a model holding a martini glass · turntable shot of the lobby.",
    glyph: "videohero",
    body: [
      "There is a single trick that gives every Squarespace luxury site away: the hero is a fifteen-second autoplaying video of someone laughing into a phone. It is the same model on a thousand sites. Buyers recognise the face. They have seen the laugh.",
      "Premium video is either bespoke (commissioned for the brand) or it is absent. Stock video is worse than no video at all. Every second of stock footage in a hero is a second of credibility lost.",
    ],
  },
  {
    num: "04",
    title: "Every photograph is a stock photograph.",
    symptom: "The same Unsplash interior on three competitors' sites.",
    glyph: "stockphoto",
    body: [
      "We have nothing against stock photography in editorial contexts. But premium businesses sell their own work — their atelier, their property, their consulting room, their dish. Showing somebody else's work in the place where yours should be is the digital equivalent of putting another jeweller's pieces in your shopfront.",
      "If you cannot afford bespoke photography yet, show fewer photos. Show one. Show zero. Let the type carry the weight. A site with no images and confident typography reads as more considered than a site full of borrowed ones.",
    ],
  },
  {
    num: "05",
    title: "The address bar shows a route that ends in .aspx or /index.php?id=27.",
    symptom: "A footer with 'Powered by [CMS name]' in 8pt grey.",
    glyph: "url",
    body: [
      "URL design is one of the smallest visible details on a website. It is also one of the loudest. A URL that exposes the CMS scaffolding (`/page.aspx`, `?id=27`, `/wp-content/uploads/`) tells the visitor — instantly, before they read a word — that the brand is using an off-the-shelf system, not a tailored one.",
      "Compare `aman.com/amankora/journey` with `aman.com/index.php?journey=27`. The brand makes the same promise in both. The URL only carries that promise in the first.",
    ],
  },
  {
    num: "06",
    title: "There are six different font weights on the home page.",
    symptom: "A heading set in Bold. The next sentence set in Regular Italic. The price set in Black.",
    glyph: "weights",
    body: [
      "Type systems work the way wine glasses work: you only need three or four to do everything well, and the discipline of using only three or four is the entire reason it reads as considered.",
      "When a website mixes six weights — usually because somebody made each heading slightly different to 'add hierarchy' — the cumulative effect is noise. Restraint reads as confidence. A single weight at three sizes is more luxurious than five weights at five sizes.",
    ],
  },
  {
    num: "07",
    title: "The contact page is a form with sixteen fields.",
    symptom: "Required dropdown for budget · checkboxes for services · captcha.",
    glyph: "form",
    body: [
      "Every additional form field is a small statement: 'we want to qualify you before we talk.' Premium positioning works the other way around — the prospect qualifies the studio, the studio responds. A name, an email, and a sentence about the brief is enough.",
      "Sixteen fields is a tax on the buyer's interest. Buyers who would have written you a long, careful note will write nothing instead. The studio receives leads from the wrong tier of buyer.",
    ],
  },
  {
    num: "08",
    title: "Every section heading uses the word 'Solutions'.",
    symptom: "'Holistic Solutions' · 'End-to-End Solutions' · 'Trusted Solutions'.",
    glyph: "solutions",
    body: [
      "'Solutions' is the most exhausted word in B2B marketing copy. When a luxury brand uses it, the brand is borrowing the language of enterprise software vendors — selling the visitor on a service the way an HR platform sells managers on its onboarding flow.",
      "Premium brands sell objects, experiences, places, craft. Replacing 'Solutions' with the specific thing — bespoke commissions, private consultations, residential commissions, surgical care — narrows the audience by ninety percent and converts the ten percent who matter.",
    ],
  },
  {
    num: "09",
    title: "There are testimonial carousels with five-star ratings.",
    symptom: "Carousel of 1-paragraph quotes attributed to 'Sarah K., Verified Buyer.'",
    glyph: "stars",
    body: [
      "Testimonial carousels are direct imports from Amazon's product page conventions. They suit categories where buyers verify each other (electronics, household goods, supplements). In high-trust luxury categories — jewellery, hospitality, surgery, private legal — the social-proof carousel actively destroys trust.",
      "A jewellery house does not show its buyers' ratings. It shows the work. A surgeon does not show patient quotes — at most, anonymised outcomes. Premium brands do not need to be voted for; they let the work argue.",
    ],
  },
  {
    num: "10",
    title: "The site loads at five seconds on a desktop, ten on cellular.",
    symptom: "Three jQuery sliders · twelve tracking scripts · a 4MB hero image.",
    glyph: "perf",
    body: [
      "Performance is the single most-felt detail a premium buyer notices, and the one their team is least likely to flag. A jeweller's website that takes eight seconds to load on a 5G iPhone in a Dubai showroom is performing the same trick as a Bentley with a sluggish ignition. The brand may not notice. The buyer will.",
      "Sub-1.2-second LCP on cellular is the floor. We hold ourselves to it. Anything slower says the studio that built the site did not understand that the buyer was reading the load time as evidence.",
    ],
  },
  {
    num: "11",
    title: "Every page has the same hero photograph.",
    symptom: "Skyline + sunset crossfade on the home, about, contact, and 404.",
    glyph: "repeat",
    body: [
      "Templates ship with one hero. Premium brands need page-specific imagery — a different first frame for the collections page than for the contact page, because the buyer is doing different work in each place.",
      "Reusing the home hero across the site is the visual equivalent of opening every email with 'Dear Sir/Madam.' It signals that the brand could not be bothered to address the visitor where they actually are.",
    ],
  },
  {
    num: "12",
    title: "ChatGPT cannot name your brand when asked about your category.",
    symptom: "Ask Claude for 'the best luxury jewellers in Dubai.' Your name does not appear.",
    glyph: "ai",
    body: [
      "By 2026, a meaningful share of premium-category research begins inside an AI model — not Google. The model answers with three or four names. The buyer evaluates those names. They do not visit a search results page.",
      "If your brand is not among the names the model returns, you do not exist in that buyer's research. This is now the most important technical investment a premium brand can make in its digital presence — and the discipline of getting it right is one almost no studio has started to learn.",
    ],
  },
];

export default function SignsPage() {
  return (
    <main className="theme-clinical" style={{ background: "var(--cl-bg)", minHeight: "100vh" }}>
      <ClinicalNavbar />

      {/* MASTHEAD */}
      <section className="relative z-10 shell pt-40 sm:pt-48 md:pt-56 pb-20">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid whitespace-nowrap">
            Twelve Signs · From the Studio
          </span>
        </div>
        <h1 className="display-serif font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[22ch]">
          Twelve signs your website is{" "}
          <em className="italic-accent">costing you</em> clients.
        </h1>
        <p className="text-text-mid text-[17px] max-w-2xl mt-10 leading-[1.8]">
          Premium businesses outgrow their websites the way they outgrow their
          first office: gradually, then all at once. Below are twelve patterns
          we see on the websites of jewellery houses, hotels, real estate
          developers, and private clinics whose offline brand already outruns
          their digital presence. Read them as a quiet diagnostic. Tick the
          ones that apply, and you have a brief.
        </p>
      </section>

      <div className="shell">
        <div className="hairline" />
      </div>

      {/* SIGNS */}
      <section className="relative z-10 shell section-pad">
        <div className="max-w-3xl">
          {SIGNS.map((s) => (
            <SignArticle key={s.num} sign={s} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 shell pt-32 md:pt-40 pb-24 md:pb-32 text-center">
        <div className="inline-flex items-center gap-3">
          <span className="w-6 h-px bg-accent" />
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-text-mid whitespace-nowrap">
            Recognise your site here?
          </span>
        </div>
        <h2 className="display-serif font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.04] tracking-[-0.035em] mt-10 max-w-[22ch] mx-auto">
          Book a <em className="italic-accent">twenty-minute</em> audit.
        </h2>
        <p className="text-text-mid text-[17px] max-w-xl mx-auto mt-8 leading-[1.8]">
          Run our audit on your own URL to see which of the twelve signs apply,
          or book a twenty-minute conversation directly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-14">
          <Link href="/audit" className="btn-bronze">
            Audit your site <span aria-hidden>→</span>
          </Link>
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Book a call <span aria-hidden>→</span>
          </a>
        </div>
        <Link
          href="/"
          data-link-style="bronze"
          className="inline-block mt-10 font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim"
        >
          ← Back to the studio
        </Link>
      </section>
    </main>
  );
}

/* ─── A single sign article ─────────────────────────────────────
   Big Instrument Serif numeral on the left that fills with ink
   from the bottom as the article enters view — the same .sign-number
   treatment as the (now removed) homepage reel. */
function SignArticle({ sign }: { sign: Sign }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <article
      ref={ref}
      className="grid grid-cols-[auto_1fr] gap-6 md:gap-12 py-14 border-b border-border last:border-b-0 items-start"
    >
      <div className="flex flex-col items-start gap-4 md:gap-6">
        <div
          className="cl-display tabular-nums sign-number"
          style={
            {
              fontSize: "clamp(3rem, 7vw, 5rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              paddingBottom: "0.08em",
              paddingRight: "0.04em",
              ["--fill" as string]: inView ? "100%" : "0%",
              transition: "--fill 0.9s cubic-bezier(0.2, 0.7, 0.2, 1)",
            } as React.CSSProperties
          }
        >
          {sign.num}
        </div>
        {/* Diagnostic glyph — a small line illustration of the bad
            pattern. Inherits the bronze accent via currentColor. */}
        <div
          className="signs-glyph"
          style={{
            color: "#8a6a35",
            width: "clamp(56px, 8vw, 84px)",
            height: "clamp(56px, 8vw, 84px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s, transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s",
          }}
          aria-hidden
        >
          {GLYPHS[sign.glyph]}
        </div>
      </div>
      <div>
        <h2 className="display-serif font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] tracking-[-0.02em] max-w-[28ch]">
          {sign.title}
        </h2>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-faint mt-4">
          — {sign.symptom}
        </p>
        <div className="flex flex-col gap-5 mt-8">
          {sign.body.map((p, pi) => (
            <p
              key={pi}
              className="reading-mark text-text-mid text-[17px] leading-[1.85]"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
