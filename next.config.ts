import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the Turbopack root to this project dir so Vercel doesn't try to
  // resolve a higher ancestor (the multiple-lockfile warning becomes a build
  // error in some environments).
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    // Native browser View Transitions on App Router navigation
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
