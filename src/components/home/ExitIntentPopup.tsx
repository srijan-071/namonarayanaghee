"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("nn_festive_offer_closed", "true");
    }
  }, []);

  const handleShopNow = useCallback(() => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("nn_festive_offer_closed", "true");
    }
    router.push("/collections/ghee");
  }, [router]);

  useEffect(() => {
    // Check if already dismissed in this session
    const isDismissed = sessionStorage.getItem("nn_festive_offer_closed");

    // Listen for manual trigger from header announcement bar or buttons
    const handleManualOpen = () => {
      setIsVisible(true);
    };
    window.addEventListener("open-promo-popup", handleManualOpen);
    window.addEventListener("open-festive-popup", handleManualOpen);

    // If dismissed already, don't auto-open, but keep manual trigger active
    if (isDismissed) {
      return () => {
        window.removeEventListener("open-promo-popup", handleManualOpen);
        window.removeEventListener("open-festive-popup", handleManualOpen);
      };
    }

    let timerId: NodeJS.Timeout | null = null;
    let hasStartedTimer = false;

    // Trigger timer after user's first engagement (scroll, touch, click, keydown, mousemove)
    const startEngagementTimer = () => {
      if (hasStartedTimer) return;
      hasStartedTimer = true;

      // Remove engagement listeners once first engagement is detected
      engagementEvents.forEach((event) => {
        window.removeEventListener(event, startEngagementTimer);
      });

      // Show popup precisely 10 seconds after first engagement
      timerId = setTimeout(() => {
        const dismissedNow = sessionStorage.getItem("nn_festive_offer_closed");
        if (!dismissedNow) {
          setIsVisible(true);
        }
      }, 10000);
    };

    const engagementEvents = ["scroll", "pointerdown", "touchstart", "click", "keydown"];
    engagementEvents.forEach((event) => {
      window.addEventListener(event, startEngagementTimer, { passive: true, once: true });
    });

    // Fallback: If user stays idle without engaging for 15 seconds, also start timer
    const idleFallback = setTimeout(() => {
      if (!hasStartedTimer) {
        startEngagementTimer();
      }
    }, 5000);

    return () => {
      window.removeEventListener("open-promo-popup", handleManualOpen);
      window.removeEventListener("open-festive-popup", handleManualOpen);
      engagementEvents.forEach((event) => {
        window.removeEventListener(event, startEngagementTimer);
      });
      if (timerId) clearTimeout(timerId);
      clearTimeout(idleFallback);
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Festive Ghee and Oils Offer"
    >
      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-[420px] sm:max-w-[460px] md:max-w-[500px] aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.6),0_0_50px_rgba(217,119,6,0.3)] border border-amber-300/40 bg-black animate-in zoom-in-95 duration-300 ease-out group select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Cross Close Button */}
        <button 
          onClick={handleClose}
          type="button"
          aria-label="Close offer popup"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/65 hover:bg-black/90 text-white/90 hover:text-white backdrop-blur-md border border-white/30 shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <X className="w-5 h-5 sm:w-5 sm:h-5 drop-shadow-md" strokeWidth={2.5} />
        </button>

        {/* Clickable Image Banner linking to Shop */}
        <div 
          onClick={handleShopNow}
          className="relative w-full h-full cursor-pointer overflow-hidden block"
          title="Click to Shop A2 Ghee & Claim Free Oils"
        >
          <Image 
            src="/assets/Festive_Ghee_and_Oils_Offer.webp" 
            alt="Buy Ghee. Get Oils Free. Pure goodness for your festive rituals - Free 500ml Mustard Oil, 250ml Groundnut Oil, 250ml Coconut Oil" 
            fill 
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 500px, 500px"
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />

          {/* Interactive Subtle Pulsing Indicator at bottom */}
          <div className="absolute bottom-2.5 inset-x-3 sm:bottom-3 sm:inset-x-4 z-20 flex items-center justify-between py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-950/80 via-black/80 to-amber-950/80 border border-amber-400/40 backdrop-blur-md text-amber-200 text-xs sm:text-sm font-semibold tracking-wide shadow-lg group-hover:border-amber-300 transition-colors">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              Limited Festive Special
            </span>
            <span className="flex items-center gap-1 text-white font-bold group-hover:translate-x-0.5 transition-transform">
              Claim Offer <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
