"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Heart } from "lucide-react";

export default function CinematicCTA() {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden flex items-center">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-black">
        <Image
          src="/assets/hero-new-cows.jpg"
          alt="Namo Narayana Farm"
          fill
          className="object-cover object-right opacity-60 mix-blend-overlay"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40 z-0" />
      </div>

      {/* Product Image Overlay (Left) */}
      <div
        className="absolute bottom-0 left-[5%] md:left-[10%] w-64 h-64 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem] z-10 hidden sm:block"
      >
        <Image
          src="/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"
          alt="Namo Narayana A2 Gir Cow Ghee"
          fill
          className="object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Gradients to blend top edge to previous section and bottom edge to footer */}
      <div className="absolute inset-x-0 top-0 h-32 z-10 bg-gradient-to-b from-[#F2EFE8] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-48 z-10 bg-gradient-to-t from-[#092B1C] to-transparent pointer-events-none" />
      
      {/* Script Text */}
      <div
        className="absolute top-16 right-12 hidden lg:block text-[#F2C94C] text-3xl md:text-4xl font-serif italic font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] rotate-[-10deg] z-20"
      >
        Good Food <br/> Brighter Tomorrows
      </div>

      {/* Content */}
      <div className="nn-container relative z-20 w-full h-full flex flex-col justify-center sm:pl-[40%] lg:pl-[45%] pb-16">
        <div
          className="max-w-xl"
        >
          <span className="text-[10px] md:text-xs font-bold text-[#F2C94C] uppercase tracking-[0.3em] mb-4 block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Pure Tradition. Real Nourishment.
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">
            Bring Namo Narayana <br className="hidden md:block"/>
            <span className="italic text-[#F2C94C] font-light">to your table.</span>
          </h2>
          <p className="text-white text-base md:text-lg mb-8 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-lg">
            Experience the authentic taste of traditionally made A2 Gir Cow Ghee and other natural products, crafted with care and devotion.
          </p>
          <Link href="/collections/all-products" className="inline-flex items-center justify-center gap-2 bg-[#F2C94C] text-[#092B1C] rounded-lg px-8 py-3.5 font-bold hover:bg-[#E2B93C] transition-all w-max shadow-xl group">
            Shop Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Bottom Features Strip over the dark gradient */}
      <div className="absolute bottom-8 right-0 left-0 sm:left-[40%] lg:left-[45%] z-30 px-6 sm:px-0">
        <div
          className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-start sm:items-center"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm">Tradition in<br/>every jar</span>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/20" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm">Nourishment<br/>for generations</span>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/20" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm">A healthier<br/>Bharat</span>
          </div>
        </div>
      </div>
    </section>
  );
}
