"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { formatPrice, discountPercent } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { Product } from "@/lib/types";
import { toast } from "sonner";
import { 
  Loader2, Share2, Star, Truck, ShieldCheck, Factory, 
  Leaf, Zap, CheckCircle2, Gift, ShoppingCart,
  Sparkles, Tag, ShieldAlert, Award, Copy, Check,
  Flame, Eye, Clock, AlertTriangle, Shield, Lock,
  ChevronLeft, ChevronRight
} from "lucide-react";
import ProductReviews from "./ProductReviews";
import ProductJourney from "./ProductJourney";
import { PRODUCT_REVIEWS_MAP, PRODUCT_REVIEW_STATS } from "@/lib/reviews-data";
import { useRouter } from "next/navigation";

const RECENT_ORDERS = [
  { name: "Pooja S.", city: "Mumbai", item: "1L Pure A2 Gir Cow Ghee", time: "3 mins ago" },
  { name: "Rajesh K.", city: "Bengaluru", item: "2.5L Family Value Pack", time: "8 mins ago" },
  { name: "Anil M.", city: "Delhi NCR", item: "1L Pure A2 Gir Cow Ghee", time: "14 mins ago" },
  { name: "Kavita D.", city: "Pune", item: "1L Pure A2 Gir Cow Ghee", time: "19 mins ago" },
  { name: "Suresh P.", city: "Hyderabad", item: "5L Mega Family Pack", time: "25 mins ago" },
  { name: "Meera N.", city: "Jaipur", item: "1L Pure A2 Gir Cow Ghee", time: "32 mins ago" },
];

export default function ProductDetails({ product, gheePacks }: { product: Product; gheePacks?: Product[] | null }) {
  const router = useRouter();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const { open } = useCartDrawer();
  const [isAdding, setIsAdding] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [navigatingSlug, setNavigatingSlug] = useState<string | null>(null);

  // High converting live signals
  const [liveViewers, setLiveViewers] = useState(38);
  const [recentOrderIdx, setRecentOrderIdx] = useState(0);
  const [showRecentToast, setShowRecentToast] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 1, minutes: 46, seconds: 18 });
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);

  // Auto-change product images every 2 seconds with smooth faded transition
  useEffect(() => {
    if (!product.images || product.images.length <= 1) return;
    if (isGalleryHovered) return;

    const autoSlideTimer = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 2000);

    return () => clearInterval(autoSlideTimer);
  }, [product.images, isGalleryHovered]);

  useEffect(() => {
    setNavigatingSlug(null);
  }, [product.slug]);

  // Dynamic delivery date calculation
  const [deliveryDateStr, setDeliveryDateStr] = useState("3 - 4 Days");

  useEffect(() => {
    setIsMounted(true);
    router.prefetch("/checkout");

    // Calculate dynamic delivery range (3 to 5 days ahead)
    const now = new Date();
    const d1 = new Date(now);
    d1.setDate(now.getDate() + 3);
    const d2 = new Date(now);
    d2.setDate(now.getDate() + 5);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    setDeliveryDateStr(`${d1.toLocaleDateString('en-IN', options)} - ${d2.toLocaleDateString('en-IN', options)}`);

    // Live viewers fluctuation (32 - 46 viewers)
    const viewersTimer = setInterval(() => {
      setLiveViewers((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(48, Math.max(31, prev + delta));
      });
    }, 5500);

    // Rotating recent order toast
    const recentOrderTimer = setInterval(() => {
      setRecentOrderIdx((prev) => (prev + 1) % RECENT_ORDERS.length);
      setShowRecentToast(true);
      setTimeout(() => setShowRecentToast(false), 4000);
    }, 11000);

    // Initial popup after 4 seconds
    const initialToastTimer = setTimeout(() => {
      setShowRecentToast(true);
      setTimeout(() => setShowRecentToast(false), 4500);
    }, 3500);

    // Same-day dispatch countdown timer
    const countdownTimer = setInterval(() => {
      const cur = new Date();
      const cutoff = new Date(cur);
      cutoff.setHours(18, 0, 0, 0);
      let diff = cutoff.getTime() - cur.getTime();
      if (diff < 0) {
        cutoff.setDate(cutoff.getDate() + 1);
        diff = cutoff.getTime() - cur.getTime();
      }
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown({ hours, minutes, seconds });
    }, 1000);

    // Load 10% discount code only after 45 seconds on site
    let sessionStart = sessionStorage.getItem("nn_session_start");
    if (!sessionStart) {
      sessionStart = Date.now().toString();
      sessionStorage.setItem("nn_session_start", sessionStart);
    }

    const elapsed = Date.now() - parseInt(sessionStart, 10);
    const remainingTime = Math.max(0, 45000 - elapsed);

    if (remainingTime === 0) {
      setShowCoupon(true);
    } else {
      const timer = setTimeout(() => {
        setShowCoupon(true);
      }, remainingTime);

      return () => {
        clearTimeout(timer);
        clearInterval(viewersTimer);
        clearInterval(recentOrderTimer);
        clearTimeout(initialToastTimer);
        clearInterval(countdownTimer);
      };
    }

    return () => {
      clearInterval(viewersTimer);
      clearInterval(recentOrderTimer);
      clearTimeout(initialToastTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  const variant = product.variants[selectedVariantIdx];
  const price = variant?.price ?? product.price;
  const compareAt = variant?.compareAtPrice ?? product.compareAtPrice;
  const discount = compareAt ? discountPercent(price, compareAt) : 0;
  const savingsRupees = compareAt ? Math.round((compareAt - price) / 100) : 0;

  useEffect(() => {
    trackEvent("view_item", {
      currency: "INR",
      value: price,
      items: [{
        item_id: product.id,
        item_name: product.title,
        price: price
      }]
    });
  }, [product.id, product.title, price]);

  const reviewStats = PRODUCT_REVIEW_STATS[product.slug] || { total: 1688, average: 4.9 };

  function handleAddToCart() {
    addToCart(
      {
        productId: product.id,
        variantId: variant.id,
        slug: product.slug,
        title: product.title,
        variantTitle: variant.title,
        price,
        image: product.images[0] ?? "",
      },
      qty
    );
    
    trackEvent("add_to_cart", {
      currency: "INR",
      value: price * qty,
      items: [{
        item_id: product.id,
        item_name: product.title,
        quantity: qty,
        price: price
      }]
    });

    open();
    
    const vTitle = (variant.title || "").toLowerCase();
    if (vTitle.includes("500")) {
      toast.success(`Added 500ml Ghee to cart. Tip: Upgrade to 1L for complimentary Mustard Oil (250ml)!`, { duration: 4000 });
    } else if (vTitle.includes("2.5")) {
      toast.success(`Added 2.5L Ghee to cart! 3 complimentary Cold-Pressed Oils included in your order!`, { duration: 4000 });
    } else if (vTitle.includes("5 litre") || vTitle.includes("5l")) {
      toast.success(`Added 5L Ghee to cart! 3 complimentary Cold-Pressed Oils (Coconut, Groundnut & Mustard) included!`, { duration: 4000 });
    } else {
      toast.success(`Added 1L Ghee to cart! Complimentary Mustard Oil (250ml) included in your order!`, { duration: 4000 });
    }
  }

  function handleBuyNow() {
    setIsAdding(true);
    addToCart(
      {
        productId: product.id,
        variantId: variant.id,
        slug: product.slug,
        title: product.title,
        variantTitle: variant.title,
        price,
        image: product.images[0] ?? "",
      },
      qty
    );
    trackEvent("begin_checkout", {
      currency: "INR",
      value: price * qty,
    });
    router.push("/checkout");
  }

  function handleCopyCoupon(code: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCodeCopied(true);
      toast.success(`Coupon code ${code} copied! Applied at checkout.`);
      setTimeout(() => setCodeCopied(false), 3000);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 pb-24 md:pb-16 relative">

      {/* Gallery (Left Side) */}
      <div className="space-y-3.5 md:sticky md:top-24 md:self-start">
        <div 
          className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF9F5] border border-gray-100 shadow-sm group select-none"
          onMouseEnter={() => setIsGalleryHovered(true)}
          onMouseLeave={() => setIsGalleryHovered(false)}
        >
          {/* Layered Cross-Fading Images (Auto-changes every 3s with smooth fade) */}
          {product.images && product.images.length > 0 ? (
            product.images.map((img, idx) => (
              <div
                key={img}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  idx === selectedImage ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.title} - photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center text-nn-bark/30 text-lg">No Image</div>
          )}

          {/* Previous & Next Arrow Controls (Visible on hover and easy tap on mobile) */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer shadow-md active:scale-95"
                aria-label="Previous product image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev + 1) % product.images.length);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer shadow-md active:scale-95"
                aria-label="Next product image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots Progress Indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`Jump to image ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === selectedImage ? "w-5 bg-amber-300 shadow-xs" : "w-1.5 bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Quality & Trust Badges on Image */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            <span className="bg-[#8A1B14] text-amber-200 text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-amber-400/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              100% Pure Vedic A2
            </span>
            <span className="bg-[#8A1B14] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              100% Traditional Bilona
            </span>
            {discount > 0 && (
              <span className="bg-[#C38936] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md w-fit">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-md shadow flex items-center gap-1.5 z-20">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>FSSAI Lic: 10823999000412</span>
          </div>
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                  i === selectedImage ? "border-[#8A1B14] ring-2 ring-[#8A1B14]/30 scale-105 opacity-100 shadow-xs" : "border-gray-200 hover:border-gray-400 opacity-60 hover:opacity-100"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}

        {/* Mini Trust Highlights Box below Gallery on Desktop */}
        <div className="hidden md:grid grid-cols-2 gap-3 p-4 bg-[#FCFAF5] rounded-xl border border-amber-200/60">
          <div className="flex items-center gap-2.5 text-xs text-[#5E0B10] font-medium">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-[#8A1B14] shrink-0 font-bold">✓</div>
            <span>Curd Churned (Not Cream Separator)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#5E0B10] font-medium">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-bold">✓</div>
            <span>Slow Cooked in Traditional Vessels</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#5E0B10] font-medium">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-[#8A1B14] shrink-0 font-bold">✓</div>
            <span>No Palm Oil or Chemical Adulteration</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#5E0B10] font-medium">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-bold">✓</div>
            <span>Aromatic Golden Granular Danedar Texture</span>
          </div>
        </div>
      </div>

      {/* Details (Right Side) */}
      <div className="flex flex-col">
        {/* Title & Share */}
        <div className="flex justify-between items-start gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-[#8A1B14] text-amber-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-amber-400/50 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>100% PURE BILONA</span>
              </span>
              <span className="text-xs uppercase tracking-widest font-extrabold text-[#C38936]">
                Pure Desi Vedic Cow Ghee
              </span>
            </div>
            <h1 className="text-3xl lg:text-[34px] leading-tight font-serif font-bold text-[#5E0B10]">{product.title}</h1>
          </div>
          <button 
            className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition shrink-0 shadow-sm" 
            aria-label="Share product"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.title,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }
            }}
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Reviews and Ratings badge */}
        <div className="flex items-center gap-3 mb-2.5">
          <button 
            onClick={() => {
              const el = document.getElementById("product-reviews-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-[#FDF6E8] px-3 py-1 rounded-full border border-[#EAD7BC]"
          >
            <div className="flex text-[#D4A017]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(reviewStats.average) ? "fill-current" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-[#5E0B10]">{reviewStats.average}★ ({reviewStats.total} reviews)</span>
          </button>
          <span className="text-xs text-gray-500 font-medium">• 100% Verified Buyers</span>
        </div>

        {/* Real-time Viewers & Demand Signals (High Converting Urgency) */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200/80 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>{liveViewers} people viewing right now</span>
          </div>
          <div className="inline-flex items-center gap-1 text-xs text-[#5E0B10] font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/70 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-[#C38936] fill-current" />
            <span>29 jars dispatched today</span>
          </div>
        </div>

        {/* Variants & Packs Selector (500ml, 1L, 2.5L, 5L) - Positioned High for Instant Mobile Access */}
        {gheePacks && gheePacks.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-sm font-extrabold text-[#5E0B10] flex items-center gap-1.5">
                <span>Select Pack Size:</span>
                <span className="text-[11px] font-normal text-gray-500 hidden sm:inline">(Bigger Pack = Bigger Savings)</span>
              </label>
              <span className="text-[11px] sm:text-xs font-bold text-[#8A1B14] bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                Save up to 42%/L &rarr;
              </span>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
              {gheePacks.map((pack) => {
                let ml = 1000;
                let badge = null;
                let saveLabel = null;
                let badgeBg = "bg-gray-900 text-white";
                let packRole = "Daily Use";
                
                if (pack.slug.includes("500-ml")) {
                  ml = 500;
                  badge = "STARTER";
                  badgeBg = "bg-[#7A4B2A] text-white";
                  packRole = "Trial Pack";
                } else if (pack.slug.includes("1-litre")) {
                  ml = 1000;
                  badge = "★ BESTSELLER";
                  badgeBg = "bg-[#C38936] text-white";
                  saveLabel = "Save 21%/L";
                  packRole = "Most Popular";
                } else if (pack.slug.includes("2-5-litre")) {
                  ml = 2500;
                  badge = "VALUE PACK";
                  badgeBg = "bg-[#8A1B14] text-white";
                  saveLabel = "Save 30%/L";
                  packRole = "Family Saver";
                } else if (pack.slug.includes("5-litre")) {
                  ml = 5000;
                  badge = "BEST VALUE";
                  badgeBg = "bg-[#5E0B10] text-amber-200 border border-amber-400/50";
                  saveLabel = "Save 42%/L";
                  packRole = "Mega Family";
                }
                
                const perLitre = Math.round((pack.price / 100) / (ml / 1000));
                const isSelected = product.slug === pack.slug || (product.slug.includes("500-ml") && pack.slug.includes("500-ml"));
                const packDiscount = pack.compareAtPrice ? discountPercent(pack.price, pack.compareAtPrice) : 0;
                const isNavigatingThis = navigatingSlug === pack.slug;

                return (
                  <button
                    key={pack.id}
                    onClick={() => {
                      if (!isSelected) {
                        setNavigatingSlug(pack.slug);
                        router.push(`/products/${pack.slug}`);
                      }
                    }}
                    className={`relative text-left rounded-xl border-2 flex flex-col overflow-hidden transition-all duration-150 transform active:scale-95 ${
                      isSelected 
                        ? "border-[#8A1B14] bg-amber-50/40 ring-2 ring-[#8A1B14]/30 shadow-md scale-[1.01]" 
                        : "border-gray-200 bg-white hover:border-[#8A1B14]/50 hover:bg-gray-50/60 shadow-2xs"
                    }`}
                  >
                    {/* Top Header */}
                    <div className={`px-2 py-1 sm:px-2.5 sm:py-1.5 flex justify-between items-center text-[11px] sm:text-xs ${
                      isSelected ? "bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white" : "bg-gray-100 text-gray-800"
                    }`}>
                      <span className="font-extrabold truncate">
                        {pack.variants[0]?.title ?? pack.title.split(' ').slice(-2).join(' ')}
                      </span>
                      {isNavigatingThis ? (
                        <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                      ) : badge ? (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider shrink-0 ${badgeBg}`}>
                          {badge}
                        </span>
                      ) : null}
                    </div>
                    
                    {/* Bottom Details */}
                    <div className="p-2 sm:p-2.5 flex flex-col gap-1 flex-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm sm:text-base font-extrabold text-[#5E0B10]">
                          Rs. {Math.round(pack.price / 100).toLocaleString('en-IN')}
                        </span>
                        {pack.compareAtPrice && (
                          <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">
                            Rs. {Math.round(pack.compareAtPrice / 100).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                        <span className="font-bold text-[#8A1B14]">{packDiscount}% off</span>
                        <span className="text-gray-500 text-[9px] sm:text-[10px]">{packRole}</span>
                      </div>
                      
                      <div className="mt-auto pt-1 sm:pt-1.5 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#8A1B14]">
                          ₹{perLitre.toLocaleString("en-IN")}/L
                        </span>
                        {saveLabel && (
                          <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-800 bg-amber-50 px-1 py-0.5 rounded border border-amber-200/50">
                            {saveLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Pricing Box with High-Contrast Mobile Clean Layout */}
        <div className="mb-4 bg-gradient-to-br from-[#FFFDF7] via-[#FCFAF5] to-white p-3.5 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs">
          <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 mb-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#5E0B10] tracking-tight">
              Rs. {(price / 100).toLocaleString('en-IN')}
            </span>
            {compareAt && compareAt > price && (
              <span className="text-xl sm:text-2xl text-gray-400 line-through font-medium">
                Rs. {(compareAt / 100).toLocaleString('en-IN')}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-[#8A1B14] text-amber-200 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Save {discount}% (₹{savingsRupees.toLocaleString('en-IN')} OFF)
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-2">
            <span className="font-semibold text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
              FREE Express Shipping Pan-India
            </span>
            <span className="text-gray-500">MRP (Inclusive of all taxes)</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-200/70 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5E0B10]">
            <span className="flex items-center gap-1.5 font-bold">
              <Factory className="w-4 h-4 text-[#C38936]" />
              Authentic Wooden Bilona Churned from Curd
            </span>
            <span className="text-[#8A1B14] font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              Farm Fresh
            </span>
          </div>
        </div>

        {/* Authentic Same-Day Dispatch Cutoff Reassurance */}
        <div className="mb-4 p-3 sm:p-3.5 bg-[#FAF9F5] rounded-xl border border-[#EAD7BC] shadow-2xs flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FDF6E8] border border-[#D4A017] flex items-center justify-center text-[#8A1B14] shrink-0">
              <Truck className="w-3.5 h-3.5 text-[#8A1B14]" />
            </div>
            <div>
              <span className="font-bold text-[#5E0B10] block">Same-Day Farm Dispatch</span>
              <span className="text-[11px] text-[#7A4A3B]">Orders placed today dispatch before cutoff</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 bg-white px-2.5 py-1 rounded-lg border border-[#EAD7BC]">
            <Clock className="w-3.5 h-3.5 text-[#8A1B14]" />
            <span className="font-mono font-bold text-[#8A1B14] text-xs">
              {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>

        {/* Legitimate Trust & Verification Cards (Compact Mobile Micro-Grid) */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3 p-2 sm:p-3 rounded-xl bg-[#FCFAF5] border border-amber-200/60 shadow-2xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FDF6E8] flex items-center justify-center text-[#8A1B14] shrink-0">
              <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8A1B14]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] sm:text-xs font-bold text-[#5E0B10] block leading-tight">
                Small-Batch Gir Cows
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#7A4A3B] leading-tight block mt-0.5 hidden sm:block">
                Indigenous Gir Breed
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3 p-2 sm:p-3 rounded-xl bg-[#FBF8EF] border border-[#EEDBBA] shadow-2xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F8EFD8] flex items-center justify-center text-[#8C601E] shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C601E]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] sm:text-xs font-bold text-[#6D4911] block leading-tight">
                NABL Lab Certified
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#8C601E] leading-tight block mt-0.5 hidden sm:block">
                0% Adulteration Purity
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3 p-2 sm:p-3 rounded-xl bg-[#FCFAF5] border border-amber-200/60 shadow-2xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FDF6E8] flex items-center justify-center text-[#8A1B14] shrink-0">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8A1B14]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] sm:text-xs font-bold text-[#5E0B10] block leading-tight">
                FSSAI Central Lic
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#5E0B10] font-mono font-bold tracking-tight block mt-0.5 hidden sm:block">
                10823999000412
              </span>
            </div>
          </div>
        </div>

        {/* Free Gift Announcement */}
        <div className="mb-4 p-3 sm:p-3.5 bg-[#FAF9F5] rounded-xl border border-[#EAD7BC] flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FDF6E8] border border-[#D4A017] flex items-center justify-center text-[#8A1B14] shrink-0">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-[#8A1B14]" />
          </div>
          <div className="flex-1 text-xs">
            {((variant?.title || "").toLowerCase().includes("500")) ? (
              <>
                <span className="font-bold text-[#5E0B10] block">Special Tip:</span>
                <p className="text-[#7A4A3B] mt-0.5 leading-snug">
                  Choose the <strong>1 Litre pack</strong> to get a <strong className="text-[#8A1B14]">Complimentary 250ml Cold-Pressed Mustard Oil</strong> packed with your jar!
                </p>
              </>
            ) : ((variant?.title || "").toLowerCase().includes("2.5")) ? (
              <>
                <span className="font-bold text-[#5E0B10] block">3 Complimentary Gifts Included (2.5L Pack)</span>
                <p className="text-[#7A4A3B] mt-0.5 leading-snug">
                  Includes <strong>Groundnut (250ml)</strong> + <strong>Yellow Mustard (250ml)</strong> + <strong>Mustard Oil (250ml)</strong> 100% free!
                </p>
              </>
            ) : ((variant?.title || "").toLowerCase().includes("5 litre") || (variant?.title || "").toLowerCase().includes("5l")) ? (
              <>
                <span className="font-bold text-[#5E0B10] block">3 Large Gifts Included (5L Pack)</span>
                <p className="text-[#7A4A3B] mt-0.5 leading-snug">
                  Includes <strong>Coconut (250ml)</strong> + <strong>Groundnut (250ml)</strong> + <strong>Mustard Oil (500ml)</strong> 100% free!
                </p>
              </>
            ) : (
              <>
                <span className="font-bold text-[#5E0B10] block">Complimentary Gift Included (1L Pack)</span>
                <p className="text-[#7A4A3B] mt-0.5 leading-snug">
                  Includes <strong>1x Cold-Pressed Mustard Oil (250 ml)</strong> automatically included for free!
                </p>
              </>
            )}
          </div>
        </div>

        {/* Special Coupon Code */}
        <div className="mb-5 p-3.5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 rounded-xl border border-dashed border-amber-500/80 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#8A1B14] shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold text-[#8A1B14] block">Special 10% Discount:</span>
              <span className="font-mono font-black text-stone-900 bg-amber-300 px-2 py-0.5 rounded text-[11px] tracking-wider">
                NAMO10
              </span>
            </div>
          </div>
          <button
            onClick={() => handleCopyCoupon("NAMO10")}
            className="text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1 active:scale-95 cursor-pointer shrink-0"
          >
            {codeCopied ? <Check className="w-3.5 h-3.5 text-[#8A1B14]" /> : <Copy className="w-3.5 h-3.5 text-stone-900" />}
            <span>{codeCopied ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>

        {/* In-Page Main Action Section (Always visible on mobile & desktop) */}
        <div className="mb-4">
          <div className="mb-3 p-3 rounded-xl bg-[#FAF9F5] border border-[#EAD7BC] flex items-center gap-2.5 text-xs text-[#5E0B10]">
            <Gift className="w-4 h-4 text-[#8A1B14] shrink-0" />
            <span className="font-semibold">
              {((variant?.title || "").toLowerCase().includes("500"))
                ? "Select 1L pack to receive complimentary 250ml Cold-Pressed Mustard Oil"
                : "Complimentary Cold-Pressed Oil gift will be automatically included in your order"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 mb-2.5">
            {/* Quantity Stepper */}
            <div className="flex items-center justify-between sm:justify-start bg-[#FDF6E8] rounded-xl border border-[#F0DCB8] h-[52px] px-2 shrink-0">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))} 
                className="w-10 h-full flex items-center justify-center text-[#8A1B14] hover:bg-[#FBE9CE] active:scale-95 rounded-lg transition text-xl font-bold cursor-pointer"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center font-extrabold text-[#5E0B10] text-base">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)} 
                className="w-10 h-full flex items-center justify-center text-[#8A1B14] hover:bg-[#FBE9CE] active:scale-95 rounded-lg transition text-xl font-bold cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Instant Buy Now Button (High Impact Radiant Gold CTA) */}
            <button 
              onClick={handleBuyNow} 
              disabled={!variant?.available || isAdding} 
              className="flex-1 bg-gradient-to-r from-[#FFB800] via-[#F59E0B] to-[#D97706] hover:brightness-105 active:scale-[0.98] text-stone-950 font-black h-[52px] rounded-xl transition-all disabled:opacity-70 text-base sm:text-lg tracking-wide shadow-[0_4px_18px_rgba(245,158,11,0.45)] flex items-center justify-center gap-2 uppercase border border-amber-300 cursor-pointer"
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current text-stone-950" />
                  <span>Buy Now — ₹{((price * qty) / 100).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

            {/* Add To Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={!variant?.available}
              className="h-[52px] px-5 rounded-xl border-2 border-[#8A1B14] text-[#8A1B14] hover:bg-[#8A1B14] hover:text-white font-extrabold text-sm uppercase tracking-wide transition-all active:scale-[0.98] flex items-center justify-center gap-2 bg-[#FCFAF5] cursor-pointer shrink-0"
            >
              <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
              <span>Add to Cart</span>
            </button>
          </div>

          {/* Quick Payment & Trust Badges Strip */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-[11px] text-gray-600 mb-3 py-1.5 border-y border-amber-100">
            <span className="flex items-center gap-1 font-semibold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              UPI / Google Pay / Cards / COD
            </span>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1 font-semibold text-amber-900">
              <Truck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              Free Express Delivery
            </span>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1 font-semibold text-[#8A1B14]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8A1B14] shrink-0" />
              100% Purity Guarantee
            </span>
          </div>
        </div>

        {/* 100% Vedic Purity Money-Back Guarantee Risk Reversal Box */}
        <div className="mb-5 p-3.5 sm:p-4 bg-[#FAF9F5] rounded-xl border border-[#EAD7BC] shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#FDF6E8] flex items-center justify-center text-[#8A1B14] shrink-0 border border-[#D4A017] shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#8A1B14]" />
          </div>
          <div className="text-xs">
            <span className="font-extrabold text-[#5E0B10] block text-sm">100% Vedic Purity Guarantee</span>
            <p className="text-gray-600 mt-0.5 leading-snug">
              If our ghee is not 100% authentic Bilona Ghee made with traditional wooden churner from curd, get a <strong>100% instant refund</strong>. No hassle, no questions asked.
            </p>
          </div>
        </div>

        {/* Sticky Mobile Buy Bar (Mobile Only: Ensures 1-Tap Checkout is always within thumb reach) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-3 py-2.5 border-t border-amber-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {/* Sticky Pack Quick Switcher */}
          {gheePacks && gheePacks.length > 0 && (
            <div className="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b border-gray-100">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0">Pack:</span>
              <div className="flex items-center gap-1.5 flex-1 justify-end overflow-x-auto scrollbar-hide py-0.5">
                {gheePacks.map((pack) => {
                  const isSelected = product.slug === pack.slug || (product.slug.includes("500-ml") && pack.slug.includes("500-ml"));
                  const shortName = pack.slug.includes("500-ml") ? "500ml" : pack.slug.includes("1-litre") ? "1L" : pack.slug.includes("2-5-litre") ? "2.5L" : "5L";
                  const shortPrice = `₹${Math.round(pack.price / 100).toLocaleString('en-IN')}`;
                  const isNavigatingThis = navigatingSlug === pack.slug;
                  return (
                    <button
                      key={pack.id}
                      onClick={() => {
                        if (!isSelected) {
                          setNavigatingSlug(pack.slug);
                          router.push(`/products/${pack.slug}`);
                        }
                      }}
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                        isSelected
                          ? "bg-[#8A1B14] text-white shadow-xs ring-1 ring-[#8A1B14]"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                      }`}
                    >
                      {isNavigatingThis ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <span>{shortName}</span>
                          <span className={`text-[10px] ${isSelected ? "text-amber-300 font-semibold" : "text-gray-500"}`}>{shortPrice}</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sticky CTA Row */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-[#5E0B10]">
                  ₹{((price * qty) / 100).toLocaleString('en-IN')}
                </span>
                {compareAt && compareAt > price && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{((compareAt * qty) / 100).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 flex items-center gap-0.5 truncate">
                <Gift className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>FREE Gift Included + Free Shipping</span>
              </span>
            </div>

            <button 
              onClick={handleBuyNow} 
              disabled={!variant?.available || isAdding} 
              className="bg-gradient-to-r from-[#FFB800] via-[#F59E0B] to-[#D97706] hover:brightness-105 active:scale-95 text-stone-950 font-black h-[46px] px-5 rounded-xl shadow-[0_4px_14px_rgba(245,158,11,0.5)] flex items-center justify-center gap-1.5 uppercase text-sm border border-amber-300 shrink-0 cursor-pointer"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current text-stone-950" />
                  <span>Buy Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Delivery & Pincode Reassurance */}
        <div className="mb-6 p-4 bg-[#FCFAF5] rounded-xl border border-amber-200/60 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#5E0B10]">
            <Truck className="w-4 h-4 text-[#8A1B14]" />
            <span>Estimated Delivery: <strong className="text-[#8A1B14]">{deliveryDateStr}</strong></span>
          </div>
          <p className="text-gray-600 pl-6">
            Dispatches from our farm within <strong>24 hours</strong>. Free Express Delivery across 19,000+ Indian pincodes.
          </p>
          <div className="flex items-center gap-2 text-gray-700 font-medium pt-1 border-t border-amber-200/50 pl-6">
            <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>100% Safe &amp; Secure Checkout via UPI, Google Pay, PhonePe, Cards &amp; NetBanking</span>
          </div>
        </div>

        {/* Trust Guarantees Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 pb-6 border-t border-gray-200">
          <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FDF6E8] flex items-center justify-center text-[#8A1B14] mb-1.5">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#5E0B10] leading-tight">Free Express Shipping</span>
            <span className="text-[10px] text-gray-500 mt-0.5">Pan India</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FDF6E8] flex items-center justify-center text-[#8A1B14] mb-1.5">
              <Factory className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#5E0B10] leading-tight">Vedic Bilona Churned</span>
            <span className="text-[10px] text-gray-500 mt-0.5">From Whole Curd</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FDF6E8] flex items-center justify-center text-[#8A1B14] mb-1.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#5E0B10] leading-tight">100% Purity Guarantee</span>
            <span className="text-[10px] text-gray-500 mt-0.5">Or Full Refund</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#FDF6E8] flex items-center justify-center text-[#8A1B14] mb-1.5">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#5E0B10] leading-tight">NABL Lab Certified</span>
            <span className="text-[10px] text-gray-500 mt-0.5">0% Adulteration</span>
          </div>
        </div>

        {/* Why 24,000+ Families Choose Us Comparison Table */}
        <div className="mb-8 p-4 sm:p-5 bg-[#FAF9F5] rounded-2xl border border-amber-200/60">
          <h3 className="font-serif font-bold text-lg text-[#5E0B10] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C38936]" />
            Why Families Choose Namo Narayana vs Commercial Ghee
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 pr-2 text-gray-500 font-semibold">Criteria</th>
                  <th className="py-2 px-2 text-[#8A1B14] font-extrabold bg-amber-100/70 rounded-t-lg">Namo Narayana</th>
                  <th className="py-2 pl-2 text-gray-400 font-semibold">Store-Bought Ghee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                <tr>
                  <td className="py-2 pr-2 font-medium text-gray-700">Source</td>
                  <td className="py-2 px-2 text-[#5E0B10] font-bold bg-amber-50/50">100% Indigenous Gir Cows</td>
                  <td className="py-2 pl-2 text-gray-500">Commercial Buffalo/Jersey Milk</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-medium text-gray-700">Churning</td>
                  <td className="py-2 px-2 text-[#5E0B10] font-bold bg-amber-50/50">Hand-churned Curd (Bilona)</td>
                  <td className="py-2 pl-2 text-gray-500">Machine cream separator</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-medium text-gray-700">Digestibility</td>
                  <td className="py-2 px-2 text-[#5E0B10] font-bold bg-amber-50/50">Easy on Gut (A2 Protein)</td>
                  <td className="py-2 pl-2 text-gray-500">Heavy, bloating (A1 Protein)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-medium text-gray-700">Aroma & Texture</td>
                  <td className="py-2 px-2 text-[#5E0B10] font-bold bg-amber-50/50">Rich Danedar & Sweet Aroma</td>
                  <td className="py-2 pl-2 text-gray-500">Artificial essence added</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-[#5E0B10] uppercase tracking-wider mb-3">Product Description & Benefits</h2>
          <div className="prose prose-sm max-w-none text-gray-800 marker:text-[#8A1B14]" dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>

      </div>

      {/* Product Journey Section */}
      <div className="col-span-1 md:col-span-2 w-[100vw] relative left-1/2 -translate-x-1/2 mt-10 md:mt-20">
        <ProductJourney />
      </div>

      {/* Customer Reviews Section */}
      <div id="product-reviews-section" className="col-span-1 md:col-span-2 mt-10 pt-8 border-t border-gray-200">
        <ProductReviews 
          reviews={PRODUCT_REVIEWS_MAP[product.slug] || PRODUCT_REVIEWS_MAP["pure-desi-cow-ghee-1-litre"]} 
          totalReviews={reviewStats?.total || 1688} 
          averageRating={reviewStats?.average || 4.9} 
        />
      </div>

      {/* Live Verified Order Social Proof Toast (Bottom Left) */}
      <div
        className={`fixed bottom-24 md:bottom-6 left-4 z-40 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md border border-amber-300/80 rounded-2xl p-3 shadow-xl transition-all duration-500 flex items-center gap-2.5 ${
          showRecentToast ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0 text-sm">
          ✓
        </div>
        <div className="min-w-0 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-[#5E0B10] truncate">{RECENT_ORDERS[recentOrderIdx].name}</span>
            <span className="text-[10px] text-gray-500 font-normal">from {RECENT_ORDERS[recentOrderIdx].city}</span>
          </div>
          <p className="text-[11px] text-gray-700 font-medium truncate">
            Ordered {RECENT_ORDERS[recentOrderIdx].item}
          </p>
          <span className="text-[10px] text-amber-700 font-bold">{RECENT_ORDERS[recentOrderIdx].time}</span>
        </div>
      </div>
    </div>
  );
}
