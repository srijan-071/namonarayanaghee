"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getDynamicOrderStatus } from "@/lib/orderUtils";
import { formatPrice } from "@/lib/utils";
import {
  Search,
  Package,
  MapPin,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  X,
  CreditCard,
  Gift,
  Flame,
  Truck,
  Calendar,
  MessageCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// ─── 5-Stage Farm-to-Kitchen Sacred Vedic Journey ───
const VEDIC_JOURNEY_STAGES = [
  {
    stage: 1,
    title: "Bilona Churning at Vedic Gaushala",
    subtitle: "A2 Gir Cow whole curd churned bi-directionally in clay pots with wooden bilona",
    badge: "Traditional Bilona",
    icon: Sparkles,
  },
  {
    stage: 2,
    title: "Slow Heating on Wood Fire & Quality Seal",
    subtitle: "Makhan simmered gently on low flame; NABL purity & aroma certified",
    badge: "Slow-Cooked Makhan",
    icon: Flame,
  },
  {
    stage: 3,
    title: "Hand-Packed with Cushioning",
    subtitle: "Poured in amber glass jar with protective thermal cushioning & free gifts added",
    badge: "Glass Jar Hand-Packed",
    icon: Package,
  },
  {
    stage: 4,
    title: "Dispatched via Express Courier",
    subtitle: "Consignment handed over for priority surface/air transit with live tracking",
    badge: "Express Transit",
    icon: Truck,
  },
  {
    stage: 5,
    title: "Out for Doorstep Delivery",
    subtitle: "Arrived at local city hub; scheduled for sacred kitchen handover today",
    badge: "Doorstep Delivery",
    icon: MapPin,
  },
];

function getJourneyStageIndex(order: any): number {
  if (!order) return 0;
  const status = (order.status || "").toLowerCase();
  const shippingStatus = (order.shippingStatus || "").toLowerCase();

  if (status === "delivered") return 5;
  if (status === "out_for_delivery") return 4;
  if (status === "shipped" || shippingStatus === "shipped") return 3;
  if (status === "processing" || shippingStatus === "processing") return 2;
  if (status === "paid" || order.paymentStatus === "paid") return 1;
  return 0; // Confirmation / order placed
}

function calculateEDD(order: any) {
  if (!order) {
    return {
      title: "Estimated Delivery: 2 – 4 Days",
      subtitle: "Standard Express Transit • Direct from Vedic Gaushala",
      isDelivered: false,
      isFailed: false,
      badgeText: "Express Transit",
      badgeColor: "bg-[#F5ECE0] text-[#5E0B10] border-[#EAD7BC]",
    };
  }

  const status = (order.status || "").toLowerCase();
  if (status === "delivered") {
    let dStr = "Delivered";
    if (order.deliveredAt) {
      dStr = new Date(order.deliveredAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return {
      title: "Delivered Successfully",
      subtitle: `Your parcel was successfully delivered (${dStr})`,
      isDelivered: true,
      isFailed: false,
      badgeText: "Delivered ✓",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    };
  }

  if (status === "delivery_failed") {
    return {
      title: "Delivery Exception & Refund Scheduled",
      subtitle: "Consignment returning due to courier issue • 100% full refund in 14 banking days",
      isDelivered: false,
      isFailed: true,
      badgeText: "Logistics Exception",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    };
  }

  if (status === "out_for_delivery") {
    return {
      title: "Arriving Today at Your Doorstep",
      subtitle: "Package is on the delivery vehicle and will be handed over by 8:00 PM today",
      isDelivered: false,
      isFailed: false,
      badgeText: "Arriving Today 🚚",
      badgeColor: "bg-orange-100 text-orange-800 border-orange-300",
    };
  }

  // Calculate dynamic EDD based on Pincode and Order Date
  let baseDate = new Date();
  if (order.createdAt?.seconds) {
    baseDate = new Date(order.createdAt.seconds * 1000);
  } else if (order.createdAt instanceof Date) {
    baseDate = order.createdAt;
  } else if (order.createdAt) {
    baseDate = new Date(order.createdAt);
  }

  const pincode = String(order.shippingAddress?.pincode || "").replace(/\D/g, "");
  const city = (order.shippingAddress?.city || "").toLowerCase();
  const state = (order.shippingAddress?.state || "").toLowerCase();

  const isDelhiNcr =
    /^(110|121|122|201)/.test(pincode) ||
    city.includes("delhi") ||
    city.includes("gurgaon") ||
    city.includes("noida") ||
    city.includes("faridabad");

  const isNorthTier1 =
    /^(14|13|16)/.test(pincode) ||
    state.includes("punjab") ||
    state.includes("haryana") ||
    city.includes("chandigarh");

  const isMetro =
    /^(400|411|560|500|600|380|700)/.test(pincode) ||
    city.includes("mumbai") ||
    city.includes("bangalore") ||
    city.includes("bengaluru") ||
    city.includes("pune") ||
    city.includes("hyderabad") ||
    city.includes("chennai") ||
    city.includes("ahmedabad") ||
    city.includes("kolkata");

  let minDays = 4;
  let maxDays = 5;
  let zoneLabel = "Rest of India (Express)";

  if (isDelhiNcr) {
    minDays = 1;
    maxDays = 2;
    zoneLabel = "Delhi-NCR Priority Route";
  } else if (isNorthTier1) {
    minDays = 2;
    maxDays = 3;
    zoneLabel = "North India Express";
  } else if (isMetro) {
    minDays = 2;
    maxDays = 3;
    zoneLabel = "Tier-1 Metro Express";
  }

  function addBusinessDays(date: Date, days: number): Date {
    const d = new Date(date);
    let count = 0;
    while (count < days) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) count++; // skip Sunday
    }
    return d;
  }

  const now = new Date();
  let minDate = addBusinessDays(baseDate, minDays);
  let maxDate = addBusinessDays(baseDate, maxDays);

  if (minDate < now) {
    minDate = addBusinessDays(now, 1);
  }
  if (maxDate < minDate) {
    maxDate = addBusinessDays(minDate, 1);
  }

  const minFormatted = minDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const maxFormatted = maxDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return {
    title: `Estimated Delivery: ${minFormatted} – ${maxFormatted}`,
    subtitle: `${zoneLabel} • Shipped fresh directly from our Vedic Gaushala`,
    isDelivered: false,
    isFailed: false,
    badgeText: zoneLabel,
    badgeColor: "bg-[#F5ECE0] text-[#5E0B10] border-[#EAD7BC]",
  };
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  // Payment iframe modal state for COD-to-Prepaid conversion
  const [isIframeOpen, setIsIframeOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);

  // Reusable order lookup logic
  const performLookup = useCallback(async (targetOrderId: string, targetContact: string) => {
    if (!targetOrderId || !targetContact) return;

    setLoading(true);
    setError("");

    try {
      const { db } = await import("@/lib/firebase");
      const { doc, getDoc, collection, query, where, getDocs, limit } = await import("firebase/firestore/lite");

      const rawTrimmed = targetOrderId.trim();
      const strippedId = rawTrimmed.replace(/^[#\s]+/, "").replace(/[#\s]+$/, "").trim();
      const cleanInput = targetContact.trim().toLowerCase();
      const cleanDigits = cleanInput.replace(/\D/g, "");

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

      // 1. Direct document lookups
      for (const cand of candidates) {
        const orderRef = doc(db, "orders", cand);
        const snap = await getDoc(orderRef);
        if (snap.exists()) {
          foundSnap = snap;
          break;
        }
      }

      // 2. Query by 'orderId' field
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

        const orderEmail = (
          data.contactInfo?.email ||
          data.email ||
          data.customerEmail ||
          data.billingAddress?.email ||
          data.shippingAddress?.email
        )?.trim().toLowerCase();

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
  }, []);

  // Auto-populate & auto-lookup from URL if present
  useEffect(() => {
    const paramOrderId = searchParams.get("orderId") || searchParams.get("id");
    const paramEmail = searchParams.get("email") || searchParams.get("phone");
    const upgraded = searchParams.get("upgradedPrepaid") === "true";

    if (paramOrderId) setOrderId(paramOrderId);
    if (paramEmail) setEmail(paramEmail);

    if (upgraded) {
      toast.success("🎉 Payment verified! Your order is now 100% prepaid. No cash needed on delivery!");
    }

    if (paramOrderId && paramEmail && !order) {
      performLookup(paramOrderId, paramEmail);
    }
  }, [searchParams, performLookup, order]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(orderId, email);
  };

  // ─── COD to Prepaid Savings & Discount Calculation ───
  const remainingPaise = (() => {
    if (!order) return 0;
    let raw = Number(order.balanceDueOnDelivery ?? order.amountRemaining ?? 0);
    if (!raw || raw <= 0) {
      const total = Number(order.totalAmount || order.subtotal || 0);
      const advance = Number(order.advancePaid || order.advancePaidAmount || 0);
      raw = Math.max(0, total - advance);
    }
    // If stored in rupees (< 10000 and total >= 10000), convert to paise
    if (raw > 0 && raw < 10000 && Number(order.totalAmount || 0) >= 10000) {
      raw = raw * 100;
    }
    return raw;
  })();

  const isCodActive = Boolean(
    order &&
    order.paymentMethod === "cod" &&
    order.paymentStatus !== "paid" &&
    !order.codConvertedToPrepaid &&
    !["cancelled", "delivered"].includes(order.status?.toLowerCase()) &&
    remainingPaise > 0
  );

  // 1. ₹250 COD handling fee waiver (25,000 paise)
  const codFeeWaiverPaise = Math.min(25000, Math.max(0, remainingPaise > 25000 ? 25000 : Math.round(remainingPaise * 0.4)));

  // 2. Remaining balance after ₹250 waiver
  const afterWaiverPaise = Math.max(100, remainingPaise - codFeeWaiverPaise);

  // 3. Extra 10% instant prepay discount
  const tenPercentDiscountPaise = Math.round(afterWaiverPaise * 0.10);

  // 4. Total customer savings
  const totalSavingsPaise = codFeeWaiverPaise + tenPercentDiscountPaise;

  // 5. Final discounted amount customer pays online
  const finalPrepayAmountPaise = Math.max(100, remainingPaise - totalSavingsPaise);
  const finalPrepayAmountRupees = Math.round(finalPrepayAmountPaise / 100);
  const totalSavingsRupees = Math.round(totalSavingsPaise / 100);
  const remainingRupees = Math.round(remainingPaise / 100);
  const codFeeWaiverRupees = Math.round(codFeeWaiverPaise / 100);
  const tenPercentDiscountRupees = Math.round(tenPercentDiscountPaise / 100);

  // Initiate In-Page Prepay Checkout
  const handleInitiatePrepay = () => {
    if (!order) return;
    setIsInitiatingPayment(true);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://www.namonarayanaghee.store";
      const cleanOrderId = String(order.id || order.orderId || "").replace(/^#/, "");
      const cleanPhone = (order.contactInfo?.phone || order.phone || order.shippingAddress?.phone || "").replace(/\D/g, "").slice(-10);
      const cleanEmail = order.contactInfo?.email || order.email || order.customerEmail || `${cleanPhone || "care"}@namonarayanaghee.store`;
      const cleanName = order.shippingAddress?.name || order.contactInfo?.name || order.customerName || "Customer";

      const payParams = new URLSearchParams();
      payParams.set("order_id", `${cleanOrderId}-PREPAY`);
      payParams.set("txnid", `${cleanOrderId}-PREPAY`);
      payParams.set("amount", finalPrepayAmountRupees.toString());
      payParams.set("firstname", cleanName);
      payParams.set("email", cleanEmail);
      payParams.set("phone", cleanPhone);
      payParams.set("productinfo", `Prepay Upgrade for Order #${cleanOrderId} (COD to Prepaid)`);
      payParams.set("embed", "true");
      payParams.set("returnUrl", `${origin}/api/convert-cod-to-prepaid?orderId=${encodeURIComponent(cleanOrderId)}&amount=${finalPrepayAmountRupees}`);
      payParams.set("cancelUrl", `${origin}/track-order?orderId=${encodeURIComponent(cleanOrderId)}`);
      payParams.set("brand", "namonarayanaghee");

      setIframeUrl(`https://potter-world.com/pay-proxy?${payParams.toString()}`);
      setIsIframeOpen(true);
    } catch (err: any) {
      console.error("Failed to initiate prepay:", err);
      toast.error("Could not initiate payment. Please try again.");
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  // Listen for Razorpay postMessage from potter-world payment iframe
  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "RAZORPAY_SUCCESS") {
        setIsIframeOpen(false);
        setIframeUrl(null);

        const verifyToastId = toast.loading("Payment received! Upgrading your order to 100% Prepaid...");

        try {
          const cleanOrderId = String(order?.id || order?.orderId || "").replace(/^#/, "");
          const res = await fetch("/api/convert-cod-to-prepaid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: cleanOrderId,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_order_id: data.razorpay_order_id,
              razorpay_signature: data.razorpay_signature,
              amountPaidPaise: finalPrepayAmountPaise,
              discountPaise: totalSavingsPaise,
              originalRemainingPaise: remainingPaise,
            }),
          });

          const result = await res.json();
          if (result.success && result.order) {
            setOrder(result.order);
            toast.success(`🎉 Upgraded to 100% Prepaid! You saved ₹${totalSavingsRupees}. No cash needed on delivery.`);
          } else {
            toast.error(result.error || "Failed to update order status");
          }
        } catch (err) {
          console.error("Error confirming prepay upgrade:", err);
          toast.error("Payment received! Our support desk will confirm the prepaid status shortly.");
        } finally {
          toast.dismiss(verifyToastId);
        }
      } else if (data.type === "RAZORPAY_DISMISSED") {
        setIsIframeOpen(false);
        setIframeUrl(null);
        toast.info("Payment window closed. You can prepay anytime before your order arrives.");
      } else if (data.type === "RAZORPAY_FAILED") {
        setIsIframeOpen(false);
        setIframeUrl(null);
        toast.error("Payment was not completed. You can pay on delivery or try another online method.");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [order, finalPrepayAmountPaise, totalSavingsPaise, remainingPaise, totalSavingsRupees]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-32 pb-24">
      {/* ─── Seamless In-Page Payment Modal ─── */}
      {isIframeOpen && iframeUrl && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-200 p-2 sm:p-4">
          <button
            type="button"
            onClick={() => {
              setIsIframeOpen(false);
              setIframeUrl(null);
              toast.info("Payment window closed.");
            }}
            className="absolute top-4 right-4 z-[100000] p-2.5 bg-white/90 hover:bg-white text-stone-700 rounded-full shadow-xl transition active:scale-95 cursor-pointer border border-stone-200"
            title="Close payment window"
            aria-label="Close payment modal"
          >
            <X className="w-5 h-5 text-stone-700" />
          </button>
          <iframe
            src={iframeUrl}
            title="Secure Payment Gateway"
            className="w-full h-full max-w-xl max-h-[700px] rounded-2xl border-0 shadow-2xl bg-white"
            allow="payment *; clipboard-read *; clipboard-write *"
          />
        </div>
      )}

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
                className="text-[#C99A3D] font-semibold hover:text-[#A87845] text-sm flex items-center gap-1"
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

              <div className="p-6 sm:p-8">
                {/* ─── Dynamic Estimated Delivery Date (EDD) Card ─── */}
                {(() => {
                  const edd = calculateEDD(order);
                  return (
                    <div className="mb-8 p-4 sm:p-5 rounded-2xl border border-[#EAD7BC] bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5E0B10] to-[#8A1B14] flex items-center justify-center shrink-0 shadow-xs">
                            <Calendar className="w-5 h-5 text-[#F5BD47]" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#8A1B14] block">
                              Doorstep Arrival Window
                            </span>
                            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#5E0B10]">
                              {edd.title}
                            </h3>
                            <p className="text-xs text-[#7A4A3B] mt-0.5 leading-relaxed">
                              {edd.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAD7BC]">
                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${edd.badgeColor} uppercase tracking-wider`}>
                            {edd.badgeText}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium">
                            Gaushala Direct Dispatch
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ─── 5-Stage Farm-to-Kitchen Vedic Journey Tracker ─── */}
                {(() => {
                  const currentStageIndex = getJourneyStageIndex(order);
                  return (
                    <div className="mb-8 p-5 sm:p-6 rounded-2xl border border-[#EAD7BC] bg-[#FCFAF5] shadow-xs">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-6 border-b border-[#EAD7BC] pb-4">
                        <div>
                          <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#8A1B14] block">
                            Vedic Fulfillment Journey
                          </span>
                          <h3 className="text-lg font-serif font-bold text-[#5E0B10] flex items-center gap-2">
                            <span>Farm-to-Kitchen Sacred Progress</span>
                            <span className="inline-flex items-center text-[10px] font-sans font-bold bg-[#F5ECE0] text-[#8A1B14] px-2 py-0.5 rounded-full border border-[#EAD7BC]">
                              Brahma Muhurta Bilona
                            </span>
                          </h3>
                        </div>

                        <div className="text-xs text-[#7A4A3B] font-medium flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#EAD7BC] shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                          <span>Live Order Tracking</span>
                        </div>
                      </div>

                      {/* Desktop Horizontal Milestone Stepper */}
                      <div className="hidden md:block">
                        <div className="relative flex justify-between items-start">
                          {/* Connecting Progress Line */}
                          <div className="absolute top-6 left-8 right-8 h-1 bg-[#E8DEC9] -z-0" aria-hidden="true">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-600 via-[#D4A017] to-[#8A1B14] transition-all duration-700 ease-out"
                              style={{
                                width: `${Math.min(100, (currentStageIndex / (VEDIC_JOURNEY_STAGES.length - 1)) * 100)}%`,
                              }}
                            />
                          </div>

                          {VEDIC_JOURNEY_STAGES.map((st, idx) => {
                            const isCompleted = idx < currentStageIndex;
                            const isCurrent = idx === currentStageIndex;
                            const Icon = st.icon;

                            return (
                              <div
                                key={st.stage}
                                className="relative z-10 flex flex-col items-center text-center max-w-[130px]"
                                aria-current={isCurrent ? "step" : undefined}
                              >
                                <div
                                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                    isCompleted
                                      ? "bg-emerald-600 text-white shadow-md"
                                      : isCurrent
                                      ? "bg-gradient-to-br from-[#D4A017] to-[#B38012] text-white shadow-lg ring-4 ring-amber-200/80 scale-110"
                                      : "bg-white border-2 border-[#EAD7BC] text-[#8C7B6D]"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-6 h-6" />
                                  ) : (
                                    <Icon className={`w-5 h-5 ${isCurrent ? "animate-pulse" : ""}`} />
                                  )}
                                </div>

                                <div className="mt-3">
                                  <span
                                    className={`text-[9px] font-extrabold uppercase tracking-wider block mb-0.5 ${
                                      isCompleted
                                        ? "text-emerald-700"
                                        : isCurrent
                                        ? "text-[#8A1B14]"
                                        : "text-stone-400"
                                    }`}
                                  >
                                    {isCompleted ? "Completed ✓" : isCurrent ? "In Progress ⚡" : `Stage ${st.stage}`}
                                  </span>
                                  <h4
                                    className={`text-xs font-bold leading-tight ${
                                      isCompleted || isCurrent ? "text-[#2A1612]" : "text-stone-400"
                                    }`}
                                  >
                                    {st.title}
                                  </h4>
                                  <p className="text-[10px] text-stone-500 mt-1 leading-normal line-clamp-3">
                                    {st.subtitle}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Mobile Vertical Stepped Timeline */}
                      <div className="block md:hidden space-y-3.5">
                        {VEDIC_JOURNEY_STAGES.map((st, idx) => {
                          const isCompleted = idx < currentStageIndex;
                          const isCurrent = idx === currentStageIndex;
                          const Icon = st.icon;

                          return (
                            <div
                              key={st.stage}
                              className={`relative flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${
                                isCurrent
                                  ? "bg-amber-50/70 border-amber-300 shadow-sm ring-1 ring-amber-200"
                                  : isCompleted
                                  ? "bg-white/80 border-emerald-200/80"
                                  : "bg-white/40 border-stone-200 opacity-60"
                              }`}
                              aria-current={isCurrent ? "step" : undefined}
                            >
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                  isCompleted
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : isCurrent
                                    ? "bg-gradient-to-br from-[#D4A017] to-[#B38012] text-white shadow-md ring-3 ring-amber-200 animate-pulse"
                                    : "bg-stone-100 text-stone-400 border border-stone-200"
                                }`}
                              >
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 flex-wrap">
                                  <span
                                    className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                      isCompleted
                                        ? "bg-emerald-100 text-emerald-800"
                                        : isCurrent
                                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                                        : "bg-stone-100 text-stone-500"
                                    }`}
                                  >
                                    {isCompleted ? "Completed ✓" : isCurrent ? "Active Stage ⚡" : `Stage ${st.stage}`}
                                  </span>
                                  <span className="text-[10px] text-stone-400 font-mono">
                                    {st.badge}
                                  </span>
                                </div>

                                <h4
                                  className={`text-xs font-bold mt-1 ${
                                    isCompleted || isCurrent ? "text-[#2A1612]" : "text-stone-400"
                                  }`}
                                >
                                  {st.title}
                                </h4>
                                <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                                  {st.subtitle}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Courier & AWB Information Strip */}
                      <div className="mt-6 pt-4 border-t border-[#EAD7BC] bg-white p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#FAF6EE] border border-[#EAD7BC] flex items-center justify-center text-[#8A1B14] shrink-0">
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-stone-400 block">Courier Partner</span>
                            <strong className="text-[#2A1612]">
                              {order.courierPartner || "Delhivery Express / Blue Dart"}
                            </strong>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">AWB Tracking Status</span>
                          {order.trackingNumber && !String(order.trackingNumber).toLowerCase().includes("not picked up") ? (
                            <div className="flex items-center sm:justify-end gap-1.5">
                              <span className="font-mono font-bold text-[#8A1B14] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                {order.trackingNumber || order.awbNumber}
                              </span>
                              <a
                                href={`https://www.delhivery.com/track/package/${order.trackingNumber || order.awbNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8A1B14] hover:underline flex items-center gap-0.5 font-bold"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Order not picked up yet • AWB will generate on pickup
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ─── COD to Prepaid Conversion Hub or Paid Banner ─── */}
                {isCodActive ? (
                  <div className="space-y-4 mb-8">
                    {/* COD Info Strip */}
                    <div className="bg-[#FAF8F5] border border-[#EAD7BC] rounded-xl p-3.5 text-xs sm:text-sm text-[#4E1013] flex items-center justify-between gap-3">
                      <div>
                        <strong className="block text-sm font-bold text-[#8A1B14]">Cash on Delivery Order</strong>
                        <span className="text-stone-600 text-xs">
                          Doorstep balance to collect: <strong>{formatPrice(remainingPaise)}</strong>
                        </span>
                      </div>
                      <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300 shrink-0">
                        COD Active
                      </span>
                    </div>

                    {/* Pre-Delivery Discount & COD Waiver Card */}
                    <div className="relative overflow-hidden rounded-2xl border-2 border-[#D4A017] bg-gradient-to-br from-[#FFFDF9] via-[#FCF7ED] to-[#F5ECE0] p-5 sm:p-6 shadow-md">
                      {/* Decorative Gold Sparkle Tag */}
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
                          <Sparkles className="w-3.5 h-3.5 text-[#F5BD47]" />
                          Pre-Arrival Upgrade • Save ₹{totalSavingsRupees}
                        </div>
                        <span className="text-[11px] font-bold text-[#8A1B14] bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
                          ⚡ Limited Time Before City Arrival
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#5E0B10] mb-1.5">
                        Prepay Remaining Balance Online & Save ₹{totalSavingsRupees}!
                      </h3>

                      <p className="text-xs sm:text-sm text-[#4A352F] leading-relaxed mb-4">
                        Your consignment is in transit. Avoid the hassle of arranging cash change at your doorstep. Prepay now to get your <strong>₹250 COD fee waived off</strong> + an extra <strong>10% instant discount</strong> before it arrives in your city!
                      </p>

                      {/* Live Price Math Breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                        <div className="bg-white/80 border border-[#EAD7BC] rounded-xl p-2.5 text-center">
                          <span className="text-[10px] uppercase font-bold text-gray-500 block">Doorstep Cash</span>
                          <span className="text-sm font-bold text-gray-400 line-through">₹{remainingRupees}</span>
                        </div>

                        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 text-center">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 block">COD Fee Waived</span>
                          <span className="text-sm font-bold text-emerald-700">−₹{codFeeWaiverRupees}</span>
                        </div>

                        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 text-center">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 block">Extra 10% OFF</span>
                          <span className="text-sm font-bold text-emerald-700">−₹{tenPercentDiscountRupees}</span>
                        </div>

                        <div className="bg-gradient-to-r from-[#5E0B10] to-[#8A1B14] text-white rounded-xl p-2.5 text-center shadow-xs">
                          <span className="text-[10px] uppercase font-bold text-[#F5BD47] block">You Pay Online</span>
                          <span className="text-base font-extrabold text-white">₹{finalPrepayAmountRupees}</span>
                        </div>
                      </div>

                      {/* Trust Highlights */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#4A352F] font-medium mb-5 bg-white/60 p-3 rounded-xl border border-[#EAD7BC]">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Zero cash needed at doorstep</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Contactless priority handover</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-[#8A1B14] shrink-0" />
                          <span>UPI / GPay / PhonePe / Cards</span>
                        </div>
                      </div>

                      {/* Big CTA Button */}
                      <button
                        type="button"
                        onClick={handleInitiatePrepay}
                        disabled={isInitiatingPayment}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#8A1B14] via-[#A8281E] to-[#5E0B10] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.005] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isInitiatingPayment ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-[#F5BD47] fill-[#F5BD47]" />
                            <span>Prepay ₹{finalPrepayAmountRupees} Online Now (Save ₹{totalSavingsRupees})</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-center text-[#7A4A3B] mt-2">
                        🔒 100% Secure 256-Bit Encrypted Payment • Instant Receipt & Delivery Update
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="font-bold text-emerald-900 text-sm">
                          ✅ Fully Paid Online — Doorstep Balance: ₹0.00
                        </strong>
                        <span className="bg-emerald-200 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          ZERO CASH DUE
                        </span>
                      </div>
                      <p className="text-emerald-800 text-xs mt-1">
                        No payment is required when your delivery executive arrives. Priority contactless delivery handover active!
                      </p>
                    </div>
                  </div>
                )}

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
                    <p className="text-xs text-[#8C988B] uppercase tracking-wider mb-1">Total Order Value</p>
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
                  {isCodActive && (
                    <div className="flex justify-between items-center text-sm text-[#8A1B14]">
                      <span className="font-semibold">Balance Due on Delivery</span>
                      <span className="font-bold">{formatPrice(remainingPaise)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-[#EAD7BC]">
                    <span className="font-bold text-[#2A1612]">Total Amount</span>
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

      {/* ─── Instant WhatsApp Help Floating Pill ─── */}
      <a
        href={`https://api.whatsapp.com/send/?phone=919999993821&text=${encodeURIComponent(
          order
            ? `Namaste Namo Narayana Team 🙏 I need help regarding my Order #${String(order.id || order.orderId || "").replace(/^#/, "")}. Customer: ${order.shippingAddress?.name || order.contactInfo?.name || "Customer"}. Status: ${getDynamicOrderStatus(order.createdAt, order.status, order.paymentStatus, order.paymentMethod)}.`
            : "Namaste Namo Narayana Team 🙏 I have an enquiry regarding my Vedic Ghee order."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 via-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-full shadow-2xl hover:shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95 border-2 border-emerald-400/40 group cursor-pointer"
        aria-label="Chat on WhatsApp Support"
      >
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 fill-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-700 animate-pulse" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="block text-[9px] text-emerald-100 uppercase font-extrabold tracking-wider leading-none">
            Live Vedic Support
          </span>
          <span className="block text-xs font-bold text-white leading-tight mt-0.5">
            {order ? `WhatsApp Help #${String(order.id || "").replace(/^#/, "").slice(0, 8)}...` : "WhatsApp Support"}
          </span>
        </div>
      </a>
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
