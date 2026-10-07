import type { CartItem } from "@/lib/types";

export async function logAbandonedCart(data: { email: string; phone?: string; cartItems: CartItem[]; subtotal: number }) {
  if (!data.email) return;
  try {
    const { db } = await import("./firebase");
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore/lite");
    const cartRef = doc(db, "abandoned_carts", data.email);
    
    await setDoc(cartRef, {
      email: data.email,
      phone: data.phone || "",
      cartItems: data.cartItems,
      subtotal: data.subtotal,
      lastActive: serverTimestamp(),
      recovered: false,
      notified: false
    }, { merge: true });
  } catch (error) {
    console.error("Failed to log abandoned cart", error);
  }
}

export async function clearAbandonedCart(email: string) {
  if (!email) return;
  try {
    const { db } = await import("./firebase");
    const { doc, deleteDoc } = await import("firebase/firestore/lite");
    const cartRef = doc(db, "abandoned_carts", email);
    await deleteDoc(cartRef);
  } catch (error) {
    console.error("Failed to clear abandoned cart", error);
  }
}
