"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface DiwaliGiftToastProps {
  currentSlug?: string;
  onClaim?: () => void;
}

export default function DiwaliGiftToast({ currentSlug = "pure-desi-cow-ghee-1-litre", onClaim }: DiwaliGiftToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("nn_diwali_toast_dismissed") === "true") {
        return;
      }
    } catch {}

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    try {
      sessionStorage.setItem("nn_diwali_toast_dismissed", "true");
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

  // Dynamic gift photo and copy mapped strictly to the pack
  let gift = {
    name: "Cold-Pressed Mustard Oil (250ml)",
    worth: "₹149",
    image: "/assets/mustard-oil-250ml.webp",
    detail: "Free with 1L Ghee order"
  };

  if (currentSlug.includes("2-5-litre")) {
    gift = {
      name: "3 Free Cold-Pressed Oils",
      worth: "₹450",
      image: "/assets/groundnut-oil-250ml.webp",
      detail: "Mustard + Groundnut + Yellow Mustard"
    };
  } else if (currentSlug.includes("5-litre")) {
    gift = {
      name: "3 Free Large Cold-Pressed Oils",
      worth: "₹650",
      image: "/assets/coconut-oil-250ml.webp",
      detail: "Coconut + Groundnut + Mustard 500ml"
    };
  } else if (currentSlug.includes("500-ml")) {
    gift = {
      name: "Cold-Pressed Mustard Oil (250ml)",
      worth: "₹149",
      image: "/assets/mustard-oil-250ml.webp",
      detail: "Unlocked on 1L pack"
    };
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white/98 backdrop-blur-md border border-stone-200/90 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.14)] p-2.5 flex items-center gap-3">
        
        {/* Specific Bottle Image */}
        <div className="relative w-12 h-12 rounded-xl bg-[#FAF9F5] border border-stone-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
          <Image
            src={gift.image}
            alt={gift.name}
            width={44}
            height={44}
            className="object-contain max-h-full"
          />
          <span className="absolute -top-0.5 -right-0.5 bg-emerald-700 text-white font-extrabold text-[8px] px-1 py-0.2 rounded-full shadow-2xs">
            FREE
          </span>
        </div>

        {/* Minimalist Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#8A1B14] uppercase tracking-wider">
              Diwali Gift
            </span>
            <span className="text-[10px] text-stone-300">•</span>
            <span className="text-[10px] text-stone-400 line-through">
              {gift.worth}
            </span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
              ₹0
            </span>
          </div>
          <p className="text-xs font-bold text-stone-900 truncate">
            {gift.name}
          </p>
          <p className="text-[10px] text-stone-500 truncate">
            {gift.detail}
          </p>
        </div>

        {/* Minimal Action & Close */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleClaimClick}
            className="bg-[#5E0B10] hover:bg-[#4A080C] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition cursor-pointer"
          >
            Claim
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-6 h-6 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center transition cursor-pointer"
            aria-label="Dismiss gift toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
