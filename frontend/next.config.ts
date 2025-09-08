import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost'], // Add your domain here
    unoptimized: false,
  },
};

export default nextConfig;
