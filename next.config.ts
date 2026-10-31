import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Multipart API requests pass through Vinext's server-action body check.
  // The audition handler enforces a tighter 11 MiB total and 5 MiB per file.
  experimental: { serverActions: { bodySizeLimit: "12mb" } },
};

export default nextConfig;
