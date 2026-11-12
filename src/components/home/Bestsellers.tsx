"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Loader2, Sparkles, Check, Gift } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, discountPercent, cn } from "@/lib/utils";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";

interface GheePack {
  id: number;
  variantId: number;
  slug: string;
  title: string;
  variantTitle: string;
  size: string;
  label: string;
  price: number;
  compareAtPrice: number;
  ratePerLitre: string;
  giftText: string;
  image: string;
  isBestseller?: boolean;
}

const GHEE_COLLECTION: GheePack[] = [
  {
    id: 9545153446055,
    variantId: 55812012572839,
    slug: "pure-desi-cow-ghee-500-ml",
    title: "Pure A2 Gir Cow Ghee",
    variantTitle: "500 ml",
    size: "500 ml Jar",
    label: "Starter & Sacred Rituals",
    price: 79900,
    compareAtPrice: 199900,
    ratePerLitre: "₹1,598 / L",
    giftText: "Tamper-evident glass jar",
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp",
  },
  {
    id: 9545153446056,
    variantId: 55812012572840,
    slug: "pure-desi-cow-ghee-1-litre",
    title: "Pure A2 Gir Cow Ghee",
    variantTitle: "1 Litre",
    size: "1 Litre Jar",
    label: "Flagship Bestseller",
    price: 129900,
    compareAtPrice: 329900,
    ratePerLitre: "₹1,299 / L",
    giftText: "+ Free 250ml Mustard Oil",
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp",
    isBestseller: true,
  },
  {
    id: 9545146237096,
    variantId: 55811997728936,
    slug: "pure-desi-cow-ghee-2-5-litre",
    title: "Pure A2 Gir Cow Ghee",
    variantTitle: "2.5 Litre",
    size: "2.5 Litre Container",
    label: "Family Pack Value",
    price: 269900,
    compareAtPrice: 749900,
    ratePerLitre: "₹1,079.60 / L",
    giftText: "+ 3 Free Cold-Pressed Oils",
    image: "/assets/product_6-2p5_jpg.webp",
  },
  {
    id: 9545149055144,
    variantId: 55812002971816,
    slug: "pure-desi-cow-ghee-5-litre",
    title: "Pure A2 Gir Cow Ghee",
    variantTitle: "5 Litre",
    size: "5 Litre Bulk Tin",
    label: "Bulk Heritage Reserve",
    price: 449900,
    compareAtPrice: 1449900,
    ratePerLitre: "₹899.80 / L",
    giftText: "+ 3 Free Cold-Pressed Oils",
    image: "/assets/product_6-5L_jpg.webp",
  },
];

export default function Bestsellers() {
  const router = useRouter();
  const { open } = useCartDrawer();
  const [loadingAction, setLoadingAction] = useState<Record<string, "cart" | "buy" | null>>({});

  const handleAddToCart = (e: React.MouseEvent, pack: GheePack) => {
    e.preventDefault();
    e.stopPropagation();

    setLoadingAction((prev) => ({ ...prev, [pack.slug]: "cart" }));

    addToCart({
      productId: pack.id,
      variantId: pack.variantId,
      slug: pack.slug,
      title: `${pack.title} ${pack.variantTitle}`,
      variantTitle: pack.variantTitle,
      price: pack.price,
      image: pack.image,
      compareAtPrice: pack.compareAtPrice,
    });

    trackEvent("add_to_cart", {
      currency: "INR",
      value: pack.price,
      items: [
        {
          item_id: pack.id,
          item_name: pack.title,
          quantity: 1,
          price: pack.price,
        },
      ],
    });

    toast.success(`Added ${pack.variantTitle} to cart.`);
    open();
    setTimeout(() => {
      setLoadingAction((prev) => ({ ...prev, [pack.slug]: null }));
    }, 400);
  };

  const handleBuyNow = (e: React.MouseEvent, pack: GheePack) => {
    e.preventDefault();
    e.stopPropagation();

    setLoadingAction((prev) => ({ ...prev, [pack.slug]: "buy" }));

    addToCart({
      productId: pack.id,
      variantId: pack.variantId,
      slug: pack.slug,
      title: `${pack.title} ${pack.variantTitle}`,
      variantTitle: pack.variantTitle,
      price: pack.price,
      image: pack.image,
      compareAtPrice: pack.compareAtPrice,
    });

    trackEvent("begin_checkout", {
      currency: "INR",
      value: pack.price,
    });

    router.push("/checkout");
  };

  return (
    <section className="py-16 md:py-24 bg-[#F8F5EE] border-b border-[#EAE3D7]">
      <div className="nn-container">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold text-[#78634B] uppercase tracking-widest block mb-2">
            Pure Desi Cow Ghee
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#4E1013] font-bold mb-3">
            The Ghee Collection
          </h2>
          <p className="text-sm sm:text-base text-[#29251F] leading-relaxed">
            Thoughtfully crafted for everyday kitchens and family tables. Handcrafted via Vedic Bilona method from pure A2 Gir cow milk.
          </p>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GHEE_COLLECTION.map((pack) => {
            const discount = discountPercent(pack.price, pack.compareAtPrice);
            const isCartLoading = loadingAction[pack.slug] === "cart";
            const isBuyLoading = loadingAction[pack.slug] === "buy";

            return (
              <div
                key={pack.slug}
                className={cn(
                  "bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-lg",
                  pack.isBestseller
                    ? "border-[#68191D] ring-1 ring-[#68191D]/30"
                    : "border-[#EAE3D7] hover:border-[#78634B]/50"
                )}
              >
                {/* Product Image Box */}
                <Link
                  href={`/products/${pack.slug}`}
                  className="relative aspect-square w-full bg-[#FAF8F5] block overflow-hidden border-b border-[#EAE3D7]/70"
                >
                  <Image
                    src={pack.image}
                    alt={`${pack.title} - ${pack.variantTitle}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Pack Label Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs",
                        pack.isBestseller
                          ? "bg-[#68191D] text-white"
                          : "bg-[#EAE3D7] text-[#4E1013]"
                      )}
                    >
                      {pack.label}
                    </span>
                  </div>

                  {/* Discount Pill */}
                  {discount > 0 && (
                    <span className="absolute top-3 right-3 bg-white/95 text-[#68191D] border border-[#EAE3D7] text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                      {discount}% OFF
                    </span>
                  )}
                </Link>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between text-left">
                  
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-[#78634B] uppercase tracking-wider block mb-1">
                      {pack.size}
                    </span>
                    <Link
                      href={`/products/${pack.slug}`}
                      className="font-serif font-bold text-base sm:text-lg text-[#29251F] group-hover:text-[#68191D] transition-colors leading-tight block mb-2"
                    >
                      {pack.title} {pack.variantTitle}
                    </Link>

                    {/* Price and Unit Price */}
                    <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                      <span className="text-xl font-bold font-sans text-[#4E1013]">
                        {formatPrice(pack.price)}
                      </span>
                      {pack.compareAtPrice > pack.price && (
                        <span className="text-xs text-[#78634B]/70 line-through">
                          {formatPrice(pack.compareAtPrice)}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-[#42634F] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        {pack.ratePerLitre}
                      </span>
                    </div>

                    {/* Gift / Value line */}
                    <p className="text-[11px] text-[#78634B] flex items-center gap-1.5 mt-2 mb-4 font-medium">
                      <Gift className="w-3.5 h-3.5 text-[#C5A16B] shrink-0" />
                      <span>{pack.giftText}</span>
                    </p>
                  </div>

                  {/* Actions System */}
                  <div className="flex flex-col gap-2 mt-auto pt-2">
                    <button
                      type="button"
                      onClick={(e) => handleBuyNow(e, pack)}
                      disabled={isBuyLoading}
                      className="w-full bg-[#68191D] hover:bg-[#4E1013] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {isBuyLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                          <span>Buy Now</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, pack)}
                      disabled={isCartLoading}
                      className="w-full bg-white hover:bg-[#FAF8F5] border border-[#EAE3D7] active:scale-[0.98] text-[#29251F] font-semibold text-xs sm:text-sm py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {isCartLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#68191D]" />
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5 text-[#78634B] shrink-0" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
