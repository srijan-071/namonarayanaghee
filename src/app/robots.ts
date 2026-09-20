import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/cart", "/search", "/account", "/wishlist"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
