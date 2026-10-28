"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, Sparkles, Gift, Flame, Heart, CheckCircle2, ArrowRight, ShieldCheck, Truck, Star, Loader2, Zap } from "lucide-react";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";
import DiwaliDiya from "@/components/ui/DiwaliDiya";

interface FestiveProduct {
  id: number;
  variantId: number;
  slug: string;
  title: string;
  variantTitle: string;
  tagline: string;
  diwaliUse: string;
  size: string;
  price: number;
  mrp: number;
  image: string;
  badge: string;
  giftsIncluded: string[];
}

const festiveHampers: FestiveProduct[] = [
  {
    id: 9545149055144,
    variantId: 55812002971816,
    slug: "pure-desi-cow-ghee-5-litre",
    title: "Maha Deepavali Lakshmi Pujan & Mithai Pack",
    variantTitle: "5 Litre",
    tagline: "The Grand Royal Festive Celebration Pack",
    diwaliUse: "Ideal for festive sweet-making, Akhand Diyas & whole family celebrations",
    size: "5 Litre",
    price: 349900,
    mrp: 499900,
    image: "/assets/product_6-5L_jpg.webp",
    badge: "🪔 GRAND FESTIVE HAMPER",
    giftsIncluded: [
      "FREE Coconut Oil (250 ml)",
      "FREE Groundnut Oil (250 ml)",
      "FREE Mustard Oil (500 ml)",
      "Special Brass Diya Gift"
    ]
  },
  {
    id: 9545146237096,
    variantId: 55811997728936,
    slug: "pure-desi-cow-ghee-2-5-litre",
    title: "Shubh Labh Auspicious Gifting Pack",
    variantTitle: "2.5 Litre",
    tagline: "The Perfect Auspicious Gift for Family & Elders",
    diwaliUse: "Traditional auspicious gifting for relatives, puja rituals & kitchen delights",
    size: "2.5 Litre",
    price: 209900,
    mrp: 299900,
    image: "/assets/product_6-2p5_jpg.webp",
    badge: "BEST FOR GIFTING",
    giftsIncluded: [
      "FREE Groundnut Oil (250 ml)",
      "FREE Yellow Mustard Oil (250 ml)",
      "FREE Mustard Oil (250 ml)"
    ]
  },
  {
    id: 9545153446056,
    variantId: 55812012572840,
    slug: "pure-desi-cow-ghee-1-litre",
    title: "Deepotsav Lakshmi Aarti & Kitchen Pack",
    variantTitle: "1 Litre",
    tagline: "Pure Gir Cow Ghee for Daily Aarti & Sweets",
    diwaliUse: "Sacred cow ghee for Diwali evening aarti, puja thali & homemade delicacies",
    size: "1 Litre",
    price: 94900,
    mrp: 139900,
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp",
    badge: "MOST POPULAR PUJA PACK",
    giftsIncluded: [
      "FREE Mustard Oil (250 ml)",
      "Diwali Festive Special Box"
    ]
  },
  {
    id: 9545153446055,
    variantId: 55812012572839,
    slug: "pure-desi-cow-ghee-500-ml",
    title: "Shuddh Ghee Diwali Trial Pack",
    variantTitle: "500 ml",
    tagline: "Experience the Authentic Vedic Aroma",
    diwaliUse: "Sample pure bilona ghee for your festive puja thali & diyas",
    size: "500 ml",
    price: 59900,
    mrp: 79900,
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp",
    badge: "STARTER PUJA PACK",
    giftsIncluded: [
      "Free Pan-India Delivery"
    ]
  }
];

export default function DiwaliSpecials() {
  const router = useRouter();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { open } = useCartDrawer();

  const handleQuickBuy = (p: FestiveProduct) => {
    setLoading(prev => ({ ...prev, ['buy_' + p.id]: true }));
    addToCart({
      productId: p.id,
      variantId: p.variantId,
      slug: p.slug,
      title: p.title,
      variantTitle: p.variantTitle,
      price: p.price,
      image: p.image
    });

    trackEvent("begin_checkout", {
      currency: "INR",
      value: p.price,
    });

    router.push("/checkout");
  };

  const handleAddToCart = (p: FestiveProduct) => {
    addToCart({
      productId: p.id,
      variantId: p.variantId,
      slug: p.slug,
      title: p.title,
      variantTitle: p.variantTitle,
      price: p.price,
      image: p.image
    });

    trackEvent("add_to_cart", {
      currency: "INR",
      value: p.price,
      items: [{
        item_id: p.id,
        item_name: p.title,
        quantity: 1,
        price: p.price
      }]
    });

    toast.success(`🪔 Added ${p.title} to your festive cart! Free gifts unlocked.`);
    open();
  };

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#1E090A] via-[#330D12] to-[#140608] text-white overflow-hidden">
      
      {/* Decorative Traditional Rangoli & Light Mandala Glow Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,rgba(245,189,71,0.25)_0%,rgba(94,11,16,0)_70%)] pointer-events-none" />
      <div className="absolute -left-32 top-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-32 bottom-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Decorative Garland Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 shadow-md" />

      <div className="nn-container relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18">
          <div className="inline-flex items-center gap-3 bg-[#4E1117] border border-amber-400/50 rounded-full px-5 py-2 mb-4 shadow-lg">
            <DiwaliDiya size={26} />
            <span className="text-xs md:text-sm font-bold tracking-widest text-amber-300 uppercase">
              शुभ दीपावली महोत्सव • SPECIAL FESTIVE OFFERS
            </span>
            <DiwaliDiya size={26} />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight tracking-tight drop-shadow-md">
            Light Up Your Diwali with <br />
            <span className="diwali-shimmer font-serif italic">Pure Vedic Gir Cow Ghee</span>
          </h2>

          <p className="text-amber-100/90 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
            In our sacred tradition, lighting an Akhand Diya with pure cow ghee brings divine peace, auspicious light, and the eternal blessings of Goddess Lakshmi into your home.
          </p>

          {/* Quick Festive Perks Badge Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-6">
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-amber-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>100% Pure Vedic Bilona</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-amber-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Free Cold-Pressed Oils Included</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-amber-200">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Guaranteed Delivery Before Diwali</span>
            </div>
          </div>
        </div>

        {/* Hampers & Special Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {festiveHampers.map((product) => {
            const savingsPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
            const isLoading = loading[product.id];

            return (
              <div 
                key={product.id}
                className="group relative bg-[#2A0B0F]/90 backdrop-blur-md rounded-2xl border border-amber-500/30 hover:border-amber-400 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5 shadow-xl hover:shadow-[0_12px_40px_rgba(245,189,71,0.25)]"
              >
                {/* Top Badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="bg-gradient-to-r from-amber-500 to-amber-700 text-black text-[10px] font-black tracking-wide px-3 py-1 rounded-full shadow-md uppercase">
                    {product.badge}
                  </span>
                </div>

                {/* Savings Pill */}
                <div className="absolute top-3 right-3 z-20">
                  <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                    {savingsPercent}% OFF
                  </span>
                </div>

                {/* Image Container */}
                <Link 
                  href={`/products/${product.slug}`}
                  className="relative aspect-square w-full bg-[#1F080B] p-4 flex items-center justify-center overflow-hidden block"
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                  {/* Subtle golden vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B0F] via-transparent to-transparent opacity-80" />
                </Link>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1.5">
                      <DiwaliDiya size={16} glow={false} />
                      <span className="truncate">{product.tagline}</span>
                    </div>

                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-serif font-bold text-lg text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-2">
                        {product.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-amber-100/70 mb-4 line-clamp-2 italic">
                      &quot;{product.diwaliUse}&quot;
                    </p>

                    {/* Gifts Included Checklist */}
                    <div className="bg-[#1A0608]/80 border border-amber-500/20 rounded-xl p-3 mb-4 space-y-1.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                        <Gift className="w-3 h-3 text-amber-400" />
                        <span>Diwali Festive Bonus</span>
                      </div>
                      {product.giftsIncluded.map((gift, gIdx) => (
                        <div key={gIdx} className="flex items-start gap-1.5 text-[11px] text-amber-100/90 leading-tight">
                          <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                          <span>{gift}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-bold text-amber-300 font-sans">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        {formatPrice(product.mrp)}
                      </span>
                      <span className="text-[10px] text-amber-300 font-bold ml-auto">
                        Save {formatPrice(product.mrp - product.price)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleQuickBuy(product)}
                        disabled={loading['buy_' + product.id]}
                        className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-[0_2px_10px_rgba(245,158,11,0.35)] active:scale-95 disabled:opacity-75 cursor-pointer uppercase tracking-wide border border-amber-300"
                      >
                        {loading['buy_' + product.id] ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                            <span>Opening...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 fill-stone-950 text-stone-950" />
                            <span>Quick Checkout</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isLoading}
                        className="w-full bg-[#3D0F14] hover:bg-[#52131A] text-amber-200 border border-amber-400/50 hover:border-amber-400 font-bold text-xs sm:text-sm py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-75 cursor-pointer uppercase tracking-wide"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Adding Offer...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Pillars of Authentic Diwali Celebration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-amber-500/20">
          
          <div className="bg-[#24090C]/80 border border-amber-500/20 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-4">
              <DiwaliDiya size={32} />
            </div>
            <h4 className="font-serif font-bold text-lg text-white mb-2">Akhand Diya Purity</h4>
            <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
              Vedic texts describe pure cow ghee as the supreme offering for Deepavali lamps. It produces a clear golden flame with zero soot, purifying the air with sattvic vibrations.
            </p>
          </div>

          <div className="bg-[#24090C]/80 border border-amber-500/20 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-amber-400" />
            </div>
            <h4 className="font-serif font-bold text-lg text-white mb-2">Pure Traditional Mithai</h4>
            <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
              Don&apos;t compromise your family&apos;s health with adulterated festive sweets. Real bilona ghee brings the rich, nostalgic aroma to your Besan Laddoos, Gujiyas, and Halwas.
            </p>
          </div>

          <div className="bg-[#24090C]/80 border border-amber-500/20 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-4">
              <Gift className="w-7 h-7 text-amber-400" />
            </div>
            <h4 className="font-serif font-bold text-lg text-white mb-2">The Gift of Purity</h4>
            <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
              Gift what matters most: pure health, longevity, and heritage. A jar of Namo Narayana A2 Ghee is an auspicious blessing your loved ones will truly cherish.
            </p>
          </div>

        </div>

        {/* Limited Time Coupon Callout Banner */}
        <div className="mt-12 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <DiwaliDiya size={34} glow={false} />
            <div>
              <p className="font-extrabold text-sm md:text-base tracking-wide uppercase">
                DIWALI SPECIAL COUPON: EXTRA 10% DISCOUNT
              </p>
              <p className="text-xs md:text-sm font-semibold opacity-90">
                Use coupon code <span className="underline font-black bg-stone-950 text-amber-300 px-2 py-0.5 rounded ml-1">DIWALI</span> during checkout on all orders!
              </p>
            </div>
          </div>
          <Link
            href="/collections/ghee"
            className="bg-stone-950 hover:bg-stone-900 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full flex items-center gap-2 shrink-0 transition-transform active:scale-95 shadow-md"
          >
            <span>Claim Diwali Offer</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

      </div>
    </section>
  );
}
