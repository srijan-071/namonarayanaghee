import { NextResponse } from "next/server";

const PAYU_PROXY_URL = "https://octopusperfume.in/payu-proxy";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, customerDetails, paymentMethod } = body;

    if (!orderId || !amount || !customerDetails) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Amount is in paise, convert to INR for PayU
    const amountInINR = amount / 100;

    // Create a unique txnid for PayU (max 25 chars). We can just use orderId, 
    // but typically we'd prepend something if orderId might collide, or just use orderId.
    const txnid = orderId; 

    // Construct query parameters for the PayU proxy
    const proxyParams = new URLSearchParams();
    proxyParams.set("txnid", txnid);
    proxyParams.set("amount", amountInINR.toString());
    proxyParams.set("productinfo", `Order ${orderId}`);
    proxyParams.set("firstname", customerDetails.name || "Customer");
    proxyParams.set("email", customerDetails.email || "");
    proxyParams.set("phone", customerDetails.phone || "");
    proxyParams.set("udf1", "namonarayanaghee"); // Identifies the origin site for the callback

    const checkoutUrl = `${PAYU_PROXY_URL}?${proxyParams.toString()}`;

    return NextResponse.json({
      success: true,
      sessionId: txnid,
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
