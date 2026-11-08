import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";

if (!BREVO_API_KEY) {
  console.error("Missing BREVO_API_KEY in .env.local");
  process.exit(1);
}

const order = {
  orderId: "EAqaN5tazbpRecvPcd6l",
  customerName: "Manish jain",
  phone: "9164241615",
  email: "manishjain1407@gmail.com",
  address: "5-3-24, Lachiraju vari street, near 2 town police station, East Godavari, Andhra Pradesh 533003",
  items: "1x Pure A2 Gir Cow Ghee 5 Litre (Mega Pack)",
  freeGifts: [
    "1x Wood-Pressed Coconut Oil (250 ml)",
    "1x Cold-Pressed Groundnut Oil (250 ml)",
    "1x Traditional Kachi Ghani Mustard Oil (500 ml)"
  ],
  totalValue: 3749,
  advancePaid: 250,
  remainingCash: 3499,
  codFeeWaived: 250,
  extraTenPercentDiscount: 325,
  totalSavings: 575,
  finalPrepayAmount: 2924,
  prepayUrl: "https://potter-world.com/pay-proxy?order_id=EAqaN5tazbpRecvPcd6l-PREPAY&txnid=EAqaN5tazbpRecvPcd6l-PREPAY&amount=2924&firstname=Manish+jain&email=manishjain1407%40gmail.com&phone=9164241615&productinfo=Prepay+Upgrade+for+Order+%23EAqaN5tazbpRecvPcd6l+%28COD+to+Prepaid%29&returnUrl=https%3A%2F%2Fnamonarayanaghee.store%2Fapi%2Fconvert-cod-to-prepaid%3ForderId%3DEAqaN5tazbpRecvPcd6l%26amount%3D2924&cancelUrl=https%3A%2F%2Fnamonarayanaghee.store%2Ftrack-order%3ForderId%3DEAqaN5tazbpRecvPcd6l&brand=namonarayanaghee",
  trackUrl: "https://www.namonarayanaghee.store/track-order?orderId=EAqaN5tazbpRecvPcd6l"
};

function generateEmailHtml() {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Prepay &amp; Save ₹575 on Your Order #${order.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #24211E;">

  <!-- Preheader preview text -->
  <div style="display: none; font-size: 1px; color: #FAF8F2; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Namaste ${order.customerName}, save an instant ₹575 on Order #${order.orderId} (5L A2 Ghee + 3 Free Oils) by prepaying before delivery arrival!
  </div>

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F2" style="background-color: #FAF8F2; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(94, 11, 16, 0.08); border: 1px solid #EAD7BC;">

          <!-- Header -->
          <tr>
            <td bgcolor="#5E0B10" style="background: linear-gradient(135deg, #5E0B10 0%, #8A1B14 100%); padding: 30px 24px; text-align: center; border-bottom: 3px solid #D4A017;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://www.namonarayanaghee.store/assets/logo.png" alt="Namo Narayana" width="100" style="display: block; border: 0; max-width: 100px; height: auto; margin-bottom: 8px;" />
                    <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; letter-spacing: 1.5px; text-transform: uppercase;">NAMO NARAYANA</div>
                    <div style="font-size: 11px; letter-spacing: 2px; color: #F5BD47; text-transform: uppercase; font-weight: 700; margin-top: 4px;">Pure A2 Gir Cow Vedic Bilona Ghee</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notification Banner -->
          <tr>
            <td bgcolor="#FFF8EE" style="background-color: #FFF8EE; padding: 16px 24px; border-bottom: 1px solid #F0E2D0;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #2E7D32; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ✓ ADVANCE BOOKING CONFIRMED
                    </span>
                    <div style="font-size: 14px; font-weight: 700; color: #5E0B10; margin-top: 6px;">
                      Order ID: #${order.orderId}
                    </div>
                  </td>
                  <td align="right" style="font-size: 12px; color: #7A4A3B;">
                    <strong>₹250 Paid Online</strong><br />
                    Preparing for Dispatch
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 30px 28px 20px 28px; line-height: 1.65; color: #3A2F2D; font-size: 15px;">
              
              <div style="font-size: 18px; font-weight: 700; color: #5E0B10; margin-bottom: 12px;">
                Namaste ${order.customerName} Ji 🙏
              </div>

              <p style="margin: 0 0 16px 0; color: #4A352F;">
                Thank you for choosing <strong>Namo Narayana Pure A2 Gir Cow Ghee</strong>! We have received your ₹250 booking advance and your order is currently being hand-packed at our Vedic gaushala facility with protective thermal cushioning.
              </p>

              <!-- Special Offer Highlight Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #FFFBF2 0%, #FFF5E1 100%); border: 2px dashed #D4A017; border-radius: 12px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px 22px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <span style="background-color: #8A1B14; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
                            ⚡ LIMITED TIME PREPAY UPGRADE
                          </span>
                          <div style="font-size: 17px; font-weight: 800; color: #5E0B10; margin: 8px 0 6px 0;">
                            Prepay Remaining Balance Online &amp; Save ₹575!
                          </div>
                          <p style="margin: 0; font-size: 13px; color: #5C3D2E; line-height: 1.55;">
                            Avoid the hassle of arranging physical cash change or unexpected OTP issues when the delivery executive arrives at your doorstep. Prepay your remaining balance right now to unlock an <strong>instant ₹575 discount</strong>!
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Savings Breakdown Table -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF6EF; border: 1px solid #EAD7BC; border-radius: 10px; margin: 20px 0; overflow: hidden;">
                <tr>
                  <td colspan="2" style="padding: 12px 16px; background-color: #F2E8D7; border-bottom: 1px solid #EAD7BC; font-weight: 700; color: #5E0B10; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                    💰 Your Live Prepay Savings Breakdown
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #6E5D57; font-size: 13px; border-bottom: 1px solid #F0E4D4;">
                    Doorstep Cash to Collect:
                  </td>
                  <td align="right" style="padding: 10px 16px; color: #888888; font-size: 14px; text-decoration: line-through; border-bottom: 1px solid #F0E4D4;">
                    ₹${order.remainingCash}.00
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #2E7D32; font-size: 13px; font-weight: 600; border-bottom: 1px solid #F0E4D4;">
                    ✓ ₹250 COD Handling Fee Waived:
                  </td>
                  <td align="right" style="padding: 10px 16px; color: #2E7D32; font-size: 13px; font-weight: 700; border-bottom: 1px solid #F0E4D4;">
                    −₹${order.codFeeWaived}.00
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #2E7D32; font-size: 13px; font-weight: 600; border-bottom: 1px solid #F0E4D4;">
                    ✓ Extra 10% Instant Prepay Discount:
                  </td>
                  <td align="right" style="padding: 10px 16px; color: #2E7D32; font-size: 13px; font-weight: 700; border-bottom: 1px solid #F0E4D4;">
                    −₹${order.extraTenPercentDiscount}.00
                  </td>
                </tr>
                <tr bgcolor="#FFF2D6">
                  <td style="padding: 14px 16px; color: #5E0B10; font-size: 15px; font-weight: 800;">
                    Total You Pay Online Right Now:
                  </td>
                  <td align="right" style="padding: 14px 16px; color: #8A1B14; font-size: 18px; font-weight: 900;">
                    ₹${order.finalPrepayAmount}.00
                    <div style="font-size: 11px; color: #2E7D32; font-weight: 700; margin-top: 2px;">
                      (You Save ₹${order.totalSavings}.00 Total)
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Big CTA Button -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 26px 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="${order.prepayUrl}" target="_blank" style="display: block; background: linear-gradient(135deg, #8A1B14 0%, #5E0B10 100%); color: #FFFFFF; font-size: 16px; font-weight: 800; text-decoration: none; padding: 16px 28px; border-radius: 10px; box-shadow: 0 4px 14px rgba(138, 27, 20, 0.35); border: 2px solid #D4A017; text-align: center;">
                      ⚡ Prepay ₹${order.finalPrepayAmount} Online (Save ₹575 Now) →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <span style="font-size: 11px; color: #7A6560;">
                      🔒 100% Secure 256-Bit SSL • Instant Confirmation • Zero Cash at Doorstep
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Prepay Benefits -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #FDFCF9; border-radius: 8px; padding: 14px 16px; border: 1px solid #EFE8DA;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; color: #5E0B10; text-transform: uppercase; margin-bottom: 8px;">
                      Why Prepaying is Smoother &amp; Recommended:
                    </div>
                    <div style="font-size: 13px; color: #4A352F; line-height: 1.6;">
                      • <strong>Instant ₹575 Savings:</strong> Pay only ₹${order.finalPrepayAmount} instead of ₹${order.remainingCash} in cash.<br />
                      • <strong>Zero Cash Collection Hassle:</strong> Delivery agent simply hands over your parcel with ₹0 to collect.<br />
                      • <strong>Contactless &amp; Seamless:</strong> If you are away, your family or neighbor can safely receive the parcel without payment.<br />
                      • <strong>All Digital Payment Modes Supported:</strong> Google Pay, PhonePe, Paytm, UPI, Credit/Debit Cards, Netbanking.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Order Summary Section -->
              <div style="border-top: 1px solid #EAD7BC; margin-top: 25px; padding-top: 20px;">
                <div style="font-size: 14px; font-weight: 700; color: #5E0B10; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                  📦 Your Order Summary:
                </div>

                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.6; color: #3A2F2D;">
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Item:</strong></td>
                    <td style="padding: 6px 0; color: #5E0B10; font-weight: 600;">${order.items}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Complimentary Gifts:</strong></td>
                    <td style="padding: 6px 0; color: #2E7D32; font-weight: 600;">
                      ${order.freeGifts.join("<br />")}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Delivery Address:</strong></td>
                    <td style="padding: 6px 0;">${order.address}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Contact Phone:</strong></td>
                    <td style="padding: 6px 0;">+91 ${order.phone}</td>
                  </tr>
                </table>
              </div>

              <!-- Secondary Link -->
              <p style="margin: 25px 0 0 0; font-size: 13px; color: #5C4A45; text-align: center;">
                You can also track your live order progress or prepay directly on our website anytime:<br />
                <a href="${order.trackUrl}" target="_blank" style="color: #8A1B14; font-weight: 700; text-decoration: underline;">
                  View &amp; Track Order #${order.orderId} Online →
                </a>
              </p>

            </td>
          </tr>

          <!-- Support & Footer -->
          <tr>
            <td bgcolor="#F6F1E7" style="background-color: #F6F1E7; padding: 22px 28px; border-top: 1px solid #EAD7BC; font-size: 12px; color: #6E5D57; line-height: 1.6;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <strong>Need Help or Have a Question?</strong><br />
                    Reply directly to this email or reach us at <a href="mailto:support@namonarayanaghee.store" style="color: #8A1B14; font-weight: 600;">support@namonarayanaghee.store</a>.<br /><br />
                    <span style="font-size: 11px; color: #8C7B76;">
                      Namo Narayana • HIMANI FOODS PRIVATE LIMITED<br />
                      Rohat(215), Sampla Sonipat Road, District Sonipat, Haryana 131403, India<br />
                      FSSAI Central Food Safety License: 20824005000185
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

function generatePlainText() {
  return `NAMO NARAYANA - PURE A2 GIR COW VEDIC BILONA GHEE
Order #${order.orderId} Confirmed - Save ₹575 by Prepaying Online
--------------------------------------------------------------------------------

Namaste ${order.customerName} Ji,

Thank you for placing your order with Namo Narayana! We have received your ₹250 booking advance and your order is currently being prepared for dispatch with shockproof thermal cushioning.

Order ID: #${order.orderId}
Item: ${order.items}
Free Gifts:
${order.freeGifts.map(g => "• " + g).join("\n")}
Delivery Address: ${order.address}
Phone: +91 ${order.phone}

--------------------------------------------------------------------------------
⚡ SPECIAL OFFER: PREPAY REMAINING BALANCE ONLINE & SAVE ₹575!
--------------------------------------------------------------------------------
Avoid the hassle of arranging physical cash change or unexpected OTP issues when the delivery executive arrives at your doorstep. Prepay online right now to unlock ₹575 in instant savings:

• Doorstep Cash Amount: Rs. ${order.remainingCash}.00
• COD Handling Charge Waived: -Rs. ${order.codFeeWaived}.00
• Extra 10% Instant Prepay Discount: -Rs. ${order.extraTenPercentDiscount}.00
--------------------------------------------------------------------------------
FINAL AMOUNT PAYABLE ONLINE: Rs. ${order.finalPrepayAmount}.00 (You Save Rs. ${order.totalSavings}.00 Total)
--------------------------------------------------------------------------------

Click below to pay Rs. ${order.finalPrepayAmount} securely online via UPI, Google Pay, PhonePe, Paytm or Card:
${order.prepayUrl}

Or track your live order status on our official store:
${order.trackUrl}

Why Prepaying is Smoother & Recommended:
1. Save an instant ₹575 directly on your order.
2. Contactless priority delivery: Delivery agent simply hands over your parcel with ₹0 to collect.
3. No cash coordination or change issues at your door.
4. Accepted via Google Pay, PhonePe, Paytm, UPI, Cards, and Netbanking.

Need Assistance?
Reply directly to this email or write to us at support@namonarayanaghee.store.

Warm regards,
Namo Narayana Customer Care Team
HIMANI FOODS PRIVATE LIMITED
Rohat, Sonipat, Haryana 131403 | FSSAI Lic: 20824005000185
`;
}

async function sendEmail(recipientEmail, recipientName) {
  const payload = {
    sender: { name: "Namo Narayana Care", email: SENDER_EMAIL },
    to: [{ email: recipientEmail, name: recipientName }],
    replyTo: { name: "Namo Narayana Support", email: "support@namonarayanaghee.store" },
    subject: `Order #${order.orderId} Confirmed: Prepay Balance Online & Save ₹575 Before Doorstep Arrival`,
    htmlContent: generateEmailHtml(),
    textContent: generatePlainText(),
    headers: {
      "X-Mailin-Tag": "prepay-discount-upgrade",
      "Auto-Submitted": "auto-generated",
      "X-Entity-Ref-ID": order.orderId
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
    throw new Error(`Brevo send failed (${res.status}): ${bodyText}`);
  }

  return JSON.parse(bodyText);
}

async function main() {
  console.log("Preparing to dispatch prepay email via Brevo...");

  // 1. Send to Customer
  console.log(`\n1. Sending to Customer: ${order.email} (${order.customerName})...`);
  const custResult = await sendEmail(order.email, order.customerName);
  console.log("✓ Customer email dispatched successfully:", custResult);

  // 2. Send identical email to Admin (littlecodr@gmail.com) with NO admin verification branding
  console.log(`\n2. Sending identical copy to Admin: littlecodr@gmail.com...`);
  const adminResult = await sendEmail("littlecodr@gmail.com", "Manish jain");
  console.log("✓ Admin copy dispatched successfully:", adminResult);

  console.log("\nAll emails successfully sent via Brevo!");
}

main().catch(err => {
  console.error("Error executing script:", err);
  process.exit(1);
});
