import { CartItem } from "@/lib/types";

export interface Address {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface GstDetails {
  companyName: string;
  gstin: string;
}

export interface CheckoutData {
  email: string;
  phone: string;
  shippingAddress: Address;
  billingAddress: Address;
  gstDetails?: GstDetails;
  paymentMethod: string;
  couponCode?: string;
}

/**
 * Update the user's default information in Firestore.
 */
export async function saveUserCheckoutProfile(uid: string, data: CheckoutData) {
  const { db } = await import("./firebase");
  const { doc, setDoc, serverTimestamp } = await import("firebase/firestore/lite");
  const userRef = doc(db, "users", uid);
  
  await setDoc(userRef, {
    uid,
    email: data.email,
    phone: data.phone,
    defaultShippingAddress: data.shippingAddress,
    defaultBillingAddress: data.billingAddress,
    gstDetails: data.gstDetails || null,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

/**
 * Calculates pricing based on payment method and admin bypass.
 */
import { VALID_COUPONS } from "./cart";

export function calculateCheckoutPricing(
  cartItems: CartItem[],
  subtotal: number,
  paymentMethod: string,
  email: string,
  couponCode?: string
) {
  let discount = 0;
  let discountPercent = 0;

  const normalizedCode = couponCode?.toUpperCase().trim();
  if (normalizedCode && VALID_COUPONS[normalizedCode]) {
    const coupon = VALID_COUPONS[normalizedCode];
    if (coupon.type === 'percentage') {
      discount += Math.round(subtotal * (coupon.value / 100));
      discountPercent += coupon.value;
    } else if (coupon.type === 'fixed') {
      discount += coupon.value;
    }
  }

  // Cap discount at subtotal
  if (discount > subtotal) {
    discount = subtotal;
  }

  const amountAfterDiscount = subtotal - discount;

  // Prepaid: full amount
  return {
    subtotal,
    discount,
    discountPercent,
    amountAfterDiscount,
    amountToPay: amountAfterDiscount,
    amountRemaining: 0,
  };
}

/**
 * Creates an order in the 'orders' collection.
 */
