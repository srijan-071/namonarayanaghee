"use client";

import React, { useState } from "react";
import Image from "next/image";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { formatPrice, discountPercent } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { Product } from "@/lib/types";
import { toast } from "sonner";
import { Loader2, Flame, Timer, TrendingUp } from "lucide-react";

import { useRouter } from "next/navigation";

export default function ProductDetails({ product, gheePacks }: { product: Product; gheePacks?: Product[] | null }) {
  const router = useRouter();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const { open } = useCartDrawer();
  const [isAdding, setIsAdding] = useState(false);

  const variant = product.variants[selectedVariantIdx];
  const price = variant?.price ?? product.price;
  const compareAt = variant?.compareAtPrice ?? product.compareAtPrice;
  const discount = compareAt ? discountPercent(price, compareAt) : 0;

  // Track view_item once on mount or when product changes
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

  // Scarcity state (pseudo-random based on product ID to remain consistent per product)
  const leftInStock = React.useMemo(() => {
    return Math.floor(product.id % 7) + 3; // Returns between 3 and 9
  }, [product.id]);

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

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.images,
    "description": product.description.replace(/<[^>]*>?/gm, ''), // strip html
    "sku": product.id.toString(),
    "brand": {
      "@type": "Brand",
      "name": "Namo Narayana"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://namonarayanaghee.com/products/${product.slug}`,
      "priceCurrency": "INR",
      "price": (price / 100).toFixed(2),
      "availability": variant?.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-nn-cream border border-nn-hairline">
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
          {discount > 0 && <span className="nn-badge-sale absolute top-4 left-4 text-sm">{discount}% OFF</span>}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition ${i === selectedImage ? "border-nn-forest" : "border-nn-hairline hover:border-nn-bark"}`}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <h1 className="nn-title mb-3">{product.title}</h1>

        {/* Price */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-bold text-nn-leaf">{formatPrice(price)}</span>
          {compareAt && compareAt > price && (
            <>
              <span className="text-lg text-nn-bark line-through">{formatPrice(compareAt)}</span>
              <span className="nn-badge-sale">{discount}% OFF</span>
            </>
          )}
        </div>

        {/* Urgency & Scarcity Badges */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 text-[#C38936] bg-[#C38936]/10 px-3 py-2 rounded-lg text-sm font-bold w-fit">
            <Flame className="w-4 h-4 animate-pulse" />
            <span>High Demand! Only {leftInStock} jars left in this batch.</span>
          </div>
          <div className="flex items-center gap-2 text-[#1E3A24] bg-[#1E3A24]/5 px-3 py-2 rounded-lg text-sm font-medium w-fit">
            <Timer className="w-4 h-4" />
            <span>Order within 2 hours for dispatch today.</span>
          </div>
        </div>

        {/* Variants & Packs */}
        {gheePacks && gheePacks.length > 0 ? (
          <div className="mb-6">
            <label className="text-sm font-semibold text-nn-ink mb-3 block">
              Choose your pack
            </label>
            <div className="flex flex-col gap-3">
              {gheePacks.map((pack) => {
                let ml = 1000;
                let badge = null;
                if (pack.slug.includes("1-litre")) {
                  ml = 1000;
                } else if (pack.slug.includes("2-5-litre")) {
                  ml = 2500;
                  badge = "Better value";
                } else if (pack.slug.includes("5-litre")) {
                  ml = 5000;
                  badge = "Best value";
                }
                const per100ml = Math.round((pack.price / 100) / (ml / 100));
                const isSelected = product.slug === pack.slug;

                return (
                  <button
                    key={pack.id}
                    onClick={() => {
                      if (!isSelected) router.push(`/products/${pack.slug}`);
                    }}
                    className={`relative w-full text-left p-4 rounded-xl border-2 transition flex items-center justify-between ${
                      isSelected 
                        ? "border-nn-forest bg-nn-forest/5 shadow-sm" 
                        : "border-nn-hairline hover:border-nn-forest/50"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className={`font-semibold text-lg ${isSelected ? "text-nn-forest" : "text-nn-ink"}`}>
                        {pack.variants[0]?.title ?? pack.title}
                      </span>
                      <span className="text-sm text-nn-bark mt-1">
                        {formatPrice(pack.price)} • ₹{per100ml}/100ml
                      </span>
                    </div>
                    {badge && (
                      <div className={`text-xs font-bold px-3 py-1 rounded-full ${isSelected ? "bg-nn-forest text-white" : "bg-nn-leaf/10 text-nn-leaf"}`}>
                        {badge}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : product.variants.length > 1 ? (
          <div className="mb-6">
            <label className="text-sm font-semibold text-nn-ink mb-2 block">
              {product.options[0]?.name ?? "Size"}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVariantIdx(i); setQty(1); }}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${i === selectedVariantIdx ? "border-nn-forest bg-nn-forest text-white" : "border-nn-hairline text-nn-ink hover:border-nn-forest"}`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Quantity */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-nn-ink mb-2 block">Quantity</label>
          <div className="inline-flex items-center border border-nn-hairline rounded-lg">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-lg hover:bg-gray-50 transition" aria-label="Decrease">−</button>
            <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-lg hover:bg-gray-50 transition" aria-label="Increase">+</button>
          </div>
        </div>

        {/* Add to cart */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-nn-hairline z-50 md:relative md:bottom-auto md:left-auto md:right-auto md:p-0 md:bg-transparent md:border-t-0 md:z-auto mb-4">
          <button onClick={handleAddToCart} disabled={!variant?.available || isAdding} className="nn-btn nn-btn-primary w-full py-4 text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl md:shadow-none">
            {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isAdding ? "Adding..." : (variant?.available ? "Add to Cart" : "Sold Out")}
          </button>
        </div>
        {/* Description */}
        <div className="mt-6 border-t border-nn-hairline pt-6">
          <h2 className="font-serif text-lg font-bold text-nn-ink mb-3">Product Details</h2>
          <div className="nn-sub prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="text-xs bg-nn-cream text-nn-bark px-2.5 py-1 rounded-full capitalize">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
