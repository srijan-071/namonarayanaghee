"use client";

import React from "react";
import Image from "next/image";
import { Leaf, Heart, ShieldCheck, Users } from "lucide-react";

export default function OurStoryPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="nn-container">
        
        {/* Hero Section */}
        <section className="relative mb-32 max-w-5xl mx-auto text-center">
          <div
          >
            <span className="nn-eyebrow mb-6 inline-block">Our Story</span>
            <h1 className="nn-title text-5xl md:text-7xl mb-8 leading-tight">
              From India&apos;s Heartland to Your Home
            </h1>
            <p className="nn-sub text-xl md:text-2xl max-w-3xl mx-auto text-[#4A5450]">
              Namo Narayana began with a simple belief: food should be as pure as it was in our grandparents&apos; kitchens.
            </p>
          </div>
        </section>

        {/* Story Content & Image */}
        <section className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div
            className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/assets/desi-cow.png"
              alt="Desi Cow Farm"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div
            className="space-y-8"
          >
            <h2 className="text-4xl font-serif text-[#5E0B10] leading-tight">
              A return to our roots.
            </h2>
            <div className="space-y-6 text-lg text-[#4A352F] leading-relaxed">
              <p>
                We work directly with 5000+ farmer families across India&apos;s native regions to bring you pure A2 Gir Cow Ghee - made the traditional way, tested in certified labs, and delivered with zero preservatives.
              </p>
              <p>
                Our journey is rooted in the ancient Vedic sciences of food preparation. Every product we create is a testament to the purity of nature and the wisdom of our ancestors.
              </p>
              <p className="font-serif italic text-2xl text-[#C99A3D]">
                &quot;Not high yield. Not lower cost. Just flavour, nutrition, and soul.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* Our Promise Grid */}
        <section className="max-w-5xl mx-auto">
          <div
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-[#5E0B10] mb-4">Our Promise</h2>
            <p className="text-[#4A352F] text-lg">The pillars that define every Namo Narayana product.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Leaf className="w-8 h-8 text-[#C99A3D]" />,
                title: "Native Ingredients",
                desc: "Sourced exclusively from their original growing regions across Bharat."
              },
              {
                icon: <Heart className="w-8 h-8 text-[#C99A3D]" />,
                title: "Traditional Processing",
                desc: "Bilona churned, cold pressed, and stone ground to retain maximum nutrition."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-[#C99A3D]" />,
                title: "Quality Assured",
                desc: "Over 40 rigorous quality checks on every single batch before it reaches you."
              },
              {
                icon: <Users className="w-8 h-8 text-[#C99A3D]" />,
                title: "Empowering Farmers",
                desc: "Fair prices that sustain and empower thousands of rural farming families."
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EAD7BC] hover:border-[#C99A3D]/30 transition-colors group"
              >
                <div className="bg-[#FCFAF5] w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-serif text-[#5E0B10] mb-3">{item.title}</h3>
                <p className="text-[#4A352F] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
