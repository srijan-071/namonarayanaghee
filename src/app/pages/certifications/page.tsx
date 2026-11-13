import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileCheck, Download, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Quality Certifications & FSSAI Lab Reports | Namo Narayana Ghee",
  description:
    "Official quality compliance and laboratory verification for Namo Narayana Pure A2 Gir Cow Ghee. Statutory FSSAI Lic. No. 20824005000185 and NABL-accredited FARE Labs batch test reports.",
  alternates: {
    canonical: `${siteConfig.url}/pages/certifications`,
  },
};

export default function CertificationsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Certifications & Quality", url: "/pages/certifications" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="bg-[#FAF9F5] min-h-screen pt-28 pb-24">
        <div className="nn-container max-w-4xl mx-auto">
          
          {/* Header */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-6 border border-[#EAE7DF]">
              <ShieldCheck className="w-8 h-8 text-[#075B43]" />
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#17231E] font-bold mb-4">
              Quality Certifications &amp; Lab Reports
            </h1>
            <p className="text-sm sm:text-base text-[#727B75] max-w-2xl mx-auto leading-relaxed">
              Quality isn&apos;t a claim &mdash; it&apos;s a paper trail. Every batch of Namo Narayana Pure A2 Gir Cow Ghee is produced in licensed facilities and tested in NABL-accredited laboratories.
            </p>
          </header>

          {/* Section 1: Statutory Regulatory License */}
          <section className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-10 shadow-sm mb-10">
            <div className="flex items-center gap-3 border-b border-[#EAE7DF] pb-5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#EAE7DF] flex items-center justify-center text-[#075B43]">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#17231E] font-bold">
                  Statutory Food Safety Compliance
                </h2>
                <span className="text-xs text-stone-500">
                  Food Safety and Standards Authority of India (FSSAI)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs sm:text-sm">
              <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#EAE7DF]">
                <span className="text-xs text-stone-400 block mb-1 uppercase font-semibold">
                  FSSAI License Number
                </span>
                <strong className="text-base font-mono text-[#075B43]">
                  20824005000185
                </strong>
                <span className="text-xs text-stone-500 block mt-1">
                  State License (Haryana Food Safety Administration)
                </span>
              </div>

              <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#EAE7DF]">
                <span className="text-xs text-stone-400 block mb-1 uppercase font-semibold">
                  Licensed Product Category
                </span>
                <strong className="text-base text-stone-800">
                  Dairy Product &mdash; Ghee
                </strong>
                <span className="text-xs text-stone-500 block mt-1">
                  Traditional Bilona Clarified Butter
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#727B75] leading-relaxed mb-6">
              Namo Narayana facilities strictly comply with Good Manufacturing Practices (GMP) and statutory hygiene mandates stipulated under the Food Safety and Standards (Food Business Operators) Regulations. Consumers may verify licensing status anytime via the national FoSCoS portal.
            </p>

            <a
              href="https://foscos.fssai.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#075B43] hover:text-[#064635] underline underline-offset-4"
            >
              <span>Verify on Official FSSAI FoSCoS Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </section>

          {/* Section 2: Laboratory Test Report */}
          <section className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-10 shadow-sm mb-10">
            <div className="flex items-center gap-3 border-b border-[#EAE7DF] pb-5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#EAE7DF] flex items-center justify-center text-[#075B43]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#17231E] font-bold">
                  Accredited Laboratory Analysis Report
                </h2>
                <span className="text-xs text-stone-500">
                  NABL Accredited Testing Laboratory (TC-5503)
                </span>
              </div>
            </div>

            {/* Meta tags */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-xs text-[#29251F]">
              <div className="bg-[#F8F5EE] p-3 rounded-xl border border-[#EAE3D7]">
                <span className="text-[10px] text-stone-400 block uppercase">Laboratory</span>
                <strong className="text-stone-800">FARE Labs (Gurugram)</strong>
              </div>
              <div className="bg-[#F8F5EE] p-3 rounded-xl border border-[#EAE3D7]">
                <span className="text-[10px] text-stone-400 block uppercase">Report ULR</span>
                <strong className="text-stone-800 font-mono">TC550326100005189F</strong>
              </div>
              <div className="bg-[#F8F5EE] p-3 rounded-xl border border-[#EAE3D7]">
                <span className="text-[10px] text-stone-400 block uppercase">Sample / Batch</span>
                <strong className="text-stone-800">NMO-260722-A01</strong>
              </div>
              <div className="bg-[#F8F5EE] p-3 rounded-xl border border-[#EAE3D7]">
                <span className="text-[10px] text-stone-400 block uppercase">Tested Period</span>
                <strong className="text-stone-800">23 &ndash; 28 July 2026</strong>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAE7DF] bg-[#FAF9F5] text-[#17231E]">
                    <th className="py-2.5 px-3 font-bold">Tested Parameter</th>
                    <th className="py-2.5 px-3 font-bold">Observed Value</th>
                    <th className="py-2.5 px-3 font-bold">FSSR 2011 Standard</th>
                    <th className="py-2.5 px-3 font-bold">Test Method</th>
                    <th className="py-2.5 px-3 font-bold text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE7DF]/60 text-[#29251F]">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-stone-900">Total Milk Fat %</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-800">99.88%</td>
                    <td className="py-2.5 px-3">Not Less Than 99.5%</td>
                    <td className="py-2.5 px-3">FSSAI Dairy Manual</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">Passed</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-stone-900">Moisture %</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-800">&lt;0.5%</td>
                    <td className="py-2.5 px-3">Maximum 0.5%</td>
                    <td className="py-2.5 px-3">FL/SOP/02-45</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">Passed</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-stone-900">Added Sugar</td>
                    <td className="py-2.5 px-3">Not Detected (&lt;0.01)</td>
                    <td className="py-2.5 px-3">Zero Tolerated</td>
                    <td className="py-2.5 px-3">FL/SOP/OC-29</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">Passed</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-stone-900">Monounsaturated Fatty Acids</td>
                    <td className="py-2.5 px-3 font-bold">28.67%</td>
                    <td className="py-2.5 px-3">Natural Profile</td>
                    <td className="py-2.5 px-3">FL/SOP/02-45</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">Verified</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-stone-900">Trans Fatty Acids</td>
                    <td className="py-2.5 px-3">1.69%</td>
                    <td className="py-2.5 px-3">Natural Dairy Level</td>
                    <td className="py-2.5 px-3">FL/SOP/02-45</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">Verified</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Download CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF9F5] border border-[#EAE7DF]">
              <div>
                <strong className="text-xs sm:text-sm text-[#17231E] block font-bold">
                  Original FARE Labs Test Certificate (Batch NMO-260722-A01)
                </strong>
                <span className="text-[11px] text-stone-500">
                  Digitally signed by Food Analyst Ms. Chhaya Shakya
                </span>
              </div>
              <a
                href="/media/o_f20260715-011-015_2_25449c.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#075B43] hover:bg-[#064635] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Report</span>
              </a>
            </div>

            {/* Scope / Disclaimer */}
            <div className="mt-5 p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Accreditation Scope:</strong> This testing certificate establishes compliance for representative sample batch NMO-260722-A01 against FSSR 2011 dairy standards. Test reports are conducted on representative batch samples and demonstrate absence of synthetic adulteration, moisture compliance, and milk fat authenticity.
              </span>
            </div>

          </section>

          {/* Certificate Image Preview */}
          <section className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-10 shadow-sm text-center">
            <h3 className="font-serif text-lg font-bold text-[#17231E] mb-4">
              Scanned FARE Labs Laboratory Certificate
            </h3>
            <div className="relative max-w-xl mx-auto aspect-[3/4] rounded-2xl overflow-hidden border border-[#EAE3D7] shadow-md bg-stone-50">
              <Image
                src="/media/IMG-20260728-WA0131_jpg_b04570c5-92c7-4348-90a9-11972108ad9b_7f6e93.webp"
                alt="FARE Labs Certificate of Analysis - Namo Narayana Gir Cow Ghee"
                fill
                sizes="(min-width: 768px) 576px, 90vw"
                className="object-contain p-2"
              />
            </div>
            <p className="text-xs text-stone-500 mt-4">
              Report ULR: TC550326100005189F &bull; FARE LABS Pvt. Ltd. (Permanent Site Facility, Gurugram)
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
