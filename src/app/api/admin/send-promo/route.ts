import { NextResponse } from "next/server";

const BREVO_API_KEY = "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"; // Hardcoded as requested
const FIREBASE_API_KEY = "AIzaSyC5-gVyFeo-WLlI8RU4Tlhftci_1f5gOfc";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];

    // Verify ID token using Firebase REST API (Server-sided Authwall without firebase-admin)
    const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });

    const verifyData = await verifyRes.json();
    if (verifyData.error || !verifyData.users || !verifyData.users[0] || verifyData.users[0].email !== "littlecodr@gmail.com") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { emails } = await req.json();
    if (!emails || !emails.length) return NextResponse.json({ error: "No emails provided" }, { status: 400 });

    // Send emails via Brevo
    for (const email of emails) {
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: { name: "Namo Narayana", email: "hello@namonarayanaghee.store" },
          to: [{ email }],
          subject: "Exclusive 10% Discount from Elvish Yadav! 🚀",
          htmlContent: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
              <div style="text-align: center; background-color: #1E3A24; padding: 20px 0;">
                <img src="https://namonarayanaghee.store/assets/logo.png" alt="Namo Narayana Logo" style="max-height: 50px; filter: brightness(0) invert(1);" />
              </div>
              
              <a href="https://namonarayanaghee.store/products/pure-desi-cow-ghee-1-litre" style="display: block;">
                <img src="https://namonarayanaghee.store/assets/product_Elvish_slide_0c3c0634-88ac-4bd7-90a3-da171865234d.webp" alt="Elvish Yadav Namo Narayana Ghee" style="width: 100%; max-height: 400px; object-fit: cover; display: block;" />
              </a>

              <div style="padding: 40px 30px; text-align: center; border: 1px solid #E9E5D9; border-top: none;">
                <h1 style="color: #1E3A24; font-size: 28px; margin-top: 0; font-family: Georgia, serif; font-weight: 800;">Get 10% OFF – Elvish Yadav's Choice!</h1>
                <p style="color: #364935; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 24px;">
                  Namaste,<br><br>
                  We are thrilled to offer you an exclusive 10% discount on Namo Narayana's Pure A2 Gir Cow Ghee! Experience the authentic taste, rich aroma, and grainy texture of traditional Bilona ghee, trusted by Elvish Yadav.
                </p>
                
                <a href="https://namonarayanaghee.store/products/pure-desi-cow-ghee-1-litre" style="display: inline-block; background-color: #C38936; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin-bottom: 30px; text-transform: uppercase;">Shop 1 Litre Ghee Now</a>
                
                <div style="background-color: #FAF9F5; border: 2px dashed #C38936; padding: 20px; border-radius: 8px; margin: 0 auto 24px; max-width: 300px;">
                  <p style="font-size: 12px; color: #576B55; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold;">Use Code at Checkout</p>
                  <p style="font-size: 28px; font-weight: bold; color: #1E3A24; margin: 0; letter-spacing: 2px;">ELVISH10</p>
                </div>
                
                <p style="color: #D32F2F; font-weight: bold; font-size: 16px; margin-bottom: 20px;">
                  ⏳ Hurry! This exclusive offer expires in exactly 24 hours. Don't miss out!
                </p>
                
                <a href="https://namonarayanaghee.store/products/pure-desi-cow-ghee-1-litre" style="display: inline-block; background-color: #1E3A24; color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; letter-spacing: 0.5px; margin-bottom: 20px;">Claim Your 10% Discount</a>
                
                <p style="font-size: 14px; color: #576B55; margin-bottom: 30px;">
                  Stock is extremely limited and selling fast!
                </p>

                <a href="https://namonarayanaghee.store/products/pure-desi-cow-ghee-1-litre" style="display: inline-block; color: #1E3A24; font-weight: bold; font-size: 16px; text-decoration: underline;">Or click here to secure your order now</a>
              </div>
              
              <div style="text-align: center; padding: 30px 20px; color: #888888; font-size: 12px; background-color: #f9f9f9;">
                <p>Namo Narayana • Pure by Promise. Traditional by Heart.</p>
                <p>You received this email because you subscribed to our exclusive offers.</p>
              </div>
            </div>
          `
        })
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
