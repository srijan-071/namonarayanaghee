"use client";

import React, { useState } from "react";
import Image from "next/image";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { formatPrice, discountPercent } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { Product } from "@/lib/types";
import { toast } from "sonner";
import { Loader2, Share2, Star, Truck, ShieldCheck, HeadphonesIcon, Factory, Eye, Flame, Zap } from "lucide-react";
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
  const [viewers] = useState(() => (typeof window !== 'undefined' ? Math.floor(Math.random() * 20) + 15 : 22));
  const [sold] = useState(() => (typeof window !== 'undefined' ? Math.floor(Math.random() * 50) + 100 : 134));

  const variant = product.variants[selectedVariantIdx];
  const price = variant?.price ?? product.price;
  const compareAt = variant?.compareAtPrice ?? product.compareAtPrice;
  const discount = compareAt ? discountPercent(price, compareAt) : 0;

  React.useEffect(() => {
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

  const reviewStats = PRODUCT_REVIEW_STATS[product.slug];

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
      toast.success(`Added ${qty} ${product.title} to cart`);
    }, 400);
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pb-28 md:pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Gallery (Left Side) */}
      <div className="space-y-4">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF9F5]">
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
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition ${i === selectedImage ? "border-[#1E3A24]" : "border-transparent hover:border-gray-300"}`}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details (Right Side) */}
      <div className="flex flex-col">
        {/* Title & Share */}
        <div className="flex justify-between items-start gap-4 mb-2">
          <h1 className="text-3xl lg:text-[32px] leading-tight font-serif font-bold text-[#1E3A24]">{product.title}</h1>
          <button 
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition shrink-0" 
            aria-label="Share"
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

        {/* Reviews */}
        {reviewStats && (
          <button 
            onClick={() => {
              const el = document.getElementById("product-reviews-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 w-fit mb-4 hover:opacity-80 transition-opacity"
          >
            <div className="flex text-[#066A46]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(reviewStats.average) ? "fill-current" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-[#1E3A24]">{reviewStats.total} reviews</span>
          </button>
        )}

        {/* Urgency / CRO elements */}
        <div className="flex flex-col gap-2.5 mb-4 mt-2">
          <div className="flex items-center gap-1.5 text-red-700 text-sm font-bold bg-red-50 w-fit px-3 py-1.5 rounded-lg border border-red-200 shadow-sm">
            <Flame className="w-4 h-4 animate-pulse text-orange-500" />
            <span>High Demand - {sold} sold in last 24 hours!</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 text-sm">
            <Eye className="w-4 h-4 text-blue-500" />
            <span><strong className="text-gray-900">{viewers} people</strong> are looking at this right now</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6 bg-gradient-to-r from-green-50 to-transparent p-4 rounded-xl border border-green-100/50">
          <div className="flex items-end gap-3 mb-1">
            <span className="text-4xl font-bold text-[#1E3A24]">Rs. {(price / 100).toLocaleString('en-IN')}</span>
            {compareAt && compareAt > price && (
               <span className="text-xl text-gray-400 line-through mb-1">Rs. {(compareAt / 100).toLocaleString('en-IN')}</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-sm text-gray-500">MRP (Incl. of all taxes)</span>
             {discount > 0 && (
               <span className="bg-red-600 text-white text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full animate-bounce">Save {discount}%</span>
             )}
          </div>
        </div>

        {/* Variants & Packs */}
        {gheePacks && gheePacks.length > 0 ? (
          <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
              <label className="text-sm font-bold text-[#1E3A24]">Choose Pack</label>
              <span className="text-xs font-bold text-[#066A46]">Save up to 15% per litre &rarr;</span>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {gheePacks.map((pack) => {
                let ml = 1000;
                let badge = null;
                let savePercent = null;
                
                if (pack.slug.includes("500-ml")) {
                  ml = 500;
                } else if (pack.slug.includes("1-litre")) {
                  ml = 1000;
                  savePercent = "5%";
                } else if (pack.slug.includes("2-5-litre")) {
                  ml = 2500;
                  savePercent = "11%";
                } else if (pack.slug.includes("5-litre")) {
                  ml = 5000;
                  savePercent = "15%";
                  badge = "BEST VALUE";
                }
                
                const perLitre = Math.round((pack.price / 100) / (ml / 1000));
                const isSelected = product.slug === pack.slug;
                const packDiscount = pack.compareAtPrice ? discountPercent(pack.price, pack.compareAtPrice) : 0;

                return (
                  <button
                    key={pack.id}
                    onClick={() => {
                      if (!isSelected) router.push(`/products/${pack.slug}`);
                    }}
                    className={`relative text-left rounded-xl border flex flex-col overflow-hidden transition ${
                      isSelected 
                        ? "border-[#1E3A24] ring-1 ring-[#1E3A24]" 
                        : "border-gray-200 hover:border-[#1E3A24]"
                    }`}
                  >
                    {/* Top Header */}
                    <div className={`px-3 py-2 flex justify-between items-center ${isSelected ? "bg-[#1E3A24] text-white" : "bg-[#F9F9F9] text-[#1E3A24]"}`}>
                      <span className="text-sm font-bold">{pack.variants[0]?.title ?? pack.title.split(' ').slice(-2).join(' ')}</span>
                      {badge && (
                        <span className="text-[10px] bg-[#F5B301] text-black px-1.5 py-0.5 rounded-sm font-bold whitespace-nowrap ml-1">{badge}</span>
                      )}
                    </div>
                    
                    {/* Bottom Details */}
                    <div className="p-3 bg-white flex flex-col gap-1 flex-1">
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span className="text-sm font-bold text-[#1E3A24]">Rs. {pack.price / 100}</span>
                        {pack.compareAtPrice && (
                          <span className="text-xs text-gray-400 line-through">Rs. {pack.compareAtPrice / 100}</span>
                        )}
                      </div>
                      
                      {packDiscount > 0 && (
                        <span className="text-xs font-bold text-red-600">{packDiscount}% off</span>
                      )}
                      
                      <div className="mt-auto pt-2">
                        <span className="text-xs font-bold text-[#066A46]">
                          Rs. {perLitre.toLocaleString("en-IN")}/L {savePercent && <span className="text-gray-500 font-normal">- save {savePercent}</span>}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white p-3 border-t border-gray-200 flex flex-row gap-2 sm:gap-3 md:relative md:bg-transparent md:border-none md:p-0 md:mb-8 md:z-auto pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:pb-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none">
          {/* Quantity Selector */}
          <div className="flex items-center bg-[#E8F2EF] rounded-lg border border-[#CCE3DB] h-[48px] sm:h-[52px] shrink-0">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 sm:w-12 h-full flex items-center justify-center text-[#1E3A24] hover:bg-[#D5E8E0] rounded-l-lg transition text-xl">−</button>
            <span className="w-8 sm:w-10 text-center font-bold text-[#1E3A24]">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="w-10 sm:w-12 h-full flex items-center justify-center text-[#1E3A24] hover:bg-[#D5E8E0] rounded-r-lg transition text-xl">+</button>
          </div>

          <button onClick={handleAddToCart} disabled={!variant?.available || isAdding} className="flex-1 bg-white text-[#1E3A24] border-2 border-[#1E3A24] font-bold h-[48px] sm:h-[54px] rounded-xl hover:bg-[#F4F9F6] transition disabled:opacity-70 flex items-center justify-center gap-2 text-[14px] sm:text-base leading-tight">
            {isAdding ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : "Add to cart"}
          </button>
          
          <button onClick={handleBuyNow} disabled={!variant?.available} className="flex-1 bg-gradient-to-r from-[#FFB800] to-[#F59E0B] text-black font-extrabold h-[48px] sm:h-[54px] rounded-xl hover:from-[#F59E0B] hover:to-[#D97706] transition-all transform active:scale-[0.98] disabled:opacity-70 text-[15px] sm:text-[17px] leading-tight shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] flex items-center justify-center gap-1.5 uppercase tracking-wide">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            Buy Now
          </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-[#1E3A24] uppercase tracking-wider mb-4">Product Description</h2>
          <div className="prose prose-sm max-w-none text-gray-800 marker:text-[#1E3A24]" dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-4 gap-2 pt-6 border-t border-gray-200">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#E8F2EF] flex items-center justify-center text-[#066A46]">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1E3A24] leading-tight">Free Shipping<br/>Above ₹499</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#E8F2EF] flex items-center justify-center text-[#066A46]">
              <Factory className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1E3A24] leading-tight">Bilona<br/>Method</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#E8F2EF] flex items-center justify-center text-[#066A46]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1E3A24] leading-tight">90+ Quality<br/>Checks</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#E8F2EF] flex items-center justify-center text-[#066A46]">
              <HeadphonesIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1E3A24] leading-tight">360° Customer<br/>Support</span>
          </div>
        </div>

      </div>

      <div className="col-span-1 md:col-span-2 w-[100vw] relative left-1/2 -translate-x-1/2 mt-12 md:mt-24">
        <ProductJourney />
      </div>

      <div className="col-span-1 md:col-span-2 mt-12 pt-8 border-t border-gray-200">
        <ProductReviews 
          reviews={PRODUCT_REVIEWS_MAP[product.slug] || PRODUCT_REVIEWS_MAP["pure-desi-cow-ghee-1-litre"]} 
          totalReviews={reviewStats?.total || 0} 
          averageRating={reviewStats?.average || 5.0} 
        />
      </div>
    </div>
  );
}
