"use client";

import { useState } from "react";
import { useCart, useCartDrawer, removeFromCart, updateQuantity, addToCart, applyCoupon, removeCoupon } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function CartDrawer() {
  const cart = useCart();
  const { isOpen, close } = useCartDrawer();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleRemove = (variantId: number) => {
    const item = cart.items.find((i) => i.variantId === variantId);
    if (item) {
      trackEvent("remove_from_cart", {
        currency: "INR",
        value: item.price * item.quantity,
        items: [{
          item_id: item.productId,
          item_name: item.title,
          quantity: item.quantity,
          price: item.price
        }]
      });
    }
    removeFromCart(variantId);
    toast.success("Item removed from cart");
  };

  const handleUpdate = (variantId: number, newQty: number) => {
    updateQuantity(variantId, newQty);
  };

  const hasHoney = cart.items.some(i => i.slug === "honey");

  const handleAddHoney = () => {
    addToCart({
      productId: 9545045147816,
      variantId: 55811350495400,
      slug: "honey",
      title: "Honey",
      variantTitle: "Default Title",
      price: 31500,
      image: "/assets/product_honey.webp"
    }, 1);
    toast.success("Honey added to cart!");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-nn-hairline">
          <h2 className="text-lg font-bold font-serif text-nn-ink">Your Cart</h2>
          <button onClick={close} aria-label="Close cart" className="p-1 rounded-md hover:bg-gray-100 transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-nn-forest text-white text-center text-xs py-2 font-semibold tracking-wide">
          Free COD - Cash On Delivery Pan India
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg className="w-16 h-16 text-nn-hairline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
                <path d="M1.5 2h3l2.7 12.4a2 2 0 002 1.6h8.6a2 2 0 002-1.6L21.5 6H6" />
              </svg>
              <h3 className="font-serif text-lg font-bold text-nn-ink">Your cart is empty</h3>
              <p className="nn-sub text-sm">Pure, farm-fresh essentials are waiting for you.</p>
              <Link href="/collections/all-products" onClick={close} className="nn-btn nn-btn-primary mt-2">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-nn-hairline">
              {cart.items.map((item) => (
                <li key={item.variantId} className="flex gap-4 py-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-nn-hairline shrink-0 bg-gray-50">
                    {item.image && (
                      <Image src={item.image} alt={item.title} fill className="object-cover" sizes="80px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} className="font-semibold text-sm text-nn-ink hover:text-nn-forest line-clamp-2" onClick={close}>
                      {item.title}
                    </Link>
                    {item.variantTitle && <p className="text-xs text-nn-bark mt-0.5">{item.variantTitle}</p>}
                    <p className="text-sm font-bold text-nn-leaf mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => handleUpdate(item.variantId, item.quantity - 1)} className="w-7 h-7 rounded-md border border-nn-hairline text-sm flex items-center justify-center hover:bg-gray-50" aria-label="Decrease quantity">−</button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => handleUpdate(item.variantId, item.quantity + 1)} className="w-7 h-7 rounded-md border border-nn-hairline text-sm flex items-center justify-center hover:bg-gray-50" aria-label="Increase quantity">+</button>
                      <button onClick={() => handleRemove(item.variantId)} className="ml-auto text-xs text-red-500 hover:text-red-700" aria-label="Remove item">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t border-nn-hairline p-5 space-y-3 bg-gray-50">
            <div className="flex gap-2">
              {cart.discountCode ? (
                <div className="flex-1 flex items-center justify-between bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
                  <span className="font-semibold">{cart.discountCode} applied!</span>
                  <button onClick={() => removeCoupon()} className="text-xs hover:text-green-900 underline">Remove</button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm uppercase outline-none focus:border-nn-forest"
                    id="coupon-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = e.currentTarget.value;
                        if (val) {
                          const ok = applyCoupon(val);
                          if (ok) toast.success("Coupon applied!");
                          else toast.error("Invalid or expired coupon");
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('coupon-input') as HTMLInputElement;
                      if (input && input.value) {
                        const ok = applyCoupon(input.value);
                        if (ok) toast.success("Coupon applied!");
                        else toast.error("Invalid or expired coupon");
                        input.value = "";
                      }
                    }}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition"
                  >
                    Apply
                  </button>
                </>
              )}
            </div>

            <div className="flex justify-between text-sm pt-2">
              <span className="text-nn-bark">Subtotal</span>
              <span className="font-bold text-nn-ink">{formatPrice(cart.subtotal)}</span>
            </div>
            {cart.discountAmount ? (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({cart.discountCode})</span>
                <span className="font-semibold">- {formatPrice(cart.discountAmount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-sm">
              <span className="text-nn-bark">Shipping</span>
              <span className="font-semibold text-nn-forest">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-nn-hairline pt-3">
              <span>Total</span>
              <span className="text-nn-leaf">{formatPrice(cart.total ?? cart.subtotal)}</span>
            </div>
            <button 
              onClick={() => {
                setIsNavigating(true);
                router.push("/checkout");
                // We'll close the drawer slightly later or let the navigation handle it
                setTimeout(() => {
                  close();
                  setIsNavigating(false);
                }, 500); // Reset state after navigation happens
              }} 
              disabled={isNavigating}
              className="nn-btn nn-btn-primary w-full text-center py-3 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isNavigating ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isNavigating ? "Redirecting..." : "Proceed to Checkout"}
            </button>
            <p className="text-center text-[11px] text-nn-bark">Secure Payments • COD Available</p>
          </div>
        )}
      </aside>
    </>
  );
}
