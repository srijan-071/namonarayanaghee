"use client";

import Link from "next/link";
import { Droplet, Award, ShieldCheck, Truck } from "lucide-react";

export default function ProofStrip() {
  const proofs = [
    {
      icon: Droplet,
      title: "Vedic Bilona Process",
      desc: "Bi-directional wooden churning from whole-milk curd, not industrial cream.",
      link: "/a2-ghee-guide",
      cta: "See Process →",
    },
    {
      icon: Award,
      title: "A2 Gir Cow Milk",
      desc: "Sourced from indigenous Bos indicus herds with ethical Dohan milking.",
      link: "/a2-ghee-guide#sourcing",
      cta: "Learn Sourcing →",
    },
    {
      icon: ShieldCheck,
      title: "NABL Lab Batch-Tested",
      desc: "99.88% pure milk fat verified by FARE Labs (Report TC550326100005189F).",
      link: "/pages/certifications",
      cta: "View Report →",
    },
    {
      icon: Truck,
      title: "Direct Official Delivery",
      desc: "Tamper-evident holographic seal, dispatched fresh across India.",
      link: "/policies/shipping-policy",
      cta: "Shipping Details →",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white via-[#FAFBF9] to-[#FAF8F5] py-9 border-b border-emerald-900/10">
      <div className="nn-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {proofs.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-white via-[#FAFBF9] to-[#F4F8F6] border border-emerald-900/10 hover:border-emerald-500/40 hover:shadow-xs transition-all duration-300"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100/80 to-emerald-50/80 flex items-center justify-center text-[#059669] mb-3.5 border border-emerald-300/40 shadow-2xs">
                    <Icon className="w-5 h-5" strokeWidth={1.85} />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#0D2B1D] mb-1.5 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#4B5548] leading-relaxed mb-4">
                    {p.desc}
                  </p>
                </div>
                <Link
                  href={p.link}
                  className="text-xs font-semibold text-[#064E3B] hover:text-[#059669] inline-flex items-center gap-1 group transition-colors"
                >
                  <span>{p.cta}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
