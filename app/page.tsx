// Server component — only the above-the-fold SignatureHero ships
// in the initial bundle. The five below-the-fold sections are code-
// split via next/dynamic and stream in as the visitor scrolls past
// the hero. Big win on first paint / TTI.

import dynamic from "next/dynamic";
import SignatureHero from "@/components/SignatureHero";

const FieldReport    = dynamic(() => import("@/components/FieldReport"));
const ThesesSpread   = dynamic(() => import("@/components/TheseSpread"));
const Services       = dynamic(() => import("@/components/Services"));
const ProcessDiagram = dynamic(() => import("@/components/ProcessDiagram"));
const AuditInvite    = dynamic(() => import("@/components/AuditInvite"));
const StudioClose    = dynamic(() => import("@/components/StudioClose"));

export default function Home() {
  return (
    <main className="theme-clinical" style={{ background: "var(--cl-bg)" }}>
      <SignatureHero />
      <ProcessDiagram />
      <ThesesSpread />
      <FieldReport />
      <Services />
      <AuditInvite />
      <StudioClose />
    </main>
  );
}
