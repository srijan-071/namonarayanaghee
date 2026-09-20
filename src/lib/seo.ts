import { Metadata } from "next";
import { siteConfig } from "./config";
import { Product, Collection, BlogPost, StaticPage } from "./types";

/**
 * Helper to generate consistent absolute URLs
 */
export function absoluteUrl(path: string) {
  return `${siteConfig.url}${path}`;
}

/**
 * Shared Open Graph & Twitter data
 */
function getSharedOpenGraph(
  title: string,
  description: string,
  url: string,
  image?: string
) {
  const images = image
    ? [{ url: absoluteUrl(image), width: 1200, height: 630, alt: title }]
    : [
      {
        url: absoluteUrl("/assets/hero-new-cows.jpg"), // Using our main farm image as fallback
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ];

  return {
    title,
    description,
    url,
    images,
    siteName: siteConfig.name,
  };
}

/**
 * Generate metadata for a Product Page
 */
export function generateProductMetadata(product: Product): Metadata {
  const title = product.seo?.title || `${product.title} | ${siteConfig.name}`;
  const description = product.seo?.description || product.description || siteConfig.description;
  const url = absoluteUrl(`/products/${product.slug}`);
  const image = product.images?.[0];

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...getSharedOpenGraph(title, description, url, image),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [absoluteUrl(image)] : undefined,
    },
  };
}

/**
 * Generate metadata for a Collection Page
 */
export function generateCollectionMetadata(collection: Collection): Metadata {
  const title = collection.seo?.title || `${collection.title} | ${siteConfig.name}`;
  const description = collection.seo?.description || collection.description || siteConfig.description;
  const url = absoluteUrl(`/collections/${collection.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...getSharedOpenGraph(title, description, url, collection.image),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: collection.image ? [absoluteUrl(collection.image)] : undefined,
    },
  };
}

/**
 * Generate metadata for a Blog Post
 */
export function generateArticleMetadata(article: BlogPost): Metadata {
  const title = article.seo?.title || `${article.title} | ${siteConfig.name}`;
  const description = article.seo?.description || article.excerpt || siteConfig.description;
  const url = absoluteUrl(`/blog/${article.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...getSharedOpenGraph(title, description, url, article.image),
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.image ? [absoluteUrl(article.image)] : undefined,
    },
  };
}

/**
 * Generate metadata for a Static Page
 */
export function generatePageMetadata(page: StaticPage, routePrefix: string = "pages"): Metadata {
  const title = page.seo?.title || `${page.title} | ${siteConfig.name}`;
  const description = page.seo?.description || siteConfig.description;
  const url = absoluteUrl(routePrefix ? `/${routePrefix}/${page.slug}` : `/${page.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...getSharedOpenGraph(title, description, url),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
