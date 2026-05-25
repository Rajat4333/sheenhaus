"use client";
import { useEffect, useState } from "react";

/**
 * Between local midnight and 6am, the page enters a "after-hours" state:
 *   - Body gets a subtle warmer overlay
 *   - A small indicator appears bottom-right ("Studio · After Hours")
 *
 * Premium luxury cue. No animation, no spectacle. Tiny detail that the
 * right client notices.
 */
export default function AfterHours() {
  const [isAfterHours, setIsAfterHours] = useState(false);

  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      setIsAfterHours(h >= 0 && h < 6);
    };
    check();
    // Re-check every 5 minutes so the state flips on its own at 6am
    const id = setInterval(check, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.hours = isAfterHours ? "after" : "day";
  }, [isAfterHours]);

  if (!isAfterHours) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-30 pointer-events-none flex items-center gap-2 px-3 py-2 rounded-full"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 4px 24px -8px rgba(0,0,0,0.08)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full opacity-80"
        style={{ background: "#8a6a35" }}
      />
      <span
        className="text-[9px] uppercase tracking-[0.22em] whitespace-nowrap"
        style={{
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          color: "#555",
        }}
      >
        Studio · After Hours
      </span>
    </div>
  );
}
