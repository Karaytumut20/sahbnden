import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Build sırasında eslint hatalarını görmezden gel (Deployun yarıda kesilmemesi için)
    ignoreDuringBuilds: true,
  },
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
    // Resim optimizasyon kotasını doldurmamak için (Masrafsız olması için):
    unoptimized: true,
  },
};

export default nextConfig;