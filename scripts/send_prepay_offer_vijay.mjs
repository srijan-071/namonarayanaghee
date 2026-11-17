import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";
const SENDER_NAME = "Mayank from Namo Narayana";
const SUPPORT_EMAIL = "care@namonarayanaghee.store";

if (!BREVO_API_KEY) {
  console.error("FATAL: BREVO_API_KEY is missing in .env.local");
  process.exit(1);
}

const customerDetails = {
  name: "Vijay Bhadana",
  email: "v.jbhadana@gmail.com",
  phone: "9911510007",
  orderId: "Kx6wPcXVjmXjesVmFPL3",
  address: "House no 54 sector 21-B, Near Near jeeva school, Faridabad, Haryana - 121001",
  items: "1x Pure A2 Gir Cow Ghee (10 Litre Traditional Heritage Can)",
  freeGifts: "4x Cold-Pressed Oils (Coconut 250ml, Groundnut 250ml, Mustard 500ml, Yellow Mustard 250ml)",
  originalCodRemaining: "₹6,499.00",
  waiverAmount: "₹1,000.00",
  finalPayableAmount: "₹5,499.00",
};

// Seamless 1-click Prepay Links on our own website
const prepayDirectGatewayUrl = `https://www.namonarayanaghee.store/pay-proxy?orderId=${customerDetails.orderId}&action=prepay&amount=5499&name=Vijay+Bhadana&email=v.jbhadana%40gmail.com&phone=9911510007`;
const prepayTrackOrderUrl = `https://www.namonarayanaghee.store/track-order?orderId=${customerDetails.orderId}&phone=${customerDetails.phone}&prepay=true`;

const recipients = [
  {
    email: customerDetails.email,
    name: customerDetails.name,
    isAdmin: false
  },
  {
    email: "littlecodr@gmail.com",
    name: "Mayank (Admin Verification)",
    isAdmin: true
  }
];

function generateCleanEmailHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order #${customerDetails.orderId} Dispatch Confirmation</title>
</head>
<body style="margin: 0; padding: 18px 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222; background-color: #f7f7f5; line-height: 1.6;">

  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e2de; overflow: hidden;">
    
    <!-- Header -->
    <div style="padding: 24px 28px 20px 28px; border-bottom: 1px solid #eeeeea;">
      <div style="font-size: 19px; font-weight: 700; color: #075B43; letter-spacing: -0.3px;">
        Namo Narayana
      </div>
      <div style="font-size: 12px; color: #666660; margin-top: 2px;">
        Pure Vedic A2 Gir Cow Ghee • Gaushala Dispatch Desk
      </div>
    </div>

    <!-- Body Content -->
    <div style="padding: 28px; font-size: 14.5px; color: #2b2b28;">
      <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600;">
        Namaste Vijay ji,
      </p>

      <p style="margin: 0 0 16px 0;">
        I am writing to you directly from our farm fulfillment desk regarding your order <strong>#${customerDetails.orderId}</strong> for the <strong>10 Litre Traditional Heritage Can</strong> of Pure Vedic A2 Gir Cow Ghee.
      </p>

      <p style="margin: 0 0 16px 0;">
        First, we want to thank you for placing your trust in our Gaushala. Your 10-litre can contains the sacred essence of over <strong>300 litres of indigenous Gir Cow milk</strong>, slow-cultured into fresh curd and hand-churned in wooden bilonas during Brahma Muhurta. For your household in <strong>Sector 21-B, Faridabad</strong>, this is authentic pure nourishment — promoting natural vitality, healthy digestion, and joint wellness for the whole family.
      </p>

      <p style="margin: 0 0 16px 0;">
        Your order is currently scheduled for <strong>Cash on Delivery with a remaining balance of ₹6,499.00</strong>. Because this 10L steel container is a substantial, delicate consignment, our operations manager has approved a direct pre-dispatch adjustment for your shipment:
      </p>

      <!-- Clean Summary Table Box -->
      <div style="background-color: #faf9f5; border: 1px solid #e0ded6; border-radius: 6px; padding: 18px 20px; margin: 22px 0;">
        <div style="font-size: 12px; font-weight: 700; color: #075B43; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
          Pre-Dispatch Balance Adjustment
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <tr>
            <td style="padding: 5px 0; color: #666660;">Scheduled Doorstep Cash Balance:</td>
            <td style="padding: 5px 0; text-align: right; color: #888880; text-decoration: line-through;">₹6,499.00</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #075B43; font-weight: 600;">Direct Pre-Dispatch Waiver:</td>
            <td style="padding: 5px 0; text-align: right; color: #075B43; font-weight: 700;">-₹1,000.00</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666660;">4x Cold-Pressed Oils (Worth ₹1,250):</td>
            <td style="padding: 5px 0; text-align: right; color: #075B43; font-weight: 600;">FREE (Included)</td>
          </tr>
          <tr style="border-top: 1px solid #e0ded6;">
            <td style="padding: 10px 0 4px 0; font-weight: 700; color: #111111; font-size: 14.5px;">Revised Balance to Settle:</td>
            <td style="padding: 10px 0 4px 0; text-align: right; font-weight: 800; color: #075B43; font-size: 20px;">₹5,499.00</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 5px; font-size: 12px; color: #2e7d32; font-weight: 600;">
              ✓ Doorstep balance to pay courier at delivery becomes: ₹0 (Zero)
            </td>
          </tr>
        </table>
      </div>

      <p style="margin: 0 0 16px 0;">
        <strong>Key advantages of settling online before dispatch:</strong>
      </p>

      <ul style="margin: 0 0 20px 0; padding-left: 20px; font-size: 13.5px; line-height: 1.65;">
        <li style="margin-bottom: 8px;">
          <strong>Direct ₹1,000 Cash Saving:</strong> You pay ₹5,499 instead of ₹6,499, keeping ₹1,000 in your pocket.
        </li>
        <li style="margin-bottom: 8px;">
          <strong>Zero Doorstep Cash Hassle:</strong> No need to arrange ₹6,500 in physical cash or handle change shortages when the courier rider arrives at Sector 21-B, Faridabad.
        </li>
        <li style="margin-bottom: 8px;">
          <strong>Priority Air Transit:</strong> Prepaid steel can consignments are prioritized on our express line-haul with shock-absorbent wooden packaging, tamper-evident holographic sealing, and zero transit verification holds.
        </li>
      </ul>

      <!-- Primary Action -->
      <div style="margin: 26px 0; text-align: center;">
        <a href="${prepayDirectGatewayUrl}" style="background-color: #075B43; color: #ffffff !important; text-decoration: none; font-size: 14.5px; font-weight: 700; padding: 13px 34px; border-radius: 6px; display: inline-block;">
          Settle ₹5,499 Online &amp; Save ₹1,000
        </a>
        <div style="font-size: 11.5px; color: #777770; margin-top: 8px;">
          Secure payment via UPI (GPay/PhonePe), Cards or NetBanking
        </div>
      </div>

      <p style="font-size: 12.5px; color: #666660; margin: 0 0 20px 0;">
        Direct payment link: <br>
        <a href="${prepayDirectGatewayUrl}" style="color: #075B43; word-break: break-all;">${prepayDirectGatewayUrl}</a>
      </p>

      <p style="margin: 0 0 16px 0; font-size: 13.5px;">
        <strong>Delivery Destination:</strong><br>
        Vijay Bhadana, House no 54 sector 21-B, Near Near jeeva school, Faridabad, Haryana - 121001 (Phone: +91 9911510007)
      </p>

      <p style="margin: 0 0 24px 0; font-size: 13.5px;">
        If you have any custom instructions or questions regarding your package, simply reply directly to this email.
      </p>

      <p style="margin: 0; font-size: 13.5px; color: #444440;">
        Warm regards,<br>
        <strong>Mayank Agrawal</strong><br>
        Namo Narayana Farm &amp; Fulfillment Desk<br>
        <span style="font-size: 12px; color: #777770;">care@namonarayanaghee.store • www.namonarayanaghee.store</span>
      </p>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 28px; background-color: #f7f7f5; border-top: 1px solid #eeeeea; font-size: 11.5px; color: #777770;">
      Order Reference: #${customerDetails.orderId} • Sent to ${customerDetails.email}
    </div>

  </div>

</body>
</html>`;
}

function generateCleanEmailText() {
  return `Namaste Vijay ji,

I am writing to you directly from our farm fulfillment desk regarding your order #${customerDetails.orderId} for the 10 Litre Traditional Heritage Can of Pure Vedic A2 Gir Cow Ghee.

First, thank you for placing your trust in our Gaushala. Your 10-litre can contains the sacred essence of over 300 litres of indigenous Gir Cow milk, slow-churned in wooden bilonas for your household in Sector 21-B, Faridabad.

Your order is currently scheduled for Cash on Delivery with a remaining balance of ₹6,499.00. Because this 10L steel container is a substantial, delicate consignment, our operations manager has approved a direct pre-dispatch adjustment for your shipment:

PRE-DISPATCH BALANCE ADJUSTMENT:
- Scheduled Doorstep Cash Balance: ₹6,499.00
- Direct Pre-Dispatch Waiver: -₹1,000.00
- 4x Cold-Pressed Oils (Worth ₹1,250): FREE (Included)
-----------------------------------------------
REVISED BALANCE TO SETTLE: ₹5,499.00
Balance payable to courier at delivery becomes: ₹0 (Zero)

WHY THIS IS HELPFUL:
1. Direct ₹1,000 Cash Saving: You pay ₹5,499 instead of ₹6,499.
2. Zero Cash Coordination: No need to arrange ₹6,500 in physical cash or handle change when the courier arrives at Sector 21-B.
3. Priority Air Transit: Handled with reinforced protective packaging and priority express courier handover.

TO SETTLE ₹5,499 ONLINE:
${prepayDirectGatewayUrl}

Or track your shipment online:
${prepayTrackOrderUrl}

DELIVERY DESTINATION:
Vijay Bhadana, House no 54 sector 21-B, Near Near jeeva school, Faridabad, Haryana - 121001 (Phone: +91 9911510007)

If you have any questions, you can reply directly to this email.

Warm regards,
Mayank Agrawal
Namo Narayana Farm & Fulfillment Desk
care@namonarayanaghee.store`;
}

async function sendEmail(toEmail, toName, isAdmin = false) {
  // Conversational subject line that lands straight in the Primary Inbox
  const subject = isAdmin
    ? `[ADMIN COPY] Regarding your order #${customerDetails.orderId} - Namo Narayana (Vijay Bhadana)`
    : `Regarding your order #${customerDetails.orderId} - Namo Narayana`;

  const payload = {
    sender: {
      name: "Mayank from Namo Narayana",
      email: SENDER_EMAIL
    },
    to: [
      {
        email: toEmail,
        name: toName
      }
    ],
    replyTo: {
      name: "Mayank | Namo Narayana",
      email: SUPPORT_EMAIL
    },
    subject,
    htmlContent: generateCleanEmailHtml(),
    textContent: generateCleanEmailText(),
    headers: {
      "X-Entity-Ref-ID": `order-${customerDetails.orderId}`
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
  console.log("SENDING PRIMARY INBOX DISPATCH UPDATE (SETTLE ₹5,499 • SAVE ₹1,000)");
  console.log(`Customer: ${customerDetails.name} (${customerDetails.email})`);
  console.log(`Phone: +91 ${customerDetails.phone}`);
  console.log(`Order ID: #${customerDetails.orderId}`);
  console.log(`Scheduled COD Balance: ${customerDetails.originalCodRemaining}`);
  console.log(`Pre-Dispatch Waiver: ${customerDetails.waiverAmount}`);
  console.log(`Revised Amount to Settle: ${customerDetails.finalPayableAmount}`);
  console.log(`Gateway Link: ${prepayDirectGatewayUrl}`);
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
