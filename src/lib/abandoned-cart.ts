import type { CartItem } from "@/lib/types";
import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore/lite";

export type CartRecoveryStatus = 'active' | 'pending' | 'failed' | 'abandoned' | 'recovered' | 'paid';

export interface AbandonedCartRecord {
  email?: string;
  phone?: string;
  name?: string;
  cartItems: CartItem[];
  subtotal: number;
  orderId?: string;
  status: CartRecoveryStatus;
  lastActive: any;
  updatedAt?: any;
  paidAt?: any;
  failedReason?: string;
  recovered: boolean;
  notified: boolean;
}

export async function logAbandonedCart(data: {
  email?: string;
  phone?: string;
  name?: string;
  cartItems: CartItem[];
  subtotal: number;
  status?: CartRecoveryStatus;
}) {
  const identifier = (data.phone || data.email || "").trim();
  if (!identifier) return;
  try {
    const cartRef = doc(db, "abandoned_carts", identifier);
    
    await setDoc(cartRef, {
      email: data.email || "",
      phone: data.phone || "",
      name: data.name || "",
      cartItems: data.cartItems,
      subtotal: data.subtotal,
      lastActive: serverTimestamp(),
      status: data.status || "active",
      recovered: false,
      notified: false
    }, { merge: true });
  } catch (error) {
    console.error("Failed to log abandoned cart", error);
  }
}

export async function updateAbandonedCartStatus(
  identifier: string,
  status: CartRecoveryStatus,
  extra: { orderId?: string; failedReason?: string } = {}
) {
  if (!identifier) return;
  try {
    const cartRef = doc(db, "abandoned_carts", identifier);
    
    const updatePayload: Record<string, any> = {
      status,
      updatedAt: serverTimestamp(),
    };
    if (extra.orderId) updatePayload.orderId = extra.orderId;
    if (extra.failedReason) updatePayload.failedReason = extra.failedReason;
    if (status === 'paid' || status === 'recovered') {
      updatePayload.recovered = true;
      updatePayload.paidAt = serverTimestamp();
    }
    
    await setDoc(cartRef, updatePayload, { merge: true });
  } catch (error) {
    console.error("Failed to update abandoned cart status", error);
  }
}

/**
 * Mark abandoned cart as paid/recovered across both phone and email keys.
 * Preserves the audit lifecycle instead of hard-deleting immediately.
 */
export async function clearAbandonedCart(identifier: string) {
  if (!identifier) return;
  return updateAbandonedCartStatus(identifier, "paid");
}
