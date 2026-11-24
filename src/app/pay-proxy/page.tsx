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
  const action = searchParams.get("action") || searchParams.get("type") || "";

  const cleanId = (txnid || "").toString().replace(/^#/, "").trim();
  const isPrepay = action.toLowerCase() === "prepay" || cleanId.toLowerCase().endsWith("-prepay");
  const baseOrderId = cleanId.replace(/-PREPAY$/i, "");

  const [destinationUrl, setDestinationUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = ["hurkinds@gmail.com", "littlecodr@gmail.com"].includes((email || "").toLowerCase().trim());
  const effectiveAmount = isAdmin ? "1" : (amount || "0");

  useEffect(() => {
    if (!txnid || !amount) {
      setError("Missing required payment details (Order ID or Amount).");
      return;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.namonarayanaghee.store";
    const returnUrl = isPrepay
      ? `${origin}/api/convert-cod-to-prepaid?orderId=${encodeURIComponent(baseOrderId)}&amount=${effectiveAmount}`
      : `${origin}/api/razorpay/callback`;
    const cancelUrl = isPrepay
      ? `${origin}/track-order?orderId=${encodeURIComponent(baseOrderId)}`
      : `${origin}/cart`;

    const potterParams = new URLSearchParams();
    potterParams.set("order_id", isPrepay ? `${baseOrderId}-PREPAY` : txnid);
    potterParams.set("txnid", isPrepay ? `${baseOrderId}-PREPAY` : txnid);
    potterParams.set("amount", effectiveAmount);
    potterParams.set("firstname", firstname);
    potterParams.set("email", email);
    potterParams.set("phone", phone);
    potterParams.set("productinfo", isPrepay ? `Prepay Upgrade for Order #${baseOrderId} (COD to Prepaid)` : productinfo);
    potterParams.set("embed", "true");
    potterParams.set("returnUrl", returnUrl);
    potterParams.set("cancelUrl", cancelUrl);
    potterParams.set("brand", "namonarayanaghee");

    const target = `https://potter-world.com/pay-proxy?${potterParams.toString()}`;
    setDestinationUrl(target);
  }, [txnid, amount, productinfo, firstname, email, phone, isPrepay, baseOrderId, effectiveAmount]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!event.origin.includes("potter-world.com")) return;

      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "RAZORPAY_SUCCESS") {
        if (isPrepay) {
          try {
            await fetch("/api/convert-cod-to-prepaid", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: baseOrderId,
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_order_id: data.razorpay_order_id,
                razorpay_signature: data.razorpay_signature,
                amountPaidPaise: Math.round(Number(effectiveAmount) * 100),
              }),
            });
          } catch (e) {
            console.error("Prepay conversion error:", e);
          }

          window.location.href = `/track-order?orderId=${encodeURIComponent(baseOrderId)}&upgradedPrepaid=true`;
        } else {
          try {
            await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_order_id: data.razorpay_order_id,
                razorpay_signature: data.razorpay_signature,
              }),
            });
          } catch (e) {
            console.error("Verification error:", e);
          }

          const successUrl = `/checkout/success?orderId=${encodeURIComponent(data.orderId)}&status=success&razorpay_payment_id=${encodeURIComponent(data.razorpay_payment_id || "")}&razorpay_order_id=${encodeURIComponent(data.razorpay_order_id || "")}&razorpay_signature=${encodeURIComponent(data.razorpay_signature || "")}`;
          window.location.href = successUrl;
        }
      } else if (data.type === "RAZORPAY_DISMISSED" || data.type === "RAZORPAY_FAILED") {
        window.location.href = isPrepay
          ? `/track-order?orderId=${encodeURIComponent(baseOrderId)}`
          : "/checkout";
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isPrepay, baseOrderId, effectiveAmount]);

  if (error) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAF9F5] p-4 font-sans text-[#17231E]">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-[#EAE7DF] flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-serif font-bold text-[#17231E] mb-2">Payment Initialisation Error</h1>
          <p className="text-[#727B75] mb-6 text-sm">{error}</p>
          <button
            onClick={() => (window.location.href = "/cart")}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#075B43] to-[#064635] text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition cursor-pointer"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF9F5] p-4 font-sans text-[#17231E]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-[#EAE7DF] flex flex-col items-center relative overflow-hidden">
        
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#B89A62]"></div>

        {/* Namo Narayana Brand Emblem */}
        <div className="mb-8 flex items-center justify-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#075B43] to-[#064635] rounded-full flex items-center justify-center shadow-lg shadow-[#075B43]/20 border-2 border-[#B89A62]">
            <span className="text-[#B89A62] font-serif font-bold text-2xl" style={{ marginTop: "-2px" }}>ॐ</span>
          </div>
          <span className="text-3xl font-serif font-bold text-[#17231E]">
            Namo <span className="text-[#075B43]">Narayana</span>
          </span>
        </div>

        {/* Animated Loader */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-[#EAE7DF] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#075B43] rounded-full border-t-transparent animate-spin"></div>
        </div>

        <h1 className="text-xl font-serif font-bold text-[#17231E] mb-2">
          Connecting to Secure Gateway
        </h1>

        <div className="bg-[#FAF9F5] border border-[#EAE7DF] rounded-xl p-4 mb-6 text-left w-full space-y-1">
          <div className="flex justify-between text-xs text-[#727B75]">
            <span>Order Reference:</span>
            <span className="font-mono font-bold text-[#17231E]">#{baseOrderId ? baseOrderId.slice(0, 16) : txnid?.slice(0, 12)}</span>
          </div>
          {amount && (
            <div className="flex justify-between text-xs text-[#727B75] pt-1 border-t border-[#EAE7DF]/50">
              <span>{isPrepay ? "Discounted Prepay Balance:" : "Amount:"}</span>
              <span className="font-bold text-[#075B43] text-sm">
                ₹{isAdmin ? "1.00 (Admin Test)" : parseFloat(amount).toFixed(2)}
              </span>
            </div>
          )}
          <p className="text-[#727B75] text-[11px] leading-relaxed text-center pt-2">
            You are being securely directed to complete your transaction via <strong>Razorpay</strong>.
          </p>
        </div>

        <div className="w-full bg-[#075B43]/5 border border-[#075B43]/20 text-[#075B43] text-xs py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#B89A62]" />
          <span>Please do not refresh or close this window</span>
        </div>

        {destinationUrl && (
          <div className="mt-4 w-full">
            <a
              href={destinationUrl}
              className="text-xs text-[#727B75] hover:text-[#075B43] underline flex items-center justify-center gap-1"
            >
              Click here if you are not redirected automatically <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Footer security mark */}
        <div className="mt-8 pt-6 border-t border-[#EAE7DF] w-full">
          <p className="text-[11px] text-[#727B75] font-medium flex justify-center items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#075B43]" />
            256-bit Bank Grade Encrypted Gateway
          </p>
        </div>
      </div>

      {destinationUrl && (
        <iframe
          src={destinationUrl}
          title="Secure Payment Gateway"
          className="fixed inset-0 w-full h-full border-0 z-50 bg-transparent"
          allow="payment *; clipboard-read *; clipboard-write *"
        />
      )}
    </div>
  );
}

export default function PayProxyPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF9F5] text-[#17231E]">
          <Loader2 className="w-8 h-8 animate-spin text-[#075B43] mb-3" />
          <span className="text-sm font-medium">Connecting to secure checkout...</span>
        </div>
      }
    >
      <PayProxyContent />
    </Suspense>
  );
}
