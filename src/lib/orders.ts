import { doc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
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
}

/**
 * Update the user's default information in Firestore.
 */
export async function saveUserCheckoutProfile(uid: string, data: CheckoutData) {
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
export function calculateCheckoutPricing(
  subtotal: number,
  paymentMethod: string,
  email: string
) {
  const isAdmin = email.toLowerCase().trim() === "littlecodr@gmail.com";

  let discount = 0;
  let discountPercent = 0;
  let amountAfterDiscount = subtotal;

  // Prepaid gets 10% discount
  if (paymentMethod === "prepaid") {
    discountPercent = 10;
    discount = Math.round(subtotal * 0.10);
    amountAfterDiscount = subtotal - discount;
  }

  // Admin bypass: ₹1 = 100 paise
  if (isAdmin) {
    return {
      subtotal,
      discount,
      discountPercent,
      amountAfterDiscount: isAdmin ? 100 : amountAfterDiscount,
      amountToPay: 100, // ₹1
      amountRemaining: 0,
      isAdmin: true,
    };
  }

  // COD: 20% advance, 80% on delivery
  if (paymentMethod === "cod") {
    const advanceAmount = Math.round(amountAfterDiscount * 0.20);
    const remaining = amountAfterDiscount - advanceAmount;
    return {
      subtotal,
      discount,
      discountPercent,
      amountAfterDiscount,
      amountToPay: advanceAmount,
      amountRemaining: remaining,
      isAdmin: false,
    };
  }

  // Prepaid: full amount
  return {
    subtotal,
    discount,
    discountPercent,
    amountAfterDiscount,
    amountToPay: amountAfterDiscount,
    amountRemaining: 0,
    isAdmin: false,
  };
}

/**
 * Creates an order in the 'orders' collection.
 */
export async function createOrder(
  uid: string,
  cartItems: CartItem[],
  subtotal: number,
  data: CheckoutData,
  pricing: ReturnType<typeof calculateCheckoutPricing>
) {
  const ordersRef = collection(db, "orders");
  
  const shippingCost = 0; 
  const tax = 0;

  const orderDoc = await addDoc(ordersRef, {
    userId: uid,
    items: cartItems.map(item => ({
      productId: item.productId,
      variantId: item.variantId,
      slug: item.slug,
      name: item.title,
      title: item.title,
      variantTitle: item.variantTitle,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    })),
    subtotal,
    shippingCost,
    tax,
    totalAmount: pricing.amountAfterDiscount,
    discount: pricing.discount,
    discountPercent: pricing.discountPercent,
    amountToPay: pricing.amountToPay,
    amountRemaining: pricing.amountRemaining,
    shippingAddress: data.shippingAddress,
    billingAddress: data.billingAddress,
    gstDetails: data.gstDetails || null,
    contactInfo: {
      email: data.email,
      phone: data.phone
    },
    paymentMethod: data.paymentMethod,
    paymentStatus: "pending",
    paymentSessionId: null,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  // Store the orderId back in the document
  await setDoc(orderDoc, { orderId: orderDoc.id }, { merge: true });

  return orderDoc.id;
}
