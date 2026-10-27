"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// Firebase dynamically imported to prevent Cloudflare 1102 errors
import { getDynamicOrderStatus } from "@/lib/orderUtils";
import { formatPrice } from "@/lib/utils";
import { Search, Package, MapPin, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  // Auto-populate from URL if present (e.g. from email links)
  useEffect(() => {
    const paramOrderId = searchParams.get("orderId") || searchParams.get("id");
    const paramEmail = searchParams.get("email") || searchParams.get("phone");
    if (paramOrderId) setOrderId(paramOrderId);
    if (paramEmail) setEmail(paramEmail);
  }, [searchParams]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const { db } = await import("@/lib/firebase");
      const { doc, getDoc, collection, query, where, getDocs, limit } = await import("firebase/firestore/lite");

      // Robust order ID normalization: allows searching with or without '#' and handles extra spaces
      const rawTrimmed = orderId.trim();
      const strippedId = rawTrimmed.replace(/^[#\s]+/, "").replace(/[#\s]+$/, "").trim();
      const cleanInput = email.trim().toLowerCase();
      const cleanDigits = cleanInput.replace(/\D/g, "");

      // Deduplicated candidate IDs to try (without hashtag, with hashtag, and exact raw string)
      const candidates = Array.from(
        new Set([
          strippedId,
          `#${strippedId}`,
          rawTrimmed,
          strippedId.toLowerCase(),
          strippedId.toUpperCase(),
        ])
      ).filter(Boolean);

      let foundSnap: any = null;

      // 1. First attempt: Direct document lookups for all candidate variants
      for (const cand of candidates) {
        const orderRef = doc(db, "orders", cand);
        const snap = await getDoc(orderRef);
        if (snap.exists()) {
          foundSnap = snap;
          break;
        }
      }

      // 2. Second attempt: Search by the 'orderId' field within the orders collection
      if (!foundSnap) {
        for (const cand of candidates) {
          const q = query(
            collection(db, "orders"),
            where("orderId", "==", cand),
            limit(1)
          );
          const querySnap = await getDocs(q);
          if (!querySnap.empty) {
            foundSnap = querySnap.docs[0];
            break;
          }
        }
      }

      if (foundSnap) {
        const data = foundSnap.data();

        // Comprehensive email verification across all possible fields
        const orderEmail = (
          data.contactInfo?.email ||
          data.email ||
          data.customerEmail ||
          data.billingAddress?.email ||
          data.shippingAddress?.email
        )?.trim().toLowerCase();

        // Phone number fallback verification
        const orderPhone = (
          data.contactInfo?.phone ||
          data.phone ||
          data.customerPhone ||
          data.shippingAddress?.phone ||
          data.billingAddress?.phone
        )?.replace(/\D/g, "");

        const isEmailMatch = Boolean(orderEmail && orderEmail === cleanInput);
        const isPhoneMatch = Boolean(
          cleanDigits.length >= 10 &&
          orderPhone &&
          orderPhone.endsWith(cleanDigits.slice(-10))
        );

        if (isEmailMatch || isPhoneMatch) {
          setOrder({ id: foundSnap.id, ...data });
          toast.success("Order found!");
        } else {
          setError(
            "We found an order matching that ID, but the email or phone number does not match our records. Please verify the contact info entered."
          );
          toast.error("Contact details do not match");
        }
      } else {
        setError(
          "We couldn't find an order with that ID. Please check the Order ID (you can enter it with or without '#') and try again."
        );
        toast.error("Order not found");
      }
    } catch (err: any) {
      console.error("Tracking error:", err);
      setError("An error occurred while tracking your order. Please try again.");
      toast.error("Error tracking order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-32 pb-24">
      <div className="nn-container max-w-3xl">
        <div className="text-center mb-12">
          <span className="nn-eyebrow mb-4 inline-block">Track Order</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#5E0B10] mb-4">
            Where is my Ghee?
          </h1>
          <p className="text-[#4A352F] text-lg">
            Enter your Order ID (with or without &apos;#&apos;) and Email or Phone to track the real-time status of your package.
          </p>
        </div>

        {!order ? (
          <div className="bg-white rounded-2xl shadow-xl border border-[#EAD7BC] p-8 md:p-12">
            <form onSubmit={handleTrack} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl flex gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-[#4A352F] mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-[#FCFAF5] border border-[#EAD7BC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] focus:border-transparent transition-all font-mono text-[#2A1612]"
                  placeholder="e.g. #7e9b04... or 7e9b04..."
                  required
                />
                <p className="text-xs text-[#8C988B] mt-1.5 flex items-center gap-1.5">
                  <span className="text-[#C99A3D] font-bold">✓</span>
                  <span>Search works with or without the &apos;#&apos; hashtag (e.g. #5xVp9q or 5xVp9q)</span>
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4A352F] mb-2">
                  Email Address or Phone Number
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FCFAF5] border border-[#EAD7BC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] focus:border-transparent transition-all"
                  placeholder="Email or phone used during checkout"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full nn-btn nn-btn-primary py-4 text-base shadow-lg flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Track Order
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setOrder(null)}
                className="text-[#C99A3D] font-semibold hover:text-[#A87845] text-sm"
              >
                &larr; Track another order
              </button>
            </div>

            <div className="bg-white border border-[#EAD7BC] rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] p-8 text-white text-center">
                <p className="text-sm text-[#EAD7BC] mb-2 uppercase tracking-widest font-semibold">Current Status</p>
                <h2 className="text-2xl md:text-3xl font-serif text-[#F5BD47]">
                  {getDynamicOrderStatus(order.createdAt, order.status, order.paymentStatus, order.paymentMethod)}
                </h2>
              </div>

              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 justify-between border-b border-[#EAD7BC] pb-8 mb-8">
                  <div>
                    <p className="text-xs text-[#8C988B] uppercase tracking-wider mb-1">Order ID</p>
                    <p className="font-bold text-[#2A1612] font-mono">#{String(order.id || "").replace(/^#/, "")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8C988B] uppercase tracking-wider mb-1">Order Date</p>
                    <p className="font-bold text-[#2A1612]">
                      {order.createdAt?.seconds
                        ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                        : order.createdAt instanceof Date
                        ? order.createdAt.toLocaleDateString()
                        : "Recent"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8C988B] uppercase tracking-wider mb-1">Total Paid</p>
                    <p className="font-bold text-[#2A1612]">{formatPrice(order.amountToPay || order.totalAmount)}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-serif text-[#5E0B10] text-xl">Items Ordered</h3>
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-20 h-20 bg-[#FDF6E8] rounded-lg overflow-hidden flex-shrink-0 relative border border-[#EAD7BC]">
                        {item.image ? (
                          <img src={item.image} alt={item.name || item.title} className="w-full h-full object-cover" />
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
                          <h4 className="font-bold text-[#2A1612]">{item.name || item.title}</h4>
                        </div>
                        <p className="text-[#7A4A3B] text-sm mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-[#4A352F]">
                        {item.isGift || item.price === 0 ? (
                          <span className="text-[#D4A017] font-bold">FREE</span>
                        ) : (
                          formatPrice(item.price * item.quantity)
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 mt-4 border-t border-[#EAD7BC] space-y-3 text-[#4A352F]">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold text-[#2A1612]">{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between items-center text-sm text-[#8A1B14] font-semibold">
                      <span className="font-semibold">Discount ({order.discountPercent}%)</span>
                      <span className="font-bold">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  {order.amountRemaining > 0 && (
                    <div className="flex justify-between items-center text-sm text-[#D4A017]">
                      <span className="font-semibold">Remaining Balance</span>
                      <span className="font-bold">{formatPrice(order.amountRemaining)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-[#EAD7BC]">
                    <span className="font-bold text-[#2A1612]">Total Paid</span>
                    <span className="font-bold text-[#8A1B14]">{formatPrice(order.amountToPay || order.totalAmount)}</span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[#EAD7BC]">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#FCFAF5] p-3 rounded-xl text-[#8A1B14]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2A1612] mb-1">Shipping To</h4>
                      <p className="text-[#4A352F] text-sm leading-relaxed">
                        {order.shippingAddress?.name}<br />
                        {order.shippingAddress?.address}<br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#8C988B]">
                Have a question about this order?{" "}
                <Link href="/pages/contact" className="text-[#C99A3D] hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAF8F5] min-h-screen pt-32 pb-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#C99A3D]" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
