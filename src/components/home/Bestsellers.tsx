"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Heart, Bell, ShoppingCart, ChevronDown, Leaf, Droplets, Lock } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";

// Actual products data
const allProducts = [
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
    price: 115150,
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
    price: 271950,
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
    subtitle: "Perfect to Begin Your Journey",
    size: "5 Litre",
    price: 514500,
    image: "/assets/product_6-5L_jpg.webp"
  },
  {
    id: 9545126379688,
    variantId: 55811950706856,
    slug: 'besan',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Besan',
    variantTitle: 'Default Title',
    subtitle: 'Freshly packed',
    size: '1 Kg',
    price: 10500,
    image: '/assets/product_Besan.webp'
  },
  {
    id: 9545039282344,
    variantId: 55811323461800,
    slug: 'black-mustard-oil',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Black Mustard Oil',
    variantTitle: 'Default Title',
    subtitle: 'Cold Pressed • Bold Flavour',
    size: '1 Litre',
    price: 21000,
    image: '/assets/product_blackmusterd.webp'
  },
  {
    id: 9545038823592,
    variantId: 55811323363496,
    slug: 'coconut-oil',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Coconut Oil',
    variantTitle: 'Default Title',
    subtitle: 'Pure • Natural • Versatile',
    size: '1 Litre',
    price: 28000,
    image: '/assets/product_coconutoil.webp'
  },
  {
    id: 9545045147816,
    variantId: 55811350495400,
    slug: 'honey',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Honey',
    variantTitle: 'Default Title',
    subtitle: 'Nature\'s Sweetener',
    size: '500g',
    price: 31500,
    image: '/assets/product_honey.webp'
  },
  {
    id: 9545042329768,
    variantId: 55811334865064,
    slug: 'jaggery-powder',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Jaggery Powder',
    variantTitle: 'Default Title',
    subtitle: 'Desi Goodness • Rich in Nutrients',
    size: '1 Kg',
    price: 14000,
    image: '/assets/product_jaggery.webp'
  },
  {
    id: 9545130180776,
    variantId: 55811961356456,
    slug: 'khapli-atta',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Khapli Atta',
    variantTitle: 'Default Title',
    subtitle: 'Ancient Grain • Wholesome',
    size: '5 Kg',
    price: 17500,
    image: '/assets/product_Khapliatta.webp'
  },
  {
    id: 9545055633576,
    variantId: 55811410919592,
    slug: 'multi-grain-atta',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Multi Grain Atta',
    variantTitle: 'Default Title',
    subtitle: 'Nutritious • Everyday Essential',
    size: '5 Kg',
    price: 12600,
    image: '/assets/product_Multigrainatta.webp'
  },
  {
    id: 9545127887016,
    variantId: 55811956211880,
    slug: 'pickle',
    badge: 'NEW',
    badgeColor: 'bg-[#C38936]',
    title: 'Pickle',
    variantTitle: 'Default Title',
    subtitle: 'Traditional Taste • Homemade Style',
    size: '400g',
    price: 15400,
    image: '/assets/product_pickle.webp'
  }
];
export default function Bestsellers() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  
  const handleNotify = (id: number | string, name: string) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [id]: false }));
      toast.success(`You'll be notified when ${name} is back in stock!`);
    }, 600);
  };
  
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

  const handleAddToCart = (p: typeof allProducts[0]) => {
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
                <Link href="#" className="bg-white text-[#1E3A24] px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg">All Products</Link>
                <Link href="#" className="bg-black/30 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full text-sm font-semibold hover:bg-black/50 transition-colors shadow-lg">Ghee</Link>
                <Link href="#" className="bg-black/30 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full text-sm font-semibold hover:bg-black/50 transition-colors shadow-lg">Oils</Link>
                <Link href="#" className="bg-black/30 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full text-sm font-semibold hover:bg-black/50 transition-colors shadow-lg">Honey</Link>
                <Link href="#" className="bg-black/30 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full text-sm font-semibold hover:bg-black/50 transition-colors shadow-lg">Pantry</Link>
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
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {allProducts.map((p) => (
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
