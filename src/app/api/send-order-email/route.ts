import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderId, email, name, amount } = await req.json();
    
    if (!orderId || !email) {
      return NextResponse.json({ error: "Missing orderId or email" }, { status: 400 });
    }

    const brevoApiKey = "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";
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1E3A24;">Thank you for your order, ${name || "Customer"}!</h2>
        <p>We've received your order <strong>#${orderId}</strong> and it is now being processed.</p>
        <p>Total Amount: <strong>₹${amount || 0}</strong></p>
        <p>You will receive another update when your order ships.</p>
        <br/>
        <p>Warm regards,<br/>Namo Narayana Team</p>
      </div>
    `;

    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey
      },
      body: JSON.stringify({
        sender: { name: "Namo Narayana", email: "noreply@namonarayanaghee.store" },
        to: [{ email, name: name || "Customer" }],
        subject: `Order Confirmation - ${orderId}`,
        htmlContent
      })
    });

    if (!brevoRes.ok) {
      const errorText = await brevoRes.text();
      console.error("Brevo API error:", errorText);
      throw new Error("Failed to send email via Brevo");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to send order email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
