import { NextResponse } from "next/server";
import { firestoreGetDoc, firestoreUpdateDoc, firestoreDeleteDoc } from "@/lib/firestore-rest";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, orderId, status, amount, currency, metadata } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (status === "SUCCESS") {
      const data = await firestoreGetDoc("orders", orderId);

      if (!data) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Local verification: verify amount matches (amountToPay is in paise, payload amount is in INR)
      const amountReceived = Number(amount);
      const expectedAmountINR = (data.amountToPay || data.totalAmount || 0) / 100;
      
      // Allow minor float differences (e.g. 500.00 vs 500)
      if (Math.abs(amountReceived - expectedAmountINR) > 1) {
        console.error(`Amount mismatch for order ${orderId}: Expected ${expectedAmountINR}, got ${amountReceived}`);
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
      }

      // Record gateway confirmation telemetry in Firestore without marking as paid yet.
      // The order will be marked as paid and notifications (Telegram + Email) dispatched
      // ONLY when the customer reaches the Thank You page (/checkout/success).
      await firestoreUpdateDoc("orders", orderId, {
        gatewayPaymentReceived: true,
        paymentSessionId: sessionId || null,
        paymentDetails: {
          sessionId: sessionId || null,
          amount: amountReceived,
          currency: currency || "INR",
          gatewayConfirmedAt: new Date().toISOString(),
          metadata: metadata ? JSON.stringify(metadata) : null
        },
        updatedAt: new Date()
      });

      console.log(`Order ${orderId} gateway webhook acknowledged (waiting for thank-you page visit)`);

      // Clear abandoned cart
      if (metadata?.email || data.contactInfo?.email) {
        const emailToClear = metadata?.email || data.contactInfo?.email;
        try {
          await firestoreDeleteDoc("abandoned_carts", emailToClear);
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
