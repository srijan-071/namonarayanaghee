import type { MetadataRoute } from "next";
import { getAllProductSlugs, getAllCollectionSlugs, getAllPageSlugs, getAllBlogSlugs } from "@/lib/data";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/a2-ghee-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/bilona-ghee`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/gir-cow-ghee`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/our-story`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const products = getAllProductSlugs().map((slug) => ({
    url: `${base}/products/${slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const collections = getAllCollectionSlugs().map((slug) => ({
    url: `${base}/collections/${slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const pages = getAllPageSlugs().map((slug) => ({
    url: `${base}/pages/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const blogs = getAllBlogSlugs().map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...products, ...collections, ...pages, ...blogs];
}
