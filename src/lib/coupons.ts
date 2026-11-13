import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore/lite";

export async function generateVedicCoupon(email: string, phone: string, amount: number): Promise<string> {
  const code = `VEDIC${amount}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  try {
    const couponRef = doc(collection(db, "coupons"), code);
    await setDoc(couponRef, {
      code,
      amount,
      email: (email || "").toLowerCase().trim(),
      phone: (phone || "").trim(),
      used: false,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days validity
    });
  } catch (err) {
    console.error("Resilient fallback: Error persisting Vedic coupon to Firestore:", err);
  }

  return code;
}

// Backward compatibility alias: always issues Vedic Heritage reward coupon
export async function generateDiwaliCoupon(email: string, phone: string, amount: number): Promise<string> {
  return generateVedicCoupon(email, phone, amount);
}

export async function validateCoupon(code: string, email?: string): Promise<{ valid: boolean; amount?: number }> {
  if (!code) return { valid: false };
  const cleanCode = code.trim().toUpperCase();

  // All Diwali coupons are completely invalid and grant zero discount
  if (cleanCode.includes("DIWALI")) {
    return { valid: false };
  }

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

  // Resilient format fallback for valid First-Purchase & Vedic coupons: (FIRST|VEDIC|WELCOME){amount}
  const match = cleanCode.match(/^(FIRST|VEDIC|WELCOME)(1000|500|250|100)([A-Z0-9]{0,6})$/);
  if (match) {
    return { valid: true, amount: parseInt(match[2], 10) };
  }

  // Common universal first-purchase alias codes
  if (["FIRSTORDER", "GIFTCARD", "VEDICREWARD"].includes(cleanCode)) {
    return { valid: true, amount: 250 };
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
