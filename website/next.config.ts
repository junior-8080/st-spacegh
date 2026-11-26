import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Blog cover URLs are entered in the admin and facility photos live on Cloudflare R2,
    // so any HTTPS host is allowed.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
