"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Building2,
  FileText,
  Users,
  Leaf,
  Droplets,
  Zap,
  ArrowRight,
  Info,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";

const FAQS = [
  {
    q: "Who is the owner and founder of Namo Narayana Ghee?",
    a: "Namo Narayana was co-founded and launched in July 2026 by digital creator and youth icon Elvish Yadav alongside traditional dairy heritage advocates and gaushala partners who manage day-to-day sourcing, bilona churning, and fulfillment.",
  },
  {
    q: "What is the official registered company and FSSAI license?",
    a: "Namo Narayana operates under statutory food safety compliance with FSSAI License No. 20824005000185. Representative batch testing is certified under batch codes such as NMO-260722-A0.",
  },
  {
    q: "What is Namo Narayana's annual turnover or net worth?",
    a: "As a privately held direct-to-consumer enterprise, Namo Narayana is not a publicly traded corporation and does not publish audited balance sheets, corporate turnover, or brand valuation figures. Any specific revenue or net worth figures reported on entertainment portals represent speculative estimates without official standing.",
  },
  {
    q: "Where is the ghee manufactured and sourced?",
    a: "The milk is sourced from indigenous Gir cow herds in traditional dairy regions of Gujarat and Haryana, where the cows graze in natural pastures and are milked following Ahimsa ethical practices. The ghee is hand-churned using wooden bilonas from whole-milk curd.",
  },
  {
    q: "Which website is the official store of Namo Narayana?",
    a: "The only verified, primary direct-to-consumer store operated by the brand is https://www.namonarayanaghee.store/. To avoid unverified resellers or unauthorized domain confusion, all orders should be placed directly through namonarayanaghee.store.",
  },
];

export default function AboutUsContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <article className="bg-[#FAF8F5] text-[#24211E] py-12 md:py-20 font-sans">
      <div className="nn-container max-w-5xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-stone-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#8A1B14] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#8A1B14] font-medium">About Namo Narayana</span>
        </nav>

        {/* Hero Header */}
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-[#F3E8D8] text-[#8A1B14] text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-4 border border-[#E4D1B8]">
            <Building2 className="w-3.5 h-3.5 text-[#C99A3D]" />
            Official Brand &amp; Company Overview
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#5E0B10] leading-tight mb-4">
            Who Owns Namo Narayana Ghee? Brand, Founder &amp; Company Information
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Verified corporate details, founder background, FSSAI licensing, sourcing philosophy, and official customer grievance channels.
          </p>
        </header>

        {/* AEO / Direct Answer Callout Box */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#D4A017]/40 shadow-sm mb-12">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FCFAF5] border border-[#D4A017] flex items-center justify-center shrink-0 text-[#8A1B14] mt-1">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#5E0B10] mb-2">
                Direct Answer: Leadership &amp; Entity Overview
              </h2>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed mb-4">
                <strong>Namo Narayana</strong> is an authentic Indian direct-to-consumer traditional foods brand co-founded and promoted by youth icon <strong>Elvish Yadav</strong>, who launched the brand in <strong>July 2026</strong>.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <div className="bg-[#FCFAF5] p-3 rounded-xl border border-[#EAD7BC]">
                  <span className="text-xs text-stone-500 font-semibold block uppercase">Co-Founder &amp; Promoter</span>
                  <strong className="text-[#8A1B14] font-serif text-base">Elvish Yadav</strong>
                </div>
                <div className="bg-[#FCFAF5] p-3 rounded-xl border border-[#EAD7BC]">
                  <span className="text-xs text-stone-500 font-semibold block uppercase">Food Safety License</span>
                  <strong className="text-stone-800 text-sm">FSSAI #20824005000185</strong>
                </div>
                <div className="bg-[#FCFAF5] p-3 rounded-xl border border-[#EAD7BC]">
                  <span className="text-xs text-stone-500 font-semibold block uppercase">Verified Online Store</span>
                  <strong className="text-stone-800 text-sm">namonarayanaghee.store</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: The Founding Story & Leadership */}
        <section className="mb-16 bg-white rounded-2xl p-6 sm:p-10 border border-[#EAD7BC] shadow-sm">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10] mb-4">
            1. Brand Genesis &amp; Founding Story
          </h2>
          <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
            <p>
              In contemporary India, the commercial dairy market is flooded with industrial butter-oil blends, palm oil derivatives, and synthetic fragrance additives packaged under the guise of &ldquo;pure desi ghee.&rdquo;
            </p>
            <p>
              Observing this widespread quality compromise, digital creator and philanthropist <strong>Elvish Yadav</strong> partnered with traditional gaushalas and Ayurvedic food practitioners to create <strong>Namo Narayana</strong>. Officially unveiled on <strong>July 28, 2026</strong>, the brand&apos;s mission is uncompromisingly simple: bring authentic, unadulterated Vedic Bilona ghee from indigenous Gir cows directly into Indian households without intermediary dilution.
            </p>
            <p>
              While Elvish Yadav acts as the public visionary, chief promoter, and co-founder, operational execution is anchored by dairy heritage supervisors who oversee gaushala hygiene, wooden curd churning, wood-fire simmering, and lab batch testing.
            </p>
          </div>
        </section>

        {/* Section 2: Verified Corporate & Regulatory Details */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10] mb-6">
            2. Verified Company Details &amp; Regulatory Compliance
          </h2>

          <div className="overflow-x-auto bg-white rounded-2xl border border-[#EAD7BC] shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <tbody className="divide-y divide-[#F0E4D4]">
                <tr className="hover:bg-amber-50/30">
                  <td className="p-4 font-bold text-stone-700 w-1/3">Brand Name</td>
                  <td className="p-4 text-stone-900 font-medium">Namo Narayana</td>
                </tr>
                <tr className="hover:bg-amber-50/30">
                  <td className="p-4 font-bold text-stone-700">Official Web Domain</td>
                  <td className="p-4 text-[#8A1B14] font-medium">
                    <a href="https://www.namonarayanaghee.store/" className="underline hover:text-[#5E0B10]">
                      https://www.namonarayanaghee.store/
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/30">
                  <td className="p-4 font-bold text-stone-700">Statutory FSSAI License</td>
                  <td className="p-4 text-stone-900 font-medium">
                    Lic. No. <strong>20824005000185</strong> (Food Safety and Standards Authority of India)
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/30">
                  <td className="p-4 font-bold text-stone-700">Batch Verification Reference</td>
                  <td className="p-4 text-stone-900">
                    Batch NMO-260722-A0 (Moisture &lt;0.5%, Milk Fat &gt;99.5%, RM value verified)
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/30">
                  <td className="p-4 font-bold text-stone-700">Official Customer Support</td>
                  <td className="p-4 text-stone-900">
                    <a href="mailto:care@namonarayanaghee.store" className="text-[#8A1B14] hover:underline">
                      care@namonarayanaghee.store
                    </a>{" "}
                    &bull; Helpline: +91-89300-88005
                  </td>
                </tr>
                <tr className="hover:bg-amber-50/30">
                  <td className="p-4 font-bold text-stone-700">Consumer Grievance Desk</td>
                  <td className="p-4 text-stone-900">
                    In compliance with the Consumer Protection (E-Commerce) Rules, 2020: Grievance Officer, Namo Narayana (SLA: Acknowledgment within 48h, resolution within 30 days).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Financial Disclosure & Market Realities */}
        <section className="mb-16 bg-white rounded-2xl p-6 sm:p-10 border border-[#EAD7BC] shadow-sm">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10] mb-4">
            3. Factual Statement Regarding Turnover, Net Worth &amp; Brand Valuation
          </h2>
          <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
            <p>
              A substantial volume of web searches queries *"Namo Narayana turnover"*, *"Namo Narayana net worth"*, or *"Elvish Yadav ghee brand value"*.
            </p>
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 text-stone-800 text-sm">
              <strong className="text-[#8A1B14] block mb-1">Official Clarification on Financial Figures:</strong>
              Namo Narayana is an unlisted, privately held direct-to-consumer enterprise. As a private business entity, it does not release public earnings reports, audited annual turnover figures, or corporate valuation metrics. Any third-party entertainment blogs asserting specific numbers represent unverified speculations.
            </div>
            <p>
              The enterprise&apos;s stated operational priority is sustaining fair-price procurement for rural dairy farmers, maintaining small-batch wooden churning infrastructure, and ensuring zero adulteration in every dispatched container.
            </p>
          </div>
        </section>

        {/* Section 4: Sourcing Philosophy & Ahimsa Milking */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10] mb-6">
            4. Sourcing Philosophy: Ethical Ahimsa Dairy Practices
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#EAD7BC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#8A1B14] flex items-center justify-center mb-4">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#5E0B10] mb-2">Ahimsa Milking Protocol</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Calves are nourished first until completely satisfied. Only the surplus milk produced by the mother cow is harvested for curd culturing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EAD7BC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#8A1B14] flex items-center justify-center mb-4">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#5E0B10] mb-2">Indigenous Gir Cows (Bos indicus)</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Reared in open-grazing gaushalas across native tracts of Gujarat and Haryana, free from synthetic hormone injections (rBST/oxytocin).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EAD7BC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#8A1B14] flex items-center justify-center mb-4">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#5E0B10] mb-2">Curd-Churned (Bilona)</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Whole milk is turned into cultured curd, churned using two-way wooden bilonas, and slow-cooked over a mild wood fire into golden grains.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Frequently Asked Questions */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10] mb-6 text-center">
            5. Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-xl border border-[#EAD7BC] overflow-hidden shadow-xs">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between font-serif font-bold text-stone-800 hover:text-[#8A1B14] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#8A1B14] shrink-0" /> : <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FCFAF5]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 6: Official Product Placement Card */}
        <section className="bg-white rounded-2xl border border-[#EAD7BC] p-6 sm:p-8 shadow-sm mb-12">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 relative aspect-square rounded-xl overflow-hidden bg-amber-50">
              <Image
                src="/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"
                alt="Namo Narayana Pure A2 Gir Cow Ghee 1 Litre Jar"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
            <div className="md:col-span-8">
              <span className="bg-[#C38936] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Flagship Bestseller
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10] mt-2 mb-2">
                Pure A2 Gir Cow Ghee (1 Litre Glass Jar)
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                Hand-churned from natural curd using traditional wooden bilonas. Golden, aromatic, granular texture with zero preservatives.
              </p>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-serif font-bold text-[#8A1B14]">₹949.00</span>
                <span className="text-stone-400 line-through">₹1,599.00</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Free Pan-India Delivery
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products/pure-desi-cow-ghee-1-litre"
                  className="bg-[#8A1B14] hover:bg-[#5E0B10] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm inline-flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" /> Order Official 1L Jar (₹949)
                </Link>
                <Link
                  href="/pages/namo-narayana-ghee-price-buying-guide"
                  className="border-2 border-[#8A1B14] text-[#8A1B14] hover:bg-amber-50 font-bold px-6 py-3 rounded-xl transition-all text-sm inline-flex items-center gap-2"
                >
                  View All Pack Sizes &amp; Prices <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </article>
  );
}

