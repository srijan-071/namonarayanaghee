"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Heart, Droplets, Ban, Users, Hexagon } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#F7F4EB] to-white overflow-hidden">
      <div className="nn-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Our Signature */}
          <div
            className="relative bg-[#E9DFD1] rounded-[2rem] overflow-hidden p-8 md:p-12 pb-0 flex flex-col min-h-[500px] z-10"
          >
            <span className="text-[11px] font-bold text-[#C38936] uppercase tracking-[0.2em] mb-4">Our Signature</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1E3A24] mb-3">
              100% A2 Gir Cow Ghee
            </h2>
            <p className="text-[#364935] text-lg mb-8">
              Pure by nature. Powerful for your family.
            </p>
            
            <div className="space-y-5 relative z-20 w-full sm:w-2/3 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full border border-[#1E3A24]/30 flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4 text-[#1E3A24]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E3A24] text-sm">No Preservatives</h4>
                  <p className="text-xs text-[#576B55]">Just pure goodness</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full border border-[#1E3A24]/30 flex items-center justify-center shrink-0">
                  <Ban className="w-4 h-4 text-[#1E3A24]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E3A24] text-sm">No Artificial Colours</h4>
                  <p className="text-xs text-[#576B55]">Truly natural</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full border border-[#1E3A24]/30 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-[#1E3A24]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E3A24] text-sm">Rich in Nutrients</h4>
                  <p className="text-xs text-[#576B55]">Supporting your family&apos;s wellness</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full border border-[#1E3A24]/30 flex items-center justify-center shrink-0">
                  <Droplets className="w-4 h-4 text-[#1E3A24]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E3A24] text-sm">Traditional Bilona Method</h4>
                  <p className="text-xs text-[#576B55]">As described in Ayurveda</p>
                </div>
              </div>
            </div>

            <Link href="/collections/ghee" className="inline-flex items-center justify-center gap-2 bg-[#1E3A24] text-white rounded-lg px-6 py-3 font-medium text-sm hover:bg-[#152919] transition-all w-max shadow-md relative z-30 mb-8 sm:mb-0">
              Explore A2 Ghee
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Absolute positioning for Ghee Jar & Stamp */}
            <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-[22rem] sm:h-[22rem] lg:w-[24rem] lg:h-[24rem] z-10 rounded-tl-[4rem] border-t-8 border-l-8 border-[#E9DFD1] overflow-hidden shadow-2xl">
              <Image 
                src="/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp" 
                alt="A2 Gir Cow Ghee" 
                fill 
                className="object-cover object-bottom"
              />
            </div>
            
            {/* The circular stamp and cursive text */}
            <div className="absolute top-1/2 -translate-y-1/2 right-12 hidden sm:flex flex-col items-center">
              <div className="relative w-28 h-28 border-[1.5px] border-[#C38936] rounded-full flex items-center justify-center mb-4">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full rotate-[-45deg] animate-[spin_30s_linear_infinite]">
                  <path id="curve" d="M 10 50 A 40 40 0 1 1 90 50 A 40 40 0 1 1 10 50" fill="transparent"/>
                  <text className="text-[12px] font-bold uppercase tracking-widest fill-[#C38936]">
                    <textPath href="#curve">BILONA CHURNED • A2 GIR COW MILK •</textPath>
                  </text>
                </svg>
                <Droplets className="w-8 h-8 text-[#1E3A24]" />
              </div>
              <div className="text-[#364935] text-2xl font-serif italic font-light drop-shadow-sm rotate-[-5deg] mt-6 text-center">
                Same<br/>Tradition<br/>Newer<br/>Generations
              </div>
            </div>
          </div>
          
          {/* Right Column: Our Story */}
          <div
            className="flex flex-col justify-center px-4 lg:px-0"
          >
            <span className="text-[11px] font-bold text-[#C38936] uppercase tracking-[0.2em] mb-4">Our Story</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E3A24] mb-6 leading-tight">
              Rooted in pure tradition.<br/>The Official Store.
            </h2>
            <div className="space-y-5 text-[#364935] leading-relaxed mb-10 text-sm md:text-base">
              <p>
                At Namo Narayana, we believe that true nourishment begins at the source. Our journey started with a simple vision: to bring back the authentic, unadulterated goodness of traditional Indian foods to modern homes. This is the <strong>only official Namo Narayana store</strong>, proudly launched by Elvish Yadav.
              </p>
              <p>
                Every jar of our A2 Gir Cow Ghee is crafted using the ancient Vedic Bilona method, ensuring that the vital nutrients, natural aroma, and healing properties are preserved &mdash; just as nature intended.
              </p>
            </div>
            
            <div className="grid grid-cols-4 gap-2 border-y border-[#E9E5D9] py-8 mb-10">
              <div className="flex flex-col items-center text-center">
                <Hexagon className="w-8 h-8 text-[#1E3A24] mb-3" />
                <h5 className="font-bold text-[#1E3A24] text-xs mb-1">A2 Gir Cows</h5>
                <p className="text-[10px] text-[#576B55]">Ethically Raised</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Leaf className="w-8 h-8 text-[#1E3A24] mb-3" />
                <h5 className="font-bold text-[#1E3A24] text-xs mb-1">Chemical Free</h5>
                <p className="text-[10px] text-[#576B55]">Farming</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Heart className="w-8 h-8 text-[#1E3A24] mb-3" />
                <h5 className="font-bold text-[#1E3A24] text-xs mb-1">Tradition</h5>
                <p className="text-[10px] text-[#576B55]">Backed by Ayurveda</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users className="w-8 h-8 text-[#1E3A24] mb-3" />
                <h5 className="font-bold text-[#1E3A24] text-xs mb-1">For Healthier</h5>
                <p className="text-[10px] text-[#576B55]">Generations</p>
              </div>
            </div>

            <div>
              <Link href="/pages/our-story" className="inline-flex items-center justify-center gap-2 bg-transparent text-[#1E3A24] border border-[#1E3A24] rounded-lg px-6 py-2.5 font-medium text-sm hover:bg-[#1E3A24] hover:text-white transition-all w-max shadow-sm">
                Our Complete Story
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
