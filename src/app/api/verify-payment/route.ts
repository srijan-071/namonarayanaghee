import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore/lite";
import { sendOrderEmail } from "@/lib/email";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      txnid,
      id,
      razorpay_payment_id,
      payment_id,
      payuid,
      sessionId,
      razorpay_order_id,
      razorpay_signature,
      gateway = "razorpay"
    } = body;

    const cleanOrderId = orderId || txnid || id;
    const paymentId = razorpay_payment_id || payment_id || payuid || sessionId || "verified";

    if (!cleanOrderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const orderRef = doc(db, "orders", cleanOrderId);
    const snap = await getDoc(orderRef);
    if (!snap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = snap.data();

    // Idempotency: Prevent duplicate notifications if customer refreshes the Thank You page
    if (orderData.thankYouPageReached && orderData.paymentStatus === "paid") {
      return NextResponse.json({
        success: true,
        alreadyConfirmed: true,
        order: { ...orderData, id: cleanOrderId }
      });
    }

    const nowIso = new Date().toISOString();

    // 1. Mark order as PAID in Firestore now that user has officially reached the Thank You page
    const updatedFields: Record<string, any> = {
      paymentStatus: "paid",
      status: "processing",
      paymentSessionId: paymentId !== "verified" ? paymentId : (orderData.paymentSessionId || paymentId),
      paymentDetails: {
        ...(orderData.paymentDetails || {}),
        razorpay_payment_id: paymentId,
        razorpay_order_id: razorpay_order_id || orderData.paymentDetails?.razorpay_order_id || null,
        razorpay_signature: razorpay_signature || orderData.paymentDetails?.razorpay_signature || null,
        gateway: gateway || orderData.paymentDetails?.gateway || "razorpay",
        proxyDomain: "potter-world.com",
        paidAt: orderData.paymentDetails?.paidAt || nowIso,
        thankYouPageReachedAt: nowIso,
      },
      thankYouPageReached: true,
      notificationsSent: true,
      updatedAt: new Date()
    };

    await updateDoc(orderRef, updatedFields);

    const mergedOrder = {
      ...orderData,
      ...updatedFields,
      id: cleanOrderId
    };

    // 2. Dispatch Telegram Bot notification and Customer Brevo Confirmation Email in parallel
    const customerEmail = orderData.contactInfo?.email || orderData.shippingAddress?.email;
    const customerName = orderData.shippingAddress?.name || orderData.contactInfo?.name || "Customer";
    const orderTotal = orderData.amountToPay || orderData.totalAmount;

    await Promise.allSettled([
      sendTelegramNotification(cleanOrderId, mergedOrder, "success").catch((err) => {
        console.error("Telegram notification error on thank-you page:", err);
      }),
      customerEmail
        ? sendOrderEmail(cleanOrderId, customerEmail, customerName, orderTotal, mergedOrder).catch((err) => {
            console.error("Customer confirmation email error on thank-you page:", err);
          })
        : Promise.resolve(),
      customerEmail
        ? deleteDoc(doc(db, "abandoned_carts", customerEmail)).catch(() => {})
        : Promise.resolve()
    ]);

    return NextResponse.json({
      success: true,
      order: mergedOrder
    });
  } catch (error: any) {
    console.error("Verify payment / thank you page confirmation error:", error);
    return NextResponse.json({ error: error.message || "Failed to confirm order" }, { status: 500 });
  }
}
