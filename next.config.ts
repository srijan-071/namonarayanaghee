import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "namonarayana.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "sonner"],
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/collections/oils",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/collections/organic-oils",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/collections/honey",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/collections/natural-sweeteners",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/collections/flours",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/collections/pure-ghee-honey",
        destination: "/collections/ghee",
        permanent: false,
      },
      {
        source: "/products/coconut-oil",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/products/black-mustard-oil",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/products/yellow-mustard-oil",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/products/rogan-badam-oil",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/products/honey",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/products/jaggery-powder",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/products/khapli-atta",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/products/multi-grain-atta",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/products/besan",
        destination: "/collections/all-products",
        permanent: false,
      },
      {
        source: "/products/pickle",
        destination: "/collections/all-products",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
