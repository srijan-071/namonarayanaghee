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
  Award, 
  CheckCircle2, 
  ArrowLeft,
  Heart,
  AlertCircle,
  User,
  Phone,
  Mail,
  Home,
  Building2,
  ChevronDown,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  MessageCircle
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
        return;
      }

      latestPincodeRef.current = cleanVal;
      setIsFetchingPincode(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 900); // 900ms fast timeout

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
            setFieldErrors(prev => {
              const next = { ...prev };
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

  const pricing = useMemo(() => {
    return calculateCheckoutPricing(cart.items, cart.subtotal, "prepaid", form.email, couponCode);
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
      toast.info("Removed 500ml jar from your parcel.");
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
      toast.success("Added 500ml A2 Ghee jar to your parcel for your family!");
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

    if (!cleanName) {
      errors.name = "Please enter your full name";
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = "Please enter your 10-digit mobile number";
    }
    if (!cleanAddress || cleanAddress.length < 4) {
      errors.address = "Please enter your house/street delivery address";
    }
    if (!cleanPincode || cleanPincode.length !== 6) {
      errors.pincode = "Please enter 6-digit PIN code";
    }
    if (!cleanCity) {
      errors.city = "Please enter your city / district";
    }
    if (!cleanState) {
      errors.state = "Please enter your state";
    }
    if (hasGst) {
      if (!gstDetails.companyName.trim()) {
        errors.companyName = "Please enter company legal name";
      }
      if (!gstDetails.gstin.trim() || gstDetails.gstin.trim().length < 15) {
        errors.gstin = "Please enter valid 15-digit GSTIN";
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
      // If email is omitted, generate standard internal receipt email so gateways never fail
      const customerEmail = form.email.trim() || `${cleanPhone}@customer.namonarayanaghee.store`;

      const address = {
        name: form.name.trim(),
        address: form.address.trim(),
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

      const isAdmin = customerEmail.toLowerCase().trim() === 'littlecodr@gmail.com';
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

      // Notify Telegram in background (with keepalive so it survives navigation)
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
      <section className="bg-[#FAF9F5] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center py-16 px-4 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FDF6E8] border border-[#EAD7BC] flex items-center justify-center text-[#8A1B14]">
            <Heart className="w-7 h-7 text-[#8A1B14]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#5E0B10]">Your Cart is Empty</h1>
          <p className="text-sm text-[#7A4A3B]">Add authentic Vedic Bilona Ghee to bring pure health and blessings to your family.</p>
          <Link 
            href="/collections/all-products" 
            className="inline-flex items-center justify-center gap-2 bg-[#8A1B14] hover:bg-[#68140E] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all mt-2"
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
      
      {/* 1. Top Announcement Header Bar */}
      <div className="bg-[#5E0B10] text-amber-200 text-[11px] sm:text-xs py-2 px-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium truncate">
            <DiwaliDiya size={14} glow={false} />
            <span className="truncate">
              Diwali Offer | Pure A2 Gir Cow Ghee | Nourishing Families, The Traditional Way
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-amber-100 font-semibold shrink-0">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 100% Pure
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-amber-300" /> Pan India Delivery
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Safe &amp; Secure Payments
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-28 lg:pb-16">
        
        {/* 2. Page Hero Header + 3 Organic Trust Badges */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EAD7BC]/60">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#5E0B10] tracking-tight">
              Complete Your Order
            </h1>
            <p className="text-xs sm:text-sm text-[#7A4A3B] mt-1 font-medium">
              Pure A2 Gir Cow Ghee, made the traditional way.
            </p>
          </div>

          {/* 3 Traditional Trust Badges */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-[#FFFDF7] border border-[#EAD7BC] px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-[#5E0B10] shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-[#FDF6E8] flex items-center justify-center text-[#8A1B14] shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span>Traditional Bilona Process</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#FFFDF7] border border-[#EAD7BC] px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-[#5E0B10] shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-[#FDF6E8] flex items-center justify-center text-emerald-700 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <span>0% Chemicals 0% Adulteration</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#FFFDF7] border border-[#EAD7BC] px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-[#5E0B10] shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-[#FDF6E8] flex items-center justify-center text-[#8A1B14] shrink-0">
                <Award className="w-3.5 h-3.5" />
              </span>
              <span>Safe Glass Jar For Your Family</span>
            </div>
          </div>
        </div>

        {/* 3. 3-Step Checkout Flow Stepper */}
        <div className="bg-white rounded-2xl border border-[#EAD7BC]/70 p-3.5 sm:p-4 mb-6 shadow-xs">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Step 1: Contact */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5E0B10] text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-xs">
                1
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#5E0B10] leading-tight">Contact</p>
                <p className="text-[10px] text-[#7A4A3B] hidden sm:block">Your details</p>
              </div>
            </div>

            {/* Line 1 -> 2 */}
            <div className="flex-1 mx-2.5 sm:mx-4 h-0.5 bg-gradient-to-r from-[#5E0B10] to-[#EAD7BC]" />

            {/* Step 2: Delivery */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#5E0B10] text-[#5E0B10] bg-[#FFFDF7] flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                2
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#5E0B10] leading-tight">Delivery</p>
                <p className="text-[10px] text-[#7A4A3B] hidden sm:block">Shipping address</p>
              </div>
            </div>

            {/* Line 2 -> 3 */}
            <div className="flex-1 mx-2.5 sm:mx-4 h-0.5 bg-[#EAD7BC]" />

            {/* Step 3: Payment */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-stone-300 text-stone-400 bg-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                3
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-stone-500 leading-tight">Payment</p>
                <p className="text-[10px] text-stone-400 hidden sm:block">Secure checkout</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Main 2-Column Split Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Form Cards */}
          <div className="w-full lg:w-[58%] space-y-5">
            
            {/* Card 1: Contact Details */}
            <div className="bg-white rounded-2xl border border-[#EAD7BC] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAD7BC]/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#5E0B10]/10 text-[#5E0B10] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-[#8A1B14]" />
                  </div>
                  <h2 className="font-serif text-base sm:text-lg font-bold text-[#5E0B10]">
                    Contact Details
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#7A4A3B]">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 hidden sm:inline" />
                  <span className="text-[11px] sm:text-xs">For order updates and delivery notifications</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
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

                {/* Mobile Number & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkout-phone" className="block text-xs font-bold text-[#5E0B10] mb-1.5">
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      <input 
                        id="checkout-phone"
                        name="tel"
                        type="tel" 
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={10}
                        placeholder="10-digit mobile number" 
                        value={form.phone} 
                        onChange={(e) => handleFieldChange("phone", e.target.value.replace(/\D/g, ""))} 
                        onBlur={handlePhoneBlur}
                        className={`w-full border rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm focus:outline-none transition bg-white ${
                          fieldErrors.phone 
                            ? "border-red-500 ring-1 ring-red-400 bg-red-50/20" 
                            : "border-stone-200 focus:border-[#5E0B10] focus:ring-1 focus:ring-[#5E0B10]"
                        }`} 
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="checkout-email" className="block text-xs font-bold text-[#5E0B10] mb-1.5">
                      Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      <input 
                        id="checkout-email"
                        name="email"
                        type="email" 
                        inputMode="email"
                        autoComplete="email"
                        placeholder="For PDF tax invoice" 
                        value={form.email} 
                        onChange={(e) => handleFieldChange("email", e.target.value)} 
                        className="w-full border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-[#5E0B10] focus:ring-1 focus:ring-[#5E0B10] transition bg-white" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Delivery Address */}
            <div className="bg-white rounded-2xl border border-[#EAD7BC] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAD7BC]/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#5E0B10]/10 text-[#5E0B10] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#8A1B14]" />
                  </div>
                  <h2 className="font-serif text-base sm:text-lg font-bold text-[#5E0B10]">
                    Delivery Address
                  </h2>
                </div>

                <div className="flex items-center gap-1 text-xs text-[#7A4A3B]">
                  <Truck className="w-3.5 h-3.5 text-[#8A1B14]" />
                  <span>We deliver across India</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Street Address */}
                <div>
                  <label htmlFor="checkout-address" className="block text-xs font-bold text-[#5E0B10] mb-1.5">
                    House / Flat No., Society, Street <span className="text-red-600">*</span>
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

                {/* PIN Code, City, State */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* PIN Code */}
                  <div>
                    <label htmlFor="checkout-pincode" className="block text-xs font-bold text-[#5E0B10] mb-1.5">
                      PIN Code <span className="text-red-600">*</span>
                    </label>
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

                  {/* State Select Dropdown */}
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

                {/* GST Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={hasGst} 
                      onChange={(e) => setHasGst(e.target.checked)} 
                      className="w-4 h-4 rounded border-stone-300 text-[#5E0B10] focus:ring-[#5E0B10] accent-[#5E0B10]" 
                    />
                    <span className="text-xs font-medium text-stone-600">I need a business GST invoice for my company (Optional)</span>
                  </label>
                  
                  {hasGst && (
                    <div className="space-y-3 p-4 bg-[#FDFBF7] rounded-xl border border-stone-200 mt-3 animate-in fade-in">
                      <div>
                        <input 
                          id="checkout-companyName"
                          type="text" 
                          placeholder="Company Legal Name *" 
                          value={gstDetails.companyName} 
                          onChange={(e) => setGstDetails({...gstDetails, companyName: e.target.value})} 
                          className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#5E0B10] bg-white" 
                        />
                      </div>
                      <div>
                        <input 
                          id="checkout-gstin"
                          type="text" 
                          placeholder="15-digit GSTIN *" 
                          value={gstDetails.gstin} 
                          onChange={(e) => setGstDetails({...gstDetails, gstin: e.target.value.toUpperCase()})} 
                          className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#5E0B10] bg-white uppercase" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3-Pillar Guarantee Card (Matching Inspiration) */}
            <div className="bg-[#FFFDF7] border border-[#EAD7BC] rounded-2xl p-4 sm:p-5 flex items-center justify-around text-center text-[#7A4A3B]">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-9 h-9 rounded-full bg-[#FDF6E8] border border-[#D4A017] flex items-center justify-center text-[#8A1B14] shrink-0">
                  <Lock className="w-4 h-4 text-[#8A1B14]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#5E0B10] block">100% Secure</span>
                  <span className="text-[10px] text-[#7A4A3B]">UPI / Cards</span>
                </div>
              </div>

              <div className="w-px h-8 bg-[#EAD7BC]" />

              <div className="flex items-center gap-2.5 text-left">
                <div className="w-9 h-9 rounded-full bg-[#FDF6E8] border border-[#D4A017] flex items-center justify-center text-[#8A1B14] shrink-0">
                  <Truck className="w-4 h-4 text-[#8A1B14]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#5E0B10] block">Fast &amp; Reliable</span>
                  <span className="text-[10px] text-[#7A4A3B]">Express Delivery</span>
                </div>
              </div>

              <div className="w-px h-8 bg-[#EAD7BC]" />

              <div className="flex items-center gap-2.5 text-left">
                <div className="w-9 h-9 rounded-full bg-[#FDF6E8] border border-[#D4A017] flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#5E0B10] block">Damage Protection</span>
                  <span className="text-[10px] text-[#7A4A3B]">Safe Delivery Guarantee</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Your Order Summary */}
          <div className="w-full lg:w-[42%] lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl border border-[#EAD7BC] p-5 sm:p-6 shadow-xs space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EAD7BC]/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#5E0B10]/10 text-[#5E0B10] flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-4 h-4 text-[#8A1B14]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#5E0B10]">
                    Your Order
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#8A1B14] bg-[#FDF6E8] px-2.5 py-0.5 rounded-full border border-[#EAD7BC]">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Product items */}
              <div className="space-y-3.5 divide-y divide-[#EAD7BC]/40">
                {cart.items.map((item) => (
                  <div key={item.variantId} className="flex gap-3.5 items-center pt-3.5 first:pt-0">
                    {/* Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#EAD7BC] shrink-0 bg-[#FDF6E8]">
                      {item.image && (
                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="80px" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#5E0B10] truncate">{item.title}</h4>
                      <p className="text-xs text-[#7A4A3B] mt-0.5 font-medium">{item.variantTitle || "Pure A2 Gir Cow Ghee"}</p>
                      <p className="text-[11px] text-stone-500 leading-tight mt-0.5">Slowly churned from pure curd in Rajasthan.</p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-sm text-[#5E0B10]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          {item.compareAtPrice && item.compareAtPrice > item.price && (
                            <span className="text-[11px] text-stone-400 line-through">
                              {formatPrice(item.compareAtPrice * item.quantity)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Stepper & Trash Button */}
                        <div className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#EAD7BC] rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.variantId, item.quantity - 1);
                              } else {
                                removeFromCart(item.variantId);
                              }
                            }}
                            className="w-6 h-6 flex items-center justify-center text-[#5E0B10] hover:bg-white rounded transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-[#5E0B10]">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-[#5E0B10] hover:bg-white rounded transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.variantId)}
                            className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-50 rounded transition ml-0.5 cursor-pointer"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free Gifts Box (Matching Mobile Screenshot) */}
              {freeGifts.length > 0 && (
                <div className="bg-[#FAF9F5] border border-[#D4A017]/60 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[#8A1B14] flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#8A1B14]" />
                      <span>{freeGifts.length} Complimentary Gifts (Free)</span>
                    </span>
                    <span className="text-[10px] text-amber-800 font-semibold bg-amber-100/70 px-2 py-0.5 rounded-full">
                      Auto-added ✨
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {freeGifts.map((gift, idx) => (
                      <div key={idx} className="bg-white border border-[#EAD7BC] rounded-lg p-1.5 flex flex-col items-center text-center">
                        <div className="relative w-8 h-8 mb-1">
                          <Image src={gift.image} alt={gift.name} fill className="object-contain" sizes="32px" />
                        </div>
                        <span className="text-[10px] font-bold text-[#5E0B10] line-clamp-1">{gift.name}</span>
                        <span className="text-[9px] text-[#7A4A3B]">{gift.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upsell Bump Card (Matching Inspiration Screenshot 1 & 2) */}
              <div className="p-3.5 rounded-xl border border-[#D4A017] bg-[#FFFDF9] hover:border-[#8A1B14] transition relative">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="order-bump-checkbox"
                    checked={isBumpInCart}
                    onChange={toggleOrderBump}
                    className="w-4 h-4 mt-1 rounded border-stone-300 text-[#5E0B10] focus:ring-[#5E0B10] accent-[#5E0B10] cursor-pointer shrink-0"
                  />
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#EAD7BC] shrink-0 bg-[#FDF6E8]">
                    <Image src="/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp" alt="500ml Ghee" fill className="object-cover" sizes="48px" />
                  </div>
                  <label htmlFor="order-bump-checkbox" className="flex-1 cursor-pointer select-none min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#8A1B14] text-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                    <p className="font-bold text-xs text-[#5E0B10] mt-1 leading-snug">
                      Care for Parents: Add 500ml A2 Bilona Ghee Jar
                    </p>
                    <p className="text-[11px] text-[#7A4A3B] mt-0.5">
                      Special price: <strong className="text-[#8A1B14]">₹599</strong> (Regular ₹999) • <span className="text-emerald-700 font-semibold">40% OFF</span>
                    </p>
                    <p className="text-[10px] text-amber-900 mt-0.5">
                      Save ₹400 • Give the gift of health ❤️
                    </p>
                  </label>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="pt-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Enter coupon code (e.g. DIWALI)"
                      value={tempCoupon}
                      onChange={(e) => setTempCoupon(e.target.value.toUpperCase())}
                      className="w-full border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-[#5E0B10] bg-white font-mono uppercase"
                    />
                  </div>
                  <button
                    type="button"
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
                    className="bg-[#5E0B10] hover:bg-[#4A080C] text-white px-5 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50 transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponCode && (
                  <div className="flex items-center justify-between bg-[#FAF9F5] border border-[#EAD7BC] text-[#8A1B14] text-xs px-3 py-1.5 rounded-lg mt-2">
                    <span className="font-semibold flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#D4A017]" /> {couponCode} applied (-{formatPrice(pricing.discount)})
                    </span>
                    <button
                      type="button"
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

              {/* All India Express Delivery Line */}
              <div className="flex justify-between items-center text-xs text-[#7A4A3B] pt-2 border-t border-[#EAD7BC]/50">
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-4 h-4 text-[#8A1B14]" />
                  <span>All India Express Delivery</span>
                </span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>

              {/* Total Section */}
              <div className="pt-3 border-t border-[#EAD7BC] flex justify-between items-baseline">
                <div>
                  <span className="text-base font-bold text-[#5E0B10] block">Total to Pay</span>
                  <span className="text-[11px] text-[#7A4A3B]">Inclusive of all taxes &amp; Free Delivery</span>
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#5E0B10]">
                  {formatPrice(pricing.amountToPay)}
                </span>
              </div>

              {/* Payment Gateways Strip */}
              <div className="pt-1 text-center space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#7A4A3B] font-medium">
                  <span>Pay Securely with</span>
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="bg-[#5F259F] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">PhonePe</span>
                  <span className="bg-white border border-[#D5D8D0] text-[#1A73E8] text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">GPay</span>
                  <span className="bg-[#002970] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">Paytm</span>
                  <span className="bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">UPI</span>
                  <span className="bg-[#1A1F71] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">VISA</span>
                  <span className="bg-[#EB001B] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">Mastercard</span>
                  <span className="bg-[#097939] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">RuPay</span>
                </div>
              </div>

              {/* Primary CTA Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 bg-[#5E0B10] hover:bg-[#4A080C] text-white active:scale-[0.99] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connecting to payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#F5BD47]" />
                    <span>Continue to secure payment →</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-[#7A4A3B] font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Secure checkout • No hidden charges</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 5. Mobile Sticky Bottom Bar (Matching Mobile Screenshot) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md px-4 py-2.5 border-t border-[#EAD7BC] shadow-[0_-4px_20px_rgba(0,0,0,0.12)] pb-[max(0.6rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto mb-1">
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-[#7A4A3B] font-semibold uppercase tracking-wider">
              Total to Pay
            </span>
            <span className="text-xl font-extrabold text-[#5E0B10] leading-tight">
              {formatPrice(pricing.amountToPay)}
            </span>
            <span className="text-[9px] text-[#7A4A3B]">Inclusive of all taxes &amp; Free Delivery</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 h-[48px] rounded-xl font-bold text-xs sm:text-sm transition-all bg-[#5E0B10] hover:bg-[#4A080C] text-white shadow-md active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#F5BD47]" />
                <span>Proceed to Secure Payment →</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[10px] text-center text-amber-900 font-semibold flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>Limited Time Offer — Don&apos;t Miss Free Gifts!</span>
        </p>
      </div>

    </div>
  );
}
