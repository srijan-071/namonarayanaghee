import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore/lite";
import { sendOrderEmail } from "@/lib/email";
import { sendTelegramNotification } from "@/lib/telegram";
import { checkBotId } from "botid/server";

export async function POST(req: Request) {
  try {
    try {
      const verification = await checkBotId();
      if (verification?.isBot) {
        return NextResponse.json(
          { error: "Bot detected. Access denied." },
          { status: 403 }
        );
      }
    } catch {
      // Fallback for non-production environments
    }

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

    // 2. Send Telegram Bot Notification for Order Success (Customer reached Thank You page)
    try {
      await sendTelegramNotification(
        cleanOrderId,
        mergedOrder,
        "success"
      );
    } catch (telegramErr) {
      console.error("Telegram notification error on thank-you page:", telegramErr);
    }

    // 3. Send Order Confirmation Email to customer's entered email with complete order details
    const customerEmail = orderData.contactInfo?.email || orderData.shippingAddress?.email;
    if (customerEmail) {
      try {
        await sendOrderEmail(
          cleanOrderId,
          customerEmail,
          orderData.shippingAddress?.name || "Customer",
          orderData.amountToPay || orderData.totalAmount,
          mergedOrder
        );
      } catch (emailErr) {
        console.error("Customer confirmation email error on thank-you page:", emailErr);
      }

      // 4. Clean up abandoned cart
      try {
        await deleteDoc(doc(db, "abandoned_carts", customerEmail));
      } catch (cartErr) {
        // Non-fatal
      }
    }

    return NextResponse.json({
      success: true,
      order: mergedOrder
    });
  } catch (error: any) {
    console.error("Verify payment / thank you page confirmation error:", error);
    return NextResponse.json({ error: error.message || "Failed to confirm order" }, { status: 500 });
  }
}
