import { NextResponse } from "next/server";

const BREVO_API_KEY = "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"; // Hardcoded as requested
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

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
          subject: "Your 10% Off Coupon is Here! ⏰",
          htmlContent: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF9F5; padding: 20px; border-radius: 12px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #1E3A24; font-size: 28px; margin: 0; font-family: Georgia, serif;">Namo Narayana</h1>
                <p style="color: #576B55; font-size: 16px;">Pure by Promise. Traditional by Heart.</p>
              </div>
              <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; text-align: center; border: 1px solid #E9E5D9;">
                <h2 style="color: #1E3A24; font-size: 24px; margin-top: 0; font-family: Georgia, serif;">Unlock Your 10% Discount!</h2>
                <p style="color: #364935; font-size: 16px; line-height: 1.5;">Thank you for your interest in our Pure A2 Gir Cow Ghee. As promised, here is your exclusive 10% off coupon code.</p>
                
                <div style="background-color: #fcf8ee; border: 2px dashed #C38936; padding: 20px; border-radius: 8px; margin: 24px 0;">
                  <p style="font-size: 14px; color: #576B55; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Your Coupon Code</p>
                  <p style="font-size: 32px; font-weight: bold; color: #1E3A24; margin: 0; letter-spacing: 2px;">ELVISH10</p>
                </div>
                
                <p style="color: #D32F2F; font-weight: bold; font-size: 15px; margin-bottom: 24px;">⚠️ Hurry! This offer is only valid for the next 24 hours.</p>
                
                <a href="https://namonarayanaghee.store/" style="display: inline-block; background-color: #1E3A24; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Shop Now & Claim Discount</a>
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
