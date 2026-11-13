"use client";

import React from "react";
import { Gift, Sparkles } from "lucide-react";

interface VedicHeritageRewardBannerProps {
  amount?: number;
  className?: string;
}

export default function VedicHeritageRewardBanner({
  amount = 250,
  className = "",
}: VedicHeritageRewardBannerProps) {
  return (
    <aside
      aria-label="Vedic Heritage Reward"
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#04261C] via-[#063B2C] to-[#084837] border border-[#D4AF37]/30 shadow-[0_12px_28px_-6px_rgba(4,38,28,0.4),0_2px_8px_rgba(0,0,0,0.08)] p-3.5 sm:p-4 md:px-5 md:py-4 text-white transition-all duration-300 hover:border-[#D4AF37]/50 ${className}`}
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

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
        {/* Left & Middle Block */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Left Decorative Gold Gift Icon Badge */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#104D3B] to-[#05281E] border border-[#D4AF37]/40 flex items-center justify-center shadow-inner group">
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

          {/* Thin Vertical Gold Divider (hidden on very small screens, visible on sm+) */}
          <div
            className="hidden sm:block h-9 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent shrink-0"
            aria-hidden="true"
          />

          {/* Text Content */}
          <div className="min-w-0 flex-1">
            {/* Eyebrow */}
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase text-[#EADBB6]">
                LIMITED-TIME VEDIC HERITAGE REWARD
              </span>
            </div>

            {/* Main Title with ₹250 Gift Card Focal Highlight */}
            <h3 className="font-serif text-[14px] sm:text-[15px] md:text-[16px] font-bold leading-snug text-white flex flex-wrap items-center gap-1 sm:gap-1.5">
              <span>Purchase Now &amp; Get a</span>
              <span className="inline-flex items-center bg-[#F5E5B8]/15 border border-[#D4AF37]/60 text-[#FCEEC8] px-2 py-0.5 rounded-full font-bold shadow-2xs whitespace-nowrap">
                ₹{amount} Gift Card
              </span>
              <span>!</span>
            </h3>

            {/* Supporting Text */}
            <p className="mt-1 text-[11px] sm:text-xs text-[#E3DDD1] leading-relaxed">
              Complete your purchase today and receive a ₹{amount} gift card to redeem on your{" "}
              <strong className="text-white font-semibold underline decoration-[#D4AF37]/60 underline-offset-2">
                NEXT ORDER
              </strong>
              .
            </p>
          </div>
        </div>

        {/* Right-Side Reward Ticket */}
        <div className="shrink-0 self-stretch sm:self-auto flex items-center justify-end">
          <div
            className="relative flex items-center gap-2.5 sm:gap-3 bg-gradient-to-br from-[#FFFDF5] via-[#FDF7E7] to-[#F5E8C4] text-[#17231E] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[#D4AF37]/50 shadow-[0_4px_14px_rgba(0,0,0,0.15)] min-w-[170px] sm:min-w-[190px] justify-between overflow-hidden"
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

            {/* Ticket Left Icon */}
            <div className="flex flex-col items-center justify-center shrink-0 pl-1">
              <Gift className="w-4 h-4 text-[#075B43]" />
              <span className="text-[14px] sm:text-[16px] font-black tracking-tight text-[#075B43] font-serif leading-none mt-0.5">
                ₹{amount}
              </span>
            </div>

            {/* Vertical Dashed Ticket Separator */}
            <div
              className="h-8 w-px border-l border-dashed border-[#B89A62]/60 shrink-0"
              aria-hidden="true"
            />

            {/* Ticket Right Copy */}
            <div className="flex flex-col text-left pr-1">
              <span className="text-[11px] sm:text-xs font-extrabold tracking-wider text-[#17231E] uppercase leading-tight font-serif">
                GIFT CARD
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-bold text-[#075B43] tracking-wide uppercase leading-tight mt-0.5">
                FOR YOUR NEXT PURCHASE
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

