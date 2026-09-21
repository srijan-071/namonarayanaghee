import { NextResponse } from "next/server";
import { importPKCS8, SignJWT } from "jose";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "namonarayanaghee";

async function getFirestoreAccessToken(): Promise<string> {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY or invalid format");
  }

  const privateKey = await importPKCS8(serviceAccount.private_key, "RS256");

  const jwt = await new SignJWT({
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token"
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(privateKey);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) throw new Error("Failed to authenticate with Google OAuth2");
  
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const token = await getFirestoreAccessToken();
    
    // 1. Fetch the order
    const orderPath = `projects/${PROJECT_ID}/databases/(default)/documents/orders/${orderId}`;
    const orderRes = await fetch(`https://firestore.googleapis.com/v1/${orderPath}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!orderRes.ok) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderDoc = await orderRes.json();
    const fields = orderDoc.fields || {};
    
    // 2. Check if email already sent
    if (fields.emailSent?.booleanValue === true) {
      return NextResponse.json({ success: true, message: "Email already sent" });
    }

    const email = fields.checkoutData?.mapValue?.fields?.email?.stringValue;
    const name = fields.checkoutData?.mapValue?.fields?.shippingAddress?.mapValue?.fields?.name?.stringValue || "Customer";
    const amount = fields.totalAmount?.integerValue || fields.totalAmount?.doubleValue || 0;

    if (!email) {
      return NextResponse.json({ error: "No email address found for this order" }, { status: 400 });
    }

    // 3. Send email via Brevo API
    const brevoApiKey = "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";
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1E3A24;">Thank you for your order, ${name}!</h2>
        <p>We've received your order <strong>#${orderId}</strong> and it is now being processed.</p>
        <p>Total Amount: <strong>₹${amount}</strong></p>
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
        to: [{ email, name }],
        subject: `Order Confirmation - ${orderId}`,
        htmlContent
      })
    });

    if (!brevoRes.ok) {
      const errorText = await brevoRes.text();
      console.error("Brevo API error:", errorText);
      throw new Error("Failed to send email via Brevo");
    }

    // 4. Mark order as emailSent
    const updatePayload = {
      fields: {
        ...fields,
        emailSent: { booleanValue: true }
      }
    };
    
    await fetch(`https://firestore.googleapis.com/v1/${orderPath}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatePayload)
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to send order email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
