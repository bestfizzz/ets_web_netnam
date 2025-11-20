import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
        root: path.join(__dirname, '/'), // force correct root
  },
  eslint: {
    ignoreDuringBuilds: true, // optional
  },
  // output:'standalone', // Docker
  outputFileTracingRoot: path.join(__dirname, '/')
};

export default nextConfig;
