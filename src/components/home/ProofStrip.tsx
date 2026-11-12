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
    <section className="bg-white py-8 border-b border-[#E5DEC9]">
      <div className="nn-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {proofs.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="flex flex-col justify-between p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9]/80 hover:border-[#2D5A37]/50 transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EAE3D2] flex items-center justify-center text-[#1E3A24] mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#142918] mb-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#3D4A41] leading-relaxed mb-3">
                    {p.desc}
                  </p>
                </div>
                <Link
                  href={p.link}
                  className="text-xs font-semibold text-[#1E3A24] hover:text-[#2D5A37] inline-flex items-center gap-1 group"
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
