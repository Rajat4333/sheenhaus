import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sheenhaus — We make premium brands look premium online",
  description: "Sheenhaus transforms premium brands' digital presence. Hand-coded websites, AI discoverability, 3-week delivery. Serving clients across US, UAE, Europe & India.",
  openGraph: {
    title: "Sheenhaus — We make premium brands look premium online",
    description: "We transform premium brands' digital presence. Hand-coded websites, AI discoverability, 3-week delivery.",
    url: "https://sheenhaus.com",
    siteName: "Sheenhaus",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sheenhaus — Premium Digital Presence",
    description: "We make premium brands look premium online.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
