import type { CartItem } from "@/lib/types";

export async function logAbandonedCart(data: { email?: string; phone?: string; name?: string; cartItems: CartItem[]; subtotal: number }) {
  const identifier = (data.phone || data.email || "").trim();
  if (!identifier) return;
  try {
    const { db } = await import("./firebase");
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore/lite");
    const cartRef = doc(db, "abandoned_carts", identifier);
    
    await setDoc(cartRef, {
      email: data.email || "",
      phone: data.phone || "",
      name: data.name || "",
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

export async function clearAbandonedCart(identifier: string) {
  if (!identifier) return;
  try {
    const { db } = await import("./firebase");
    const { doc, deleteDoc } = await import("firebase/firestore/lite");
    const cartRef = doc(db, "abandoned_carts", identifier);
    await deleteDoc(cartRef);
  } catch (error) {
    console.error("Failed to clear abandoned cart", error);
  }
}
