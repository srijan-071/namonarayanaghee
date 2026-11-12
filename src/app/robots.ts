import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const disallowedPaths = [
    "/cart",
    "/checkout",
    "/checkout/*",
    "/account",
    "/account/*",
    "/admin",
    "/admin/*",
    "/api/*",
    "/pay-proxy",
    "/pay-proxy/*",
    "/payu-proxy",
    "/payu-proxy/*",
    "/track-order",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      {
        userAgent: "StoreBot-Google",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Google-InspectionTool",
        allow: "/",
      },
    ],
    sitemap: [
      `${siteConfig.url}/sitemap.xml`,
      `${siteConfig.url}/google-shopping-feed.xml`,
    ],
  };
}
