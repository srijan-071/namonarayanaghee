"use client";

import Link from "next/link";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PRODUCT_REVIEWS_MAP } from "@/lib/reviews-data";

export default function HomeReviews() {
  // Use actual verified purchaser reviews from the 1 Litre flagship product
  const reviews = (PRODUCT_REVIEWS_MAP["pure-desi-cow-ghee-1-litre"] || []).slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-[#F8F5EE] border-b border-[#EAE3D7]">
      <div className="nn-container">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#68191D] block mb-2">
            Verified Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#4E1013] font-bold mb-4">
            Loved Across Indian Homes
          </h2>
          <p className="text-sm sm:text-base text-[#29251F] leading-relaxed">
            Honest feedback from customers who use Namo Narayana Pure A2 Gir Cow Ghee for daily cooking, pooja rituals, and family wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-[#EAE3D7] shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? "text-[#C5A16B] fill-[#C5A16B]" : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>
                
                {/* Review Body */}
                <p className="text-xs sm:text-sm text-[#29251F] leading-relaxed italic mb-4">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              <div className="border-t border-[#EAE3D7]/60 pt-3 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-[#4E1013] block">{rev.author}</strong>
                  <span className="text-[11px] text-stone-400">{rev.date}</span>
                </div>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-medium bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/products/pure-desi-cow-ghee-1-litre#product-reviews-section"
            className="text-xs sm:text-sm font-semibold text-[#68191D] hover:text-[#68191D] underline underline-offset-4"
          >
            Read all customer reviews on the flagship 1 Litre pack →
          </Link>
        </div>

      </div>
    </section>
  );
}

