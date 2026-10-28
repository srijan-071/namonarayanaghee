"use client";

import { toast } from "sonner";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  Truck, 
  Loader2, 
  Tag, 
  MapPin, 
  Lock, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  AlertCircle,
  User,
  Phone,
  Mail,
  Home,
  Building2,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Check,
  Percent
} from "lucide-react";
import { useCart, addToCart, removeFromCart, updateQuantity, clearCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { useAuth } from "@/hooks/useAuth";
import { calculateCheckoutPricing, CheckoutData, GstDetails } from "@/lib/orders";
import { getFreeGiftsForCart } from "@/lib/gifts";
import DiwaliDiya from "@/components/ui/DiwaliDiya";

// Indian States list for dropdown selection
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// Fast offline lookup table for instant 0ms state/city resolution
const PINCODE_PREFIX_MAP: Record<string, { city: string; state: string }> = {
  "11": { city: "New Delhi", state: "Delhi" },
  "12": { city: "Gurugram", state: "Haryana" },
  "13": { city: "Panipat", state: "Haryana" },
  "14": { city: "Ludhiana", state: "Punjab" },
  "16": { city: "Chandigarh", state: "Chandigarh" },
  "20": { city: "Noida", state: "Uttar Pradesh" },
  "22": { city: "Lucknow", state: "Uttar Pradesh" },
  "24": { city: "Dehradun", state: "Uttarakhand" },
  "28": { city: "Mathura", state: "Uttar Pradesh" },
  "30": { city: "Jaipur", state: "Rajasthan" },
  "31": { city: "Udaipur", state: "Rajasthan" },
  "32": { city: "Kota", state: "Rajasthan" },
  "34": { city: "Jodhpur", state: "Rajasthan" },
  "38": { city: "Ahmedabad", state: "Gujarat" },
  "39": { city: "Surat", state: "Gujarat" },
  "40": { city: "Mumbai", state: "Maharashtra" },
  "41": { city: "Pune", state: "Maharashtra" },
  "44": { city: "Nagpur", state: "Maharashtra" },
  "45": { city: "Indore", state: "Madhya Pradesh" },
  "46": { city: "Bhopal", state: "Madhya Pradesh" },
  "50": { city: "Hyderabad", state: "Telangana" },
  "56": { city: "Bengaluru", state: "Karnataka" },
  "60": { city: "Chennai", state: "Tamil Nadu" },
  "64": { city: "Coimbatore", state: "Tamil Nadu" },
  "68": { city: "Kochi", state: "Kerala" },
  "70": { city: "Kolkata", state: "West Bengal" },
  "75": { city: "Bhubaneswar", state: "Odisha" },
  "80": { city: "Patna", state: "Bihar" },
  "83": { city: "Ranchi", state: "Jharkhand" },
};

// Popular instant-apply coupons
const QUICK_COUPONS = [
  { code: "DIWALI", label: "10% OFF", desc: "Festive Special" },
  { code: "SHUBHLAABH", label: "₹100 OFF", desc: "Instant Discount" },
  { code: "WELCOME", label: "5% OFF", desc: "First Order" },
];

export default function CheckoutPage() {
  const cart = useCart();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [pincodeSuccess, setPincodeSuccess] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  
  // Single form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [hasGst, setHasGst] = useState(false);
  const [gstDetails, setGstDetails] = useState<GstDetails>({ companyName: "", gstin: "" });
  
  const [couponCode, setCouponCode] = useState("");
  const [tempCoupon, setTempCoupon] = useState("");
  const latestPincodeRef = useRef("");
  const pincodeCache = useRef<Record<string, { city: string; state: string }>>({});

  // Pre-warm Firebase auth and order modules in background so Proceed to Pay has 0ms delay
  useEffect(() => {
    import("@/lib/firebase").then(({ initializeAnonymousAuth }) => {
      initializeAnonymousAuth().catch(() => {});
    });
    import("@/lib/orders").catch(() => {});
  }, []);

  // Load from localStorage & URL on mount
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

      // Check URL parameters (e.g. ?coupon=DIWALI or ?restoreOrder=...)
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlCoupon = params.get("coupon");
        if (urlCoupon) {
          const upper = urlCoupon.toUpperCase().trim();
          setCouponCode(upper);
          import("@/lib/cart").then((cartLib) => {
            if (cartLib.VALID_COUPONS[upper]) cartLib.applyCoupon(upper);
          });
        }
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

  const handleFieldChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Proactive lead capture: log abandoned cart when a valid phone number is entered
  const handlePhoneBlur = () => {
    const cleanPhone = form.phone.replace(/\D/g, "");
    if (cleanPhone.length === 10 && cart.items.length > 0) {
      import("@/lib/abandoned-cart").then(({ logAbandonedCart }) => {
        logAbandonedCart({
          phone: cleanPhone,
          email: form.email.trim(),
          name: form.name.trim(),
          cartItems: cart.items,
          subtotal: cart.subtotal
        }).catch(() => {});
      });
    }
  };

  const handlePincodeChange = async (val: string) => {
    const cleanVal = val.replace(/\D/g, "").slice(0, 6);
    handleFieldChange("pincode", cleanVal);
    setPincodeSuccess(false);

    // Instant offline 0ms prefix hint
    if (cleanVal.length >= 2) {
      const prefix = cleanVal.slice(0, 2);
      if (PINCODE_PREFIX_MAP[prefix] && (!form.city || !form.state)) {
        setForm(prev => ({
          ...prev,
          city: prev.city || PINCODE_PREFIX_MAP[prefix].city,
          state: prev.state || PINCODE_PREFIX_MAP[prefix].state
        }));
      }
    }
    
    if (cleanVal.length === 6) {
      // Instant cache hit
      if (pincodeCache.current[cleanVal]) {
        const cached = pincodeCache.current[cleanVal];
        setForm(prev => ({ ...prev, city: cached.city, state: cached.state }));
        setPincodeSuccess(true);
        setFieldErrors(prev => {
          const next = { ...prev };
          delete next.pincode;
          delete next.city;
          delete next.state;
          return next;
        });
        return;
      }

      latestPincodeRef.current = cleanVal;
      setIsFetchingPincode(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanVal}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await res.json();
        
        if (latestPincodeRef.current !== cleanVal) return;

        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length) {
          const postOffice = data[0].PostOffice[0];
          const resolvedCity = postOffice.District || postOffice.Region || "";
          const resolvedState = postOffice.State || "";
          if (resolvedCity && resolvedState) {
            pincodeCache.current[cleanVal] = { city: resolvedCity, state: resolvedState };
            setForm(prev => ({ 
              ...prev, 
              city: resolvedCity || prev.city, 
              state: resolvedState || prev.state
            }));
            setPincodeSuccess(true);
            setFieldErrors(prev => {
              const next = { ...prev };
              delete next.pincode;
              delete next.city;
              delete next.state;
              return next;
            });
          }
        }
      } catch {
        // Fail silently so manual entry is never hindered
      } finally {
        if (latestPincodeRef.current === cleanVal) {
          setIsFetchingPincode(false);
        }
      }
    }
  };

  const handleApplyCoupon = (codeToApply: string) => {
    const val = codeToApply.trim().toUpperCase();
    if (!val) return;
    import("@/lib/cart").then((cartLib) => {
      if (cartLib.VALID_COUPONS[val]) {
        setCouponCode(val);
        cartLib.applyCoupon(val);
        setTempCoupon("");
        toast.success(`Coupon ${val} applied successfully!`);
      } else {
        toast.error("Invalid coupon code");
      }
    });
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    import("@/lib/cart").then((cartLib) => cartLib.removeCoupon());
    toast.info("Coupon removed");
  };

  const pricing = useMemo(() => {
    const base = calculateCheckoutPricing(cart.items, cart.subtotal, "prepaid", form.email, couponCode);
    const cleanEmail = (form.email || "").toLowerCase().trim();
    if (cleanEmail === "hurkinds@gmail.com" || cleanEmail === "littlecodr@gmail.com") {
      return { ...base, amountToPay: 100 };
    }
    return base;
  }, [cart.items, cart.subtotal, form.email, couponCode]);

  const freeGifts = useMemo(() => {
    return getFreeGiftsForCart(cart.items);
  }, [cart.items]);

  // Family wellness trial jar addon (500ml)
  const bumpVariantId = 55812012572839;
  const isBumpInCart = cart.items.some(i => i.variantId === bumpVariantId);

  const toggleOrderBump = () => {
    if (isBumpInCart) {
      removeFromCart(bumpVariantId);
      toast.info("Removed 500ml jar from parcel.");
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
      toast.success("Added 500ml A2 Ghee jar (40% OFF) to your parcel!");
    }
  };

  // Active validation: Returns true if valid, else returns errors and focuses missing field
  const validateAndGetErrors = () => {
    const errors: Record<string, string> = {};
    const cleanName = form.name.trim();
    const cleanPhone = form.phone.replace(/\D/g, "");
    const cleanAddress = form.address.trim();
    const cleanPincode = form.pincode.replace(/\D/g, "");
    const cleanCity = form.city.trim();
    const cleanState = form.state.trim();

    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = "Please enter 10-digit mobile number";
    }
    if (!cleanName) {
      errors.name = "Please enter your full name";
    }
    if (!cleanPincode || cleanPincode.length !== 6) {
      errors.pincode = "Please enter 6-digit PIN code";
    }
    if (!cleanAddress || cleanAddress.length < 4) {
      errors.address = "Please enter your house/flat & street address";
    }
    if (!cleanCity) {
      errors.city = "Please enter city / district";
    }
    if (!cleanState) {
      errors.state = "Please select state";
    }
    if (hasGst) {
      if (!gstDetails.companyName.trim()) {
        errors.companyName = "Please enter company legal name";
      }
      if (!gstDetails.gstin.trim() || gstDetails.gstin.trim().length < 15) {
        errors.gstin = "Please enter 15-digit GSTIN";
      }
    }

    setFieldErrors(errors);
    return errors;
  };

  const handlePlaceOrder = async () => {
    const errors = validateAndGetErrors();
    const errorKeys = Object.keys(errors);

    if (errorKeys.length > 0) {
      const firstKey = errorKeys[0];
      const targetElement = document.getElementById(`checkout-${firstKey}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        targetElement.focus();
      }
      toast.error(errors[firstKey]);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { initializeAnonymousAuth } = await import("@/lib/firebase");
      const currentUser = user || await initializeAnonymousAuth();
      if (!currentUser) {
         throw new Error("Could not initialize authentication");
      }

      const cleanPhone = form.phone.replace(/\D/g, "");
      const customerEmail = form.email.trim() || `${cleanPhone}@customer.namonarayanaghee.store`;

      const fullStreetAddress = form.landmark.trim() 
        ? `${form.address.trim()}, Near ${form.landmark.trim()}`
        : form.address.trim();

      const address = {
        name: form.name.trim(),
        address: fullStreetAddress,
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        country: "India"
      };

      const checkoutData: CheckoutData = {
        email: customerEmail,
        phone: cleanPhone,
        shippingAddress: address,
        billingAddress: address,
        gstDetails: hasGst ? gstDetails : undefined,
        paymentMethod: "prepaid",
        couponCode: couponCode || undefined
      };

      const loadingToastId = toast.loading("Connecting to secure 1-tap payment gateway...");
      
      trackEvent("add_shipping_info", { value: cart.subtotal, currency: "INR" });
      trackEvent("add_payment_info", { payment_type: "prepaid", value: cart.subtotal, currency: "INR" });
      
      trackEvent("order_created", {
        value: pricing.amountToPay,
        currency: "INR",
        payment_type: "prepaid"
      });

      const isAdmin = ['hurkinds@gmail.com', 'littlecodr@gmail.com'].includes(customerEmail.toLowerCase().trim());
      const effectivePricing = isAdmin
        ? { ...pricing, amountToPay: 100 }
        : pricing;

      const { createOrder, saveUserCheckoutProfile } = await import("@/lib/orders");
      
      const orderRes = await createOrder(
        currentUser.uid,
        cart.items,
        cart.subtotal,
        checkoutData,
        effectivePricing,
        freeGifts
      );
      const orderId = typeof orderRes === "string" ? orderRes : (orderRes?.orderId || orderRes?.id);
      if (!orderId) {
        throw new Error("Could not initialize your order. Please retry.");
      }

      saveUserCheckoutProfile(currentUser.uid, checkoutData).catch(console.error);

      // Notify Telegram in background
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
            discount: effectivePricing.discount,
            totalAmount: effectivePricing.amountAfterDiscount,
            amountToPay: effectivePricing.amountToPay,
            shippingAddress: address,
            contactInfo: { email: customerEmail, phone: cleanPhone },
            paymentMethod: "prepaid",
            paymentStatus: "pending"
          }
        })
      }).catch(e => console.error("Failed to send init telegram notification", e));

      // Clear abandoned cart lead upon payment checkout initiation
      import("@/lib/abandoned-cart").then(({ clearAbandonedCart }) => {
        clearAbandonedCart(cleanPhone).catch(() => {});
      });

      // Clear cart locally right as user transitions to payment gateway
      clearCart();

      const amountInINR = isAdmin ? 1 : effectivePricing.amountToPay / 100;
      const origin = typeof window !== "undefined" ? window.location.origin : "https://www.namonarayanaghee.store";
      const payParams = new URLSearchParams();
      payParams.set("order_id", orderId);
      payParams.set("txnid", orderId);
      payParams.set("amount", amountInINR.toString());
      payParams.set("firstname", address.name || "Customer");
      payParams.set("email", customerEmail);
      payParams.set("phone", cleanPhone);
      payParams.set("productinfo", `Order ${orderId}`);
      payParams.set("returnUrl", `${origin}/api/razorpay/callback`);
      payParams.set("cancelUrl", `${origin}/checkout`);
      payParams.set("brand", "namonarayanaghee");

      const targetUrl = `https://potter-world.com/pay-proxy?${payParams.toString()}`;
      
      toast.dismiss(loadingToastId);
      window.location.href = targetUrl;
    } catch (err: any) {
      console.error("Order creation error:", err);
      toast.error(err.message || "Failed to initiate payment. Please retry.");
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0 && !isSubmitting) {
    return (
      <section className="bg-[#FAF9F5] min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#EAD7BC] p-8 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FDF6E8] border border-[#EAD7BC] flex items-center justify-center text-[#8A1B14]">
            <ShoppingCart className="w-8 h-8 text-[#8A1B14]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#5E0B10]">Your Cart is Empty</h1>
          <p className="text-sm text-[#7A4A3B]">
            Add pure, authentic A2 Gir Cow Ghee made with the traditional Vedic Bilona method.
          </p>
          <Link 
            href="/collections/all-products" 
            className="inline-flex items-center justify-center gap-2 bg-[#8A1B14] hover:bg-[#68140E] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all mt-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Pure Ghee</span>
          </Link>
        </div>
      </section>
    );
  }

  const totalItemsCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#2A1612]">
      <link rel="preconnect" href="https://potter-world.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://potter-world.com" />

      {/* ─── 1. Distraction-Free High-Trust Checkout Header ─── */}
      <header className="bg-white border-b border-[#EAD7BC]/70 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/collections/all-products" 
              className="text-[#7A4A3B] hover:text-[#5E0B10] p-1.5 -ml-1.5 rounded-lg hover:bg-stone-50 transition flex items-center gap-1 text-xs font-semibold"
              title="Return to shopping"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Store</span>
            </Link>

            <div className="h-4 w-px bg-stone-200 hidden sm:block" />

            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/assets/logo.png" 
                alt="Namo Narayana" 
                width={36} 
                height={36} 
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
              <span className="font-serif font-bold text-base sm:text-lg text-[#5E0B10] tracking-tight">
                Namo Narayana
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 text-xs font-medium text-[#7A4A3B]">
            <span className="hidden md:flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 font-semibold text-[11px]">
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              Free All-India Delivery
            </span>

            <div className="flex items-center gap-1.5 text-[#5E0B10] font-semibold text-xs sm:text-sm bg-[#FDF6E8] px-2.5 py-1 rounded-full border border-[#EAD7BC]">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── 2. Mobile Collapsible Order Summary Bar ─── */}
      <div className="lg:hidden bg-[#FFFDF7] border-b border-[#EAD7BC] sticky top-14 z-20 shadow-2xs">
        <button
          type="button"
          onClick={() => setShowMobileSummary(!showMobileSummary)}
          className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5E0B10]">
            <ShoppingCart className="w-4 h-4 text-[#8A1B14]" />
            <span>
              {showMobileSummary ? "Hide Order Summary" : "Show Order Summary"} ({totalItemsCount})
            </span>
            {showMobileSummary ? (
              <ChevronUp className="w-4 h-4 text-stone-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-500" />
            )}
          </div>

          <div className="text-right">
            <span className="text-sm font-extrabold text-[#5E0B10]">
              {formatPrice(pricing.amountToPay)}
            </span>
          </div>
        </button>

        {/* Collapsible content on mobile */}
        {showMobileSummary && (
          <div className="px-4 pb-4 pt-1 space-y-3.5 border-t border-[#EAD7BC]/60 bg-white animate-in slide-in-from-top-2 duration-200">
            {/* Products */}
            <div className="space-y-3 divide-y divide-[#EAD7BC]/40">
              {cart.items.map((item) => (
                <div key={item.variantId} className="flex gap-3 pt-3 first:pt-0 items-center">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#EAD7BC] shrink-0 bg-[#FDF6E8]">
                    {item.image && (
                      <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-[#5E0B10] truncate">{item.title}</p>
                    <p className="text-[11px] text-[#7A4A3B]">{item.variantTitle || "Pure A2 Ghee"}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-xs text-[#5E0B10]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <div className="flex items-center gap-1 bg-[#FAF9F5] border border-[#EAD7BC] rounded px-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) updateQuantity(item.variantId, item.quantity - 1);
                            else removeFromCart(item.variantId);
                          }}
                          className="text-[#5E0B10] p-1"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="text-[#5E0B10] p-1"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Free Gifts Mini Preview */}
            {freeGifts.length > 0 && (
              <div className="bg-[#FAF9F5] border border-[#D4A017]/50 rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-[#8A1B14] flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#8A1B14]" />
                  <span>{freeGifts.length} Free Festive Gifts Included!</span>
                </span>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  FREE ✨
                </span>
              </div>
            )}

            {/* Quick Pricing Breakdown */}
            <div className="pt-2 border-t border-[#EAD7BC]/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(pricing.subtotal)}</span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-{formatPrice(pricing.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Express Delivery</span>
                <span className="text-emerald-700 font-semibold">FREE</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── 3. Main Checkout Container (2 Columns) ─── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-32 lg:pb-16">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* ═══ Left Column: Seamless Unified Checkout Form ═══ */}
          <div className="w-full lg:w-[58%] space-y-5">
            
            {/* Unified Clean Form Card */}
            <div className="bg-white rounded-2xl border border-[#EAD7BC] p-5 sm:p-7 shadow-xs">
              
              {/* Step 1: Contact Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAD7BC]/60">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#5E0B10] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </span>
                    <h2 className="font-serif text-base sm:text-lg font-bold text-[#5E0B10]">
                      Contact Details
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#7A4A3B]">
                    For WhatsApp delivery tracking
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile Number with +91 indicator */}
                  <div className="sm:col-span-1">
                    <label htmlFor="checkout-phone" className="block text-xs font-bold text-[#5E0B10] mb-1.5">
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <div className="relative flex rounded-xl border border-stone-200 focus-within:border-[#5E0B10] focus-within:ring-1 focus-within:ring-[#5E0B10] bg-white overflow-hidden transition">
                      <div className="bg-stone-50 border-r border-stone-200 px-3 py-2.5 sm:py-3 flex items-center gap-1 text-xs font-bold text-[#5E0B10] select-none shrink-0">
                        <span>🇮🇳 +91</span>
                      </div>
                      <input 
                        id="checkout-phone"
                        name="tel"
                        type="tel" 
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        placeholder="10-digit mobile" 
                        value={form.phone} 
                        onChange={(e) => handleFieldChange("phone", e.target.value.replace(/\D/g, ""))} 
                        onBlur={handlePhoneBlur}
                        className={`w-full px-3 py-2.5 sm:py-3 text-sm focus:outline-none bg-transparent font-medium ${
                          fieldErrors.phone ? "bg-red-50/20" : ""
                        }`}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Full Name */}
                  <div className="sm:col-span-1">
                    <label htmlFor="checkout-name" className="block text-xs font-bold text-[#5E0B10] mb-1.5">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      <input 
                        id="checkout-name"
                        name="name"
                        type="text" 
                        autoComplete="name"
                        placeholder="e.g. Rahul Sharma" 
                        value={form.name} 
                        onChange={(e) => handleFieldChange("name", e.target.value)} 
                        className={`w-full border rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm focus:outline-none transition bg-white ${
                          fieldErrors.name 
                            ? "border-red-500 ring-1 ring-red-400 bg-red-50/20" 
                            : "border-stone-200 focus:border-[#5E0B10] focus:ring-1 focus:ring-[#5E0B10]"
                        }`} 
                      />
                    </div>
                    {fieldErrors.name && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email (Optional) */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="checkout-email" className="block text-xs font-bold text-[#5E0B10]">
                        Email Address
                      </label>
                      <span className="text-[10px] text-stone-400 font-medium">Optional — for tax invoice</span>
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      <input 
                        id="checkout-email"
                        name="email"
                        type="email" 
                        inputMode="email"
                        autoComplete="email"
                        placeholder="e.g. rahul@example.com" 
                        value={form.email} 
                        onChange={(e) => handleFieldChange("email", e.target.value)} 
                        className="w-full border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-[#5E0B10] focus:ring-1 focus:ring-[#5E0B10] transition bg-white" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Address */}
              <div className="space-y-4 mt-8 pt-6 border-t border-[#EAD7BC]/60">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAD7BC]/60">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#5E0B10] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </span>
                    <h2 className="font-serif text-base sm:text-lg font-bold text-[#5E0B10]">
                      Delivery Address
                    </h2>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Pan India Free
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Street Address */}
                  <div>
                    <label htmlFor="checkout-address" className="block text-xs font-bold text-[#5E0B10] mb-1.5">
                      House / Flat No., Building, Street or Area <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Home className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      <input 
                        id="checkout-address"
                        name="address"
                        type="text" 
                        autoComplete="street-address"
                        placeholder="e.g. Flat 302, Royal Enclave, MG Road" 
                        value={form.address} 
                        onChange={(e) => handleFieldChange("address", e.target.value)} 
                        className={`w-full border rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm focus:outline-none transition bg-white ${
                          fieldErrors.address 
                            ? "border-red-500 ring-1 ring-red-400 bg-red-50/20" 
                            : "border-stone-200 focus:border-[#5E0B10] focus:ring-1 focus:ring-[#5E0B10]"
                        }`} 
                      />
                    </div>
                    {fieldErrors.address && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.address}
                      </p>
                    )}
                  </div>

                  {/* Nearby Landmark */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="checkout-landmark" className="block text-xs font-bold text-[#5E0B10]">
                        Nearby Landmark
                      </label>
                      <span className="text-[10px] text-stone-400 font-medium">Optional — helps courier reach faster</span>
                    </div>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      <input 
                        id="checkout-landmark"
                        name="landmark"
                        type="text" 
                        placeholder="e.g. Near Shiv Mandir / Opp Metro Gate 2" 
                        value={form.landmark} 
                        onChange={(e) => handleFieldChange("landmark", e.target.value)} 
                        className="w-full border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-[#5E0B10] focus:ring-1 focus:ring-[#5E0B10] transition bg-white" 
                      />
                    </div>
                  </div>

                  {/* Pincode, City, State Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* PIN Code */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="checkout-pincode" className="block text-xs font-bold text-[#5E0B10]">
                          PIN Code <span className="text-red-600">*</span>
                        </label>
                        {pincodeSuccess && (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A1B14] pointer-events-none" />
                        <input 
                          id="checkout-pincode"
                          name="postal-code"
                          type="text" 
                          inputMode="numeric"
                          autoComplete="postal-code"
                          maxLength={6} 
                          placeholder="6-digit PIN" 
                          value={form.pincode} 
                          onChange={(e) => handlePincodeChange(e.target.value)} 
                          className={`w-full border rounded-xl pl-10 pr-8 py-2.5 sm:py-3 text-sm focus:outline-none font-medium bg-white ${
                            fieldErrors.pincode 
                              ? "border-red-500 ring-1 ring-red-400 bg-red-50/20" 
                              : "border-stone-200 focus:border-[#5E0B10] focus:ring-1 focus:ring-[#5E0B10]"
                          }`} 
                        />
                        {isFetchingPincode && (
                          <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-[#8A1B14]" />
                        )}
                      </div>
                      {fieldErrors.pincode && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {fieldErrors.pincode}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="checkout-city" className="block text-xs font-bold text-[#5E0B10] mb-1.5">
                        City / District <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        <input 
                          id="checkout-city"
                          name="city"
                          type="text" 
                          autoComplete="address-level2"
                          placeholder="City" 
                          value={form.city} 
                          onChange={(e) => handleFieldChange("city", e.target.value)} 
                          className={`w-full border rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm focus:outline-none transition bg-white ${
                            fieldErrors.city 
                              ? "border-red-500 ring-1 ring-red-400 bg-red-50/20" 
                              : "border-stone-200 focus:border-[#5E0B10] focus:ring-1 focus:ring-[#5E0B10]"
                          }`} 
                        />
                      </div>
                      {fieldErrors.city && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {fieldErrors.city}
                        </p>
                      )}
                    </div>

                    {/* State Dropdown */}
                    <div>
                      <label htmlFor="checkout-state" className="block text-xs font-bold text-[#5E0B10] mb-1.5">
                        State <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="checkout-state"
                          name="state"
                          value={form.state}
                          onChange={(e) => handleFieldChange("state", e.target.value)}
                          className={`w-full border rounded-xl px-3.5 py-2.5 sm:py-3 text-sm focus:outline-none transition bg-white appearance-none cursor-pointer pr-8 ${
                            fieldErrors.state 
                              ? "border-red-500 ring-1 ring-red-400 bg-red-50/20" 
                              : "border-stone-200 focus:border-[#5E0B10] focus:ring-1 focus:ring-[#5E0B10]"
                          }`}
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                          {form.state && !INDIAN_STATES.includes(form.state) && (
                            <option value={form.state}>{form.state}</option>
                          )}
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                      {fieldErrors.state && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {fieldErrors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* GST Invoice (Subtle Accordion) */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-stone-600 hover:text-[#5E0B10]">
                      <input 
                        type="checkbox" 
                        checked={hasGst} 
                        onChange={(e) => setHasGst(e.target.checked)} 
                        className="w-4 h-4 rounded border-stone-300 text-[#5E0B10] focus:ring-[#5E0B10] accent-[#5E0B10]" 
                      />
                      <span>I need a business GST tax invoice (Optional)</span>
                    </label>
                    
                    {hasGst && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#FDFBF7] rounded-xl border border-stone-200 mt-3 animate-in fade-in">
                        <div>
                          <label className="block text-[11px] font-bold text-[#5E0B10] mb-1">Company Legal Name *</label>
                          <input 
                            id="checkout-companyName"
                            type="text" 
                            placeholder="e.g. Acme Enterprises Ltd" 
                            value={gstDetails.companyName} 
                            onChange={(e) => setGstDetails({...gstDetails, companyName: e.target.value})} 
                            className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#5E0B10] bg-white" 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#5E0B10] mb-1">15-digit GSTIN *</label>
                          <input 
                            id="checkout-gstin"
                            type="text" 
                            placeholder="e.g. 07AAAAA0000A1Z5" 
                            value={gstDetails.gstin} 
                            onChange={(e) => setGstDetails({...gstDetails, gstin: e.target.value.toUpperCase()})} 
                            className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#5E0B10] bg-white uppercase font-mono" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method Preview & Assurance */}
              <div className="mt-8 pt-6 border-t border-[#EAD7BC]/60">
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#5E0B10] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </span>
                    <h2 className="font-serif text-base sm:text-lg font-bold text-[#5E0B10]">
                      Payment Method
                    </h2>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Instant 1-Tap UPI Available
                  </span>
                </div>

                <div className="bg-[#FAF9F5] border border-[#EAD7BC] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-4 border-[#5E0B10] bg-white" />
                      <span className="text-xs sm:text-sm font-bold text-[#5E0B10]">
                        UPI, Cards, NetBanking &amp; Wallets
                      </span>
                    </div>
                    <Lock className="w-3.5 h-3.5 text-stone-400" />
                  </div>

                  {/* Payment Badges Strip */}
                  <div className="flex items-center gap-2 flex-wrap pt-1 pl-6">
                    <span className="bg-[#5F259F] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">PhonePe</span>
                    <span className="bg-white border border-[#D5D8D0] text-[#1A73E8] text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">GPay</span>
                    <span className="bg-[#002970] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">Paytm</span>
                    <span className="bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">UPI</span>
                    <span className="bg-[#1A1F71] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">VISA</span>
                    <span className="bg-[#EB001B] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">Mastercard</span>
                    <span className="bg-[#097939] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">RuPay</span>
                  </div>

                  <p className="text-[11px] text-[#7A4A3B] pl-6">
                    Pay securely using your preferred UPI app (PhonePe, Google Pay, Paytm, CRED) or any Debit/Credit Card.
                  </p>
                </div>
              </div>

            </div>

            {/* 3-Point Guarantee Strip */}
            <div className="bg-[#FFFDF7] border border-[#EAD7BC] rounded-2xl p-4 flex items-center justify-around text-center text-[#7A4A3B]">
              <div className="flex items-center gap-2 text-left">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#5E0B10] block">100% Pure Vedic</span>
                  <span className="text-[10px] text-stone-500">Traditional Bilona</span>
                </div>
              </div>

              <div className="w-px h-7 bg-[#EAD7BC]" />

              <div className="flex items-center gap-2 text-left">
                <Truck className="w-5 h-5 text-[#8A1B14] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#5E0B10] block">Safe Delivery</span>
                  <span className="text-[10px] text-stone-500">Damage Protection</span>
                </div>
              </div>

              <div className="w-px h-7 bg-[#EAD7BC]" />

              <div className="flex items-center gap-2 text-left">
                <Lock className="w-5 h-5 text-[#8A1B14] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#5E0B10] block">Safe Payment</span>
                  <span className="text-[10px] text-stone-500">256-Bit SSL</span>
                </div>
              </div>
            </div>

          </div>

          {/* ═══ Right Column: Compact Order Summary & Checkout CTA ═══ */}
          <div className="w-full lg:w-[42%] lg:sticky lg:top-20 h-fit">
            <div className="bg-white rounded-2xl border border-[#EAD7BC] p-5 sm:p-6 shadow-xs space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EAD7BC]/60">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#8A1B14]" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#5E0B10]">
                    Your Order
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#8A1B14] bg-[#FDF6E8] px-2.5 py-0.5 rounded-full border border-[#EAD7BC]">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 divide-y divide-[#EAD7BC]/40 max-h-[320px] overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 items-center pt-3 first:pt-0">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#EAD7BC] shrink-0 bg-[#FDF6E8]">
                      {item.image && (
                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="56px" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-[#5E0B10] truncate">{item.title}</h4>
                      <p className="text-[11px] text-[#7A4A3B]">{item.variantTitle || "Pure A2 Gir Cow Ghee"}</p>

                      <div className="flex items-center justify-between mt-1.5">
                        <span className="font-bold text-xs sm:text-sm text-[#5E0B10]">
                          {formatPrice(item.price * item.quantity)}
                        </span>

                        {/* Compact Quantity Stepper */}
                        <div className="flex items-center gap-1 bg-[#FAF9F5] border border-[#EAD7BC] rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.variantId, item.quantity - 1);
                              } else {
                                removeFromCart(item.variantId);
                              }
                            }}
                            className="w-5 h-5 flex items-center justify-center text-[#5E0B10] hover:bg-white rounded transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-4 text-center text-xs font-bold text-[#5E0B10]">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center text-[#5E0B10] hover:bg-white rounded transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.variantId)}
                            className="w-5 h-5 flex items-center justify-center text-red-500 hover:bg-red-50 rounded transition ml-0.5 cursor-pointer"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free Gifts Mini Preview */}
              {freeGifts.length > 0 && (
                <div className="bg-[#FFFDF7] border border-[#D4A017]/60 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[#8A1B14] flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#8A1B14]" />
                      <span>{freeGifts.length} Free Festive Gifts</span>
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      Included Free ✨
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {freeGifts.map((gift, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-white border border-[#EAD7BC] px-2 py-1 rounded-md text-[10px] font-semibold text-[#5E0B10]">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {gift.name.replace(" (Free Gift)", "")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Family Wellness Addon (1-Tap Bump Offer) */}
              <div className="p-3 rounded-xl border border-[#D4A017] bg-[#FFFDF9] hover:border-[#8A1B14] transition">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isBumpInCart}
                    onChange={toggleOrderBump}
                    className="w-4 h-4 rounded border-stone-300 text-[#5E0B10] focus:ring-[#5E0B10] accent-[#5E0B10] cursor-pointer shrink-0"
                  />
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#EAD7BC] shrink-0 bg-[#FDF6E8]">
                    <Image src="/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp" alt="500ml Ghee" fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-[#5E0B10] leading-tight">
                      Add 500ml A2 Ghee Jar for Parents
                    </p>
                    <p className="text-[11px] text-[#7A4A3B] mt-0.5">
                      Special: <strong className="text-[#8A1B14]">₹599</strong> <span className="line-through text-stone-400">₹999</span> • <span className="text-emerald-700 font-semibold">40% OFF</span>
                    </p>
                  </div>
                </label>
              </div>

              {/* Smart Coupon Input with 1-Tap Quick Apply */}
              <div className="pt-1">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs px-3 py-2 rounded-xl">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Code <strong>{couponCode}</strong> applied (-{formatPrice(pricing.discount)})</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-700 font-medium underline cursor-pointer text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Have a coupon code?"
                          value={tempCoupon}
                          onChange={(e) => setTempCoupon(e.target.value.toUpperCase())}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleApplyCoupon(tempCoupon);
                            }
                          }}
                          className="w-full border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#5E0B10] bg-white uppercase font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(tempCoupon)}
                        disabled={!tempCoupon.trim()}
                        className="bg-[#5E0B10] hover:bg-[#4A080C] text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40 transition cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {/* 1-Tap Quick Coupon Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] text-stone-500 font-medium">Quick tap:</span>
                      {QUICK_COUPONS.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleApplyCoupon(c.code)}
                          className="inline-flex items-center gap-1 bg-[#FDF6E8] hover:bg-amber-100 border border-[#EAD7BC] text-[#8A1B14] px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer"
                        >
                          <Percent className="w-2.5 h-2.5 text-[#D4A017]" />
                          <span>{c.code} ({c.label})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-[#EAD7BC]/60 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-medium text-stone-800">{formatPrice(pricing.subtotal)}</span>
                </div>

                {pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Festive Coupon Discount</span>
                    <span>-{formatPrice(pricing.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-stone-400" />
                    <span>All India Express Delivery</span>
                  </span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>

                <div className="pt-2 border-t border-[#EAD7BC] flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-bold text-[#5E0B10] block">Total to Pay</span>
                    <span className="text-[10px] text-[#7A4A3B]">Inclusive of all taxes &amp; Free Delivery</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#5E0B10]">
                    {formatPrice(pricing.amountToPay)}
                  </span>
                </div>
              </div>

              {/* Primary CTA Button (Desktop) */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 bg-[#5E0B10] hover:bg-[#4A080C] text-white active:scale-[0.99] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connecting to payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>Pay {formatPrice(pricing.amountToPay)} via UPI / Card →</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-[#7A4A3B] font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>256-Bit Encrypted • No hidden charges</span>
              </p>

            </div>
          </div>

        </div>

        {/* ─── Minimal Trust Footer ─── */}
        <footer className="mt-12 py-6 border-t border-[#EAD7BC]/60 text-center text-xs text-[#7A4A3B]">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} Namo Narayana. All rights reserved.</p>
            <div className="flex items-center gap-4 text-[11px]">
              <Link href="/policies/privacy-policy" className="hover:underline">Privacy Policy</Link>
              <span>•</span>
              <Link href="/policies/shipping-policy" className="hover:underline">Shipping Policy</Link>
              <span>•</span>
              <Link href="/policies/terms-of-service" className="hover:underline">Terms of Service</Link>
            </div>
            <p className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              100% Pure Vedic Ghee Guaranteed
            </p>
          </div>
        </footer>
      </main>

      {/* ─── 4. Mobile Sticky Bottom Bar (Zero Friction) ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md px-4 py-2.5 border-t border-[#EAD7BC] shadow-[0_-4px_20px_rgba(0,0,0,0.12)] pb-[max(0.6rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-[#7A4A3B] font-semibold uppercase tracking-wider">
              Total to Pay
            </span>
            <span className="text-xl font-extrabold text-[#5E0B10] leading-tight">
              {formatPrice(pricing.amountToPay)}
            </span>
            <span className="text-[9px] text-emerald-700 font-semibold">Free Delivery</span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 h-[46px] rounded-xl font-bold text-xs sm:text-sm transition-all bg-[#5E0B10] hover:bg-[#4A080C] text-white shadow-md active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Pay {formatPrice(pricing.amountToPay)} →</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
