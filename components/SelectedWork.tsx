"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Thesis = {
  num: string;
  slug: string;
  claim: string;
  applies: string;
  label: string;
  swatch: string;
  photo: string;
};

const THESES: Thesis[] = [
  {
    num: "I",
    slug: "slowness",
    claim: "Luxury moves slowly. We build to match.",
    applies: "Jewellery · Hospitality",
    label: "On pace",
    swatch: "linear-gradient(135deg, #2a1f17 0%, #4a3520 50%, #c9a96e 100%)",
    photo:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80&auto=format&fit=crop",
  },
  {
    num: "II",
    slug: "ai-presence",
    claim: "Your next customer is asking ChatGPT, not Google.",
    applies: "Every category",
    label: "On discovery",
    swatch: "linear-gradient(135deg, #0e1a16 0%, #1f3a2c 50%, #2d4a3a 100%)",
    photo:
      "https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=600&q=80&auto=format&fit=crop",
  },
  {
    num: "III",
    slug: "considered-detail",
    claim: "A website is judged by its smallest detail.",
    applies: "Real estate · Property",
    label: "On craft",
    swatch: "linear-gradient(135deg, #1a1612 0%, #2a2218 60%, #6b5a3a 100%)",
    photo:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80&auto=format&fit=crop",
  },
  {
    num: "IV",
    slug: "trust-through-restraint",
    claim: "Trust is built by what you do not say.",
    applies: "Healthcare · Professional",
    label: "On restraint",
    swatch: "linear-gradient(135deg, #14110e 0%, #2a2218 50%, #4a3a2a 100%)",
    photo:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=600&q=80&auto=format&fit=crop",
  },
];

export default function SelectedWork() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Thesis | null>(null);

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
          className="w-full h-full relative"
          style={{ background: active?.swatch ?? "transparent" }}
        >
          {active && (
            <Image
              src={active.photo}
              alt=""
              fill
              sizes="340px"
              className="object-cover"
              style={{
                filter: "grayscale(0.35) contrast(1.05) brightness(0.85)",
              }}
            />
          )}
          {/* Warm bronze wash + bottom-anchored gradient for caption */}
          <div
            className="absolute inset-0 mix-blend-multiply pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(42,31,23,0.25) 0%, rgba(117,88,43,0.18) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(20,17,14,0.9) 0%, rgba(20,17,14,0) 100%)",
            }}
          />
          <div className="relative w-full h-full flex flex-col justify-end p-5">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] whitespace-nowrap" style={{ color: "#a39a8a" }}>
              Thesis {active?.num} · {active?.label}
            </span>
            <span className="font-serif italic text-lg mt-2 leading-tight" style={{ color: "#f0ebe0" }}>
              {active?.claim}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] mt-2 whitespace-nowrap" style={{ color: "#8a7d68" }}>
              {active?.applies}
            </span>
          </div>
        </div>
      </div>

      <div>
        {THESES.map((t) => (
          <Link
            key={t.num}
            href={`/concepts#${t.slug}`}
            className="work-row group"
            onMouseEnter={() => setActive(t)}
            onMouseLeave={() => setActive(null)}
            data-cursor="cta"
            data-cursor-text="Read"
          >
            <span
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-dim"
              style={{ viewTransitionName: `thesis-num-${t.slug}` }}
            >
              {t.num}
            </span>
            <span
              className="font-serif italic-accent text-2xl md:text-[28px] text-text leading-tight transition-colors duration-500 group-hover:text-accent max-w-[24ch]"
              style={{ viewTransitionName: `thesis-claim-${t.slug}` }}
            >
              {t.claim}
            </span>
            <span className="work-meta font-mono text-[11px] uppercase tracking-[0.18em] text-text-mid whitespace-nowrap">
              [{t.applies}]
            </span>
            <span className="font-mono text-[11px] tracking-[0.12em] text-text-dim md:block hidden whitespace-nowrap">
              {t.label}
            </span>
            <span className="font-serif italic text-text-dim md:block hidden text-right transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
