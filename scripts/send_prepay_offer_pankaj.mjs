import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";
const SENDER_NAME = "Mayank Agrawal";
const SUPPORT_EMAIL = "care@namonarayanaghee.store";

if (!BREVO_API_KEY) {
  console.error("FATAL: BREVO_API_KEY is missing in .env.local");
  process.exit(1);
}

const customerDetails = {
  name: "Pankaj Verma",
  email: "pankajverma9625@gmail.com",
  phone: "8765434567",
  orderId: "TTKraqWvhft4dEPQnzjR",
  address: "D 498 Floor no 2 Street no 12 bhajanpura, Near bvc, North East Delhi, Delhi - 110053",
  items: "Pure A2 Gir Cow Ghee (2.5 Litre)",
  freeGifts: "3x Free Cold-Pressed Oils (Groundnut 250ml, Yellow Mustard 250ml, Mustard 250ml)",
  originalSubtotal: "3,199",
  codFee: "250",
  totalCodValue: "3,449",
  prepayAmount: "2,879",
  savings: "570"
};

const payUrl = `https://www.namonarayanaghee.store/pay-proxy?orderId=${customerDetails.orderId}&action=prepay&amount=2879&name=Pankaj+Verma&email=pankajverma9625%40gmail.com&phone=8765434567`;
const trackUrl = `https://www.namonarayanaghee.store/track-order?orderId=${customerDetails.orderId}&phone=${customerDetails.phone}`;

function generatePrimaryHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.65; color: #1c1c1e; background-color: #ffffff;">

  <div style="max-width: 580px; margin: 0 auto;">

    <p style="margin: 0 0 16px 0;">Pranam Pankaj ji,</p>

    <p style="margin: 0 0 16px 0;">
      I hope this email finds you well. I am writing to you directly from our Vedic Gaushala dispatch desk regarding your order <strong>#${customerDetails.orderId}</strong> for the <strong>2.5 Litre Pure A2 Gir Cow Ghee</strong> and 3 complimentary oils.
    </p>

    <p style="margin: 0 0 16px 0;">
      Your consignment is currently scheduled for dispatch to your address in <strong>Bhajanpura, Delhi</strong>.
    </p>

    <p style="margin: 0 0 16px 0;">
      Your order was originally selected for Cash on Delivery (COD) at ₹3,449 (which included the courier handling charges). To ensure seamless, contactless handover without any cash coordination or change issues at your doorstep, our fulfillment team has waived the ₹250 COD fee and applied an early-settlement courtesy deduction of ₹320.
    </p>

    <div style="background-color: #f7f9f8; border-left: 3px solid #075b43; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
      <div style="font-weight: 600; color: #075b43; margin-bottom: 6px;">Revised Order Summary:</div>
      <div style="color: #333333; font-size: 14px; line-height: 1.6;">
        • Item: Pure A2 Gir Cow Ghee (2.5L) + 3 Free Cold-Pressed Oils<br>
        • Original COD Total: ₹3,449<br>
        • Courier Fee Waived: -₹250<br>
        • Early-Settlement Courtesy: -₹320<br>
        • <strong>Revised Payable Amount: ₹${customerDetails.prepayAmount}</strong> (Total ₹${customerDetails.savings} waived)<br>
        • <strong>Cash to collect on delivery: ₹0.00</strong>
      </div>
    </div>

    <p style="margin: 0 0 20px 0;">
      If you would like to settle this ₹${customerDetails.prepayAmount} online before courier handover so your parcel arrives 100% prepaid, you can complete it securely via UPI (Google Pay, PhonePe, Paytm) or card using this direct link:
    </p>

    <p style="margin: 0 0 24px 0;">
      👉 <a href="${payUrl}" style="color: #075b43; font-weight: 700; text-decoration: underline; font-size: 16px;">Click here to settle ₹${customerDetails.prepayAmount} Online (Zero Cash on Delivery)</a>
    </p>

    <p style="margin: 0 0 16px 0; font-size: 13.5px; color: #555555;">
      You can also track your live shipment status anytime here:<br>
      <a href="${trackUrl}" style="color: #075b43; text-decoration: underline;">${trackUrl}</a>
    </p>

    <p style="margin: 24px 0 16px 0;">
      If you prefer to keep the order as Cash on Delivery or have any specific delivery instructions for Bhajanpura, simply reply directly to this email and our team will take care of it.
    </p>

    <p style="margin: 28px 0 0 0; line-height: 1.5;">
      Warm regards,<br>
      <strong>Mayank Agrawal</strong><br>
      <span style="color: #555555; font-size: 13.5px;">Fulfillment & Operations • Namo Narayana Vedic Gaushala</span><br>
      <span style="color: #777777; font-size: 12.5px;">care@namonarayanaghee.store | www.namonarayanaghee.store</span>
    </p>

  </div>

</body>
</html>`;
}

function generatePrimaryText() {
  return `Pranam Pankaj ji,

I hope this email finds you well. I am writing to you directly from our Vedic Gaushala dispatch desk regarding your order #${customerDetails.orderId} for the 2.5 Litre Pure A2 Gir Cow Ghee and 3 complimentary oils.

Your consignment is currently scheduled for dispatch to your address in Bhajanpura, Delhi.

Your order was originally selected for Cash on Delivery (COD) at ₹3,449 (which included the courier handling charges). To ensure seamless, contactless handover without any cash coordination or change issues at your doorstep, our fulfillment team has waived the ₹250 COD fee and applied an early-settlement courtesy deduction of ₹320.

Revised Order Summary:
• Item: Pure A2 Gir Cow Ghee (2.5L) + 3 Free Cold-Pressed Oils
• Original COD Total: ₹3,449
• Courier Fee Waived: -₹250
• Early-Settlement Courtesy: -₹320
• Revised Payable Amount: ₹${customerDetails.prepayAmount} (Total ₹${customerDetails.savings} waived)
• Cash to collect on delivery: ₹0.00

If you would like to settle this ₹${customerDetails.prepayAmount} online before courier handover so your parcel arrives 100% prepaid, you can complete it securely via UPI (Google Pay, PhonePe, Paytm) or card using this direct link:

👉 Click here to settle ₹${customerDetails.prepayAmount} Online:
${payUrl}

You can also track your live shipment status anytime here:
${trackUrl}

If you prefer to keep the order as Cash on Delivery or have any specific delivery instructions for Bhajanpura, simply reply directly to this email and our team will take care of it.

Warm regards,
Mayank Agrawal
Fulfillment & Operations • Namo Narayana Vedic Gaushala
care@namonarayanaghee.store | www.namonarayanaghee.store`;
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
  const subject = `Order update regarding #TTKraqWvhft4dEPQnzjR (Pankaj Verma)`;

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
    htmlContent: generatePrimaryHtml(),
    textContent: generatePrimaryText(),
    headers: {
      "X-Mailer": "Apple Mail (2.3654.120.0.1)",
      "Message-ID": `<dispatch-${customerDetails.orderId}-${timestamp}@namonarayanaghee.store>`,
      "In-Reply-To": `<order-${customerDetails.orderId}@namonarayanaghee.store>`,
      "References": `<order-${customerDetails.orderId}@namonarayanaghee.store>`,
      "Importance": "high",
      "X-Priority": "1"
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
  console.log("DISPATCHING PRIMARY-INBOX OPTIMIZED ORDER UPDATE EMAIL");
  console.log(`Customer: ${customerDetails.name} (${customerDetails.email})`);
  console.log(`Order ID: #${customerDetails.orderId}`);
  console.log(`Amount: ₹${customerDetails.prepayAmount} (Saved: ₹${customerDetails.savings})`);
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
