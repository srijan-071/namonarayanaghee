"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Loader2, Sparkles, Gift } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, discountPercent, cn } from "@/lib/utils";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";
import { use3DTilt } from "@/hooks/use3DTilt";

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
    price: 89900,
    compareAtPrice: 219900,
    ratePerLitre: "₹899 (₹799 with 1st Order Gift Card)",
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
    price: 154900,
    compareAtPrice: 349900,
    ratePerLitre: "₹1,549 (₹1,299 with 1st Order Gift Card)",
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
    price: 319900,
    compareAtPrice: 799900,
    ratePerLitre: "₹3,199 (₹2,699 with 1st Order Gift Card)",
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
    price: 549900,
    compareAtPrice: 1549900,
    ratePerLitre: "₹5,499 (₹4,499 with 1st Order Gift Card)",
    giftText: "+ 3 Free Cold-Pressed Oils",
    image: "/assets/product_6-5L_jpg.webp",
  },
];

function GheeCardItem({
  pack,
  onAddToCart,
  onBuyNow,
  isCartLoading,
  isBuyLoading,
}: {
  pack: GheePack;
  onAddToCart: (e: React.MouseEvent, pack: GheePack) => void;
  onBuyNow: (e: React.MouseEvent, pack: GheePack) => void;
  isCartLoading: boolean;
  isBuyLoading: boolean;
}) {
  const { cardRef, cardStyle, glareStyle, onMouseMove, onMouseLeave } = use3DTilt(8, 1.02);
  const discount = discountPercent(pack.price, pack.compareAtPrice);

  return (
    <div
      ref={cardRef}
      style={cardStyle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xs",
        pack.isBestseller
          ? "bg-gradient-to-b from-white via-[#FAFBF9] to-[#F3F8F5] border-emerald-500/40 ring-1 ring-emerald-500/20"
          : "bg-white hover:bg-gradient-to-b hover:from-white hover:to-[#FAFBF9] border-emerald-900/10 hover:border-emerald-500/30"
      )}
    >
      {/* Dynamic Specular Light Glare */}
      <div style={glareStyle} />

      {/* Product Image Box */}
      <Link
        href={`/products/${pack.slug}`}
        className="relative aspect-square w-full bg-gradient-to-b from-[#FAF8F5] to-white block overflow-hidden border-b border-emerald-900/10"
      >
        <Image
          src={pack.image}
          alt={`${pack.title} - ${pack.variantTitle}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-4 group-hover:scale-106 transition-transform duration-500"
        />

        {/* Pack Label Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
          <span
            className={cn(
              "text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs",
              pack.isBestseller
                ? "bg-gradient-to-r from-[#064E3B] to-[#047857] text-white border border-emerald-400/30"
                : "bg-emerald-50 text-[#064E3B] border border-emerald-200/50"
            )}
          >
            {pack.label}
          </span>
        </div>

        {/* Discount Pill */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-white/95 text-[#064E3B] border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs z-10">
            {discount}% OFF
          </span>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between text-left relative z-10">
        <div>
          <span className="text-[10.5px] font-mono font-semibold text-[#059669] uppercase tracking-wider block mb-1">
            {pack.size}
          </span>
          <Link
            href={`/products/${pack.slug}`}
            className="font-serif font-bold text-base sm:text-lg text-[#111815] group-hover:text-[#064E3B] transition-colors leading-tight block mb-2"
          >
            {pack.title} {pack.variantTitle}
          </Link>

          {/* Price and Unit Price */}
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <span className="text-xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-[#0A1411] via-[#064E3B] to-[#043828]">
              {formatPrice(pack.price)}
            </span>
            {pack.compareAtPrice > pack.price && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(pack.compareAtPrice)}
              </span>
            )}
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              {pack.ratePerLitre}
            </span>
          </div>

          {/* Gift / Value line */}
          <p className="text-[11px] text-[#4B5548] flex items-center gap-1.5 mt-2 mb-4 font-medium">
            <Gift className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
            <span>{pack.giftText}</span>
          </p>
        </div>

        {/* Actions System */}
        <div className="flex flex-col gap-2 mt-auto pt-2">
          <button
            type="button"
            onClick={(e) => onBuyNow(e, pack)}
            disabled={isBuyLoading}
            className="w-full bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:from-[#34D399] hover:to-[#059669] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 border border-emerald-400/30"
          >
            {isBuyLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current shrink-0 text-amber-200" />
                <span>Buy Now</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => onAddToCart(e, pack)}
            disabled={isCartLoading}
            className="w-full bg-white hover:bg-emerald-50/60 border border-emerald-900/15 active:scale-[0.98] text-[#111815] font-semibold text-xs sm:text-sm py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {isCartLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#064E3B]" />
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

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
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FAF8F5] via-[#F4F8F5] to-[#FAF8F5] border-b border-emerald-900/10">
      <div className="nn-container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#059669] uppercase tracking-widest block mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pure Desi Cow Ghee Collection</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0D2B1D] font-bold mb-3 tracking-tight">
            The Ghee Collection
          </h2>
          <p className="text-sm sm:text-base text-[#4B5548] leading-relaxed">
            Thoughtfully crafted for everyday kitchens and family tables. Handcrafted via Vedic Bilona method from pure A2 Gir cow milk.
          </p>
        </div>

        {/* 4-Column 3D Tilt Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GHEE_COLLECTION.map((pack) => (
            <GheeCardItem
              key={pack.slug}
              pack={pack}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isCartLoading={loadingAction[pack.slug] === "cart"}
              isBuyLoading={loadingAction[pack.slug] === "buy"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
