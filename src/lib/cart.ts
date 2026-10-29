"use client";


import { createContext, useContext, useSyncExternalStore } from "react";
import type { Cart, CartItem } from "@/lib/types";

// ─── Storage abstraction (swap for API later) ───────────
const STORAGE_KEY = "nn-cart";
const EMPTY_CART: Cart = Object.freeze({ items: [], totalItems: 0, subtotal: 0 });

// Cache the last-read cart so getSnapshot returns a stable reference
let cachedCart: Cart = EMPTY_CART;
let cachedRaw: string | null = null;

function readCart(): Cart {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedCart;
    cachedRaw = raw;
    cachedCart = raw ? (JSON.parse(raw) as Cart) : EMPTY_CART;
    return cachedCart;
  } catch { /* noop */ }
  return EMPTY_CART;
}

function writeCart(cart: Cart) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(cart);
  cachedRaw = raw;
  cachedCart = cart;
  localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event("nn-cart-change"));
}

export const VALID_COUPONS: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
  "NAMO10": { type: 'percentage', value: 10 },
  "DIWALI": { type: 'percentage', value: 10 },
  "DIWALI2026": { type: 'percentage', value: 10 },
  "SHUBHLAABH": { type: 'fixed', value: 100 },
  "ELVISH10": { type: 'percentage', value: 10 },
  "NAMO50": { type: 'fixed', value: 50 },
  "WELCOME": { type: 'percentage', value: 5 },
  "GHEE100": { type: 'fixed', value: 100 }
};

function recalculate(items: CartItem[], discountCode?: string): Cart {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  let discountAmount = 0;
  let validCode: string | undefined = undefined;

  if (discountCode && VALID_COUPONS[discountCode]) {
    const coupon = VALID_COUPONS[discountCode];
    validCode = discountCode;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round(subtotal * (coupon.value / 100));
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.value * 100;
    }
    // ensure discount doesn't exceed subtotal
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }
  }

  return {
    items,
    totalItems: items.reduce((s, i) => s + i.quantity, 0),
    subtotal,
    discountCode: validCode,
    discountAmount,
    total: subtotal - discountAmount,
  };
}

// ─── Public API ─────────────────────────────────────────
export function addToCart(item: Omit<CartItem, "quantity">, qty = 1) {
  const cart = readCart();
  const items = [...cart.items];
  const idx = items.findIndex((i) => i.variantId === item.variantId);
  if (idx >= 0) {
    items[idx] = { ...items[idx], quantity: items[idx].quantity + qty };
  } else {
    items.push({ ...item, quantity: qty });
  }

  const updatedCart = recalculate(items, cart.discountCode);
  writeCart(updatedCart);

  // Send Telegram Notification (Step 1: Cart Initiated)
  if (typeof window !== "undefined") {
    const sessionKey = "nn_cart_notified";
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "true");

      let giftName = "";
      const vLower = (item.variantTitle || "").toLowerCase();
      if (vLower.includes("2.5")) {
        giftName = "3x FREE Oils (Coconut, Yellow Mustard, Mustard)";
      } else if (vLower.includes("5")) {
        giftName = "3x Mega FREE Oils (Coconut, Groundnut, Mustard 500ml)";
      } else if (vLower.includes("1") || !vLower.includes("500")) {
        giftName = "FREE 250ml Cold-Pressed Mustard Oil (Worth ₹150)";
      }

      setTimeout(() => {
        fetch("/api/send-telegram-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "cart_initiated",
            orderData: {
              itemTitle: item.title,
              variantTitle: item.variantTitle,
              price: item.price,
              quantity: qty,
              cartTotal: updatedCart.total,
              itemsCount: items.length,
              freeGift: giftName,
            }
          })
        }).catch(() => {});
      }, 0);
    }
  }
}

export function removeFromCart(variantId: number) {
  const cart = readCart();
  writeCart(recalculate(cart.items.filter((i) => i.variantId !== variantId), cart.discountCode));
}

export function updateQuantity(variantId: number, qty: number) {
  const cart = readCart();
  const items = [...cart.items];
  const idx = items.findIndex((i) => i.variantId === variantId);
  if (idx >= 0) {
    if (qty <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx] = { ...items[idx], quantity: qty };
    }
  }
  writeCart(recalculate(items, cart.discountCode));
}

export function clearCart() {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem("nn_cart_notified");
    } catch {
      // Ignore in private/restricted storage
    }
  }
  writeCart({ items: [], totalItems: 0, subtotal: 0 });
}

export function applyCoupon(code: string): boolean {
  const cart = readCart();
  const normalized = code.trim().toUpperCase();
  if (VALID_COUPONS[normalized]) {
    writeCart(recalculate(cart.items, normalized));
    return true;
  }
  return false;
}

export function removeCoupon() {
  const cart = readCart();
  writeCart(recalculate(cart.items, undefined));
}

// ─── React hook ─────────────────────────────────────────
function subscribe(cb: () => void) {
  window.addEventListener("nn-cart-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("nn-cart-change", cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): Cart {
  return readCart();
}

function getServerSnapshot(): Cart {
  return EMPTY_CART;
}

export function useCart(): Cart {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ─── Cart drawer state ──────────────────────────────────
export const CartDrawerContext = createContext<{
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export const useCartDrawer = () => useContext(CartDrawerContext);
