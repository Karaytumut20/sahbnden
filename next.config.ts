import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Build sırasında tip hatalarını görmezden gel
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Resim optimizasyon kotasını doldurmamak için:
    unoptimized: true,
  },
};

export default nextConfig;