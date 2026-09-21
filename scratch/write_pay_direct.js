const fs = require('fs');
const path = require('path');

const dirPath = '/Users/mayank/Developer/potter-world/app/pay-direct';
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const filePath = path.join(dirPath, 'page.tsx');
const content = `"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PayDirectContent() {
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");
  const returnUrl = searchParams.get("returnUrl");
  const [status, setStatus] = useState("Initializing secure payment...");

  useEffect(() => {
    if (!order_id) {
      setStatus("Error: Missing order ID");
      return;
    }

    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (typeof window !== 'undefined' && (window as any).Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const initPayment = async () => {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setStatus("Failed to load payment gateway. Please check your connection.");
        return;
      }

      setStatus("Opening payment gateway...");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: order_id,
        name: "Namo Narayana Ghee",
        description: "Order Checkout",
        theme: {
          color: "#0d1117",
        },
        handler: function (response: any) {
          // Success! We redirect to the returnUrl with the payment details
          setStatus("Payment successful! Redirecting...");
          if (returnUrl) {
            const redirectUrl = new URL(returnUrl);
            redirectUrl.searchParams.set("razorpay_payment_id", response.razorpay_payment_id);
            redirectUrl.searchParams.set("razorpay_order_id", response.razorpay_order_id);
            redirectUrl.searchParams.set("razorpay_signature", response.razorpay_signature);
            window.location.href = redirectUrl.toString();
          } else {
            window.location.href = "/";
          }
        },
        modal: {
          ondismiss: function () {
            setStatus("Payment cancelled. You can safely close this page or try again.");
          },
        },
      };

      // @ts-ignore
      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on("payment.failed", function (response: any) {
        console.error(response.error);
        alert(response.error.description);
        setStatus("Payment failed. Please try again.");
      });
      
      paymentObject.open();
    };

    initPayment();
  }, [order_id, returnUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-brand-charcoal rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-xl font-semibold text-gray-900">Secure Checkout</h1>
        <p className="text-gray-500">{status}</p>
      </div>
    </div>
  );
}

export default function PayDirectPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading checkout...</div>}>
      <PayDirectContent />
    </Suspense>
  );
}
`;

fs.writeFileSync(filePath, content);
console.log('Created app/pay-direct/page.tsx in potter-world');
