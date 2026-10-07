import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCollection, getAllCollectionSlugs, getProduct } from "@/lib/data";
import { generateCollectionMetadata } from "@/lib/seo";
import { generateBreadcrumbSchema } from "@/lib/schema";
import ProductCard from "@/components/product/ProductCard";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllCollectionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return generateCollectionMetadata(collection);
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const products = collection.productSlugs
    .map((s) => getProduct(s))
    .filter((p) => p !== null);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Collections", url: "/collections/ghee" },
    { name: collection.title, url: `/collections/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="nn-section bg-nn-bg">
        <div className="nn-container">
          <div className="text-center mb-12">
            <h1 className="nn-title">{collection.title}</h1>
            {collection.description && <p className="nn-sub mt-3 max-w-xl mx-auto">{collection.description}</p>}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.slug}
                  slug={p.slug}
                  title={p.title}
                  price={p.price}
                  compareAtPrice={p.compareAtPrice}
                  image={p.images[0] ?? ""}
                  available={p.available}
                />
              ))}
            </div>
          ) : (
            <p className="text-center nn-sub py-12">No products found in this collection.</p>
          )}
        </div>
      </section>
    </>
  );
}
