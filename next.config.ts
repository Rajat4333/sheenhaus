import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the Turbopack root to this project dir so Vercel doesn't try to
  // resolve a higher ancestor (multiple lockfiles in the tree).
  // process.cwd() is reliable in both CJS and ESM contexts; __dirname is not.
  turbopack: {
    root: process.cwd(),
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
