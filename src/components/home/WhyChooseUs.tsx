"use client";

import { CheckCircle2, Shield, Sparkles, Droplets, Leaf, Award } from "lucide-react";

const differentiators = [
  {
    icon: Droplets,
    title: "100% Curd-Cultured (Makhan)",
    desc: "Unlike commercial ghee made by skimming industrial cream, authentic Bilona ghee begins by culturing boiled whole milk into curd, followed by bi-directional churning.",
  },
  {
    icon: Sparkles,
    title: "Indigenous Gir Cow Milk",
    desc: "Sourced from native Gir cows (Bos indicus) renowned for A2 beta-casein protein profiles, grazing in traditional dairy pastures with natural grass fodder.",
  },
  {
    icon: Award,
    title: "Slow-Simmered Clarification",
    desc: "The separated cultured butter is clarified gently on a low flame, caramelizing the milk solids slowly to yield natural golden danedar granules and nutty aroma.",
  },
  {
    icon: Leaf,
    title: "Zero Preservatives or Additives",
    desc: "100% pure milk fat. No synthetic colors, no artificial flavoring agents, zero vanaspati, and zero palm oil adulteration.",
  },
  {
    icon: Shield,
    title: "Statutory FSSAI & NABL Tested",
    desc: "Certified under FSSAI Lic. No. 20824005000185. Tested independently by FARE Labs verifying >99.5% milk fat and <0.5% moisture.",
  },
  {
    icon: CheckCircle2,
    title: "Ahimsa & Ethical Dohan Milking",
    desc: "Calf-first milking practice: the young calf drinks its full share before milk is drawn for ghee crafting, maintaining ethical dairy heritage.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-[#E5DEC9]">
      <div className="nn-container">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D5A37] block mb-2">
            The Namo Narayana Distinction
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#142918] font-bold mb-4">
            Traditional Craftsmanship, Verifiable Purity
          </h2>
          <p className="text-sm sm:text-base text-[#3D4A41] leading-relaxed">
            We adhere to authentic Vedic practices without industrial shortcuts. Every jar is defined by genuine ingredients, documented processes, and rigorous batch tests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {differentiators.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] hover:border-[#1E3A24]/40 transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DEC9] flex items-center justify-center text-[#1E3A24] mb-4 shadow-2xs">
                  <Icon className="w-6 h-6 text-[#2D5A37]" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#142918] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#3D4A41] leading-relaxed flex-1">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
