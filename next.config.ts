import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow importing large JSON data files
  experimental: {},
  // Image optimization
  images: {
    remotePatterns: [],
    unoptimized: true, // for static export compatibility
  },
  // Trailing slash for cleaner URLs
  trailingSlash: false,
};

export default nextConfig;
