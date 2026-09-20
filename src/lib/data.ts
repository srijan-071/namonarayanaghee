import fs from "fs";
import path from "path";
import type { Product, Collection, BlogPost, StaticPage } from "./types";

const dataDir = path.join(process.cwd(), "data");

function readJSON<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

function listSlugs(dir: string): string[] {
  const full = path.join(dataDir, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

// ─── Products ───────────────────────────────────────────
function normaliseProduct(raw: Record<string, unknown>): Product {
  const r = raw as Record<string, unknown>;
  const seo = (r.seo as Record<string, string>) ?? {};
  const variants = ((r.variants as Record<string, unknown>[]) ?? []).map(
    (v) => ({
      id: v.id as number,
      title: (v.title as string) ?? "",
      price: (v.price as number) ?? 0,
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

  return {
    id: r.id as number,
    slug: r.handle as string,
    title: r.title as string,
    description: (r.description as string) ?? "",
    price: (r.price as number) ?? 0,
    compareAtPrice: (r.compare_at_price as number | null) ?? null,
    currency: "INR",
    sku: variants.length > 0 ? variants[0].sku : ((r.sku as string) ?? ""),
    gtin: (r.gtin as string) ?? undefined,
    mpn: (r.mpn as string) ?? undefined,
    packSize: (r.packSize as string) ?? undefined,
    weightGrams: (r.weightGrams as number) ?? undefined,
    images: ((r.localImages as string[]) ?? []),
    variants,
    type: (r.type as string) ?? "",
    vendor: (r.vendor as string) ?? "",
    tags: (r.tags as string[]) ?? [],
    available: (r.available as boolean) ?? true,
    options,
    rating: (r.rating as { value: number; count: number }) ?? undefined,
    reviews: (r.reviews as import('./types').Review[]) ?? undefined,
    seo: {
      title: seo.title ?? (r.title as string),
      description: seo.description ?? "",
    },
  };
}

export function getProduct(slug: string): Product | null {
  const raw = readJSON<Record<string, unknown>>(
    path.join(dataDir, "products", `${slug}.json`)
  );
  if (!raw) return null;
  return normaliseProduct(raw);
}

export function getAllProducts(): Product[] {
  return listSlugs("products")
    .map(getProduct)
    .filter((p): p is Product => p !== null);
}

export function getAllProductSlugs(): string[] {
  return listSlugs("products");
}

// ─── Collections ────────────────────────────────────────
export function getCollection(slug: string): Collection | null {
  const raw = readJSON<Record<string, unknown>>(
    path.join(dataDir, "collections", `${slug}.json`)
  );
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
  return listSlugs("collections")
    .map(getCollection)
    .filter((c): c is Collection => c !== null);
}

export function getAllCollectionSlugs(): string[] {
  return listSlugs("collections");
}

// ─── Pages ──────────────────────────────────────────────
export function getPage(slug: string): StaticPage | null {
  const raw = readJSON<Record<string, unknown>>(
    path.join(dataDir, "pages", `${slug}.json`)
  );
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
  return listSlugs("pages");
}

// ─── Blog ───────────────────────────────────────────────
export function getBlogPost(slug: string): BlogPost | null {
  const raw = readJSON<Record<string, unknown>>(
    path.join(dataDir, "blogs", `${slug}.json`)
  );
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
  return listSlugs("blogs");
}

export function getAllBlogPosts(): BlogPost[] {
  return listSlugs("blogs")
    .map(getBlogPost)
    .filter((b): b is BlogPost => b !== null);
}
