"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Truck, Phone, ArrowRight, XCircle, RotateCw } from "lucide-react";
// Firebase dynamically imported to prevent Cloudflare 1102 errors
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

function Confetti() {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; duration: number; color: string; size: number }[]>([]);

  useEffect(() => {
    const colors = ["#C38936", "#8A1B14", "#F5BD47", "#D4A017", "#5E0B10", "#FFB703"];
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
  const razorpayPaymentId = searchParams.get("razorpay_payment_id");
  const razorpayOrderId = searchParams.get("razorpay_order_id");
  const razorpaySignature = searchParams.get("razorpay_signature");

  const isSuccess = status === "success" || (!status && orderId);
  const isFailed = status === "failed" || status === "error";

  const [showConfetti, setShowConfetti] = useState(false);
  const [checkVisible, setCheckVisible] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    if (orderId && isSuccess) {
      setOrderLoading(true);

      // Proactively trigger verification if razorpay_payment_id is present
      if (razorpayPaymentId) {
        fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_order_id: razorpayOrderId,
            razorpay_signature: razorpaySignature,
          }),
        })
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success) {
            setPaymentVerified(true);
            setOrderLoading(false);
            if (resData.order) setOrderData(resData.order);
          }
        })
        .catch((err) => console.error("Verify payment trigger error:", err));
      }

      let attempts = 0;
      const maxAttempts = 10;
      let intervalId: any;

      const fetchOrder = async () => {
        try {
          const { db } = await import("@/lib/firebase");
          const { doc, getDoc } = await import("firebase/firestore/lite");
          const docSnap = await getDoc(doc(db, "orders", orderId));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setOrderData(data);
            
            if (data.paymentStatus === "paid" || !!razorpayPaymentId) {
              setPaymentVerified(true);
              setOrderLoading(false);
              clearInterval(intervalId);
              
              const eventSentKey = `purchaseEventSent_${orderId}`;
              if (!localStorage.getItem(eventSentKey)) {
                localStorage.setItem(eventSentKey, "true");
                trackEvent("purchase", {
                  transaction_id: orderId,
                  payment_type: data.paymentMethod || "unknown",
                  currency: "INR",
                  value: data.amountToPay || data.totalAmount,
                  tax: data.tax || 0,
                  shipping: data.shippingCost || 0,
                  items: data.items?.map((i: any) => ({
                    item_id: i.productId,
                    item_name: i.name,
                    quantity: i.quantity,
                    price: i.price
                  })) || []
                });
                
                import("@/lib/cart").then((cartLib) => cartLib.clearCart());
              }
            } else {
              attempts++;
              if (attempts >= maxAttempts) {
                 clearInterval(intervalId);
                 setOrderLoading(false);
              }
            }
          } else {
            clearInterval(intervalId);
            setOrderLoading(false);
          }
        } catch (error) {
          console.error(error);
          clearInterval(intervalId);
          setOrderLoading(false);
        }
      };
      
      fetchOrder();
      intervalId = setInterval(fetchOrder, 3000);
      
      return () => clearInterval(intervalId);
    }
  }, [orderId, isSuccess]);

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
          <Link href="/cart" className="bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
            <RotateCw className="w-4 h-4" /> Try Again
          </Link>
          <Link href="/" className="text-[#4A352F] font-medium hover:text-[#8A1B14] px-4 py-2 flex items-center gap-1 w-full sm:w-auto justify-center">
            Back to Home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }


  if (isSuccess && !paymentVerified) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#EAD7BC] text-center max-w-3xl mx-auto">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#FDF6E8]">
          <div className="w-10 h-10 border-4 border-[#EAD7BC] border-t-[#8A1B14] rounded-full animate-spin" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#5E0B10] mb-4">
          {orderLoading ? "Verifying Payment..." : "Payment Pending"}
        </h1>
        <p className="text-[#7A4A3B] text-lg mb-8 max-w-lg mx-auto">
          {orderLoading 
            ? "Please wait while we verify your payment with the gateway. Do not refresh this page." 
            : "Your payment verification is delayed. If the amount was deducted, your order will be confirmed automatically once we receive the webhook."}
        </p>
        {!orderLoading && (
          <Link href="/track-order" className="bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all inline-block">
            Track Order Status
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#EAD7BC] text-center max-w-3xl mx-auto">
        
        {/* Animated Checkmark */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-700 ${checkVisible ? "bg-gradient-to-br from-[#8A1B14] to-[#5E0B10] shadow-lg shadow-[#8A1B14]/25 scale-100 opacity-100" : "bg-[#FDF6E8] scale-50 opacity-0"}`}>
          <CheckCircle2 className={`w-12 h-12 text-[#F5BD47] transition-all duration-500 delay-300 ${checkVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
        </div>
        
        <h1 className={`font-serif text-3xl md:text-4xl font-bold text-[#5E0B10] mb-4 transition-all duration-700 delay-500 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          Thank you for your order!
        </h1>
        
        <p className={`text-[#7A4A3B] text-lg mb-8 max-w-lg mx-auto transition-all duration-700 delay-700 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          Your payment was successful and your order is now being processed. We&apos;ll send you a confirmation shortly.
        </p>

        {orderId && (
          <div className={`bg-[#FCFAF5] rounded-xl p-6 mb-10 text-left border border-[#EAD7BC] transition-all duration-700 delay-900 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
            <div className="flex justify-between items-center border-b border-[#EAD7BC] pb-4 mb-4">
              <div>
                <p className="text-[#4A352F] text-xs uppercase tracking-wider font-bold mb-1">Order Reference</p>
                <p className="text-[#5E0B10] font-mono text-lg font-semibold">#{orderId}</p>
              </div>
              {orderData && (
                <div className="text-right">
                  <p className="text-[#4A352F] text-xs uppercase tracking-wider font-bold mb-1">Total Paid</p>
                  <p className="text-[#8A1B14] font-bold text-lg">{formatPrice(orderData.amountToPay || orderData.totalAmount)}</p>
                </div>
              )}
            </div>

            {orderLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-[#EAD7BC] border-t-[#8A1B14] rounded-full animate-spin" />
              </div>
            ) : orderData ? (
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                  {orderData.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center bg-white p-3 rounded-lg border border-[#EAD7BC]">
                      <div className="w-16 h-16 bg-[#FDF6E8] rounded-lg overflow-hidden flex-shrink-0 relative">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-[#7A4A3B] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.isGift && (
                            <span className="bg-[#8A1B14] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              FREE GIFT
                            </span>
                          )}
                          <h4 className="font-bold text-[#2A1612] text-sm line-clamp-1">{item.name}</h4>
                        </div>
                        <p className="text-[#7A4A3B] text-xs mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-semibold text-sm text-[#4A352F]">
                        {item.isGift || item.price === 0 ? (
                          <span className="text-[#D4A017] font-bold">FREE</span>
                        ) : (
                          formatPrice(item.price * item.quantity)
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 pb-2 space-y-2 text-sm text-[#4A352F]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(orderData.subtotal)}</span>
                  </div>
                  {orderData.discount > 0 && (
                    <div className="flex justify-between text-[#8A1B14] font-semibold">
                      <span>Discount ({orderData.discountPercent}%)</span>
                      <span className="font-bold">-{formatPrice(orderData.discount)}</span>
                    </div>
                  )}
                  {orderData.amountRemaining > 0 && (
                    <div className="flex justify-between text-[#D4A017]">
                      <span>Remaining Balance</span>
                      <span className="font-semibold">{formatPrice(orderData.amountRemaining)}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#EAD7BC]">
                  <h4 className="text-sm font-bold text-[#5E0B10] mb-2">Shipping Details</h4>
                  <p className="text-sm text-[#7A4A3B]">
                    {orderData.shippingAddress?.name}<br/>
                    {orderData.shippingAddress?.address}, {orderData.shippingAddress?.city}<br/>
                    {orderData.shippingAddress?.state}, {orderData.shippingAddress?.pincode}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#7A4A3B] text-center">Your order details will appear in your account.</p>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left transition-all duration-700 delay-1000 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <div className="p-5 border border-[#EAD7BC] rounded-xl bg-white">
            <Package className="w-6 h-6 text-[#D4A017] mb-3" />
            <h3 className="font-bold text-[#5E0B10] mb-1">Processing</h3>
            <p className="text-sm text-[#7A4A3B]">Your order is being prepared for dispatch.</p>
          </div>
          <div className="p-5 border border-[#EAD7BC] rounded-xl bg-white">
            <Truck className="w-6 h-6 text-[#D4A017] mb-3" />
            <h3 className="font-bold text-[#5E0B10] mb-1">Shipping</h3>
            <p className="text-sm text-[#7A4A3B]">Usually dispatched within 24-48 hours.</p>
          </div>
          <div className="p-5 border border-[#EAD7BC] rounded-xl bg-white">
            <Phone className="w-6 h-6 text-[#D4A017] mb-3" />
            <h3 className="font-bold text-[#5E0B10] mb-1">Support</h3>
            <p className="text-sm text-[#7A4A3B]">Contact us anytime for updates.</p>
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-1100 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <Link href="/account" className="bg-[#D4A017] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#b58710] shadow-lg hover:shadow-xl transition-all w-full sm:w-auto flex items-center justify-center gap-2">
            <Package className="w-5 h-5" /> View My Orders
          </Link>
          <Link href="/collections/all-products" className="bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all w-full sm:w-auto">
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <section className="nn-section bg-[#FCFAF5] min-h-[80vh] flex items-center py-12 md:py-20">
      <div className="nn-container w-full">
        <Suspense fallback={
          <div className="text-center py-20 text-[#7A4A3B]">
            <div className="w-8 h-8 border-4 border-[#EAD7BC] border-t-[#8A1B14] rounded-full animate-spin mx-auto mb-4" />
            Loading your order details...
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </section>
  );
}
