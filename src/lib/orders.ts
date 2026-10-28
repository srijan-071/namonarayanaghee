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
  email?: string;
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
export async function saveUserCheckoutProfile(
  uid: string, 
  data: Partial<CheckoutData> & { fullName?: string }
) {
  if (!uid || uid.startsWith("guest_")) return;
  const { db } = await import("./firebase");
  const { doc, setDoc, serverTimestamp } = await import("firebase/firestore/lite");
  const userRef = doc(db, "users", uid);
  
  await setDoc(userRef, {
    uid,
    fullName: data.fullName || null,
    email: data.email || null,
    phone: data.phone || "",
    defaultShippingAddress: data.shippingAddress || null,
    defaultBillingAddress: data.billingAddress || data.shippingAddress || null,
    gstDetails: data.gstDetails ? {
      companyName: data.gstDetails.companyName || "",
      gstin: data.gstDetails.gstin || ""
    } : null,
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

import type { FreeGift } from "./gifts";

export type CreateOrderResult = {
  orderId: string;
  id: string;
  toString: () => string;
  valueOf: () => string;
};

/**
 * Creates an order in the 'orders' collection.
 * Resilient to both (uid, cartItems, subtotal, data, pricing, freeGifts) 
 * and (uid, cartItems, pricing, data, freeGifts) calling conventions.
 * Strictly sanitizes all fields to prevent Firestore 'undefined' exceptions.
 */
export async function createOrder(
  uid: string,
  cartItems: CartItem[] = [],
  subtotalOrPricing: any,
  data: CheckoutData,
  pricingOrFreeGifts?: any,
  maybeFreeGifts?: FreeGift[]
): Promise<CreateOrderResult> {
  const { db } = await import("./firebase");
  const { doc, setDoc, serverTimestamp, collection } = await import("firebase/firestore/lite");
  const ordersRef = collection(db, "orders");
  const orderDoc = doc(ordersRef);

  // Normalize parameters dynamically
  let pricing: any = {};
  let subtotal = 0;
  let freeGifts: FreeGift[] = [];

  if (typeof subtotalOrPricing === "object" && subtotalOrPricing !== null) {
    // Called as: (uid, cartItems, pricing, data, freeGifts)
    pricing = subtotalOrPricing;
    freeGifts = (Array.isArray(pricingOrFreeGifts) ? pricingOrFreeGifts : maybeFreeGifts) || [];
    subtotal = Number(pricing.subtotal) || (cartItems || []).reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
  } else {
    // Called as: (uid, cartItems, subtotal, data, pricing, freeGifts)
    subtotal = Number(subtotalOrPricing) || 0;
    if (pricingOrFreeGifts && !Array.isArray(pricingOrFreeGifts)) {
      pricing = pricingOrFreeGifts;
      freeGifts = Array.isArray(maybeFreeGifts) ? maybeFreeGifts : [];
    } else if (Array.isArray(pricingOrFreeGifts)) {
      freeGifts = pricingOrFreeGifts;
    }
  }

  const resolvedSubtotal = Number(pricing?.subtotal ?? subtotal) || 0;
  const resolvedDiscount = Number(pricing?.discount) || 0;
  const resolvedDiscountPercent = Number(pricing?.discountPercent) || 0;
  const resolvedAmountAfterDiscount = Number(pricing?.amountAfterDiscount ?? (resolvedSubtotal - resolvedDiscount)) || 0;
  const resolvedTotalAmount = resolvedAmountAfterDiscount;
  const resolvedAmountToPay = Number(pricing?.amountToPay ?? resolvedAmountAfterDiscount) || 0;
  const resolvedAmountRemaining = Number(pricing?.amountRemaining) || 0;

  const shippingCost = 0;
  const tax = 0;

  // Build full items list including free gift items
  const fullItems = [
    ...(cartItems || []).map(item => ({
      productId: item.productId ?? 0,
      variantId: item.variantId ?? 0,
      slug: item.slug || "",
      name: item.title || "",
      title: item.title || "",
      variantTitle: item.variantTitle || "",
      price: Number(item.price) || 0,
      image: item.image || "",
      quantity: Number(item.quantity) || 1,
      isGift: false,
    })),
    ...(freeGifts || []).map(gift => ({
      productId: 0,
      variantId: 0,
      slug: gift.id || "free-gift",
      name: gift.name || "Free Gift",
      title: gift.name || "Free Gift",
      variantTitle: `${gift.size || ""} (Free Gift)`.trim(),
      price: 0,
      image: gift.image || "",
      quantity: Number(gift.quantity) || 1,
      isGift: true,
    }))
  ];

  const sanitizeAddress = (addr?: Partial<Address> | null) => ({
    name: addr?.name || "",
    address: addr?.address || "",
    city: addr?.city || "",
    state: addr?.state || "",
    pincode: addr?.pincode || "",
    country: addr?.country || "India"
  });

  const orderPayload = {
    orderId: orderDoc.id,
    userId: uid || "guest",
    items: fullItems,
    freeGifts: (freeGifts || []).map(g => ({
      name: g?.name || "",
      variant: g?.variant || "",
      size: g?.size || "",
      quantity: Number(g?.quantity) || 1,
      image: g?.image || ""
    })),
    subtotal: resolvedSubtotal,
    shippingCost,
    tax,
    totalAmount: resolvedTotalAmount,
    discount: resolvedDiscount,
    discountPercent: resolvedDiscountPercent,
    couponCode: data?.couponCode || null,
    amountToPay: resolvedAmountToPay,
    amountRemaining: resolvedAmountRemaining,
    shippingAddress: sanitizeAddress(data?.shippingAddress),
    billingAddress: sanitizeAddress(data?.billingAddress || data?.shippingAddress),
    gstDetails: data?.gstDetails ? {
      companyName: data.gstDetails.companyName || "",
      gstin: data.gstDetails.gstin || ""
    } : null,
    contactInfo: {
      email: data?.email || null,
      phone: data?.phone || ""
    },
    paymentMethod: data?.paymentMethod || "prepaid",
    paymentStatus: "pending",
    paymentSessionId: null,
    status: "pending",
    createdAt: serverTimestamp(),
  };

  await setDoc(orderDoc, orderPayload);

  return {
    orderId: orderDoc.id,
    id: orderDoc.id,
    toString: () => orderDoc.id,
    valueOf: () => orderDoc.id,
  };
}
