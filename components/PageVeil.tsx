"use client";
import { useEffect, useState } from "react";

export default function PageVeil() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2000);
    return () => clearTimeout(t);
  }, []);
  if (done) return null;
  return <div className="page-veil" aria-hidden="true" />;
}
