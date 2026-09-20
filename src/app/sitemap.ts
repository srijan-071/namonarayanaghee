import type { MetadataRoute } from "next";
import { getAllProducts, getAllProductSlugs, getAllCollectionSlugs, getAllPageSlugs, getAllBlogSlugs } from "@/lib/data";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now },
    { url: `${base}/blog`, lastModified: now },
    { url: `${base}/a2-ghee-guide`, lastModified: now },
    { url: `${base}/bilona-ghee`, lastModified: now },
    { url: `${base}/gir-cow-ghee`, lastModified: now },
    { url: `${base}/our-story`, lastModified: now },
  ];

  const products = getAllProducts().map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: product.updatedAt || now,
  }));

  const collections = getAllCollectionSlugs().map((slug) => ({
    url: `${base}/collections/${slug}`,
    lastModified: now
  }));

  const pages = getAllPageSlugs().map((slug) => ({
    url: `${base}/pages/${slug}`,
    lastModified: now
  }));

  const blogs = getAllBlogSlugs().map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now
  }));

  return [...staticPages, ...products, ...collections, ...pages, ...blogs];
}
