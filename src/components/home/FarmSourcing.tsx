"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Heart, Shield, MapPin, ArrowRight } from "lucide-react";

export default function FarmSourcing() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#E5DEC9]">
      <div className="nn-container">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Authentic Pasture Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#FAF7F0] border border-[#E5DEC9] shadow-lg">
              <Image
                src="/assets/hero-new-cows.jpg"
                alt="Indigenous Gir Cows in Haryana Gaushala Pasture"
                fill
                sizes="(min-width: 1024px) 500px, 90vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-[#E5DEC9] shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2D5A37]" />
                  <span className="text-xs font-bold text-[#142918]">Haryana &amp; Gujarat Gaushala Clusters</span>
                </div>
                <span className="text-[10px] font-semibold bg-[#EAE3D2] text-[#1E3A24] px-2 py-0.5 rounded">
                  Ethical Milking
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Sourcing Narrative & Governance */}
          <div className="lg:col-span-7 flex flex-col">
            
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D5A37] block mb-2">
              Traceable Origins
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#142918] font-bold mb-5">
              Ethical Gaushala Sourcing &amp; The Dohan Tradition
            </h2>

            <p className="text-sm sm:text-base text-[#3D4A41] leading-relaxed mb-6">
              Our dairy foundation rests upon ethical gaushala partnerships in traditional dairy belts of Haryana and Gujarat. We prioritize the welfare of indigenous Gir cows (Bos indicus), providing open grazing paddocks, clean drinking water, and seasonal green fodder.
            </p>

            <div className="space-y-4 mb-8 text-xs sm:text-sm text-[#1C241F]">
              <div className="flex items-start gap-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5DEC9]">
                <Heart className="w-5 h-5 text-[#C99A3D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142918] block mb-0.5">The Sacred Principle of Dohan</strong>
                  <span className="text-[#3D4A41]">
                    We strictly ensure the newborn calf drinks its full nourishment first before any milk is gathered for ghee production.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5DEC9]">
                <Shield className="w-5 h-5 text-[#2D5A37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142918] block mb-0.5">Hormone &amp; Chemical Free Care</strong>
                  <span className="text-[#3D4A41]">
                    Zero synthetic lactation hormones (oxytocin-free). Cows are nurtured with Ayurvedic herbs, jaggery, and unadulterated feed.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5DEC9]">
                <CheckCircle2 className="w-5 h-5 text-[#1E3A24] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142918] block mb-0.5">Direct Farm-to-Table Traceability</strong>
                  <span className="text-[#3D4A41]">
                    Every jar is sealed at our licensed facility and dispatched directly with batch tracking codes to guarantee absolute freshness.
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/a2-ghee-guide#sourcing"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A24] hover:text-[#2D5A37] group"
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
