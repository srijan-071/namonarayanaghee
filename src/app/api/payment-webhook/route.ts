import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { sendOrderEmail } from "@/lib/email";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, orderId, status, amount, currency, metadata } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (status === "SUCCESS") {
      const adminDb = getAdminDb();
      const orderRef = adminDb.collection("orders").doc(orderId);
      const orderSnap = await orderRef.get();

      if (!orderSnap.exists) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const data = orderSnap.data();
      if (!data) {
        return NextResponse.json({ error: "Invalid order data" }, { status: 500 });
      }

      // Local verification: verify amount matches (amountToPay is in paise, payload amount is in INR)
      const amountReceived = Number(amount);
      const expectedAmountINR = (data.amountToPay || data.totalAmount || 0) / 100;
      
      // Allow minor float differences (e.g. 500.00 vs 500)
      if (Math.abs(amountReceived - expectedAmountINR) > 1) {
        console.error(`Amount mismatch for order ${orderId}: Expected ${expectedAmountINR}, got ${amountReceived}`);
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
      }

      // Update the order locally
      await orderRef.update({
        paymentStatus: "paid",
        paymentSessionId: sessionId || null,
        paymentDetails: {
          sessionId: sessionId || null,
          amount: amountReceived,
          currency: currency || "INR",
          paidAt: new Date().toISOString(),
          metadata: metadata ? JSON.stringify(metadata) : null
        },
        updatedAt: new Date()
      });

      console.log(`Order ${orderId} payment confirmed via local verification`);
      
      // Send notifications
      try {
        if (data.contactInfo && data.contactInfo.email) {
          await sendOrderEmail(
            orderId, 
            data.contactInfo.email, 
            data.shippingAddress?.name || "Customer", 
            data.amountToPay || data.totalAmount
          );
        }
        await sendTelegramNotification(orderId, data, "success");
      } catch (err) {
        console.error("Failed to send post-payment notifications", err);
      }

      // Clear abandoned cart
      if (metadata?.email || data.contactInfo?.email) {
        const emailToClear = metadata?.email || data.contactInfo?.email;
        try {
          await adminDb.collection("abandoned_carts").doc(emailToClear).delete();
        } catch (e) {
          console.error("Failed to delete abandoned cart on webhook", e);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payment webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
