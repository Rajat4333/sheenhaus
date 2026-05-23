"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { THESES, SECTORS, CRAFTS, type Sector, type Craft } from "./theses-data";

function readInitial<T extends string>(
  key: string,
  allowed: readonly T[]
): T | null {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get(key);
  return v && (allowed as readonly string[]).includes(v) ? (v as T) : null;
}

export default function ThesesView() {
  // Lazy initializers read the URL once on mount — SSR-safe, no setState in effect
  const [sector, setSector] = useState<Sector | null>(() =>
    readInitial("sector", SECTORS)
  );
  const [craft, setCraft] = useState<Craft | null>(() =>
    readInitial("craft", CRAFTS)
  );

  const filtered = useMemo(() => {
    return THESES.filter((t) => {
      if (sector && !t.sectors.includes(sector)) return false;
      if (craft  && !t.crafts.includes(craft))   return false;
      return true;
    });
  }, [sector, craft]);

  return (
    <>
      {/* Filter row */}
      <div className="shell pt-2 pb-12">
        <div className="grid md:grid-cols-[1fr_1fr_auto] gap-y-6 gap-x-10 items-baseline border-y border-border py-6">
          {/* Sector axis */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-faint w-16 whitespace-nowrap">
              Sector
            </span>
            <FilterChip
              label="All"
              active={sector === null}
              onClick={() => setSector(null)}
            />
            {SECTORS.map((s) => (
              <FilterChip
                key={s}
                label={s}
                active={sector === s}
                onClick={() => setSector(sector === s ? null : s)}
              />
            ))}
          </div>

          {/* Craft axis */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-faint w-16 whitespace-nowrap">
              Craft
            </span>
            <FilterChip
              label="All"
              active={craft === null}
              onClick={() => setCraft(null)}
            />
            {CRAFTS.map((c) => (
              <FilterChip
                key={c}
                label={c}
                active={craft === c}
                onClick={() => setCraft(craft === c ? null : c)}
              />
            ))}
          </div>

          {/* Count */}
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-mid whitespace-nowrap">
            {String(filtered.length).padStart(2, "0")} / {String(THESES.length).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Theses */}
      {filtered.length === 0 ? (
        <section className="relative z-10 shell section-pad text-center">
          <p className="font-serif italic-accent text-2xl text-text-mid max-w-2xl mx-auto leading-snug">
            No thesis matches that combination yet.
            <br />
            Try a different pairing, or read all four.
          </p>
        </section>
      ) : (
        filtered.map((t, i) => (
          <section
            key={t.slug}
            id={t.slug}
            className="relative z-10 shell section-pad scroll-mt-24"
          >
            <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20 items-start">
              {/* Left meta column */}
              <div className="flex flex-col gap-4 lg:sticky lg:top-32">
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent whitespace-nowrap"
                  style={{ viewTransitionName: `thesis-num-${t.slug}` }}
                >
                  Thesis {t.num}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mid">
                  {t.applies}
                </span>
                <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                  {t.sectors.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim"
                    >
                      [{s}]
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim whitespace-nowrap mt-2">
                  Position · 2026
                </span>
              </div>

              {/* Right content column */}
              <div>
                <h2
                  className="display-serif font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1] tracking-[-0.025em] max-w-[22ch]"
                  style={{ viewTransitionName: `thesis-claim-${t.slug}` }}
                >
                  {t.claim}
                </h2>

                {/* Essay */}
                <div className="mt-12 max-w-2xl flex flex-col gap-7">
                  {t.body.map((p, pi) => (
                    <p
                      key={pi}
                      className="reading-mark text-text-mid text-[17px] leading-[1.85]"
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {/* Concept visual — real photograph, treated */}
                <div
                  className="relative w-full aspect-[16/9] mt-16 overflow-hidden rounded-sm"
                  style={{
                    background: t.swatch,
                    boxShadow: "0 30px 80px -20px rgba(26, 22, 18, 0.18)",
                  }}
                >
                  <Image
                    src={t.photo}
                    alt={t.photoAlt}
                    fill
                    sizes="(min-width: 1024px) 65vw, 100vw"
                    className="object-cover"
                    style={{
                      filter: "grayscale(0.35) contrast(1.05) brightness(0.92)",
                    }}
                  />
                  {/* Warm bronze wash — ties photography to palette */}
                  <div
                    className="absolute inset-0 mix-blend-multiply pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(42,31,23,0.25) 0%, rgba(117,88,43,0.18) 100%)",
                    }}
                  />
                  {/* Subtle film grain */}
                  <div
                    className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.5'/%3E%3C/svg%3E\")",
                    }}
                  />
                  {/* Bottom gradient anchors the caption */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(20,17,14,0.85) 0%, rgba(20,17,14,0) 100%)",
                    }}
                  />
                  <div className="absolute inset-0 flex items-end p-10">
                    <span
                      className="font-serif italic text-2xl md:text-3xl tracking-[-0.02em] max-w-[20ch] leading-tight"
                      style={{ color: "#f0ebe0" }}
                    >
                      {t.claim}
                    </span>
                  </div>
                </div>

                {/* Practice list */}
                <div className="mt-16 border-t border-border">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent block mt-6 mb-2 whitespace-nowrap">
                    In Practice
                  </span>
                  <ul className="divide-y divide-border">
                    {t.practice.map((n, ni) => (
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

            {i < filtered.length - 1 && (
              <div className="mt-32 hairline" />
            )}
          </section>
        ))
      )}
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-500 ${
        active
          ? "text-accent"
          : "text-text-dim hover:text-text"
      }`}
    >
      {active ? `[${label}]` : label}
    </button>
  );
}
