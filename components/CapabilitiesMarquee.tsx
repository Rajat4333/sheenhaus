const CAPABILITIES = [
  "Brand Identity",
  "Web Design",
  "AI Discoverability",
  "Performance Engineering",
  "Headless CMS",
  "E-commerce",
  "Art Direction",
  "Motion",
  "Editorial Systems",
  "Schema & SEO",
];

export default function CapabilitiesMarquee() {
  const list = [...CAPABILITIES, ...CAPABILITIES];
  return (
    <div
      className="relative overflow-hidden py-10 border-y border-border"
      aria-hidden="true"
    >
      <div className="marquee-track">
        {list.map((c, i) => (
          <span
            key={`${c}-${i}`}
            className="flex items-center font-serif text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-tight text-text px-8 whitespace-nowrap"
          >
            <em className="italic-accent text-accent">{c}</em>
            <span className="mx-10 inline-block w-[14px] h-[14px] rounded-full border border-accent/40" />
          </span>
        ))}
      </div>
    </div>
  );
}
