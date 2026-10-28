import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { sendAbandonedCartRecoveryEmail } from "@/lib/transactional-emails";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      phone,
      orderId,
      items,
      subtotal,
      freeGift,
      couponCode = "DIWALI"
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let finalName = name;
    let finalItems = items;
    let finalSubtotal = subtotal;
    let finalPhone = phone;

    // If orderId is provided, enrich details from order
    if (orderId) {
      try {
        const orderRef = doc(db, "orders", orderId);
        const snap = await getDoc(orderRef);
        if (snap.exists()) {
          const orderData = snap.data();
          finalName = finalName || orderData.shippingAddress?.name || orderData.contactInfo?.name;
          finalPhone = finalPhone || orderData.contactInfo?.phone;
          finalItems = finalItems || orderData.items;
          finalSubtotal = finalSubtotal || orderData.subtotal;
        }
      } catch (err) {
        console.warn("Could not fetch order to enrich recovery cart:", err);
      }
    }

    const cartUrl = `https://www.namonarayanaghee.store/checkout${orderId ? `?restoreOrder=${orderId}` : ""}`;

    const emailResult = await sendAbandonedCartRecoveryEmail({
      email,
      name: finalName || "Customer",
      phone: finalPhone,
      items: finalItems,
      subtotal: finalSubtotal,
      freeGift: freeGift || "Surprise Festive Gift (Brass Spoon / Diya)",
      cartUrl,
      orderId,
      couponCode,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || "Failed to dispatch Brevo recovery email" },
        { status: 500 }
      );
    }

    // Record recovery status in Firestore
    const nowIso = new Date().toISOString();

    // 1. If abandoned_cart doc exists
    try {
      const cartRef = doc(db, "abandoned_carts", email);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        await updateDoc(cartRef, {
          recoveryEmailSent: true,
          recoverySentAt: nowIso,
          recoveryCoupon: couponCode,
        });
      }
    } catch {}

    // 2. If order exists
    if (orderId) {
      try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
          recoveryEmailSent: true,
          recoverySentAt: nowIso,
          recoveryCoupon: couponCode,
        });
      } catch {}
    }

    return NextResponse.json({
      success: true,
      message: `Recovery email dispatched to ${email}`,
      sentAt: nowIso,
    });
  } catch (error: any) {
    console.error("Cart recovery API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send recovery email" },
      { status: 500 }
    );
  }
}
