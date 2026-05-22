const PRINCIPLES = [
  { n: "I",   text: "Craft over speed" },
  { n: "II",  text: "Clarity over cleverness" },
  { n: "III", text: "Silence over noise" },
  { n: "IV",  text: "The whole over the part" },
  { n: "V",   text: "The work, not the studio" },
];

export default function RecognitionStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-6 lg:gap-x-5 py-10">
      {PRINCIPLES.map((p) => (
        <div
          key={p.n}
          className="recognition-mark flex flex-col items-start gap-3 min-w-0"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            {p.n}
          </span>
          <span className="font-serif italic-accent text-2xl lg:text-[22px] xl:text-[26px] leading-[1.15] text-text text-balance">
            {p.text}
          </span>
        </div>
      ))}
    </div>
  );
}
