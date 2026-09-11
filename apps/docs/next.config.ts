import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@frostui/ui", "@frostui/registry", "frosted-ui"],
  reactStrictMode: true,
};

export default nextConfig;
