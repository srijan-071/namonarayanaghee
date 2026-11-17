import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";
const SENDER_NAME = "Mayank | Namo Narayana";
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
  items: "1x Pure A2 Gir Cow Ghee 10 Litre Traditional Heritage Can",
  freeGifts: "4x Cold-Pressed Oils (Coconut 250ml, Groundnut 250ml, Mustard 500ml, Yellow Mustard 250ml)",
  originalCodRemaining: "₹6,499.00",
  cashDiscount: "₹1,000.00",
  prepayAmount: "₹5,499.00",
  totalConsignmentValue: "₹21,249.00",
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

function generateEmotionalLuxuryEmailHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Important Update Regarding Order #${customerDetails.orderId}</title>
</head>
<body style="margin: 0; padding: 16px 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #17231E; background-color: #F6F4EE; line-height: 1.65; -webkit-font-smoothing: antialiased;">

  <!-- Outer Card Container -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">

        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2DDD2; box-shadow: 0 8px 30px rgba(7, 91, 67, 0.08);">

          <!-- Premium Obsidian Emerald Luxury Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #075B43 0%, #064635 60%, #043327 100%); padding: 30px 28px 24px 28px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <div style="font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: 1px; font-family: Georgia, serif;">
                NAMO NARAYANA
              </div>
              <div style="font-size: 11px; letter-spacing: 3px; color: #E8F1EC; text-transform: uppercase; margin-top: 4px; font-weight: 600;">
                Pure Vedic A2 Gir Cow Ghee • Official Gaushala
              </div>
            </td>
          </tr>

          <!-- Personal Salutation & Emotional Hook -->
          <tr>
            <td style="padding: 32px 30px 20px 30px; font-size: 15px; color: #1E2823; line-height: 1.75;">

              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #075B43;">
                Pranam Vijay Bhadana ji,
              </p>

              <p style="margin: 0 0 18px 0; font-size: 15px;">
                I am reaching out to you personally from our Gaushala dispatch desk regarding Order <strong>#${customerDetails.orderId}</strong> for your <strong>10 Litre Traditional Heritage Can</strong> of Pure Vedic A2 Gir Cow Ghee.
              </p>

              <p style="margin: 0 0 18px 0; font-size: 14.5px; color: #2C3A33;">
                This 10-litre can is not an ordinary commercial product; it represents the living, sacred essence of over <strong>300 litres of pure A2 Gir cow milk</strong>, naturally cultured into curd and hand-churned with wooden bilonas in the Brahma Muhurta. For your household in <strong>Sector 21-B, Faridabad</strong>, this is authentic Vedic medicine — liquid gold that builds generational immunity, nourishes your joints, and brings pure sattvic energy into your kitchen.
              </p>

              <p style="margin: 0 0 20px 0; font-size: 14.5px;">
                Your order is currently logged for <strong>Cash on Delivery (COD) with ₹6,499.00 to be paid in cash at your doorstep</strong>.
              </p>

              <!-- High-Impact Direct Cash Discount Banner -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #FAF8F2 0%, #F5EFE1 100%); border: 2px solid #075B43; border-radius: 10px; margin: 24px 0; overflow: hidden; box-shadow: 0 4px 16px rgba(7, 91, 67, 0.1);">
                <tr>
                  <td style="background-color: #075B43; color: #FFFFFF; padding: 12px 20px; font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                    ⚡ Direct Pre-Dispatch Cash Waiver Approved
                  </td>
                </tr>
                <tr>
                  <td style="padding: 22px 24px; font-size: 14px;">
                    <div style="font-size: 15px; font-weight: 700; color: #075B43; margin-bottom: 14px;">
                      We want to grant you a direct Flat ₹1,000 Cash Concession:
                    </div>

                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 14px;">
                      <tr>
                        <td style="padding: 6px 0; color: #727B75;">Scheduled Doorstep Cash Balance:</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #9CA3AF; text-decoration: line-through;">₹6,499.00</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #075B43; font-weight: 700;">• Direct Online Prepay Cash Discount:</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 800; color: #075B43; font-size: 15px;">-₹1,000.00 OFF</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #727B75;">• 4x Cold-Pressed Oils (Worth ₹1,250):</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #075B43;">100% FREE</td>
                      </tr>
                      <tr style="border-top: 1.5px dashed #D0C9BA;">
                        <td style="padding: 14px 0 6px 0; font-weight: 800; font-size: 15.5px; color: #17231E;">FINAL AMOUNT YOU PAY NOW:</td>
                        <td style="padding: 14px 0 6px 0; text-align: right; font-weight: 900; font-size: 26px; color: #075B43; font-family: monospace;">₹5,499.00</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 6px; font-size: 12.5px; color: #287A50; font-weight: 700;">
                          ✓ Amount payable to courier on delivery becomes: <span style="background-color: #E8F1EC; color: #075B43; padding: 2px 8px; border-radius: 4px;">₹0 (ZERO CASH ON DELIVERY)</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Emotional & Practical Reasons to Prepay -->
              <div style="font-size: 15px; font-weight: 800; color: #075B43; margin: 26px 0 12px 0;">
                Why Settle This Online Today?
              </div>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; font-size: 13.5px; line-height: 1.7;">
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; width: 24px; font-size: 16px;">💰</td>
                  <td style="padding: 8px 0 8px 10px;">
                    <strong>Immediate ₹1,000 Real Cash in Your Pocket:</strong> There is no reason to pay ₹6,499 when you can pay ₹5,499 right now. That is a straight ₹1,000 cash saving for your family.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; font-size: 16px;">🚫</td>
                  <td style="padding: 8px 0 8px 10px;">
                    <strong>Zero Cash on Delivery Hassle:</strong> No need to visit an ATM to withdraw ₹6,500 in physical cash, hunt for exact change, or worry if family members are home when the courier arrives in Sector 21-B.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; font-size: 16px;">🛡️</td>
                  <td style="padding: 8px 0 8px 10px;">
                    <strong>VIP Priority Dispatch:</strong> 10L steel cans are substantial and heavy. Prepaid consignments are immediately packed in shock-proof wooden bracing, sealed with holographic tamper seals, and shipped via priority air logistics with zero courier holds.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; font-size: 16px;">🎁</td>
                  <td style="padding: 8px 0 8px 10px;">
                    <strong>All 4 Free Gifts Guaranteed:</strong> 1x Coconut Oil (250ml), 1x Groundnut Oil (250ml), 1x Mustard Oil (500ml), and 1x Yellow Mustard Oil (250ml) securely packaged with your can.
                  </td>
                </tr>
              </table>

              <!-- High-Converting Prepay CTA Button -->
              <div style="text-align: center; margin: 32px 0 24px 0;">
                <a href="${prepayDirectGatewayUrl}" style="background: linear-gradient(135deg, #075B43 0%, #064635 100%); color: #FFFFFF !important; text-decoration: none; padding: 18px 42px; border-radius: 8px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 8px 24px rgba(7, 91, 67, 0.3); letter-spacing: 0.5px; border: 1px solid #D4AF37;">
                  Settle ₹5,499 Online &amp; Save ₹1,000 →
                </a>
                <div style="margin-top: 10px; font-size: 12px; color: #727B75;">
                  🔒 256-Bit Encrypted Payment • UPI (Google Pay, PhonePe, Paytm), Cards &amp; NetBanking
                </div>
              </div>

              <!-- Direct link fallback -->
              <div style="background-color: #FAF9F5; border: 1px solid #EAE7DF; border-radius: 6px; padding: 12px 14px; font-size: 12px; color: #727B75; word-break: break-all; margin-bottom: 24px;">
                <strong>Direct Payment Link:</strong><br/>
                <a href="${prepayDirectGatewayUrl}" style="color: #075B43; font-weight: 600;">${prepayDirectGatewayUrl}</a>
              </div>

              <!-- Dispatch Notice & Urgency -->
              <p style="font-size: 13px; color: #8C6D2B; background-color: #FFFDF0; border: 1px solid #EEDEA8; border-radius: 6px; padding: 12px 14px; margin: 0 0 20px 0;">
                ⏰ <strong>Please Note:</strong> This ₹1,000 waiver is valid until tomorrow morning before our courier handover manifest is finalized. Once the physical COD invoice of ₹6,499 is sealed on the wooden crate, courier regulations require full cash collection at your doorstep.
              </p>

              <!-- Consignment Summary -->
              <div style="font-size: 13.5px; font-weight: 700; color: #17231E; margin: 20px 0 8px 0;">
                Delivery Details:
              </div>

              <div style="background-color: #FAF9F5; border: 1px solid #EAE7DF; border-radius: 6px; padding: 14px 16px; font-size: 13px; color: #374151; line-height: 1.6; margin-bottom: 24px;">
                <strong>Recipient:</strong> Vijay Bhadana (+91 9911510007)<br/>
                <strong>Address:</strong> House no 54 sector 21-B, Near Near jeeva school, Faridabad, Haryana - 121001<br/>
                <strong>Consignment:</strong> 1x Pure A2 Gir Cow Ghee (10 Litre Heritage Can) + 4x Free Cold-Pressed Oils
              </div>

              <p style="margin: 0 0 20px 0; font-size: 14px;">
                If you have any questions or would like to confirm your delivery preferences, you can reply directly to this email at any time.
              </p>

              <p style="margin: 0; font-size: 14px; color: #2C3A33;">
                With Warmest Regards &amp; Gratitude,<br/>
                <strong style="color: #075B43; font-size: 15px;">Mayank Agrawal</strong><br/>
                <span>Operations &amp; Fulfillment • Namo Narayana Vedic Gaushala</span><br/>
                <span style="font-size: 12px; color: #727B75;">care@namonarayanaghee.store • www.namonarayanaghee.store</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F7F5EF; padding: 18px 28px; text-align: center; border-top: 1px solid #E2DDD2; font-size: 11.5px; color: #727B75; line-height: 1.6;">
              Namo Narayana Vedic Gaushala • Bharat<br/>
              Order Reference: #${customerDetails.orderId} • Sent directly to ${customerDetails.email}
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

function generateEmotionalText() {
  return `Pranam Vijay Bhadana ji,

I am writing to you directly from our farm fulfillment desk regarding your order #${customerDetails.orderId} for the 10 Litre Traditional Heritage Can of Pure Vedic A2 Gir Cow Ghee.

This 10-litre can is not an ordinary commercial product; it represents the living, sacred essence of over 300 litres of pure A2 Gir cow milk, slow-churned in wooden bilonas during Brahma Muhurta. For your household in Sector 21-B, Faridabad, this is authentic Vedic medicine — liquid gold that builds generational immunity, nourishes your joints, and brings pure sattvic energy into your kitchen.

Your order is currently scheduled for Cash on Delivery with ₹6,499.00 to be collected at your doorstep.

DIRECT PRE-DISPATCH CASH WAIVER APPROVED:
We want to grant you a direct Flat ₹1,000.00 Cash Concession:
- Scheduled Doorstep Cash Balance: ₹6,499.00
- Direct Online Prepay Cash Discount: -₹1,000.00 OFF
- 4x Cold-Pressed Oils (Worth ₹1,250): 100% FREE
--------------------------------------------------
FINAL AMOUNT YOU PAY NOW: ₹5,499.00 ONLY
Doorstep cash on delivery becomes: ₹0.00 (Zero Cash Hassle)

WHY SETTLE THIS ONLINE TODAY?
1. Immediate ₹1,000 Real Cash in Your Pocket: Keep ₹1,000 in your pocket instead of handing over ₹6,499 in cash.
2. Zero Doorstep Cash Hassle: No need to visit an ATM to withdraw ₹6,500 in physical cash or hunt for exact change in Sector 21-B, Faridabad.
3. VIP Priority Dispatch: Packed in shock-proof wooden packaging with tamper-evident holographic sealing and shipped via priority air logistics.
4. All 4 Free Gifts Included: Coconut Oil (250ml), Groundnut Oil (250ml), Mustard Oil (500ml), Yellow Mustard Oil (250ml).

CLICK HERE TO SETTLE ₹5,499 & SAVE ₹1,000:
${prepayDirectGatewayUrl}

Or track your shipment:
${prepayTrackOrderUrl}

DELIVERY DESTINATION:
Vijay Bhadana, House no 54 sector 21-B, Near Near jeeva school, Faridabad, Haryana - 121001 (Phone: +91 9911510007)

Please note: This ₹1,000 waiver is active until tomorrow morning before our courier handover manifest is finalized. Once the physical COD invoice of ₹6,499 is sealed on the wooden crate, courier regulations require full cash collection.

With Warmest Regards & Gratitude,
Mayank Agrawal
Operations & Fulfillment • Namo Narayana Vedic Gaushala
care@namonarayanaghee.store | www.namonarayanaghee.store`;
}

async function sendEmail(toEmail, toName, isAdmin = false) {
  // Use conversational, non-spammy subject line to ensure Primary Inbox delivery
  const subject = isAdmin
    ? `[ADMIN COPY] Regarding your order #${customerDetails.orderId} - Namo Narayana (Vijay Bhadana)`
    : `Regarding your order #${customerDetails.orderId} - Namo Narayana`;

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
    htmlContent: generateEmotionalLuxuryEmailHtml(),
    textContent: generateEmotionalText(),
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
  console.log("SENDING BEAUTIFUL & EMOTIONAL PREPAY UPGRADE (SAVE ₹1,000 • PAY ₹5,499)");
  console.log(`Customer: ${customerDetails.name} (${customerDetails.email})`);
  console.log(`Phone: +91 ${customerDetails.phone}`);
  console.log(`Order ID: #${customerDetails.orderId}`);
  console.log(`Doorstep Cash Balance: ${customerDetails.originalCodRemaining}`);
  console.log(`Prepay Cash Discount: ${customerDetails.cashDiscount}`);
  console.log(`Prepay Payable Amount: ${customerDetails.prepayAmount}`);
  console.log(`Direct Gateway Link: ${prepayDirectGatewayUrl}`);
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
