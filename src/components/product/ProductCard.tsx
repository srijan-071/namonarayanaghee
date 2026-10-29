"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, discountPercent } from "@/lib/utils";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";

export interface ProductCardProps {
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  available: boolean;
  productId?: number;
  variantId?: number;
  variantTitle?: string;
}

const FALLBACK_VARIANTS: Record<string, { id: number; variantId: number; variantTitle: string }> = {
  "pure-desi-cow-ghee-1-litre": { id: 9545153446056, variantId: 55812012572840, variantTitle: "1 Litre" },
  "pure-desi-cow-ghee-2-5-litre": { id: 9545146237096, variantId: 55811997728936, variantTitle: "2.5 Litre" },
  "pure-desi-cow-ghee-5-litre": { id: 9545149055144, variantId: 55812002971816, variantTitle: "5 Litre" },
  "pure-desi-cow-ghee-500-ml": { id: 9545153446055, variantId: 55812012572839, variantTitle: "500 ml" },
  "pure-a2-gir-cow-ghee-500-ml": { id: 9545153446055, variantId: 55812012572839, variantTitle: "500 ml" },
};

export default function ProductCard({
  slug,
  title,
  price,
  compareAtPrice,
  image,
  available,
  productId,
  variantId,
  variantTitle,
}: ProductCardProps) {
  const router = useRouter();
  const { open } = useCartDrawer();
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const discount = compareAtPrice ? discountPercent(price, compareAtPrice) : 0;

  const resolvedProductId = productId ?? FALLBACK_VARIANTS[slug]?.id ?? 9545153446056;
  const resolvedVariantId = variantId ?? FALLBACK_VARIANTS[slug]?.variantId ?? 55812012572840;
  const resolvedVariantTitle = variantTitle ?? FALLBACK_VARIANTS[slug]?.variantTitle ?? "1 Litre";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!available || isAdding) return;

    setIsAdding(true);
    addToCart({
      productId: resolvedProductId,
      variantId: resolvedVariantId,
      slug,
      title,
      variantTitle: resolvedVariantTitle,
      price,
      image,
      compareAtPrice,
    });

    trackEvent("add_to_cart", {
      currency: "INR",
      value: price,
      items: [{
        item_id: resolvedProductId,
        item_name: title,
        quantity: 1,
        price,
      }],
    });

    const vTitle = (resolvedVariantTitle || title || "").toLowerCase();
    if (vTitle.includes("500")) {
      toast.success("Added 500ml Ghee to cart. Tip: 1L pack includes free Mustard Oil!");
    } else if (vTitle.includes("2.5")) {
      toast.success("Added 2.5L Ghee to cart! 3 free cold-pressed oils included!");
    } else if (vTitle.includes("5 litre") || vTitle.includes("5l")) {
      toast.success("Added 5L Ghee to cart! 3 free cold-pressed oils included!");
    } else {
      toast.success("Added 1L Ghee to cart! Free 250ml Mustard Oil included!");
    }

    open();
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!available || isBuying) return;

    setIsBuying(true);
    addToCart({
      productId: resolvedProductId,
      variantId: resolvedVariantId,
      slug,
      title,
      variantTitle: resolvedVariantTitle,
      price,
      image,
      compareAtPrice,
    });

    trackEvent("begin_checkout", {
      currency: "INR",
      value: price,
    });

    router.push("/checkout");
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-amber-200/70 hover:border-amber-400">
      {/* Clickable Product Image */}
      <Link href={`/products/${slug}`} className="relative aspect-square overflow-hidden bg-nn-cream block">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            quality={90}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-nn-bark/20">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Purity & Discount Badge */}
        {discount > 0 ? (
          <span className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 bg-gradient-to-r from-[#8A1B14] to-[#630D12] text-amber-200 text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded shadow-sm border border-amber-400/40">
            {discount}% OFF
          </span>
        ) : (
          <span className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 bg-[#8A1B14] text-amber-200 text-[10px] font-black px-2 py-0.5 rounded shadow-sm border border-amber-400/40">
            100% Pure A2
          </span>
        )}

        <span className="absolute bottom-2 sm:bottom-2.5 right-2 sm:right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
          Free Shipping
        </span>
      </Link>

      {/* Card Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white text-center">
        <div>
          <Link href={`/products/${slug}`} className="block focus:outline-none">
            <span className="text-[10px] text-[#8A1B14] font-extrabold uppercase tracking-widest block mb-1">
              100% PURE BILONA GHEE
            </span>
            <h3 className="font-serif font-bold text-sm sm:text-base leading-snug text-nn-ink group-hover:text-[#8A1B14] transition-colors line-clamp-2 mb-1.5">
              {title}
            </h3>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-1 mt-auto">
          {/* Price & Savings */}
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="font-bold text-[#8A1B14] text-base sm:text-lg font-sans">{formatPrice(price)}</span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-xs sm:text-sm font-medium text-nn-bark/60 line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>

          <span className="text-[10px] text-amber-800 font-semibold flex items-center gap-1 mb-2.5">
            <span>Free Cold-Pressed Oils Included</span>
          </span>

          {/* Action CTAs: Quick Checkout & Add to Cart */}
          <div className="w-full flex flex-col gap-1.5">
            {/* Quick Checkout CTA */}
            <button
              type="button"
              onClick={handleBuyNow}
              onMouseEnter={() => router.prefetch("/checkout")}
              disabled={!available || isBuying}
              className="w-full bg-gradient-to-r from-[#FFB800] via-[#F59E0B] to-[#D97706] hover:brightness-105 active:scale-[0.98] text-stone-950 font-black text-xs sm:text-sm py-2 sm:py-2.5 px-2.5 rounded-xl transition-all shadow-[0_2px_10px_rgba(245,158,11,0.35)] flex items-center justify-center gap-1.5 uppercase border border-amber-300 cursor-pointer disabled:opacity-70 tracking-wide"
            >
              {isBuying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-950" />
                  <span>Opening...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current text-stone-950 shrink-0" />
                  <span>Quick Checkout</span>
                </>
              )}
            </button>

            {/* Add to Cart CTA */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!available || isAdding}
              className="w-full bg-[#FCFAF5] hover:bg-[#8A1B14] text-[#8A1B14] hover:text-white border-2 border-[#8A1B14] font-extrabold text-xs sm:text-sm py-1.5 sm:py-2 px-2.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 uppercase cursor-pointer disabled:opacity-70 shadow-2xs tracking-wide"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
