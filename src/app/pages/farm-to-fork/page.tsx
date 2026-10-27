"use client";

import React from "react";
import { MapPin, Hammer, TestTube, Truck } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    icon: <MapPin className="w-10 h-10 text-[#C99A3D]" />,
    title: "1. Native Sourcing",
    desc: "We source from indigenous farms in each ingredient's original growing region - the right soil, altitude, and season.",
    image: "/assets/desi-cow.png"
  },
  {
    icon: <Hammer className="w-10 h-10 text-[#C99A3D]" />,
    title: "2. Traditional Processing",
    desc: "Bilona churning for ghee hand-crafted from A2 curd. Slow, ancient methods that preserve nutrition.",
    image: "/assets/about-ghee.png"
  },
  {
    icon: <TestTube className="w-10 h-10 text-[#C99A3D]" />,
    title: "3. Three Layers of Testing",
    desc: "Every batch is tested at sourcing, during processing, and before packaging - 40+ lab checks for purity, adulteration, and nutrition.",
    image: "/assets/hero-bg.png"
  },
  {
    icon: <Truck className="w-10 h-10 text-[#C99A3D]" />,
    title: "4. Fresh to Your Door",
    desc: "Small batches, sealed at source, and shipped across India in secure packaging within days of production.",
    image: "/assets/desi-cow.png" // Reusing since we have limited images, but visually it works
  }
];

export default function FarmToForkPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="nn-container">
        
        {/* Header */}
        <section className="text-center max-w-4xl mx-auto mb-24">
          <div
          >
            <span className="nn-eyebrow mb-6 inline-block">Farm to Fork</span>
            <h1 className="nn-title text-5xl md:text-7xl mb-8 leading-tight">
              The Journey of Every Jar
            </h1>
            <p className="nn-sub text-xl md:text-2xl text-[#4A5450]">
              Every Namo Narayana product travels a carefully guarded path from farm to your family&apos;s plate.
            </p>
          </div>
        </section>

        {/* Timeline Steps */}
        <section className="max-w-6xl mx-auto relative">
          {/* Vertical connecting line for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-[#DCD5C5] -translate-x-1/2 z-0"></div>

          <div className="space-y-24 lg:space-y-40 relative z-10">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}>
                  
                  {/* Text Content */}
                  <div
                    className={`flex-1 text-center ${isEven ? 'lg:text-right' : 'lg:text-left'} w-full lg:w-1/2`}
                  >
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-8 border border-[#EAE2D2] lg:hidden`}>
                      {step.icon}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif text-[#5E0B10] mb-6">{step.title}</h2>
                    <p className="text-lg text-[#4A5450] leading-relaxed max-w-lg mx-auto lg:mx-0 ${isEven ? 'lg:ml-auto' : 'lg:mr-auto'}">
                      {step.desc}
                    </p>
                  </div>

                  {/* Center Icon (Desktop Only) */}
                  <div
                    className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-24 h-24 bg-white rounded-full shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-[#EAE2D2] z-20"
                  >
                    {step.icon}
                  </div>

                  {/* Image Content */}
                  <div
                    className="flex-1 w-full lg:w-1/2"
                  >
                    <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-black/5"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
