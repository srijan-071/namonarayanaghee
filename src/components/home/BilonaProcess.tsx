"use client";

import Image from "next/image";
import { Flame, Snowflake, RotateCcw, Sun, Beaker, Leaf, ShieldCheck, Truck, Shield, BadgeCheck, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Boiling",
    desc: "Fresh A2 milk is gently boiled over a slow wood fire, preserving its natural essence.",
    icon: Flame,
  },
  {
    number: "02",
    title: "Curdling",
    desc: "The milk is naturally curdled overnight using traditional methods.",
    icon: Snowflake,
  },
  {
    number: "03",
    title: "Churning (Bilona)",
    desc: "The curd is hand-churned bi-directionally in a wooden bilona to separate cultured makkhan (butter).",
    icon: RotateCcw,
  },
  {
    number: "04",
    title: "Slow Clarification",
    desc: "The cultured makkhan is slowly simmered on a gentle low flame until moisture evaporates, leaving behind pure, golden danedar ghee.",
    icon: Sun,
  }
];

const features = [
  { title: "A2 Gir Cow", desc: "Ethically Raised", icon: "cow" },
  { title: "Bilona Churned", desc: "Traditional Method", icon: "bilona" },
  { title: "100% Natural", desc: "No Additives", icon: "leaf" },
  { title: "Lab Tested", desc: "For Your Safety", icon: "shield" },
  { title: "Free Shipping", desc: "Across India", icon: "truck" },
  { title: "Premium Quality", desc: "You Can Trust", icon: "badge" },
];

export default function BilonaProcess() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-white via-[#FAF8F5] to-[#F4F8F5] overflow-hidden border-b border-emerald-900/10">
      
      {/* Background Decorative Subtle Scripts */}
      <div className="absolute top-32 left-12 hidden xl:block text-emerald-800/10 text-3xl font-serif italic font-light drop-shadow-xs rotate-[-10deg] select-none pointer-events-none">
        Pure Food <br/> Stronger Bharat
      </div>
      <div className="absolute top-24 right-12 hidden xl:block text-emerald-800/10 text-3xl font-serif italic font-light drop-shadow-xs rotate-[5deg] select-none pointer-events-none">
        Same Tradition <br/> Nourishing <br/> Generations
      </div>

      <div className="nn-container relative z-10">
        
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100/80 to-amber-100/80 border border-emerald-300/50 rounded-full px-4 py-1.5 mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
            <span className="text-[11px] font-bold text-[#064E3B] uppercase tracking-[0.2em]">The Sacred Vedic Bilona Method</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#0D2B1D] mb-6 tracking-tight">
            The Ancient Art of Bilona
          </h2>
          <p className="text-[#4B5548] text-lg leading-relaxed font-sans">
            A time-honoured Vedic process that transforms pure A2 milk into golden ghee &mdash; slowly, naturally, and with unmatched care. Hand-churned from whole curd to deliver wholesome nutrition, rich aroma, and golden granules.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          
          {/* Left Block: Obsidian-Emerald Proof Card */}
          <div className="lg:col-span-6">
            <div className="relative bg-gradient-to-br from-[#0A1612] via-[#063024] to-[#042018] rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row gap-8 items-center border-b-4 border-emerald-400/60">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent pointer-events-none" />
              
              <div className="relative z-20 flex-1 w-full flex flex-col items-start">
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                  Pure Ghee. Proven.
                </h3>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7B4] via-[#D4AF37] to-[#F7E7B4] text-xs font-bold uppercase tracking-widest mb-10">
                  Tested for what matters.
                </p>
                
                <div className="space-y-7 w-full">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full border border-emerald-400/40 flex items-center justify-center shrink-0 bg-white/5">
                      <Beaker className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Lab Tested Purity</h4>
                      <p className="text-sm text-emerald-100/70">Certified 99.88% pure milk fat</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full border border-emerald-400/40 flex items-center justify-center shrink-0 bg-white/5">
                      <Leaf className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Zero Preservatives</h4>
                      <p className="text-sm text-emerald-100/70">Just natural churned goodness</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full border border-emerald-400/40 flex items-center justify-center shrink-0 bg-white/5">
                      <ShieldCheck className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">100% Desi Gir Cow</h4>
                      <p className="text-sm text-emerald-100/70">From ethically nurtured herds</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Product Visual */}
              <div className="relative z-10 w-full md:w-2/5 h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden shadow-lg border border-emerald-400/30">
                <Image 
                  src="/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"
                  alt="Proven Purity"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Block: The Steps Timeline */}
          <div className="lg:col-span-6 relative">
            <div className="absolute left-[39px] top-8 bottom-8 w-px border-l-2 border-dashed border-emerald-600/30 hidden sm:block" />
            
            <div className="space-y-10 relative z-10">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={step.number}
                    className="flex gap-6 sm:gap-8 items-start relative group"
                  >
                    <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100/90 to-emerald-50/80 border-4 border-emerald-200/80 flex flex-col items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-[#059669]" />
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">{step.number}</span>
                        <h3 className="font-serif font-bold text-2xl text-[#0D2B1D]">{step.title}</h3>
                      </div>
                      <p className="text-base text-[#4B5548] leading-relaxed max-w-md font-sans">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>

        {/* Bottom Features Strip */}
        <div className="pt-12 border-t border-emerald-900/10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
            {features.map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center text-[#059669]">
                  {feature.icon === 'cow' && (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h3M6 12v3M9 12v6M12 12v6M15 12v3M18 12h3M2 15h20M4 9h16"/></svg>
                  )}
                  {feature.icon === 'bilona' && <RotateCcw className="w-8 h-8" />}
                  {feature.icon === 'leaf' && <Leaf className="w-8 h-8" />}
                  {feature.icon === 'shield' && <Shield className="w-8 h-8" />}
                  {feature.icon === 'truck' && <Truck className="w-8 h-8" />}
                  {feature.icon === 'badge' && <BadgeCheck className="w-8 h-8" />}
                </div>
                <div>
                  <h5 className="font-bold text-[#0D2B1D] text-sm leading-tight mb-1">{feature.title}</h5>
                  <p className="text-xs text-[#4B5548]">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
