import { NextResponse } from 'next/server';
import { firestoreGetDoc, firestoreUpdateDoc, firestoreDeleteDoc } from "@/lib/firestore-rest";
import { sendOrderEmail } from "@/lib/email";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

    if (!orderId || !razorpay_payment_id) {
      return NextResponse.json({ error: "Missing orderId or payment id" }, { status: 400 });
    }

    const orderData = await firestoreGetDoc("orders", orderId);
    if (!orderData) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (orderData.paymentStatus === "paid") {
      return NextResponse.json({ success: true, message: "Order already marked as paid" });
    }

    await firestoreUpdateDoc("orders", orderId, {
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

    if (orderData.contactInfo?.email) {
      await sendOrderEmail(
        orderId,
        orderData.contactInfo.email,
        orderData.shippingAddress?.name || "Customer",
        orderData.amountToPay || orderData.totalAmount
      ).catch(err => console.error("Email notification failed:", err));

      await firestoreDeleteDoc("abandoned_carts", orderData.contactInfo.email)
        .catch(err => console.error("Abandoned cart cleanup failed:", err));
    }

    await sendTelegramNotification(orderId, orderData, "success")
      .catch(err => console.error("Telegram notification failed:", err));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify order" }, { status: 500 });
  }
}
