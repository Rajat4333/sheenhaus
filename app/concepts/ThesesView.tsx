"use client";
import { useMemo, useState } from "react";
import { THESES, SECTORS, CRAFTS, type Sector, type Craft } from "./theses-data";
import Plate from "./Plate";

type PlateSlug = "slowness" | "ai-presence" | "considered-detail" | "trust-through-restraint";
const PLATE_SLUGS: readonly PlateSlug[] = ["slowness", "ai-presence", "considered-detail", "trust-through-restraint"];
const isPlateSlug = (s: string): s is PlateSlug => (PLATE_SLUGS as readonly string[]).includes(s);

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

                {/* Concept Plate — bespoke generative visual instead of
                    a treated stock photograph. Sign 04 calls out stock
                    photography; the studio refuses to use it itself. */}
                <div className="mt-16">
                  {isPlateSlug(t.slug) ? (
                    <Plate slug={t.slug} />
                  ) : (
                    // Defensive fallback for any future thesis without a Plate yet
                    <div
                      className="relative w-full aspect-[16/9] rounded-sm flex items-center justify-center"
                      style={{
                        background: t.swatch,
                        border: "1px solid var(--cl-stroke)",
                      }}
                    >
                      <span
                        className="font-serif italic text-2xl text-text-mid"
                      >
                        {t.claim}
                      </span>
                    </div>
                  )}
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
