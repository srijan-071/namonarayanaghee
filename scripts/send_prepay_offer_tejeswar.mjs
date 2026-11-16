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
  name: "Tejeswar Maharana",
  email: "tejeswarmaharana20@gmail.com",
  phone: "7978764705",
  orderId: "8iuSn3NF9Ohs0lIsvzL7",
  address: "Latabila, Hanuman Chaka, Bhuban, Near Hanuman Chaka, Dhenkanal, Odisha - 759017",
  items: "1x Pure A2 Gir Cow Ghee (500 ml Glass Jar)",
  subtotal: "₹899.00",
  couponUsed: "NAMO10 (10% OFF)",
  advancePaid: "₹250.00",
  originalCodRemaining: "₹809.10",
  codFeeWaived: "₹250.00",
  extraPrepayDiscount: "₹70.00",
  totalDiscountSaved: "₹320.00",
  discountedPrepayAmount: "₹489.00",
};

// Seamless 1-click Prepay Links on our own website
const prepayTrackOrderUrl = `https://www.namonarayanaghee.store/track-order?orderId=${customerDetails.orderId}&phone=${customerDetails.phone}&prepay=true`;
const prepayDirectGatewayUrl = `https://www.namonarayanaghee.store/pay-proxy?orderId=${customerDetails.orderId}&action=prepay&amount=489&name=Tejeswar+Maharana&email=tejeswarmaharana20%40gmail.com&phone=7978764705`;

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
  <title>Special Prepay Upgrade: Save ₹320 Instantly on Order #${customerDetails.orderId} - Namo Narayana</title>
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
                      Pure Vedic A2 Gir Cow Ghee • Official Store
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Exclusive Offer Callout Ribbon -->
          <tr>
            <td style="background: linear-gradient(135deg, #FFFDF8 0%, #FBF5E6 100%); border-bottom: 1px solid #EAE7DF; padding: 14px 24px; text-align: center;">
              <span style="display: inline-block; background-color: #075B43; color: #FFFFFF; font-size: 10.5px; font-weight: 800; padding: 3px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                ✨ SPECIAL PREPAY UPGRADE OFFER
              </span>
              <div style="font-size: 16px; font-weight: 800; color: #17231E; margin-top: 4px;">
                Save <span style="color: #075B43;">₹320 Instantly</span> When You Prepay Online
              </div>
            </td>
          </tr>

          <!-- Main Letter Content -->
          <tr>
            <td style="padding: 28px 28px 20px 28px; font-size: 15px; color: #17231E; line-height: 1.7;">

              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700;">
                Dear Tejeswar ji,
              </p>

              <p style="margin: 0 0 16px 0;">
                Namaste! 🙏
              </p>

              <p style="margin: 0 0 16px 0;">
                Thank you for choosing <strong>Namo Narayana Pure Vedic A2 Gir Cow Ghee</strong>. We are currently handcrafting and packaging your <strong>500 ml Glass Jar</strong> fresh from our farm Gaushala.
              </p>

              <p style="margin: 0 0 16px 0;">
                We noticed that you opted for <strong>Cash on Delivery (COD)</strong> for Order <strong>#${customerDetails.orderId}</strong>, having paid an advance confirmation of ₹250 online, leaving a remaining balance of <strong>₹809.10</strong> to be paid in cash at your doorstep.
              </p>

              <!-- Highlighted Value Proposition Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F5; border: 1.5px solid #075B43; border-radius: 12px; margin: 20px 0; overflow: hidden;">
                <tr>
                  <td style="background-color: #075B43; color: #FFFFFF; padding: 10px 18px; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                    🎁 Exclusive Prepay Savings Breakdown
                  </td>
                </tr>
                <tr>
                  <td style="padding: 18px 20px; font-size: 14px; color: #17231E;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: #727B75;">Original Remaining Doorstep Balance:</td>
                        <td style="padding: 6px 0; font-weight: 700; text-align: right; text-decoration: line-through; color: #9CA3AF;">₹809.10</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #075B43;">• COD Courier Handling Fee Waived:</td>
                        <td style="padding: 6px 0; font-weight: 700; text-align: right; color: #075B43;">-₹250.00</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #075B43;">• Extra Instant Prepay Discount:</td>
                        <td style="padding: 6px 0; font-weight: 700; text-align: right; color: #075B43;">-₹70.00</td>
                      </tr>
                      <tr style="border-top: 1px dashed #EAE7DF;">
                        <td style="padding: 10px 0 4px 0; font-weight: 800; font-size: 15px; color: #17231E;">TOTAL SAVINGS UNLOCKED:</td>
                        <td style="padding: 10px 0 4px 0; font-weight: 800; font-size: 16px; color: #075B43; text-align: right;">₹320.00 SAVED</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-weight: 900; font-size: 16px; color: #17231E;">YOU PAY ONLY:</td>
                        <td style="padding: 6px 0; font-weight: 900; font-size: 22px; color: #075B43; text-align: right; font-family: monospace;">₹489.00</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 4px; font-size: 12px; color: #287A50; font-weight: 600;">
                          ✓ Doorstep Balance Payable at Delivery becomes: <strong>₹0 (Zero)</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Why Prepay Benefits -->
              <h3 style="font-size: 15px; font-weight: 800; color: #075B43; margin: 24px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Why Upgrade to Prepaid Today?
              </h3>

              <div style="background-color: #FFFFFF; border: 1px solid #EAE7DF; border-radius: 10px; padding: 16px 18px; margin-bottom: 24px; font-size: 13.5px; line-height: 1.65;">
                <p style="margin: 0 0 10px 0;">
                  💰 <strong>Direct ₹320 Cash Savings:</strong> Instead of paying ₹809.10 at delivery, pay just ₹489 online right now and save hard cash.
                </p>
                <p style="margin: 0 0 10px 0;">
                  🚀 <strong>VIP Express Air Dispatch:</strong> 100% prepaid orders are dispatched on our priority express line-haul with zero courier verification holds.
                </p>
                <p style="margin: 0 0 10px 0;">
                  🤝 <strong>100% Contactless &amp; Zero Cash Hassle:</strong> No need to arrange exact cash of ₹809 or deal with change shortages when the delivery executive arrives at Bhuban / Dhenkanal.
                </p>
                <p style="margin: 0;">
                  🔒 <strong>Guaranteed Authentic Delivery:</strong> Sealed with tamper-evident holographic protection direct from our farm.
                </p>
              </div>

              <!-- Primary CTA Button -->
              <div style="text-align: center; margin: 30px 0 24px 0;">
                <a href="${prepayDirectGatewayUrl}" style="background: linear-gradient(135deg, #075B43 0%, #064635 100%); color: #FFFFFF !important; text-decoration: none; padding: 16px 36px; border-radius: 10px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 6px 20px rgba(7, 91, 67, 0.3); letter-spacing: 0.5px; border: 1px solid #B89A62;">
                  Prepay ₹489 &amp; Save ₹320 Instantly →
                </a>
                <div style="margin-top: 8px; font-size: 11px; color: #727B75;">
                  🔒 256-Bit Encrypted Secure Gateway • UPI, Google Pay, PhonePe, Cards &amp; NetBanking
                </div>
              </div>

              <!-- Alternative direct link -->
              <p style="font-size: 12px; color: #727B75; text-align: center; margin-bottom: 24px;">
                Direct Gateway Link: <a href="${prepayDirectGatewayUrl}" style="color: #075B43; font-weight: 600; word-break: break-all;">${prepayDirectGatewayUrl}</a>
              </p>

              <!-- Order Snapshot Details -->
              <h3 style="font-size: 14px; font-weight: 800; color: #17231E; margin: 20px 0 8px 0; text-transform: uppercase;">
                Your Order Summary:
              </h3>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F5; border: 1px solid #EAE7DF; border-radius: 8px; font-size: 13px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; color: #727B75; width: 34%;">Order ID:</td>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; font-weight: 700; font-family: monospace;">#${customerDetails.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; color: #727B75;">Customer Name:</td>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; font-weight: 600;">${customerDetails.name} (+91 ${customerDetails.phone})</td>
                </tr>
                <tr>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; color: #727B75;">Items in Parcel:</td>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; font-weight: 600;">
                    ${customerDetails.items}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; color: #727B75;">Delivery Destination:</td>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; font-size: 12px;">${customerDetails.address}</td>
                </tr>
                <tr>
                  <td style="padding: 9px 12px; color: #727B75;">Advance Paid:</td>
                  <td style="padding: 9px 12px; font-weight: 600; color: #075B43;">${customerDetails.advancePaid} (Verified)</td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0;">
                If you have any questions or need assistance completing the upgrade, you can reply directly to this email or contact our customer support team at <strong>support@namonarayanaghee.store</strong>.
              </p>

              <p style="margin: 24px 0 0 0; color: #075B43; font-weight: 700; line-height: 1.5;">
                With Warmest Regards &amp; Gratitude,<br/>
                <strong style="color: #17231E; font-size: 16px;">Namo Narayana Operations &amp; Fulfillment Team</strong><br/>
                <span style="font-size: 13px; color: #727B75; font-weight: 500;">Pure Vedic Desi Gir Cow Bilona Ghee • Bharat 🙏</span><br/>
                <span style="font-size: 12px; color: #B89A62;">support@namonarayanaghee.store • www.namonarayanaghee.store</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#FAF9F5" style="background-color: #FAF9F5; padding: 20px 28px; text-align: center; border-top: 1px solid #EAE7DF; font-size: 11.5px; color: #727B75; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 700; color: #17231E;">
                Namo Narayana Vedic Farm • Customer Care Desk
              </p>
              <p style="margin: 0;">
                Sent regarding Order #${customerDetails.orderId} to ${customerDetails.email}.<br/>
                Store: <a href="https://www.namonarayanaghee.store" style="color: #075B43; text-decoration: none; font-weight: 600;">www.namonarayanaghee.store</a>
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
  return `Namaste Tejeswar ji,

Thank you for choosing Namo Narayana Pure Vedic A2 Gir Cow Ghee for your family. We are currently preparing your fresh 500 ml Glass Jar direct from our farm Gaushala.

We have an exclusive Prepay Upgrade Offer for your Order #${customerDetails.orderId}:
Save ₹320.00 instantly and reduce your doorstep balance to ₹0!

SAVINGS BREAKDOWN:
- Original Remaining Balance on Delivery: ₹809.10
- COD Handling Fee Waived: -₹250.00
- Extra Instant Online Prepay Discount: -₹70.00
--------------------------------------------------
TOTAL SAVINGS: ₹320.00 SAVED
DISCOUNTED PREPAY AMOUNT YOU PAY: ₹489.00 ONLY
Balance Due on Delivery: ₹0.00 (Zero)

WHY PREPAY NOW?
1. Save ₹320 in hard cash right now.
2. Zero doorstep cash hassle: no need to search for ₹809 cash or change when the courier arrives in Dhenkanal / Bhuban.
3. Fast-track VIP priority air dispatch directly from our farm.

CLICK TO PREPAY ₹489 & SAVE ₹320:
${prepayDirectGatewayUrl}

Or track order:
${prepayTrackOrderUrl}

ORDER SUMMARY:
- Order Reference: #${customerDetails.orderId}
- Customer: ${customerDetails.name} (+91 ${customerDetails.phone})
- Items: ${customerDetails.items}
- Destination: ${customerDetails.address}
- Advance Paid: ${customerDetails.advancePaid}

You can reply directly to this email at any time.

With Warmest Regards & Gratitude,
Namo Narayana Operations & Fulfillment Team
support@namonarayanaghee.store | www.namonarayanaghee.store`;
}

async function sendBrevoEmail(toEmail, toName, isAdmin = false) {
  const subject = isAdmin
    ? `[ADMIN COPY] Special Prepay Upgrade: Save ₹320 on Order #${customerDetails.orderId} (Tejeswar Maharana)`
    : `Special Prepay Upgrade: Save ₹320 Instantly on your Pure A2 Ghee Order #${customerDetails.orderId} - Namo Narayana`;

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
  console.log("SENDING PREPAY UPGRADE (SAVE ₹320) EMAIL");
  console.log(`Customer: ${customerDetails.name} (${customerDetails.email})`);
  console.log(`Phone: +91 ${customerDetails.phone}`);
  console.log(`Order ID: #${customerDetails.orderId}`);
  console.log(`Total Discount: ${customerDetails.totalDiscountSaved}`);
  console.log(`Discounted Prepay Amount: ${customerDetails.discountedPrepayAmount}`);
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
