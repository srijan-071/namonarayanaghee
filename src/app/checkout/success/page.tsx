"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Truck, Phone, ArrowRight, XCircle, RotateCw } from "lucide-react";

function Confetti() {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; duration: number; color: string; size: number }[]>([]);

  useEffect(() => {
    const colors = ["#C38936", "#1E3A24", "#E9DFD1", "#F4C430", "#2E8B57", "#DAA520"];
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

  const isSuccess = status === "success" || (!status && orderId);
  const isFailed = status === "failed" || status === "error";

  const [showConfetti, setShowConfetti] = useState(false);
  const [checkVisible, setCheckVisible] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowConfetti(true);
      const timer = setTimeout(() => setCheckVisible(true), 300);
      const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
      
      // Trigger order confirmation email
      if (orderId) {
        fetch("/api/send-order-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        }).catch(console.error);
      }

      return () => { clearTimeout(timer); clearTimeout(confettiTimer); };
    }
  }, [isSuccess, orderId]);

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
          Your payment could not be processed. Don&apos;t worry — no amount has been deducted. Please try again.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/cart" className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all w-full sm:w-auto flex items-center justify-center gap-2">
            <RotateCw className="w-4 h-4" /> Try Again
          </Link>
          <Link href="/" className="text-[#364935] font-medium hover:text-[#1E3A24] px-4 py-2 flex items-center gap-1 w-full sm:w-auto justify-center">
            Back to Home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#E9E5D9] text-center max-w-3xl mx-auto">
        
        {/* Animated Checkmark */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-700 ${checkVisible ? "bg-[#1E3A24] scale-100 opacity-100" : "bg-[#E9E5D9] scale-50 opacity-0"}`}>
          <CheckCircle2 className={`w-12 h-12 text-white transition-all duration-500 delay-300 ${checkVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
        </div>
        
        <h1 className={`font-serif text-3xl md:text-4xl font-bold text-[#1E3A24] mb-4 transition-all duration-700 delay-500 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          Thank you for your order!
        </h1>
        
        <p className={`text-[#576B55] text-lg mb-8 max-w-lg mx-auto transition-all duration-700 delay-700 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          Your payment was successful and your order is now being processed. We&apos;ll send you a confirmation shortly.
        </p>

        {orderId && (
          <div className={`bg-[#FAF9F5] rounded-xl p-6 mb-10 max-w-md mx-auto border border-[#E9E5D9] transition-all duration-700 delay-900 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
            <p className="text-[#364935] text-sm uppercase tracking-wider font-bold mb-1">Order Reference</p>
            <p className="text-[#1E3A24] font-mono text-xl">{orderId}</p>
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left transition-all duration-700 delay-1000 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <div className="p-5 border border-[#E9E5D9] rounded-xl bg-white">
            <Package className="w-6 h-6 text-[#C38936] mb-3" />
            <h3 className="font-bold text-[#1E3A24] mb-1">Processing</h3>
            <p className="text-sm text-[#576B55]">Your order is being prepared for dispatch.</p>
          </div>
          <div className="p-5 border border-[#E9E5D9] rounded-xl bg-white">
            <Truck className="w-6 h-6 text-[#C38936] mb-3" />
            <h3 className="font-bold text-[#1E3A24] mb-1">Shipping</h3>
            <p className="text-sm text-[#576B55]">Usually dispatched within 24-48 hours.</p>
          </div>
          <div className="p-5 border border-[#E9E5D9] rounded-xl bg-white">
            <Phone className="w-6 h-6 text-[#C38936] mb-3" />
            <h3 className="font-bold text-[#1E3A24] mb-1">Support</h3>
            <p className="text-sm text-[#576B55]">Contact us anytime for updates.</p>
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-1100 ${checkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <Link href="/account" className="bg-[#C38936] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#b0782b] shadow-lg hover:shadow-xl transition-all w-full sm:w-auto flex items-center justify-center gap-2">
            <Package className="w-5 h-5" /> View My Orders
          </Link>
          <Link href="/collections/all-products" className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all w-full sm:w-auto">
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
          <div className="text-center py-20 text-[#576B55]">
            <div className="w-8 h-8 border-4 border-[#E9E5D9] border-t-[#1E3A24] rounded-full animate-spin mx-auto mb-4" />
            Loading your order details...
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </section>
  );
}
