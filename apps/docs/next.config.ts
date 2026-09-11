import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@frostui/ui", "@frostui/registry"],
};

export default nextConfig;
