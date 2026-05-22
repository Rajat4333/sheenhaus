import Link from "next/link";

type Capability = { label: string; craft?: "Identity" | "Web" | "Editorial" | "AI" };

const CAPABILITIES: Capability[] = [
  { label: "Brand Identity",          craft: "Identity"  },
  { label: "Web Design",              craft: "Web"       },
  { label: "AI Discoverability",      craft: "AI"        },
  { label: "Performance Engineering", craft: "Web"       },
  { label: "Headless CMS",            craft: "Web"       },
  { label: "E-commerce",              craft: "Web"       },
  { label: "Art Direction",           craft: "Identity"  },
  { label: "Motion",                  craft: "Web"       },
  { label: "Editorial Systems",       craft: "Editorial" },
  { label: "Schema & SEO",            craft: "AI"        },
];

export default function CapabilitiesMarquee() {
  const list = [...CAPABILITIES, ...CAPABILITIES];
  return (
    <div
      className="relative overflow-hidden py-10 border-y border-border"
      aria-label="Studio capabilities — hover to pause, click to filter"
    >
      <div className="marquee-track">
        {list.map((c, i) => (
          <Link
            key={`${c.label}-${i}`}
            href={c.craft ? `/concepts?craft=${c.craft}` : "/concepts"}
            data-cursor="hover"
            className="flex items-center font-serif text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-tight text-text px-8 whitespace-nowrap transition-colors duration-500 hover:text-accent"
          >
            <em className="italic-accent">{c.label}</em>
            <span className="mx-10 inline-block w-[14px] h-[14px] rounded-full border border-accent/40" />
          </Link>
        ))}
      </div>
    </div>
  );
}
