"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Award, Sparkles, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-8 pb-14 md:pt-16 md:pb-24 border-b border-[#E5DEC9]/60">
      <div className="nn-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col text-left">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 bg-[#EAE3D2]/80 border border-[#D5C9AF] text-[#1E3A24] text-xs font-semibold px-3.5 py-1 rounded-full w-fit mb-5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#2D5A37] animate-pulse" />
              <span>Official Store • FSSAI Lic. 20824005000185</span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#142918] font-bold tracking-tight leading-[1.15] mb-5">
              Namo Narayana <br className="hidden sm:inline" />
              <span className="text-[#2D5A37]">A2 Gir Cow Ghee</span>
            </h1>

            {/* Concise Supporting Description */}
            <p className="text-base sm:text-lg text-[#3D4A41] leading-relaxed max-w-2xl mb-6">
              Traditional curd-churned Bilona ghee handcrafted from indigenous Gir cows. Cultured from whole milk curd, slow-simmered over low flame, and laboratory-verified for &gt;99.5% pure milk fat with zero adulteration.
            </p>

            {/* Verification Proof Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 text-xs font-medium text-[#1C241F]">
              <div className="flex items-center gap-2 bg-white/80 border border-[#E5DEC9] p-2.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A37] shrink-0" />
                <span>Curd-Churned Bilona</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 border border-[#E5DEC9] p-2.5 rounded-xl shadow-2xs">
                <Award className="w-4 h-4 text-[#C99A3D] shrink-0" />
                <span>NABL Lab Batch-Tested</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 border border-[#E5DEC9] p-2.5 rounded-xl shadow-2xs col-span-2 sm:col-span-1">
                <ShieldCheck className="w-4 h-4 text-[#2D5A37] shrink-0" />
                <span>Free Pan-India Delivery</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/#bestsellers"
                className="inline-flex items-center justify-center gap-2.5 bg-[#1E3A24] hover:bg-[#142918] active:scale-[0.98] text-[#FFFDF8] font-semibold text-base py-3.5 px-7 rounded-xl transition-all shadow-md group cursor-pointer"
              >
                <span>Shop Ghee</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/a2-ghee-guide"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F0] border border-[#D5C9AF] text-[#1E3A24] font-semibold text-base py-3.5 px-6 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                <span>Explore the Bilona Process</span>
              </Link>
            </div>

            {/* Real Checkout Terms Line */}
            <p className="text-xs text-[#6B7870] mt-4 flex items-center gap-2">
              <span className="font-semibold text-[#1E3A24]">Prepay &amp; Save ₹100</span>
              <span>•</span>
              <span>Transparent COD (₹250 booking advance)</span>
              <span>•</span>
              <span>Batch NMO-260722</span>
            </p>

          </div>

          {/* Right Column: Authentic Product Visual (High-priority LCP) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-[#F2ECE0] to-[#EAE2D2] p-4 shadow-xl border border-[#D5C9AF]/80">
              <Image
                src="/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
                alt="Namo Narayana Pure A2 Gir Cow Ghee 1 Litre Jar"
                fill
                priority
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-contain p-2 hover:scale-105 transition-transform duration-500"
              />
              
              {/* Authenticity Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border border-[#E5DEC9] p-3 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#2D5A37] font-bold uppercase tracking-wider block">
                    100% Curd-Churned
                  </span>
                  <span className="font-serif font-bold text-sm text-[#142918]">
                    Pure A2 Gir Cow Ghee
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400 line-through block">₹3,299</span>
                  <span className="text-sm font-bold text-[#1E3A24]">₹1,299 / 1L</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
