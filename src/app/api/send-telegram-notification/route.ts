import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = "8816035157:AAH2fxXvaS8U7DI-HOsqfVKxovz4ojpdQnc";
const TELEGRAM_CHAT_ID = "5804733110";

export async function POST(req: Request) {
  try {
    const { orderId, orderData } = await req.json();

    if (!orderId || !orderData) {
      return NextResponse.json({ error: "Missing orderId or orderData" }, { status: 400 });
    }

    // Construct the message without emojis, simple branding
    const itemsText = orderData.items?.map((item: any) => 
      `${item.quantity}x ${item.name} ${item.variantTitle ? `(${item.variantTitle})` : ''} - Rs. ${item.price * item.quantity}`
    ).join('\n') || 'No items found';

    const shipping = orderData.shippingAddress || {};
    const contact = orderData.contactInfo || {};

    const message = `
Namo Narayana Ghee - New Order
------------------------------
Order ID: #${orderId}
Payment Method: ${orderData.paymentMethod?.toUpperCase() || 'N/A'}
Status: ${orderData.paymentStatus || 'pending'}

Customer Details:
Name: ${shipping.name || contact.name || 'N/A'}
Email: ${contact.email || 'N/A'}
Phone: ${contact.phone || 'N/A'}

Shipping Address:
${shipping.address || 'N/A'}
${shipping.city || ''}, ${shipping.state || ''} ${shipping.pincode || ''}
${shipping.country || ''}

Order Items:
${itemsText}

Pricing:
Subtotal: Rs. ${orderData.subtotal || 0}
Discount: Rs. ${orderData.discount || 0}
Total Amount: Rs. ${orderData.totalAmount || 0}
Amount Paid: Rs. ${orderData.amountToPay || 0}
Amount Remaining (COD): Rs. ${orderData.amountRemaining || 0}
------------------------------
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Telegram API error:", errorText);
      throw new Error("Failed to send telegram message");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to send telegram notification:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
