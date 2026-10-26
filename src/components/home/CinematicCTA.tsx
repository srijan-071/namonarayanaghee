"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Heart, Sparkles } from "lucide-react";
import DiwaliDiya from "@/components/ui/DiwaliDiya";

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
        className="absolute top-16 right-12 hidden lg:block text-[#F2C94C] text-3xl md:text-4xl font-serif italic font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] rotate-[-10deg] z-20 text-right"
      >
        Shubh Deepavali <br/> Pure Blessings ✨
      </div>

      {/* Content */}
      <div className="nn-container relative z-20 w-full h-full flex flex-col justify-center sm:pl-[40%] lg:pl-[45%] pb-16">
        <div
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-2 bg-[#5E0B10]/80 border border-amber-400/50 rounded-full px-3.5 py-1 mb-4 shadow-md">
            <DiwaliDiya size={16} glow={false} />
            <span className="text-[10px] md:text-xs font-bold text-amber-300 uppercase tracking-[0.2em]">
              शुभ दीपावली महोत्सव • SPECIAL OFFERS
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">
            Celebrate Diwali with <br className="hidden md:block"/>
            <span className="italic text-[#F2C94C] font-light">Unmatched Vedic Purity.</span>
          </h2>
          <p className="text-amber-100 text-base md:text-lg mb-8 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-lg">
            This festive season, illuminate your home and sweeten your gatherings with genuine A2 Gir Cow Bilona Ghee. Use code <strong className="text-amber-300 underline">DIWALI</strong> for an instant 10% discount!
          </p>
          <Link href="/#diwali-specials" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#092B1C] rounded-full px-8 py-4 font-black transition-all w-max shadow-2xl group hover:scale-105 active:scale-95">
            <DiwaliDiya size={18} glow={false} />
            <span>Order Diwali Hampers</span>
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
