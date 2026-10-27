"use client";

import Image from "next/image";
import DiwaliDiya from "@/components/ui/DiwaliDiya";
import { Flame, Snowflake, RotateCcw, Sun, Beaker, Leaf, ShieldCheck, Truck, Shield, BadgeCheck, CheckCircle2 } from "lucide-react";

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
    desc: "The curd is hand-churned in a wooden bilona to separate pure makhana (butter).",
    icon: RotateCcw,
  },
  {
    number: "04",
    title: "Heating",
    desc: "The makhana is slowly heated on a low flame until the water evaporates, leaving behind pure, aromatic ghee.",
    icon: Sun,
  }
];

const features = [
  { title: "A2 Gir Cow", desc: "Ethically Raised", icon: "cow" }, // Custom SVG or fallback
  { title: "Bilona Churned", desc: "Traditional Method", icon: "bilona" },
  { title: "100% Natural", desc: "No Additives", icon: "leaf" },
  { title: "Lab Tested", desc: "For Your Safety", icon: "shield" },
  { title: "Free Shipping", desc: "Across India", icon: "truck" },
  { title: "Premium Quality", desc: "You Can Trust", icon: "badge" },
];

export default function BilonaProcess() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-white to-[#F2EFE8] overflow-hidden">
      
      {/* Background Decorative Scripts */}
      <div
        className="absolute top-32 left-12 hidden xl:block text-[#C38936]/40 text-3xl font-serif italic font-light drop-shadow-sm rotate-[-10deg]"
      >
        Pure Food <br/> Stronger Bharat
      </div>
      <div
        className="absolute top-24 right-12 hidden xl:block text-[#C38936]/40 text-3xl font-serif italic font-light drop-shadow-sm rotate-[5deg]"
      >
        Same Tradition <br/> Nourishing <br/> Generations
      </div>

      <div className="nn-container relative z-10">
        
        {/* Header */}
        <div
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-[#FCF8EE] border border-amber-300 rounded-full px-4 py-1.5 mb-4 shadow-xs">
            <DiwaliDiya size={16} glow={false} />
            <span className="text-[11px] font-bold text-[#8A1B14] uppercase tracking-[0.2em]">The Sacred Vedic Method for Deepotsav</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#5E0B10] mb-6">The Ancient Art of Bilona</h2>
          <p className="text-[#4A352F] text-lg leading-relaxed">
            A time-honoured Vedic process that transforms pure A2 milk into golden ghee &mdash; slowly, naturally, and with unmatched care. Sacred for lighting Diwali diyas and crafting festive mithai.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          
          {/* Left Block: Proof / Lab Tested Card (Spans 6 cols) */}
          <div
            className="lg:col-span-6"
          >
            <div className="relative bg-[#3D0A0E] rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row gap-8 items-center border-b-4 border-[#C38936]">
              {/* Background gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent pointer-events-none" />
              
              <div className="relative z-20 flex-1 w-full flex flex-col items-start">
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                  Pure Ghee. Proven.
                </h3>
                <p className="text-[#F5BD47] text-xs font-bold uppercase tracking-widest mb-10">
                  Tested for what matters.
                </p>
                
                <div className="space-y-8 w-full">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full border border-amber-400/50 flex items-center justify-center shrink-0">
                      <Beaker className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Lab Tested</h4>
                      <p className="text-sm text-white/70">For purity and safety</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full border border-amber-400/50 flex items-center justify-center shrink-0">
                      <Leaf className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">No Preservatives</h4>
                      <p className="text-sm text-white/70">Just pure goodness</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full border border-amber-400/50 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">100% Pure Ingredients</h4>
                      <p className="text-sm text-white/70">Because you deserve the best</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Image in the card */}
              <div className="relative z-10 w-full md:w-2/5 h-64 md:h-full min-h-[300px] rounded-xl overflow-hidden shadow-lg border-2 border-white/10">
                <Image 
                  src="/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"
                  alt="Proven Purity"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Block: The Steps Timeline (Spans 6 cols) */}
          <div className="lg:col-span-6 relative">
            
            {/* The vertical dashed line */}
            <div className="absolute left-[39px] top-8 bottom-8 w-px border-l-2 border-dashed border-[#C38936]/30 hidden sm:block" />
            
            <div className="space-y-10 relative z-10">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={step.number}
                    className="flex gap-6 sm:gap-8 items-start relative"
                  >
                    {/* Circle Icon */}
                    <div className="relative z-10 w-20 h-20 rounded-full bg-[#FCF8EE] border-4 border-amber-200/80 flex flex-col items-center justify-center shrink-0 shadow-md">
                      <Icon className="w-6 h-6 text-[#8A1B14]" />
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-serif text-3xl font-bold text-[#C38936]">{step.number}</span>
                        <h3 className="font-serif font-bold text-2xl text-[#5E0B10]">{step.title}</h3>
                      </div>
                      <p className="text-base text-[#4A352F] leading-relaxed max-w-md">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>

        {/* Bottom Features Strip */}
        <div className="pt-12 border-t border-[#EAD7BC]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
            {features.map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center text-[#8A1B14]">
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
                  <h5 className="font-bold text-[#5E0B10] text-sm leading-tight mb-1">{feature.title}</h5>
                  <p className="text-xs text-[#7A4A3B]">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
