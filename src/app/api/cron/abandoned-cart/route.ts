import { NextResponse } from "next/server";
import { formatPrice } from "@/lib/utils";

const TELEGRAM_BOT_TOKEN = "8816035157:AAH2fxXvaS8U7DI-HOsqfVKxovz4ojpdQnc";
const TELEGRAM_CHAT_ID = "5804733110";
const BREVO_API_KEY = "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";

export async function GET(req: Request) {
  try {
    // Dynamic import to prevent SSR errors
    const { db } = await import("@/lib/firebase");
    const { collection, getDocs, doc, updateDoc, query, where } = await import("firebase/firestore/lite");

    const cartsRef = collection(db, "abandoned_carts");
    const q = query(
      cartsRef,
      where("notified", "==", false),
      where("recovered", "==", false)
    );
    
    const snapshot = await getDocs(q);
    
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    
    let processedCount = 0;

    for (const cartDoc of snapshot.docs) {
      const cartData = cartDoc.data();
      const lastActive = cartData.lastActive?.toMillis ? cartData.lastActive.toMillis() : 0;
      
      // If the cart was last active more than 1 hour ago
      if (now - lastActive > ONE_HOUR) {
        
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

        // 3. Mark as notified
        await updateDoc(doc(db, "abandoned_carts", cartDoc.id), {
          notified: true
        });
        
        processedCount++;
      }
    }

    return NextResponse.json({ success: true, processed: processedCount });
  } catch (error: any) {
    console.error("Failed to process abandoned carts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
