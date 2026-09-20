import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [

      {
        protocol: "https",
        hostname: "namonarayana.com",
      },
    ],
  },
};

export default nextConfig;
