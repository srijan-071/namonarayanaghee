"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import MediaRenderer, { HeroMedia } from "./MediaRenderer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Leaf, Droplets, ShieldCheck, Heart, ArrowRight, Sparkles, Gift, Flame, Truck } from "lucide-react";

interface Props {
  slides: HeroMedia[];
  autoPlayInterval?: number; // Defaults to 8000ms
}

export default function HeroCarousel({ slides, autoPlayInterval = 8000 }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    router.prefetch("/checkout");
  }, [router]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Autoplay handling
  useEffect(() => {
    if (slides.length <= 1) return;
    if (isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval, isHovered, slides.length]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!slides || slides.length === 0) return null;

  return (
    <>
      <section 
        className="relative w-full h-[85vh] min-h-[600px] overflow-hidden group focus:outline-none bg-[#F7F4EB]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
      >
        {/* Background Slider */}
        
          <div
            key={currentIndex}
            className="absolute inset-0 w-full h-full z-0"
          >
            <div 
              className="w-full h-full"
            >
              <MediaRenderer media={slides[currentIndex]} isActive={true} priority={true} />
              {/* Dark overlay for legibility */}
              <div className="absolute inset-0 bg-black/70 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
            </div>
          </div>
        

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 w-full h-full flex flex-col justify-center">
          <div className="nn-container w-full h-full relative">
            <div className="flex flex-col items-start justify-center h-full max-w-2xl pt-12 md:pt-0">
              {/* Eyebrow: Elvish Yadav × Vedic Bilona Branding */}
              <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#064E3B]/90 via-[#0A1612]/90 to-[#032B1D]/90 border border-emerald-400/50 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md shadow-lg">
                <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="text-xs sm:text-sm font-bold tracking-widest text-emerald-200 uppercase">
                  ELVISH YADAV × VEDIC BILONA METHOD • 100% DESI GIR COW GHEE
                </span>
              </div>
              
              {/* Headline */}
              <h1
                className="font-serif text-white text-4xl sm:text-5xl md:text-[72px] leading-[1.06] tracking-tight font-bold mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
              >
                A Tradition Worth <br/>
                <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7B4] via-[#D4AF37] to-[#F7E7B4] drop-shadow-sm">
                  Bringing Home
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className="text-emerald-50/90 max-w-[520px] text-base md:text-lg mb-8 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] font-medium"
              >
                Handcrafted from indigenous, free-grazing Gir cows using the sacred curd-churned wooden Bilona method. 100% pure golden granules with verified A2 beta-casein nutrients, direct from our Vedic Gaushala.
              </p>

              {/* Badges/Icons */}
              <div
                className="flex flex-wrap items-center gap-3 sm:gap-6 mb-8"
              >
                {[
                  { icon: Droplets, label: "Vedic Bilona\nChurned" },
                  { icon: ShieldCheck, label: "Lab Tested\n100% Pure" },
                  { icon: Sparkles, label: "Golden Grainy\nDanedar" },
                  { icon: Truck, label: "Pan-India\nFast Express" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border border-emerald-400/40 flex items-center justify-center bg-black/40 backdrop-blur-sm shadow-md">
                      <item.icon className="w-5 h-5 text-emerald-300" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-100 text-center leading-tight drop-shadow-md whitespace-pre-line">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link 
                  href="/collections/ghee" 
                  className="bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:from-[#34D399] hover:to-[#059669] text-white rounded-full px-8 py-4 font-extrabold text-base md:text-lg transition-all flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 border border-emerald-300/40"
                >
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>Explore Ghee Collection</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </Link>

                <div className="bg-gradient-to-r from-[#062419]/80 to-[#0B1A14]/80 backdrop-blur-md border border-emerald-400/40 rounded-full px-5 py-3 text-xs md:text-sm text-emerald-200 font-bold flex items-center gap-2 shadow-md">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Use Code: <span className="text-white underline font-black">NAMO10</span> for 10% OFF</span>
                </div>
              </div>
              
              {/* Navigation Arrows & Progress */}
              <div className="flex items-center gap-4 mt-12 text-white">
                <button onClick={prevSlide} className="p-2 hover:bg-white/20 rounded-full transition-colors border border-white/40" aria-label="Previous slide">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <div className="flex items-center gap-3 font-medium text-sm tracking-widest">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }}
                      className={cn("transition-colors duration-300", index === currentIndex ? "text-white underline underline-offset-4" : "text-white/50 hover:text-white")}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
                <button onClick={nextSlide} className="p-2 hover:bg-white/20 rounded-full transition-colors border border-white/40" aria-label="Next slide">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right side floating Vedic Purity Seal */}
            <div className="hidden lg:flex flex-col items-center absolute right-8 xl:right-16 top-1/4 z-20">
              <div className="bg-gradient-to-b from-[#0A1612]/95 via-[#063024]/95 to-[#042018]/95 border-2 border-emerald-400/60 rounded-3xl p-7 backdrop-blur-md shadow-2xl text-center max-w-[285px] text-white">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-400/20 border border-emerald-400/60 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-emerald-300" />
                </div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7B4] via-[#D4AF37] to-[#F7E7B4] font-serif text-2xl font-bold block mb-0.5">Vedic Purity</span>
                <span className="text-[11px] text-emerald-200 font-bold uppercase tracking-widest block mb-1">Elvish Yadav Endorsed</span>
                <span className="text-[10px] text-emerald-300/80 uppercase tracking-wider block mb-3">100% Desi Gir Cow Ghee</span>
                <p className="border-t border-emerald-400/30 pt-3 text-xs text-emerald-100/90 leading-relaxed font-sans">
                  Crafted strictly from whole Gir cow curd using the bidirectional wooden Bilona method. Lab tested &amp; pure.
                </p>
                <div className="mt-4 bg-gradient-to-r from-[#D4AF37] to-[#F5BD47] text-stone-950 text-[11px] font-black py-2 px-3 rounded-xl uppercase tracking-wider shadow-md">
                  Pan-India Express Dispatch
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar below hero: Light Mode Obsidian Emerald Gradient */}
      <div className="bg-gradient-to-r from-[#FAF8F5] via-[#F4F9F6] to-[#FAF8F5] py-7 border-b border-emerald-900/10 shadow-xs">
        <div className="nn-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-emerald-900/10">
            {[
              { icon: Droplets, title: "Traditional Bilona Churned", desc: "Curd-churned with wooden bi-directional churner" },
              { icon: ShieldCheck, title: "Lab Tested 100% Pure", desc: "Free from adulteration, chemicals & preservatives" },
              { icon: Gift, title: "Complimentary Oils", desc: "Cold-pressed oils included on selected packs" },
              { icon: Truck, title: "Free Pan-India Delivery", desc: "Dispatched fresh directly from our Vedic Gaushala" }
            ].map((item, idx) => (
              <div key={idx} className={cn("flex flex-col items-center text-center px-4", idx % 2 === 0 ? "border-l-0" : "", idx === 0 ? "md:border-l-0" : "")}>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-100/80 to-emerald-50/80 flex items-center justify-center mb-2.5 border border-emerald-300/40 shadow-2xs">
                  <item.icon className="w-6 h-6 text-[#059669]" strokeWidth={1.85} />
                </div>
                <h4 className="text-[#064E3B] font-bold text-sm mb-0.5">{item.title}</h4>
                <p className="text-[#4B5548] text-xs font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
