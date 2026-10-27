"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import MediaRenderer, { HeroMedia } from "./MediaRenderer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Leaf, Droplets, ShieldCheck, Heart, ArrowRight, Sparkles, Gift, Flame, Truck } from "lucide-react";
import DiwaliDiya from "@/components/ui/DiwaliDiya";

interface Props {
  slides: HeroMedia[];
  autoPlayInterval?: number; // Defaults to 8000ms
}

export default function HeroCarousel({ slides, autoPlayInterval = 8000 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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
              {/* Eyebrow with Diya */}
              <div className="inline-flex items-center gap-2.5 bg-[#5E0B10]/85 border border-amber-400/60 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md shadow-lg">
                <DiwaliDiya size={20} glow={true} />
                <span className="text-xs sm:text-sm font-bold tracking-widest text-amber-300 uppercase">
                  शुभ दीपावली महोत्सव • SPECIAL FESTIVE SALE
                </span>
              </div>
              
              {/* Headline */}
              <h1
                className="font-serif text-white text-4xl sm:text-5xl md:text-[74px] leading-[1.08] tracking-tight font-bold mb-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]"
              >
                Light Up Your <br/>
                <span className="diwali-shimmer italic font-normal">Diwali With Purity</span>
              </h1>

              {/* Subtitle */}
              <p
                className="text-amber-50 max-w-[500px] text-base md:text-lg mb-8 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] font-medium"
              >
                Sacred A2 Gir Cow Bilona Ghee for your Akhand Diya, festive mithai, and auspicious family gifting. Handcrafted using ancient Vedic traditions — 100% pure &amp; unadulterated.
              </p>

              {/* Badges/Icons for Diwali */}
              <div
                className="flex flex-wrap items-center gap-3 sm:gap-6 mb-8"
              >
                {[
                  { icon: Flame, label: "Akhand Diya\nPurity" },
                  { icon: Droplets, label: "Vedic Bilona\nChurned" },
                  { icon: Heart, label: "Pure Festive\nMithai" },
                  { icon: Gift, label: "Free Festive\nOils & Gifts" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border border-amber-400/50 flex items-center justify-center bg-black/40 backdrop-blur-sm shadow-md">
                      <item.icon className="w-5 h-5 text-amber-300" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-100 text-center leading-tight drop-shadow-md whitespace-pre-line">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link 
                  href="/#diwali-specials" 
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-full px-8 py-4 font-extrabold text-base md:text-lg transition-all flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95"
                >
                  <DiwaliDiya size={20} glow={false} />
                  <span>Shop Diwali Specials</span>
                  <ArrowRight className="w-5 h-5 text-stone-900" />
                </Link>

                <div className="bg-black/50 backdrop-blur-md border border-amber-400/40 rounded-full px-5 py-3 text-xs md:text-sm text-amber-200 font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Use Code: <span className="text-white underline font-black">DIWALI</span> for 10% OFF</span>
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

            {/* Right side floating Diwali Seal */}
            <div className="hidden lg:flex flex-col items-center absolute right-8 xl:right-16 top-1/4 z-20">
              <div className="bg-[#4E0E12]/90 border-2 border-amber-400/70 rounded-3xl p-7 backdrop-blur-md shadow-2xl text-center max-w-[280px] text-white animate-festive-float">
                <DiwaliDiya size={48} className="mx-auto mb-3" />
                <span className="text-amber-300 font-serif text-2xl font-bold block mb-0.5">शुभ दीपावली</span>
                <span className="text-[11px] text-amber-100/90 font-bold uppercase tracking-widest block mb-3">Festival of Lights</span>
                <p className="border-t border-amber-400/30 pt-3 text-xs text-amber-100 leading-relaxed">
                  Bring divine light, health &amp; prosperity into your home with 100% Pure A2 Gir Cow Ghee.
                </p>
                <div className="mt-4 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 text-[11px] font-black py-2 px-3 rounded-xl uppercase tracking-wider shadow-md">
                  ✨ Extra 10% OFF + Gifts
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar below hero with Diwali accents */}
      <div className="bg-[#FCFAF5] py-7 border-b border-[#E9E5D9] shadow-inner">
        <div className="nn-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-amber-200">
            {[
              { icon: Flame, title: "Akhand Diya Purity", desc: "Clean golden flame, zero soot" },
              { icon: ShieldCheck, title: "Lab Tested 100% Pure", desc: "Free from adulteration & chemicals" },
              { icon: Gift, title: "Diwali Free Gifts", desc: "Cold-pressed oils with ghee packs" },
              { icon: Truck, title: "Guaranteed Delivery", desc: "Dispatched fast for Diwali Puja" }
            ].map((item, idx) => (
              <div key={idx} className={cn("flex flex-col items-center text-center px-4", idx % 2 === 0 ? "border-l-0" : "", idx === 0 ? "md:border-l-0" : "")}>
                <item.icon className="w-7 h-7 text-[#8A1B14] mb-2" strokeWidth={1.75} />
                <h4 className="text-[#5E0B10] font-bold text-sm mb-0.5">{item.title}</h4>
                <p className="text-[#7A4A3B] text-xs font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
