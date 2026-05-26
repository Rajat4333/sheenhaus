import type { Metadata } from "next";
import { Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import PageVeil from "@/components/PageVeil";
import PageTransition from "@/components/PageTransition";
import FirstVisit from "@/components/FirstVisit";
import ConsoleSignature from "@/components/ConsoleSignature";
import AfterHours from "@/components/AfterHours";
import AmbientAudio from "@/components/AmbientAudio";
import FaviconSwitcher from "@/components/FaviconSwitcher";
import { Analytics } from "@vercel/analytics/next";

// Self-host fonts via Next.js — eliminates render-blocking external CSS,
// auto-preloads, ships only the weights we use.
//   - Instrument Serif: display headlines, italic accents
//   - IBM Plex Mono: small-caps mono labels & captions
// Satoshi (the sans body face) is loaded separately via @import in
// globals.css from Fontshare.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sheenhaus — End-to-end tech for ambitious businesses",
  description:
    "Sheenhaus builds cinematic websites, workflow automation, and AI-native tools — end-to-end for small businesses that refuse to look like everyone else.",
  openGraph: {
    title: "Sheenhaus — End-to-end tech for ambitious businesses",
    description:
      "Cinematic websites, workflow automation, AI-native tools. Hand-coded by a small team for businesses with big ambition.",
    url: "https://sheenhaus.com",
    siteName: "Sheenhaus",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sheenhaus — End-to-end tech for ambitious businesses",
    description:
      "Cinematic websites, workflow automation, AI-native tools — for small businesses with big ambition.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        {/* Warm up TLS to third-party origins we'll call into:
            - Fontshare for the Satoshi body face (render-blocking on first paint)
            - Cal.com so "Book a call" feels instant when clicked
            - Unsplash for the photographic backgrounds in below-fold sections */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cal.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="overflow-x-hidden">
        <PageVeil />
        <PageTransition />
        <FirstVisit />
        <ConsoleSignature />
        <AfterHours />
        <AmbientAudio />
        <FaviconSwitcher />
        <div className="page-rise">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
