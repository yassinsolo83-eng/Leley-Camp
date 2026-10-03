import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity's CDN resizes images itself, so we skip Vercel's image optimizer.
    loader: "custom",
    loaderFile: "./lib/sanity/imageLoader.ts",
  },
  async rewrites() {
    // Sanity Studio lives in app/studio/page.tsx (no catch-all folder),
    // so every deeper Studio URL is sent to that one page.
    return [{ source: "/studio/:path+", destination: "/studio" }];
  },
};

export default nextConfig;
