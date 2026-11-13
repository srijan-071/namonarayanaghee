"use client";

import Image from "next/image";
import { Download, ShieldCheck, AlertCircle } from "lucide-react";

export default function LabComplianceProof() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-[#FAF8F5] to-[#F4F8F5] border-b border-emerald-900/10">
      <div className="nn-container">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#059669] block mb-2">
            Verifiable Quality &amp; Transparency
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0D2B1D] font-bold mb-4 tracking-tight">
            Independent NABL Lab Batch Testing
          </h2>
          <p className="text-sm sm:text-base text-[#4B5548] leading-relaxed font-sans">
            Quality at Namo Narayana is backed by rigorous documentation. Every batch is analyzed by independent accredited laboratories to verify statutory dairy benchmarks.
          </p>
        </div>

        {/* Report Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto bg-gradient-to-br from-white via-[#FAFBF9] to-[#F4F8F6] rounded-3xl p-6 sm:p-10 border border-emerald-900/12 shadow-xs">
          
          {/* Left: Report Snapshot Thumbnail */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-2xl overflow-hidden border border-emerald-900/15 shadow-sm bg-stone-50 group">
              <Image
                src="/media/IMG-20260728-WA0131_jpg_b04570c5-92c7-4348-90a9-11972108ad9b_7f6e93.webp"
                alt="FARE Labs NABL Test Report for Namo Narayana Ghee"
                fill
                sizes="(min-width: 1024px) 340px, 90vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  NABL TC-5503 Verified
                </span>
              </div>
            </div>
            <a
              href="/media/o_f20260715-011-015_2_25449c.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#064E3B] hover:text-[#059669] underline underline-offset-4 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Original PDF Report
            </a>
          </div>

          {/* Right: Verified Parameters Breakdown */}
          <div className="lg:col-span-7 flex flex-col">
            
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/10 pb-4 mb-5">
              <div>
                <span className="text-xs text-[#4B5548] block">Accredited Laboratory</span>
                <strong className="text-sm sm:text-base text-[#0D2B1D]">FARE LABS Private Limited (Gurugram)</strong>
              </div>
              <span className="text-[11px] font-mono bg-emerald-50 text-[#064E3B] px-2.5 py-1 rounded-md font-bold border border-emerald-200/50">
                ULR: TC550326100005189F
              </span>
            </div>

            {/* Batch Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-xs text-[#111815]">
              <div className="bg-white/90 p-3 rounded-xl border border-emerald-900/10 shadow-2xs">
                <span className="text-[10px] text-stone-400 block uppercase">Sample Code</span>
                <strong className="text-[#0D2B1D]">Batch NMO-260722-A01</strong>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-emerald-900/10 shadow-2xs">
                <span className="text-[10px] text-stone-400 block uppercase">Test Date</span>
                <strong className="text-[#0D2B1D]">23-28 July 2026</strong>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-emerald-900/10 col-span-2 sm:col-span-1 shadow-2xs">
                <span className="text-[10px] text-stone-400 block uppercase">FSSAI License</span>
                <strong className="text-[#064E3B]">20824005000185</strong>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-emerald-900/10 text-[#0D2B1D] bg-emerald-50/70">
                    <th className="py-2.5 px-3 font-bold">Parameter</th>
                    <th className="py-2.5 px-3 font-bold">Result</th>
                    <th className="py-2.5 px-3 font-bold">FSSR 2011 Standard</th>
                    <th className="py-2.5 px-3 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/10 text-[#111815]">
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Milk Fat %</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-800">99.88%</td>
                    <td className="py-2.5 px-3">Not Less Than 99.5%</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">Passed</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Moisture %</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-800">&lt;0.5%</td>
                    <td className="py-2.5 px-3">Max 0.5%</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">Passed</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Added Sugar</td>
                    <td className="py-2.5 px-3">Not Detected (&lt;0.01)</td>
                    <td className="py-2.5 px-3">0% Allowed</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">Passed</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Synthetic Preservatives</td>
                    <td className="py-2.5 px-3">Zero</td>
                    <td className="py-2.5 px-3">0% Allowed</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">Passed</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Transparency Note */}
            <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200/50 flex items-start gap-2.5 text-xs text-[#4B5548] leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#064E3B]">Regulatory Disclosure:</strong> This accredited laboratory report demonstrates chemical compliance for representative production batch NMO-260722-A01. Individual seasonal batches may show subtle natural variation in golden carotene hue and aroma while strictly upholding FSSAI milk fat thresholds.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
