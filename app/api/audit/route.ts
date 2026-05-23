// POST /api/audit — given a URL, returns a Sheenhaus Score (0-100) plus a
// per-category breakdown and a list of Twelve Signs the site exhibits.
//
// Two parallel data sources:
//   1. Google PageSpeed Insights API (real Lighthouse score, free up to
//      25k requests/day with an API key, ~25/day unauthenticated)
//   2. Direct HTML fetch + heuristic pattern matching for design signals
//      that Lighthouse cannot detect (popups, stock-photo signals, CMS
//      giveaways, font weight count, ERP-vendor headers, etc.)

import { NextResponse } from "next/server";

// 60-second timeout — PageSpeed can take 30-40s for slow sites
export const maxDuration = 60;

type Category = "performance" | "craft" | "trust" | "discoverability";

type SignHit = {
  num: string;      // "01" .. "12" — matches the slug on /signs
  title: string;    // one-line headline
  category: Category;
  severity: "low" | "medium" | "high";
};

type AuditResult = {
  url: string;
  score: number;                                  // composite 0-100
  scores: Record<Category, number>;               // per-category 0-100
  signs: SignHit[];
  pagespeed: {
    performance: number;                          // 0-100
    accessibility: number;
    seo: number;
    bestPractices: number;
    lcp: number | null;                           // ms
    cls: number | null;
    tbt: number | null;                           // ms
  } | null;
  meta: {
    fetchedAt: string;
    durationMs: number;
    htmlSizeBytes: number;
  };
};

// ─── HTML heuristics ─────────────────────────────────────────────────

const SIGN_DEFINITIONS: Record<
  string,
  Omit<SignHit, "num"> & {
    detect: (html: string, url: URL) => boolean;
  }
> = {
  "01": {
    title: "Built on a template / page-builder stack",
    category: "craft",
    severity: "high",
    detect: (html) => {
      // Explicit attribution
      if (
        /powered by\s+(shopify|wix|wordpress|squarespace|weebly|godaddy|webflow)/i.test(
          html
        )
      ) {
        return true;
      }
      // WordPress signals (across the entire HTML, not just first 8KB)
      const wp =
        /(wp-content\/|wp-includes\/|wp-json|wpb-|tve-|elementor-|woocommerce|\/wp-admin)/i.test(
          html
        );
      // Other major page-builders / template platforms
      const wix = /(_wix|wixstatic|wix-code|static\.parastorage)/i.test(html);
      const sqs = /(squarespace|sqs-block-|sqs-html-content)/i.test(html);
      const shopify = /(cdn\.shopify|shopify\.com\/s\/|shopify-section)/i.test(html);
      // Inline-style overload — a strong "exported from page builder"
      // signal even when no platform string is present (~50+ inline styles
      // is the hand-tweaked-template tell)
      const inlineStyleCount = (html.match(/style\s*=\s*"/g) || []).length;
      const inlineStyleOverload = inlineStyleCount >= 50;
      return wp || wix || sqs || shopify || inlineStyleOverload;
    },
  },
  "02": {
    title: "Popups, modals, or chat widgets at arrival",
    category: "craft",
    severity: "high",
    detect: (html) => {
      // Branded popup / lead-capture vendors (specific platforms = high confidence)
      if (
        /(klaviyo|mailchimp|sumo|optinmonster|privy|justuno|hello\s*bar|wisepops|sleeknote)/i.test(
          html
        )
      ) {
        return true;
      }
      // WhatsApp chat WIDGETS specifically (not bare wa.me contact links
      // — luxury hotels legitimately use WhatsApp for concierge access).
      // We look for chat-widget vendor scripts or the explicit branded
      // floating-button classes that mark a templated install.
      if (
        /(wa-?float|whatsapp[-_\s]?(chat|widget|float|popup)|js\.wati\.io|wachat\.|callbell|chaty)/i.test(
          html
        )
      ) {
        return true;
      }
      // Live-chat widgets (Tawk / Intercom / Crisp / Tidio / Drift / Zendesk)
      if (
        /(tawk\.to|intercom\.com|widget\.intercom|crisp\.chat|tidio\.com|drift\.com|zopim|zdassets)/i.test(
          html
        )
      ) {
        return true;
      }
      // Generic discount popup pattern (modal + offer language)
      if (
        /(popup|modal|newsletter|subscribe).{0,80}(discount|%\s*off|coupon|offer|sale)/i.test(
          html
        )
      ) {
        return true;
      }
      // Multiple "popup" or "modal" containers visible in the markup —
      // not definitive on its own but a strong hint when combined with
      // template/page-builder stacks (which is the common case for
      // poor-quality sites that rely on popups)
      const popupCount =
        (html.match(/\bpopup\b/gi) || []).length +
        (html.match(/\bmodal\b/gi) || []).length;
      return popupCount >= 6;
    },
  },
  "03": {
    title: "Autoplay video in the hero",
    category: "craft",
    severity: "medium",
    detect: (html) => /<video[^>]+autoplay/i.test(html),
  },
  "04": {
    title: "Stock photography from common providers",
    category: "craft",
    severity: "medium",
    detect: (html) =>
      /(unsplash\.com|shutterstock\.com|gettyimages|istockphoto|pexels\.com|pixabay|depositphotos|123rf|dreamstime|adobestock)/i.test(
        html
      ),
  },
  "05": {
    title: "Exposed CMS scaffolding in URLs",
    category: "trust",
    severity: "high",
    detect: (html, url) =>
      /\?id=\d+|\.aspx|\.php(?:\?|"|')|\/wp-content\/|\/wp-includes\//i.test(
        html
      ) || /\.aspx|\.php/.test(url.pathname),
  },
  "06": {
    title: "Too many font weights — type system not under control",
    category: "craft",
    severity: "medium",
    detect: (html) => {
      const weights = new Set<string>();
      for (const m of html.matchAll(/font-weight\s*:\s*(\d{3}|bold|normal)/gi)) {
        weights.add(m[1].toLowerCase());
      }
      for (const m of html.matchAll(
        /font-(thin|light|normal|medium|semibold|bold|extrabold|black)/g
      )) {
        weights.add(m[1]);
      }
      for (const m of html.matchAll(/wght@[\d,;]+/g)) {
        m[0]
          .replace(/wght@/, "")
          .split(/[,;]/)
          .forEach((w) => weights.add(w));
      }
      return weights.size >= 6;
    },
  },
  "07": {
    title: "Bloated contact form (4+ fields)",
    category: "trust",
    severity: "medium",
    detect: (html) => {
      const inputs = (html.match(/<input[^>]*type=/gi) || []).length;
      const textareas = (html.match(/<textarea/gi) || []).length;
      const selects = (html.match(/<select/gi) || []).length;
      return inputs + textareas + selects >= 4;
    },
  },
  "08": {
    title: "Heavy use of 'Solutions' / generic B2B copy",
    category: "trust",
    severity: "low",
    detect: (html) => {
      const visible = html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "");
      const count = (visible.match(/\bsolutions?\b/gi) || []).length;
      return count >= 4;
    },
  },
  "09": {
    title: "Testimonial carousel or homepage hero rotator",
    category: "trust",
    severity: "medium",
    // The carousel library alone is not damning — luxury sites legitimately
    // use sliders for image galleries (Aman, Hermès, Loro Piana all do).
    // What kills premium positioning is:
    //   (a) testimonial / review carousels with star ratings, or
    //   (b) a homepage HERO rotator (slide-1 → slide-2 → slide-3 over
    //       a single static composition would be).
    detect: (html) => {
      const hasCarouselLib =
        /(swiper|slick|owl-?carousel|flexslider|jssor|glide\.js|tiny-?slider|splide)/i.test(
          html
        );
      if (!hasCarouselLib) return false;

      // Testimonials/reviews + star/rating language nearby
      const testimonialReel =
        /(testimonials?|reviews?)/i.test(html) &&
        /(★|⭐|stars?-?\d|rating|five[\s-]star)/i.test(html);

      // Hero rotator — auto-rotating slider sized/positioned as hero
      // (multiple slides + "hero"/"banner" class near the top)
      const head = html.slice(0, 20000);
      const heroRotator =
        /(hero|banner|main-?slider).{0,200}(swiper|slick|owl|carousel)/i.test(
          head
        ) || /(swiper|slick|owl|carousel).{0,200}(hero|banner|main-?slider)/i.test(head);

      return testimonialReel || heroRotator;
    },
  },
  "10": {
    title: "Page loads slowly on cellular",
    category: "performance",
    severity: "high",
    // Detection deferred to PageSpeed LCP — heuristic placeholder
    detect: () => false,
  },
  "11": {
    title: "Same hero photograph reused across pages",
    category: "craft",
    severity: "low",
    // Cannot detect from one fetch — would need to crawl multiple URLs.
    // Placeholder; left as detect = false.
    detect: () => false,
  },
  "12": {
    title: "Missing structured data for AI discoverability",
    category: "discoverability",
    severity: "high",
    detect: (html) =>
      !/<script[^>]+type=["']?application\/ld\+json/i.test(html),
  },
};

function detectSigns(html: string, url: URL): SignHit[] {
  const hits: SignHit[] = [];
  for (const [num, def] of Object.entries(SIGN_DEFINITIONS)) {
    if (def.detect(html, url)) {
      hits.push({
        num,
        title: def.title,
        category: def.category,
        severity: def.severity,
      });
    }
  }
  return hits;
}

// ─── PageSpeed API ──────────────────────────────────────────────────

async function fetchPageSpeed(url: string) {
  const apiKey = process.env.PAGESPEED_API_KEY;
  const params = new URLSearchParams({
    url,
    strategy: "mobile",
    category: "performance",
  });
  // Performance is the heaviest category and what we care about most;
  // accessibility / SEO / best-practices we'll query separately if budget
  // allows but for an MVP we can derive a reasonable score from performance
  // alone + our own checks.
  params.append("category", "accessibility");
  params.append("category", "seo");
  params.append("category", "best-practices");
  if (apiKey) params.set("key", apiKey);

  const psUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`;

  try {
    const res = await fetch(psUrl, {
      signal: AbortSignal.timeout(45_000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const cats = data?.lighthouseResult?.categories ?? {};
    const audits = data?.lighthouseResult?.audits ?? {};

    return {
      performance: Math.round((cats.performance?.score ?? 0) * 100),
      accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
      seo: Math.round((cats.seo?.score ?? 0) * 100),
      bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
      lcp: audits["largest-contentful-paint"]?.numericValue ?? null,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
      tbt: audits["total-blocking-time"]?.numericValue ?? null,
    };
  } catch {
    return null;
  }
}

// ─── HTML fetch ──────────────────────────────────────────────────────

type FetchFailure = {
  reason: "blocked" | "not-found" | "server-error" | "unreachable" | "timeout";
  status?: number;
};

class FetchError extends Error {
  failure: FetchFailure;
  constructor(failure: FetchFailure, message: string) {
    super(message);
    this.failure = failure;
  }
}

async function fetchHtml(url: string) {
  let res: Response;
  try {
    res = await fetch(url, {
      signal: AbortSignal.timeout(15_000),
      headers: {
        // Identify as a regular browser. Many CDN-fronted sites (Cloudflare,
        // Akamai, Cloudfront) block requests with bot-like UAs by default.
        // We still tag /our/ origin in the referer-style suffix so honest
        // operators can identify the audit traffic if they care.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 Sheenhaus-Audit/1.0 (+https://sheenhaus.com/audit)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
    });
  } catch (err) {
    // Distinguish abort/timeout from a true network failure
    const msg = err instanceof Error ? err.message : "";
    if (/timeout|abort/i.test(msg)) {
      throw new FetchError(
        { reason: "timeout" },
        "Site took too long to respond"
      );
    }
    throw new FetchError(
      { reason: "unreachable" },
      "Could not reach the site"
    );
  }
  if (!res.ok) {
    if (res.status === 403 || res.status === 401 || res.status === 429) {
      throw new FetchError(
        { reason: "blocked", status: res.status },
        `Site blocked our request (${res.status})`
      );
    }
    if (res.status === 404 || res.status === 410) {
      throw new FetchError(
        { reason: "not-found", status: res.status },
        `Site returned ${res.status}`
      );
    }
    throw new FetchError(
      { reason: "server-error", status: res.status },
      `Site returned ${res.status}`
    );
  }
  return await res.text();
}

// ─── Scoring ─────────────────────────────────────────────────────────

function computeScores(
  pagespeed: Awaited<ReturnType<typeof fetchPageSpeed>>,
  signs: SignHit[]
): { score: number; scores: Record<Category, number> } {
  // Per-category 0-100; we start at 100 and subtract for hits.
  //
  // Severity weights are deliberately punitive — each "high" sign on a
  // premium site is meant to feel like a real failure, not a hint. A
  // jewellery house with three high-severity craft hits is doing visible
  // damage to its brand; the score should reflect that.

  const W = { high: 35, medium: 22, low: 10 };

  // Craft — design quality, type system, surface details
  const craftHits = signs.filter((s) => s.category === "craft");
  const craft = Math.max(
    0,
    100 - craftHits.reduce((acc, s) => acc + W[s.severity], 0)
  );

  // Trust — contact moment, social proof, exposed plumbing
  const trustHits = signs.filter((s) => s.category === "trust");
  const trust = Math.max(
    0,
    100 - trustHits.reduce((acc, s) => acc + W[s.severity], 0)
  );

  // Performance — from PageSpeed if we have it. If not, we estimate
  // pessimistically: sites with template stacks + popups + multiple
  // font weights are virtually always slow, so we use the craft score
  // as a lower-bound proxy.
  const performance = pagespeed
    ? pagespeed.performance
    : Math.min(70, craft); // honest pessimism when we can't measure

  // Discoverability — PageSpeed SEO blended with our own AI-schema check
  const seoBase = pagespeed?.seo ?? Math.min(70, trust);
  const aiPenalty = signs.find((s) => s.num === "12") ? 35 : 0;
  const discoverability = Math.max(0, seoBase - aiPenalty);

  // Composite: weighted average.
  // Craft + Trust matter most for premium positioning; performance is a
  // hygiene metric; discoverability is the modern differentiator.
  const score = Math.round(
    craft * 0.35 + trust * 0.3 + performance * 0.2 + discoverability * 0.15
  );

  return {
    score,
    scores: { performance, craft, trust, discoverability },
  };
}

// ─── Route handler ───────────────────────────────────────────────────

function normaliseUrl(input: string): URL | null {
  let raw = input.trim();
  if (!raw) return null;

  // Strip stray leading // or :// that some users paste in
  raw = raw.replace(/^(?:\/\/|:\/\/)+/, "");

  // Add a default scheme if none present (so `yourbrand.com` works)
  if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;

  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(u.protocol)) return null;

  // Require something that looks like a real hostname (must contain a dot,
  // unless it's an IPv4/IPv6 — which the SSRF block downstream will catch)
  if (!u.hostname.includes(".") && !/^\[?[\d.:]+\]?$/.test(u.hostname)) {
    return null;
  }

  return u;
}

export async function POST(req: Request) {
  const t0 = Date.now();

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const url = normaliseUrl(body.url ?? "");
  if (!url) {
    return NextResponse.json(
      { error: "Please paste a website URL (e.g. yourbrand.com)" },
      { status: 400 }
    );
  }

  // Block obviously local / internal addresses to prevent SSRF
  const host = url.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
  ) {
    return NextResponse.json(
      { error: "Please audit a public URL" },
      { status: 400 }
    );
  }

  // Self-audit easter egg — when someone tries to score Sheenhaus, return
  // a curated editorial response instead of the actual audit. Confident,
  // not defensive. Keeps the audit positioned as a tool for *other* sites.
  if (
    host === "sheenhaus.com" ||
    host === "www.sheenhaus.com" ||
    host.endsWith(".sheenhaus.com") ||
    // local dev — let the easter egg fire when devs paste localhost:3003
    host.startsWith("localhost") // never actually reached due to SSRF block above,
                                  // but kept for clarity
  ) {
    return NextResponse.json({
      selfReferential: true,
      url: url.toString(),
      message:
        "You are looking at our work. The audit is for the brand you are about to redesign — not the studio that builds it.",
      followUp:
        "Paste the URL of the site that brought you here.",
      aside: "But for the curious, ours is 96. — The Studio.",
    });
  }

  let html: string;
  try {
    html = await fetchHtml(url.toString());
  } catch (err) {
    // FetchError → return a structured "unreachable" payload (200) so the
    // client can render an editorial CTA instead of a terse error string.
    if (err instanceof FetchError) {
      const { reason, status } = err.failure;
      const messages: Record<FetchFailure["reason"], { headline: string; body: string }> = {
        blocked: {
          headline: "This site does not allow our audit through.",
          body:
            "It looks like the site is fronted by a firewall or CDN that blocks automated traffic. Many established brands set this up to protect against scraping. We will need to look at it together to give you an honest score.",
        },
        "not-found": {
          headline: "The page does not exist at that URL.",
          body:
            "Double-check the address and try again, or paste the brand's home page. If you want us to look at the right URL with you, we can do that on a call.",
        },
        "server-error": {
          headline: "The site responded with an error.",
          body: status
            ? `We received an HTTP ${status} from the server. The site is likely between deploys or briefly down. Try again in a moment, or let us look at it with you.`
            : "The site responded with an error. Try again in a moment, or let us look at it with you.",
        },
        unreachable: {
          headline: "We could not reach the site.",
          body:
            "The hostname did not resolve or the connection failed. Check the URL, or if you know the site is live and we are being blocked, book a call and we will run the audit together.",
        },
        timeout: {
          headline: "The site took too long to respond.",
          body:
            "After fifteen seconds, we gave up. This is itself a strong signal — premium buyers will not wait that long either. We can talk through how to bring the load time under one second.",
        },
      };
      const m = messages[reason];
      return NextResponse.json({
        unreachable: true,
        url: url.toString(),
        reason,
        status,
        headline: m.headline,
        body: m.body,
      });
    }
    return NextResponse.json(
      { error: "Could not reach the site. Try again in a moment." },
      { status: 400 }
    );
  }

  const [pagespeed] = await Promise.all([fetchPageSpeed(url.toString())]);
  const signs = detectSigns(html, url);
  const { score, scores } = computeScores(pagespeed, signs);

  const result: AuditResult = {
    url: url.toString(),
    score,
    scores,
    signs,
    pagespeed,
    meta: {
      fetchedAt: new Date().toISOString(),
      durationMs: Date.now() - t0,
      htmlSizeBytes: html.length,
    },
  };

  return NextResponse.json(result);
}
