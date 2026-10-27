const TELEGRAM_BOT_TOKEN = "8816035157:AAH2fxXvaS8U7DI-HOsqfVKxovz4ojpdQnc";
const TELEGRAM_CHAT_ID = "5804733110";

function formatTelegramPrice(paise: number | undefined | null): string {
  const amount = (Number(paise) || 0) / 100;
  return `Rs. ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export async function sendTelegramNotification(orderId: string, orderData: any, event: string = "success", rawMessage?: string) {
  let finalMessage = rawMessage;

  const nowIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  if (!finalMessage) {
    if (event === "cart_initiated") {
      const itemTitle = orderData?.itemTitle || orderData?.title || "Product";
      const variantTitle = orderData?.variantTitle ? ` (${orderData.variantTitle})` : "";
      const qty = orderData?.quantity || 1;
      const pricePaise = orderData?.price || 0;
      const totalPaise = orderData?.cartTotal || pricePaise * qty;
      const freeGift = orderData?.freeGift;

      finalMessage = `
🛒 1. CART INITIATED 🛒
------------------------------
A customer just added an item to their cart:

📦 Item: ${itemTitle}${variantTitle} (x${qty})
💵 Item Price: ${formatTelegramPrice(pricePaise * qty)}
💰 Cart Subtotal: ${formatTelegramPrice(totalPaise)}
${freeGift ? `🎁 Free Gift: ${freeGift}\n` : ""}📊 Total Items in Cart: ${orderData?.itemsCount || 1}
⏰ Time: ${nowIST}
------------------------------
      `.trim();
    } else if (event === "payment_initiated" || event === "initiated") {
      if (!orderId || !orderData) {
        throw new Error("Missing orderId or orderData");
      }

      const itemsText = orderData.items?.map((item: any) => 
        `• ${item.quantity}x ${item.name || item.title} ${item.variantTitle ? `(${item.variantTitle})` : ''} - ${item.price === 0 || item.isGift ? 'FREE GIFT' : formatTelegramPrice(item.price * item.quantity)}`
      ).join('\n') || 'No items found';

      const giftsText = orderData.freeGifts && orderData.freeGifts.length > 0
        ? `\n🎁 Free Gifts Included:\n${orderData.freeGifts.map((g: any) => typeof g === 'string' ? `• ${g}` : `• ${g.name} (${g.size} x${g.quantity})`).join('\n')}`
        : '';

      const shipping = orderData.shippingAddress || {};
      const contact = orderData.contactInfo || {};

      finalMessage = `
🟡 2. PAYMENT INITIATED (Pending) 🟡
------------------------------
Order ID: #${orderId}
Status: ⏳ PENDING GATEWAY PAYMENT
Payment Method: PREPAID (Razorpay UPI / Cards)
Gateway Domain: potter-world.com

👤 Customer Details:
Name: ${shipping.name || contact.name || 'N/A'}
Phone: ${contact.phone || 'N/A'}
Email: ${contact.email || 'N/A'}

📍 Delivery Address:
${shipping.address || 'N/A'}
${shipping.city || ''}, ${shipping.state || ''} ${shipping.pincode || ''}
Country: ${shipping.country || 'India'}

📦 Order Items:
${itemsText}${giftsText}

💰 Pricing Breakdown:
Subtotal: ${formatTelegramPrice(orderData.subtotal)}
Discount: ${formatTelegramPrice(orderData.discount || 0)}
Total Payable: ${formatTelegramPrice(orderData.amountToPay || orderData.totalAmount)}

⏰ Time: ${nowIST}
------------------------------
      `.trim();
    } else {
      // Step 3: Payment Successful / Verified
      if (!orderId || !orderData) {
        throw new Error("Missing orderId or orderData");
      }

      const itemsText = orderData.items?.map((item: any) => 
        `• ${item.quantity}x ${item.name || item.title} ${item.variantTitle ? `(${item.variantTitle})` : ''} - ${item.price === 0 || item.isGift ? 'FREE GIFT' : formatTelegramPrice(item.price * item.quantity)}`
      ).join('\n') || 'No items found';

      const giftsText = orderData.freeGifts && orderData.freeGifts.length > 0
        ? `\n🎁 Free Gifts Included:\n${orderData.freeGifts.map((g: any) => typeof g === 'string' ? `• ${g}` : `• ${g.name} (${g.size} x${g.quantity})`).join('\n')}`
        : '';

      const shipping = orderData.shippingAddress || {};
      const contact = orderData.contactInfo || {};
      const paymentId = orderData.paymentSessionId || orderData.paymentDetails?.razorpay_payment_id || 'Captured via Gateway';

      finalMessage = `
🟢 3. PAYMENT SUCCESSFUL (Order Confirmed) 🟢
------------------------------
Order ID: #${orderId}
Payment ID: ${paymentId}
Status: ✅ PAID & VERIFIED
Payment Gateway: Razorpay (potter-world.com)

👤 Customer Details:
Name: ${shipping.name || contact.name || 'N/A'}
Phone: ${contact.phone || 'N/A'}
Email: ${contact.email || 'N/A'}

📍 Delivery Address:
${shipping.address || 'N/A'}
${shipping.city || ''}, ${shipping.state || ''} ${shipping.pincode || ''}
Country: ${shipping.country || 'India'}

📦 Order Items:
${itemsText}${giftsText}

💰 Pricing Summary:
Total Amount: ${formatTelegramPrice(orderData.totalAmount || orderData.amountToPay)}
Amount Paid: ${formatTelegramPrice(orderData.amountToPay || orderData.totalAmount)}
Remaining: Rs. 0.00

📧 Brevo Confirmation Email: Dispatched to ${contact.email || 'Customer'}
⏰ Time: ${nowIST}
------------------------------
      `.trim();
    }
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
