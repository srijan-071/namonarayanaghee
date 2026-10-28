"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, ChevronDown, Leaf, Droplets, Sparkles } from "lucide-react";
import DiwaliDiya from "@/components/ui/DiwaliDiya";
import { cn, formatPrice } from "@/lib/utils";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";

// Actual Ghee products data matching the live store
const gheeProducts = [
  {
    id: 9545153446055,
    variantId: 55812012572839,
    slug: "pure-desi-cow-ghee-500-ml",
    badge: "🪔 STARTER PUJA PACK",
    badgeColor: "bg-[#8A1B14]",
    title: "Pure A2 Gir Cow Ghee 500 ml",
    variantTitle: "500 ml",
    subtitle: "Bilona Churned • Perfect for Diwali Puja",
    size: "500 ml",
    price: 59900,
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"
  },
  {
    id: 9545153446056,
    variantId: 55812012572840,
    slug: "pure-desi-cow-ghee-1-litre",
    badge: "LAKSHMI AARTI BESTSELLER",
    badgeColor: "bg-[#C38936]",
    title: "Pure A2 Gir Cow Ghee 1 Litre",
    variantTitle: "1 Litre",
    subtitle: "Bilona Churned • 1 Free Mustard Oil (250ml)",
    size: "1 Litre",
    price: 94900,
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"
  },
  {
    id: 9545146237096,
    variantId: 55811997728936,
    slug: "pure-desi-cow-ghee-2-5-litre",
    badge: "SHUBH LABH GIFT PACK",
    badgeColor: "bg-[#8A1B14]",
    title: "Pure A2 Gir Cow Ghee 2.5 Litre",
    variantTitle: "2.5 Litre",
    subtitle: "Bilona Churned • 3 Free Cold-Pressed Oils",
    size: "2.5 Litre",
    price: 209900,
    image: "/assets/product_6-2p5_jpg.webp"
  },
  {
    id: 9545149055144,
    variantId: 55812002971816,
    slug: "pure-desi-cow-ghee-5-litre",
    badge: "MAHA DIWALI FAMILY PACK",
    badgeColor: "bg-[#C38936]",
    title: "Pure A2 Gir Cow Ghee 5 Litre",
    variantTitle: "5 Litre",
    subtitle: "Bulk Savings • 3 Free Cold-Pressed Oils",
    size: "5 Litre",
    price: 349900,
    image: "/assets/product_6-5L_jpg.webp"
  }
];

export default function Bestsellers() {
  const router = useRouter();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleQuickBuy = (p: typeof gheeProducts[0]) => {
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
  
  const handleAddWithLoading = (p: any) => {
    handleAddToCart(p);
  };

  const handleFavorite = (id: number | string) => {
    toast.success("Added to favorites");
  };

  const { open } = useCartDrawer();

  const handleAddToCart = (p: typeof gheeProducts[0]) => {
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

    const vTitle = (p.variantTitle || p.title || "").toLowerCase();
    if (vTitle.includes("500")) {
      toast.success("Added 500ml Ghee to cart. Tip: Upgrade to 1L for complimentary Mustard Oil (250ml)!", { duration: 4000 });
    } else if (vTitle.includes("2.5")) {
      toast.success("Added 2.5L Ghee to cart! 3 complimentary Cold-Pressed Oils included!", { duration: 4000 });
    } else if (vTitle.includes("5 litre") || vTitle.includes("5l")) {
      toast.success("Added 5L Ghee to cart! 3 complimentary Cold-Pressed Oils (Coconut, Groundnut & Mustard) included!", { duration: 4000 });
    } else {
      toast.success("Added 1L Ghee to cart! Complimentary Mustard Oil (250ml) included!", { duration: 4000 });
    }

    open();
  };

  return (
    <section className="bg-white overflow-hidden">
      {/* Top Banner Area */}
      <div className="relative w-full overflow-hidden bg-[#1a1a1a] min-h-[300px] flex items-center">
        <div
          className="absolute inset-0 z-0"
        >
          <Image src="/assets/home-shop-bg.jpg" alt="Home Shop Background" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="nn-container relative z-10 py-12 md:py-16 text-white drop-shadow-md">
          <div className="flex items-center justify-between">
            <div
              className="w-full lg:w-2/3"
            >
              <div className="text-sm font-medium text-amber-200 mb-6 tracking-wide drop-shadow-sm flex items-center gap-2">
                <span>Home &nbsp;&gt;&nbsp; <strong className="text-white">Diwali Shop</strong></span>
                <DiwaliDiya size={16} glow={false} />
              </div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-3 block drop-shadow-sm">शुभ दीपावली • FESTIVE FAVOURITES</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_60%)]">Deepotsav Festive Favourites</h2>
              <p className="text-amber-50 max-w-xl text-base md:text-lg mb-8 drop-shadow-md font-medium">
                Pure essentials from our farms to your Diwali pujan thali &amp; festive feasts. Traditional. Nourishing. Auspicious.
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/collections/all-products" className="bg-amber-400 text-stone-950 px-6 py-2 rounded-full text-sm font-bold hover:bg-amber-300 transition-colors shadow-lg">All Festive Packs</Link>
                <Link href="/collections/ghee" className="bg-black/40 backdrop-blur-md text-amber-200 border border-amber-400/40 px-6 py-2 rounded-full text-sm font-bold hover:bg-black/60 transition-colors shadow-lg">Pure A2 Ghee</Link>
              </div>
            </div>
            
            <div
              className="hidden lg:flex lg:w-1/3 justify-end items-center pr-8 xl:pr-12"
            >
              <div className="text-amber-200 text-4xl lg:text-5xl font-serif italic font-light leading-tight drop-shadow-lg [text-shadow:_0_4px_12px_rgb(0_0_0_/_80%)] text-right">
                Pure Ghee <br/> Radiant <br/> Deepavali
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Products Section */}
      <div className="relative w-full overflow-hidden">
        {/* Background Image with White Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <Image src="/assets/bestsellers-bg.jpg" alt="Products Background" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-white/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0.95)_100%)] pointer-events-none" />
        </div>

        <div className="relative z-10">
          {/* Available Now Section */}
          <div className="py-12 md:py-16">
            <div className="nn-container">
              <div
                className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1 text-[#8A1B14] font-bold text-xs uppercase tracking-widest">
                    <DiwaliDiya size={16} glow={false} />
                    <span>Diwali Special Stock</span>
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-[#5E0B10] mb-2 drop-shadow-sm">Diwali Puja &amp; Kitchen Collection</h3>
                  <p className="text-[#4A352F] font-medium text-sm md:text-base">100% Pure A2 Gir Cow Ghee with free cold-pressed oils added to every ghee pack!</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 bg-white/60 backdrop-blur-md border border-amber-200/60 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Leaf className="w-6 h-6 text-[#8A1B14]" />
                    <span className="text-xs font-bold text-[#5E0B10] leading-tight">A2 Gir Cow<br/>Milk</span>
                  </div>
                  <div className="w-px h-8 bg-amber-200" />
                  <div className="flex items-center gap-3">
                    <Droplets className="w-6 h-6 text-[#C38936]" />
                    <span className="text-xs font-bold text-[#5E0B10] leading-tight">Bilona<br/>Churned</span>
                  </div>
                  <div className="w-px h-8 bg-amber-200" />
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-[#8A1B14]" />
                    <span className="text-xs font-bold text-[#5E0B10] leading-tight">Farm Fresh<br/>& Natural</span>
                  </div>
                </div>
              </div>
              
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {gheeProducts.map((p) => (
                  <div key={p.id} className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-200/50 flex flex-col h-full group">
                    <Link href={`/products/${p.slug}`} className="relative aspect-square w-full bg-[#FCFAF5] p-6 flex items-center justify-center overflow-hidden block">
                      <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 left-4 z-10">
                        <span className={cn("text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm", p.badgeColor)}>
                          {p.badge}
                        </span>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); handleFavorite(p.id); }} className="absolute top-4 right-4 z-10 p-2 text-white hover:text-amber-400 transition-colors drop-shadow-md">
                        <Heart className="w-6 h-6" />
                      </button>
                    </Link>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <Link href={`/products/${p.slug}`}>
                        <h4 className="font-serif font-bold text-lg text-[#5E0B10] mb-1 group-hover:text-[#8A1B14] transition-colors">{p.title}</h4>
                      </Link>
                      <p className="text-xs text-[#7A4A3B] mb-4">{p.subtitle}</p>
                      
                      <div className="relative mb-4">
                        <select className="w-full appearance-none bg-white border border-[#EAD7BC] text-[#2A1612] text-sm rounded-md px-3 py-2 pr-8 focus:outline-none focus:border-[#8A1B14] cursor-pointer" defaultValue={p.size}>
                          <option value={p.size}>{p.size}</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A4A3B] pointer-events-none" />
                      </div>
                      
                      <div className="font-bold text-xl text-[#5E0B10] mb-5">{formatPrice(p.price)}</div>
                      
                      <div className="mt-auto flex flex-col gap-2">
                        <button 
                          onClick={() => handleQuickBuy(p)}
                          disabled={loading['buy_'+p.id]}
                          className="w-full bg-gradient-to-r from-[#FFB800] via-[#F59E0B] to-[#D97706] hover:brightness-105 active:scale-95 text-stone-950 rounded-xl py-2.5 flex items-center justify-center gap-2 font-black text-xs sm:text-sm shadow-[0_2px_10px_rgba(245,158,11,0.35)] uppercase border border-amber-300 tracking-wide transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {loading['buy_'+p.id] ? <Loader2 className="w-4 h-4 animate-spin text-stone-950" /> : <Zap className="w-4 h-4 fill-stone-950 text-stone-950" />}
                          {loading['buy_'+p.id] ? "Opening..." : "Quick Checkout"}
                        </button>

                        <button 
                          onClick={() => handleAddWithLoading(p)}
                          disabled={loading['add_'+p.id]}
                          className="w-full bg-[#FCFAF5] hover:bg-[#8A1B14] text-[#8A1B14] hover:text-white border-2 border-[#8A1B14] rounded-xl py-2 flex items-center justify-center gap-2 active:scale-95 transition-all font-bold text-xs sm:text-sm uppercase shadow-2xs tracking-wide disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {loading['add_'+p.id] ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : <ShoppingCart className="w-4 h-4 stroke-[2.2]" />}
                          {loading['add_'+p.id] ? "Adding..." : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
