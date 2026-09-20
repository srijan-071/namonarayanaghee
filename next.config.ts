import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
