"use client";

import React from "react";
import { FileCheck, Download } from "lucide-react";

export default function CertificationsPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="nn-container max-w-4xl">
        
        {/* Header */}
        <section className="text-center mb-24">
          <div
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-8 border border-[#EAE2D2]">
              <FileCheck className="w-10 h-10 text-[#C99A3D]" />
            </div>
            <h1 className="nn-title text-5xl md:text-6xl mb-6 leading-tight">
              Certified & Approved
            </h1>
            <p className="nn-sub text-xl max-w-2xl mx-auto text-[#4A5450]">
              Quality isn&apos;t a claim - it&apos;s a paper trail. Every Namo Narayana product is produced in certified facilities and tested in accredited labs.
            </p>
          </div>
        </section>

        {/* Content */}
        <div
          className="bg-white rounded-2xl shadow-xl border border-[#EAD7BC] p-8 md:p-12"
        >
          <h2 className="text-3xl font-serif text-[#5E0B10] mb-8 border-b border-[#EAD7BC] pb-6">
            Regulatory Compliance
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-[#FCFAF5] p-3 rounded-lg mt-1">
                <FileCheck className="w-6 h-6 text-[#C99A3D]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2A1612] mb-2">FSSAI License</h3>
                <p className="text-[#4A352F] mb-4 leading-relaxed">
                  Licensed by India&apos;s Food Safety and Standards Authority. Our facilities meet all hygiene and safety requirements for food production.
                </p>
                <a 
                  href="/media/o_f20260715-011-015_2_25449c.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#C99A3D] font-semibold hover:text-[#A87845] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  View FSSAI License Certificate
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#FCFAF5] p-3 rounded-lg mt-1">
                <TestTubeIcon className="w-6 h-6 text-[#C99A3D]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2A1612] mb-2">Lab Reports</h3>
                <p className="text-[#4A352F] mb-4 leading-relaxed">
                  Batch-wise lab reports are available on request - write to us anytime. You can download the sample report below.
                </p>
                <a 
                  href="/media/o_f20260715-011-015_2_25449c.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm font-semibold shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Download Report (NMO-260722-A0)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Image Preview */}
        <div
          className="mt-16 text-center"
        >
          <img 
            src="/media/IMG-20260728-WA0131_jpg_b04570c5-92c7-4348-90a9-11972108ad9b_7f6e93.webp" 
            alt="Namo Narayana Certificate" 
            className="max-w-full md:max-w-2xl mx-auto rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          />
        </div>

      </div>
    </div>
  );
}

function TestTubeIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2" />
      <path d="M8.5 2h7" />
      <path d="M14.5 16h-5" />
    </svg>
  );
}
