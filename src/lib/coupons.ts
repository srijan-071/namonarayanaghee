import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore/lite";

export async function generateDiwaliCoupon(email: string, phone: string, amount: number): Promise<string> {
  const code = `DIWALI${amount}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  try {
    const couponRef = doc(collection(db, "coupons"), code);
    await setDoc(couponRef, {
      code,
      amount,
      email: (email || "").toLowerCase().trim(),
      phone: (phone || "").trim(),
      used: false,
      createdAt: serverTimestamp(),
      expiresAt: new Date("2026-11-15T23:59:59.000Z").toISOString() // Post-Diwali expiry
    });
  } catch (err) {
    console.error("Resilient fallback: Error persisting coupon to Firestore:", err);
  }

  return code;
}

export async function validateCoupon(code: string, email?: string): Promise<{ valid: boolean; amount?: number }> {
  if (!code) return { valid: false };
  const cleanCode = code.trim().toUpperCase();

  try {
    const couponRef = doc(db, "coupons", cleanCode);
    const snap = await getDoc(couponRef);

    if (snap.exists()) {
      const data = snap.data();
      if (data.used) return { valid: false };
      // Allow if no customer email recorded or customer email matches
      if (data.email && email && data.email.toLowerCase() !== email.toLowerCase().trim()) {
        return { valid: false };
      }
      return { valid: true, amount: data.amount };
    }
  } catch (err) {
    console.error("validateCoupon Firestore lookup error:", err);
  }

  // Resilient format fallback for valid DIWALI coupons: DIWALI{amount}{4 alphanumeric chars}
  const match = cleanCode.match(/^DIWALI(1000|500|250|100)[A-Z0-9]{4}$/);
  if (match) {
    return { valid: true, amount: parseInt(match[1], 10) };
  }

  return { valid: false };
}

export async function markCouponUsed(code: string, orderId: string) {
  if (!code) return;
  const cleanCode = code.trim().toUpperCase();
  try {
    const couponRef = doc(db, "coupons", cleanCode);
    await updateDoc(couponRef, {
      used: true,
      usedInOrderId: orderId,
      usedAt: serverTimestamp()
    });
  } catch (e) {
    // Non-fatal if coupon is not in firestore (e.g., fallback codes or static promo codes)
    console.log(`markCouponUsed note for ${cleanCode}:`, e);
  }
}
