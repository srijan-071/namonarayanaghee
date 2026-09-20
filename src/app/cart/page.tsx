"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, removeFromCart, updateQuantity, clearCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function CartPage() {
  const cart = useCart();

  const handleRemove = (variantId: number) => {
    removeFromCart(variantId);
    toast.success("Item removed from cart");
  };

  const handleUpdate = (variantId: number, newQty: number) => {
    updateQuantity(variantId, newQty);
  };

  const handleClear = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  return (
    <section className="nn-section bg-white min-h-[60vh]">
      <div className="nn-container max-w-4xl mx-auto">
        <h1 className="nn-title text-center mb-10">Your Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <svg className="w-20 h-20 mx-auto text-nn-hairline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" />
              <path d="M1.5 2h3l2.7 12.4a2 2 0 002 1.6h8.6a2 2 0 002-1.6L21.5 6H6" />
            </svg>
            <h2 className="font-serif text-xl font-bold text-nn-ink">Your cart is empty</h2>
            <p className="nn-sub">Add something pure and farm-fresh!</p>
            <Link href="/collections/all-products" className="nn-btn nn-btn-primary mt-4">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 divide-y divide-nn-hairline">
              {cart.items.map((item) => (
                <div key={item.variantId} className="flex gap-4 py-6">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-nn-hairline shrink-0 bg-nn-cream">
                    {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" sizes="96px" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} className="font-semibold text-nn-ink hover:text-nn-forest transition-colors">{item.title}</Link>
                    {item.variantTitle && <p className="text-sm text-nn-bark">{item.variantTitle}</p>}
                    <p className="text-nn-leaf font-bold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="inline-flex items-center border border-nn-hairline rounded-lg">
                        <button onClick={() => handleUpdate(item.variantId, item.quantity - 1)} className="px-3 py-1.5 hover:bg-gray-50">−</button>
                        <span className="px-3 py-1.5 text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => handleUpdate(item.variantId, item.quantity + 1)} className="px-3 py-1.5 hover:bg-gray-50">+</button>
                      </div>
                      <button onClick={() => handleRemove(item.variantId)} className="text-sm text-red-500 hover:text-red-700">Remove</button>
                    </div>
                  </div>
                  <div className="text-right font-bold text-nn-ink">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <button onClick={handleClear} className="text-sm text-nn-bark hover:text-red-600 transition-colors">Clear Cart</button>
              </div>
            </div>

            {/* Summary */}
            <div className="nn-card p-6 h-fit sticky top-24">
              <h2 className="font-serif text-lg font-bold text-nn-ink mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-nn-bark">Subtotal ({cart.totalItems} items)</span><span className="font-semibold">{formatPrice(cart.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-nn-bark">Shipping</span><span className="font-semibold text-nn-forest">FREE</span></div>
                <div className="border-t border-nn-hairline pt-3 flex justify-between text-base font-bold">
                  <span>Total</span><span className="text-nn-leaf">{formatPrice(cart.subtotal)}</span>
                </div>
              </div>
              <Link href="/checkout" className="nn-btn nn-btn-primary w-full text-center mt-6 py-3">Proceed to Checkout</Link>
              <Link href="/collections/all-products" className="nn-btn nn-btn-ghost w-full text-center mt-3">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
