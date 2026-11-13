"use client";

import Link from "next/link";
import { Crown, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function ElvishAssociationModule() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FAF8F5] via-[#F4F8F5] to-white border-b border-emerald-900/10">
      <div className="nn-container max-w-4xl mx-auto">
        
        <div className="bg-gradient-to-br from-white via-[#FAFBF9] to-[#F4F9F6] rounded-3xl p-8 sm:p-12 border border-emerald-900/12 shadow-xs relative overflow-hidden">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-emerald-200/20 via-amber-100/10 to-transparent pointer-events-none rounded-full blur-2xl" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100/80 to-amber-100/80 border border-emerald-300/50 mb-4 shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-[#B8860B]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#064E3B]">
              Verified Heritage • Elvish Yadav × Vedic Gaushala
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#0D2B1D] font-bold mb-4 tracking-tight">
            Co-Founded with Creator Elvish Yadav
          </h2>

          <p className="text-sm sm:text-base text-[#4B5548] leading-relaxed mb-6 font-sans">
            Namo Narayana was launched in <strong>July 2026</strong> by digital creator and youth icon <strong>Elvish Yadav</strong> in collaboration with indigenous dairy heritage advocates. The brand was established with an uncompromising mission: to challenge widespread industrial dairy adulteration and make genuine, Vedic Bilona A2 Gir Cow Ghee directly accessible from trusted gaushalas to Indian households.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-xs text-[#111815]">
            <div className="bg-white/95 p-5 rounded-2xl border border-emerald-900/10 shadow-2xs">
              <strong className="block text-[#064E3B] mb-1.5 text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Official Launch &amp; Sourcing</span>
              </strong>
              <span className="text-[#4B5548] leading-relaxed block">
                Announced officially across verified social channels in July 2026, focusing on pure indigenous Gir cow milk, curd fermentation, and traditional wooden bilona churning.
              </span>
            </div>
            <div className="bg-white/95 p-5 rounded-2xl border border-emerald-900/10 shadow-2xs">
              <strong className="block text-[#064E3B] mb-1.5 text-sm font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                <span>Official Web Domain Notice</span>
              </strong>
              <span className="text-[#4B5548] leading-relaxed block">
                The only authentic digital store is <strong>namonarayanaghee.store</strong>. Beware of counterfeit lookalike websites or unauthorized third-party listings.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/elvish-yadav-ghee"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:from-[#34D399] hover:to-[#059669] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-xs group border border-emerald-300/30"
            >
              <span>Read Full Verified Background</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/pages/about-us"
              className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#064E3B] hover:text-[#059669] px-4 py-2 transition-colors"
            >
              <span>About Namo Narayana →</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
