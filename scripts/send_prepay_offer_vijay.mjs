import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";
const SENDER_NAME = "Namo Narayana Executive Care";
const SUPPORT_EMAIL = "support@namonarayanaghee.store";

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
  items: "1x Pure A2 Gir Cow Ghee (10 Litre Traditional Heritage Steel Can)",
  freeGifts: "4x Complimentary Cold-Pressed Oils (Coconut 250ml + Groundnut 250ml + Mustard 500ml + Yellow Mustard 250ml)",
  marketValue: "₹21,249.00",
  subtotal: "₹7,999.00",
  couponUsed: "FIRST1500 (Flat ₹1,500 OFF)",
  advancePaid: "₹250.00",
  originalCodRemaining: "₹6,499.00",
  extraCashDiscount: "₹1,000.00",
  discountedPrepayAmount: "₹5,499.00",
  totalCumulativeSavings: "₹15,750.00+",
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

function generateEmailHtml() {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Special Prepay Upgrade: Save ₹1,000 Instantly on Order #${customerDetails.orderId} - Namo Narayana</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #17231E; line-height: 1.6;">

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF9F5" style="background-color: #FAF9F5; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Email Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px rgba(23, 35, 30, 0.08); border: 1px solid #EAE7DF;">

          <!-- Obsidian Emerald Luxury Header -->
          <tr>
            <td bgcolor="#075B43" style="background: linear-gradient(135deg, #075B43 0%, #064635 100%); padding: 32px 24px 26px 24px; text-align: center; border-bottom: 3px solid #B89A62;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://www.namonarayanaghee.store/assets/namo-narayana-logo.webp" alt="Namo Narayana" width="140" style="display: block; border: 0; max-width: 140px; height: auto; margin-bottom: 10px;" />
                    <div style="font-size: 11px; letter-spacing: 3px; color: #E8F1EC; text-transform: uppercase; font-weight: 700;">
                      Pure Vedic A2 Gir Cow Ghee • Gaushala Reserve
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Exclusive Offer Callout Ribbon -->
          <tr>
            <td style="background: linear-gradient(135deg, #FFFDF8 0%, #FBF5E6 100%); border-bottom: 1px solid #EAE7DF; padding: 16px 24px; text-align: center;">
              <span style="display: inline-block; background-color: #075B43; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                🏛️ EXCLUSIVE HERITAGE PREPAY PRIVILEGE
              </span>
              <div style="font-size: 17px; font-weight: 800; color: #17231E; margin-top: 4px;">
                Save <span style="color: #075B43;">Flat ₹1,000 More</span> • Pay Only <span style="color: #075B43; font-family: monospace;">₹5,499</span>
              </div>
              <div style="font-size: 12px; color: #727B75; font-weight: 600; margin-top: 3px;">
                Zero Cash on Delivery • 100% Contactless VIP Express Delivery
              </div>
            </td>
          </tr>

          <!-- Main Letter Content -->
          <tr>
            <td style="padding: 28px 28px 20px 28px; font-size: 15px; color: #17231E; line-height: 1.7;">

              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700;">
                Dear Vijay Bhadana ji,
              </p>

              <p style="margin: 0 0 16px 0;">
                Pranam &amp; Namaste! 🙏
              </p>

              <p style="margin: 0 0 16px 0;">
                We are deeply honored that you have entrusted us with your family's health by reserving our grand <strong>10 Litre Traditional Heritage Can</strong> of <strong>Namo Narayana Pure Vedic A2 Gir Cow Ghee</strong>.
              </p>

              <p style="margin: 0 0 16px 0;">
                This sacred 10-litre reserve represents the pure, concentrated essence of over <strong>300 litres of indigenous Gir Cow milk</strong>, slow-cultured into curd and hand-churned using wooden bilonas in the Brahma Muhurta. For your household in <strong>Sector 21-B, Faridabad</strong>, this is authentic <em>Amrit</em> — bolstering generational immunity, promoting joint vitality, and blessing your home with divine purity.
              </p>

              <p style="margin: 0 0 16px 0;">
                We noted that you chose <strong>Cash on Delivery (COD)</strong> for Order <strong>#${customerDetails.orderId}</strong>, having paid an advance confirmation of ₹250 online, leaving a remaining balance of <strong>₹6,499.00</strong> to be arranged in cash at your doorstep.
              </p>

              <!-- Highlighted Value Proposition Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F5; border: 2px solid #075B43; border-radius: 12px; margin: 22px 0; overflow: hidden; box-shadow: 0 4px 14px rgba(7, 91, 67, 0.08);">
                <tr>
                  <td style="background-color: #075B43; color: #FFFFFF; padding: 12px 20px; font-size: 13.5px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                    🎁 Exclusive Prepay Upgrade Savings Breakdown
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 22px; font-size: 14px; color: #17231E;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: #727B75;">Total Consignment Worth (10L Can + 4 Gifts):</td>
                        <td style="padding: 6px 0; font-weight: 700; text-align: right; text-decoration: line-through; color: #9CA3AF;">₹21,249.00</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #727B75;">Scheduled Remaining Doorstep Cash:</td>
                        <td style="padding: 6px 0; font-weight: 700; text-align: right; text-decoration: line-through; color: #DC2626;">₹6,499.00</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #075B43; font-weight: 700;">• Immediate Online Prepay Cash Waiver:</td>
                        <td style="padding: 6px 0; font-weight: 800; text-align: right; color: #075B43;">-₹1,000.00 OFF</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #075B43; font-weight: 700;">• 4x Cold-Pressed Heritage Oils Bundle:</td>
                        <td style="padding: 6px 0; font-weight: 800; text-align: right; color: #075B43;">FREE (Worth ₹1,250)</td>
                      </tr>
                      <tr style="border-top: 1px dashed #D1D5DB; border-bottom: 1px dashed #D1D5DB;">
                        <td style="padding: 12px 0; font-weight: 800; font-size: 15px; color: #17231E;">YOU PAY ONLY:</td>
                        <td style="padding: 12px 0; font-weight: 900; font-size: 26px; color: #075B43; text-align: right; font-family: monospace;">₹5,499.00</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 10px; font-size: 13px; color: #287A50; font-weight: 700;">
                          ✓ Balance to pay courier at delivery becomes: <span style="background-color: #E8F1EC; color: #075B43; padding: 2px 8px; border-radius: 4px;">₹0 (ZERO HASSLE)</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Why Prepay Benefits -->
              <h3 style="font-size: 15px; font-weight: 800; color: #075B43; margin: 24px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Why Complete Your Prepay Upgrade Now?
              </h3>

              <div style="background-color: #FFFFFF; border: 1px solid #EAE7DF; border-radius: 10px; padding: 18px 20px; margin-bottom: 24px; font-size: 13.5px; line-height: 1.7;">
                <p style="margin: 0 0 12px 0;">
                  💰 <strong>Save ₹1,000 in Hard Cash:</strong> Keep your hard-earned money in your pocket. Instead of paying ₹6,499 in cash at your gate, pay just ₹5,499 online right now.
                </p>
                <p style="margin: 0 0 12px 0;">
                  🚫 <strong>Zero Doorstep Cash Hassle:</strong> Arranging ₹6,500 in exact physical currency or managing change shortages with delivery riders in Sector 21-B, Faridabad is stressful. 100% prepaid ensures a seamless, hands-free delivery.
                </p>
                <p style="margin: 0 0 12px 0;">
                  🛡️ <strong>Armored VIP Priority Air Dispatch:</strong> Due to the heavy weight and value of this 10L steel container, prepaid consignments are double-reinforced in shock-absorbent wooden bracing, sealed with holographic tamper seals, and expedited on priority air logistics with zero transit delays.
                </p>
                <p style="margin: 0;">
                  🎁 <strong>All 4 Free Gifts Guaranteed:</strong> Your complimentary Pure Coconut Oil (250ml), Groundnut Oil (250ml), Kachi Ghani Mustard Oil (500ml), and Yellow Mustard Oil (250ml) are securely packaged alongside your 10L can.
                </p>
              </div>

              <!-- Primary CTA Button -->
              <div style="text-align: center; margin: 32px 0 24px 0;">
                <a href="${prepayDirectGatewayUrl}" style="background: linear-gradient(135deg, #075B43 0%, #064635 100%); color: #FFFFFF !important; text-decoration: none; padding: 18px 40px; border-radius: 10px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 8px 24px rgba(7, 91, 67, 0.35); letter-spacing: 0.5px; border: 1px solid #B89A62;">
                  Prepay ₹5,499 &amp; Save ₹1,000 Instantly →
                </a>
                <div style="margin-top: 10px; font-size: 11.5px; color: #727B75;">
                  🔒 256-Bit Encrypted Secure Gateway • UPI (GPay/PhonePe), Credit/Debit Cards, NetBanking
                </div>
              </div>

              <!-- Alternative direct link -->
              <p style="font-size: 12px; color: #727B75; text-align: center; margin-bottom: 24px;">
                Direct Gateway Link: <a href="${prepayDirectGatewayUrl}" style="color: #075B43; font-weight: 600; word-break: break-all;">${prepayDirectGatewayUrl}</a>
              </p>

              <!-- Order Snapshot Details -->
              <h3 style="font-size: 14px; font-weight: 800; color: #17231E; margin: 20px 0 8px 0; text-transform: uppercase;">
                Consignment Details:
              </h3>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F5; border: 1px solid #EAE7DF; border-radius: 8px; font-size: 13px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; color: #727B75; width: 34%;">Order Reference:</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-weight: 700; font-family: monospace;">#${customerDetails.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; color: #727B75;">Customer Name:</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-weight: 600;">${customerDetails.name} (+91 ${customerDetails.phone})</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; color: #727B75;">Reserved Products:</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-weight: 600;">
                    ${customerDetails.items}<br/>
                    <span style="font-size: 11.5px; color: #075B43; font-weight: 700;">+ 4 Complimentary Cold-Pressed Oils (Included)</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; color: #727B75;">Delivery Destination:</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-size: 12px;">${customerDetails.address}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; color: #727B75;">Advance Paid Online:</td>
                  <td style="padding: 10px 14px; font-weight: 600; color: #075B43;">${customerDetails.advancePaid} (Confirmed)</td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0;">
                If you have any questions or require custom dispatch instructions for your family, please feel free to reply directly to this email or speak with our Executive Care Team at <strong>support@namonarayanaghee.store</strong>.
              </p>

              <p style="margin: 24px 0 0 0; color: #075B43; font-weight: 700; line-height: 1.5;">
                With Highest Regards &amp; Divine Wishes for Your Family,<br/>
                <strong style="color: #17231E; font-size: 16px;">Namo Narayana Operations &amp; Gaushala Team</strong><br/>
                <span style="font-size: 13px; color: #727B75; font-weight: 500;">Pure Vedic Desi Gir Cow Bilona Ghee • Bharat 🙏</span><br/>
                <span style="font-size: 12px; color: #B89A62;">support@namonarayanaghee.store • www.namonarayanaghee.store</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#FAF9F5" style="background-color: #FAF9F5; padding: 20px 28px; text-align: center; border-top: 1px solid #EAE7DF; font-size: 11.5px; color: #727B75; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 700; color: #17231E;">
                Namo Narayana Vedic Gaushala • Executive Care Desk
              </p>
              <p style="margin: 0;">
                Sent regarding 10L Heritage Order #${customerDetails.orderId} to ${customerDetails.email}.<br/>
                Official Store: <a href="https://www.namonarayanaghee.store" style="color: #075B43; text-decoration: none; font-weight: 600;">www.namonarayanaghee.store</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

function generateEmailText() {
  return `Pranam Vijay Bhadana ji,

Thank you for choosing Namo Narayana Pure Vedic A2 Gir Cow Ghee for your family. We are currently preparing your grand 10 Litre Traditional Heritage Can fresh from our Gaushala, along with your 4 complimentary cold-pressed oils.

This 10L reserve contains the sacred essence of over 300 litres of indigenous Gir Cow milk, slow-churned using traditional bilonas for your household in Sector 21-B, Faridabad.

We have an exclusive Prepay Upgrade Offer for your Order #${customerDetails.orderId}:
Save an extra Flat ₹1,000.00 right now and reduce your doorstep balance to ₹0!

SAVINGS BREAKDOWN:
- Total Consignment Market Value: ₹21,249.00
- Scheduled Doorstep COD Balance: ₹6,499.00
- Exclusive Prepay Cash Waiver: -₹1,000.00 OFF
- 4x Cold-Pressed Oils: 100% FREE (Worth ₹1,250)
--------------------------------------------------
YOU PAY ONLINE RIGHT NOW: ₹5,499.00 ONLY
Balance Due on Delivery: ₹0.00 (Zero Cash Hassle)
Total Cumulative Savings Unlocked: ₹15,750+ (74% OFF Total Value)

WHY COMPLETE PREPAY NOW?
1. Direct ₹1,000 Cash Savings: Keep ₹1,000 in your pocket instead of paying ₹6,499 in cash at delivery.
2. Zero Doorstep Cash Hassle: No need to arrange ₹6,500 physical cash or manage courier change issues in Sector 21-B, Faridabad.
3. Armored VIP Priority Air Dispatch: 10L steel containers are reinforced in protective shock-absorbent wooden packaging with holographic tamper seals.

CLICK TO PREPAY ₹5,499 & SAVE ₹1,000 INSTANTLY:
${prepayDirectGatewayUrl}

Or track your order online:
${prepayTrackOrderUrl}

CONSIGNMENT SUMMARY:
- Order Reference: #${customerDetails.orderId}
- Customer: ${customerDetails.name} (+91 ${customerDetails.phone})
- Products: ${customerDetails.items}
- Gifts: ${customerDetails.freeGifts}
- Destination: ${customerDetails.address}
- Advance Paid: ${customerDetails.advancePaid}

You can reply directly to this email at any time.

With Warmest Regards & Gratitude,
Namo Narayana Operations & Gaushala Team
support@namonarayanaghee.store | www.namonarayanaghee.store`;
}

async function sendBrevoEmail(toEmail, toName, isAdmin = false) {
  const subject = isAdmin
    ? `[ADMIN COPY] Special Prepay Upgrade: Save ₹1,000 on 10L Order #${customerDetails.orderId} (Vijay Bhadana)`
    : `Special Prepay Upgrade: Save Flat ₹1,000 More on your 10L Vedic Ghee Order #${customerDetails.orderId} - Namo Narayana`;

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
      name: "Namo Narayana Customer Support",
      email: SUPPORT_EMAIL
    },
    subject,
    htmlContent: generateEmailHtml(),
    textContent: generateEmailText(),
    headers: {
      "X-Mailin-Tag": "order-prepay-upgrade",
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
  console.log("SENDING PREPAY UPGRADE (SAVE ₹1,000 • PAY ₹5,499) EMAIL");
  console.log(`Customer: ${customerDetails.name} (${customerDetails.email})`);
  console.log(`Phone: +91 ${customerDetails.phone}`);
  console.log(`Order ID: #${customerDetails.orderId}`);
  console.log(`Scheduled COD Balance: ${customerDetails.originalCodRemaining}`);
  console.log(`Instant Prepay Discount: ${customerDetails.extraCashDiscount}`);
  console.log(`Final Discounted Prepay Amount: ${customerDetails.discountedPrepayAmount}`);
  console.log(`Gateway Link: ${prepayDirectGatewayUrl}`);
  console.log("=================================================================\n");

  for (const r of recipients) {
    console.log(`Sending to ${r.name} <${r.email}>...`);
    try {
      const res = await sendBrevoEmail(r.email, r.name, r.isAdmin);
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
