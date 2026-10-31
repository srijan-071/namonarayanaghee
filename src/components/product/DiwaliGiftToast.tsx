"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Gift, X, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface DiwaliGiftToastProps {
  currentSlug?: string;
  onClaim?: () => void;
}

export default function DiwaliGiftToast({ currentSlug = "pure-desi-cow-ghee-1-litre", onClaim }: DiwaliGiftToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in this tab session
    try {
      const dismissed = sessionStorage.getItem("diwali_gift_toast_dismissed");
      if (dismissed === "true") {
        return;
      }
    } catch {}

    // Show after 1.2s delay for maximum psychological impact
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    try {
      sessionStorage.setItem("diwali_gift_toast_dismissed", "true");
    } catch {}
  };

  const handleClaimClick = () => {
    if (onClaim) {
      onClaim();
    } else {
      const target = document.getElementById("product-buy-now-btn") || document.querySelector("button[disabled=false]");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  // Dynamic gift details based on pack
  const is500ml = currentSlug.includes("500-ml");
  const is2_5L = currentSlug.includes("2-5-litre");
  const is5L = currentSlug.includes("5-litre");

  return (
    <div className="fixed bottom-20 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:max-w-md z-40 transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EC] to-[#FDF8EE] border-2 border-[#D4A017] rounded-2xl shadow-[0_12px_40px_rgba(94,11,16,0.22)] p-3.5 sm:p-4 text-[#5E0B10] relative overflow-hidden backdrop-blur-md">
        
        {/* Festive Gold Header Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4A017] via-[#FFD700] to-[#D4A017]" />

        {/* Top bar with Diwali Badge & Close Button */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 bg-[#8A1B14] text-amber-200 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs border border-amber-400/50">
            <Sparkles className="w-3 h-3 text-[#FFD700] animate-pulse" />
            <span>🪔 Diwali Special Deal</span>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss offer"
            className="w-6 h-6 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Offer Headline */}
        <div className="mb-2.5">
          <h4 className="font-serif font-extrabold text-sm sm:text-base text-[#5E0B10] flex items-center gap-1.5 leading-snug">
            <span>Free Festive Gifts Unlocked With Your Order!</span>
          </h4>
          <p className="text-[11px] sm:text-xs text-[#7A4A3B] leading-relaxed mt-0.5">
            {is500ml ? (
              <span>Upgrade to <strong>1L Ghee</strong> &amp; get a complimentary <strong>Cold-Pressed Mustard Oil (250ml)</strong> packed free!</span>
            ) : is2_5L ? (
              <span>Your <strong>2.5L Ghee</strong> includes <strong>3 Free Cold-Pressed Oils</strong> (Groundnut + Yellow Mustard + Mustard Oil)!</span>
            ) : is5L ? (
              <span>Your <strong>5L Ghee</strong> includes <strong>3 Large Cold-Pressed Oils</strong> (Coconut + Groundnut + Mustard 500ml)!</span>
            ) : (
              <span>Get <strong>1x Cold-Pressed Mustard Oil (250ml)</strong> completely FREE with this 1L Ghee order!</span>
            )}
          </p>
        </div>

        {/* Gift Visual Card */}
        <div className="bg-white/95 rounded-xl border border-[#EAD7BC] p-2 sm:p-2.5 flex items-center gap-3 mb-3 shadow-2xs">
          {/* Bottle Image with 100% Free Badge */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[#FAF9F5] border border-amber-100 shrink-0 overflow-hidden flex items-center justify-center p-1">
            <Image
              src={is5L ? "/assets/coconut-oil-250ml.webp" : is2_5L ? "/assets/groundnut-oil-250ml.webp" : "/assets/mustard-oil-250ml.webp"}
              alt="Free Cold-Pressed Oil Gift"
              width={64}
              height={64}
              className="object-contain max-h-full"
            />
            <span className="absolute bottom-0 inset-x-0 bg-emerald-700 text-white font-extrabold text-[8px] text-center uppercase py-0.5 tracking-tighter">
              100% FREE
            </span>
          </div>

          {/* Gift Description & Value */}
          <div className="flex-1 min-w-0 text-xs">
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#5E0B10] truncate">
              <Gift className="w-3.5 h-3.5 text-[#8A1B14] shrink-0" />
              <span className="truncate">
                {is5L ? "3x Premium Cold-Pressed Oils (Worth ₹650)" : is2_5L ? "3x Cold-Pressed Oils (Worth ₹450)" : "Cold-Pressed Mustard Oil 250ml"}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-emerald-700 font-extrabold text-sm sm:text-base">FREE</span>
              <span className="text-stone-400 text-xs line-through">
                {is5L ? "₹650" : is2_5L ? "₹450" : "₹149"}
              </span>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Auto-Added
              </span>
            </div>

            <p className="text-[10px] text-[#7A4A3B] mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>No coupon needed • Dispatched with parcel</span>
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleClaimClick}
          className="w-full bg-gradient-to-r from-[#FFB800] via-[#F59E0B] to-[#D97706] hover:brightness-105 active:scale-[0.98] text-stone-950 font-black py-2.5 px-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wide shadow-md flex items-center justify-center gap-1.5 border border-amber-300 cursor-pointer transition-all"
        >
          <span>Claim Free Gift with Order</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>

      </div>
    </div>
  );
}
