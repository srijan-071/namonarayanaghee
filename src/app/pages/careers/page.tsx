"use client";

import React from "react";
import { Briefcase, Send, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="nn-container max-w-4xl text-center">
        
        {/* Header */}
        <section className="mb-16">
          <div
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-8 border border-[#EAE2D2]">
              <Briefcase className="w-10 h-10 text-[#C99A3D]" />
            </div>
            <span className="nn-eyebrow mb-6 inline-block">Careers</span>
            <h1 className="nn-title text-5xl md:text-6xl mb-6 leading-tight">
              Join the Namo Narayana Family
            </h1>
            <p className="nn-sub text-xl max-w-2xl mx-auto text-[#4A5450]">
              We&apos;re building India&apos;s most trusted pure-food brand - and we&apos;re always looking for people who care about purity, tradition, and rural livelihoods.
            </p>
          </div>
        </section>

        {/* Content */}
        <div
          className="bg-white rounded-2xl shadow-xl border border-[#EAD7BC] p-8 md:p-16 text-left relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FDF6E8] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 space-y-8 max-w-2xl">
            <h2 className="text-3xl font-serif text-[#5E0B10] leading-tight">
              Bring your passion to a purposeful mission.
            </h2>
            <p className="text-lg text-[#4A352F] leading-relaxed">
              We hire across sourcing, quality, operations, marketing, and technology. If our mission speaks to you, we&apos;d love to hear from you.
            </p>
            
            <div className="bg-[#FCFAF5] p-6 rounded-xl border border-[#EAD7BC] flex flex-col sm:flex-row items-center gap-6 mt-8">
              <div className="bg-gradient-to-br from-[#8A1B14] to-[#5E0B10] text-white p-4 rounded-full flex-shrink-0 shadow-md">
                <Send className="w-6 h-6 text-[#F5BD47]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2A1612] mb-1">Apply via Email</h3>
                <p className="text-[#4A352F] text-sm mb-3">
                  Write to us with your resume and a few lines about why you&apos;d like to join.
                </p>
                <a 
                  href="mailto:support@namonarayanaghee.store"
                  className="inline-flex items-center gap-2 text-[#C99A3D] font-semibold hover:text-[#8A1B14] transition-colors"
                >
                  support@namonarayanaghee.store
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
