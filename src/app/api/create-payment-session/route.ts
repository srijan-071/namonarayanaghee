import { NextResponse } from "next/server";

const PAYMENT_HUB_URL = "https://potter-world.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://namonarayanaghee.store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, customerDetails, paymentMethod } = body;

    if (!orderId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Call the stateless Razorpay order creation endpoint on potter-world
    const response = await fetch(`${PAYMENT_HUB_URL}/api/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount, // already in paise
        currency: "INR",
        receipt: orderId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Payment hub error:", errorData);
      return NextResponse.json(
        { error: "Failed to create Razorpay order via potter-world", details: errorData },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Construct the direct pay URL with the Razorpay order_id
    const returnUrl = encodeURIComponent(`${SITE_URL}/checkout/success?orderId=${orderId}`);
    const checkoutUrl = `${PAYMENT_HUB_URL}/pay-direct?order_id=${data.order_id}&returnUrl=${returnUrl}&amount=${amount}`;

    return NextResponse.json({
      success: true,
      sessionId: data.order_id,
      checkoutUrl: checkoutUrl,
    });
  } catch (error: any) {
    console.error("Create payment session error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
