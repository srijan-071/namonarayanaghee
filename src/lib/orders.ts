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
  paymentMethod: string = "prepaid",
  email: string = "",
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
      discount += coupon.value * 100; // Value is in rupees, subtotal is in paise
    }
  } else if (normalizedCode && /^DIWALI(1000|500|250|100)/.test(normalizedCode)) {
    const match = normalizedCode.match(/^DIWALI(1000|500|250|100)/);
    if (match) {
      const val = parseInt(match[1], 10);
      discount += val * 100; // Convert rupee reward into paise
    }
  }

  // Cap coupon discount at subtotal
  if (discount > subtotal) {
    discount = subtotal;
  }

  const isCod = paymentMethod === "cod";
  const codFee = isCod ? 25000 : 0; // ₹250 in paise
  const prepaidDiscount = isCod ? 0 : 10000; // Flat ₹100 instant prepaid discount (10,000 paise)
  const amountAfterCoupon = Math.max(0, subtotal - discount);

  if (isCod) {
    // COD: Customer pays ₹250 online advance now, remaining product subtotal at delivery
    const totalAmount = amountAfterCoupon + codFee;
    const amountToPay = 25000; // ₹250 online advance confirmation fee
    const amountRemaining = amountAfterCoupon; // Remaining product amount payable upon delivery

    return {
      subtotal,
      discount,
      discountPercent,
      codFee,
      prepaidDiscount: 0,
      amountAfterDiscount: amountAfterCoupon,
      totalAmount,
      amountToPay,
      amountRemaining,
      paymentMethod: "cod"
    };
  } else {
    // Prepaid: Customer pays online, receives ₹100 flat discount + saves ₹250 COD fee
    const totalAmount = Math.max(0, amountAfterCoupon - prepaidDiscount);
    const amountToPay = totalAmount;

    return {
      subtotal,
      discount,
      discountPercent,
      codFee: 0,
      prepaidDiscount: 10000,
      amountAfterDiscount: totalAmount,
      totalAmount,
      amountToPay,
      amountRemaining: 0,
      paymentMethod: "prepaid"
    };
  }
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

  const selectedPaymentMethod = data?.paymentMethod || pricing?.paymentMethod || "prepaid";
  const isCod = selectedPaymentMethod === "cod";
  const codFee = Number(pricing?.codFee ?? (isCod ? 25000 : 0));
  const prepaidDiscount = Number(pricing?.prepaidDiscount ?? (isCod ? 0 : 10000));
  const resolvedSubtotal = Number(pricing?.subtotal ?? subtotal) || 0;
  const resolvedDiscount = Number(pricing?.discount) || 0;
  const resolvedDiscountPercent = Number(pricing?.discountPercent) || 0;
  const resolvedAmountAfterDiscount = Number(pricing?.amountAfterDiscount ?? (resolvedSubtotal - resolvedDiscount)) || 0;
  const resolvedTotalAmount = Number(pricing?.totalAmount ?? (isCod ? (resolvedAmountAfterDiscount + codFee) : resolvedAmountAfterDiscount)) || 0;
  const resolvedAmountToPay = Number(pricing?.amountToPay ?? (isCod ? 25000 : resolvedTotalAmount)) || 0;
  const resolvedAmountRemaining = Number(pricing?.amountRemaining ?? (isCod ? resolvedAmountAfterDiscount : 0)) || 0;

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
    codFee,
    prepaidDiscount,
    advancePaid: isCod ? resolvedAmountToPay : 0,
    balanceDueOnDelivery: isCod ? resolvedAmountRemaining : 0,
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
    customerName: data?.shippingAddress?.name || "",
    customerEmail: data?.email || "",
    customerPhone: data?.phone || "",
    source: "web_checkout",
    paymentMethod: selectedPaymentMethod,
    paymentStatus: "pending",
    paymentSessionId: null,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(orderDoc, orderPayload);

  return {
    orderId: orderDoc.id,
    id: orderDoc.id,
    toString: () => orderDoc.id,
    valueOf: () => orderDoc.id,
  };
}
