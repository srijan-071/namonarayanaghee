import type { MetadataRoute } from "next";
import { getAllProducts, getAllProductSlugs, getAllCollectionSlugs, getAllPageSlugs, getAllBlogSlugs } from "@/lib/data";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base },
    { url: `${base}/blog` },
    { url: `${base}/a2-ghee-guide` },
    { url: `${base}/bilona-ghee` },
    { url: `${base}/gir-cow-ghee` },
    { url: `${base}/our-story` },
    { url: `${base}/elvish-yadav-ghee` },
  ];

  const products = getAllProducts().map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: product.updatedAt,
  }));

  const collections = getAllCollectionSlugs().map((slug) => ({
    url: `${base}/collections/${slug}`,
  }));

  const pages = getAllPageSlugs().map((slug) => ({
    url: `${base}/pages/${slug}`,
  }));

  const blogs = getAllBlogSlugs().map((slug) => ({
    url: `${base}/blog/${slug}`,
  }));

  return [...staticPages, ...products, ...collections, ...pages, ...blogs];
}
