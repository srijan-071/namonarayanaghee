"use client";

import { useState } from "react";
import Image from "next/image";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { formatPrice, discountPercent } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ProductDetails({ product }: { product: Product }) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const { open } = useCartDrawer();
  const [isAdding, setIsAdding] = useState(false);

  const variant = product.variants[selectedVariantIdx];
  const price = variant?.price ?? product.price;
  const compareAt = variant?.compareAtPrice ?? product.compareAtPrice;
  const discount = compareAt ? discountPercent(price, compareAt) : 0;

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
      setIsAdding(false);
      open();
      toast.success(`Added ${qty} ${product.title} to cart`);
    }, 400);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
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

        {/* Variants */}
        {product.variants.length > 1 && (
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
        )}

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
