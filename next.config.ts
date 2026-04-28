import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  // Sanity Studio 패키지 트랜스파일 (Turbopack 호환성)
  transpilePackages: ['sanity', '@sanity/ui', '@sanity/icons', 'next-sanity'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;
