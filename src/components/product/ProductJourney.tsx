"use client";
import { JOURNEY_STEPS } from "@/lib/journey-data";
import { motion } from "framer-motion";

export default function ProductJourney() {
  return (
    <section className="py-20 md:py-32 bg-[#fafcfa] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
          <p className="text-[#00584b] font-bold tracking-widest uppercase text-sm mb-4">
            — Our Journey —
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1c2b26] mb-6">
            Farm to Home, One Honest Step at a Time
          </h2>
          <p className="text-lg text-[#5c6b65] leading-relaxed">
            From the cow to your kitchen &mdash; follow every step of how our ghee is made, the traditional Bilona way.
          </p>
        </div>

        <div className="space-y-24 md:space-y-40 relative">
          {/* Connecting dashed line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-[#e3dccc] -translate-x-1/2 z-0" />

          {JOURNEY_STEPS.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`relative z-10 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-24 items-center`}
              >
                {/* Media */}
                <div className="w-full md:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-gray-100 group">
                    {step.isVideo ? (
                      <video
                        src={step.media}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={step.media}
                        alt={step.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>

                {/* Dot for timeline (desktop) */}
                <div className="hidden md:block absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-[#00584b] border-4 border-[#fafcfa] -translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_0_4px_rgba(0,88,75,0.1)]" />

                {/* Text */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <span className="inline-block border border-[#00584b] text-[#00584b] rounded-full px-4 py-1 text-xs font-bold tracking-widest uppercase mb-6 self-start w-auto">
                    {step.step.replace('Stp', 'Step')}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#1c2b26] mb-6">
                    {step.title}
                  </h3>
                  <p className="text-lg text-[#5c6b65] leading-relaxed mb-8">
                    {step.desc}
                  </p>
                  
                  {/* Pills */}
                  <div className="flex flex-wrap gap-3">
                    {step.pills.map((pill, pIdx) => (
                      <span
                        key={pIdx}
                        className="border border-[#e3dccc] bg-white text-[#1c2b26] px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
