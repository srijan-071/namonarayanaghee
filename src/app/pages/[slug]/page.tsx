import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage, getAllPageSlugs } from "@/lib/data";
import { siteConfig } from "@/lib/config";

export function generateStaticParams() {
  return getAllPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};
  return {
    title: page.seo.title || page.title,
    description: page.seo.description,
    alternates: { canonical: `${siteConfig.url}/pages/${slug}` },
  };
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  return (
    <section className="nn-section bg-white">
      <div className="nn-container max-w-3xl mx-auto">
        <h1 className="nn-title text-center mb-10">{page.title}</h1>
        <div className="prose prose-lg max-w-none text-nn-bark" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </section>
  );
}
