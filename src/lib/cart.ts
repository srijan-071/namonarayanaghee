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

function recalculate(items: CartItem[]): Cart {
  return {
    items,
    totalItems: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
  };
}

// ─── Public API ─────────────────────────────────────────
export function addToCart(item: Omit<CartItem, "quantity">, qty = 1) {
  const cart = readCart();
  const idx = cart.items.findIndex((i) => i.variantId === item.variantId);
  if (idx >= 0) {
    cart.items[idx].quantity += qty;
  } else {
    cart.items.push({ ...item, quantity: qty });
  }
  writeCart(recalculate(cart.items));
}

export function removeFromCart(variantId: number) {
  const cart = readCart();
  writeCart(recalculate(cart.items.filter((i) => i.variantId !== variantId)));
}

export function updateQuantity(variantId: number, qty: number) {
  const cart = readCart();
  const idx = cart.items.findIndex((i) => i.variantId === variantId);
  if (idx >= 0) {
    if (qty <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = qty;
    }
  }
  writeCart(recalculate(cart.items));
}

export function clearCart() {
  writeCart({ items: [], totalItems: 0, subtotal: 0 });
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
