const fs = require('fs');
const path = require('path');

const potterDir = path.resolve(__dirname, '../../potter-world');

if (!fs.existsSync(potterDir)) {
  console.error('Potter world directory not found at:', potterDir);
  process.exit(1);
}

// 1. Update potter-world/app/api/create-order/route.ts
const createOrderPath = path.join(potterDir, 'app/api/create-order/route.ts');
const createOrderCode = `import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency, receipt, notes } = body;

    // Check if checkout is by admin littlecodr@gmail.com -> force 100 paise (₹1.00)
    const customerEmail = (notes?.customer_email || body.email || '').toLowerCase().trim();
    const isAdmin = customerEmail === 'littlecodr@gmail.com';

    let finalAmount = isAdmin ? 100 : Math.round(Number(amount));

    if (!finalAmount || finalAmount < 100) {
      return NextResponse.json(
        { error: 'Amount is required and must be at least 100 paise' },
        { status: 400 }
      );
    }

    const key_id = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string) || 'rzp_live_TX8xr1CVxZnqPs';
    const key_secret = (process.env.RAZORPAY_KEY_SECRET as string) || 'JC4fbxH7njMTfzctnXrFVyPs';

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options: any = {
      amount: finalAmount, // ensure integer in paise
      currency: currency || 'INR',
      receipt: (receipt || \`rcpt_\${Date.now()}\`).toString().slice(0, 40),
    };

    if (notes) {
      options.notes = notes;
    }

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
`;
fs.writeFileSync(createOrderPath, createOrderCode, 'utf8');
console.log('Updated app/api/create-order/route.ts in potter-world');

// 2. Create potter-world/app/pay-proxy/page.tsx
const payProxyDir = path.join(potterDir, 'app/pay-proxy');
if (!fs.existsSync(payProxyDir)) {
  fs.mkdirSync(payProxyDir, { recursive: true });
}

const payProxyCode = `"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, CheckCircle2, Loader2, ArrowRight, RotateCw, AlertTriangle } from "lucide-react";

function ProxyCheckoutContent() {
  const searchParams = useSearchParams();

  // Extract payment details
  const orderId = searchParams.get("order_id") || searchParams.get("txnid") || searchParams.get("orderId") || "";
  const rawAmount = searchParams.get("amount") || "0";
  const firstname = searchParams.get("firstname") || searchParams.get("name") || "Valued Customer";
  const email = (searchParams.get("email") || "").toLowerCase().trim();
  const phone = searchParams.get("phone") || "";
  const productinfo = searchParams.get("productinfo") || "Pure A2 Gir Cow Ghee Order";
  const returnUrl = searchParams.get("returnUrl") || searchParams.get("surl") || "https://namonarayanaghee.store/api/razorpay/callback";
  const cancelUrl = searchParams.get("cancelUrl") || "https://namonarayanaghee.store/cart";

  // Check if admin littlecodr@gmail.com -> force 1 Rupee (100 paise)
  const isAdmin = email === "littlecodr@gmail.com";
  const parsedAmount = isAdmin ? 1 : parseFloat(rawAmount);
  const amountInPaise = isAdmin ? 100 : Math.round(parsedAmount * 100);
  const displayAmount = isAdmin ? "1.00" : (parsedAmount > 0 ? parsedAmount.toFixed(2) : "0.00");

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState("Connecting to Secure Gateway...");
  const hasTriggered = useRef(false);

  // 1. Dynamically load Razorpay SDK instantly
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => setOrderError("Failed to load payment gateway script. Please verify your connection.");
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // 2. Pre-generate Razorpay order in parallel
  useEffect(() => {
    if (!orderId || amountInPaise < 100) {
      setOrderError("Invalid order parameters. Missing order ID or valid amount.");
      return;
    }

    let isMounted = true;

    async function initOrder() {
      try {
        const res = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: "INR",
            receipt: orderId.slice(0, 40),
            notes: {
              merchant: "namonarayanaghee",
              origin_order_id: orderId,
              customer_name: firstname,
              customer_email: email,
              customer_phone: phone,
              is_admin_test: isAdmin ? "true" : "false",
            },
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.order_id) {
          throw new Error(data.error || "Failed to initialize secure payment session");
        }

        if (isMounted) {
          setRazorpayOrder(data);
        }
      } catch (err: any) {
        console.error("Order creation error:", err);
        if (isMounted) {
          setOrderError(err.message || "Failed to connect to payment gateway");
        }
      }
    }

    initOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, amountInPaise, firstname, email, phone, isAdmin]);

  // 3. Instant trigger as soon as order and SDK are ready (no 3s lag!)
  useEffect(() => {
    if (orderError || isPaid) return;

    if (razorpayLoaded && razorpayOrder && !hasTriggered.current) {
      hasTriggered.current = true;
      openRazorpay();
    }
  }, [razorpayLoaded, razorpayOrder, orderError, isPaid]);

  const openRazorpay = () => {
    if (typeof window === "undefined" || !(window as any).Razorpay) return;
    if (!razorpayOrder) return;

    setIsOpening(true);
    setPaymentStatusText("Opening payment portal...");

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TX8xr1CVxZnqPs";

    const options = {
      key,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "Namo Narayana Ghee",
      description: isAdmin ? "Admin Verification (₹1.00)" : (productinfo || \`Order #\${orderId}\`),
      image: "https://namonarayanaghee.store/favicon.ico",
      order_id: razorpayOrder.order_id,
      prefill: {
        name: firstname,
        email: email,
        contact: phone,
      },
      notes: {
        namonarayanaghee_order_id: orderId,
        gateway_hub: "potter-world",
        is_admin_test: isAdmin ? "true" : "false",
      },
      theme: {
        color: "#1E3A24", // Namo Narayana signature green
      },
      modal: {
        ondismiss: function () {
          setIsOpening(false);
          setPaymentStatusText("Payment window closed. Click below to reopen anytime.");
        },
      },
      handler: function (response: any) {
        setIsPaid(true);
        setIsOpening(false);
        setPaymentStatusText("Payment successful! Returning to Namo Narayana...");

        try {
          const targetUrl = new URL(returnUrl);
          targetUrl.searchParams.set("orderId", orderId);
          targetUrl.searchParams.set("txnid", orderId);
          targetUrl.searchParams.set("status", "success");
          targetUrl.searchParams.set("razorpay_payment_id", response.razorpay_payment_id || "");
          targetUrl.searchParams.set("razorpay_order_id", response.razorpay_order_id || "");
          targetUrl.searchParams.set("razorpay_signature", response.razorpay_signature || "");
          targetUrl.searchParams.set("amount", parsedAmount.toString());

          // Redirect user back to Namo Narayana
          window.location.href = targetUrl.toString();
        } catch (err) {
          const glue = returnUrl.includes("?") ? "&" : "?";
          window.location.href = \`\${returnUrl}\${glue}orderId=\${orderId}&status=success&razorpay_payment_id=\${response.razorpay_payment_id}\`;
        }
      },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response: any) {
      console.error("Payment failed:", response.error);
      setIsOpening(false);
      setPaymentStatusText(response.error.description || "Payment failed. Please try again.");
    });

    rzp.open();
  };

  if (orderError) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAF9F5] p-4 font-sans text-[#1E3A24]">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-[#E9E5D9] flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-serif font-bold text-[#1E3A24] mb-2">Checkout Session Error</h1>
          <p className="text-[#576B55] mb-6 text-sm">{orderError}</p>
          <a
            href={cancelUrl}
            className="w-full py-3.5 px-4 bg-[#1E3A24] text-white rounded-xl font-bold shadow-lg hover:bg-[#152919] transition flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" /> Return to Namo Narayana
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF9F5] p-4 font-sans text-[#1E3A24] overflow-y-auto">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-[#E9E5D9] flex flex-col items-center relative overflow-hidden">
        
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C38936]"></div>

        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-center space-x-2">
          <div className="w-12 h-12 bg-[#1E3A24] rounded-full flex items-center justify-center shadow-lg shadow-[#1E3A24]/20 border-2 border-[#C38936]">
            <span className="text-[#C38936] font-serif font-bold text-2xl" style={{ marginTop: "-2px" }}>ॐ</span>
          </div>
          <span className="text-3xl font-serif font-bold text-[#1E3A24]">
            Namo <span className="text-[#C38936]">Narayana</span>
          </span>
        </div>

        {/* Status / Animated Indicator */}
        {isPaid ? (
          <div className="flex flex-col items-center my-4 animate-in fade-in zoom-in duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-base font-bold text-[#1E3A24]">Payment Received!</h2>
            <p className="text-xs text-[#576B55] mt-0.5">Redirecting you back to your confirmation...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center my-4">
            <div className="relative flex items-center justify-center w-14 h-14 mb-3">
              <div className="absolute inset-0 border-4 border-[#E9E5D9] rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#1E3A24] rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-base font-bold text-[#1E3A24]">Connecting to Secure Gateway</h2>
            <p className="text-xs text-[#576B55] mt-0.5">{paymentStatusText}</p>
          </div>
        )}

        {/* Order Summary Pill */}
        <div className="w-full bg-[#FAF9F5] border border-[#E9E5D9] rounded-2xl p-4 mb-5 text-left space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#576B55] font-medium">Order Reference:</span>
            <span className="font-mono font-bold text-[#1E3A24]">#{orderId.slice(0, 14)}</span>
          </div>
          {isAdmin && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] px-2.5 py-1 rounded-lg font-medium flex items-center justify-between">
              <span>Admin Test Mode (littlecodr)</span>
              <span className="font-bold">₹1.00</span>
            </div>
          )}
          <div className="pt-2 border-t border-[#E9E5D9] flex justify-between items-center">
            <span className="text-xs font-bold text-[#1E3A24]">Total Payable:</span>
            <span className="text-lg font-bold text-[#C38936]">₹{displayAmount}</span>
          </div>
        </div>

        {/* Action Button */}
        {!isPaid && (
          <button
            onClick={openRazorpay}
            disabled={!razorpayOrder || !razorpayLoaded || isOpening}
            className="w-full py-3.5 px-4 bg-[#1E3A24] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#1E3A24]/20 hover:bg-[#152919] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isOpening ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#C38936]" />
                Opening Gateway...
              </>
            ) : (
              <>
                Proceed to Payment
                <ArrowRight className="w-4 h-4 text-[#C38936] group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        )}

        <div className="mt-3.5 flex items-center justify-center gap-2 text-[11px] text-[#576B55]">
          <Lock className="w-3.5 h-3.5 text-[#C38936]" />
          <span>Please do not close or refresh this window</span>
        </div>

        {/* Footer Badges */}
        <div className="mt-5 pt-4 border-t border-[#E9E5D9] w-full flex items-center justify-between text-[10px] text-[#788876] font-medium">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E8B57]" />
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Potter World Hub</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E8B57]" />
            <span>PCI-DSS Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PayProxyPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF9F5] text-[#1E3A24]">
          <div className="w-10 h-10 border-4 border-[#E9E5D9] border-t-[#1E3A24] rounded-full animate-spin mb-3"></div>
          <span className="text-sm font-medium">Connecting to secure checkout...</span>
        </div>
      }
    >
      <ProxyCheckoutContent />
    </Suspense>
  );
}
`;

fs.writeFileSync(path.join(payProxyDir, 'page.tsx'), payProxyCode, 'utf8');
console.log('Updated app/pay-proxy/page.tsx in potter-world');

// 3. Update app/pay-direct/page.tsx to use the new proxy checkout
const payDirectPath = path.join(potterDir, 'app/pay-direct/page.tsx');
fs.writeFileSync(payDirectPath, payProxyCode, 'utf8');
console.log('Updated app/pay-direct/page.tsx in potter-world');

// 4. Update app/pay/namonarayanaghee/page.tsx
const payBrandDir = path.join(potterDir, 'app/pay/namonarayanaghee');
if (!fs.existsSync(payBrandDir)) {
  fs.mkdirSync(payBrandDir, { recursive: true });
}
fs.writeFileSync(path.join(payBrandDir, 'page.tsx'), payProxyCode, 'utf8');
console.log('Updated app/pay/namonarayanaghee/page.tsx in potter-world');

console.log('Potter World proxy files updated for ultra-fast load and 1rs admin checkout!');
