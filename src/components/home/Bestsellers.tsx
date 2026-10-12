"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, ChevronDown, Leaf, Droplets } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";

// Actual Ghee products data matching the live store
const gheeProducts = [
  {
    id: 9545153446055,
    variantId: 55812012572839,
    slug: "pure-desi-cow-ghee-500-ml",
    badge: "STARTER PACK",
    badgeColor: "bg-[#1E3A24]",
    title: "Pure A2 Gir Cow Ghee 500 ml",
    variantTitle: "500 ml",
    subtitle: "Bilona Churned • Perfect to Try",
    size: "500 ml",
    price: 59900,
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"
  },
  {
    id: 9545153446056,
    variantId: 55812012572840,
    slug: "pure-desi-cow-ghee-1-litre",
    badge: "BESTSELLER",
    badgeColor: "bg-[#C38936]",
    title: "Pure A2 Gir Cow Ghee 1 Litre",
    variantTitle: "1 Litre",
    subtitle: "Bilona Churned • Pure & Traditional",
    size: "1 Litre",
    price: 94900,
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"
  },
  {
    id: 9545146237096,
    variantId: 55811997728936,
    slug: "pure-desi-cow-ghee-2-5-litre",
    badge: "VALUE PACK",
    badgeColor: "bg-[#1E3A24]",
    title: "Pure A2 Gir Cow Ghee 2.5 Litre",
    variantTitle: "2.5 Litre",
    subtitle: "Bilona Churned • Great for Families",
    size: "2.5 Litre",
    price: 209900,
    image: "/assets/product_6-2p5_jpg.webp"
  },
  {
    id: 9545149055144,
    variantId: 55812002971816,
    slug: "pure-desi-cow-ghee-5-litre",
    badge: "FAMILY PACK",
    badgeColor: "bg-[#C38936]",
    title: "Pure A2 Gir Cow Ghee 5 Litre",
    variantTitle: "5 Litre",
    subtitle: "Best Value • Bulk Savings",
    size: "5 Litre",
    price: 349900,
    image: "/assets/product_6-5L_jpg.webp"
  }
];

export default function Bestsellers() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  
  const handleAddWithLoading = (p: any) => {
    setLoading(prev => ({ ...prev, ['add_'+p.id]: true }));
    setTimeout(() => {
      handleAddToCart(p);
      setLoading(prev => ({ ...prev, ['add_'+p.id]: false }));
      toast.success(`Added ${p.title} to cart`);
    }, 400);
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
              <div className="text-sm font-medium text-white/80 mb-6 tracking-wide drop-shadow-sm">
                Home &nbsp;&gt;&nbsp; <span className="text-white font-bold">Shop</span>
              </div>
              <span className="text-xs font-bold text-white/90 uppercase tracking-widest mb-3 block drop-shadow-sm">Our Bestsellers</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_60%)]">Namo Narayana Favourites</h2>
              <p className="text-white/90 max-w-xl text-base md:text-lg mb-8 drop-shadow-md font-medium">
                Pure essentials from our farms to your home. Traditional. Nourishing. For a healthier tomorrow.
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/collections/all-products" className="bg-white text-[#1E3A24] px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg">All Products</Link>
                <Link href="/collections/ghee" className="bg-black/30 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full text-sm font-semibold hover:bg-black/50 transition-colors shadow-lg">Pure A2 Ghee</Link>
              </div>
            </div>
            
            <div
              className="hidden lg:flex lg:w-1/3 justify-end items-center pr-8 xl:pr-12"
            >
              <div className="text-white text-4xl lg:text-5xl font-serif italic font-light leading-tight drop-shadow-lg [text-shadow:_0_4px_12px_rgb(0_0_0_/_80%)]">
                Good <br/> Food <br/> Brighter <br/> Days
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
                  <h3 className="font-serif text-3xl font-bold text-[#1E3A24] mb-2 drop-shadow-sm">Available Now</h3>
                  <p className="text-[#364935] font-medium text-sm md:text-base">Pure A2 Ghee, traditionally crafted and ready to nourish your family.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Leaf className="w-6 h-6 text-[#1E3A24]" />
                    <span className="text-xs font-bold text-[#1E3A24] leading-tight">A2 Gir Cow<br/>Milk</span>
                  </div>
                  <div className="w-px h-8 bg-[#C2C7BB]" />
                  <div className="flex items-center gap-3">
                    <Droplets className="w-6 h-6 text-[#C38936]" />
                    <span className="text-xs font-bold text-[#1E3A24] leading-tight">Bilona<br/>Churned</span>
                  </div>
                  <div className="w-px h-8 bg-[#C2C7BB]" />
                  <div className="flex items-center gap-3">
                    <Leaf className="w-6 h-6 text-[#1E3A24]" />
                    <span className="text-xs font-bold text-[#1E3A24] leading-tight">Farm Fresh<br/>& Natural</span>
                  </div>
                </div>
              </div>
              
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {gheeProducts.map((p) => (
                  <div key={p.id} className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-white/60 flex flex-col h-full group">
                    <Link href={`/products/${p.slug}`} className="relative aspect-square w-full bg-[#F7F4EB] p-6 flex items-center justify-center overflow-hidden block">
                      <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 left-4 z-10">
                        <span className={cn("text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm", p.badgeColor)}>
                          {p.badge}
                        </span>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); handleFavorite(p.id); }} className="absolute top-4 right-4 z-10 p-2 text-white hover:text-[#C38936] transition-colors drop-shadow-md">
                        <Heart className="w-6 h-6" />
                      </button>
                    </Link>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <Link href={`/products/${p.slug}`}>
                        <h4 className="font-serif font-bold text-lg text-[#1E3A24] mb-1 group-hover:text-[#C38936] transition-colors">{p.title}</h4>
                      </Link>
                      <p className="text-xs text-[#576B55] mb-4">{p.subtitle}</p>
                      
                      <div className="relative mb-4">
                        <select className="w-full appearance-none bg-white border border-[#D5D8D0] text-[#364935] text-sm rounded-md px-3 py-2 pr-8 focus:outline-none focus:border-[#1E3A24] cursor-pointer" defaultValue={p.size}>
                          <option value={p.size}>{p.size}</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#576B55] pointer-events-none" />
                      </div>
                      
                      <div className="font-bold text-xl text-[#1E3A24] mb-5">{formatPrice(p.price)}</div>
                      
                      <button 
    onClick={() => handleAddWithLoading(p)}
    disabled={loading['add_'+p.id]}
    className="mt-auto w-full bg-[#1E3A24] text-white rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-[#152919] active:scale-95 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed"
  >
    {loading['add_'+p.id] ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
    {loading['add_'+p.id] ? "Adding..." : "Add to Cart"}
  </button>
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
