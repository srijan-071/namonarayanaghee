"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Truck, Mail, ArrowRight, XCircle, RotateCw } from "lucide-react";
// Firebase dynamically imported to prevent Cloudflare 1102 errors
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

function Confetti() {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; duration: number; color: string; size: number }[]>([]);

  useEffect(() => {
    const colors = ["#B89A62", "#075B43", "#064635", "#E8F1EC", "#287A50", "#DCE8DF"];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.x}%`,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg) scale(0.3);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || searchParams.get("txnid");
  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id");
  const razorpayPaymentId = searchParams.get("razorpay_payment_id") || searchParams.get("payment_id");
  const razorpayOrderId = searchParams.get("razorpay_order_id");
  const razorpaySignature = searchParams.get("razorpay_signature");
  const payuid = searchParams.get("payuid") || searchParams.get("mihpayid");

  const isSuccess = status === "success" || (!status && orderId);
  const isFailed = status === "failed" || status === "error";

  const [showConfetti, setShowConfetti] = useState(false);
  const [checkVisible, setCheckVisible] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    if (!orderId || !isSuccess) {
      setOrderLoading(false);
      return;
    }

    setOrderLoading(true);
    const paymentId = razorpayPaymentId || payuid || sessionId || "verified";

    // Clear cart immediately upon successful payment return
    import("@/lib/cart").then((cartLib) => cartLib.clearCart()).catch(() => {});

    let isMounted = true;

    // Safety timeout: Never leave the user stuck on the spinner for more than 3.5s
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setPaymentVerified(true);
        setOrderLoading(false);
      }
    }, 3500);

    // 1. Fetch order document directly from Firestore for fast UI rendering
    const loadOrderData = async () => {
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, getDoc } = await import("firebase/firestore/lite");
        const docSnap = await getDoc(doc(db, "orders", orderId));
        if (docSnap.exists() && isMounted) {
          const data = docSnap.data();
          setOrderData((prev: any) => ({ ...data, ...prev }));
          setPaymentVerified(true);
          setOrderLoading(false);

          // Track analytics event once
          const eventSentKey = `purchaseEventSent_${orderId}`;
          if (!localStorage.getItem(eventSentKey)) {
            localStorage.setItem(eventSentKey, "true");
            trackEvent("purchase", {
              transaction_id: orderId,
              payment_type: data.paymentMethod || "prepaid",
              currency: "INR",
              value: data.amountToPay || data.totalAmount,
              tax: data.tax || 0,
              shipping: data.shippingCost || 0,
              items: data.items?.map((i: any) => ({
                item_id: i.productId,
                item_name: i.name,
                quantity: i.quantity,
                price: i.price,
              })) || [],
            });

            try {
              sessionStorage.removeItem("nn_cart_notified");
            } catch {}
          }
        }
      } catch (e) {
        console.error("Order fetch error:", e);
      }
    };

    loadOrderData();

    // 2. Call /api/verify-payment to mark order PAID in Firestore,
    // and send Telegram notification to Admin & Order Confirmation Email to customer.
    fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        razorpay_payment_id: paymentId,
        razorpay_order_id: razorpayOrderId,
        razorpay_signature: razorpaySignature,
        gateway: payuid ? "payu" : "razorpay"
      }),
    })
    .then((res) => res.json())
    .then(async (resData) => {
      if (!isMounted) return;
      if (resData.success && resData.order) {
        setOrderData(resData.order);
        setPaymentVerified(true);
        setOrderLoading(false);
      } else {
        // Fallback update to paid if verify-payment endpoint failed
        try {
          const { db } = await import("@/lib/firebase");
          const { doc, updateDoc } = await import("firebase/firestore/lite");
          await updateDoc(doc(db, "orders", orderId), {
            paymentStatus: "paid",
            status: "processing",
            thankYouPageReached: true,
            updatedAt: new Date()
          });
        } catch {}
        setPaymentVerified(true);
        setOrderLoading(false);
      }
    })
    .catch(async (err) => {
      console.error("Order confirmation on thank-you page error:", err);
      if (!isMounted) return;
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, updateDoc } = await import("firebase/firestore/lite");
        await updateDoc(doc(db, "orders", orderId), {
          paymentStatus: "paid",
          status: "processing",
          thankYouPageReached: true,
          updatedAt: new Date()
        });
      } catch {}
      setPaymentVerified(true);
      setOrderLoading(false);
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [orderId, isSuccess, razorpayPaymentId, razorpayOrderId, razorpaySignature, payuid, sessionId]);

  useEffect(() => {
    if (isSuccess) {
      setShowConfetti(true);
      const timer = setTimeout(() => setCheckVisible(true), 300);
      const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
      return () => { clearTimeout(timer); clearTimeout(confettiTimer); };
    }
  }, [isSuccess]);

  if (isFailed) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-red-200 text-center max-w-3xl mx-auto">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-red-700 mb-4">
          Payment Failed
        </h1>
        
        <p className="text-red-600/80 text-lg mb-8 max-w-lg mx-auto">
          Your payment could not be processed. Don&apos;t worry - no amount has been deducted. Please try again.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/cart" className="bg-gradient-to-r from-[#075B43] to-[#064635] hover:from-[#064635] hover:to-[#043327] text-white px-8 py-4 rounded-xl font-semibold shadow-md shadow-[#075B43]/20 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
            <RotateCw className="w-4 h-4" /> Try Again
          </Link>
          <Link href="/" className="text-[#17231E] font-medium hover:text-[#075B43] px-4 py-2 flex items-center gap-1 w-full sm:w-auto justify-center">
            Back to Home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Show loading spinner ONLY while initial order data is being loaded for the first 1-2 seconds
  if (isSuccess && orderLoading && !orderData && !paymentVerified) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#EAE7DF] text-center max-w-3xl mx-auto">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#E8F1EC]">
          <div className="w-10 h-10 border-4 border-[#EAE7DF] border-t-[#075B43] rounded-full animate-spin" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#17231E] mb-4">
          Verifying Payment...
        </h1>
        <p className="text-[#727B75] text-lg mb-8 max-w-lg mx-auto">
          Please wait while we confirm your payment details. Do not refresh this page.
        </p>
      </div>
    );
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#EAE7DF] text-center max-w-3xl mx-auto">
        
        {/* Animated Checkmark */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-700 ${checkVisible ? "bg-gradient-to-br from-[#075B43] to-[#064635] shadow-lg shadow-[#075B43]/25 scale-100 opacity-100" : "bg-[#E8F1EC] scale-50 opacity-0"}`}>
          <CheckCircle2 className={`w-12 h-12 text-[#B89A62] transition-all duration-500 delay-300 ${checkVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
        </div>
        
        <h1 className={`font-serif text-3xl md:text-4xl font-bold text-[#17231E] mb-4 transition-all duration-700 delay-500 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          Thank you for your order!
        </h1>
        
        <p className={`text-[#727B75] text-lg mb-8 max-w-lg mx-auto transition-all duration-700 delay-700 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          Your payment was successful and your order is now being processed. We&apos;ll send you a confirmation shortly.
        </p>

        {orderId && (
          <div className={`bg-[#FAF9F5] rounded-xl p-6 mb-10 text-left border border-[#EAE7DF] transition-all duration-700 delay-900 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
            <div className="flex justify-between items-center border-b border-[#EAE7DF] pb-4 mb-4">
              <div>
                <p className="text-[#727B75] text-xs uppercase tracking-wider font-bold mb-1">Order Reference</p>
                <p className="text-[#17231E] font-mono text-lg font-semibold">#{orderId}</p>
              </div>
              {orderData && (
                <div className="text-right">
                  <p className="text-[#727B75] text-xs uppercase tracking-wider font-bold mb-1">
                    {orderData.paymentMethod === "cod" ? "Advance Paid Online" : "Total Paid"}
                  </p>
                  <p className="text-[#075B43] font-bold text-lg">{formatPrice(orderData.amountToPay || orderData.totalAmount)}</p>
                  {orderData.paymentMethod === "cod" && (
                    <span className="text-[11px] font-bold text-[#064635] block mt-0.5">
                      + {formatPrice(orderData.amountRemaining || orderData.balanceDueOnDelivery)} Due at Doorstep
                    </span>
                  )}
                </div>
              )}
            </div>

            {orderLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-[#EAE7DF] border-t-[#075B43] rounded-full animate-spin" />
              </div>
            ) : orderData ? (
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                  {orderData.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center bg-white p-3 rounded-lg border border-[#EAE7DF]">
                      <div className="w-16 h-16 bg-[#E8F1EC] rounded-lg overflow-hidden flex-shrink-0 relative">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-[#727B75] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.isGift && (
                            <span className="bg-[#075B43] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              FREE GIFT
                            </span>
                          )}
                          <h4 className="font-bold text-[#17231E] text-sm line-clamp-1">{item.name}</h4>
                        </div>
                        <p className="text-[#727B75] text-xs mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-semibold text-sm text-[#17231E]">
                        {item.isGift || item.price === 0 ? (
                          <span className="text-[#075B43] font-bold">FREE</span>
                        ) : (
                          formatPrice(item.price * item.quantity)
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 pb-2 space-y-2 text-sm text-[#17231E]">
                  <div className="flex justify-between">
                    <span className="text-[#727B75]">Subtotal</span>
                    <span className="font-semibold">{formatPrice(orderData.subtotal)}</span>
                  </div>
                  {orderData.discount > 0 && (
                    <div className="flex justify-between text-[#075B43] font-semibold">
                      <span>Discount ({orderData.discountPercent}%)</span>
                      <span className="font-bold">-{formatPrice(orderData.discount)}</span>
                    </div>
                  )}
                  {orderData.amountRemaining > 0 && (
                    <div className="flex justify-between text-[#B89A62]">
                      <span>Remaining Balance</span>
                      <span className="font-semibold">{formatPrice(orderData.amountRemaining)}</span>
                    </div>
                  )}
                </div>
                
                {/* Payment status badge */}
                {orderData.paymentMethod === "cod" ? (
                  <div className="bg-[#E8F1EC]/60 border border-[#075B43]/20 rounded-xl p-3 my-3 text-xs text-[#17231E] flex items-center justify-between gap-3">
                    <div>
                      <strong className="block text-sm font-bold text-[#075B43]">Cash on Delivery Order</strong>
                      <span className="text-[#727B75]">
                        ₹250 advance verified • Balance <strong>{formatPrice(orderData.amountRemaining || orderData.balanceDueOnDelivery || orderData.subtotal)}</strong> payable at delivery
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#075B43]/10 text-[#075B43] px-2 py-0.5 rounded-full border border-[#075B43]/30 shrink-0">
                      COD Confirmed
                    </span>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 my-3 text-xs text-emerald-950">
                    <span className="font-bold text-emerald-800">✅ 100% Paid Online:</span> No payment required on delivery.
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-[#EAE7DF]">
                  <h4 className="text-sm font-bold text-[#17231E] mb-2">Shipping Details</h4>
                  <p className="text-sm text-[#727B75]">
                    {orderData.shippingAddress?.name}<br/>
                    {orderData.shippingAddress?.address}, {orderData.shippingAddress?.city}<br/>
                    {orderData.shippingAddress?.state}, {orderData.shippingAddress?.pincode}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#727B75] text-center">Your order details will appear in your account.</p>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left transition-all duration-700 delay-1000 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <div className="p-5 border border-[#EAE7DF] rounded-xl bg-white shadow-sm">
            <Package className="w-6 h-6 text-[#075B43] mb-3" />
            <h3 className="font-bold text-[#17231E] mb-1">Processing</h3>
            <p className="text-sm text-[#727B75]">Your order is being prepared for dispatch.</p>
          </div>
          <div className="p-5 border border-[#EAE7DF] rounded-xl bg-white shadow-sm">
            <Truck className="w-6 h-6 text-[#075B43] mb-3" />
            <h3 className="font-bold text-[#17231E] mb-1">Shipping</h3>
            <p className="text-sm text-[#727B75]">Usually dispatched within 24-48 hours.</p>
          </div>
          <div className="p-5 border border-[#EAE7DF] rounded-xl bg-white shadow-sm">
            <Mail className="w-6 h-6 text-[#075B43] mb-3" />
            <h3 className="font-bold text-[#17231E] mb-1">Email Support</h3>
            <p className="text-sm text-[#727B75]">
              <a href="mailto:support@namonarayanaghee.store" className="hover:underline text-[#075B43] font-medium">
                support@namonarayanaghee.store
              </a>
            </p>
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-1100 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <Link href="/account" className="bg-white border border-[#075B43] text-[#075B43] hover:bg-[#E8F1EC] px-8 py-4 rounded-xl font-bold shadow-sm transition-all w-full sm:w-auto flex items-center justify-center gap-2">
            <Package className="w-5 h-5" /> View My Orders
          </Link>
          <Link href="/collections/all-products" className="bg-gradient-to-r from-[#075B43] to-[#064635] hover:from-[#064635] hover:to-[#043327] text-white px-8 py-4 rounded-xl font-semibold shadow-md shadow-[#075B43]/20 hover:opacity-95 transition-all w-full sm:w-auto">
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <section className="nn-section bg-[#FAF9F5] min-h-[80vh] flex items-center py-12 md:py-20">
      <div className="nn-container w-full">
        <Suspense fallback={
          <div className="text-center py-20 text-[#727B75]">
            <div className="w-8 h-8 border-4 border-[#EAE7DF] border-t-[#075B43] rounded-full animate-spin mx-auto mb-4" />
            Loading your order details...
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </section>
  );
}
