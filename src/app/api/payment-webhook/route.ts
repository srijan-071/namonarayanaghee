import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const PAYMENT_HUB_SECRET = process.env.PAYMENT_HUB_SECRET || "INTERNAL_HUB_SECRET_2026";

export async function POST(req: Request) {
  try {
    // Verify authorization
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${PAYMENT_HUB_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, orderId, status, amount, currency, metadata } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (status === "SUCCESS") {
      // Find and update the order document
      const orderRef = adminDb.collection("orders").doc(orderId);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) {
        console.error("Order not found for webhook:", orderId);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      await orderRef.update({
        paymentStatus: "paid",
        paymentSessionId: sessionId,
        paymentDetails: {
          sessionId,
          amount,
          currency,
          paidAt: new Date().toISOString(),
          metadata,
        },
        updatedAt: new Date().toISOString(),
      });

      console.log(`Order ${orderId} payment confirmed via webhook`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payment webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
