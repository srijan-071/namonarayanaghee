import type { MetadataRoute } from "next";
import { getAllProducts, getAllCollectionSlugs, getAllPageSlugs, getAllBlogPosts } from "@/lib/data";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/blog/namo-narayana-ghee-review`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${base}/a2-ghee-guide`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/bilona-ghee`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/gir-cow-ghee`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/elvish-yadav-ghee`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/our-story`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const products: MetadataRoute.Sitemap = getAllProducts().map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: product.updatedAt || now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const collections: MetadataRoute.Sitemap = getAllCollectionSlugs().map((slug) => ({
    url: `${base}/collections/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const pages: MetadataRoute.Sitemap = getAllPageSlugs().map((slug) => ({
    url: `${base}/pages/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogs: MetadataRoute.Sitemap = getAllBlogPosts()
    .filter((post) => post.slug !== "namo-narayana-ghee-review")
    .map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.publishedAt || now,
      changeFrequency: "monthly",
      priority: 0.75,
    }));

  return [...staticPages, ...products, ...collections, ...pages, ...blogs];
}
