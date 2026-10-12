"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import MediaRenderer, { HeroMedia } from "./MediaRenderer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Leaf, Droplets, ShieldCheck, Heart, ArrowRight } from "lucide-react";

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
              {/* Eyebrow */}
              <div
                className="flex items-center gap-2 mb-6"
              >
                <Leaf className="text-white w-5 h-5 drop-shadow-md" />
                <span className="text-sm font-bold tracking-widest text-white uppercase drop-shadow-md">Pure. Traditional. Natural.</span>
              </div>
              
              {/* Headline */}
              <h1
                className="font-serif text-white text-5xl md:text-[80px] leading-[1.05] tracking-tight font-bold mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]"
              >
                <span className="italic font-normal">Real</span> Ghee<br/>
                <span className="italic font-normal">for a</span> Healthier<br/>
                Tomorrow
              </h1>

              {/* Subtitle */}
              <p
                className="text-white max-w-[480px] text-base md:text-lg mb-10 leading-relaxed drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] [text-shadow:_0_1px_2px_rgb(0_0_0_/_100%)] font-semibold"
              >
                Crafted from the milk of indigenous Gir cows using the age-old Bilona method. Just pure, nutrient-rich goodness - the way it was always meant to be.
              </p>

              {/* Badges/Icons */}
              <div
                className="flex flex-wrap items-center gap-4 md:gap-8 mb-10"
              >
                {[
                  { icon: Leaf, label: "100%\nNatural" },
                  { icon: Droplets, label: "A2 Gir\nCow Milk" },
                  { icon: Heart, label: "Bilona\nChurned" },
                  { icon: ShieldCheck, label: "No Artificial\nPreservatives" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-white text-center leading-tight drop-shadow-md whitespace-pre-line">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div
              >
                <Link href="/collections/ghee" className="bg-[#243E2C] text-white rounded-full px-8 py-4 font-semibold text-lg hover:bg-[#1A2C20] transition-colors flex items-center gap-3 shadow-xl">
                  Shop A2 Gir Cow Ghee <ArrowRight className="w-5 h-5" />
                </Link>
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

            {/* Right side floating elements (visible on large screens) */}
            <div className="hidden lg:block absolute right-12 top-1/3 transform -rotate-6 text-white text-5xl font-serif italic font-light drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] [text-shadow:_0_2px_4px_rgb(0_0_0_/_100%)] text-center leading-tight opacity-100">
              Goodness <br/> from our farms <br/> to your home <Heart className="inline w-8 h-8 text-white ml-2 fill-white/40 drop-shadow-lg"/>
            </div>

            <div className="hidden lg:flex absolute right-12 bottom-24 w-32 h-32 rounded-full border border-dashed border-white/60 items-center justify-center bg-black/10 backdrop-blur-sm">
              <div className="w-28 h-28 rounded-full border border-white/80 flex flex-col items-center justify-center text-center p-4 text-white text-[9px] uppercase tracking-[0.2em] font-semibold">
                Traditionally<br/>Crafted
                <Leaf className="my-1.5 w-4 h-4 text-white" />
                Naturally<br/>Yours
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar below hero */}
      <div className="bg-[#F7F4EB] py-8 border-b border-[#E9E5D9]">
        <div className="nn-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-[#E9E5D9]">
            {[
              { icon: Leaf, title: "Farm Fresh", desc: "Sourced directly from our farms" },
              { icon: ShieldCheck, title: "Lab Tested", desc: "For purity & safety" },
              { icon: Heart, title: "Free Shipping", desc: "Across India" },
              { icon: Droplets, title: "10 Lakh+ Homes", desc: "Trust Namo Narayana" }
            ].map((item, idx) => (
              <div key={idx} className={cn("flex flex-col items-center text-center px-4", idx % 2 === 0 ? "border-l-0" : "", idx === 0 ? "md:border-l-0" : "")}>
                <item.icon className="w-8 h-8 text-[#364935] mb-3" strokeWidth={1.5} />
                <h4 className="text-[#364935] font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-[#576B55] text-xs font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
