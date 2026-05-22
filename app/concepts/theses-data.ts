export type Sector = "Jewellery" | "Hospitality" | "Real Estate" | "Healthcare";
export type Craft  = "Identity" | "Web" | "Editorial" | "AI";

export type Thesis = {
  num: string;
  slug: string;
  claim: string;
  applies: string;
  sectors: Sector[];
  crafts: Craft[];
  body: string[];
  practice: string[];
  swatch: string;        // gradient fallback (cinematic colour identity)
  photo: string;         // Unsplash URL (commercial license, no attribution required)
  photoAlt: string;      // accessible alt text
};

export const SECTORS: Sector[] = ["Jewellery", "Hospitality", "Real Estate", "Healthcare"];
export const CRAFTS:  Craft[]  = ["Identity", "Web", "Editorial", "AI"];

export const THESES: Thesis[] = [
  {
    num: "I",
    slug: "slowness",
    claim: "Luxury moves slowly. We build to match.",
    applies: "Jewellery, hospitality, heritage retail",
    sectors: ["Jewellery", "Hospitality"],
    crafts: ["Identity", "Web", "Editorial"],
    body: [
      "The dominant grammar of the web is urgency. Pop-ups, autoplay video, social proof tickers, countdown timers, scroll-jacking — all of it engineered to compress attention into transaction. It works for direct-to-consumer commerce. It does not work for businesses whose value proposition is the opposite of urgency.",
      "A jewellery house has spent four generations earning the right to be unhurried. A heritage hotel offers, above all else, the absence of haste. Their websites should be the same kind of artefact — slow to load on purpose, slow to reveal, slow to ask anything of the visitor. The site should feel like walking into the showroom, not like being chased through it.",
      "This is harder than it looks. Slow is not the same as empty. Restraint is not the same as minimalism. A slow website still has to do work — surface the right object at the right moment, hold the visitor's attention long enough for them to feel something. We design for that interval.",
    ],
    practice: [
      "No popups, no autoplay video, no exit-intent modals",
      "Page load resolves at paint-ready, not on a fixed timer",
      "Hover states use 600ms transitions, not 200ms",
      "Image reveals as the visitor scrolls — never before they arrive",
    ],
    swatch: "linear-gradient(135deg, #2a1f17 0%, #4a3520 50%, #c9a96e 100%)",
    // Macro of warm metalwork — slow, hand-finished, heritage
    photo:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&q=85&auto=format&fit=crop",
    photoAlt: "Hand-finished gold detail catching low light",
  },
  {
    num: "II",
    slug: "ai-presence",
    claim: "Your next customer is asking ChatGPT, not Google.",
    applies: "Every category, increasingly",
    sectors: ["Jewellery", "Hospitality", "Real Estate", "Healthcare"],
    crafts: ["AI", "Editorial", "Web"],
    body: [
      "In 2024 the first major shift began. In 2026 it is no longer a shift — it is the baseline. When a high-net-worth prospect researches a new jeweller, a private surgeon, a Maldives resort, or a Manhattan developer, they ask a model first. They ask Claude, ChatGPT, Gemini, Perplexity. They get a confident answer. They evaluate three names from that answer. They never visit a search result page.",
      "Almost no studio is engineering for this shift. The discipline that exists — \"AI visibility\" — is mostly speculation packaged as service. We have spent two years figuring out what actually works: structured data the models can parse, content patterns the models reward, citations the models surface, and the disciplined absence of patterns the models penalise.",
      "We do not promise rankings. Nobody who is honest about the field can. We promise to do the work, measure it, and tell you the truth about what moved. It is, today, the most important technical investment a premium brand can make in its digital presence.",
    ],
    practice: [
      "Schema markup written for AI consumption, not Google",
      "Content structured as direct claims, not marketing copy",
      "Quarterly visibility reports against named competitors",
      "Editorial that earns model citations through utility",
    ],
    swatch: "linear-gradient(135deg, #0e1a16 0%, #1f3a2c 50%, #2d4a3a 100%)",
    // Architectural shadow geometry — the structure of information
    photo:
      "https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=1600&q=85&auto=format&fit=crop",
    photoAlt: "Architectural light and shadow geometry on warm stone",
  },
  {
    num: "III",
    slug: "considered-detail",
    claim: "A website is judged by its smallest detail.",
    applies: "Real estate, property, considered purchases",
    sectors: ["Real Estate", "Jewellery"],
    crafts: ["Web", "Identity"],
    body: [
      "Premium buyers are pattern recognisers. They have spent decades learning to read the difference between a hand-finished joint and a machine-cut one, between a paper that knows what it is and a paper that is pretending. The same instinct does not switch off when they open a browser.",
      "When a serious buyer arrives at the website of a developer selling a fifteen-crore apartment, they are not reading the copy. They are reading the line-height. They are reading whether the heading tracks too tight. They are reading the kerning of the developer's logo against the city skyline behind it. They are reading whether the page loads at the speed of confidence.",
      "Most agencies do not know to care about this. They build websites the way fast-fashion brands build stores — for the average visitor. Premium buyers are not the average visitor. They are not buying the website. They are buying the evidence that the developer would build their apartment with the same care.",
    ],
    practice: [
      "Custom typography crafted for the brand, not loaded from a service",
      "Every margin and gap audited by eye, not by token",
      "Performance budget held to sub-1.2s LCP on cellular",
      "Hover, focus, and motion states designed as deliberately as static",
    ],
    swatch: "linear-gradient(135deg, #1a1612 0%, #2a2218 60%, #6b5a3a 100%)",
    // Interior detail — quiet luxury, considered material
    photo:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85&auto=format&fit=crop",
    photoAlt: "Considered interior — warm surfaces, restrained palette",
  },
  {
    num: "IV",
    slug: "trust-through-restraint",
    claim: "Trust is built by what you do not say.",
    applies: "Private healthcare, professional services, high-trust categories",
    sectors: ["Healthcare"],
    crafts: ["Identity", "Editorial", "Web"],
    body: [
      "A surgeon's website that lists ten procedures, twelve testimonials, three certifications, and a price range loses every patient who can afford to be selective. The category-leader does the opposite. They list less, claim less, decorate less. The visitor leaves with the feeling that the practice does not need to convince them.",
      "This is counter-intuitive to most agencies. They have been trained to maximise: more services, more case studies, more social proof, more reasons to call. Maximising works in low-trust categories. In high-trust categories — surgery, private banking, family offices, legal counsel — every additional claim costs you trust, because every claim becomes one more thing the visitor has to verify.",
      "Our job, when we build for these categories, is to identify the smallest credible site. The fewest words. The most editorial restraint. The clearest signal that the practitioner is selecting their patients, not the other way around.",
    ],
    practice: [
      "Outcomes presented as case studies, never as testimonials",
      "No price disclosure, no public booking — only deliberate enquiry",
      "Single-page architectures over multi-page menus where possible",
      "Photography that implies expertise without performing it",
    ],
    swatch: "linear-gradient(135deg, #14110e 0%, #2a2218 50%, #4a3a2a 100%)",
    // Quiet, considered medical/clinical space — restraint as competence
    photo:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1600&q=85&auto=format&fit=crop",
    photoAlt: "Light falling across a quiet, considered interior",
  },
];
