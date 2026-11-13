"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Heart, Shield, MapPin, ArrowRight } from "lucide-react";

export default function FarmSourcing() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FAF8F5] via-[#F4F8F5] to-white border-b border-emerald-900/10">
      <div className="nn-container">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Authentic Pasture Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-stone-100 border border-emerald-900/15 shadow-md">
              <Image
                src="/assets/hero-new-cows.jpg"
                alt="Indigenous Gir Cows in Haryana Gaushala Pasture"
                fill
                sizes="(min-width: 1024px) 500px, 90vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-emerald-900/10 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#059669]" />
                  <span className="text-xs font-bold text-[#0D2B1D]">Haryana &amp; Gujarat Gaushala Clusters</span>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-50 text-[#064E3B] border border-emerald-200/50 px-2 py-0.5 rounded-full">
                  Ethical Milking
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Sourcing Narrative & Governance */}
          <div className="lg:col-span-7 flex flex-col">
            
            <span className="text-xs font-bold uppercase tracking-widest text-[#059669] block mb-2">
              Traceable Origins
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0D2B1D] font-bold mb-5 tracking-tight">
              Ethical Gaushala Sourcing &amp; The Dohan Tradition
            </h2>

            <p className="text-sm sm:text-base text-[#4B5548] leading-relaxed mb-6 font-sans">
              Our dairy foundation rests upon ethical gaushala partnerships in traditional dairy belts of Haryana and Gujarat. We prioritize the welfare of indigenous Gir cows (Bos indicus), providing open grazing paddocks, clean drinking water, and seasonal green fodder.
            </p>

            <div className="space-y-4 mb-8 text-xs sm:text-sm text-[#111815]">
              <div className="flex items-start gap-3 bg-gradient-to-br from-white via-[#FAFBF9] to-[#F4F8F6] p-4 rounded-xl border border-emerald-900/10 shadow-2xs">
                <Heart className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0D2B1D] block mb-0.5">The Sacred Principle of Dohan</strong>
                  <span className="text-[#4B5548]">
                    We strictly ensure the newborn calf drinks its full nourishment first before any milk is gathered for ghee production.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gradient-to-br from-white via-[#FAFBF9] to-[#F4F8F6] p-4 rounded-xl border border-emerald-900/10 shadow-2xs">
                <Shield className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0D2B1D] block mb-0.5">Hormone &amp; Chemical Free Care</strong>
                  <span className="text-[#4B5548]">
                    Zero synthetic lactation hormones (oxytocin-free). Cows are nurtured with Ayurvedic herbs, jaggery, and unadulterated feed.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gradient-to-br from-white via-[#FAFBF9] to-[#F4F8F6] p-4 rounded-xl border border-emerald-900/10 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0D2B1D] block mb-0.5">Direct Farm-to-Table Traceability</strong>
                  <span className="text-[#4B5548]">
                    Every jar is sealed at our licensed facility and dispatched directly with batch tracking codes to guarantee absolute freshness.
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/a2-ghee-guide#sourcing"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#064E3B] hover:text-[#059669] group transition-colors"
              >
                <span>Read more about our sourcing philosophy</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
