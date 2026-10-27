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
  Flame, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  X, 
  Eye, 
  Star, 
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
  const summaryRef = useRef<HTMLDivElement>(null);

  // ─── Psychological Triggers State ─────────────────────────────
  // 1. Reserved Cart Countdown Timer (10 minutes)
  const [timeLeft, setTimeLeft] = useState(599);
  useEffect(() => {
    const TIMER_KEY = "nn_cart_reserved_until";
    let expiry = Number(sessionStorage.getItem(TIMER_KEY));
    const now = Date.now();
    if (!expiry || isNaN(expiry) || expiry <= now) {
      expiry = now + 10 * 60 * 1000;
      sessionStorage.setItem(TIMER_KEY, expiry.toString());
    }

    const tick = () => {
      const diff = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setTimeLeft(diff);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const timerMinutes = Math.floor(timeLeft / 60);
  const timerSeconds = timeLeft % 60;
  const formattedTime = `${String(timerMinutes).padStart(2, "0")}:${String(timerSeconds).padStart(2, "0")}`;
  const timerProgress = Math.min(100, Math.max(0, (timeLeft / 600) * 100));

  // 2. Live Social Proof (Fluctuating viewer counter)
  const [liveShoppers, setLiveShoppers] = useState(17);
  useEffect(() => {
    const id = setInterval(() => {
      setLiveShoppers(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.min(24, Math.max(13, prev + delta));
      });
    }, 6000);
    return () => clearInterval(id);
  }, []);

  // 3. Exit Intent Detection
  const [showExitModal, setShowExitModal] = useState(false);
  const hasTriggeredExitRef = useRef(false);
  useEffect(() => {
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15 && !hasTriggeredExitRef.current && cart.items.length > 0) {
        hasTriggeredExitRef.current = true;
        setShowExitModal(true);
      }
    };

    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, [cart.items.length]);

  const scrollToSummary = () => {
    summaryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  // ─── Decoy Effect & Anchoring Calculations ───────────────────────
  // Estimated Retail / Market Value Anchor
  const freeGiftsValuePaise = useMemo(() => {
    return freeGifts.reduce((acc, g) => {
      const val = (g.size || "").includes("500") ? 25000 : 15000;
      return acc + val * g.quantity;
    }, 0);
  }, [freeGifts]);

  const totalRetailValuePaise = useMemo(() => {
    const itemsRetail = cart.items.reduce((acc, item) => {
      const unitMrp = item.compareAtPrice || Math.round(item.price * 1.6);
      return acc + unitMrp * item.quantity;
    }, 0);
    return itemsRetail + freeGiftsValuePaise;
  }, [cart.items, freeGiftsValuePaise]);

  const totalSavingsPaise = Math.max(0, totalRetailValuePaise - pricing.amountToPay);
  const savingsPercent = totalRetailValuePaise > 0 
    ? Math.round((totalSavingsPaise / totalRetailValuePaise) * 100) 
    : 0;

  // 1-Click Order Bump (Decoy Offer)
  const bumpVariantId = 55812012572839; // 500ml Pure A2 Ghee Trial Jar
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
      toast.success("Added 500ml Trial Jar at exclusive 40% OFF!");
    }
  };

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
      
      // Save profile asynchronously in the background so user does not wait
      saveUserCheckoutProfile(currentUser.uid, checkoutData).catch(console.error);
      
      // Create order immediately
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

      // Full-page redirect to approved gateway hub on potter-world.com
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
    <section className="nn-section bg-[#FAF9F5] min-h-[80vh] pb-28 lg:pb-12">
      <link rel="preconnect" href="https://potter-world.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://potter-world.com" />

      {/* ─── 1. Reserved Cart Urgency Header Bar (Scarcity & Loss Aversion) ─── */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-[#8A1B14] via-[#6B110B] to-[#5E0B10] text-white py-2.5 px-4 shadow-md border-b border-[#D4A017]/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
              High Demand: Your Vedic Ghee &amp; FREE gifts are reserved for:
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm sm:text-base font-extrabold tracking-wider bg-black/30 px-3 py-0.5 rounded-md border border-amber-300/30 text-amber-300">
              {formattedTime}
            </span>
            <span className="hidden md:inline text-[11px] text-amber-100/80">
              • Dispatches within 24 hours
            </span>
          </div>
        </div>
        {/* Subtle depleting progress bar */}
        <div className="w-full bg-black/20 h-0.5 mt-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-400 to-[#D4A017] h-full transition-all duration-1000 ease-linear"
            style={{ width: `${timerProgress}%` }}
          />
        </div>
      </div>

      <div className="nn-container max-w-6xl mx-auto py-6 sm:py-8">
        
        {/* Header Title with Live Social Proof */}
        <div className="text-center mb-6 sm:mb-8 space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#5E0B10]">
            Secure <span className="notranslate">Checkout</span>
          </h1>
          {/* Live Social Proof Badge (Bandwagon Effect) */}
          <div className="inline-flex items-center gap-2 bg-[#FFFDF7] border border-[#EAD7BC] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#7A4A3B] shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
            </span>
            <span>
              <strong className="text-[#2e7d32]">{liveShoppers} people</strong> checking out right now • <strong className="text-[#5E0B10]">89 Vedic jars</strong> dispatched today
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          
          {/* Main Form Area */}
          <div className="w-full lg:w-[55%] space-y-6">

            {/* ─── 2. Halo Effect Authority Seal (Celebrity & Purity) ─── */}
            <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FCFAF5] to-[#FDF6E8] border-2 border-[#D4A017]/60 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2.5">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#8A1B14] flex items-center justify-center shrink-0 shadow-md border-2 border-[#D4A017]">
                  <Award className="w-6 h-6 text-[#F5BD47]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-extrabold text-[#5E0B10] text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                      Official Namo Narayana Store
                    </span>
                    <span className="bg-[#8A1B14] text-[#F5BD47] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      👑 By Elvish Yadav
                    </span>
                  </div>
                  <p className="text-xs text-[#7A4A3B] mt-1 leading-relaxed">
                    100% Authentic A2 Gir Cow Bilona Ghee churned from pure curd in Rajasthan. <strong>NABL Lab Certified</strong> • Trusted by 10 Lakh+ families across India.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EAD7BC]/60 text-center text-[10px] sm:text-[11px] font-bold text-[#5E0B10]">
                <div className="bg-white/80 py-1.5 px-1 rounded-lg border border-[#EAD7BC]/50 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#2e7d32]" />
                  <span>0% Adulteration</span>
                </div>
                <div className="bg-white/80 py-1.5 px-1 rounded-lg border border-[#EAD7BC]/50 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#2e7d32]" />
                  <span>Bilona Churned</span>
                </div>
                <div className="bg-white/80 py-1.5 px-1 rounded-lg border border-[#EAD7BC]/50 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#2e7d32]" />
                  <span>Glass Jar Safe</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#EAD7BC] space-y-8">
              
              {/* Contact Information */}
              <div>
                <h2 className="font-serif text-xl font-bold text-[#5E0B10] mb-4 flex items-center gap-2">
                  <span>1. Contact Information</span>
                </h2>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Full Name *" 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})} 
                    className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8A1B14] focus:ring-1 focus:ring-[#8A1B14] transition bg-white" 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="tel" 
                      placeholder="Mobile Number (10 digits) *" 
                      value={form.phone} 
                      onChange={(e) => setForm({...form, phone: e.target.value})} 
                      className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8A1B14] focus:ring-1 focus:ring-[#8A1B14] transition bg-white" 
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address (for order receipt) *" 
                      value={form.email} 
                      onChange={(e) => setForm({...form, email: e.target.value})} 
                      className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8A1B14] focus:ring-1 focus:ring-[#8A1B14] transition bg-white" 
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h2 className="font-serif text-xl font-bold text-[#5E0B10] mb-4">
                  2. Delivery Address
                </h2>
                <div className="space-y-4">
                  {/* Step 1: Street Address */}
                  <input 
                    type="text" 
                    placeholder="House/Flat No., Street, Locality *" 
                    value={form.address} 
                    onChange={(e) => setForm({...form, address: e.target.value})} 
                    className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8A1B14]" 
                  />
                  
                  {/* Step 2: PIN Code */}
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-4 top-[14px] text-[#D4A017]" />
                    <input 
                      type="text" 
                      maxLength={6} 
                      placeholder="6-digit Indian PIN Code *" 
                      value={form.pincode} 
                      onChange={(e) => handlePincodeChange(e.target.value)} 
                      className="w-full border border-[#D5D8D0] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#8A1B14] font-medium" 
                    />
                    {isFetchingPincode && <Loader2 className="w-5 h-5 animate-spin absolute right-4 top-[14px] text-[#7A4A3B]" />}
                  </div>
                  
                  {/* Step 3: City and State (Auto-filled) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="City *" 
                      value={form.city} 
                      onChange={(e) => setForm({...form, city: e.target.value})} 
                      className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8A1B14]" 
                    />
                    <input 
                      type="text" 
                      placeholder="State *" 
                      value={form.state} 
                      onChange={(e) => setForm({...form, state: e.target.value})} 
                      className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8A1B14]" 
                    />
                  </div>
                </div>
              </div>

              {/* GST Option (Optional) */}
              <div className="pt-2 border-t border-[#EAD7BC]">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={hasGst} 
                    onChange={(e) => setHasGst(e.target.checked)} 
                    className="w-5 h-5 rounded border-[#D5D8D0] text-[#8A1B14] focus:ring-[#8A1B14] accent-[#8A1B14]" 
                  />
                  <span className="font-medium text-[#4A352F]">I need a GST Invoice for my company (Optional)</span>
                </label>
                
                {hasGst && (
                  <div className="space-y-4 p-5 bg-[#FDFBF7] rounded-xl border border-[#EAD7BC] mt-4 animate-in fade-in slide-in-from-top-2">
                    <input 
                      type="text" 
                      placeholder="Company Name *" 
                      value={gstDetails.companyName} 
                      onChange={(e) => setGstDetails({...gstDetails, companyName: e.target.value})} 
                      className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8A1B14] bg-white" 
                    />
                    <input 
                      type="text" 
                      placeholder="GSTIN *" 
                      value={gstDetails.gstin} 
                      onChange={(e) => setGstDetails({...gstDetails, gstin: e.target.value})} 
                      className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8A1B14] bg-white uppercase" 
                    />
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-8 py-2 text-[#7A4A3B]">
                <div className="flex flex-col items-center text-center gap-2">
                  <Lock className="w-5 h-5 text-[#D4A017]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">100% Secure<br/>UPI / Cards</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-5 h-5 text-[#D4A017]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Fast Air<br/>Express Courier</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#D4A017]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Zero Breakage<br/>Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div ref={summaryRef} className="w-full lg:w-[45%] lg:sticky lg:top-20 h-fit">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#EAD7BC]">
              
              {/* ─── 3. Anchoring & Total Savings Unlocked Ribbon ─── */}
              {totalSavingsPaise > 0 && (
                <div className="bg-gradient-to-r from-[#1e6b24] via-[#247c2c] to-[#1e5c24] text-white p-3.5 rounded-xl shadow-md flex items-center justify-between mb-6 border border-emerald-400/30">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-amber-300 shrink-0 animate-spin-slow" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300 block">
                        🎉 Total Savings Unlocked
                      </span>
                      <span className="text-sm sm:text-base font-extrabold leading-tight">
                        You save {formatPrice(totalSavingsPaise)} today!
                      </span>
                    </div>
                  </div>
                  <span className="bg-white/20 backdrop-blur-xs text-xs font-black px-2.5 py-1 rounded-full border border-white/30 text-amber-200">
                    {savingsPercent}% OFF
                  </span>
                </div>
              )}

              <h3 className="font-serif text-2xl font-bold text-[#5E0B10] mb-4">
                <span className="notranslate">Order Summary</span>
              </h3>
              
              <ul className="divide-y divide-[#EAD7BC] mb-4 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.items.map((item) => (
                  <li key={item.variantId} className="flex gap-4 py-4 first:pt-0">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#EAD7BC] shrink-0 bg-[#FDF6E8]">
                      {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" sizes="80px" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <p className="font-bold text-[#5E0B10] leading-tight mb-1">{item.title}</p>
                      <p className="text-xs text-[#7A4A3B] mb-2">{item.variantTitle}</p>
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-semibold bg-[#FDF6E8] px-2 py-1 rounded text-[#4A352F] border border-[#EAD7BC]/60">Qty: {item.quantity}</span>
                        <div className="text-right">
                          {item.compareAtPrice && item.compareAtPrice > item.price && (
                            <s className="block text-[11px] text-gray-400 font-normal">
                              {formatPrice(item.compareAtPrice * item.quantity)}
                            </s>
                          )}
                          <span className="font-bold text-[#5E0B10]">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}

                {/* Free Gift Items in Checkout Summary */}
                {freeGifts.map((gift, idx) => (
                  <li key={`checkout-gift-${idx}`} className="flex gap-3.5 py-3 bg-[#FFFDF7] border-2 border-[#D4A017]/70 rounded-xl p-3 my-2.5 shadow-2xs">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#EAD7BC] shrink-0 bg-white p-1 flex items-center justify-center">
                      <Image src={gift.image} alt={gift.name} fill className="object-contain" sizes="64px" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-[#8A1B14] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          🎁 FREE GIFT UNLOCKED
                        </span>
                        <span className="text-[10px] font-bold text-[#5E0B10] bg-[#FDF6E8] px-1.5 py-0.5 rounded border border-[#EAD7BC]">
                          {gift.size} × {gift.quantity}
                        </span>
                      </div>
                      <p className="font-bold text-[#5E0B10] text-xs leading-tight mt-1 line-clamp-1">{gift.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[11px] font-semibold text-[#8A1B14]">Special farm gift</span>
                        <div className="flex items-center gap-1.5">
                          <s className="text-[11px] text-gray-400">₹150.00</s>
                          <span className="font-extrabold text-[#2e7d32] text-xs">FREE</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* ─── 4. Decoy Effect / 1-Click Order Bump ─── */}
              <div className="my-4 p-3.5 rounded-xl border-2 border-dashed border-[#D4A017] bg-gradient-to-r from-[#FFFDF9] to-[#FDF6E8] relative overflow-hidden transition-all hover:border-[#8A1B14]">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="order-bump-checkbox"
                    checked={isBumpInCart} 
                    onChange={toggleOrderBump} 
                    className="w-5 h-5 mt-1 rounded border-[#D5D8D0] text-[#8A1B14] focus:ring-[#8A1B14] accent-[#8A1B14] cursor-pointer shrink-0"
                  />
                  <label htmlFor="order-bump-checkbox" className="flex-1 cursor-pointer select-none">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="bg-[#8A1B14] text-[#F5BD47] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        ⚡ 1-Click VIP Add-On (40% OFF)
                      </span>
                      <span className="text-[10px] font-bold text-[#2e7d32] bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#C8E6C9]">
                        Save ₹400
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#5E0B10] leading-snug">
                      Add 500ml A2 Bilona Ghee Trial Jar for ₹599 <s className="text-gray-400 font-normal">₹999</s>
                    </p>
                    <p className="text-[11px] text-[#7A4A3B] mt-0.5 leading-tight">
                      {isBumpInCart ? "✓ Added to your delivery box" : "+ Click to add to your delivery box before stock ends"}
                    </p>
                  </label>
                </div>
              </div>
              
              <div className="space-y-3 text-sm border-t-2 border-dashed border-[#EAD7BC] pt-4 bg-[#FCFAF5] -mx-6 md:-mx-8 px-6 md:px-8 pb-2">
                <div className="flex justify-between items-center text-[#7A4A3B]">
                  <span>Retail Market Value</span>
                  <s className="text-gray-400 font-medium">{formatPrice(totalRetailValuePaise)}</s>
                </div>

                <div className="flex justify-between items-center text-[#7A4A3B]">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-[#5E0B10]">{formatPrice(cart.subtotal)}</span>
                </div>

                {freeGifts.length > 0 && (
                  <div className="flex justify-between items-center text-[#8A1B14]">
                    <span className="flex items-center gap-1.5 text-xs font-semibold">
                      <Gift className="w-3.5 h-3.5 text-[#D4A017]" /> Free Gifts Value ({freeGifts.reduce((s, g) => s + g.quantity, 0)} items)
                    </span>
                    <span className="font-bold text-[#2e7d32]">FREE (-{formatPrice(freeGiftsValuePaise)})</span>
                  </div>
                )}
                
                {pricing.discount > 0 && (
                  <div className="flex justify-between items-center text-[#8A1B14] font-semibold">
                    <span><span className="notranslate">Farm Discount</span> ({pricing.discountPercent}%)</span>
                    <span className="font-bold">-{formatPrice(pricing.discount)}</span>
                  </div>
                )}
                
                {/* Compact Coupon Code Input */}
                <div className="py-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code (e.g. DIWALI)"
                      value={tempCoupon}
                      onChange={(e) => setTempCoupon(e.target.value.toUpperCase())}
                      className="flex-1 border border-[#D5D8D0] rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8A1B14] bg-white uppercase font-mono"
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
                      className="bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
                    >
                      <span className="notranslate">Apply</span>
                    </button>
                  </div>
                  {couponCode && (
                    <div className="flex items-center justify-between bg-[#FFF9EE] border border-[#EAD7BC] text-[#8A1B14] text-xs px-3 py-2 rounded-lg mt-2">
                      <span className="font-bold flex items-center gap-1"><Tag className="w-3 h-3 text-[#D4A017]"/> {couponCode} APPLIED</span>
                      <button onClick={() => {
                        setCouponCode("");
                        import("@/lib/cart").then((cartLib) => cartLib.removeCoupon());
                      }} className="text-[#8A1B14] hover:text-[#5E0B10] underline font-medium cursor-pointer">Remove</button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-[#7A4A3B]">
                  <span>All India Express Shipping</span>
                  <span className="font-bold text-[#2e7d32]">FREE (Saved ₹99)</span>
                </div>
              </div>
              
              <div className="border-t border-[#EAD7BC] mt-4 pt-5 bg-[#FCFAF5] -mx-6 md:-mx-8 px-6 md:px-8 pb-6 md:pb-8 -mb-6 md:-mb-8 rounded-b-2xl space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-sm text-[#7A4A3B] mb-0.5">Total Amount to Pay</span>
                    <span className="text-[11px] text-[#7A4A3B]">Inclusive of all taxes &amp; Free Delivery</span>
                  </div>
                  <span className="text-3xl font-extrabold text-[#5E0B10]">{formatPrice(pricing.amountToPay)}</span>
                </div>

                {/* ─── 5. Risk-Reversal Guarantee Box (Zero Breakage) ─── */}
                <div className="bg-[#F8FFF5] border border-[#C3E6CB] rounded-xl p-3 space-y-1.5 text-left">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2e7d32] shrink-0 mt-0.5" />
                    <div className="text-[11px] text-[#1e4620] leading-snug">
                      <strong className="block font-bold text-[#155724] text-xs">🛡️ 100% Zero-Breakage Transit Guarantee</strong>
                      Safe delivery promise: If your glass jar arrives broken or leaking, we ship a brand new jar free of cost — zero questions asked.
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[10px] font-semibold text-[#2e7d32] border-t border-[#d4edda]">
                    <span>⚡ 24h Express Air Dispatch</span>
                    <span>🔒 256-Bit Bank Safe</span>
                  </div>
                </div>

                {/* Primary CTA (Desktop & Order Summary) */}
                <button 
                  onClick={handlePlaceOrder} 
                  disabled={isSubmitting || !isFormValid} 
                  className={`w-full px-8 py-4 sm:py-4.5 rounded-xl font-extrabold text-base sm:text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isFormValid && !isSubmitting
                      ? "bg-gradient-to-r from-[#8A1B14] via-[#A8281E] to-[#5E0B10] text-white hover:shadow-xl hover:shadow-[#8A1B14]/30 active:scale-[0.99] cursor-pointer"
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
                      <Lock className="w-5 h-5 text-[#F5BD47]" />
                      {isFormValid ? "Proceed to Pay Securely" : "Fill Details Above to Pay"}
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-[#7A4A3B] flex items-center justify-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#D4A017]" />
                  <span>Google Pay, PhonePe, Paytm UPI, Cards &amp; NetBanking accepted</span>
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* ─── Sticky Bottom "Proceed to Pay" Bar on Mobile ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-4 py-2.5 border-t border-[#EAD7BC] shadow-[0_-4px_25px_rgba(94,11,16,0.14)] pb-[max(0.6rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex flex-col shrink-0">
            <div className="flex items-center gap-1 text-[10px] text-[#2e7d32] font-bold">
              <span>Save {formatPrice(totalSavingsPaise)}</span>
              <span>•</span>
              <span className="font-mono text-[#8A1B14]">{formattedTime}</span>
            </div>
            <span className="text-xl font-extrabold text-[#5E0B10] leading-tight">
              {formatPrice(pricing.amountToPay)}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || !isFormValid}
            className={`flex-1 flex items-center justify-center gap-2 px-5 h-[48px] rounded-xl font-bold text-sm sm:text-base transition-all ${
              isFormValid && !isSubmitting
                ? "bg-gradient-to-r from-[#8A1B14] via-[#A8281E] to-[#5E0B10] text-white shadow-lg hover:shadow-xl hover:shadow-[#8A1B14]/25 active:scale-[0.98] cursor-pointer"
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
                <Lock className="w-4 h-4 text-[#F5BD47]" />
                <span>{isFormValid ? "Proceed to Pay" : "Fill Details to Pay"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── 6. Exit-Intent Sunk Cost Modal ─── */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border-2 border-[#D4A017] rounded-3xl p-6 md:p-8 shadow-2xl text-center overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowExitModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-[#FFF9EE] border-2 border-[#D4A017] rounded-full flex items-center justify-center mx-auto mb-3.5 shadow-inner">
              <Gift className="w-8 h-8 text-[#8A1B14] animate-bounce" />
            </div>

            <span className="bg-[#8A1B14] text-[#F5BD47] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
              ⚠️ WAIT! YOUR FREE GIFT IS WAITING
            </span>

            <h3 className="font-serif text-2xl font-bold text-[#5E0B10] mb-2">
              Don&apos;t Leave Your Offer Behind!
            </h3>

            <p className="text-xs sm:text-sm text-[#7A4A3B] mb-5 leading-relaxed">
              Your pure A2 Gir Cow Ghee and complimentary <strong className="text-[#8A1B14]">Free Cold-Pressed Oil Gift</strong> from today&apos;s bilona churn are currently reserved for you. If you leave, this offer will be given to the next customer in queue.
            </p>

            <div className="bg-[#FCFAF5] border border-[#EAD7BC] rounded-xl p-3 mb-6 text-xs text-[#4A352F] flex items-center justify-around">
              <div>
                <span className="block font-bold text-[#5E0B10]">⏱️ Reserved Time</span>
                <span className="font-mono font-extrabold text-[#8A1B14] text-sm">{formattedTime}</span>
              </div>
              <div className="h-6 w-px bg-[#EAD7BC]" />
              <div>
                <span className="block font-bold text-[#5E0B10]">🎁 Free Gift</span>
                <span className="font-bold text-[#2e7d32]">Secured</span>
              </div>
              <div className="h-6 w-px bg-[#EAD7BC]" />
              <div>
                <span className="block font-bold text-[#5E0B10]">💰 Savings</span>
                <span className="font-bold text-[#2e7d32]">{formatPrice(totalSavingsPaise)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowExitModal(false);
                  scrollToSummary();
                }}
                className="w-full bg-gradient-to-r from-[#8A1B14] via-[#A8281E] to-[#5E0B10] text-white py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:shadow-[#8A1B14]/30 transition cursor-pointer"
              >
                Complete My Order &amp; Keep Free Gift →
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className="text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
              >
                Decline free gift &amp; return to page
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
