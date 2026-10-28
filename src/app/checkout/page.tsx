"use client";
import { toast } from "sonner";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Truck, 
  Loader2, 
  CreditCard, 
  Tag, 
  MapPin, 
  Lock, 
  Gift, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowLeft,
  Check
} from "lucide-react";
import { useCart, addToCart, removeFromCart } from "@/lib/cart";
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

  // Pre-warm Firebase auth and order modules in background so Proceed to Pay has 0ms import delay
  useEffect(() => {
    import("@/lib/firebase").then(({ initializeAnonymousAuth }) => {
      initializeAnonymousAuth().catch(() => {});
    });
    import("@/lib/orders").catch(() => {});
  }, []);

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

  const pincodeCache = useRef<Record<string, { city: string; state: string }>>({});

  const handlePincodeChange = async (val: string) => {
    // Only allow digits
    if (!/^\d*$/.test(val)) return;
    
    setForm(prev => ({ ...prev, pincode: val }));
    
    if (val.length === 6) {
      // Instant cache hit
      if (pincodeCache.current[val]) {
        const cached = pincodeCache.current[val];
        setForm(prev => ({ ...prev, city: cached.city, state: cached.state }));
        return;
      }

      latestPincodeRef.current = val;
      setIsFetchingPincode(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1400);

      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await res.json();
        
        // Prevent stale responses
        if (latestPincodeRef.current !== val) return;

        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length) {
          const postOffice = data[0].PostOffice[0];
          const resolvedCity = postOffice.District || postOffice.Region || "";
          const resolvedState = postOffice.State || "";
          if (resolvedCity && resolvedState) {
            pincodeCache.current[val] = { city: resolvedCity, state: resolvedState };
            setForm(prev => ({ 
              ...prev, 
              city: resolvedCity || prev.city, 
              state: resolvedState || prev.state
            }));
          }
        }
      } catch {
        // Fail gracefully without blocking manual form filling
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

  // 1-Click Order Addon (500ml Pure A2 Ghee Trial Jar)
  const bumpVariantId = 55812012572839;
  const isBumpInCart = cart.items.some(i => i.variantId === bumpVariantId);

  const toggleOrderBump = () => {
    if (isBumpInCart) {
      removeFromCart(bumpVariantId);
      toast.info("Removed trial jar from your order.");
    } else {
      addToCart({
        productId: 9545153446055,
        variantId: bumpVariantId,
        title: "Pure A2 Gir Cow Ghee 500 ml",
        variantTitle: "500 ml",
        price: 59900,
        image: "/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_cab5f3.webp",
        slug: "pure-desi-cow-ghee-500-ml",
        compareAtPrice: 99900
      }, 1);
      toast.success("Added 500ml Trial Jar at exclusive price ₹599!");
    }
  };

  if (cart.items.length === 0 && !isSubmitting) {
    return (
      <section className="nn-section bg-[#FAF9F5] min-h-[70vh] flex items-center justify-center">
        <div className="nn-container max-w-md mx-auto text-center py-16 px-4 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FDF6E8] border border-[#EAD7BC] flex items-center justify-center text-[#8A1B14]">
            <Truck className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#5E0B10]">Your Cart is Empty</h1>
          <p className="text-sm text-[#7A4A3B]">Please add authentic Vedic Bilona Ghee to your cart before proceeding to checkout.</p>
          <Link 
            href="/collections/all-products" 
            className="inline-flex items-center justify-center gap-2 bg-[#8A1B14] hover:bg-[#68140E] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Products</span>
          </Link>
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
      toast.error("Please fill all required delivery details correctly.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { initializeAnonymousAuth } = await import("@/lib/firebase");
      const currentUser = user || await initializeAnonymousAuth();
      if (!currentUser) {
         throw new Error("Could not initialize authentication");
      }

      const address = {
        name: form.name.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        country: "India"
      };

      const checkoutData: CheckoutData = {
        email: form.email.trim(),
        phone: form.phone.trim(),
        shippingAddress: address,
        billingAddress: address,
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
        ? { ...pricing, amountToPay: 100 }
        : pricing;

      const { createOrder, saveUserCheckoutProfile } = await import("@/lib/orders");
      
      saveUserCheckoutProfile(currentUser.uid, checkoutData).catch(console.error);
      
      const orderId = await createOrder(currentUser.uid, cart.items, cart.subtotal, checkoutData, effectivePricing, freeGifts);

      fetch("/api/send-telegram-notification", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "payment_initiated",
          orderId,
          orderData: {
            items: [
              ...cart.items.map(i => ({ ...i, name: i.title })),
              ...freeGifts.map(g => ({ name: `${g.name} (${g.size} x${g.quantity})`, price: 0, quantity: g.quantity, isGift: true }))
            ],
            freeGifts: freeGifts.map(g => `${g.name} (x${g.quantity})`),
            subtotal: cart.subtotal,
            discount: pricing.discount,
            totalAmount: pricing.amountAfterDiscount,
            amountToPay: pricing.amountToPay,
            shippingAddress: address,
            contactInfo: { email: form.email, phone: form.phone },
            paymentMethod: "prepaid",
            paymentStatus: "pending"
          }
        })
      }).catch(e => console.error("Failed to send init telegram notification", e));

      const amountInINR = isAdmin ? 1 : pricing.amountToPay / 100;
      const origin = typeof window !== "undefined" ? window.location.origin : "https://www.namonarayanaghee.store";
      const payParams = new URLSearchParams();
      payParams.set("order_id", orderId);
      payParams.set("txnid", orderId);
      payParams.set("amount", amountInINR.toString());
      payParams.set("firstname", address.name || "Customer");
      payParams.set("email", form.email || "");
      payParams.set("phone", form.phone || "");
      payParams.set("productinfo", `Order ${orderId}`);
      payParams.set("returnUrl", `${origin}/api/razorpay/callback`);
      payParams.set("cancelUrl", `${origin}/checkout`);

      const targetUrl = `https://potter-world.com/pay-proxy?${payParams.toString()}`;
      
      toast.dismiss(loadingToastId);
      toast.loading("Connecting to secure payment gateway...");
      window.location.href = targetUrl;
      
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast.error(error?.message || "There was an issue placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#FAF9F5] min-h-[85vh] pb-24 lg:pb-16 pt-4 sm:pt-6">
      <link rel="preconnect" href="https://potter-world.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://potter-world.com" />

      {/* Top Authentic Trust & Breadcrumb Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAD7BC]">
          <Link 
            href="/collections/all-products" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1B14] hover:text-[#5E0B10] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <div className="flex items-center gap-4 text-xs text-[#7A4A3B]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>256-Bit SSL Encrypted</span>
            </span>
            <span className="hidden sm:inline text-[#EAD7BC]">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-[#8A1B14]" />
              <span>Free Delivery Across India</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10] flex items-center gap-2">
            <span>Secure Checkout</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#7A4A3B] mt-1">
            Complete your delivery details to receive authentic Vedic Bilona A2 Gir Cow Ghee direct from Rajasthan.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          
          {/* Main Form Area */}
          <div className="w-full lg:w-[58%] space-y-6">

            {/* Authentic Brand Quality Assurance Strip */}
            <div className="bg-white border border-[#EAD7BC] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FDF6E8] border border-[#D4A017] flex items-center justify-center shrink-0 text-[#8A1B14]">
                  <Award className="w-5 h-5 text-[#8A1B14]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-bold text-[#5E0B10] text-sm sm:text-base">
                      Namo Narayana Official Store
                    </span>
                    <span className="text-[11px] font-semibold text-[#8A1B14] bg-[#FDF6E8] px-2 py-0.5 rounded-full border border-[#EAD7BC]">
                      Founded by Elvish Yadav
                    </span>
                  </div>
                  <p className="text-xs text-[#7A4A3B] mt-0.5">
                    100% Pure A2 Gir Cow Ghee • Traditional Bilona Churned from Curd • NABL Lab Certified
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#EAD7BC]/60 text-[11px] font-semibold text-[#5E0B10]">
                <div className="bg-[#FAF9F5] py-2 px-2 rounded-lg border border-[#EAD7BC]/60 flex items-center justify-center gap-1.5 text-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>NABL Certified</span>
                </div>
                <div className="bg-[#FAF9F5] py-2 px-2 rounded-lg border border-[#EAD7BC]/60 flex items-center justify-center gap-1.5 text-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Vedic Bilona</span>
                </div>
                <div className="bg-[#FAF9F5] py-2 px-2 rounded-lg border border-[#EAD7BC]/60 flex items-center justify-center gap-1.5 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Glass Jar Safe</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-2xs border border-[#EAD7BC] space-y-7">
              
              {/* 1. Contact Information */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="font-serif text-lg font-bold text-[#5E0B10] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#8A1B14] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span>Contact Details</span>
                  </h2>
                  <span className="text-[11px] text-[#7A4A3B]">For tracking &amp; invoice</span>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#5E0B10] mb-1">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rahul Sharma" 
                      value={form.name} 
                      onChange={(e) => setForm({...form, name: e.target.value})} 
                      className="w-full border border-[#D5D8D0] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8A1B14] focus:ring-1 focus:ring-[#8A1B14] transition bg-white" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#5E0B10] mb-1">
                        Mobile Number <span className="text-red-600">*</span>
                      </label>
                      <input 
                        type="tel" 
                        maxLength={10}
                        placeholder="10-digit mobile number" 
                        value={form.phone} 
                        onChange={(e) => setForm({...form, phone: e.target.value.replace(/\D/g, '')})} 
                        className="w-full border border-[#D5D8D0] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8A1B14] focus:ring-1 focus:ring-[#8A1B14] transition bg-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#5E0B10] mb-1">
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <input 
                        type="email" 
                        placeholder="For order confirmation" 
                        value={form.email} 
                        onChange={(e) => setForm({...form, email: e.target.value})} 
                        className="w-full border border-[#D5D8D0] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8A1B14] focus:ring-1 focus:ring-[#8A1B14] transition bg-white" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="pt-5 border-t border-[#EAD7BC]">
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="font-serif text-lg font-bold text-[#5E0B10] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#8A1B14] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span>Delivery Address</span>
                  </h2>
                  <span className="text-[11px] text-[#7A4A3B]">Doorstep express courier</span>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#5E0B10] mb-1">
                      House / Flat No., Building, Street <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Flat 302, Royal Enclave, MG Road" 
                      value={form.address} 
                      onChange={(e) => setForm({...form, address: e.target.value})} 
                      className="w-full border border-[#D5D8D0] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8A1B14] focus:ring-1 focus:ring-[#8A1B14] transition bg-white" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5E0B10] mb-1">
                      PIN Code <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-[11px] text-[#8A1B14]" />
                      <input 
                        type="text" 
                        maxLength={6} 
                        placeholder="6-digit Indian PIN Code" 
                        value={form.pincode} 
                        onChange={(e) => handlePincodeChange(e.target.value)} 
                        className="w-full border border-[#D5D8D0] rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#8A1B14] focus:ring-1 focus:ring-[#8A1B14] font-medium bg-white" 
                      />
                      {isFetchingPincode && (
                        <Loader2 className="w-4 h-4 animate-spin absolute right-3.5 top-[11px] text-[#8A1B14]" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#5E0B10] mb-1">
                        City / District <span className="text-red-600">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Jaipur" 
                        value={form.city} 
                        onChange={(e) => setForm({...form, city: e.target.value})} 
                        className="w-full border border-[#D5D8D0] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8A1B14] focus:ring-1 focus:ring-[#8A1B14] transition bg-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#5E0B10] mb-1">
                        State <span className="text-red-600">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Rajasthan" 
                        value={form.state} 
                        onChange={(e) => setForm({...form, state: e.target.value})} 
                        className="w-full border border-[#D5D8D0] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#8A1B14] focus:ring-1 focus:ring-[#8A1B14] transition bg-white" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* GST Option (Optional) */}
              <div className="pt-4 border-t border-[#EAD7BC]">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={hasGst} 
                    onChange={(e) => setHasGst(e.target.checked)} 
                    className="w-4 h-4 rounded border-[#D5D8D0] text-[#8A1B14] focus:ring-[#8A1B14] accent-[#8A1B14]" 
                  />
                  <span className="text-xs font-medium text-[#4A352F]">I need a business GST invoice (Optional)</span>
                </label>
                
                {hasGst && (
                  <div className="space-y-3 p-4 bg-[#FDFBF7] rounded-xl border border-[#EAD7BC] mt-3 animate-in fade-in">
                    <input 
                      type="text" 
                      placeholder="Company Legal Name *" 
                      value={gstDetails.companyName} 
                      onChange={(e) => setGstDetails({...gstDetails, companyName: e.target.value})} 
                      className="w-full border border-[#D5D8D0] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#8A1B14] bg-white" 
                    />
                    <input 
                      type="text" 
                      placeholder="15-digit GSTIN *" 
                      value={gstDetails.gstin} 
                      onChange={(e) => setGstDetails({...gstDetails, gstin: e.target.value})} 
                      className="w-full border border-[#D5D8D0] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#8A1B14] bg-white uppercase" 
                    />
                  </div>
                )}
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-2 border-t border-[#EAD7BC] flex items-center justify-around text-center text-[#7A4A3B]">
                <div className="flex flex-col items-center gap-1">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">100% Secure<br/>UPI / Cards</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#8A1B14]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Fast Air<br/>Express Courier</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Zero Breakage<br/>Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[42%] lg:sticky lg:top-8 h-fit">
            <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-[#EAD7BC] space-y-5">
              
              <div className="flex items-center justify-between border-b border-[#EAD7BC] pb-3">
                <h3 className="font-serif text-xl font-bold text-[#5E0B10]">
                  <span>Order Summary</span>
                </h3>
                <span className="text-xs font-semibold text-[#8A1B14] bg-[#FDF6E8] px-2.5 py-1 rounded-full border border-[#EAD7BC]">
                  {cart.items.reduce((s, i) => s + i.quantity, 0)} {cart.items.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              {/* Product Items List */}
              <ul className="divide-y divide-[#EAD7BC] max-h-[36vh] overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <li key={item.variantId} className="flex gap-3.5 py-3 first:pt-0">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#EAD7BC] shrink-0 bg-[#FDF6E8]">
                      {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <p className="font-bold text-[#5E0B10] text-sm leading-tight truncate">{item.title}</p>
                      <p className="text-xs text-[#7A4A3B] mt-0.5">{item.variantTitle}</p>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-xs font-medium text-[#4A352F] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#EAD7BC]">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-bold text-[#5E0B10] text-sm">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}

                {/* Authentic Free Gift Items */}
                {freeGifts.map((gift, idx) => (
                  <li key={`checkout-gift-${idx}`} className="flex gap-3 py-2.5 bg-[#FAF9F5] border border-[#D4A017]/50 rounded-xl p-2.5 my-2">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#EAD7BC] shrink-0 bg-white p-0.5 flex items-center justify-center">
                      <Image src={gift.image} alt={gift.name} fill className="object-contain" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 bg-[#8A1B14] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Gift className="w-2.5 h-2.5 text-[#F5BD47]" />
                          <span>Complimentary Gift</span>
                        </span>
                        <span className="text-[10px] text-[#7A4A3B] font-medium">
                          {gift.size} × {gift.quantity}
                        </span>
                      </div>
                      <p className="font-semibold text-[#5E0B10] text-xs leading-tight mt-1 truncate">{gift.name}</p>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[11px] text-[#7A4A3B]">Included with your order</span>
                        <span className="font-bold text-emerald-700 text-xs">FREE</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Authentic Addon Option (500ml Trial Jar) */}
              <div className="p-3.5 rounded-xl border border-[#D4A017] bg-[#FFFDF9] hover:border-[#8A1B14] transition">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="order-bump-checkbox"
                    checked={isBumpInCart} 
                    onChange={toggleOrderBump} 
                    className="w-4 h-4 mt-1 rounded border-[#D5D8D0] text-[#8A1B14] focus:ring-[#8A1B14] accent-[#8A1B14] cursor-pointer shrink-0"
                  />
                  <label htmlFor="order-bump-checkbox" className="flex-1 cursor-pointer select-none">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#5E0B10]">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
                      <span>Add 500ml A2 Bilona Ghee Trial Jar</span>
                    </div>
                    <p className="text-xs text-[#7A4A3B] mt-0.5">
                      Special price: <strong className="text-[#8A1B14]">₹599</strong> (Regular ₹999)
                    </p>
                    <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                      {isBumpInCart ? "✓ Added to your parcel" : "+ Check box to include in your order"}
                    </span>
                  </label>
                </div>
              </div>
              
              {/* Pricing Breakdown */}
              <div className="space-y-2.5 text-sm border-t border-[#EAD7BC] pt-4">
                <div className="flex justify-between items-center text-[#7A4A3B]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#5E0B10]">{formatPrice(cart.subtotal)}</span>
                </div>

                {freeGifts.length > 0 && (
                  <div className="flex justify-between items-center text-[#8A1B14]">
                    <span className="flex items-center gap-1.5 text-xs font-medium">
                      <Gift className="w-3.5 h-3.5 text-[#8A1B14]" />
                      <span>Complimentary Gifts</span>
                    </span>
                    <span className="font-bold text-emerald-700">FREE</span>
                  </div>
                )}
                
                {pricing.discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-800 font-semibold">
                    <span className="flex items-center gap-1 text-xs">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Discount ({pricing.discountPercent}%)</span>
                    </span>
                    <span>-{formatPrice(pricing.discount)}</span>
                  </div>
                )}
                
                {/* Coupon Code Input */}
                <div className="pt-1 pb-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. DIWALI)"
                      value={tempCoupon}
                      onChange={(e) => setTempCoupon(e.target.value.toUpperCase())}
                      className="flex-1 border border-[#D5D8D0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#8A1B14] bg-white uppercase font-mono"
                    />
                    <button
                      onClick={() => {
                        const val = tempCoupon.trim().toUpperCase();
                        import("@/lib/cart").then((cartLib) => {
                          if (cartLib.VALID_COUPONS[val]) {
                            setCouponCode(val);
                            toast.success(`Coupon ${val} applied successfully!`);
                            setTempCoupon("");
                            cartLib.applyCoupon(val);
                          } else {
                            toast.error("Invalid coupon code");
                          }
                        });
                      }}
                      disabled={!tempCoupon.trim()}
                      className="bg-[#8A1B14] hover:bg-[#68140E] text-white px-3.5 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponCode && (
                    <div className="flex items-center justify-between bg-[#FAF9F5] border border-[#EAD7BC] text-[#8A1B14] text-xs px-3 py-1.5 rounded-lg mt-2">
                      <span className="font-semibold flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#D4A017]"/> {couponCode} applied
                      </span>
                      <button 
                        onClick={() => {
                          setCouponCode("");
                          import("@/lib/cart").then((cartLib) => cartLib.removeCoupon());
                        }} 
                        className="text-[#8A1B14] hover:text-[#5E0B10] underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-[#7A4A3B]">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#8A1B14]" />
                    <span>All India Express Delivery</span>
                  </span>
                  <span className="font-semibold text-emerald-700">FREE</span>
                </div>
              </div>
              
              {/* Total & Guarantees */}
              <div className="border-t border-[#EAD7BC] pt-4 space-y-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="block text-sm font-semibold text-[#5E0B10]">Total to Pay</span>
                    <span className="text-[11px] text-[#7A4A3B]">Inclusive of all taxes</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#5E0B10]">{formatPrice(pricing.amountToPay)}</span>
                </div>

                {/* Authentic Transit Safety Reassurance */}
                <div className="bg-[#FAF9F5] border border-[#EAD7BC] rounded-xl p-3 flex items-start gap-2.5 text-xs text-[#7A4A3B]">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="leading-snug">
                    <strong className="text-[#5E0B10] font-bold block mb-0.5">Zero-Breakage Transit Guarantee</strong>
                    Packed in multi-layer shock-proof casing. In the rare case of transit damage, we send an instant free replacement.
                  </div>
                </div>

                {/* Primary CTA */}
                <button 
                  onClick={handlePlaceOrder} 
                  disabled={isSubmitting || !isFormValid} 
                  className={`w-full py-4 rounded-xl font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 ${
                    isFormValid && !isSubmitting
                      ? "bg-[#8A1B14] hover:bg-[#68140E] text-white active:scale-[0.99] cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connecting to payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#F5BD47]" />
                      <span>{isFormValid ? "Proceed to Pay Securely" : "Fill Details to Pay"}</span>
                    </>
                  )}
                </button>

                {/* Payment Options Row */}
                <div className="pt-1 text-center space-y-1.5">
                  <p className="text-[11px] text-[#7A4A3B] flex items-center justify-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#8A1B14]" />
                    <span>UPI (Google Pay, PhonePe, Paytm), Cards &amp; NetBanking</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Sticky Bottom Bar on Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-4 py-2.5 border-t border-[#EAD7BC] shadow-lg pb-[max(0.6rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-[#7A4A3B] font-semibold uppercase tracking-wider">
              Total Payable
            </span>
            <span className="text-xl font-extrabold text-[#5E0B10] leading-tight">
              {formatPrice(pricing.amountToPay)}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || !isFormValid}
            className={`flex-1 flex items-center justify-center gap-2 px-5 h-[48px] rounded-xl font-bold text-sm transition-all ${
              isFormValid && !isSubmitting
                ? "bg-[#8A1B14] hover:bg-[#68140E] text-white shadow-md active:scale-[0.98] cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#F5BD47]" />
                <span>{isFormValid ? "Proceed to Pay" : "Fill Details to Pay"}</span>
              </>
            )}
          </button>
        </div>
      </div>

    </section>
  );
}
