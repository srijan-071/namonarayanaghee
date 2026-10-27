"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "1 Litre Bestseller",
    subtitle: "Bilona Churned • Pure & Traditional",
    href: "/products/pure-desi-cow-ghee-1-litre",
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp",
    badge: "MOST POPULAR",
    badgeColor: "bg-[#C38936] text-white",
  },
  {
    title: "2.5 Litre Value Pack",
    subtitle: "Bilona Churned • Great for Families",
    href: "/products/pure-desi-cow-ghee-2-5-litre",
    image: "/assets/product_6-2p5_jpg.webp",
    badge: "VALUE PACK",
    badgeColor: "bg-[#8A1B14] text-white",
  },
  {
    title: "5 Litre Family Pack",
    subtitle: "Pure Desi Goodness in Bulk",
    href: "/products/pure-desi-cow-ghee-5-litre",
    image: "/assets/product_6-5L_jpg.webp",
    badge: "BEST VALUE",
    badgeColor: "bg-[#C38936] text-white",
  },
  {
    title: "500 ml Starter Pack",
    subtitle: "Perfect to begin your journey",
    href: "/products/pure-desi-cow-ghee-500-ml",
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp",
    badge: "STARTER PACK",
    badgeColor: "bg-[#8A1B14] text-white",
  }
];

export default function CategoryExperience() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#FAF9F5] to-[#F7F4EB] overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-multiply pointer-events-none">
        <Image src="/assets/hero-new-cows.jpg" alt="Cows background" fill className="object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7F4EB] via-[#F7F4EB]/80 to-transparent" />
      </div>

      <div className="nn-container relative z-10">
        
        {/* Header Section */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold text-[#C38936] uppercase tracking-[0.2em] mb-4 block">Choose Your Pack</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#5E0B10] mb-4">Shop by Size</h2>
            <p className="text-[#4A352F] text-base md:text-lg">
              Pure A2 Gir Cow Ghee crafted for every kitchen. Choose what fits your home.
            </p>
          </div>
          <div className="hidden lg:block text-[#7A4A3B] text-3xl md:text-4xl font-serif italic font-light leading-tight drop-shadow-sm text-right mt-6 md:mt-0 opacity-70">
            Good <br/> Food <br/> Brighter <br/> Days
          </div>
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <div
              key={cat.href}
            >
              <Link 
                href={cat.href}
                className="group relative flex flex-col h-72 md:h-[340px] w-full overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 border border-[#E9E5D9]"
              >
                <div className="absolute inset-0 z-0 bg-[#E8E4D9]">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    quality={90}
                  />
                </div>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-90" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-sm shadow-sm ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-20 mt-auto p-5 w-full flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white leading-tight mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-white/80 text-xs font-medium">{cat.subtitle}</p>
                  </div>
                  
                  {/* Arrow Button */}
                  <div className="w-10 h-10 rounded-full border border-white/40 backdrop-blur-sm flex items-center justify-center text-white shrink-0 group-hover:bg-[#C38936] group-hover:border-[#C38936] group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
