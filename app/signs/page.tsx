"use client";
import Link from "next/link";
import ClinicalNavbar from "@/components/ClinicalNavbar";

const CAL_LINK = "https://cal.com/sheenhaus-yseo4c";

type Sign = {
  num: string;
  title: string;
  body: string[];
  // Tell-tale phrase a prospect should look for on their own site
  symptom: string;
};

const SIGNS: Sign[] = [
  {
    num: "01",
    title: "The header was built by your billing software vendor.",
    symptom: "Three‑column nav with a dropdown for every department.",
    body: [
      "Premium businesses outgrow the website their POS, CRM, or ERP vendor bundled with the system five years ago. The header is always the give-away: a dropdown for every department, a search bar nobody uses, a contact form that emails the IT manager.",
      "If your visitor is a buyer evaluating a fifteen-crore jewellery commission or a seven-figure property, they are looking for one signal — that the people behind the site understand what they are selling. A POS vendor's template cannot give that signal. It cannot.",
    ],
  },
  {
    num: "02",
    title: "A pop-up offers a 10% discount within four seconds of arrival.",
    symptom: "Newsletter modal · WhatsApp bubble · spin-the-wheel · exit-intent.",
    body: [
      "Discount popups are designed for performance-marketing funnels — direct-to-consumer brands optimising cost per acquisition. They work for hoodie companies. They are a category error for any business whose value proposition is the absence of urgency.",
      "A high-net-worth buyer does not need a five-percent discount on a Maldives villa. They need to be convinced that the villa is for them. The popup is not just useless — it is evidence that the brand does not know its own buyer.",
    ],
  },
  {
    num: "03",
    title: "The hero is an autoplay video of stock-photo customers laughing.",
    symptom: "B-roll of a model holding a martini glass · turntable shot of the lobby.",
    body: [
      "There is a single trick that gives every Squarespace luxury site away: the hero is a fifteen-second autoplaying video of someone laughing into a phone. It is the same model on a thousand sites. Buyers recognise the face. They have seen the laugh.",
      "Premium video is either bespoke (commissioned for the brand) or it is absent. Stock video is worse than no video at all. Every second of stock footage in a hero is a second of credibility lost.",
    ],
  },
  {
    num: "04",
    title: "Every photograph is a stock photograph.",
    symptom: "The same Unsplash interior on three competitors' sites.",
    body: [
      "We have nothing against stock photography in editorial contexts. But premium businesses sell their own work — their atelier, their property, their consulting room, their dish. Showing somebody else's work in the place where yours should be is the digital equivalent of putting another jeweller's pieces in your shopfront.",
      "If you cannot afford bespoke photography yet, show fewer photos. Show one. Show zero. Let the type carry the weight. A site with no images and confident typography reads as more considered than a site full of borrowed ones.",
    ],
  },
  {
    num: "05",
    title: "The address bar shows a route that ends in .aspx or /index.php?id=27.",
    symptom: "A footer with 'Powered by [CMS name]' in 8pt grey.",
    body: [
      "URL design is one of the smallest visible details on a website. It is also one of the loudest. A URL that exposes the CMS scaffolding (`/page.aspx`, `?id=27`, `/wp-content/uploads/`) tells the visitor — instantly, before they read a word — that the brand is using an off-the-shelf system, not a tailored one.",
      "Compare `aman.com/amankora/journey` with `aman.com/index.php?journey=27`. The brand makes the same promise in both. The URL only carries that promise in the first.",
    ],
  },
  {
    num: "06",
    title: "There are six different font weights on the home page.",
    symptom: "A heading set in Bold. The next sentence set in Regular Italic. The price set in Black.",
    body: [
      "Type systems work the way wine glasses work: you only need three or four to do everything well, and the discipline of using only three or four is the entire reason it reads as considered.",
      "When a website mixes six weights — usually because somebody made each heading slightly different to 'add hierarchy' — the cumulative effect is noise. Restraint reads as confidence. A single weight at three sizes is more luxurious than five weights at five sizes.",
    ],
  },
  {
    num: "07",
    title: "The contact page is a form with sixteen fields.",
    symptom: "Required dropdown for budget · checkboxes for services · captcha.",
    body: [
      "Every additional form field is a small statement: 'we want to qualify you before we talk.' Premium positioning works the other way around — the prospect qualifies the studio, the studio responds. A name, an email, and a sentence about the brief is enough.",
      "Sixteen fields is a tax on the buyer's interest. Buyers who would have written you a long, careful note will write nothing instead. The studio receives leads from the wrong tier of buyer.",
    ],
  },
  {
    num: "08",
    title: "Every section heading uses the word 'Solutions'.",
    symptom: "'Holistic Solutions' · 'End-to-End Solutions' · 'Trusted Solutions'.",
    body: [
      "'Solutions' is the most exhausted word in B2B marketing copy. When a luxury brand uses it, the brand is borrowing the language of enterprise software vendors — selling the visitor on a service the way an HR platform sells managers on its onboarding flow.",
      "Premium brands sell objects, experiences, places, craft. Replacing 'Solutions' with the specific thing — bespoke commissions, private consultations, residential commissions, surgical care — narrows the audience by ninety percent and converts the ten percent who matter.",
    ],
  },
  {
    num: "09",
    title: "There are testimonial carousels with five-star ratings.",
    symptom: "Carousel of 1-paragraph quotes attributed to 'Sarah K., Verified Buyer.'",
    body: [
      "Testimonial carousels are direct imports from Amazon's product page conventions. They suit categories where buyers verify each other (electronics, household goods, supplements). In high-trust luxury categories — jewellery, hospitality, surgery, private legal — the social-proof carousel actively destroys trust.",
      "A jewellery house does not show its buyers' ratings. It shows the work. A surgeon does not show patient quotes — at most, anonymised outcomes. Premium brands do not need to be voted for; they let the work argue.",
    ],
  },
  {
    num: "10",
    title: "The site loads at five seconds on a desktop, ten on cellular.",
    symptom: "Three jQuery sliders · twelve tracking scripts · a 4MB hero image.",
    body: [
      "Performance is the single most-felt detail a premium buyer notices, and the one their team is least likely to flag. A jeweller's website that takes eight seconds to load on a 5G iPhone in a Dubai showroom is performing the same trick as a Bentley with a sluggish ignition. The brand may not notice. The buyer will.",
      "Sub-1.2-second LCP on cellular is the floor. We hold ourselves to it. Anything slower says the studio that built the site did not understand that the buyer was reading the load time as evidence.",
    ],
  },
  {
    num: "11",
    title: "Every page has the same hero photograph.",
    symptom: "Skyline + sunset crossfade on the home, about, contact, and 404.",
    body: [
      "Templates ship with one hero. Premium brands need page-specific imagery — a different first frame for the collections page than for the contact page, because the buyer is doing different work in each place.",
      "Reusing the home hero across the site is the visual equivalent of opening every email with 'Dear Sir/Madam.' It signals that the brand could not be bothered to address the visitor where they actually are.",
    ],
  },
  {
    num: "12",
    title: "ChatGPT cannot name your brand when asked about your category.",
    symptom: "Ask Claude for 'the best luxury jewellers in Dubai.' Your name does not appear.",
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
          {SIGNS.map((s, i) => (
            <article
              key={s.num}
              className="grid grid-cols-[60px_1fr] gap-6 md:gap-10 py-12 border-b border-border last:border-b-0"
            >
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                  {s.num}
                </span>
              </div>
              <div>
                <h2 className="display-serif font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] tracking-[-0.02em] max-w-[28ch]">
                  {s.title}
                </h2>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-faint mt-4">
                  — {s.symptom}
                </p>
                <div className="flex flex-col gap-5 mt-8">
                  {s.body.map((p, pi) => (
                    <p
                      key={pi}
                      className="reading-mark text-text-mid text-[17px] leading-[1.85]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
              {i < SIGNS.length - 1 ? null : null}
            </article>
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
