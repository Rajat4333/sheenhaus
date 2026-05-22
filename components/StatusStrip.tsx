export default function StatusStrip() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 py-7 border-y border-border">
      <div className="flex items-center gap-3">
        <span className="relative inline-flex">
          <span className="w-[7px] h-[7px] rounded-full bg-accent" />
          <span className="absolute inset-0 w-[7px] h-[7px] rounded-full bg-accent animate-ping opacity-50" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-mid">
          Accepting briefs
        </span>
        <span className="font-serif italic-accent text-text text-lg leading-none">
          First engagement of 2026
        </span>
      </div>
      <span className="hidden md:block w-px h-4 bg-border" />
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">
        Founding-client pricing through Q4
      </span>
      <span className="hidden md:block w-px h-4 bg-border" />
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim whitespace-nowrap">
        Mumbai · Dubai · New York · London
      </span>
    </div>
  );
}
