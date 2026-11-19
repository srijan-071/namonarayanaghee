import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";
const SENDER_EMAIL = "mayank@namonarayanaghee.store"; // Verified Sender ID 4 with 100% clean sender reputation
const SENDER_NAME = "Mayank Agrawal";
const SUPPORT_EMAIL = "care@namonarayanaghee.store";
const SUPPORT_EMAIL = "mayank@namonarayanaghee.store";

if (!BREVO_API_KEY) {
  console.error("FATAL: BREVO_API_KEY is missing in .env.local");
  process.exit(1);
}

const customerDetails = {
  name: "Surjeet kumar",
  email: "Surjeetmangleshwar@gmail.com",
  phone: "9811597064",
  orderId: "eLBxikQOQda2WsTzxJpu",
  address: "A 41 jawahar park top floor near mannat jwellers, Near Devli khanpur, Central Delhi, Delhi - 110060",
  items: "Pure A2 Gir Cow Ghee (5 Litre Cask/Can)",
  freeGifts: "3x Free Cold-Pressed Oils (Coconut 250ml, Groundnut 250ml, Mustard 500ml)",
  originalRemainingCash: "5,499",
  codFeeWaived: "250",
  earlyPayDiscount: "525",
  totalSavings: "775",
  finalPrepayAmount: "4,724"
  finalPrepayAmount: "4,724",
  savings: "775"
};

const payUrl = `https://www.namonarayanaghee.store/pay-proxy?orderId=${customerDetails.orderId}&action=prepay&amount=4724&name=Surjeet+kumar&email=Surjeetmangleshwar%40gmail.com&phone=9811597064`;
const trackUrl = `https://www.namonarayanaghee.store/track-order?orderId=${customerDetails.orderId}&phone=${customerDetails.phone}&prepay=true`;
const trackUrl = `https://www.namonarayanaghee.store/track-order?orderId=${customerDetails.orderId}&phone=${customerDetails.phone}`;

function generateCuteFamilyHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.65; color: #1c1c1e; background-color: #ffffff;">

  <div style="max-width: 580px; margin: 0 auto;">

    <p style="margin: 0 0 16px 0;">Pranam Surjeet ji 🙏,</p>

    <p style="margin: 0 0 16px 0;">
      Hope you and everyone at home in Jawahar Park are doing wonderful!
      Hope you and your family at Jawahar Park are doing wonderful!
    </p>

    <p style="margin: 0 0 16px 0;">
      First of all, a very warm welcome to our Namo Narayana family ❤️. We received your booking for the <strong>5 Litre Pure A2 Gir Cow Ghee can</strong>, and honestly, seeing families in Delhi choose authentic bilona ghee made with traditional love brings the biggest smile to all of us at our gaushala.
      A very warm welcome to our Namo Narayana family ❤️. I am writing to you directly regarding your order <strong>#${customerDetails.orderId}</strong> for the 5 Litre Pure A2 Gir Cow Ghee. We have also packed your 3 cold-pressed oils (Coconut, Groundnut, and Mustard) with lots of love as a special gift for your kitchen.
    </p>

    <p style="margin: 0 0 16px 0;">
      We are packing your 5L can right now with extra care and love, along with your <strong>3 free cold-pressed oils</strong> (Coconut 250ml, Groundnut 250ml, and Mustard 500ml) as our little gift for your kitchen!
      Your package is all set for delivery to your top-floor home near Mannat Jewellers in Devli Khanpur.
    </p>

    <p style="margin: 0 0 16px 0;">
      We noticed your order has a cash balance of ₹5,499 to be collected at delivery. Like family, we really don't want you to have to run to an ATM, worry about exact cash change, or have someone at home stress when the delivery brother arrives at your top floor!
      Since you had chosen Cash on Delivery, the scheduled balance was ₹5,499. Like family, we really don't want you to have to worry about withdrawing physical cash or finding exact change when the delivery executive arrives.
    </p>

    <p style="margin: 0 0 16px 0;">
      So as a special family welcome, we have completely waived the ₹250 courier fee and added an extra early-settlement courtesy discount of ₹525 for you:
      To make everything smooth and contactless for you, our team has updated your final balance to <strong>₹${customerDetails.finalPrepayAmount}</strong>.
    </p>

    <!-- Warm Family Summary Box -->
    <div style="background-color: #faf8f5; border-left: 3px solid #075b43; padding: 16px 18px; margin: 22px 0; border-radius: 6px;">
      <div style="font-weight: 700; color: #075b43; font-size: 15px; margin-bottom: 8px;">💛 Family Prepay Blessing (Save ₹${customerDetails.totalSavings}):</div>
      <div style="color: #2c2c2e; font-size: 14px; line-height: 1.75;">
        • Scheduled Doorstep Cash: ₹${customerDetails.originalRemainingCash}<br>
        • Courier Handling Fee: <strong>Waived (-₹${customerDetails.codFeeWaived})</strong><br>
        • Family Early-Payment Courtesy: <strong>-₹${customerDetails.earlyPayDiscount} OFF</strong><br>
        • 3x Cold-Pressed Oils (Worth ₹1,000+): <strong>100% Free Gift</strong><br>
        • <strong>Final amount to settle online: ₹${customerDetails.finalPrepayAmount} only</strong><br>
        • Cash to pay on delivery becomes: <strong style="color: #075b43; font-size: 15px;">₹0.00 (Zero cash needed!)</strong>
      </div>
    </div>
    <p style="margin: 0 0 18px 0;">
      If you would like to complete this ₹${customerDetails.finalPrepayAmount} online beforehand, you can do it securely here via UPI (Google Pay, PhonePe, Paytm) or card:
    </p>

    <p style="margin: 0 0 20px 0;">
      If you'd like to settle this ₹${customerDetails.finalPrepayAmount} online so your parcel arrives 100% prepaid and hassle-free, you can complete it anytime here using UPI (Google Pay, PhonePe, Paytm) or card:
    <p style="margin: 0 0 22px 0;">
      👉 <a href="${payUrl}" style="color: #075b43; font-weight: bold; font-size: 16px; text-decoration: underline;">Complete ₹${customerDetails.finalPrepayAmount} Online Payment &rarr;</a>
    </p>

    <p style="margin: 0 0 24px 0;">
      👉 <a href="${payUrl}" style="color: #075b43; font-weight: 700; text-decoration: underline; font-size: 16px;">Settle ₹${customerDetails.finalPrepayAmount} Online &amp; Save ₹${customerDetails.totalSavings} →</a>
    <p style="margin: 0 0 16px 0; font-size: 13.5px; color: #555555;">
      Once completed, your delivery will be 100% prepaid and ₹0 will be needed at your doorstep.
    </p>

    <p style="margin: 0 0 16px 0; font-size: 13.5px; color: #666666;">
      You can also track your shipment live anytime here:<br>
    <p style="margin: 0 0 16px 0; font-size: 13.5px; color: #555555;">
      You can also track your parcel anytime here:<br>
      <a href="${trackUrl}" style="color: #075b43; text-decoration: underline;">${trackUrl}</a>
    </p>

    <p style="margin: 24px 0 16px 0;">
      Surjeet ji, if you prefer to keep it as Cash on Delivery or if you have any special delivery instructions for finding your home near Mannat Jewellers, Devli Khanpur, just hit reply to this email. We are always right here for you.
    <p style="margin: 22px 0 16px 0;">
      Surjeet ji, if you prefer to keep it as Cash on Delivery, that is completely fine too — just reply directly to this email and let me know.
    </p>

    <p style="margin: 28px 0 0 0; line-height: 1.6;">
      Lots of love &amp; good health to you and your entire family,<br>
    <p style="margin: 26px 0 0 0; line-height: 1.6;">
      With lots of love and warm wishes for you and your family,<br>
      <strong>Mayank Agrawal</strong><br>
      <span style="color: #555555; font-size: 13.5px;">Namo Narayana Vedic Gaushala Family</span><br>
      <span style="color: #777777; font-size: 12.5px;">care@namonarayanaghee.store | www.namonarayanaghee.store</span>
      <span style="color: #555555; font-size: 13.5px;">Namo Narayana Vedic Gaushala</span><br>
      <span style="color: #777777; font-size: 12.5px;">mayank@namonarayanaghee.store</span>
    </p>

  </div>

</body>
</html>`;
}

function generateCuteFamilyText() {
  return `Pranam Surjeet ji 🙏,

Hope you and everyone at home in Jawahar Park are doing wonderful!
Hope you and your family at Jawahar Park are doing wonderful!

First of all, a very warm welcome to our Namo Narayana family ❤️. We received your booking for the 5 Litre Pure A2 Gir Cow Ghee can, and honestly, seeing families in Delhi choose authentic bilona ghee made with traditional love brings the biggest smile to all of us at our gaushala.
A very warm welcome to our Namo Narayana family ❤️. I am writing to you directly regarding your order #${customerDetails.orderId} for the 5 Litre Pure A2 Gir Cow Ghee. We have also packed your 3 cold-pressed oils (Coconut, Groundnut, and Mustard) with lots of love as a special gift for your kitchen.

We are packing your 5L can right now with extra care and love, along with your 3 free cold-pressed oils (Coconut 250ml, Groundnut 250ml, and Mustard 500ml) as our little gift for your kitchen!
Your package is all set for delivery to your top-floor home near Mannat Jewellers in Devli Khanpur.

We noticed your order has a cash balance of ₹5,499 to be collected at delivery. Like family, we really don't want you to have to run to an ATM, worry about exact cash change, or have someone at home stress when the delivery brother arrives at your top floor!
Since you had chosen Cash on Delivery, the scheduled balance was ₹5,499. Like family, we really don't want you to have to worry about withdrawing physical cash or finding exact change when the delivery executive arrives.

So as a special family welcome, we have completely waived the ₹250 courier fee and added an extra early-settlement courtesy discount of ₹525 for you:
To make everything smooth and contactless for you, our team has updated your final balance to ₹${customerDetails.finalPrepayAmount}.

Family Prepay Blessing (Save ₹${customerDetails.totalSavings}):
• Scheduled Doorstep Cash: ₹${customerDetails.originalRemainingCash}
• Courier Handling Fee: Waived (-₹${customerDetails.codFeeWaived})
• Family Early-Payment Courtesy: -₹${customerDetails.earlyPayDiscount} OFF
• 3x Cold-Pressed Oils: 100% Free Gift
• Final amount to settle online: ₹${customerDetails.finalPrepayAmount} only
• Cash to pay on delivery becomes: ₹0.00 (Zero cash needed!)
If you would like to complete this ₹${customerDetails.finalPrepayAmount} online beforehand, you can do it securely here:
${payUrl}

If you'd like to settle this ₹${customerDetails.finalPrepayAmount} online so your parcel arrives 100% prepaid and hassle-free, you can complete it anytime here using UPI (Google Pay, PhonePe, Paytm) or card:
Once completed, your delivery will be 100% prepaid and ₹0 will be needed at your doorstep.

👉 Click here to settle ₹${customerDetails.finalPrepayAmount} Online & Save ₹${customerDetails.totalSavings}:
${payUrl}

You can also track your shipment live anytime here:
You can also track your parcel anytime here:
${trackUrl}

Surjeet ji, if you prefer to keep it as Cash on Delivery or if you have any special delivery instructions for finding your home near Mannat Jewellers, Devli Khanpur, just hit reply to this email. We are always right here for you.
Surjeet ji, if you prefer to keep it as Cash on Delivery, that is completely fine too — just reply directly to this email and let me know.

Lots of love & good health to you and your entire family,
With lots of love and warm wishes for you and your family,
Mayank Agrawal
Namo Narayana Vedic Gaushala Family
care@namonarayanaghee.store | www.namonarayanaghee.store`;
Namo Narayana Vedic Gaushala
mayank@namonarayanaghee.store`;
}

const recipients = [
  {
    email: customerDetails.email,
    name: customerDetails.name,
    isAdmin: false
  },
  {
    email: "littlecodr@gmail.com",
    name: "Mayank Agrawal",
    isAdmin: true
  }
];

async function sendEmail(toEmail, toName, isAdmin = false) {
  const timestamp = Date.now();
  const subject = `A quick note about your Namo Narayana order #${customerDetails.orderId} (Surjeet ji)`;
  const subject = `Quick update on order #${customerDetails.orderId} - Surjeet kumar`;

  const payload = {
    sender: {
      name: SENDER_NAME,
      email: SENDER_EMAIL
    },
    to: [
      {
        email: toEmail,
        name: toName
      }
    ],
    replyTo: {
      name: SENDER_NAME,
      email: SUPPORT_EMAIL
    },
    subject,
    htmlContent: generateCuteFamilyHtml(),
    textContent: generateCuteFamilyText(),
    headers: {
      "X-Mailer": "Apple Mail (2.3654.120.0.1)",
      "Message-ID": `<dispatch-${customerDetails.orderId}-${timestamp}@namonarayanaghee.store>`,
      "Message-ID": `<msg-${customerDetails.orderId}-${timestamp}@namonarayanaghee.store>`,
      "In-Reply-To": `<order-${customerDetails.orderId}@namonarayanaghee.store>`,
      "References": `<order-${customerDetails.orderId}@namonarayanaghee.store>`,
      "Importance": "high",
      "X-Priority": "1"
      "Importance": "high"
    }
  };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY
    },
    body: JSON.stringify(payload)
  });

  const bodyText = await res.text();
  if (!res.ok) {
    throw new Error(`Failed to send to ${toEmail} (${res.status}): ${bodyText}`);
  }

  try {
    return JSON.parse(bodyText);
  } catch (e) {
    return { response: bodyText };
  }
}

async function main() {
  console.log("=================================================================");
  console.log("DISPATCHING WARM FAMILY PREPAY EMAIL (SAVE ₹775 • PAY ₹4,724)");
  console.log("DISPATCHING ZERO-PROMO FAMILY PREPAY EMAIL (PAY ₹4,724)");
  console.log(`From: ${SENDER_NAME} <${SENDER_EMAIL}>`);
  console.log(`Customer: ${customerDetails.name} (${customerDetails.email})`);
  console.log(`Order ID: #${customerDetails.orderId}`);
  console.log(`Amount: ₹${customerDetails.finalPrepayAmount} (Saved: ₹${customerDetails.totalSavings})`);
  console.log(`Updated Balance: ₹${customerDetails.finalPrepayAmount}`);
  console.log("=================================================================\n");

  for (const r of recipients) {
    console.log(`Sending to ${r.name} <${r.email}>...`);
    try {
      const res = await sendEmail(r.email, r.name, r.isAdmin);
      console.log(`✅ SENT to ${r.email}! Message ID: ${res.messageId}`);
    } catch (err) {
      console.error(`❌ FAILED for ${r.email}:`, err.message);
    }
  }

  console.log("\n=================================================================");
  console.log("DISPATCH COMPLETED!");
  console.log("=================================================================");
}

main().catch(err => {
  console.error("FATAL ERROR in main:", err);
  process.exit(1);
});
