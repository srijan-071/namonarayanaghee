"use client";

import Link from "next/link";
import { Droplet, Award, ShieldCheck, PackageCheck } from "lucide-react";

export default function ProofStrip() {
  const proofs = [
    {
      icon: Droplet,
      title: "Indigenous Gir Cow Milk",
      desc: "Sourced from native Bos indicus herds raised with ethical Dohan calf-first care.",
      link: "/a2-ghee-guide#sourcing",
      cta: "Learn Sourcing →",
    },
    {
      icon: Award,
      title: "Traditional Bilona Churning",
      desc: "Bi-directional wooden churning from whole-milk curd, not industrial cream.",
      link: "/a2-ghee-guide",
      cta: "Our Bilona Process →",
    },
    {
      icon: ShieldCheck,
      title: "NABL Lab Quality Tested",
      desc: "Statutory FSSAI Lic. 20824005000185 & FARE Labs report with 99.88% milk fat.",
      link: "/pages/certifications",
      cta: "View Lab Certificate →",
    },
    {
      icon: PackageCheck,
      title: "Careful Dispatch (Prepaid)",
      desc: "Tamper-evident holographic security seal with 100% secure express courier dispatch.",
      link: "/policies/shipping-policy",
      cta: "Shipping Details →",
    },
  ];

  return (
    <section className="bg-white py-8 border-b border-[#EAE3D7]">
      <div className="nn-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {proofs.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#F8F5EE] border border-[#EAE3D7] hover:border-[#68191D]/40 transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EAE3D7] flex items-center justify-center text-[#68191D] mb-3 shadow-2xs">
                    <Icon className="w-5 h-5 text-[#68191D]" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#4E1013] mb-1.5">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#29251F] leading-relaxed mb-3">
                    {p.desc}
                  </p>
                </div>
                <Link
                  href={p.link}
                  className="text-xs font-semibold text-[#68191D] hover:text-[#4E1013] inline-flex items-center gap-1 group"
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
