import { NextResponse } from "next/server";
import { formatPrice } from "@/lib/utils";
import { sendAbandonedCartRecoveryEmail } from "@/lib/transactional-emails";

const TELEGRAM_BOT_TOKEN = "8816035157:AAH2fxXvaS8U7DI-HOsqfVKxovz4ojpdQnc";
const TELEGRAM_CHAT_ID = "5804733110";

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

    if (Array.isArray(snapshot)) {
      for (const result of snapshot) {
        if (!result.document) continue;
        const cartDoc = result.document;
        const docId = cartDoc.name.split("/").pop();
        
        const cartData: any = {
          email: cartDoc.fields.email?.stringValue,
          phone: cartDoc.fields.phone?.stringValue,
          subtotal: Number(cartDoc.fields.subtotal?.integerValue || 0),
          lastActive: cartDoc.fields.lastActive?.timestampValue,
          cartItems: []
        };
        
        if (cartDoc.fields.cartItems?.arrayValue?.values) {
          cartData.cartItems = cartDoc.fields.cartItems.arrayValue.values.map((v: any) => ({
            name: v.mapValue?.fields?.name?.stringValue || v.mapValue?.fields?.title?.stringValue || "A2 Gir Cow Bilona Ghee",
            price: Number(v.mapValue?.fields?.price?.integerValue || 0),
            quantity: Number(v.mapValue?.fields?.quantity?.integerValue || 1),
            variantTitle: v.mapValue?.fields?.variantTitle?.stringValue || ""
          }));
        }

        const lastActiveTime = cartData.lastActive ? new Date(cartData.lastActive).getTime() : 0;
        
        // If the cart was last active between 1 hour and 48 hours ago
        if (now - lastActiveTime > ONE_HOUR && now - lastActiveTime < 48 * ONE_HOUR) {
          
          // 1. Send Recovery Email via High-Deliverability Brevo Engine
          if (cartData.email) {
            await sendAbandonedCartRecoveryEmail({
              email: cartData.email,
              name: "Customer",
              phone: cartData.phone,
              items: cartData.cartItems,
              subtotal: cartData.subtotal,
              couponCode: "DIWALI",
              freeGift: "Complimentary Brass Puja Spoon & Festive Diya",
              cartUrl: "https://www.namonarayanaghee.store/checkout"
            }).catch(console.error);
          }

          // 2. Send Telegram Notification to admin for manual WhatsApp follow-up
          if (cartData.phone) {
            const cleanPhone = cartData.phone.replace(/[^0-9]/g, "").slice(-10);
            const telegramMessage = `
🛒 ABANDONED CART ALERT (1h+) 🛒
------------------------------
Email: ${cartData.email || "N/A"}
Phone: +91 ${cleanPhone}
Subtotal: ${formatPrice(cartData.subtotal)}
Items Count: ${cartData.cartItems.length}

WhatsApp Recovery Link:
https://wa.me/91${cleanPhone}?text=Namaste%2C%20we%20noticed%20you%20were%20ordering%20pure%20Vedic%20Gir%20Cow%20Ghee%20at%20Namo%20Narayana.%20Use%20code%20DIWALI%20for%20an%20extra%2010%25%20OFF%20at%20namonarayanaghee.store
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
    }

    return NextResponse.json({ success: true, processed: processedCount });
  } catch (error: any) {
    console.error("Failed to process abandoned carts cron:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error?.message }, { status: 500 });
  }
}
