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
 * Creates an order in the 'orders' collection.
 */
export async function createOrder(uid: string, cartItems: CartItem[], subtotal: number, data: CheckoutData) {
  const ordersRef = collection(db, "orders");
  
  // Hardcoded for now. In a real app, calculate taxes/shipping on backend.
  const shippingCost = 0; 
  const tax = 0; // Or extract from subtotal if inclusive
  const totalAmount = subtotal + shippingCost + tax;

  const orderDoc = await addDoc(ordersRef, {
    userId: uid,
    items: cartItems,
    subtotal,
    shippingCost,
    tax,
    totalAmount,
    shippingAddress: data.shippingAddress,
    billingAddress: data.billingAddress,
    gstDetails: data.gstDetails || null,
    contactInfo: {
      email: data.email,
      phone: data.phone
    },
    paymentMethod: data.paymentMethod,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  // Store the orderId back in the document
  await setDoc(orderDoc, { orderId: orderDoc.id }, { merge: true });

  return orderDoc.id;
}
