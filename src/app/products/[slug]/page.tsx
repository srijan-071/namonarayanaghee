import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getAllProductSlugs } from "@/lib/data";
import { generateProductMetadata } from "@/lib/seo";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/schema";
import ProductDetails from "@/components/product/ProductDetails";

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return generateProductMetadata(product);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/collections/ghee" },
    { name: product.title, url: `/products/${slug}` },
  ]);

  const GHEE_SLUGS = ["pure-desi-cow-ghee-1-litre", "pure-desi-cow-ghee-2-5-litre", "pure-desi-cow-ghee-5-litre"];
  let gheePacks = null;
  if (GHEE_SLUGS.includes(slug)) {
    gheePacks = GHEE_SLUGS.map((s) => getProduct(s)).filter((p): p is import("@/lib/types").Product => p !== null);
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="nn-section bg-white">
        <div className="nn-container">
          <ProductDetails product={product} gheePacks={gheePacks} />
        </div>
      </section>
    </>
  );
}
