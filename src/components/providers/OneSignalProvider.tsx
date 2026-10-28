"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Bell, Gift, Sparkles, X, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { applyCoupon } from "@/lib/cart";
import DiwaliDiya from "@/components/ui/DiwaliDiya";

declare global {
  interface Window {
    OneSignalDeferred?: any[];
    OneSignal?: any;
  }
}

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "c467b8e5-6a21-4134-b8f6-9da89a7a9e06";
const ONESIGNAL_SAFARI_WEB_ID = process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID || "web.onesignal.auto.41b6a3ea-cfe2-480b-805a-97ab17a018f3";

export default function OneSignalProvider() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);

  useEffect(() => {
    // 1. Setup OneSignal deferred queue
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal: any) {
      try {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          safari_web_id: ONESIGNAL_SAFARI_WEB_ID,
          notifyButton: {
            enable: true,
            position: "bottom-left",
            theme: "default",
            size: "medium",
            showCredit: false,
          },
          allowLocalhostAsSecureOrigin: true,
        });

        // Check if user is already opted in
        const optedIn = OneSignal.User?.PushSubscription?.optedIn;
        if (optedIn) {
          setIsSubscribed(true);
        }

        // Listen for subscription changes (handles native prompt, notify button, or slidedown)
        OneSignal.User?.PushSubscription?.addEventListener("change", async (event: any) => {
          if (event.current && event.current.optedIn) {
            setIsSubscribed(true);
            const subId = event.current.id;
            const onesignalId = OneSignal.User?.onesignalId;

            // Trigger welcome push notification with discount code via backend API
            try {
              await fetch("/api/onesignal/welcome", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId: subId, onesignalId }),
              });
            } catch (err) {
              console.error("Failed to send welcome push:", err);
            }
          }
        });
      } catch (e) {
        console.error("OneSignal init error:", e);
      }
    });

    // 2. Delayed high-converting popup prompt for users who haven't subscribed yet
    const dismissed = sessionStorage.getItem("nn_onesignal_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => {
        // Only show if notifications permission isn't already granted or denied
        if (typeof Notification !== "undefined" && Notification.permission === "default") {
          setShowPrompt(true);
        }
      }, 3000); // 3 seconds after page loads

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllowNotifications = async () => {
    setIsPrompting(true);
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal: any) {
      try {
        await OneSignal.Notifications.requestPermission();
        const permission = Notification.permission;
        
        if (permission === "granted") {
          setIsSubscribed(true);
          const subId = OneSignal.User?.PushSubscription?.id;
          const onesignalId = OneSignal.User?.onesignalId;

          // Dispatch welcome push notification
          fetch("/api/onesignal/welcome", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscriptionId: subId, onesignalId }),
          }).catch(() => {});

          toast.success("Notifications enabled! Your 10% discount code is unlocked.");
        } else {
          setShowPrompt(false);
          sessionStorage.setItem("nn_onesignal_dismissed", "true");
        }
      } catch (err) {
        console.error("Permission request failed:", err);
        setShowPrompt(false);
      } finally {
        setIsPrompting(false);
      }
    });
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("nn_onesignal_dismissed", "true");
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("DIWALI");
    }
    applyCoupon("DIWALI");
    setCodeCopied(true);
    toast.success("Coupon DIWALI applied! FLAT 10% OFF added to your cart.");
    setTimeout(() => {
      setShowPrompt(false);
      sessionStorage.setItem("nn_onesignal_dismissed", "true");
    }, 1800);
  };

  return (
    <>
      {/* OneSignal SDK v16 Script */}
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="afterInteractive"
      />

      {/* High-Converting 10% Discount Notification Modal */}
      {showPrompt && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#2D0609] via-[#1F0406] to-[#120204] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-amber-500/40 overflow-hidden">
            
            {/* Top Amber Light Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 shadow-md" />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-amber-200/60 hover:text-white transition p-1 rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubscribed ? (
              // Step 1: Prompt State
              <div className="text-center space-y-4 pt-1">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-400/40 flex items-center justify-center shadow-inner">
                  <DiwaliDiya size={32} />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#4E1117] border border-amber-400/40 rounded-full px-3 py-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Exclusive Festive Gift</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                    Get FLAT 10% OFF Code
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-100/80 mt-1.5 leading-relaxed">
                    Allow notifications to receive your secret discount coupon code + real-time delivery alerts on your order.
                  </p>
                </div>

                <div className="bg-white/5 border border-amber-400/20 rounded-xl p-3 flex items-center justify-around text-xs text-amber-200/90 font-medium">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-amber-400" /> Free Gifts
                  </span>
                  <span className="w-1 h-1 rounded-full bg-amber-400/40" />
                  <span className="flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5 text-amber-400" /> VIP Dispatch Alerts
                  </span>
                  <span className="w-1 h-1 rounded-full bg-amber-400/40" />
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 100% Spam-Free
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleAllowNotifications}
                    disabled={isPrompting}
                    className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm py-3.5 px-4 rounded-xl shadow-lg hover:shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wide border border-amber-300"
                  >
                    <Bell className="w-4 h-4 fill-stone-950" />
                    <span>{isPrompting ? "Connecting..." : "Allow & Unlock 10% OFF"}</span>
                  </button>

                  <button
                    onClick={handleDismiss}
                    className="text-xs text-amber-200/60 hover:text-amber-200 transition underline underline-offset-4 cursor-pointer pt-1"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            ) : (
              // Step 2: Code Unlocked State
              <div className="text-center space-y-4 pt-1 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                    Discount Code Unlocked!
                  </h3>
                  <p className="text-xs text-amber-100/80 mt-1">
                    We also sent a confirmation to your device notification tray!
                  </p>
                </div>

                {/* Coupon Code Reveal Card */}
                <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border-2 border-dashed border-amber-400/80 rounded-2xl p-4">
                  <span className="text-[10px] uppercase font-bold text-amber-300 tracking-widest block mb-1">
                    Your Secret Coupon Code:
                  </span>
                  <div className="font-mono text-3xl font-black text-amber-300 tracking-wider">
                    DIWALI
                  </div>
                  <span className="text-xs text-amber-200/90 font-medium mt-1 block">
                    Gives FLAT 10% OFF on all Pure A2 Gir Cow Ghee orders
                  </span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm py-3.5 px-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wide border border-amber-300"
                >
                  {codeCopied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Code Applied to Cart!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Code &amp; Apply 10% OFF</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
