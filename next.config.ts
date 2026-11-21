import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  // Static export for GitHub Pages; NEXT_PUBLIC_BASE_PATH is set by the Pages workflow.
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
