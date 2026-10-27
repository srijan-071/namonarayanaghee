import type { Product, Collection, BlogPost, StaticPage } from "./types";
import { RAW_PRODUCTS, RAW_COLLECTIONS, RAW_PAGES, RAW_BLOGS } from "./data-store";
import { PRODUCT_REVIEWS_MAP, PRODUCT_REVIEW_STATS } from "./reviews-data";

// ─── Products ───────────────────────────────────────────
function normaliseProduct(raw: Record<string, unknown>): Product {
  const r = raw as Record<string, unknown>;
  const seo = (r.seo as Record<string, string>) ?? {};
  const handle = (r.handle as string) ?? "";
  const variants = ((r.variants as Record<string, unknown>[]) ?? []).map(
    (v) => ({
      id: v.id as number,
      title: (v.title as string) ?? "",
      price: (v.price as number) ?? 0,
      salePrice: (v.price as number) ?? 0,
      mrp: (v.compare_at_price as number | null) ?? null,
      compareAtPrice: (v.compare_at_price as number | null) ?? null,
      sku: (v.sku as string) ?? "",
      available: (v.available as boolean) ?? true,
      option1: (v.option1 as string | null) ?? null,
      option2: (v.option2 as string | null) ?? null,
      option3: (v.option3 as string | null) ?? null,
    })
  );
  const options = ((r.options as Record<string, unknown>[]) ?? []).map(
    (o) => ({
      name: (o.name as string) ?? "",
      values: (o.values as string[]) ?? [],
    })
  );

  const primarySku = variants.length > 0 ? variants[0].sku : ((r.sku as string) ?? "NMO-GHEE");

  // Determine standard weight and pack size for Google Merchant
  let weightGrams = 1000;
  let packSize = "1 Litre";
  if (handle.includes("500-ml")) {
    weightGrams = 500;
    packSize = "500 ml";
  } else if (handle.includes("2-5-litre")) {
    weightGrams = 2500;
    packSize = "2.5 Litre";
  } else if (handle.includes("5-litre")) {
    weightGrams = 5000;
    packSize = "5 Litre";
  } else if (handle.includes("1-litre")) {
    weightGrams = 1000;
    packSize = "1 Litre";
  }

  const reviewStats = PRODUCT_REVIEW_STATS[handle] || PRODUCT_REVIEW_STATS["pure-desi-cow-ghee-1-litre"] || { total: 1688, average: 4.9 };
  const reviews = PRODUCT_REVIEWS_MAP[handle] || PRODUCT_REVIEWS_MAP["pure-desi-cow-ghee-1-litre"] || [];

  return {
    id: r.id as number,
    slug: handle,
    title: r.title as string,
    description: (r.description as string) ?? "",
    price: (r.price as number) ?? 0,
    compareAtPrice: (r.compare_at_price as number | null) ?? null,
    currency: "INR",
    sku: primarySku,
    gtin: (r.gtin as string) ?? undefined,
    mpn: primarySku,
    packSize,
    weightGrams,
    images: ((r.localImages as string[]) ?? []),
    variants,
    type: (r.type as string) ?? "Ghee",
    vendor: (r.vendor as string) ?? "Namo Narayana",
    tags: (r.tags as string[]) ?? [],
    available: (r.available as boolean) ?? true,
    options,
    rating: {
      value: reviewStats.average,
      count: reviewStats.total,
    },
    reviews: reviews.map((rev) => ({
      ...rev,
      rating: rev.rating || 5,
    })),
    shipping: {
      cost: 0,
      daysMin: 2,
      daysMax: 4,
    },
    returns: {
      days: 30,
    },
    seo: {
      title: seo.title ?? (r.title as string),
      description: seo.description ?? "",
    },
    updatedAt: (r.updated_at as string) ?? (r.published_at as string) ?? (r.created_at as string) ?? undefined,
  };
}

export function getProduct(slug: string): Product | null {
  const raw = RAW_PRODUCTS[slug] || (slug === "pure-a2-gir-cow-ghee-500-ml" ? RAW_PRODUCTS["pure-desi-cow-ghee-500-ml"] : null);
  if (!raw) return null;
  return normaliseProduct(raw);
}

export function getAllProducts(): Product[] {
  return Object.keys(RAW_PRODUCTS)
    .map(getProduct)
    .filter((p): p is Product => p !== null && p.available);
}

export function getAllProductSlugs(): string[] {
  return Object.keys(RAW_PRODUCTS);
}

// ─── Collections ────────────────────────────────────────
export function getCollection(slug: string): Collection | null {
  const raw = RAW_COLLECTIONS[slug];
  if (!raw) return null;
  const seo = (raw.seo as Record<string, string>) ?? {};
  return {
    slug: (raw.handle as string) ?? slug,
    title: slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    description: (raw.description as string) ?? "",
    productSlugs: (raw.productHandles as string[]) ?? [],
    seo: {
      title: seo.title ?? slug,
      description: seo.description ?? "",
    },
  };
}

export function getAllCollections(): Collection[] {
  return Object.keys(RAW_COLLECTIONS)
    .map(getCollection)
    .filter((c): c is Collection => c !== null);
}

export function getAllCollectionSlugs(): string[] {
  return Object.keys(RAW_COLLECTIONS);
}

// ─── Pages ──────────────────────────────────────────────
export function getPage(slug: string): StaticPage | null {
  const raw = RAW_PAGES[slug];
  if (!raw) return null;
  const seo = (raw.seo as Record<string, string>) ?? {};
  return {
    slug: (raw.handle as string) ?? slug,
    title: seo.title ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    content: (raw.content as string) ?? "",
    seo: {
      title: seo.title ?? slug,
      description: seo.description ?? "",
    },
  };
}

export function getAllPageSlugs(): string[] {
  return Object.keys(RAW_PAGES);
}

// ─── Blog ───────────────────────────────────────────────
export function getBlogPost(slug: string): BlogPost | null {
  const raw = RAW_BLOGS[slug];
  if (!raw) return null;
  const seo = (raw.seo as Record<string, string>) ?? {};
  return {
    slug: (raw.handle as string) ?? slug,
    title: seo.title ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    excerpt: "",
    content: (raw.content as string) ?? "",
    publishedAt: "",
    author: "Namo Narayana",
    seo: {
      title: seo.title ?? slug,
      description: seo.description ?? "",
    },
  };
}

export function getAllBlogSlugs(): string[] {
  return Object.keys(RAW_BLOGS);
}

export function getAllBlogPosts(): BlogPost[] {
  return Object.keys(RAW_BLOGS)
    .map(getBlogPost)
    .filter((b): b is BlogPost => b !== null);
}
