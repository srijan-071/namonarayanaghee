const FALLBACK_ORDER_BOT = Buffer.from("ODgxNjAzNTE1NzpBQUh6c2tQOEpwYnR4eDBIclZZdC1wWWM2ZXZpVnl0NTRxcw==", "base64").toString("utf-8");
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || FALLBACK_ORDER_BOT;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "5804733110";

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

const FALLBACK_VISIT_BOT = Buffer.from("NzEzODE2NTQ4ODpBQUZnb1lTLWdUSmw0UVBPMGFVWDBVaTRvbmxoQ0dfdncwVQ==", "base64").toString("utf-8");
export const VISIT_TELEGRAM_BOT_TOKEN = process.env.VISIT_TELEGRAM_BOT_TOKEN || FALLBACK_VISIT_BOT;
export const VISIT_TELEGRAM_CHAT_ID = process.env.VISIT_TELEGRAM_CHAT_ID || "5804733110";

export async function sendVisitNotification(visitData: any) {
  const nowIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const event = visitData?.event || "page_visit";
  const visitor = visitData?.visitor || visitData || {};
  const geo = visitData?.geo || {};

  const visitorId = visitor.visitorId || "N/A";
  const sessionCount = visitor.sessionVisitCount ?? 1;
  const lifetimeCount = visitor.lifetimeVisitCount ?? 1;
  const isRepeat = visitor.isRepeat ?? (sessionCount > 1 || lifetimeCount > 1);

  let activityLabel = "✨ 1st time visitor from Ad (New Lead)";
  if (sessionCount > 1) {
    activityLabel = `⚠️ REPEAT VISIT #${sessionCount} in this session (Lifetime: ${lifetimeCount} visits)`;
  } else if (lifetimeCount > 1) {
    activityLabel = `🔁 RETURNING VISITOR (Session #${sessionCount}, Lifetime: ${lifetimeCount} visits)`;
  }

  const locationParts = [
    geo.city || visitData.city,
    geo.region || visitData.region,
    geo.country || visitData.country,
  ].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "Location Unknown";
  const zipStr = geo.zip || visitData.zip;
  const ipStr = geo.ip || visitData.clientIp || "N/A";
  const ispStr = geo.isp || visitData.isp;
  const deviceStr = geo.deviceSummary || visitData.deviceSummary || "Mobile/Desktop";
  const screenStr = visitor.screenResolution || visitData.screenResolution;

  const utmSource = visitor.utmSource || visitData.utmSource;
  const utmMedium = visitor.utmMedium || visitData.utmMedium;
  const utmCampaign = visitor.utmCampaign || visitData.utmCampaign;
  const utmContent = visitor.utmContent || visitData.utmContent;
  const fbclid = visitor.fbclid || visitData.fbclid;
  const refCode = visitor.refCode || visitData.refCode;
  const referrer = visitor.referrer || visitData.referrer;
  const pageStr = visitor.pageUrl || visitData.pageUrl || visitor.currentPage || visitData.currentPage || "/";

  let message = "";

  if (event === "ad_sale_converted") {
    // 🚨 BIG HIGHLIGHTED EMOJIS FOR COMPLETED META AD SALE
    const order = visitData.order || visitData;
    const isCod = order.paymentMethod === "cod";
    const totalFormatted = formatTelegramPrice(order.amountToPay || order.totalAmount);
    const shipping = order.shippingAddress || {};
    const contact = order.contactInfo || {};

    const itemsText = order.items
      ?.map((i: any) => `• ${i.quantity}x ${i.name || i.title} ${i.variantTitle ? `(${i.variantTitle})` : ""}`)
      .join("\n") || "1x Pure A2 Gir Cow Ghee";

    const giftsText = order.freeGifts && order.freeGifts.length > 0
      ? `\n🎁 Gifts: ${order.freeGifts.map((g: any) => (typeof g === "string" ? g : g.name)).join(", ")}`
      : "";

    message = `
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
💰💰💰 META ADS SALE CONVERTED! 💰💰💰
🎉🎉🎉 REVENUE: ${totalFormatted} PAID 🎉🎉🎉
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
🔥🔥🔥 REAL META AD PURCHASE 🔥🔥🔥
------------------------------
🎯 Campaign: ${utmCampaign || refCode || "Meta Ad Campaign"}
📢 Source: ${utmSource || "Meta Ads (Instagram/FB)"}${utmMedium ? ` (${utmMedium})` : ""}
${utmContent ? `📝 Ad Creative: ${utmContent}\n` : ""}🆔 Order ID: #${order.id || order.orderId || "N/A"}
💳 Payment: ${isCod ? "COD (₹250 Advance Paid)" : "100% PREPAID (Razorpay)"}
💰 Amount Collected: ${totalFormatted}

👤 Customer Details:
👤 Name: ${shipping.name || contact.name || "Customer"}
📞 Phone: ${contact.phone || "N/A"}
📍 Delivery: ${shipping.address || ""}, ${shipping.city || ""}, ${shipping.state || ""} ${shipping.pincode || ""}

📦 Order Items:
${itemsText}${giftsText}

🌐 Ad Lead Journey:
🆔 Visitor ID: ${visitorId}
📱 Device: ${deviceStr}
🌐 IP: ${ipStr}${ispStr ? ` (${ispStr})` : ""}
${fbclid ? `🔗 Meta Click ID: ${String(fbclid).substring(0, 36)}...\n` : ""}⏰ Time: ${nowIST}
------------------------------
🏆 META AD SPEND CONVERTED TO SALE! 🏆
    `.trim();
  } else if (event === "pack_selected") {
    message = `
📦 AD VISITOR SELECTED PACK 📦
------------------------------
🎯 Campaign: ${utmCampaign || refCode || "Meta Ad Campaign"}
📦 Selected Pack: ${visitData.packTitle || "Pack"} (${visitData.packPrice || ""})
${visitData.previousPack ? `🔄 Changed From: ${visitData.previousPack}\n` : ""}📄 Page: ${pageStr}

👤 Visitor Activity:
🆔 Visitor ID: ${visitorId}
🏠 Location: ${locationStr}
📱 Device: ${deviceStr}${screenStr ? ` (${screenStr})` : ""}
⏰ Time: ${nowIST}
------------------------------
    `.trim();
  } else if (event === "pincode_checked") {
    message = `
📍 AD VISITOR CHECKED DELIVERY PIN 📍
------------------------------
🎯 Campaign: ${utmCampaign || refCode || "Meta Ad Campaign"}
📍 PIN Checked: ${visitData.pincode || "N/A"}
🚚 Status: ${visitData.pincodeStatus || "COD & Prepaid Available (3-5 Days)"}
📄 Page: ${pageStr}

👤 Visitor Activity:
🆔 Visitor ID: ${visitorId}
🏠 Detected Location: ${locationStr}
🌐 IP: ${ipStr}${ispStr ? ` (${ispStr})` : ""}
📱 Device: ${deviceStr}
⏰ Time: ${nowIST}
------------------------------
    `.trim();
  } else if (event === "add_to_cart") {
    message = `
🛒 AD VISITOR ADDED TO CART 🛒
------------------------------
🎯 Campaign: ${utmCampaign || refCode || "Meta Ad Campaign"}
📦 Item: ${visitData.itemTitle || "Product"} ${visitData.variantTitle ? `(${visitData.variantTitle})` : ""} (x${visitData.quantity || 1})
💵 Item Price: ${formatTelegramPrice(visitData.price)}
💰 Cart Total: ${formatTelegramPrice(visitData.cartTotal)}
${visitData.freeGift ? `🎁 Free Gift: ${visitData.freeGift}\n` : ""}
👤 Visitor Activity:
🆔 Visitor ID: ${visitorId}
🏠 Location: ${locationStr}
📱 Device: ${deviceStr}
⏰ Time: ${nowIST}
------------------------------
    `.trim();
  } else if (event === "checkout_step") {
    message = `
⚡ AD VISITOR AT CHECKOUT ⚡
------------------------------
🎯 Campaign: ${utmCampaign || refCode || "Meta Ad Campaign"}
🛒 Order Value: ${formatTelegramPrice(visitData.cartTotal || visitData.totalAmount)}
👉 Step: ${visitData.step || "Step 2: Payment"}
${visitData.paymentMethod ? `💳 Selected Method: ${visitData.paymentMethod.toUpperCase()}\n` : ""}
👤 Visitor Activity:
🆔 Visitor ID: ${visitorId}
🏠 Location: ${locationStr}
📱 Device: ${deviceStr}
⏰ Time: ${nowIST}
------------------------------
    `.trim();
  } else {
    // Default: page_visit
    const headerTitle = isRepeat
      ? "🔄 RETURNING AD VISITOR 🔄"
      : "👀 NEW AD LINK VISITOR OPENED 👀";

    message = `
${headerTitle}
------------------------------
🎯 Campaign: ${utmCampaign || refCode || "Meta Ad Campaign"}
📢 Source: ${utmSource || (fbclid ? "Meta Ads (Instagram/FB)" : "Direct / Link")}${utmMedium ? ` (${utmMedium})` : ""}
${utmContent ? `📝 Ad Content / Creative: ${utmContent}\n` : ""}📄 Page Opened: ${pageStr}

👤 Visitor Activity:
✨ Status: ${activityLabel}
🆔 Visitor ID: ${visitorId}
⏰ Time: ${nowIST}

📍 Location & Network:
🏠 Location: ${locationStr}${zipStr ? ` (PIN: ${zipStr})` : ""}
🌐 IP Address: ${ipStr}
${ispStr ? `🏢 Carrier / ISP: ${ispStr}\n` : ""}📱 Device: ${deviceStr}${screenStr ? ` (${screenStr})` : ""}

🔗 Attribution & Tracking:
${fbclid ? `🔗 Meta Click ID: ${String(fbclid).substring(0, 36)}...\n` : ""}${refCode ? `🏷️ Tracking Tag: ${refCode}\n` : ""}${referrer ? `🔗 Referrer: ${referrer}\n` : ""}------------------------------
    `.trim();
  }

  const telegramUrl = `https://api.telegram.org/bot${VISIT_TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(telegramUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: VISIT_TELEGRAM_CHAT_ID,
      text: message,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Visit Telegram API error:", errorText);
    throw new Error("Failed to send visit telegram message");
  }

  return true;
}
