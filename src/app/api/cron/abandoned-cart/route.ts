import { NextResponse } from "next/server";
import { formatPrice } from "@/lib/utils";

const TELEGRAM_BOT_TOKEN = "8816035157:AAH2fxXvaS8U7DI-HOsqfVKxovz4ojpdQnc";
const TELEGRAM_CHAT_ID = "5804733110";
const BREVO_API_KEY = "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";

export async function GET(req: Request) {
  try {
    const FIREBASE_PROJECT_ID = "namonarayanaghee";
    const firestoreQuery = {
      structuredQuery: {
        from: [{ collectionId: "abandoned_carts" }],
        where: {
          compositeFilter: {
            op: "AND",
            filters: [
              { fieldFilter: { field: { fieldPath: "notified" }, op: "EQUAL", value: { booleanValue: false } } },
              { fieldFilter: { field: { fieldPath: "recovered" }, op: "EQUAL", value: { booleanValue: false } } }
            ]
          }
        }
      }
    };
    
    const queryRes = await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`, {
      method: "POST",
      body: JSON.stringify(firestoreQuery)
    });
    const snapshot = await queryRes.json();
    
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    
    let processedCount = 0;

    for (const result of snapshot) {
      if (!result.document) continue;
      const cartDoc = result.document;
      const docId = cartDoc.name.split("/").pop();
      
      // Parse Firestore REST API document format
      const cartData = {
        email: cartDoc.fields.email?.stringValue,
        phone: cartDoc.fields.phone?.stringValue,
        subtotal: Number(cartDoc.fields.subtotal?.integerValue || 0),
        lastActive: cartDoc.fields.lastActive?.timestampValue,
        // We need to parse cartItems array if present, but since we are just sending an email,
        // we can extract the item names and prices manually, or just skip item details in email to simplify
        cartItems: []
      };
      
      // If we really need cart items, we parse the ArrayValue
      if (cartDoc.fields.cartItems?.arrayValue?.values) {
        cartData.cartItems = cartDoc.fields.cartItems.arrayValue.values.map((v: any) => ({
          name: v.mapValue.fields.name?.stringValue || v.mapValue.fields.title?.stringValue,
          price: Number(v.mapValue.fields.price?.integerValue || 0),
          quantity: Number(v.mapValue.fields.quantity?.integerValue || 0)
        }));
      }

      const lastActiveTime = cartData.lastActive ? new Date(cartData.lastActive).getTime() : 0;
      
      // If the cart was last active more than 1 hour ago
      if (now - lastActiveTime > ONE_HOUR) {
        
        // 1. Send Recovery Email via Brevo
        if (cartData.email) {
          const itemsHtml = cartData.cartItems?.map((item: any) => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E9E5D9;">${item.name} x ${item.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #E9E5D9; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
            </tr>
          `).join("") || "";

          const emailHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF9F5; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .header { background-color: #1E3A24; padding: 40px 20px; text-align: center; border-bottom: 4px solid #C38936; }
                .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
                .content { padding: 40px 30px; color: #364935; line-height: 1.6; text-align: center; }
                .btn { background-color: #C38936; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; text-align: left; }
                .footer { background-color: #F4F6F0; padding: 30px; text-align: center; font-size: 13px; color: #576B55; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>You left something behind!</h1>
                </div>
                <div class="content">
                  <p>Hi there,</p>
                  <p>We noticed you added some premium A2 Gir Cow Ghee to your cart but didn't complete your purchase.</p>
                  <p>As a special token of appreciation, use code <strong>ELVISH10</strong> at checkout for <strong>10% off</strong> your entire order!</p>
                  
                  <table>
                    ${itemsHtml}
                  </table>

                  <a href="https://namonarayanaghee.store/checkout" class="btn">Complete My Order</a>
                </div>
                <div class="footer">
                  <p><strong>Namo Narayana</strong><br>Pure Food. Stronger Bharat. 🙏</p>
                </div>
              </div>
            </body>
            </html>
          `;

          await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": BREVO_API_KEY
            },
            body: JSON.stringify({
              sender: { name: "Namo Narayana", email: "noreply@namonarayanaghee.store" },
              to: [{ email: cartData.email }],
              subject: `Did you forget something? 🛒`,
              htmlContent: emailHtml
            })
          }).catch(console.error);
        }

        // 2. Send Telegram Notification to admin for manual WhatsApp
        if (cartData.phone) {
          const telegramMessage = `
🔴 ABANDONED CART ALERT 🔴
------------------------------
Email: ${cartData.email}
Phone: ${cartData.phone}
Subtotal: ${formatPrice(cartData.subtotal)}

Action: Send them a WhatsApp message with the 10% discount code "ELVISH10" to recover this cart!
https://wa.me/91${cartData.phone.replace(/[^0-9]/g, '').slice(-10)}
------------------------------
          `.trim();

          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: telegramMessage,
            }),
          }).catch(console.error);
        }

        // 3. Mark as notified using REST API
        await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/abandoned_carts/${docId}?updateMask.fieldPaths=notified`, {
          method: "PATCH",
          body: JSON.stringify({ fields: { notified: { booleanValue: true } } })
        }).catch(console.error);
        
        processedCount++;
      }
    }

    return NextResponse.json({ success: true, processed: processedCount });
  } catch (error: any) {
    console.error("Failed to process abandoned carts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
