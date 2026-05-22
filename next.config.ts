import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
