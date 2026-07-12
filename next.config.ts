import createMDX from "@next/mdx";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  experimental: {
    mdxRs: true,
    viewTransition: true,
  },
  images: {
    // Cloudflare Workers serves images directly; skip Next's Image
    // Optimization API (which would otherwise require the Cloudflare
    // Images product) to keep the deployment simple.
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "www.google.com",
      },
    ],
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);

// Enables getCloudflareContext() (bindings/env) during `next dev` only.
// Guarded so it never spins up workerd during `next build`.
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}
