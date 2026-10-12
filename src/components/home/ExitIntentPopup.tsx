"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Listen for manual trigger
    const handleManualOpen = () => {
      setIsVisible(true);
    };
    window.addEventListener("open-promo-popup", handleManualOpen);

    // Only show once per session for exit intent
    const shown = sessionStorage.getItem("nn_exit_intent_shown");
    if (shown) {
      setHasShown(true);
    }

    // Timer for 45 seconds auto-show
    const timerId = setTimeout(() => {
      if (!shown && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("nn_exit_intent_shown", "true");
      }
    }, 45000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("nn_exit_intent_shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("open-promo-popup", handleManualOpen);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timerId);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const { db } = await import("@/lib/firebase");
      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore/lite");
      
      await addDoc(collection(db, "promo_emails"), {
        email: email.toLowerCase().trim(),
        createdAt: serverTimestamp(),
      });
      
      setIsSuccess(true);
      toast.success("Check your email for more offers!");
    } catch (error) {
      console.error("Error saving email:", error);
      toast.error("Something went wrong. Here is your code anyway!");
      setIsSuccess(true); // show it anyway to not block user
    } finally {
      setIsLoading(false);
    }
  };

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
            <h3 className="font-serif text-3xl font-bold leading-tight">Get 10% Off Your Order</h3>
          </div>
        </div>

        <div className="p-8 text-center">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-[#364935] font-medium mb-4">
                Enter your email address to unlock a 10% discount coupon code instantly!
              </p>
              
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#C2C7BB] focus:outline-none focus:ring-2 focus:ring-[#1E3A24] bg-white text-[#364935]"
                required
              />
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1E3A24] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#152919] shadow-lg transition disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  "Unlock 10% Off Code"
                )}
              </button>
              
              <button 
                type="button"
                onClick={() => setIsVisible(false)}
                className="mt-4 text-[#576B55] text-sm font-medium hover:text-[#1E3A24] underline decoration-[#C2C7BB] underline-offset-4"
              >
                No thanks, I prefer paying full price
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <p className="text-[#364935] font-medium text-lg">
                Success! Here is your 10% off code:
              </p>
              
              <div className="bg-[#C38936]/20 border-2 border-dashed border-[#C38936] py-4 px-6 rounded-xl inline-block mx-auto">
                <span className="text-3xl font-bold text-[#1E3A24] tracking-widest">ELVISH10</span>
              </div>
              
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
