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
  Sparkles, Tag, ShieldAlert, Award, MessageCircle, Copy, Check
} from "lucide-react";
import ProductReviews from "./ProductReviews";
import ProductJourney from "./ProductJourney";
import { PRODUCT_REVIEWS_MAP, PRODUCT_REVIEW_STATS } from "@/lib/reviews-data";
import { useRouter } from "next/navigation";

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

  // Dynamic delivery date calculation
  const [deliveryDateStr, setDeliveryDateStr] = useState("3 - 4 Days");

  useEffect(() => {
    setIsMounted(true);

    // Calculate dynamic delivery range (3 to 5 days ahead)
    const now = new Date();
    const d1 = new Date(now);
    d1.setDate(now.getDate() + 3);
    const d2 = new Date(now);
    d2.setDate(now.getDate() + 5);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    setDeliveryDateStr(`${d1.toLocaleDateString('en-IN', options)} - ${d2.toLocaleDateString('en-IN', options)}`);

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

      return () => clearTimeout(timer);
    }
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
    setIsAdding(true);
    setTimeout(() => {
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

      setIsAdding(false);
      open();
      toast.success(`Added ${qty} × ${product.title} to cart`);
    }, 350);
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

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.images,
    "description": product.description.replace(/<[^>]*>?/gm, ''),
    "sku": product.id.toString(),
    "brand": {
      "@type": "Brand",
      "name": "Namo Narayana"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://namonarayanaghee.store/products/${product.slug}`,
      "priceCurrency": "INR",
      "price": (price / 100).toFixed(2),
      "availability": variant?.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 pb-24 md:pb-16 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Gallery (Left Side) */}
      <div className="space-y-3.5 md:sticky md:top-24 md:self-start">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF9F5] border border-gray-100 shadow-sm">
          {product.images[selectedImage] ? (
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-nn-bark/30 text-lg">No Image</div>
          )}

          {/* Quality & Trust Badges on Image */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span className="bg-[#1E3A24] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              100% Traditional Bilona
            </span>
            {discount > 0 && (
              <span className="bg-[#C38936] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md w-fit">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-md shadow flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>FSSAI Lic: 10823999000412</span>
          </div>
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  i === selectedImage ? "border-[#1E3A24] ring-2 ring-[#1E3A24]/20 scale-105" : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}

        {/* Mini Trust Highlights Box below Gallery on Desktop */}
        <div className="hidden md:grid grid-cols-2 gap-3 p-4 bg-[#FBF9F2] rounded-xl border border-amber-200/50">
          <div className="flex items-center gap-2.5 text-xs text-[#1E3A24] font-medium">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 font-bold">✓</div>
            <span>Curd Churned (Not Cream Separator)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#1E3A24] font-medium">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-bold">✓</div>
            <span>Slow Cooked in Traditional Vessels</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#1E3A24] font-medium">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 font-bold">✓</div>
            <span>No Palm Oil or Chemical Adulteration</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#1E3A24] font-medium">
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
            <span className="text-xs uppercase tracking-widest font-extrabold text-[#C38936] block mb-1">
              Pure Desi Vedic Cow Ghee
            </span>
            <h1 className="text-3xl lg:text-[34px] leading-tight font-serif font-bold text-[#1E3A24]">{product.title}</h1>
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
        <div className="flex items-center gap-3 mb-3">
          <button 
            onClick={() => {
              const el = document.getElementById("product-reviews-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
          >
            <div className="flex text-[#066A46]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(reviewStats.average) ? "fill-current" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-[#1E3A24]">{reviewStats.average}★ ({reviewStats.total} reviews)</span>
          </button>
          <span className="text-xs text-gray-500 font-medium">• 100% Verified Buyers</span>
        </div>

        {/* Legitimate Trust & Verification Cards (Mobile First) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F4F9F5] border border-[#D1E7DD] shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-[#E3F2E9] flex items-center justify-center text-[#1E3A24] shrink-0">
              <Leaf className="w-4 h-4 text-[#1E3A24]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#1E3A24] block leading-tight">
                Small-Batch Handcrafted
              </span>
              <span className="text-[11px] text-[#3e5f48] leading-tight block mt-0.5">
                From Indigenous Gir Cows
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FBF8EF] border border-[#EEDBBA] shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-[#F8EFD8] flex items-center justify-center text-[#8C601E] shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#8C601E]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#6D4911] block leading-tight">
                NABL Lab Certified Purity
              </span>
              <span className="text-[11px] text-[#8C601E] leading-tight block mt-0.5">
                0% Adulteration • No Foreign Fat
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F4F9F5] border border-[#D1E7DD] shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-[#E3F2E9] flex items-center justify-center text-[#1E3A24] shrink-0">
              <Award className="w-4 h-4 text-[#1E3A24]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#1E3A24] block leading-tight">
                FSSAI Central License
              </span>
              <span className="text-[11px] text-[#1E3A24] font-mono font-bold tracking-tight block mt-0.5">
                Lic No. 10823999000412
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Box with High-Contrast Mobile Clean Layout */}
        <div className="mb-5 bg-gradient-to-br from-[#F5F8F6] via-[#FAFBF9] to-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs">
          <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 mb-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1E3A24] tracking-tight">
              Rs. {(price / 100).toLocaleString('en-IN')}
            </span>
            {compareAt && compareAt > price && (
              <span className="text-xl sm:text-2xl text-gray-400 line-through font-medium">
                Rs. {(compareAt / 100).toLocaleString('en-IN')}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-[#1E3A24] text-amber-200 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Save {discount}% (₹{savingsRupees.toLocaleString('en-IN')} OFF)
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-2.5">
            <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              FREE Express Shipping Pan-India
            </span>
            <span className="text-gray-500">MRP (Inclusive of all taxes)</span>
          </div>

          <div className="mt-3.5 pt-3 border-t border-gray-200/70 flex flex-wrap items-center justify-between gap-2 text-xs text-[#1E3A24]">
            <span className="flex items-center gap-1.5 font-bold">
              <Factory className="w-4 h-4 text-[#C38936]" />
              Authentic Wooden Bilona Churned from Curd
            </span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              Farm Fresh
            </span>
          </div>
        </div>

        {/* Variants & Packs Selector (500ml, 1L, 2.5L, 5L) */}
        {gheePacks && gheePacks.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2.5">
              <label className="text-sm font-bold text-[#1E3A24] flex items-center gap-1.5">
                <span>Select Pack Size:</span>
                <span className="text-xs font-normal text-gray-500">(Bigger Pack = Bigger Savings)</span>
              </label>
              <span className="text-xs font-bold text-[#066A46] bg-emerald-50 px-2 py-0.5 rounded">
                Save up to 42% per litre &rarr;
              </span>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {gheePacks.map((pack) => {
                let ml = 1000;
                let badge = null;
                let saveLabel = null;
                let badgeBg = "bg-gray-900 text-white";
                let packRole = "Daily Use";
                
                if (pack.slug.includes("500-ml")) {
                  ml = 500;
                  badge = "STARTER";
                  badgeBg = "bg-gray-700 text-white";
                  packRole = "Trial Pack";
                } else if (pack.slug.includes("1-litre")) {
                  ml = 1000;
                  badge = "BESTSELLER";
                  badgeBg = "bg-[#C38936] text-white";
                  saveLabel = "Save 21%/L";
                  packRole = "Most Popular";
                } else if (pack.slug.includes("2-5-litre")) {
                  ml = 2500;
                  badge = "VALUE PACK";
                  badgeBg = "bg-[#1E3A24] text-white";
                  saveLabel = "Save 30%/L";
                  packRole = "Family Saver";
                } else if (pack.slug.includes("5-litre")) {
                  ml = 5000;
                  badge = "BEST VALUE";
                  badgeBg = "bg-red-600 text-white animate-pulse";
                  saveLabel = "Save 42%/L";
                  packRole = "Mega Family";
                }
                
                const perLitre = Math.round((pack.price / 100) / (ml / 1000));
                const isSelected = product.slug === pack.slug || (product.slug.includes("500-ml") && pack.slug.includes("500-ml"));
                const packDiscount = pack.compareAtPrice ? discountPercent(pack.price, pack.compareAtPrice) : 0;

                return (
                  <button
                    key={pack.id}
                    onClick={() => {
                      if (!isSelected) router.push(`/products/${pack.slug}`);
                    }}
                    className={`relative text-left rounded-xl border-2 flex flex-col overflow-hidden transition-all duration-200 transform ${
                      isSelected 
                        ? "border-[#1E3A24] bg-white ring-2 ring-[#1E3A24]/30 shadow-md scale-[1.02]" 
                        : "border-gray-200 bg-gray-50/60 hover:border-[#1E3A24]/50 hover:bg-white"
                    }`}
                  >
                    {/* Top Header */}
                    <div className={`px-2.5 py-1.5 flex justify-between items-center text-xs ${
                      isSelected ? "bg-[#1E3A24] text-white" : "bg-gray-100/90 text-gray-800"
                    }`}>
                      <span className="font-extrabold">{pack.variants[0]?.title ?? pack.title.split(' ').slice(-2).join(' ')}</span>
                      {badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider ${badgeBg}`}>
                          {badge}
                        </span>
                      )}
                    </div>
                    
                    {/* Bottom Details */}
                    <div className="p-2.5 flex flex-col gap-1 flex-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-extrabold text-[#1E3A24]">
                          Rs. {Math.round(pack.price / 100).toLocaleString('en-IN')}
                        </span>
                        {pack.compareAtPrice && (
                          <span className="text-[11px] text-gray-400 line-through">
                            Rs. {Math.round(pack.compareAtPrice / 100).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-red-600">{packDiscount}% off</span>
                        <span className="text-gray-500 text-[10px]">{packRole}</span>
                      </div>
                      
                      <div className="mt-auto pt-1.5 border-t border-gray-100 flex flex-col">
                        <span className="text-[11px] font-bold text-[#066A46]">
                          ₹{perLitre.toLocaleString("en-IN")}/L
                        </span>
                        {saveLabel && (
                          <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-1 py-0.2 rounded w-fit">
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

        {/* Free Gift Unlock Announcement */}
        <div className="mb-5 p-3.5 bg-gradient-to-r from-amber-50 to-emerald-50 rounded-xl border border-amber-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <span className="font-bold text-gray-900 block">🎁 Free Gift Included With This Order!</span>
            <p className="text-gray-600 mt-0.5 leading-snug">
              Complimentary <strong>Pure Brass Bilona Spoon</strong> + Vedic Immunity E-Book automatically packed.
            </p>
          </div>
        </div>

        {/* Quick Coupon Code - Unlocked only after 45 seconds on site */}
        {showCoupon && (
          <div className="mb-6 p-3 bg-gradient-to-r from-emerald-50 via-white to-amber-50 rounded-xl border border-dashed border-emerald-600/70 flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-gray-900">Special 10% Discount: </span>
                <span className="font-mono font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded ml-1">
                  ELVISH10
                </span>
              </div>
            </div>
            <button
              onClick={() => handleCopyCoupon("ELVISH10")}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-white hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 transition-colors shadow-2xs"
            >
              {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{codeCopied ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>
        )}

        {/* Action Buttons: Sticky Mobile Buy Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-3 py-2.5 sm:px-4 sm:py-3 border-t border-gray-200 flex flex-row items-center gap-2.5 sm:gap-3 md:relative md:bg-transparent md:border-none md:p-0 md:mb-5 md:z-auto pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-0 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] md:shadow-none">
          {/* Quantity Selector */}
          <div className="flex items-center bg-[#E8F2EF] rounded-xl border border-[#CCE3DB] h-[50px] sm:h-[54px] shrink-0">
            <button 
              onClick={() => setQty(Math.max(1, qty - 1))} 
              className="w-10 sm:w-11 h-full flex items-center justify-center text-[#1E3A24] hover:bg-[#D5E8E0] active:scale-95 rounded-l-xl transition text-xl font-bold"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 sm:w-10 text-center font-extrabold text-[#1E3A24] text-base">{qty}</span>
            <button 
              onClick={() => setQty(qty + 1)} 
              className="w-10 sm:w-11 h-full flex items-center justify-center text-[#1E3A24] hover:bg-[#D5E8E0] active:scale-95 rounded-r-xl transition text-xl font-bold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          
          {/* Buy Now button - High Converting Full-Width Primary CTA */}
          <button 
            onClick={handleBuyNow} 
            disabled={!variant?.available || isAdding} 
            className="flex-1 bg-gradient-to-r from-[#FFB800] via-[#F59E0B] to-[#D97706] text-black font-extrabold h-[50px] sm:h-[54px] rounded-xl hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-70 text-base sm:text-lg tracking-wide shadow-[0_6px_20px_0_rgba(245,158,11,0.45)] flex items-center justify-center gap-2.5 uppercase border border-amber-300"
          >
            {isAdding ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                <span>Buy Now</span>
              </>
            )}
          </button>
        </div>

        {/* WhatsApp 1-Click Order Link */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="font-semibold">Questions or prefer WhatsApp?</span>
          </div>
          <a
            href={`https://wa.me/919999999999?text=${encodeURIComponent(
              `Hi Namo Narayana Team! I would like to place an order for ${product.title} (Rs. ${price / 100}). Please assist me with my order.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs hover:bg-emerald-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>Order on WhatsApp (30s) &rarr;</span>
          </a>
        </div>

        {/* Delivery & Pincode Reassurance */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <Truck className="w-4 h-4 text-[#066A46]" />
            <span>⚡ Expected Delivery: <strong className="text-emerald-800">{deliveryDateStr}</strong></span>
          </div>
          <p className="text-gray-600 pl-6">
            Dispatches from our farm within <strong>24 hours</strong>. Free Express Delivery across 19,000+ Indian pincodes.
          </p>
          <div className="flex items-center gap-2 text-gray-800 font-semibold pt-1 border-t border-gray-200 pl-6">
            <span>🔒 100% Safe & Secure Checkout via UPI, Google Pay, PhonePe, Cards & NetBanking</span>
          </div>
        </div>

        {/* Trust Guarantees Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 pb-6 border-t border-gray-200">
          <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#E8F2EF] flex items-center justify-center text-[#066A46] mb-1.5">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#1E3A24] leading-tight">Free Express Shipping</span>
            <span className="text-[10px] text-gray-500 mt-0.5">Pan India</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#E8F2EF] flex items-center justify-center text-[#066A46] mb-1.5">
              <Factory className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#1E3A24] leading-tight">Vedic Bilona Churned</span>
            <span className="text-[10px] text-gray-500 mt-0.5">From Whole Curd</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#E8F2EF] flex items-center justify-center text-[#066A46] mb-1.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#1E3A24] leading-tight">100% Purity Guarantee</span>
            <span className="text-[10px] text-gray-500 mt-0.5">Or Full Refund</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#E8F2EF] flex items-center justify-center text-[#066A46] mb-1.5">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#1E3A24] leading-tight">NABL Lab Certified</span>
            <span className="text-[10px] text-gray-500 mt-0.5">0% Adulteration</span>
          </div>
        </div>

        {/* Why 24,000+ Families Choose Us Comparison Table */}
        <div className="mb-8 p-4 sm:p-5 bg-[#FAF9F5] rounded-2xl border border-amber-200/60">
          <h3 className="font-serif font-bold text-lg text-[#1E3A24] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C38936]" />
            Why Families Choose Namo Narayana vs Commercial Ghee
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 pr-2 text-gray-500 font-semibold">Criteria</th>
                  <th className="py-2 px-2 text-[#066A46] font-extrabold bg-emerald-50/80 rounded-t-lg">Namo Narayana</th>
                  <th className="py-2 pl-2 text-gray-400 font-semibold">Store-Bought Ghee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                <tr>
                  <td className="py-2 pr-2 font-medium text-gray-700">Source</td>
                  <td className="py-2 px-2 text-[#1E3A24] font-bold bg-emerald-50/50">100% Indigenous Gir Cows</td>
                  <td className="py-2 pl-2 text-gray-500">Commercial Buffalo/Jersey Milk</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-medium text-gray-700">Churning</td>
                  <td className="py-2 px-2 text-[#1E3A24] font-bold bg-emerald-50/50">Hand-churned Curd (Bilona)</td>
                  <td className="py-2 pl-2 text-gray-500">Machine cream separator</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-medium text-gray-700">Digestibility</td>
                  <td className="py-2 px-2 text-[#1E3A24] font-bold bg-emerald-50/50">Easy on Gut (A2 Protein)</td>
                  <td className="py-2 pl-2 text-gray-500">Heavy, bloating (A1 Protein)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-medium text-gray-700">Aroma & Texture</td>
                  <td className="py-2 px-2 text-[#1E3A24] font-bold bg-emerald-50/50">Rich Danedar & Sweet Aroma</td>
                  <td className="py-2 pl-2 text-gray-500">Artificial essence added</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-[#1E3A24] uppercase tracking-wider mb-3">Product Description & Benefits</h2>
          <div className="prose prose-sm max-w-none text-gray-800 marker:text-[#1E3A24]" dangerouslySetInnerHTML={{ __html: product.description }} />
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
    </div>
  );
}
