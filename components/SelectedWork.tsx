"use client";
import { useRef, useState } from "react";

type Concept = {
  num: string;
  name: string;
  sector: string;
  year: string;
  note?: string;
  swatch: string;
};

const CONCEPTS: Concept[] = [
  {
    num: "001",
    name: "A Jewellery House",
    sector: "Luxury Retail · Dubai",
    year: "2026",
    note: "Concept",
    swatch: "linear-gradient(135deg, #2a1f17 0%, #4a3520 50%, #c9a96e 100%)",
  },
  {
    num: "002",
    name: "A Boutique Hotel",
    sector: "Hospitality · Maldives",
    year: "2026",
    note: "Concept",
    swatch: "linear-gradient(135deg, #0e1a16 0%, #1f3a2c 50%, #2d4a3a 100%)",
  },
  {
    num: "003",
    name: "A Real Estate Group",
    sector: "Premium Property · New York",
    year: "2026",
    note: "Concept",
    swatch: "linear-gradient(135deg, #1a1612 0%, #2a2218 60%, #6b5a3a 100%)",
  },
  {
    num: "004",
    name: "A Surgical Practice",
    sector: "Private Healthcare · Bangalore",
    year: "2026",
    note: "Concept",
    swatch: "linear-gradient(135deg, #14110e 0%, #2a2218 50%, #4a3a2a 100%)",
  },
];

export default function SelectedWork() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Concept | null>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!previewRef.current) return;
    previewRef.current.style.left = `${e.clientX + 180}px`;
    previewRef.current.style.top = `${e.clientY}px`;
  };

  return (
    <div onMouseMove={onMove}>
      <div
        ref={previewRef}
        className="work-preview"
        data-show={active ? "true" : "false"}
        aria-hidden="true"
      >
        <div
          className="w-full h-full"
          style={{ background: active?.swatch ?? "transparent" }}
        >
          <div className="w-full h-full flex flex-col justify-end p-5 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-mid">
              {active?.year} · {active?.note}
            </span>
            <span className="font-serif text-lg text-text mt-1 leading-tight">
              {active?.name}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim mt-1">
              {active?.sector}
            </span>
          </div>
        </div>
      </div>

      <div>
        {CONCEPTS.map((c) => (
          <div
            key={c.num}
            className="work-row group"
            onMouseEnter={() => setActive(c)}
            onMouseLeave={() => setActive(null)}
            data-cursor="hover"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-dim">
              {c.num}
            </span>
            <span className="font-serif text-2xl md:text-3xl text-text leading-none transition-colors duration-500 group-hover:text-accent">
              {c.name}
            </span>
            <span className="work-meta font-mono text-[11px] uppercase tracking-[0.18em] text-text-mid">
              {c.sector}
              {c.note && (
                <span className="ml-3 text-accent">· {c.note}</span>
              )}
            </span>
            <span className="font-mono text-[11px] tracking-[0.12em] text-text-dim md:block hidden">
              {c.year}
            </span>
            <span className="font-serif italic text-text-dim md:block hidden text-right">
              →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
