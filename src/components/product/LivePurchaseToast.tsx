"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, X } from "lucide-react";

interface RecentPurchase {
  name: string;
  city: string;
  pack: string;
  timeAgo: string;
}

const RECENT_PURCHASES: RecentPurchase[] = [
  { name: "Pooja Sharma", city: "Jaipur, Rajasthan", pack: "1 Litre A2 Gir Cow Ghee", timeAgo: "3 minutes ago" },
  { name: "Vikram Malhotra", city: "Delhi NCR", pack: "5 Litre Family Pack (Save ₹2,500)", timeAgo: "7 minutes ago" },
  { name: "Dr. Arvind Rao", city: "Bengaluru, Karnataka", pack: "2.5 Litre Value Pack", timeAgo: "12 minutes ago" },
  { name: "Sneha Patel", city: "Ahmedabad, Gujarat", pack: "1 Litre A2 Gir Cow Ghee", timeAgo: "16 minutes ago" },
  { name: "Rajesh Verma", city: "Lucknow, UP", pack: "5 Litre Family Mega Pack", timeAgo: "21 minutes ago" },
  { name: "Kavita Reddy", city: "Hyderabad, Telangana", pack: "1 Litre A2 Gir Cow Ghee", timeAgo: "25 minutes ago" },
  { name: "Amitabh Sen", city: "Kolkata, WB", pack: "2.5 Litre Value Pack", timeAgo: "32 minutes ago" },
  { name: "Meera Deshmukh", city: "Pune, Maharashtra", pack: "500 ml Trial Pack", timeAgo: "39 minutes ago" },
];

export default function LivePurchaseToast() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show after initial delay
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Loop through notifications
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % RECENT_PURCHASES.length);
        setIsVisible(true);
      }, 1000);
    }, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed) return null;

  const item = RECENT_PURCHASES[currentIdx];

  return (
    <div
      className={`fixed bottom-20 left-4 z-40 max-w-sm bg-white/95 backdrop-blur-md border border-emerald-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] rounded-xl p-3 transition-all duration-500 ease-out sm:bottom-6 sm:left-6 ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-amber-50 shrink-0 border border-amber-200/60 shadow-inner">
          <Image
            src="/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"
            alt="Pure A2 Ghee"
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-gray-900 truncate">{item.name}</span>
            <span className="text-[10px] text-gray-400 font-normal">in {item.city}</span>
          </div>
          <p className="text-[11px] font-semibold text-[#1E3A24] truncate mt-0.5">
            Purchased {item.pack}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
            <span>Verified Purchase • {item.timeAgo}</span>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-gray-400 hover:text-gray-600 p-1 -mr-1 -mt-5 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
