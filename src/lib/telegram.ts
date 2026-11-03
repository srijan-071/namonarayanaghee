const TELEGRAM_BOT_TOKEN = "8816035157:AAH2fxXvaS8U7DI-HOsqfVKxovz4ojpdQnc";
const TELEGRAM_CHAT_ID = "5804733110";

function formatTelegramPrice(paise: number | undefined | null): string {
  const amount = (Number(paise) || 0) / 100;
  return `Rs. ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export async function sendTelegramNotification(
  orderId: string,
  orderData: any,
  event: string = "success",
  rawMessage?: string
) {
  let finalMessage = rawMessage;

  const nowIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (!finalMessage) {
    if (event === "cart_initiated") {
      const itemTitle = orderData?.itemTitle || orderData?.title || "Product";
      const variantTitle = orderData?.variantTitle ? ` (${orderData.variantTitle})` : "";
      const qty = orderData?.quantity || 1;
      const pricePaise = orderData?.price || 0;
      const totalPaise = orderData?.cartTotal || pricePaise * qty;
      const freeGift = orderData?.freeGift;

      // Visitor tracking & repeat identification
      const visitor = orderData?.visitor || {};
      const visitorId = visitor.visitorId || orderData?.visitorId || "N/A";
      const sessionCount = visitor.sessionCartCount ?? orderData?.sessionCartCount ?? 1;
      const lifetimeCount = visitor.lifetimeCartCount ?? orderData?.lifetimeCartCount ?? 1;
      const isRepeat = visitor.isRepeat ?? orderData?.isRepeat ?? (sessionCount > 1);

      let activityLabel = "✨ 1st time adding to cart (New Visitor)";
      if (sessionCount > 1) {
        activityLabel = `⚠️ REPEAT ADDITION #${sessionCount} in this session (Lifetime: ${lifetimeCount} times)`;
      } else if (lifetimeCount > 1) {
        activityLabel = `🔁 Returning Visitor (Lifetime: ${lifetimeCount} additions across sessions)`;
      }

      // Geo & Network Details
      const geo = orderData?.geo || {};
      const locationParts = [
        geo.city || orderData.city,
        geo.region || orderData.region,
        geo.country || orderData.country,
      ].filter(Boolean);
      const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "Location Unknown";
      const ipStr = geo.ip || orderData.clientIp || "N/A";
      const ispStr = geo.isp || orderData.isp;
      const zipStr = geo.zip || orderData.zip;
      const deviceStr = geo.deviceSummary || orderData.deviceSummary || "Unknown Device";
      const screenStr = visitor.screenResolution || orderData.screenResolution;

      // Attribution Details (Meta ads, UTM, Referrer)
      const utmSource = visitor.utmSource || orderData.utmSource;
      const utmMedium = visitor.utmMedium || orderData.utmMedium;
      const utmCampaign = visitor.utmCampaign || orderData.utmCampaign;
      const fbclid = visitor.fbclid || orderData.fbclid;
      const referrer = visitor.referrer || orderData.referrer;
      const pageStr = visitor.currentPage || orderData.currentPage || "/";

      const headerTitle = isRepeat
        ? "🔄 CART INITIATED (REPEAT ADDITION) 🔄"
        : "🛒 1. CART INITIATED 🛒";

      finalMessage = `
${headerTitle}
------------------------------
A customer added an item to their cart:

📦 Item: ${itemTitle}${variantTitle} (x${qty})
💵 Item Price: ${formatTelegramPrice(pricePaise * qty)}
💰 Cart Subtotal: ${formatTelegramPrice(totalPaise)}
${freeGift ? `🎁 Free Gift: ${freeGift}\n` : ""}📊 Total Items in Cart: ${orderData?.itemsCount || 1}
⏰ Time: ${nowIST}

🌐 Customer Location & Network:
📍 Location: ${locationStr}${zipStr ? ` (PIN: ${zipStr})` : ""}
🌐 IP Address: ${ipStr}
${ispStr ? `🏢 Network/ISP: ${ispStr}\n` : ""}📱 Device: ${deviceStr}${screenStr ? ` (${screenStr})` : ""}

👤 Visitor Attribution & Repeat Check:
🆔 Visitor ID: ${visitorId}
🔄 Cart Activity: ${activityLabel}
${(utmSource || fbclid) ? `🎯 Traffic Source: ${utmSource || (fbclid ? "Meta Ads (Instagram/FB)" : "Direct")}${utmMedium ? ` / ${utmMedium}` : ""}\n` : ""}${utmCampaign ? `📢 Campaign: ${utmCampaign}\n` : ""}${fbclid ? `🔗 Meta Click (fbclid): ${String(fbclid).substring(0, 32)}...\n` : ""}${referrer ? `🔗 Referrer: ${referrer}\n` : ""}📄 Page: ${pageStr}
------------------------------
      `.trim();
    } else if (event === "payment_initiated" || event === "initiated") {
      if (!orderId || !orderData) {
        throw new Error("Missing orderId or orderData");
      }

      const itemsText =
        orderData.items
          ?.map(
            (item: any) =>
              `• ${item.quantity}x ${item.name || item.title} ${
                item.variantTitle ? `(${item.variantTitle})` : ""
              } - ${
                item.price === 0 || item.isGift
                  ? "FREE GIFT"
                  : formatTelegramPrice(item.price * item.quantity)
              }`
          )
          .join("\n") || "No items found";

      const giftsText =
        orderData.freeGifts && orderData.freeGifts.length > 0
          ? `\n🎁 Free Gifts Included:\n${orderData.freeGifts
              .map((g: any) =>
                typeof g === "string" ? `• ${g}` : `• ${g.name} (${g.size} x${g.quantity})`
              )
              .join("\n")}`
          : "";

      const shipping = orderData.shippingAddress || {};
      const contact = orderData.contactInfo || {};

      // Network & Geo info
      const geo = orderData?.geo || {};
      const locationParts = [
        geo.city || orderData.city,
        geo.region || orderData.region,
        geo.country || orderData.country,
      ].filter(Boolean);
      const ipStr = geo.ip || orderData.clientIp;
      const ispStr = geo.isp || orderData.isp;
      const deviceStr = geo.deviceSummary || orderData.deviceSummary;
      const visitorId = orderData?.visitor?.visitorId || orderData?.visitorId;

      const isCod = orderData.paymentMethod === "cod";
      const codFeePaise = orderData.codFee ?? (isCod ? 25000 : 0);
      const prepaidDiscountPaise = orderData.prepaidDiscount ?? (isCod ? 0 : 10000);
      const remainingPaise = orderData.balanceDueOnDelivery ?? orderData.amountRemaining ?? (isCod ? (orderData.subtotal - (orderData.discount || 0)) : 0);

      const headerTitle = isCod
        ? "🚚 2. COD PAYMENT INITIATED (Advance Booking) 🚚"
        : "⚡ 2. PREPAID PAYMENT INITIATED (Save ₹350) ⚡";

      const methodTitle = isCod
        ? "CASH ON DELIVERY (Pay ₹250 Advance Online)"
        : "PREPAID (Flat ₹100 Instant Discount Applied)";

      const pricingBreakdownText = isCod
        ? `Subtotal: ${formatTelegramPrice(orderData.subtotal)}
Discount: ${formatTelegramPrice(orderData.discount || 0)}
COD Courier Handling: +${formatTelegramPrice(codFeePaise)}
Total COD Order Value: ${formatTelegramPrice(orderData.totalAmount)}
👉 Advance Due Online Now: ${formatTelegramPrice(orderData.amountToPay || 25000)}
💵 BALANCE TO COLLECT ON DELIVERY: ${formatTelegramPrice(remainingPaise)}`
        : `Subtotal: ${formatTelegramPrice(orderData.subtotal)}
Discount: ${formatTelegramPrice(orderData.discount || 0)}
⚡ Instant Prepaid Discount: -${formatTelegramPrice(prepaidDiscountPaise)}
COD Fee Waived: Saved Rs. 250.00
Total Payable Now: ${formatTelegramPrice(orderData.amountToPay || orderData.totalAmount)}
Balance on Delivery: Rs. 0.00`;

      finalMessage = `
${headerTitle}
------------------------------
Order ID: #${orderId}
Status: ⏳ PENDING GATEWAY PAYMENT
Payment Method: ${methodTitle}
Gateway Domain: potter-world.com

👤 Customer Details:
Name: ${shipping.name || contact.name || "N/A"}
Phone: ${contact.phone || "N/A"}
Email: ${contact.email || "N/A"}

📍 Delivery Address:
${shipping.address || "N/A"}
${shipping.city || ""}, ${shipping.state || ""} ${shipping.pincode || ""}
Country: ${shipping.country || "India"}

🌐 Network & Verification:
${ipStr ? `🌐 IP Address: ${ipStr}${ispStr ? ` (${ispStr})` : ""}\n` : ""}${locationParts.length > 0 ? `📍 IP Location: ${locationParts.join(", ")}\n` : ""}${deviceStr ? `📱 Device: ${deviceStr}\n` : ""}${visitorId ? `🆔 Visitor ID: ${visitorId}\n` : ""}
📦 Order Items:
${itemsText}${giftsText}

💰 Pricing Breakdown:
${pricingBreakdownText}

⏰ Time: ${nowIST}
------------------------------
      `.trim();
    } else {
      // Step 3: Payment Successful / Verified
      if (!orderId || !orderData) {
        throw new Error("Missing orderId or orderData");
      }

      const itemsText =
        orderData.items
          ?.map(
            (item: any) =>
              `• ${item.quantity}x ${item.name || item.title} ${
                item.variantTitle ? `(${item.variantTitle})` : ""
              } - ${
                item.price === 0 || item.isGift
                  ? "FREE GIFT"
                  : formatTelegramPrice(item.price * item.quantity)
              }`
          )
          .join("\n") || "No items found";

      const giftsText =
        orderData.freeGifts && orderData.freeGifts.length > 0
          ? `\n🎁 Free Gifts Included:\n${orderData.freeGifts
              .map((g: any) =>
                typeof g === "string" ? `• ${g}` : `• ${g.name} (${g.size} x${g.quantity})`
              )
              .join("\n")}`
          : "";

      const shipping = orderData.shippingAddress || {};
      const contact = orderData.contactInfo || {};
      const paymentId =
        orderData.paymentSessionId ||
        orderData.paymentDetails?.razorpay_payment_id ||
        "Captured via Gateway";

      const geo = orderData?.geo || {};
      const ipStr = geo.ip || orderData.clientIp;
      const ispStr = geo.isp || orderData.isp;

      const isCod = orderData.paymentMethod === "cod";
      const remainingPaise = orderData.balanceDueOnDelivery ?? orderData.amountRemaining ?? 0;

      const successHeader = isCod
        ? "🚚 3. COD ORDER CONFIRMED (₹250 ADVANCE PAID) 🚚"
        : "🟢 3. PAYMENT SUCCESSFUL (100% PREPAID) 🟢";

      const successStatus = isCod
        ? "✅ ADVANCE PAID (PREPARING COD DISPATCH)"
        : "✅ 100% PAID & VERIFIED";

      const pricingSummaryText = isCod
        ? `Total Order Value: ${formatTelegramPrice(orderData.totalAmount || (orderData.subtotal + 25000))}
Advance Paid Online: ${formatTelegramPrice(orderData.advancePaid || orderData.amountToPay || 25000)}
💵 BALANCE TO COLLECT ON DELIVERY (Cash/UPI): ${formatTelegramPrice(remainingPaise)}`
        : `Total Amount: ${formatTelegramPrice(orderData.totalAmount || orderData.amountToPay)}
Amount Paid: ${formatTelegramPrice(orderData.amountToPay || orderData.totalAmount)}
Remaining: Rs. 0.00 (Customer Saved ₹350 Total)`;

      finalMessage = `
${successHeader}
------------------------------
Order ID: #${orderId}
Payment ID: ${paymentId}
Status: ${successStatus}
Payment Gateway: Razorpay (potter-world.com)
Payment Mode: ${isCod ? "CASH ON DELIVERY (Advance Booking)" : "100% PREPAID"}

👤 Customer Details:
Name: ${shipping.name || contact.name || "N/A"}
Phone: ${contact.phone || "N/A"}
Email: ${contact.email || "N/A"}

📍 Delivery Address:
${shipping.address || "N/A"}
${shipping.city || ""}, ${shipping.state || ""} ${shipping.pincode || ""}
Country: ${shipping.country || "India"}

${ipStr ? `🌐 Verified IP: ${ipStr}${ispStr ? ` (${ispStr})` : ""}\n` : ""}📦 Order Items:
${itemsText}${giftsText}

💰 Pricing Summary:
${pricingSummaryText}

📧 Brevo Confirmation Email: Dispatched to ${contact.email || "Customer"}
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
