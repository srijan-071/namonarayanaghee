import { NextResponse } from "next/server";

const PAYMENT_HUB_URL = "https://potter-world.com";
const PAYMENT_HUB_SECRET = process.env.PAYMENT_HUB_SECRET || "INTERNAL_HUB_SECRET_2026";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://namonarayanaghee.store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, customerDetails, paymentMethod } = body;

    if (!orderId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Amount is in paise, convert to INR for the hub
    const amountInINR = amount / 100;

    const sessionPayload = {
      originApp: "Namo Narayana",
      orderId,
      customerDetails: customerDetails || {},
      amount: amountInINR,
      currency: "INR",
      returnUrl: `${SITE_URL}/checkout/success?orderId=${orderId}`,
      webhookUrl: `${SITE_URL}/api/payment-webhook`,
      metadata: {
        paymentMethod,
        source: "namonarayanaghee.store",
      },
    };

    const response = await fetch(`${PAYMENT_HUB_URL}/api/payment/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAYMENT_HUB_SECRET}`,
      },
      body: JSON.stringify(sessionPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Payment hub error:", errorData);
      return NextResponse.json(
        { error: "Failed to create payment session on potter-world", details: errorData },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      sessionId: data.sessionId,
      checkoutUrl: data.checkoutUrl,
    });
  } catch (error: any) {
    console.error("Create payment session error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
