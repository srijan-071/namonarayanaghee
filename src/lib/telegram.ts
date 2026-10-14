const TELEGRAM_BOT_TOKEN = "8816035157:AAH2fxXvaS8U7DI-HOsqfVKxovz4ojpdQnc";
const TELEGRAM_CHAT_ID = "5804733110";

export async function sendTelegramNotification(orderId: string, orderData: any, event: string = "success", rawMessage?: string) {
  let finalMessage = rawMessage;

  if (!finalMessage) {
    if (!orderId || !orderData) {
      throw new Error("Missing orderId or orderData");
    }

    // Construct the message without emojis, simple branding
    const itemsText = orderData.items?.map((item: any) => 
      `${item.quantity}x ${item.name} ${item.variantTitle ? `(${item.variantTitle})` : ''} - ${item.price === 0 || item.isGift ? 'FREE GIFT' : `Rs. ${item.price * item.quantity}`}`
    ).join('\n') || 'No items found';

    const giftsText = orderData.freeGifts && orderData.freeGifts.length > 0
      ? `\n🎁 Free Gifts Included:\n${orderData.freeGifts.map((g: any) => typeof g === 'string' ? `• ${g}` : `• ${g.name} (${g.size} x${g.quantity})`).join('\n')}\n`
      : '';

    const shipping = orderData.shippingAddress || {};
    const contact = orderData.contactInfo || {};

    // Branding based on event
    const brandingHeader = event === "initiated" 
      ? "🔴 ORDER INITIATED (Payment Pending) 🔴" 
      : "🟢 ORDER SUCCESS (Payment Verified) 🟢";

    finalMessage = `
Namo Narayana Ghee
${brandingHeader}
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
${giftsText}
Pricing:
Subtotal: Rs. ${orderData.subtotal || 0}
Discount: Rs. ${orderData.discount || 0}
Total Amount: Rs. ${orderData.totalAmount || 0}
Amount Paid: Rs. ${orderData.amountToPay || 0}
Amount Remaining: Rs. ${orderData.amountRemaining || 0}
------------------------------
    `.trim();
  }

  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(telegramUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: finalMessage,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Telegram API error:", errorText);
    throw new Error("Failed to send telegram message");
  }

  return true;
}
