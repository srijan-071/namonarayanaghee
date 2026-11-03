"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { formatPrice, discountPercent } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { trackAdLeadAction } from "@/lib/visitor";
import type { Product } from "@/lib/types";
import { toast } from "sonner";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Gift,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Zap,
  Award,
  Leaf,
  Factory,
  ArrowRight
} from "lucide-react";
import ProductReviews from "./ProductReviews";
import ProductJourney from "./ProductJourney";
import { PRODUCT_REVIEWS_MAP, PRODUCT_REVIEW_STATS } from "@/lib/reviews-data";

interface ProductDetailsProps {
  product: Product;
  gheePacks?: Product[] | null;
}

export default function ProductDetails({ product, gheePacks }: ProductDetailsProps) {
  const router = useRouter();
  const { open } = useCartDrawer();

  // State
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);
  const [navigatingSlug, setNavigatingSlug] = useState<string | null>(null);

  // Delivery & PIN state
  const [pinInput, setPinInput] = useState("");
  const [pinStatus, setPinStatus] = useState<"idle" | "loading" | "success" | "fallback">("idle");
  const [pinMessage, setPinMessage] = useState("");
  const [deliveryDateStr, setDeliveryDateStr] = useState("3 – 5 Business Days");

  // Variant & Pricing calculation from authoritative product config
  const variant = product.variants[selectedVariantIdx] || product.variants[0];
  const price = variant?.price ?? product.price;
  const compareAt = variant?.compareAtPrice ?? product.compareAtPrice;
  const discount = compareAt && compareAt > price ? discountPercent(price, compareAt) : 0;
  const savingsRupees = compareAt && compareAt > price ? Math.round((compareAt - price) / 100) : 0;

  // Review stats
  const reviewStats = PRODUCT_REVIEW_STATS[product.slug] || { total: 1688, average: 4.9 };

  // Clear navigating slug when product updates & prefetch sibling packs
  useEffect(() => {
    setNavigatingSlug(null);
  }, [product.slug]);

  useEffect(() => {
    router.prefetch("/checkout");
    if (gheePacks && gheePacks.length > 0) {
      gheePacks.forEach((p) => {
        if (p.slug !== product.slug) {
          router.prefetch(`/products/${p.slug}`);
        }
      });
    }

    // Dynamic arrival estimate (3 to 5 days)
    const now = new Date();
    const d1 = new Date(now);
    d1.setDate(now.getDate() + 3);
    const d2 = new Date(now);
    d2.setDate(now.getDate() + 5);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    setDeliveryDateStr(`${d1.toLocaleDateString("en-IN", options)} – ${d2.toLocaleDateString("en-IN", options)}`);
  }, [router, gheePacks, product.slug]);

  // ViewItem analytics tracking (deduplicated per slug)
  const trackedViewRef = useRef<string | null>(null);
  useEffect(() => {
    if (trackedViewRef.current !== product.slug) {
      trackedViewRef.current = product.slug;
      trackEvent("view_item", {
        currency: "INR",
        value: price,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            price: price,
          },
        ],
      });
    }
  }, [product.slug, product.id, product.title, price]);

  // Pack detection
  const slugLower = product.slug.toLowerCase();
  const is500ml = slugLower.includes("500-ml") || slugLower.includes("500ml");
  const is1L = slugLower.includes("1-litre") || slugLower.includes("1l");
  const is2_5L = slugLower.includes("2-5-litre") || slugLower.includes("2.5");
  const is5L = slugLower.includes("5-litre") || slugLower.includes("5l");

  // Gift definition based strictly on selected pack (Section 7)
  const giftData = useMemo(() => {
    if (is500ml) {
      return {
        hasGift: false,
        title: "Gift Offer Available with Larger Packs",
        description: "Choose 1 Litre or larger packs to receive complimentary cold-pressed oil gifts.",
        badge: "STARTER PACK",
        items: [] as Array<{ name: string; image: string; size: string }>,
      };
    } else if (is2_5L) {
      return {
        hasGift: true,
        title: "3 Complimentary Cold-Pressed Oils Included",
        description: "Your order includes 3 complimentary cold-pressed oils (250ml each).",
        badge: "DIWALI GIFT",
        items: [
          { name: "Groundnut Oil", image: "/assets/groundnut-oil-250ml.webp", size: "250 ml" },
          { name: "Yellow Mustard Oil", image: "/assets/yellow-mustard-oil-250ml.webp", size: "250 ml" },
          { name: "Mustard Oil", image: "/assets/mustard-oil-250ml.webp", size: "250 ml" },
        ],
      };
    } else if (is5L) {
      return {
        hasGift: true,
        title: "3 Complimentary Large Cold-Pressed Oils Included",
        description: "Your order includes 3 complimentary cold-pressed oils (Coconut 250ml, Groundnut 250ml, Mustard 500ml).",
        badge: "DIWALI GIFT",
        items: [
          { name: "Coconut Oil", image: "/assets/coconut-oil-250ml.webp", size: "250 ml" },
          { name: "Groundnut Oil", image: "/assets/groundnut-oil-250ml.webp", size: "250 ml" },
          { name: "Mustard Oil", image: "/assets/mustard-oil-500ml.webp", size: "500 ml" },
        ],
      };
    } else {
      // 1 Litre
      return {
        hasGift: true,
        title: "Complimentary Cold-Pressed Mustard Oil Included",
        description: "Your order includes 1 complimentary bottle of Cold-Pressed Mustard Oil (250ml).",
        badge: "DIWALI GIFT",
        items: [
          { name: "Mustard Oil", image: "/assets/mustard-oil-250ml.webp", size: "250 ml" },
        ],
      };
    }
  }, [is500ml, is1L, is2_5L, is5L]);

  // Add to Cart handler (Section 12)
  const handleAddToCart = () => {
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
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          quantity: qty,
          price: price,
        },
      ],
    });

    open();

    // If customer came from a Meta Ad link, notify ad bot
    trackAdLeadAction("add_to_cart", {
      itemTitle: product.title,
      variantTitle: variant.title,
      price: price,
      quantity: qty,
      cartTotal: price * qty,
      freeGift: giftData.hasGift ? giftData.giftText : null,
    });

    if (giftData.hasGift) {
      toast.success(`Added ${product.title} to cart · Complimentary gift included!`);
    } else {
      toast.success(`Added ${product.title} to cart.`);
    }
  };

  // Buy Now handler (Section 12)
  const handleBuyNow = () => {
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
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          quantity: qty,
          price: price,
        },
      ],
    });

    trackAdLeadAction("add_to_cart", {
      itemTitle: product.title,
      variantTitle: variant.title,
      price: price,
      quantity: qty,
      cartTotal: price * qty,
      freeGift: giftData.hasGift ? giftData.giftText : null,
    });

    router.push("/checkout");
  };

  // Copy coupon handler (Section 10)
  const handleCopyCoupon = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCouponCopied(true);
      toast.success(`Coupon code ${code} copied! Apply at checkout for 10% off.`);
      setTimeout(() => setCouponCopied(false), 3000);
    }
  };

  // PIN code checker (Section 8)
  const handleCheckPincode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPin = pinInput.trim().replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      setPinStatus("fallback");
      setPinMessage("Please enter a valid 6-digit PIN code.");
      return;
    }

    setPinStatus("loading");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const city = po.District || po.Block || "Your Area";
          const state = po.State || "";
          const statusText = `Delivery available to ${city}${state ? `, ${state}` : ""} · COD available (3–5 days).`;
          setPinStatus("success");
          setPinMessage(statusText);
          trackAdLeadAction("pincode_checked", {
            pincode: cleanPin,
            pincodeStatus: statusText,
          });
          return;
        }
      }
    } catch {
      // API failure fallback
    }

    // Graceful non-blocking fallback
    setPinStatus("fallback");
    setPinMessage("Delivery available pan-India · COD available (3–5 days).");
  };

  // Diwali Reward Promotion
  const rewardAmount = useMemo(() => {
    if (is500ml) return 100;
    if (is1L) return 250;
    if (is2_5L) return 500;
    if (is5L) return 1000;
    return 0;
  }, [is500ml, is1L, is2_5L, is5L]);

  // Automatic image slideshow
  useEffect(() => {
    if (product.images.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [product.images.length]);

  // Section 14: Diwali Banner
  return (
    <div className="pb-28 lg:pb-12 text-[#24211E]">

      {/* DIWALI PROMO BANNER */}
      <div className="mb-6 bg-gradient-to-r from-[#8A1B14] to-[#4E1013] rounded-2xl p-4 sm:p-5 text-white flex items-center justify-between shadow-lg">
        <div>
          <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
            <Sparkles className="text-[#D6A53B]" /> Diwali Special Reward
          </h3>
          <p className="text-[11px] sm:text-xs opacity-90 mt-1">
            Order now and get a <strong>₹{rewardAmount} Gift Card</strong> for your next purchase!
          </p>
        </div>
        <div className="text-center bg-white/10 rounded-lg p-2 min-w-[70px]">
          <span className="block text-xl font-bold">₹{rewardAmount}</span>
          <span className="text-[9px] uppercase tracking-wider">Discount</span>
        </div>
      </div>

      {/* 2-Column Responsive Product Container (Section 14) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

        {/* ═══ LEFT COLUMN: Product Gallery (Section 4, Section C) ═══ */}
        <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-24 space-y-3">
          {/* Main Visual Display */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF8F2] border border-[#E9E3D9] shadow-xs select-none group">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <div
                  key={img}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                    idx === selectedImage ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} - photo ${idx + 1}`}
                    fill
                    className="object-contain p-2 sm:p-4"
                    priority={idx === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
                No image available
              </div>
            )}

            {/* Restrained Single Image Overlay (Section 4, Section C) */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              <span className="bg-[#4E1013]/90 backdrop-blur-xs text-[#FAF8F2] text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-2xs border border-[#701619]/40">
                Traditional Bilona
              </span>
            </div>

            {/* Gallery Arrow Controls */}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#24211E] flex items-center justify-center backdrop-blur-xs transition-all z-20 cursor-pointer shadow-xs border border-[#E9E3D9] active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev + 1) % product.images.length);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#24211E] flex items-center justify-center backdrop-blur-xs transition-all z-20 cursor-pointer shadow-xs border border-[#E9E3D9] active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      aria-label={`Jump to photo ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                        i === selectedImage ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Clean Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-[#FAF8F2] border transition-all cursor-pointer shrink-0 ${
                    i === selectedImage
                      ? "border-[#701619] ring-2 ring-[#701619]/25 opacity-100 shadow-2xs"
                      : "border-[#E9E3D9] hover:border-stone-400 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View photo ${i + 1}`}
                >
                  <Image src={img} alt="" fill className="object-contain p-1" sizes="72px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══ RIGHT COLUMN: Product Information & Purchase (Section 4, Section D) ═══ */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col space-y-5">

          {/* SECTION D: Product Title & Credibility */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#77716A]">
              Pure Desi Vedic Cow Ghee
            </span>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#4E1013] leading-tight">
              {product.title}
            </h1>

            {/* Official Store Indicator & Reviews */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 text-[#4E1013] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Official Store by Elvish Yadav</span>
              </span>
              <span className="text-[#E9E3D9]">|</span>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("product-reviews-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 text-[#24211E] hover:text-[#701619] transition-colors cursor-pointer"
              >
                <div className="flex text-[#D6A53B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(reviewStats.average) ? "fill-current text-[#D6A53B]" : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{reviewStats.average}★</span>
                <span className="text-[#77716A]">({reviewStats.total} reviews)</span>
                <span className="text-[#77716A] text-[11px]">• Verified Buyers</span>
              </button>
            </div>
          </div>

          {/* ═══ SECTION 5: Pack Size Selector ═══ */}
          {gheePacks && gheePacks.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4E1013] uppercase tracking-wide">
                  Select Pack Size:
                </span>
                <span className="text-[11px] font-medium text-[#77716A]">
                  Direct from farm gaushala
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {gheePacks.map((pack) => {
                  let ml = 1000;
                  let packRole = "Starter Pack";
                  let giftNote = "";

                  if (pack.slug.includes("500-ml")) {
                    ml = 500;
                    packRole = "Starter Pack";
                    giftNote = "Trial Size";
                  } else if (pack.slug.includes("1-litre")) {
                    ml = 1000;
                    packRole = "Bestseller";
                    giftNote = "+ Free Mustard Oil";
                  } else if (pack.slug.includes("2-5-litre")) {
                    ml = 2500;
                    packRole = "Value Pack";
                    giftNote = "+ 3 Free Oils";
                  } else if (pack.slug.includes("5-litre")) {
                    ml = 5000;
                    packRole = "Best Value";
                    giftNote = "+ 3 Large Free Oils";
                  }

                  const perLitre = Math.round((pack.price / 100) / (ml / 1000));
                  const isSelected = product.slug === pack.slug || (product.slug.includes("500-ml") && pack.slug.includes("500-ml"));
                  const isNavigatingThis = navigatingSlug === pack.slug;

                  return (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => {
                        if (!isSelected) {
                          trackAdLeadAction("pack_selected", {
                            packTitle: pack.title,
                            packPrice: formatPrice(pack.price),
                            previousPack: product.title,
                          });
                          setNavigatingSlug(pack.slug);
                          router.push(`/products/${pack.slug}`);
                        }
                      }}
                      className={`relative text-left rounded-xl p-3 border transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "border-[#701619] bg-[#FAF8F2] ring-1 ring-[#701619] shadow-2xs"
                          : "border-[#E9E3D9] bg-white hover:border-[#701619]/40 hover:bg-[#FAF8F2]/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div>
                          <span className="font-bold text-sm text-[#24211E] block">
                            {pack.variants[0]?.title ?? pack.title.split(" ").slice(-2).join(" ")}
                          </span>
                          <span className="text-[11px] font-semibold text-[#701619] block">
                            {packRole}
                          </span>
                        </div>
                        {isNavigatingThis ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#701619] shrink-0" />
                        ) : isSelected ? (
                          <span className="w-4 h-4 rounded-full bg-[#701619] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-2 pt-2 border-t border-[#E9E3D9]/60 flex items-baseline justify-between">
                        <div>
                          <span className="text-base font-bold text-[#4E1013]">
                            ₹{Math.round(pack.price / 100).toLocaleString("en-IN")}
                          </span>
                          {pack.compareAtPrice && pack.compareAtPrice > pack.price && (
                            <span className="text-[11px] text-stone-400 line-through ml-1.5 font-normal">
                              ₹{Math.round(pack.compareAtPrice / 100).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-medium text-[#77716A]">
                          ₹{perLitre.toLocaleString("en-IN")}/L
                        </span>
                      </div>

                      {giftNote && (
                        <div className="mt-1 text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                          <Gift className="w-3 h-3 shrink-0" />
                          <span className="truncate">{giftNote}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ SECTION 6: Single Clear Price Summary ═══ */}
          <div className="bg-[#FAF8F2] border border-[#E9E3D9] rounded-xl p-3.5 sm:p-4 space-y-2">
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-bold text-[#4E1013] tracking-tight">
                ₹{(price / 100).toLocaleString("en-IN")}
              </span>
              {compareAt && compareAt > price && (
                <span className="text-base text-stone-400 line-through font-normal">
                  MRP ₹{(compareAt / 100).toLocaleString("en-IN")}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-[#16794B] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-2xs">
                  Save ₹{savingsRupees.toLocaleString("en-IN")} ({discount}% OFF)
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#77716A] pt-1">
              <span className="text-[#16794B] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#16794B]" /> Free Pan-India Delivery
              </span>
              <span>•</span>
              <span className="font-medium text-[#24211E]">Cash on Delivery Available</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">Extra ₹100 OFF on Prepaid</span>
            </div>
          </div>

          {/* ═══ SECTION 7: Diwali Gift Promotion (Inline, Non-Intrusive) ═══ */}
          <div className="border border-[#E9E3D9] bg-white rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#701619] uppercase tracking-wide flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-[#701619]" />
                <span>{giftData.badge}</span>
              </span>
              <span className="text-[11px] font-semibold text-[#16794B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                Automatically Added · ₹0
              </span>
            </div>

            <p className="text-xs text-[#24211E] font-medium leading-relaxed">
              {giftData.description}
            </p>

            {giftData.items.length > 0 ? (
              <div className="flex items-center gap-2.5 overflow-x-auto pt-1">
                {giftData.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-[#FAF8F2] border border-[#E9E3D9] rounded-lg p-1.5 pr-2.5 shrink-0"
                  >
                    <div className="relative w-9 h-9 bg-white rounded border border-[#E9E3D9] shrink-0 overflow-hidden flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <span className="font-bold text-[#4E1013] block">{item.name}</span>
                      <span className="text-stone-500 text-[10px]">{item.size} • Free Gift</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const p1L = gheePacks?.find((p) => p.slug.includes("1-litre"));
                    if (p1L) {
                      setNavigatingSlug(p1L.slug);
                      router.push(`/products/${p1L.slug}`);
                    }
                  }}
                  className="text-xs font-bold text-[#701619] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Upgrade to 1 Litre pack to unlock free cold-pressed oil gift</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* ═══ SECTION 8: Delivery & Dispatch with Simple PIN Checker ═══ */}
          <div className="border border-[#E9E3D9] bg-[#FAF8F2] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#4E1013]">
                <Truck className="w-4 h-4 text-[#701619]" />
                <span>Estimated Delivery: {deliveryDateStr}</span>
              </div>
              <span className="text-[11px] text-[#77716A]">Pan-India</span>
            </div>

            <p className="text-xs text-[#77716A] leading-relaxed">
              Handcrafted in small batches. Dispatched directly from farms within 24 hours.
            </p>

            {/* PIN Code Lookup Form */}
            <form onSubmit={handleCheckPincode} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinStatus !== "idle") setPinStatus("idle");
                }}
                placeholder="Enter 6-digit delivery PIN"
                className="flex-1 bg-white border border-[#E9E3D9] rounded-lg px-3 py-1.5 text-xs placeholder-[#77716A] focus:outline-none focus:border-[#701619] text-[#24211E]"
              />
              <button
                type="submit"
                disabled={pinStatus === "loading"}
                className="bg-[#4E1013] hover:bg-[#701619] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                {pinStatus === "loading" ? "Checking..." : "Check"}
              </button>
            </form>

            {pinStatus === "success" && (
              <p className="text-xs font-medium text-[#16794B] flex items-center gap-1 pt-0.5">
                <Check className="w-3.5 h-3.5" /> {pinMessage}
              </p>
            )}
            {pinStatus === "fallback" && (
              <p className="text-xs text-[#77716A] pt-0.5">
                {pinMessage}
              </p>
            )}
          </div>

          {/* ═══ SECTION 10: Compact Coupon Component ═══ */}
          <div className="border border-dashed border-[#D6A53B] bg-[#FAF8F2] rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3">
            <div className="text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#4E1013]">
                <Sparkles className="w-3.5 h-3.5 text-[#D6A53B]" />
                <span>Special Offer:</span>
                <span className="font-mono bg-white border border-[#D6A53B]/60 px-1.5 py-0.2 rounded text-[11px] text-[#4E1013]">
                  NAMO10
                </span>
              </div>
              <p className="text-[11px] text-[#77716A] mt-0.5">
                10% extra discount on eligible prepaid orders
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopyCoupon("NAMO10")}
              className="text-xs font-semibold bg-white border border-[#E9E3D9] hover:border-[#701619] text-[#4E1013] px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer active:scale-95 shrink-0 shadow-2xs"
            >
              {couponCopied ? (
                <>
                  <Check className="w-3 h-3 text-[#16794B]" />
                  <span className="text-[#16794B]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#77716A]" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* ═══ SECTION 11 & 12: Quantity Selector & Primary Purchase CTAs ═══ */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2.5">
              {/* Stepper (Section 11) */}
              <div className="flex items-center bg-[#FAF8F2] border border-[#E9E3D9] rounded-xl h-12 px-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-full flex items-center justify-center text-[#701619] hover:bg-white active:scale-95 rounded-lg text-lg font-bold cursor-pointer transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold text-sm text-[#4E1013]">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-full flex items-center justify-center text-[#701619] hover:bg-white active:scale-95 rounded-lg text-lg font-bold cursor-pointer transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Primary CTA: Add to Cart (Section 12) */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!variant?.available}
                className="flex-1 bg-[#701619] hover:bg-[#4E1013] text-white font-bold h-12 rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-sm uppercase tracking-wide cursor-pointer shadow-xs disabled:opacity-50"
              >
                <span>Add to Cart</span>
              </button>

              {/* Secondary CTA: Buy Now (Section 12) */}
              <button
                type="button"
                id="product-buy-now-btn"
                onClick={handleBuyNow}
                disabled={!variant?.available || isAdding}
                className="flex-1 bg-[#FAF8F2] hover:bg-amber-100/60 border border-[#D6A53B] text-[#4E1013] font-bold h-12 rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 text-sm uppercase tracking-wide cursor-pointer disabled:opacity-50"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#4E1013]" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#D6A53B] fill-current" />
                    <span>Buy Now — ₹{((price * qty) / 100).toLocaleString("en-IN")}</span>
                  </>
                )}
              </button>
            </div>

            {/* Supported Payment Logos & Security Strip (Section 12 & 16) */}
            <div className="pt-2 border-t border-[#E9E3D9]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#77716A]">
              <div className="flex items-center gap-1.5 font-medium text-[#4E1013]">
                <Truck className="w-3.5 h-3.5 text-[#701619]" />
                <span>Cash on Delivery &amp; Instant UPI Available</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <div className="h-4 px-1.5 py-0.5 bg-white rounded border border-[#E9E3D9] flex items-center justify-center">
                  <Image src="/assets/payments/phonepe.png" alt="PhonePe" width={48} height={14} className="h-2.5 w-auto object-contain" />
                </div>
                <div className="h-4 px-1.5 py-0.5 bg-white rounded border border-[#E9E3D9] flex items-center justify-center">
                  <Image src="/assets/payments/gpay.png" alt="Google Pay" width={36} height={12} className="h-2.5 w-auto object-contain" />
                </div>
                <div className="h-4 px-1.5 py-0.5 bg-white rounded border border-[#E9E3D9] flex items-center justify-center">
                  <Image src="/assets/payments/paytm.png" alt="Paytm" width={32} height={11} className="h-2 w-auto object-contain" />
                </div>
                <div className="h-4 px-1.5 py-0.5 bg-white rounded border border-[#E9E3D9] flex items-center justify-center">
                  <Image src="/assets/payments/upi.png" alt="UPI" width={32} height={11} className="h-2 w-auto object-contain" />
                </div>
                <div className="h-4 px-1.5 py-0.5 bg-white rounded border border-[#E9E3D9] flex items-center justify-center">
                  <Image src="/assets/payments/visa.png" alt="Visa" width={28} height={10} className="h-2 w-auto object-contain" />
                </div>
                <div className="h-4 px-1.5 py-0.5 bg-white rounded border border-[#E9E3D9] flex items-center justify-center">
                  <Image src="/assets/payments/mastercard.svg" alt="Mastercard" width={18} height={12} className="h-2.5 w-auto object-contain" />
                </div>
                <div className="h-4 px-1.5 py-0.5 bg-white rounded border border-[#E9E3D9] flex items-center justify-center">
                  <Image src="/assets/payments/rupay.svg" alt="RuPay" width={30} height={10} className="h-2 w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* ═══ SECTION 9: Consistent Trust & Quality Cards ═══ */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="bg-[#FAF8F2] border border-[#E9E3D9] rounded-xl p-2.5 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-white border border-[#E9E3D9] flex items-center justify-center text-[#701619] shrink-0">
                <Leaf className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#4E1013] block leading-tight">
                  Gir Cow Sourcing
                </span>
                <span className="text-[10px] text-[#77716A] leading-tight block mt-0.5 hidden sm:block">
                  A2 Ahimsa Milking
                </span>
              </div>
            </div>

            <div className="bg-[#FAF8F2] border border-[#E9E3D9] rounded-xl p-2.5 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-white border border-[#E9E3D9] flex items-center justify-center text-[#701619] shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#4E1013] block leading-tight">
                  Laboratory Tested
                </span>
                <span className="text-[10px] text-[#77716A] leading-tight block mt-0.5 hidden sm:block">
                  0% Adulteration
                </span>
              </div>
            </div>

            <div className="bg-[#FAF8F2] border border-[#E9E3D9] rounded-xl p-2.5 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-white border border-[#E9E3D9] flex items-center justify-center text-[#701619] shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#4E1013] block leading-tight">
                  FSSAI Licensed
                </span>
                <span className="text-[10px] text-[#77716A] font-mono leading-tight block mt-0.5 hidden sm:block">
                  10823999000412
                </span>
              </div>
            </div>
          </div>

          {/* 100% Vedic Purity Refund Guarantee */}
          <div className="bg-[#FAF8F2] border border-[#E9E3D9] rounded-xl p-3 flex items-start gap-2.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#701619] shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-[#77716A]">
              <strong className="text-[#4E1013] font-semibold">100% Vedic Purity Guarantee:</strong>{" "}
              Authentic bilona ghee slow-churned from cultured curd. If not genuine, receive an instant 100% refund.
            </div>
          </div>

        </div>
      </div>

      {/* ═══ SECTION 13: Compact Mobile Sticky Purchase Bar ═══ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#E9E3D9] px-4 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#4E1013]">
                ₹{((price * qty) / 100).toLocaleString("en-IN")}
              </span>
              {compareAt && compareAt > price && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{((compareAt * qty) / 100).toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-[#77716A] truncate">
              {variant?.title ?? "1 Litre"} • Free Delivery {giftData.hasGift ? "• Free Gift" : ""}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!variant?.available}
            className="bg-[#701619] hover:bg-[#4E1013] active:scale-95 text-white font-bold h-11 px-5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider shrink-0 cursor-pointer disabled:opacity-50"
          >
            <span>Add to Cart →</span>
          </button>
        </div>
      </div>

      {/* ═══ BELOW-FOLD: Comparison Table & Descriptions ═══ */}
      <div className="mt-12 space-y-10">

        {/* Why Families Choose Namo Narayana vs Commercial Ghee */}
        <div className="bg-[#FAF8F2] border border-[#E9E3D9] rounded-2xl p-5 sm:p-6">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-[#4E1013] mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D6A53B]" />
            <span>Why Families Choose Namo Narayana vs Commercial Ghee</span>
          </h2>
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E9E3D9]">
                  <th className="py-2.5 pr-3 text-[#77716A] font-medium">Criteria</th>
                  <th className="py-2.5 px-3 text-[#701619] font-bold bg-[#E9E3D9]/40 rounded-t-lg">
                    Namo Narayana
                  </th>
                  <th className="py-2.5 pl-3 text-[#77716A] font-medium">Commercial Store Ghee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E3D9]/60">
                <tr>
                  <td className="py-2.5 pr-3 font-medium text-[#24211E]">Milk Source</td>
                  <td className="py-2.5 px-3 text-[#4E1013] font-bold bg-[#FAF8F2]">100% Indigenous Gir Cows</td>
                  <td className="py-2.5 pl-3 text-[#77716A]">Commercial Buffalo / Mixed Breeds</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium text-[#24211E]">Churning Method</td>
                  <td className="py-2.5 px-3 text-[#4E1013] font-bold bg-[#FAF8F2]">Hand-churned Curd (Vedic Bilona)</td>
                  <td className="py-2.5 pl-3 text-[#77716A]">Industrial Cream Separator</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium text-[#24211E]">Digestibility</td>
                  <td className="py-2.5 px-3 text-[#4E1013] font-bold bg-[#FAF8F2]">Gentle on gut (A2 Beta-Casein)</td>
                  <td className="py-2.5 pl-3 text-[#77716A]">Heavy, contains A1 protein</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium text-[#24211E]">Texture & Aroma</td>
                  <td className="py-2.5 px-3 text-[#4E1013] font-bold bg-[#FAF8F2]">Grainy (Danedar) & Nutty Aroma</td>
                  <td className="py-2.5 pl-3 text-[#77716A]">Waxy or Artificial Aroma</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Description & Heritage */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-[#4E1013] uppercase tracking-wider">
            Product Description &amp; Health Benefits
          </h2>
          <div
            className="prose prose-sm max-w-none text-[#24211E] marker:text-[#701619] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Product Journey Component */}
        <div className="w-full">
          <ProductJourney />
        </div>

        {/* Customer Reviews Section */}
        <div id="product-reviews-section" className="pt-6 border-t border-[#E9E3D9]">
          <ProductReviews
            reviews={PRODUCT_REVIEWS_MAP[product.slug] || PRODUCT_REVIEWS_MAP["pure-desi-cow-ghee-1-litre"]}
            totalReviews={reviewStats?.total || 1688}
            averageRating={reviewStats?.average || 4.9}
          />
        </div>

      </div>
    </div>
  );
}
