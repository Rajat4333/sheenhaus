"use client";

import SignatureHero from "@/components/SignatureHero";
import SignsReel from "@/components/SignsReel";
import FieldReport from "@/components/FieldReport";
import ThesesSpread from "@/components/TheseSpread";
import AuditInvite from "@/components/AuditInvite";
import StudioClose from "@/components/StudioClose";

export default function Home() {
  return (
    <main className="theme-clinical" style={{ background: "var(--cl-bg)" }}>
      <SignatureHero />
      <SignsReel />
      <FieldReport />
      <ThesesSpread />
      <AuditInvite />
      <StudioClose />
    </main>
  );
}
