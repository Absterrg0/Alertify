import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['utfs.io'], // Add 'utfs.io' here to allow images from this domain
  },
};

export default nextConfig;
