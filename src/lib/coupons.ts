import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, serverTimestamp } from "firebase/firestore/lite";

export async function generateDiwaliCoupon(email: string, phone: string, amount: number): Promise<string> {
  const code = `DIWALI${amount}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const couponRef = doc(collection(db, "coupons"), code);
  await setDoc(couponRef, {
    code,
    amount,
    email,
    phone,
    used: false,
    createdAt: serverTimestamp(),
    expiresAt: new Date("2026-11-15").toISOString() // Post-Diwali expiry
  });

  return code;
}

export async function validateCoupon(code: string, email: string): Promise<{ valid: boolean; amount?: number }> {
  const couponRef = doc(db, "coupons", code.toUpperCase());
  const snap = await getDoc(couponRef);

  if (!snap.exists()) return { valid: false };

  const data = snap.data();
  if (data.used || data.email !== email) return { valid: false };

  return { valid: true, amount: data.amount };
}
