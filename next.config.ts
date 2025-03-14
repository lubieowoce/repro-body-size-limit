"use client";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "1.5mb" },
  },
};

export default nextConfig;
