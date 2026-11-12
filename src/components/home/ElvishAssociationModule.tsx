"use client";

import Link from "next/link";
import { ShieldCheck, ExternalLink, ArrowRight } from "lucide-react";

export default function ElvishAssociationModule() {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-[#EAE3D7]">
      <div className="nn-container max-w-4xl mx-auto">
        
        <div className="bg-[#F8F5EE] rounded-3xl p-8 sm:p-12 border border-[#EAE3D7] shadow-sm">
          
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#68191D]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#68191D]">
              Verified Brand Heritage &amp; Association
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#4E1013] font-bold mb-4">
            Co-Founded with Creator Elvish Yadav
          </h2>

          <p className="text-sm sm:text-base text-[#29251F] leading-relaxed mb-6">
            Namo Narayana was launched in <strong>July 2026</strong> by digital creator and youth icon <strong>Elvish Yadav</strong> in collaboration with indigenous dairy heritage advocates. The brand was established with an uncompromising mission: to challenge widespread dairy adulteration and make genuine, Vedic Bilona A2 Gir Cow Ghee directly accessible from trusted gaushalas to Indian households.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-xs text-[#29251F]">
            <div className="bg-white p-4 rounded-xl border border-[#EAE3D7]">
              <strong className="block text-[#4E1013] mb-1">Official Launch &amp; Sourcing</strong>
              <span className="text-[#78634B]">
                Announced officially across verified social channels in July 2026, focusing on pure indigenous Gir cow milk and wooden bilona churning.
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#EAE3D7]">
              <strong className="block text-[#4E1013] mb-1">Official Web Domain Notice</strong>
              <span className="text-[#78634B]">
                The only authentic digital store is <strong>namonarayanaghee.store</strong>. Beware of counterfeit websites or unauthorized third-party listings.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/elvish-yadav-ghee"
              className="inline-flex items-center justify-center gap-2 bg-[#68191D] hover:bg-[#4E1013] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-2xs group"
            >
              <span>Read Full Verified Background</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/pages/about-us"
              className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#68191D] hover:text-[#68191D] px-4 py-2"
            >
              <span>About Namo Narayana →</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

