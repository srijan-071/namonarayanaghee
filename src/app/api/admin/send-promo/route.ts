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

    const { emails, subject: reqSubject } = await req.json();
    if (!emails || !emails.length) return NextResponse.json({ error: "No emails provided" }, { status: 400 });

    const emailSubject = reqSubject?.trim() || "A quick note from Namo Narayana";

    const textContent = `Namaste,

I noticed you were looking at our A2 Gir Cow Bilona Ghee earlier today.

I wanted to reach out to you personally from our farm. Unlike commercial market ghee made by directly separating cream with machines, we still make our ghee the ancient Vedic way — converting fresh milk from free-grazing Gir cows into curd first, and then slowly churning it with a wooden bilona to separate fresh makkhan.

It takes nearly 25 to 30 litres of pure Gir cow milk to produce just one single litre of this golden, grainy ghee. Elvish and our whole team wanted you to experience what real, unadulterated ghee actually tastes like.

If you'd like to try a jar for your home, I created a 10% farm welcome coupon for you:

Coupon code: ELVISH10
Direct Link: https://namonarayanaghee.store/products/pure-desi-cow-ghee-1-litre

We provide Free Express Shipping across India, and every batch is packed fresh from our farm dispatches.

If you have any questions about how our ghee is made, or want to verify our NABL lab certificates, just reply directly to this email. I read every message personally.

Warm regards,
Anurag Sharma
Founder & Farm Lead, Namo Narayana
Traditional Vedic Bilona Ghee • Rajasthan
https://namonarayanaghee.store

---
Namo Narayana Vedic Farm • Pure by Promise. Traditional by Heart.
You received this because you visited namonarayanaghee.store. Reply with 'unsubscribe' to opt out.`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf9f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c2e20; line-height: 1.65;">
  <div style="max-width: 580px; margin: 30px auto; background-color: #ffffff; border: 1px solid #e7e4dc; border-radius: 12px; padding: 36px 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
    <p style="font-size: 16px; margin: 0 0 18px 0; color: #1c2e20;">Namaste,</p>
    
    <p style="font-size: 15px; margin: 0 0 16px 0; color: #2a3d2e;">
      I noticed you were browsing our A2 Gir Cow Bilona Ghee earlier today.
    </p>

    <p style="font-size: 15px; margin: 0 0 16px 0; color: #2a3d2e;">
      I wanted to write to you personally from our farm. Unlike commercial market ghee made by directly separating cream with machines, we still make our ghee the ancient Vedic way — converting fresh milk from free-grazing Gir cows into curd first, and then slowly churning it with a wooden bilona to separate fresh makkhan.
    </p>

    <p style="font-size: 15px; margin: 0 0 16px 0; color: #2a3d2e;">
      It takes nearly 25 to 30 litres of pure Gir cow milk to produce just one single litre of this golden, grainy ghee. Elvish and our whole team wanted you to experience what real, unadulterated ghee actually tastes like.
    </p>

    <div style="background-color: #FCFAF5; border: 1px solid #EAD7BC; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">
      <p style="font-size: 14px; margin: 0 0 6px 0; color: #5E0B10; font-weight: 600;">
        Special 10% Farm Welcome:
      </p>
      <p style="font-size: 15px; margin: 0 0 14px 0; color: #4A352F;">
        Use coupon code <strong style="background-color: #FDF6E8; border: 1px solid #EAD7BC; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 15px; color: #8A1B14; letter-spacing: 0.5px;">DIWALI</strong> at checkout.
      </p>
      <a href="https://namonarayanaghee.store/products/pure-desi-cow-ghee-1-litre" style="display: inline-block; background-color: #8A1B14; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 10px 22px; border-radius: 6px;">
        Order Pure A2 Gir Cow Ghee (1L) &rarr;
      </a>
    </div>

    <p style="font-size: 14px; margin: 0 0 16px 0; color: #7A4A3B;">
      Every order includes <strong>Free Express Shipping</strong> across India, packed in safe, food-grade glass jars freshly dispatched from our farm.
    </p>

    <p style="font-size: 15px; margin: 0 0 24px 0; color: #4A352F;">
      If you have any questions about how our ghee is made, or want to verify our NABL lab certificates, <strong>simply hit reply to this email</strong>. I read and reply to every message personally.
    </p>

    <div style="border-top: 1px solid #EAD7BC; padding-top: 18px; margin-top: 24px;">
      <p style="font-size: 14px; margin: 0; color: #5E0B10; font-weight: 700;">Anurag Sharma</p>
      <p style="font-size: 13px; margin: 2px 0 0 0; color: #7A4A3B;">Founder & Farm Lead, Namo Narayana</p>
      <p style="font-size: 12px; margin: 4px 0 0 0; color: #7A4A3B;">Traditional Vedic Bilona Ghee • Rajasthan</p>
    </div>

    <div style="margin-top: 28px; padding-top: 14px; border-top: 1px solid #f0ede6; font-size: 11px; color: #8e9e90; text-align: center; line-height: 1.5;">
      Namo Narayana Vedic Farm • Pure by Promise. Traditional by Heart.<br>
      You received this note because you visited namonarayanaghee.store. Reply with &quot;unsubscribe&quot; to opt out.
    </div>
  </div>
</body>
</html>
`;

    // Send emails via Brevo in batches of 100 to avoid Cloudflare worker subrequest/timeout limits
    const CHUNK_SIZE = 100;
    for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
      const chunk = emails.slice(i, i + CHUNK_SIZE);
      const messageVersions = chunk.map((email: string) => ({
        to: [{ email }]
      }));

      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: { name: "Anurag from Namo Narayana", email: "hello@namonarayanaghee.store" },
          replyTo: { name: "Anurag from Namo Narayana", email: "hello@namonarayanaghee.store" },
          subject: emailSubject,
          htmlContent,
          textContent,
          messageVersions
        })
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
