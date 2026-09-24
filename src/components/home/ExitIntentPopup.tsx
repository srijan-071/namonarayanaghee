"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Only show once per session
    const shown = sessionStorage.getItem("nn_exit_intent_shown");
    if (shown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("nn_exit_intent_shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsVisible(false)}
      />
      
      <div className="relative bg-[#FAF9F5] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/50 text-[#1E3A24] hover:bg-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-48 w-full bg-[#1E3A24]">
          <Image 
            src="/assets/bestsellers-bg.jpg" 
            alt="Pure A2 Ghee" 
            fill 
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6 drop-shadow-md">
            <span className="text-xs font-bold tracking-widest uppercase mb-2">Wait! Before you go...</span>
            <h3 className="font-serif text-3xl font-bold leading-tight">Take 10% Off Your First Order</h3>
          </div>
        </div>

        <div className="p-8 text-center space-y-6">
          <p className="text-[#364935] font-medium">
            Use code <strong className="text-[#1E3A24] text-lg bg-[#C38936]/20 px-2 py-1 rounded">ELVISH10</strong> at checkout to claim your discount today only.
          </p>
          
          <button 
            onClick={() => {
              navigator.clipboard.writeText("ELVISH10");
              toast.success("Coupon code ELVISH10 copied to clipboard!");
              setIsVisible(false);
            }}
            className="w-full bg-[#1E3A24] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#152919] shadow-lg transition"
          >
            Copy Code & Keep Shopping
          </button>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="text-[#576B55] text-sm font-medium hover:text-[#1E3A24] underline decoration-[#C2C7BB] underline-offset-4"
          >
            No thanks, I prefer paying full price
          </button>
        </div>
      </div>
    </div>
  );
}
