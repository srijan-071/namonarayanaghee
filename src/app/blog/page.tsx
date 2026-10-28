import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/data";
import { siteConfig } from "@/lib/config";
import { Clock, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Vedic Ghee Blog & Buyer's Guides | Namo Narayana",
  description: `Read the latest research, buying guides, purity tests, and recipes from ${siteConfig.name}.`,
  alternates: { canonical: `${siteConfig.url}/blog` },
};

export default function BlogIndex() {
  const posts = getAllBlogPosts();

  // Sort so our review is at the top or featured
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.slug === "namo-narayana-ghee-review") return -1;
    if (b.slug === "namo-narayana-ghee-review") return 1;
    return 0;
  });

  return (
    <section className="nn-section bg-[#FCFAF5] py-16 md:py-24">
      <div className="nn-container max-w-5xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="nn-eyebrow text-amber-800 mb-2 block tracking-widest">Vedic Health &amp; Pure Food Knowledge</span>
          <h1 className="nn-title text-3xl md:text-5xl font-serif text-[#231714] mb-4">
            The Namo Narayana Journal
          </h1>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed">
            Unfiltered guides on indigenous A2 Gir cows, the ancient Bilona curd-churning method, honest price breakdowns, and festive recipes.
          </p>
        </div>

        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedPosts.map((post) => {
              const isFeatured = post.slug === "namo-narayana-ghee-review";

              return (
                <article
                  key={post.slug}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 flex flex-col bg-white border ${
                    isFeatured
                      ? "md:col-span-2 border-amber-300 shadow-xl ring-2 ring-amber-400/30"
                      : "border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300"
                  }`}
                >
                  <Link href={`/blog/${post.slug}`} className="flex flex-col h-full group">
                    {/* Featured Layout */}
                    {isFeatured ? (
                      <div className="grid md:grid-cols-12 h-full">
                        <div className="md:col-span-5 relative min-h-[240px] md:min-h-[320px] bg-amber-50">
                          <Image
                            src={post.image || "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8A1B14] text-white shadow">
                            <Sparkles className="w-3.5 h-3.5" /> Featured Review
                          </div>
                        </div>

                        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
                              <span className="font-semibold text-amber-800 uppercase tracking-wider">Buyer&apos;s Guide</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> 8 min read
                              </span>
                            </div>

                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231714] group-hover:text-[#8A1B14] transition-colors mb-3 leading-snug">
                              {post.title}
                            </h2>

                            <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-6">
                              {post.excerpt || "A comprehensive breakdown of Namo Narayana A2 Gir Cow Ghee prices, traditional Bilona method, founder details, and purity benchmarks."}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                            <span className="text-xs font-bold text-[#8A1B14] flex items-center gap-1 group-hover:gap-2 transition-all">
                              Read Full Review <ArrowRight className="w-4 h-4" />
                            </span>
                            <span className="text-xs text-stone-400">By {post.author}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Standard Post Layout */
                      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2.5">
                            <span className="font-semibold text-stone-700 uppercase tracking-wider text-[11px]">Knowledge</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> 4 min read
                            </span>
                          </div>

                          <h2 className="font-serif text-xl font-bold text-[#231714] group-hover:text-[#8A1B14] transition-colors mb-2.5 line-clamp-2">
                            {post.title}
                          </h2>

                          <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
                            {post.excerpt || "Read more about authentic Vedic traditions and healthy living with pure A2 Gir Cow Ghee."}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-[#8A1B14] flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read Article <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-[11px] text-stone-400">Namo Narayana</span>
                        </div>
                      </div>
                    )}
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-center nn-sub py-12">No posts yet. Check back soon!</p>
        )}
      </div>
    </section>
  );
}
