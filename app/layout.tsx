import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import PageVeil from "@/components/PageVeil";
import CursorGlow from "@/components/CursorGlow";
import AfterHours from "@/components/AfterHours";
import AmbientAudio from "@/components/AmbientAudio";
import FaviconSwitcher from "@/components/FaviconSwitcher";

export const metadata: Metadata = {
  title: "Sheenhaus — A digital studio for premium brands",
  description:
    "Sheenhaus is a boutique studio crafting digital presence for premium brands. Hand-coded, art-directed, AI-discoverable. Now booking Q3 2026 — serving Mumbai, Dubai, New York, London.",
  openGraph: {
    title: "Sheenhaus — A digital studio for premium brands",
    description:
      "A boutique studio crafting digital presence for premium brands. Hand-coded, art-directed, AI-discoverable.",
    url: "https://sheenhaus.com",
    siteName: "Sheenhaus",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sheenhaus — A digital studio for premium brands",
    description:
      "A boutique studio crafting digital presence for premium brands.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <PageVeil />
        <SmoothScroll />
        <CursorGlow />
        <AfterHours />
        <AmbientAudio />
        <FaviconSwitcher />
        <div className="page-rise">{children}</div>
      </body>
    </html>
  );
}
