"use client";
import { toast } from "sonner";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Info, CheckCircle2, ShieldCheck, Truck, Loader2, CreditCard, Banknote, Tag, Percent, Key, MapPin } from "lucide-react";
import { useCart, clearCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { useAuth } from "@/hooks/useAuth";
import { saveUserCheckoutProfile, calculateCheckoutPricing, CheckoutData, Address, GstDetails } from "@/lib/orders";

type Step = "info" | "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const { user } = useAuth();
  
  const [step, setStep] = useState<Step>("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNextStep = (nextStep: Step) => {
    if (nextStep === "shipping" && email && cart.items.length > 0) {
      // Save abandoned cart silently
      import("@/lib/abandoned-cart").then(({ logAbandonedCart }) => {
        logAbandonedCart({
          email,
          phone,
          cartItems: cart.items,
          subtotal: cart.subtotal
        });
      });
    }

    if (nextStep === "payment") {
      trackEvent("add_shipping_info", { value: cart.subtotal, currency: "INR" });
    }

    if (nextStep === "review") {
      trackEvent("add_payment_info", { payment_type: paymentMethod, value: cart.subtotal, currency: "INR" });
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };
  
  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hasGst, setHasGst] = useState(false);
  const [gstDetails, setGstDetails] = useState<GstDetails>({ companyName: "", gstin: "" });
  
  const [shipping, setShipping] = useState<Address>({ name: "", address: "", city: "", state: "", pincode: "", country: "India" });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billing, setBilling] = useState<Address>({ name: "", address: "", city: "", state: "", pincode: "", country: "India" });
  
  const [paymentMethod, setPaymentMethod] = useState("prepaid");
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [tempCoupon, setTempCoupon] = useState("");

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nn_checkout_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.hasGst !== undefined) setHasGst(parsed.hasGst);
        if (parsed.gstDetails) setGstDetails(parsed.gstDetails);
        if (parsed.shipping) setShipping(parsed.shipping);
        if (parsed.billingSameAsShipping !== undefined) setBillingSameAsShipping(parsed.billingSameAsShipping);
        if (parsed.billing) setBilling(parsed.billing);
        if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
        if (parsed.couponCode) setCouponCode(parsed.couponCode);
      }
    } catch (e) {
      console.error("Failed to load checkout data from local storage", e);
    }
  }, []);

  // Sync cart discount code
  useEffect(() => {
    if (cart.discountCode && cart.discountCode !== couponCode) {
      setCouponCode(cart.discountCode);
    } else if (!cart.discountCode && couponCode) {
      // If removed from cart drawer, clear here
      setCouponCode("");
    }
  }, [cart.discountCode]);

  // Track begin_checkout
  useEffect(() => {
    if (cart.items.length > 0) {
      trackEvent("begin_checkout", {
        currency: "INR",
        value: cart.subtotal,
        items: cart.items.map(item => ({
          item_id: item.productId,
          item_name: item.title,
          quantity: item.quantity,
          price: item.price
        }))
      });
    }
  }, [cart.items.length]);

  // Save to localStorage on change
  useEffect(() => {
    try {
      const dataToSave = {
        email,
        phone,
        hasGst,
        gstDetails,
        shipping,
        billingSameAsShipping,
        billing,
        paymentMethod,
        couponCode
      };
      localStorage.setItem("nn_checkout_data", JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Failed to save checkout data to local storage", e);
    }
  }, [email, phone, hasGst, gstDetails, shipping, billingSameAsShipping, billing, paymentMethod, couponCode]);

  const handlePincodeChange = async (val: string, target: 'shipping' | 'billing') => {
    if (target === 'shipping') {
      setShipping({ ...shipping, pincode: val });
    } else {
      setBilling({ ...billing, pincode: val });
    }

    if (val.length === 6) {
      setIsFetchingPincode(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          if (target === 'shipping') {
            setShipping(prev => ({ ...prev, city: postOffice.District, state: postOffice.State }));
          } else {
            setBilling(prev => ({ ...prev, city: postOffice.District, state: postOffice.State }));
          }
        }
      } catch (e) {
        console.error("Failed to fetch pincode", e);
      }
      setIsFetchingPincode(false);
    }
  };

  // Compute pricing reactively
  const pricing = useMemo(() => {
    return calculateCheckoutPricing(cart.items, cart.subtotal, paymentMethod, email, couponCode);
  }, [cart.items, cart.subtotal, paymentMethod, email, couponCode]);

  if (cart.items.length === 0 && !isSubmitting) {
    return (
      <section className="nn-section bg-white min-h-[60vh]">
        <div className="nn-container max-w-lg mx-auto text-center py-16 space-y-4">
          <h1 className="nn-title"><span className="notranslate">Checkout</span></h1>
          <p className="nn-sub">Your cart is empty. Add items before checking out.</p>
          <Link href="/collections/all-products" className="nn-btn nn-btn-primary mt-4">Shop Now</Link>
        </div>
      </section>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: "info", label: "Information" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
    { key: "review", label: "Review" },
  ];

  const currentIdx = steps.findIndex((s) => s.key === step);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    
    try {
      const finalBilling = billingSameAsShipping ? shipping : billing;
      
      const checkoutData: CheckoutData = {
        email,
        phone,
        shippingAddress: shipping,
        billingAddress: finalBilling,
        gstDetails: hasGst ? gstDetails : undefined,
        paymentMethod,
        couponCode: couponCode || undefined
      };

      // 1. Show single loading toast
      const loadingToastId = toast.loading("Securely preparing your order...", { duration: 10000 });
      
      trackEvent("order_created", {
        value: pricing.amountToPay,
        currency: "INR",
        payment_type: paymentMethod
      });

      // 2. Call server to securely create order and proxy URL
      const uid = user ? user.uid : `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          cartItems: cart.items,
          checkoutData
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create order securely");
      }

      const { orderId, checkoutUrl } = data;

      // 3. Send Telegram Notification in background (using keepalive to survive redirect)
      fetch("/api/send-telegram-notification", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "initiated",
          orderId,
          orderData: {
            items: cart.items.map(i => ({ ...i, name: i.title })),
            subtotal: cart.subtotal,
            shippingAddress: shipping,
            contactInfo: { email, phone },
            paymentMethod,
            paymentStatus: "pending"
          }
        })
      }).catch(e => console.error("Failed to send init telegram notification", e));
      
      // 4. Redirect to payment page immediately
      toast.success("Redirecting to secure payment...", { id: loadingToastId });
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("There was an issue placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="nn-section bg-[#FAF9F5] min-h-[80vh]">
      <div className="nn-container max-w-6xl mx-auto py-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1E3A24] text-center mb-8">Secure <span className="notranslate">Checkout</span></h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-4">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => i <= currentIdx && setStep(s.key)}
                className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition ${i <= currentIdx ? "bg-[#1E3A24] text-white" : "bg-[#E9E5D9] text-[#576B55]"}`}
              >
                {i + 1}
              </button>
              <span className={`text-sm font-medium hidden sm:inline ${i <= currentIdx ? "text-[#1E3A24]" : "text-[#576B55]"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-[#D5D8D0] mx-1" />}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Main Form Area */}
          <div className="w-full lg:w-[60%] space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#E9E5D9]">
              
              {/* 1. INFO STEP */}
              {step === "info" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl font-bold text-[#1E3A24]">Contact Information</h2>
                  <div className="space-y-4">
                    <input type="email" placeholder="Email Address *" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] focus:ring-1 focus:ring-[#1E3A24] transition bg-white" />
                    <input type="tel" placeholder="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] focus:ring-1 focus:ring-[#1E3A24] transition bg-white" />
                  </div>

                  <div className="pt-4 border-t border-[#E9E5D9]">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input type="checkbox" checked={hasGst} onChange={(e) => setHasGst(e.target.checked)} className="w-5 h-5 rounded border-[#D5D8D0] text-[#1E3A24] focus:ring-[#1E3A24] accent-[#1E3A24]" />
                      <span className="font-medium text-[#364935]">I need a GST Invoice for my company</span>
                    </label>
                  </div>

                  {hasGst && (
                    <div className="space-y-4 p-5 bg-[#F7F4EB] rounded-xl border border-[#E9DFD1] mt-4 animate-in fade-in slide-in-from-top-2">
                      <input type="text" placeholder="Company Name *" value={gstDetails.companyName} onChange={(e) => setGstDetails({...gstDetails, companyName: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] bg-white" />
                      <input type="text" placeholder="GSTIN *" value={gstDetails.gstin} onChange={(e) => setGstDetails({...gstDetails, gstin: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] bg-white uppercase" />
                    </div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <button onClick={() => handleNextStep("shipping")} disabled={!email || !phone || (hasGst && (!gstDetails.companyName || !gstDetails.gstin))} className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      {isTransitioning ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span className="notranslate">Continue to Shipping</span>}
                    </button>
                  </div>
                </div>
              )}

              
              {/* 2. SHIPPING STEP */}
              {step === "shipping" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl font-bold text-[#1E3A24]"><span className="notranslate">Shipping & Billing</span> Address</h2>
                  <div className="space-y-4">
                    <input type="text" placeholder="Full Name *" value={shipping.name} onChange={(e) => setShipping({...shipping, name: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                    <input type="text" placeholder="Street Address / Apartment / Suite *" value={shipping.address} onChange={(e) => setShipping({...shipping, address: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <input type="text" maxLength={6} placeholder="PIN Code / Zip Code *" value={shipping.pincode} onChange={(e) => handlePincodeChange(e.target.value, 'shipping')} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                        {isFetchingPincode && <Loader2 className="w-4 h-4 animate-spin absolute right-4 top-4 text-[#576B55]" />}
                      </div>
                      <input type="text" placeholder="City *" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="State / Province *" value={shipping.state} onChange={(e) => setShipping({...shipping, state: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                      <input type="text" value={shipping.country} readOnly className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 bg-[#FAF9F5] text-[#576B55] outline-none" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E9E5D9]">
                    <h3 className="font-serif text-lg font-bold text-[#1E3A24] mb-4">Billing Address</h3>
                    <div className="space-y-3">
                      <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${billingSameAsShipping ? "border-[#1E3A24] bg-[#F4F6F0]" : "border-[#E9E5D9] hover:border-[#D5D8D0]"}`}>
                        <input type="radio" name="billingAddress" checked={billingSameAsShipping} onChange={() => setBillingSameAsShipping(true)} className="w-5 h-5 accent-[#1E3A24]" />
                        <span className="font-medium text-[#1E3A24]">Same as shipping address</span>
                      </label>

                      <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${!billingSameAsShipping ? "border-[#1E3A24] bg-[#F4F6F0]" : "border-[#E9E5D9] hover:border-[#D5D8D0]"}`}>
                        <input type="radio" name="billingAddress" checked={!billingSameAsShipping} onChange={() => setBillingSameAsShipping(false)} className="w-5 h-5 accent-[#1E3A24]" />
                        <span className="font-medium text-[#1E3A24]">Use a different billing address</span>
                      </label>
                    </div>

                    {!billingSameAsShipping && (
                      <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2">
                        <input type="text" placeholder="Full Name *" value={billing.name} onChange={(e) => setBilling({...billing, name: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                        <input type="text" placeholder="Street Address / Apartment / Suite *" value={billing.address} onChange={(e) => setBilling({...billing, address: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <input type="text" maxLength={6} placeholder="PIN Code / Zip Code *" value={billing.pincode} onChange={(e) => handlePincodeChange(e.target.value, 'billing')} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                            {isFetchingPincode && <Loader2 className="w-4 h-4 animate-spin absolute right-4 top-4 text-[#576B55]" />}
                          </div>
                          <input type="text" placeholder="City *" value={billing.city} onChange={(e) => setBilling({...billing, city: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" placeholder="State / Province *" value={billing.state} onChange={(e) => setBilling({...billing, state: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                          <input type="text" value={billing.country} readOnly className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 bg-[#FAF9F5] text-[#576B55] outline-none" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-[#E9E5D9] mt-6">
                    <button onClick={() => handleNextStep("info")} className="text-[#364935] font-medium hover:text-[#1E3A24] px-4 py-2">Back to Info</button>
                    <button onClick={() => handleNextStep("payment")} disabled={isTransitioning || !shipping.name || !shipping.address || !shipping.city || !shipping.state || !shipping.pincode || (!billingSameAsShipping && (!billing.name || !billing.address || !billing.city || !billing.state || !billing.pincode))} className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      {isTransitioning ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span className="notranslate">Continue to Payment</span>}
                    </button>
                  </div>
                </div>
              )}

              {/* 4. PAYMENT STEP */}

              {step === "payment" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl font-bold text-[#1E3A24]"><span className="notranslate">Payment Method</span></h2>
                  
                    {/* Prepaid Option */}
                    <label className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition border-[#C38936] bg-[#FDFBF7]`}>
                      <input type="radio" name="payment" value="prepaid" checked={paymentMethod === "prepaid"} onChange={(e) => handlePaymentMethodChange(e.target.value)} className="mt-1 w-5 h-5 accent-[#C38936]" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <CreditCard className="w-5 h-5 text-[#C38936]" />
                          <span className="font-bold text-[#1E3A24] text-base">Pay Online (Prepaid)</span>
                        </div>
                        <p className="text-sm text-[#576B55]">Pay via UPI, Credit/Debit Card, or NetBanking.</p>
                      </div>
                    </label>

                  {/* Pricing breakdown for selected method */}
                  <div className="bg-[#F7F4EB] rounded-xl p-5 border border-[#E9DFD1] space-y-3">
                    <h3 className="font-bold text-[#1E3A24] text-sm uppercase tracking-wider flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Payment Breakdown
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-[#576B55]">
                        <span><span className="notranslate">Cart</span> Subtotal</span>
                        <span className="font-semibold text-[#1E3A24]">{formatPrice(cart.subtotal)}</span>
                      </div>
                      
                      {pricing.discount > 0 && (
                        <div className="flex justify-between text-green-700">
                          <span className="flex items-center gap-1">
                            <Percent className="w-3 h-3" /> <span className="notranslate">Discount</span> ({pricing.discountPercent}%)
                          </span>
                          <span className="font-semibold">-{formatPrice(pricing.discount)}</span>
                        </div>
                      )}



                      <div className="border-t border-[#E9DFD1] pt-2">
                        <div className="flex justify-between font-bold text-[#1E3A24]">
                          <span className="flex items-center"><CreditCard className="w-4 h-4 inline mr-1" /> Pay Now Online</span>
                          <span className="text-lg">{formatPrice(pricing.amountToPay)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-between">
                    <button onClick={() => handleNextStep("shipping")} className="text-[#364935] font-medium hover:text-[#1E3A24] px-4 py-2">Back to Shipping</button>
                    <button onClick={() => handleNextStep("review")} className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      {isTransitioning ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span className="notranslate">Review Order</span>}
                    </button>
                  </div>
                </div>
              )}

              {/* 5. REVIEW STEP */}
              {step === "review" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl font-bold text-[#1E3A24]">Review Your <span className="notranslate">Order</span></h2>
                  
                  <div className="space-y-4">
                    <div className="p-5 bg-[#FAF9F5] rounded-xl border border-[#E9E5D9]">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-[#1E3A24]">Contact Info</h3>
                        <button onClick={() => handleNextStep("info")} className="text-xs text-[#C38936] font-bold hover:underline">EDIT</button>
                      </div>
                      <p className="text-sm text-[#364935]">{email} • {phone}</p>
                      {hasGst && <p className="text-sm text-[#364935] mt-1"><strong>GSTIN:</strong> {gstDetails.gstin} ({gstDetails.companyName})</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-[#FAF9F5] rounded-xl border border-[#E9E5D9]">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-bold text-[#1E3A24]">Shipping</h3>
                          <button onClick={() => handleNextStep("shipping")} className="text-xs text-[#C38936] font-bold hover:underline">EDIT</button>
                        </div>
                        <p className="text-sm text-[#364935] leading-relaxed">
                          {shipping.name}<br/>
                          {shipping.address}<br/>
                          {shipping.city}, {shipping.state} {shipping.pincode}<br/>
                          {shipping.country}
                        </p>
                      </div>

                      <div className="p-5 bg-[#FAF9F5] rounded-xl border border-[#E9E5D9]">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-bold text-[#1E3A24]">Billing</h3>
                          <button onClick={() => handleNextStep("shipping")} className="text-xs text-[#C38936] font-bold hover:underline">EDIT</button>
                        </div>
                        <p className="text-sm text-[#364935] leading-relaxed">
                          {billingSameAsShipping ? "Same as shipping address" : (
                            <>
                              {billing.name}<br/>
                              {billing.address}<br/>
                              {billing.city}, {billing.state} {billing.pincode}<br/>
                              {billing.country}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Payment Method Summary */}
                    <div className="p-5 bg-[#FAF9F5] rounded-xl border border-[#E9E5D9]">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-[#1E3A24]">Payment</h3>
                        <button onClick={() => setStep("payment")} className="text-xs text-[#C38936] font-bold hover:underline">EDIT</button>
                      </div>
                      <div className="text-sm text-[#364935] space-y-1">
                        <p className="font-semibold"><CreditCard className="w-4 h-4 inline mr-1" /> Prepaid</p>
                        <p>Pay now: <strong>{formatPrice(pricing.amountToPay)}</strong></p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E9E5D9]">
                    <button onClick={() => handleNextStep("payment")} disabled={isSubmitting} className="text-[#364935] font-medium hover:text-[#1E3A24] px-4 py-2 order-2 sm:order-1 w-full sm:w-auto text-center">Back to Payment</button>
                    <button onClick={handlePlaceOrder} disabled={isSubmitting} className="bg-[#C38936] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#b0782b] shadow-lg hover:shadow-xl transition-all order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <><span className="notranslate">Pay</span> {formatPrice(pricing.amountToPay)} & Place <span className="notranslate">Order</span></>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-8 py-6 text-[#576B55]">
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#1E3A24]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Secure<br/>Checkout</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-[#1E3A24]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Fast & Reliable<br/>Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#1E3A24]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">100% Quality<br/>Guarantee</span>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-24 h-fit">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#E9E5D9]">
              <h3 className="font-serif text-2xl font-bold text-[#1E3A24] mb-6"><span className="notranslate">Order Summary</span></h3>
              
              <ul className="divide-y divide-[#E9E5D9] mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.items.map((item) => (
                  <li key={item.variantId} className="flex gap-4 py-4 first:pt-0">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E9DFD1] shrink-0 bg-[#F7F4EB]">
                      {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" sizes="80px" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <p className="font-bold text-[#1E3A24] leading-tight mb-1">{item.title}</p>
                      <p className="text-xs text-[#576B55] mb-2">{item.variantTitle}</p>
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-semibold bg-[#E9E5D9] px-2 py-1 rounded text-[#364935]">Qty: {item.quantity}</span>
                        <span className="font-bold text-[#1E3A24]">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="space-y-4 text-base border-t-2 border-dashed border-[#E9E5D9] pt-6 bg-[#FAF9F5] -mx-6 md:-mx-8 px-6 md:px-8 pb-2">
                <div className="flex justify-between items-center text-[#576B55]">
                  <span><span className="notranslate">Subtotal</span></span>
                  <span className="font-semibold text-[#1E3A24]">{formatPrice(cart.subtotal)}</span>
                </div>
                
                {pricing.discount > 0 && (
                  <div className="flex justify-between items-center text-green-700">
                    <span><span className="notranslate">Discount</span> ({pricing.discountPercent}%)</span>
                    <span className="font-semibold">-{formatPrice(pricing.discount)}</span>
                  </div>
                )}
                
                {/* Coupon Code Input */}
                <div className="py-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code"
                      value={tempCoupon}
                      onChange={(e) => setTempCoupon(e.target.value.toUpperCase())}
                      className="flex-1 border border-[#D5D8D0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1E3A24] bg-white uppercase"
                    />
                    <button
                      onClick={() => {
                        const val = tempCoupon.trim().toUpperCase();
                        import("@/lib/cart").then((cartLib) => {
                          if (cartLib.VALID_COUPONS[val]) {
                            setCouponCode(val);
                            toast.success(`Coupon ${val} applied!`);
                            setTempCoupon("");
                            cartLib.applyCoupon(val); // Sync to cart drawer state
                          } else {
                            toast.error("Invalid or expired coupon code");
                          }
                        });
                      }}
                      disabled={!tempCoupon.trim()}
                      className="bg-[#1E3A24] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#152919] disabled:opacity-50 transition-colors"
                    >
                      <span className="notranslate">Apply</span>
                    </button>
                  </div>
                  {couponCode && (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-800 text-xs px-3 py-2 rounded-lg mt-2">
                      <span className="font-bold flex items-center gap-1"><Tag className="w-3 h-3"/> {couponCode} APPLIED</span>
                      <button onClick={() => {
                        setCouponCode("");
                        import("@/lib/cart").then((cartLib) => cartLib.removeCoupon());
                      }} className="text-green-800 hover:text-green-900 underline">Remove</button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-[#576B55]">
                  <span><span className="notranslate">Shipping</span></span>
                  <span className="font-bold text-[#C38936]">FREE</span>
                </div>
                <div className="flex justify-between items-center text-[#576B55]">
                  <span>Tax (Included)</span>
                  <span className="font-semibold text-[#1E3A24]">₹0.00</span>
                </div>
              </div>
              
              <div className="border-t border-[#D5D8D0] mt-4 pt-6 bg-[#FAF9F5] -mx-6 md:-mx-8 px-6 md:px-8 pb-6 md:pb-8 -mb-6 md:-mb-8 rounded-b-2xl space-y-3">

                
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-sm text-[#576B55] mb-1">Total to Pay</span>
                    <span className="text-xs text-[#576B55]">Inclusive of all taxes</span>
                  </div>
                  <span className="text-3xl font-bold text-[#1E3A24]">{formatPrice(pricing.amountToPay)}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
