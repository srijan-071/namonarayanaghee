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
          subject: "As requested: Your exclusive access",
          htmlContent: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
              <div style="text-align: center; background-color: #1E3A24; padding: 20px 0;">
                <img src="https://namonarayanaghee.store/assets/logo.png" alt="Namo Narayana Logo" style="max-height: 50px; filter: brightness(0) invert(1);" />
              </div>
              
              <img src="https://namonarayanaghee.store/assets/hero-new-cows.jpg" alt="Pure A2 Gir Cow Ghee" style="width: 100%; max-height: 250px; object-fit: cover; display: block;" />

              <div style="padding: 40px 30px; text-align: center; border: 1px solid #E9E5D9; border-top: none; border-radius: 0 0 12px 12px;">
                <h1 style="color: #1E3A24; font-size: 26px; margin-top: 0; font-family: Georgia, serif;">As requested, your exclusive access</h1>
                <p style="color: #364935; font-size: 16px; line-height: 1.6; text-align: left; margin-bottom: 24px;">
                  Namaste,<br><br>
                  Thank you for choosing Namo Narayana. You requested a coupon code for our Pure A2 Gir Cow Ghee, and we are delighted to share it with you.<br><br>
                  Experience the rich aroma, grainy texture, and authentic taste of ghee made the traditional Bilona way.
                </p>
                
                <div style="background-color: #FAF9F5; border: 2px dashed #C38936; padding: 20px; border-radius: 8px; margin: 0 auto 24px; max-width: 300px;">
                  <p style="font-size: 12px; color: #576B55; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold;">Your Personal Code</p>
                  <p style="font-size: 28px; font-weight: bold; color: #1E3A24; margin: 0; letter-spacing: 2px;">ELVISH10</p>
                </div>
                
                <p style="color: #1E3A24; font-weight: bold; font-size: 15px; margin-bottom: 30px;">
                  ⏳ Please note: This code expires in exactly 24 hours.
                </p>
                
                <a href="https://namonarayanaghee.store/" style="display: inline-block; background-color: #1E3A24; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; letter-spacing: 0.5px;">Claim Your Ghee Now</a>
              </div>
              
              <div style="text-align: center; padding: 30px 20px; color: #888888; font-size: 12px;">
                <p>Namo Narayana • Pure by Promise. Traditional by Heart.</p>
                <p>If you didn't request this, you can safely ignore this email.</p>
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
