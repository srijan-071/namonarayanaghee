"use client";

import React from "react";
import { Gift, Sparkles, Check } from "lucide-react";

interface VedicHeritageRewardBannerProps {
  amount?: number;
  className?: string;
}

export default function VedicHeritageRewardBanner({
  amount = 250,
  className = "",
}: VedicHeritageRewardBannerProps) {
  const couponCode = `FIRST${amount}`;

  return (
    <aside
      aria-label="Vedic Heritage Reward - First Order & Next Order Gift Card"
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#04261C] via-[#063B2C] to-[#084837] border border-[#D4AF37]/35 shadow-[0_12px_28px_-6px_rgba(4,38,28,0.4),0_2px_8px_rgba(0,0,0,0.08)] p-3 sm:p-4 md:px-5 md:py-4 text-white transition-all duration-300 hover:border-[#D4AF37]/50 ${className}`}
    >
      {/* Subtle luxury ambient gold glow behind banner */}
      <div
        className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#D4AF37]/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-[#D4AF37]/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Left & Middle Block */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          {/* Left Decorative Gold Gift Icon Badge */}
          <div className="relative shrink-0 flex items-center justify-center mt-0.5 sm:mt-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#104D3B] to-[#05281E] border border-[#D4AF37]/40 flex items-center justify-center shadow-inner">
              <Gift className="w-5 h-5 text-[#F5E5B8] drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]" />
              {/* Delicate sparkle accents */}
              <span
                className="absolute -top-1 -right-1 text-[#F5E5B8] text-[10px] leading-none select-none animate-pulse"
                aria-hidden="true"
              >
                ✦
              </span>
              <span
                className="absolute -bottom-1 -left-1 text-[#F5E5B8]/80 text-[8px] leading-none select-none"
                aria-hidden="true"
              >
                ✦
              </span>
            </div>
          </div>

          {/* Thin Vertical Gold Divider (visible on sm+) */}
          <div
            className="hidden sm:block h-10 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent shrink-0"
            aria-hidden="true"
          />

          {/* Text Content */}
          <div className="min-w-0 flex-1">
            {/* Eyebrow */}
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase text-[#EADBB6]">
                FIRST PURCHASE EXCLUSIVE • DOUBLE VEDIC REWARD
              </span>
            </div>

            {/* Main Title with ₹amount Off Now Focal Highlight */}
            <h3 className="font-serif text-[13.5px] sm:text-[15px] md:text-[16px] font-bold leading-snug text-white flex flex-wrap items-center gap-1 sm:gap-1.5">
              <span>First Order:</span>
              <span className="inline-flex items-center bg-[#F5E5B8]/15 border border-[#D4AF37]/60 text-[#FCEEC8] px-2 py-0.5 rounded-full font-bold shadow-2xs whitespace-nowrap">
                Flat ₹{amount} OFF
              </span>
              <span className="text-[#EADBB6] font-normal sm:font-semibold">
                + ₹{amount} Next-Order Card!
              </span>
            </h3>

            {/* Supporting Text */}
            <p className="mt-1 text-[11px] sm:text-xs text-[#E3DDD1] leading-relaxed">
              Get an instant <strong className="text-white font-semibold">₹{amount} discount</strong> at cart &amp; checkout today, plus receive an additional{" "}
              <strong className="text-white font-semibold underline decoration-[#D4AF37]/60 underline-offset-2">
                ₹{amount} Gift Card
              </strong>{" "}
              for your next order!
            </p>
          </div>
        </div>

        {/* Right-Side Reward Ticket Voucher (Optimized for Mobile & Desktop Alignment) */}
        <div className="w-full md:w-auto shrink-0 flex items-center justify-center md:justify-end pt-1 md:pt-0">
          <div
            className="relative flex items-center justify-between gap-2.5 sm:gap-3 bg-gradient-to-br from-[#FFFDF5] via-[#FDF7E7] to-[#F5E8C4] text-[#17231E] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[#D4AF37]/50 shadow-[0_4px_14px_rgba(0,0,0,0.15)] w-full sm:w-auto min-w-[210px] sm:min-w-[220px] max-w-[340px] md:max-w-none overflow-hidden"
          >
            {/* Left Ticket Notch Cutout */}
            <div
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#063B2C] border-r border-[#D4AF37]/50"
              aria-hidden="true"
            />
            {/* Right Ticket Notch Cutout */}
            <div
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#084837] border-l border-[#D4AF37]/50"
              aria-hidden="true"
            />

            {/* Ticket Left: Discount Value */}
            <div className="flex flex-col items-center justify-center shrink-0 pl-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#075B43] leading-none">
                SAVE
              </span>
              <span className="text-[16px] sm:text-[18px] font-black tracking-tight text-[#075B43] font-serif leading-none mt-0.5">
                ₹{amount}
              </span>
              <span className="text-[8px] font-bold text-[#17231E]/70 uppercase leading-none mt-0.5">
                NOW
              </span>
            </div>

            {/* Vertical Dashed Ticket Separator */}
            <div
              className="h-9 w-px border-l border-dashed border-[#B89A62]/60 shrink-0 mx-1"
              aria-hidden="true"
            />

            {/* Ticket Right: Next Order Gift Card */}
            <div className="flex flex-col text-left pr-1.5 min-w-0 flex-1">
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wide text-[#17231E] uppercase leading-tight font-serif truncate">
                + ₹{amount} GIFT CARD
              </span>
              <span className="text-[8px] sm:text-[8.5px] font-bold text-[#075B43] tracking-wide uppercase leading-tight mt-0.5 truncate">
                FOR YOUR NEXT ORDER
              </span>
              <div className="mt-1 flex items-center gap-1">
                <span className="inline-flex items-center gap-0.5 bg-[#075B43]/10 text-[#075B43] px-1.5 py-0.5 rounded text-[8px] font-bold">
                  <Check className="w-2.5 h-2.5 stroke-[3]" /> Code: {couponCode}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

