"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, ArrowRight, Loader2 } from "lucide-react";

function PayProxyContent() {
  const searchParams = useSearchParams();

  const txnid = searchParams.get("txnid") || searchParams.get("orderId") || searchParams.get("order_id");
  const amount = searchParams.get("amount");
  const productinfo = searchParams.get("productinfo") || "Pure A2 Gir Cow Ghee";
  const firstname = searchParams.get("firstname") || searchParams.get("name") || "Customer";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";

  const [destinationUrl, setDestinationUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!txnid || !amount) {
      setError("Missing required payment details (Order ID or Amount).");
      return;
    }

    const isAdmin = ["hurkinds@gmail.com", "littlecodr@gmail.com"].includes((email || "").toLowerCase().trim());
    const effectiveAmount = isAdmin ? "1" : amount;

    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.namonarayanaghee.store";
    const returnUrl = `${origin}/api/razorpay/callback`;
    const cancelUrl = `${origin}/cart`;

    const potterParams = new URLSearchParams();
    potterParams.set("order_id", txnid);
    potterParams.set("txnid", txnid);
    potterParams.set("amount", effectiveAmount);
    potterParams.set("firstname", firstname);
    potterParams.set("email", email);
    potterParams.set("phone", phone);
    potterParams.set("productinfo", productinfo);
    potterParams.set("returnUrl", returnUrl);
    potterParams.set("cancelUrl", cancelUrl);
    potterParams.set("brand", "namonarayanaghee");

    const target = `https://potter-world.com/pay-proxy?${potterParams.toString()}`;
    setDestinationUrl(target);

    // Ultra-fast 150ms aesthetic redirect delay for seamless combined transition under 1s
    const timer = setTimeout(() => {
      window.location.href = target;
    }, 150);

    return () => clearTimeout(timer);
  }, [txnid, amount, productinfo, firstname, email, phone]);

  if (error) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FCFAF5] p-4 font-sans text-[#5E0B10]">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-[#EAD7BC] flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-serif font-bold text-[#5E0B10] mb-2">Payment Initialisation Error</h1>
          <p className="text-[#7A4A3B] mb-6 text-sm">{error}</p>
          <button
            onClick={() => (window.location.href = "/cart")}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FCFAF5] p-4 font-sans text-[#5E0B10]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-[#EAD7BC] flex flex-col items-center relative overflow-hidden">
        
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#D4A017]"></div>

        {/* Namo Narayana Brand Emblem */}
        <div className="mb-8 flex items-center justify-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#8A1B14] to-[#5E0B10] rounded-full flex items-center justify-center shadow-lg shadow-[#8A1B14]/20 border-2 border-[#D4A017]">
            <span className="text-[#F5BD47] font-serif font-bold text-2xl" style={{ marginTop: "-2px" }}>ॐ</span>
          </div>
          <span className="text-3xl font-serif font-bold text-[#5E0B10]">
            Namo <span className="text-[#D4A017]">Narayana</span>
          </span>
        </div>

        {/* Animated Loader */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-[#EAD7BC] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#8A1B14] rounded-full border-t-transparent animate-spin"></div>
        </div>

        <h1 className="text-xl font-serif font-bold text-[#5E0B10] mb-2">
          Connecting to Secure Gateway
        </h1>

        <div className="bg-[#FCFAF5] border border-[#EAD7BC] rounded-xl p-4 mb-6 text-left w-full space-y-1">
          <div className="flex justify-between text-xs text-[#7A4A3B]">
            <span>Order Reference:</span>
            <span className="font-mono font-bold text-[#5E0B10]">#{txnid?.slice(0, 12)}</span>
          </div>
          {amount && (
            <div className="flex justify-between text-xs text-[#7A4A3B] pt-1 border-t border-[#EAD7BC]/50">
              <span>Amount:</span>
              <span className="font-bold text-[#8A1B14] text-sm">
                ₹{["hurkinds@gmail.com", "littlecodr@gmail.com"].includes(email?.toLowerCase().trim() || "") ? "1.00 (Admin Test)" : parseFloat(amount).toFixed(2)}
              </span>
            </div>
          )}
          <p className="text-[#4A352F] text-[11px] leading-relaxed text-center pt-2">
            You are being securely directed to complete your transaction via <strong>Razorpay</strong>.
          </p>
        </div>

        <div className="w-full bg-[#8A1B14]/5 border border-[#8A1B14]/20 text-[#8A1B14] text-xs py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#D4A017]" />
          <span>Please do not refresh or close this window</span>
        </div>

        {destinationUrl && (
          <div className="mt-4 w-full">
            <a
              href={destinationUrl}
              className="text-xs text-[#7A4A3B] hover:text-[#8A1B14] underline flex items-center justify-center gap-1"
            >
              Click here if you are not redirected automatically <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Footer security mark */}
        <div className="mt-8 pt-6 border-t border-[#EAD7BC] w-full">
          <p className="text-[11px] text-[#7A4A3B] font-medium flex justify-center items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017]" />
            256-bit Bank Grade Encrypted Gateway
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PayProxyPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FCFAF5] text-[#5E0B10]">
          <Loader2 className="w-8 h-8 animate-spin text-[#8A1B14] mb-3" />
          <span className="text-sm font-medium">Connecting to secure checkout...</span>
        </div>
      }
    >
      <PayProxyContent />
    </Suspense>
  );
}
