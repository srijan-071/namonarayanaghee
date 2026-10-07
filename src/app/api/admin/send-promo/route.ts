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
          subject: "A small gift from Elvish Yadav 🎁",
          htmlContent: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1E3A24; padding: 20px;">
              <p style="font-size: 16px; line-height: 1.6;">
                Namaste,<br><br>
                I noticed you were checking out our ghee recently, and I wanted to personally reach out with something special.<br><br>
                As a thank you, Elvish Yadav and the team at Namo Narayana are giving you an exclusive <strong>10% discount</strong> on our Pure A2 Gir Cow Ghee.<br><br>
                <a href="https://namonarayanaghee.store/products/pure-desi-cow-ghee-1-litre" style="color: #C38936; font-weight: bold; text-decoration: underline; font-size: 16px;">&gt;&gt; Click here to claim your 10% discount now</a><br><br>
                <a href="https://namonarayanaghee.store/products/pure-desi-cow-ghee-1-litre" style="display: block; margin: 20px 0;">
                  <img src="https://namonarayanaghee.store/assets/product_Elvish_slide_0c3c0634-88ac-4bd7-90a3-da171865234d.webp" alt="Elvish Yadav Namo Narayana Ghee" style="max-width: 400px; width: 100%; border-radius: 8px; display: block;" />
                </a>
                Use the code <strong>ELVISH10</strong> at checkout.<br><br>
                This ghee is made using the authentic Bilona method—trusted by Elvish himself—ensuring you get maximum health benefits and that perfect grainy texture.<br><br>
                <a href="https://namonarayanaghee.store/products/pure-desi-cow-ghee-1-litre" style="color: #C38936; font-weight: bold; text-decoration: underline; font-size: 16px;">&gt;&gt; Shop the 1 Litre Ghee here</a><br><br>
                <em>Please note: This code expires in exactly 24 hours, and our stock is selling out fast!</em><br><br>
                <a href="https://namonarayanaghee.store/products/pure-desi-cow-ghee-1-litre" style="color: #C38936; font-weight: bold; text-decoration: underline; font-size: 16px;">&gt;&gt; Secure your order before the offer expires</a><br><br>
                Best regards,<br>
                <strong>Team Namo Narayana</strong>
              </p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
                Namo Narayana • Pure by Promise. Traditional by Heart.<br>
                You received this email because you subscribed to our exclusive offers.
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
