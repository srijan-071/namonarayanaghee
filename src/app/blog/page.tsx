import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/data";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Blog",
  description: `Read the latest articles and recipes from ${siteConfig.name}.`,
  alternates: { canonical: `${siteConfig.url}/blog` },
};

export default function BlogIndex() {
  const posts = getAllBlogPosts();

  return (
    <section className="nn-section bg-white">
      <div className="nn-container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="nn-eyebrow mb-2 block">From Our Kitchen</span>
          <h1 className="nn-title">Blog</h1>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="nn-card p-6 md:p-8 group block">
                <h2 className="font-serif text-xl font-bold text-nn-ink group-hover:text-nn-forest transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="nn-sub text-sm line-clamp-2">{post.excerpt || "Read more →"}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center nn-sub py-12">No posts yet. Check back soon!</p>
        )}
      </div>
    </section>
  );
}
