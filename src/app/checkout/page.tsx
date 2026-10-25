"use client";
import { toast } from "sonner";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, Loader2, CreditCard, Tag, Percent, MapPin, Lock, Gift, X } from "lucide-react";
import { useCart, clearCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { useAuth } from "@/hooks/useAuth";
import { calculateCheckoutPricing, CheckoutData, GstDetails } from "@/lib/orders";
import { getFreeGiftsForCart } from "@/lib/gifts";

export default function CheckoutPage() {
  const cart = useCart();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  
  // Single form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [hasGst, setHasGst] = useState(false);
  const [gstDetails, setGstDetails] = useState<GstDetails>({ companyName: "", gstin: "" });
  
  const [couponCode, setCouponCode] = useState("");
  const [tempCoupon, setTempCoupon] = useState("");
  const latestPincodeRef = useRef("");
  const summaryRef = useRef<HTMLDivElement>(null);

  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isIframeOpen, setIsIframeOpen] = useState(false);

  // Listen for message events from secure embedded payment gateway (potter-world.com)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!event.origin.includes("potter-world.com")) return;

      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "RAZORPAY_SUCCESS") {
        setIsIframeOpen(false);
        setIframeUrl(null);
        setIsSubmitting(true);

        const verifyToastId = toast.loading("Payment received! Confirming your order...");
        
        try {
          clearCart();
          if (form.email) {
            import("@/lib/abandoned-cart").then(({ clearAbandonedCart }) => clearAbandonedCart(form.email));
          }

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
        } finally {
          toast.dismiss(verifyToastId);
        }

        const successUrl = `/checkout/success?orderId=${encodeURIComponent(data.orderId)}&status=success&razorpay_payment_id=${encodeURIComponent(data.razorpay_payment_id || "")}&razorpay_order_id=${encodeURIComponent(data.razorpay_order_id || "")}&razorpay_signature=${encodeURIComponent(data.razorpay_signature || "")}`;
        window.location.href = successUrl;

      } else if (data.type === "RAZORPAY_DISMISSED") {
        setIsIframeOpen(false);
        setIframeUrl(null);
        setIsSubmitting(false);
        toast.info("Payment window closed. You can complete your order whenever you're ready.");

      } else if (data.type === "RAZORPAY_FAILED") {
        setIsIframeOpen(false);
        setIframeUrl(null);
        setIsSubmitting(false);
        toast.error(data.error?.description || "Payment failed. Please try another payment method.");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [form.email]);

  const scrollToSummary = () => {
    summaryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nn_checkout_data_single");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm(prev => ({ ...prev, ...parsed.form }));
        if (parsed.hasGst !== undefined) setHasGst(parsed.hasGst);
        if (parsed.gstDetails) setGstDetails(parsed.gstDetails);
        if (parsed.couponCode) setCouponCode(parsed.couponCode);
      }
    } catch (e) {
      console.error("Failed to load checkout data", e);
    }
  }, []);

  // Sync cart discount code
  useEffect(() => {
    if (cart.discountCode && cart.discountCode !== couponCode) {
      setCouponCode(cart.discountCode);
    } else if (!cart.discountCode && couponCode) {
      setCouponCode("");
    }
  }, [cart.discountCode, couponCode]);

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
  }, [cart.items.length, cart.subtotal]);

  // Save to localStorage on change
  useEffect(() => {
    try {
      const dataToSave = { form, hasGst, gstDetails, couponCode };
      localStorage.setItem("nn_checkout_data_single", JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Failed to save checkout data", e);
    }
  }, [form, hasGst, gstDetails, couponCode]);

  const handlePincodeChange = async (val: string) => {
    // Only allow digits
    if (!/^\d*$/.test(val)) return;
    
    setForm(prev => ({ ...prev, pincode: val }));
    
    if (val.length === 6) {
      latestPincodeRef.current = val;
      setIsFetchingPincode(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        
        // Prevent stale responses
        if (latestPincodeRef.current !== val) return;

        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setForm(prev => ({ 
            ...prev, 
            city: postOffice.District || postOffice.Region || prev.city, 
            state: postOffice.State || prev.state
          }));
        } else {
          toast.error("Invalid PIN code. Please enter city and state manually.");
        }
      } catch (e) {
        if (latestPincodeRef.current === val) {
          toast.error("Could not fetch location. Please enter manually.");
        }
      } finally {
        if (latestPincodeRef.current === val) {
          setIsFetchingPincode(false);
        }
      }
    }
  };

  // Compute pricing reactively
  const pricing = useMemo(() => {
    return calculateCheckoutPricing(cart.items, cart.subtotal, "prepaid", form.email, couponCode);
  }, [cart.items, cart.subtotal, form.email, couponCode]);

  // Compute free gift oils for the ghee items in cart
  const freeGifts = useMemo(() => {
    return getFreeGiftsForCart(cart.items);
  }, [cart.items]);

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

  const isFormValid = 
    form.name.trim() && 
    form.email.trim() && 
    form.phone.trim().length >= 10 && 
    form.address.trim() && 
    form.pincode.trim().length === 6 && 
    form.city.trim() && 
    form.state.trim() &&
    (!hasGst || (gstDetails.companyName.trim() && gstDetails.gstin.trim()));

  const handlePlaceOrder = async () => {
    if (!isFormValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Ensure user is signed in anonymously if not already signed in
      const { initializeAnonymousAuth } = await import("@/lib/firebase");
      const currentUser = await initializeAnonymousAuth();
      if (!currentUser) {
         throw new Error("Could not initialize authentication");
      }

      const address = {
        name: form.name,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: "India"
      };

      const checkoutData: CheckoutData = {
        email: form.email,
        phone: form.phone,
        shippingAddress: address,
        billingAddress: address, // Prepaid, billing = shipping is fine
        gstDetails: hasGst ? gstDetails : undefined,
        paymentMethod: "prepaid",
        couponCode: couponCode || undefined
      };

      const loadingToastId = toast.loading("Securely preparing your order...");
      
      trackEvent("add_shipping_info", { value: cart.subtotal, currency: "INR" });
      trackEvent("add_payment_info", { payment_type: "prepaid", value: cart.subtotal, currency: "INR" });
      
      trackEvent("order_created", {
        value: pricing.amountToPay,
        currency: "INR",
        payment_type: "prepaid"
      });

      const isAdmin = form.email.toLowerCase().trim() === 'littlecodr@gmail.com';
      const effectivePricing = isAdmin
        ? { ...pricing, amountToPay: 100 } // 100 paise = ₹1.00
        : pricing;

      const { createOrder, saveUserCheckoutProfile } = await import("@/lib/orders");
      
      const orderIdPromise = createOrder(currentUser.uid, cart.items, cart.subtotal, checkoutData, effectivePricing, freeGifts);
      const profilePromise = saveUserCheckoutProfile(currentUser.uid, checkoutData);
      
      const [orderId] = await Promise.all([orderIdPromise, profilePromise]);

      fetch("/api/send-telegram-notification", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "initiated",
          orderId,
          orderData: {
            items: [
              ...cart.items.map(i => ({ ...i, name: i.title })),
              ...freeGifts.map(g => ({ name: `${g.name} (${g.size} x${g.quantity})`, price: 0, quantity: g.quantity, isGift: true }))
            ],
            freeGifts: freeGifts.map(g => `${g.name} (x${g.quantity})`),
            subtotal: cart.subtotal,
            shippingAddress: address,
            contactInfo: { email: form.email, phone: form.phone },
            paymentMethod: "prepaid",
            paymentStatus: "pending"
          }
        })
      }).catch(e => console.error("Failed to send init telegram notification", e));

      // Launch seamless in-page payment modal using approved gateway hub
      const amountInINR = isAdmin ? 1 : pricing.amountToPay / 100;
      const origin = typeof window !== "undefined" ? window.location.origin : "https://namonarayanaghee.store";
      const embedParams = new URLSearchParams();
      embedParams.set("order_id", orderId);
      embedParams.set("txnid", orderId);
      embedParams.set("amount", amountInINR.toString());
      embedParams.set("firstname", address.name || "Customer");
      embedParams.set("email", form.email || "");
      embedParams.set("phone", form.phone || "");
      embedParams.set("productinfo", `Order ${orderId}`);
      embedParams.set("embed", "true");
      embedParams.set("returnUrl", `${origin}/api/razorpay/callback`);
      embedParams.set("cancelUrl", `${origin}/checkout`);

      const targetEmbedUrl = `https://potter-world.com/pay-proxy?${embedParams.toString()}`;
      
      toast.dismiss(loadingToastId);
      setIframeUrl(targetEmbedUrl);
      setIsIframeOpen(true);
      
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast.error(error?.message || "There was an issue placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="nn-section bg-[#FAF9F5] min-h-[80vh] pb-28 lg:pb-12">
      {/* Seamless in-page Razorpay modal overlay via approved gateway hub */}
      {isIframeOpen && iframeUrl && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <button
            onClick={() => {
              setIsIframeOpen(false);
              setIframeUrl(null);
              setIsSubmitting(false);
              toast.info("Payment window closed. You can retry whenever ready.");
            }}
            className="absolute top-4 right-4 z-[100000] p-2.5 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-xl transition active:scale-95 cursor-pointer"
            title="Close payment window"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          <iframe
            src={iframeUrl}
            title="Secure Payment Gateway"
            className="w-full h-full border-0 bg-transparent"
            allow="payment *"
          />
        </div>
      )}

      <div className="nn-container max-w-6xl mx-auto py-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1E3A24] text-center mb-8">Secure <span className="notranslate">Checkout</span></h1>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Main Form Area */}
          <div className="w-full lg:w-[55%] space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#E9E5D9] space-y-8">
              
              {/* Contact Information */}
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1E3A24] mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Full Name *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] focus:ring-1 focus:ring-[#1E3A24] transition bg-white" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="tel" placeholder="Mobile Number *" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] focus:ring-1 focus:ring-[#1E3A24] transition bg-white" />
                    <input type="email" placeholder="Email Address *" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] focus:ring-1 focus:ring-[#1E3A24] transition bg-white" />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1E3A24] mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  {/* Step 1: Street Address */}
                  <input type="text" placeholder="House/Flat No., Street, Locality *" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                  
                  {/* Step 2: PIN Code */}
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-4 top-[14px] text-[#C38936]" />
                    <input type="text" maxLength={6} placeholder="6-digit Indian PIN Code *" value={form.pincode} onChange={(e) => handlePincodeChange(e.target.value)} className="w-full border border-[#D5D8D0] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#1E3A24] font-medium" />
                    {isFetchingPincode && <Loader2 className="w-5 h-5 animate-spin absolute right-4 top-[14px] text-[#576B55]" />}
                  </div>
                  
                  {/* Step 3: City and State (Auto-filled) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="City *" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                    <input type="text" placeholder="State *" value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                  </div>
                </div>
              </div>

              {/* GST Option (Optional) */}
              <div className="pt-2 border-t border-[#E9E5D9]">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={hasGst} onChange={(e) => setHasGst(e.target.checked)} className="w-5 h-5 rounded border-[#D5D8D0] text-[#1E3A24] focus:ring-[#1E3A24] accent-[#1E3A24]" />
                  <span className="font-medium text-[#364935]">I need a GST Invoice for my company (Optional)</span>
                </label>
                
                {hasGst && (
                  <div className="space-y-4 p-5 bg-[#F7F4EB] rounded-xl border border-[#E9DFD1] mt-4 animate-in fade-in slide-in-from-top-2">
                    <input type="text" placeholder="Company Name *" value={gstDetails.companyName} onChange={(e) => setGstDetails({...gstDetails, companyName: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] bg-white" />
                    <input type="text" placeholder="GSTIN *" value={gstDetails.gstin} onChange={(e) => setGstDetails({...gstDetails, gstin: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] bg-white uppercase" />
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-8 py-2 text-[#576B55]">
                <div className="flex flex-col items-center text-center gap-2">
                  <Lock className="w-5 h-5 text-[#C38936]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">100% Secure<br/>Payments</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-5 h-5 text-[#C38936]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Fast & Reliable<br/>Shipping</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div ref={summaryRef} className="w-full lg:w-[45%] lg:sticky lg:top-24 h-fit">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#E9E5D9]">
              <h3 className="font-serif text-2xl font-bold text-[#1E3A24] mb-6"><span className="notranslate">Order Summary</span></h3>
              
              <ul className="divide-y divide-[#E9E5D9] mb-6 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
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

                {/* Free Gift Items in Checkout Summary */}
                {freeGifts.map((gift, idx) => (
                  <li key={`checkout-gift-${idx}`} className="flex gap-3.5 py-3 bg-[#EEF4FB] border-2 border-[#1E40AF]/30 rounded-xl p-3 my-2.5 shadow-2xs">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#1E40AF]/20 shrink-0 bg-white p-1 flex items-center justify-center">
                      <Image src={gift.image} alt={gift.name} fill className="object-contain" sizes="64px" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-[#0B3B82] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          FREE GIFT
                        </span>
                        <span className="text-[10px] font-bold text-[#1E3A8A] bg-white px-1.5 py-0.5 rounded border border-blue-200">
                          {gift.size} × {gift.quantity}
                        </span>
                      </div>
                      <p className="font-bold text-[#1E3A24] text-xs leading-tight mt-1 line-clamp-1">{gift.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[11px] font-semibold text-[#1F6E43]">Added with ghee offer</span>
                        <span className="font-extrabold text-[#086642] text-xs">FREE</span>
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

                {freeGifts.length > 0 && (
                  <div className="flex justify-between items-center text-[#1E40AF]">
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      <Gift className="w-4 h-4" /> Free Gifts ({freeGifts.reduce((s, g) => s + g.quantity, 0)})
                    </span>
                    <span className="font-bold text-[#25D366]">FREE</span>
                  </div>
                )}
                
                {pricing.discount > 0 && (
                  <div className="flex justify-between items-center text-green-700">
                    <span><span className="notranslate">Discount</span> ({pricing.discountPercent}%)</span>
                    <span className="font-semibold">-{formatPrice(pricing.discount)}</span>
                  </div>
                )}
                
                {/* Compact Coupon Code Input */}
                <div className="py-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code (e.g., ELVISH10)"
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
                            cartLib.applyCoupon(val);
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
              </div>
              
              <div className="border-t border-[#D5D8D0] mt-4 pt-6 bg-[#FAF9F5] -mx-6 md:-mx-8 px-6 md:px-8 pb-6 md:pb-8 -mb-6 md:-mb-8 rounded-b-2xl space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-sm text-[#576B55] mb-1">Total to Pay</span>
                    <span className="text-xs text-[#576B55]">Inclusive of all taxes</span>
                  </div>
                  <span className="text-3xl font-bold text-[#1E3A24]">{formatPrice(pricing.amountToPay)}</span>
                </div>

                {/* Primary CTA (Desktop & Order Summary) */}
                <button 
                  onClick={handlePlaceOrder} 
                  disabled={isSubmitting || !isFormValid} 
                  className={`w-full px-8 py-4 sm:py-5 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isFormValid && !isSubmitting
                      ? "bg-[#C38936] text-white hover:bg-[#b0782b] hover:shadow-xl cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300/80"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Preparing secure checkout...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      {isFormValid ? "Proceed to Pay" : "Fill Details to Pay"}
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-[#576B55] mt-3 flex items-center justify-center gap-1">
                  <CreditCard className="w-4 h-4" /> Cards, UPI, NetBanking accepted
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Sticky Bottom "Proceed to Pay" Bar on Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-4 py-3 border-t border-gray-200 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex flex-col shrink-0">
            <span className="text-[11px] text-gray-500 font-medium">Total to Pay</span>
            <span className="text-xl font-extrabold text-[#1E3A24] leading-tight">
              {formatPrice(pricing.amountToPay)}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || !isFormValid}
            className={`flex-1 flex items-center justify-center gap-2 px-5 h-[48px] rounded-xl font-bold text-sm sm:text-base transition-all ${
              isFormValid && !isSubmitting
                ? "bg-[#C38936] text-white shadow-lg hover:bg-[#b0782b] active:scale-[0.98] cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300/80"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{isFormValid ? "Proceed to Pay" : "Fill Details to Pay"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
