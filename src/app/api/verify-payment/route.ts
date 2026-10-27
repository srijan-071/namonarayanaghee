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

    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

    if (!orderId || !razorpay_payment_id) {
      return NextResponse.json({ error: "Missing orderId or payment id" }, { status: 400 });
    }

    const orderRef = doc(db, "orders", orderId);
    const snap = await getDoc(orderRef);
    if (!snap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = snap.data();

    // Update order in Firestore
    await updateDoc(orderRef, {
      paymentStatus: "paid",
      status: "processing",
      paymentSessionId: razorpay_payment_id,
      paymentDetails: {
        razorpay_payment_id,
        razorpay_order_id: razorpay_order_id || null,
        razorpay_signature: razorpay_signature || null,
        gateway: "razorpay",
        proxyDomain: "potter-world.com",
        paidAt: new Date().toISOString()
      },
      updatedAt: new Date()
    });

    // Proactively send email notification
    if (orderData.contactInfo?.email) {
      sendOrderEmail(
        orderId,
        orderData.contactInfo.email,
        orderData.shippingAddress?.name || "Customer",
        orderData.amountToPay || orderData.totalAmount,
        orderData
      ).catch(err => console.error("Email notification failed:", err));

      deleteDoc(doc(db, "abandoned_carts", orderData.contactInfo.email))
        .catch(err => console.error("Abandoned cart cleanup failed:", err));
    }

    // Proactively send Telegram alert (Step 3: Payment Successful)
    sendTelegramNotification(
      orderId,
      {
        ...orderData,
        paymentSessionId: razorpay_payment_id,
        paymentStatus: "paid"
      },
      "success"
    ).catch(err => console.error("Telegram notification failed:", err));

    return NextResponse.json({ success: true, order: { ...orderData, paymentStatus: "paid" } });
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify order" }, { status: 500 });
  }
}
