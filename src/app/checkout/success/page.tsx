"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight, Package, Truck, Phone } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#E9E5D9] text-center max-w-3xl mx-auto">
      <div className="w-20 h-20 bg-[#F4F6F0] rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-[#1E3A24]" />
      </div>
      
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1E3A24] mb-4">
        Thank you for your order!
      </h1>
      
      <p className="text-[#576B55] text-lg mb-8 max-w-lg mx-auto">
        Your order has been placed successfully and is now being processed. We will send you a confirmation email shortly.
      </p>

      {orderId && (
        <div className="bg-[#FAF9F5] rounded-xl p-6 mb-10 max-w-md mx-auto border border-[#E9E5D9]">
          <p className="text-[#364935] text-sm uppercase tracking-wider font-bold mb-1">Order Reference</p>
          <p className="text-[#1E3A24] font-mono text-xl">{orderId}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
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

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/collections/all-products" className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all w-full sm:w-auto">
          Continue Shopping
        </Link>
        <Link href="/" className="text-[#364935] font-medium hover:text-[#1E3A24] px-4 py-2 flex items-center gap-1 w-full sm:w-auto justify-center">
          Back to Home <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
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
