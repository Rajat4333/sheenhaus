"use client";
import { useEffect, useState } from "react";

export default function PageVeil() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Total intro: wordmark fade-in + hold + wordmark out + veil lift = ~2.5s
    const t = setTimeout(() => setDone(true), 2800);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div className="page-veil" aria-hidden="true">
      <span className="page-veil-mark font-serif">
        Sheen<em>haus</em>
      </span>
    </div>
  );
}
