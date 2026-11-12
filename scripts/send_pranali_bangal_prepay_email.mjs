import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";

if (!BREVO_API_KEY) {
  console.error("Missing BREVO_API_KEY in .env.local");
  process.exit(1);
}

const customer = {
  orderId: "enPFvmMvJwgU2e8sxsPk",
  paymentId: "pay_TzLT3kLi3IgitH",
  customerName: "Pranali Bangal",
  phone: "8104637689",
  email: "pranalibangal2893@gmail.com",
  adminEmail: "littlecodr@gmail.com",
  address: "Flat no 102 D wing M building new mhb colony, Near Ashtavinayak nagar borivali west, Mumbai, Maharashtra 400092",
  cityHighlight: "Borivali West, Mumbai (400092)",
  itemsText: "1x Pure A2 Gir Cow Ghee 2.5 Litre (Family Bilona Tub)",
  freeGifts: [
    "1x Cold-Pressed Groundnut Oil (250 ml) — 🎁 COMPLIMENTARY GIFT",
    "1x Cold-Pressed Yellow Mustard Oil (250 ml) — 🎁 COMPLIMENTARY GIFT",
    "1x Traditional Kachi Ghani Mustard Oil (250 ml) — 🎁 COMPLIMENTARY GIFT"
  ],
  totalOrderValue: "2,679.10",
  advancePaid: "250.00",
  doorstepCash: "2,429.10",
  codFeeWaived: "250.00",
  tenPercentDiscount: "218.00",
  totalSavings: "468.00",
  finalPrepayAmount: "1,961.00",
  payUrl: "https://potter-world.com/pay-proxy?order_id=enPFvmMvJwgU2e8sxsPk-PREPAY&txnid=enPFvmMvJwgU2e8sxsPk-PREPAY&amount=1961&firstname=Pranali+Bangal&email=pranalibangal2893%40gmail.com&phone=8104637689&productinfo=Prepay+Upgrade+for+Order+%23enPFvmMvJwgU2e8sxsPk+%28COD+to+Prepaid%29&returnUrl=https%3A%2F%2Fwww.namonarayanaghee.store%2Fapi%2Fconvert-cod-to-prepaid%3ForderId%3DenPFvmMvJwgU2e8sxsPk%26amount%3D1961&cancelUrl=https%3A%2F%2Fwww.namonarayanaghee.store%2Ftrack-order%3ForderId%3DenPFvmMvJwgU2e8sxsPk&brand=namonarayanaghee",
  trackUrl: "https://www.namonarayanaghee.store/track-order?orderId=enPFvmMvJwgU2e8sxsPk&phone=8104637689&prepay=true"
};

function generateEmailHtml() {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Pranali ji, Prepay &amp; Save ₹468 Instantly on Your 2.5L Pure Gir Cow Ghee (Order #${customer.orderId})</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #24211E;">

  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #FAF8F2; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Namaste Pranali ji, your 2.5L Vedic Ghee consignment for Borivali West is confirmed. Save ₹468 instantly and eliminate doorstep cash hassle by paying ₹1,961 online before morning dispatch.
  </div>

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F2" style="background-color: #FAF8F2; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 22px rgba(104, 25, 29, 0.08); border: 1px solid #EAD7BC;">

          <!-- Top Brand Header -->
          <tr>
            <td bgcolor="#68191D" style="background: linear-gradient(135deg, #68191D 0%, #4E1013 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #C5A16B;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://www.namonarayanaghee.store/assets/logo.png" alt="Namo Narayana" width="105" style="display: block; border: 0; max-width: 105px; height: auto; margin-bottom: 8px;" />
                    <div style="font-size: 21px; font-weight: 800; color: #FFFFFF; letter-spacing: 1.5px; text-transform: uppercase;">NAMO NARAYANA</div>
                    <div style="font-size: 11px; letter-spacing: 2.5px; color: #F5BD47; text-transform: uppercase; font-weight: 700; margin-top: 4px;">Pure A2 Gir Cow Vedic Bilona Ghee</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Priority Status Strip -->
          <tr>
            <td bgcolor="#FFF8EE" style="background-color: #FFF8EE; padding: 14px 24px; border-bottom: 1px solid #F0E2D0;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #2E7D32; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ✓ ADVANCE BOOKING CONFIRMED (₹250 PAID)
                    </span>
                    <div style="font-size: 14px; font-weight: 700; color: #68191D; margin-top: 5px;">
                      Order ID: #${customer.orderId}
                    </div>
                  </td>
                  <td align="right" style="font-size: 12px; color: #7A4A3B;">
                    <strong>Destination: ${customer.cityHighlight}</strong><br />
                    Prepay Privilege: <span style="color: #2E7D32; font-weight: 800;">₹468 OFF</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Letter Body -->
          <tr>
            <td style="padding: 30px 28px 20px 28px; line-height: 1.65; color: #3A2F2D; font-size: 15px;">
              
              <div style="font-size: 20px; font-weight: 800; color: #68191D; margin-bottom: 14px;">
                Namaste Pranali Ji 🙏
              </div>

              <p style="margin: 0 0 16px 0; color: #4A352F;">
                Thank you for your trusted order with <strong>Namo Narayana</strong>. We have received your ₹250 advance booking payment (Payment ID: <code style="background-color: #F8F5EE; padding: 2px 5px; border-radius: 4px; font-size: 12px; color: #68191D;">${customer.paymentId}</code>).
              </p>

              <p style="margin: 0 0 18px 0; color: #4A352F;">
                Your <strong>2.5 Litre Family Pack of Pure A2 Gir Cow Vedic Ghee</strong> along with your <strong>3 Free Cold-Pressed Oil bottles</strong> is currently being double-checked, hermetically sealed, and secured with multi-layered shockproof packaging at our dispatch station.
              </p>

              <p style="margin: 0 0 20px 0; color: #4A352F;">
                Under your current Cash on Delivery booking, a cash balance of <strong>₹${customer.doorstepCash}</strong> is scheduled to be collected at your doorstep in Borivali West.
              </p>

              <!-- Irresistible Prepay & Psychological Breakdown Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #FFFDF9 0%, #FFF5E1 100%); border: 2px dashed #C5A16B; border-radius: 12px; margin: 22px 0;">
                <tr>
                  <td style="padding: 22px 24px;">
                    <div style="font-size: 11px; font-weight: 800; color: #8A1B14; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                      ⚡ EXCLUSIVE PREPAY PRIVILEGE — SAVE ₹468 BEFORE MORNING DISPATCH:
                    </div>
                    <div style="font-size: 18px; font-weight: 800; color: #68191D; margin-bottom: 12px;">
                      Why 87% of Mumbai Customers Switch to Online Prepay:
                    </div>
                    
                    <div style="font-size: 13.5px; color: #5A3F33; line-height: 1.7;">
                      • <strong>Eliminate Doorstep Cash Headaches:</strong> Delivery executives in Mumbai rarely carry change for large amounts like ₹2,429. Having exact cash ready when the doorbell rings at Flat 102 can lead to stressful delays, awkward arguments, or failed delivery attempts.<br /><br />
                      • <strong>100% Smooth Contactless Delivery:</strong> If you are busy at work, stepping out, or running errands, anyone in your household, your neighbors, or society security at New MHB Colony can seamlessly receive your parcel without having to pay a single rupee.<br /><br />
                      • <strong>VIP Express Priority Courier:</strong> Prepaid orders bypass standard COD processing queues and are immediately assigned to our <strong>Fast-Track Air Courier (Bluedart/Delhivery)</strong> with priority transit insurance.<br /><br />
                      • <strong>Immediate ₹468 Cash Savings:</strong> Pay right now and we will instantly waive the <strong>₹250 COD handling fee</strong> PLUS grant you an <strong>extra 10% instant prepay discount (₹218 OFF)</strong>!
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Prepay Savings Breakdown Table -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF6EF; border: 1px solid #EAD7BC; border-radius: 10px; margin: 24px 0; overflow: hidden;">
                <tr>
                  <td colspan="2" style="padding: 13px 18px; background-color: #F2E8D7; border-bottom: 1px solid #EAD7BC; font-weight: 700; color: #68191D; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                    💰 Your Live Prepay Math (Order #${customer.orderId})
                  </td>
                </tr>
                <tr>
                  <td style="padding: 11px 18px; color: #6E5D57; font-size: 13.5px; border-bottom: 1px solid #F0E4D4;">
                    Doorstep Cash to Collect:
                  </td>
                  <td align="right" style="padding: 11px 18px; color: #888888; font-size: 14px; text-decoration: line-through; border-bottom: 1px solid #F0E4D4;">
                    ₹${customer.doorstepCash}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 11px 18px; color: #2E7D32; font-size: 13.5px; font-weight: 600; border-bottom: 1px solid #F0E4D4;">
                    ✓ ₹250 COD Handling Surcharge Waived:
                  </td>
                  <td align="right" style="padding: 11px 18px; color: #2E7D32; font-size: 13.5px; font-weight: 700; border-bottom: 1px solid #F0E4D4;">
                    −₹${customer.codFeeWaived}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 11px 18px; color: #2E7D32; font-size: 13.5px; font-weight: 600; border-bottom: 1px solid #F0E4D4;">
                    ✓ Extra 10% Instant Prepay Privilege:
                  </td>
                  <td align="right" style="padding: 11px 18px; color: #2E7D32; font-size: 13.5px; font-weight: 700; border-bottom: 1px solid #F0E4D4;">
                    −₹${customer.tenPercentDiscount}
                  </td>
                </tr>
                <tr bgcolor="#FFF2D6">
                  <td style="padding: 16px 18px; color: #68191D; font-size: 15px; font-weight: 800;">
                    You Pay Online Right Now:
                  </td>
                  <td align="right" style="padding: 16px 18px; color: #8A1B14; font-size: 21px; font-weight: 900;">
                    ₹${customer.finalPrepayAmount}
                    <div style="font-size: 11.5px; color: #2E7D32; font-weight: 700; margin-top: 2px;">
                      (You Save ₹${customer.totalSavings} Direct Cash!)
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Big Primary CTA Button -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="${customer.payUrl}" target="_blank" style="display: block; background: linear-gradient(135deg, #8A1B14 0%, #68191D 100%); color: #FFFFFF; font-size: 16px; font-weight: 800; text-decoration: none; padding: 18px 28px; border-radius: 12px; box-shadow: 0 4px 18px rgba(104, 25, 29, 0.35); border: 2px solid #C5A16B; text-align: center; letter-spacing: 0.3px;">
                      ⚡ Pay ₹${customer.finalPrepayAmount} Online &amp; Save ₹${customer.totalSavings} Instantly →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <span style="font-size: 11.5px; color: #7A6560;">
                      🔒 100% Secure Checkout via UPI, Google Pay, PhonePe, Cards, NetBanking • Doorstep balance turns ₹0.00
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Order Summary Section -->
              <div style="border-top: 1px solid #EAD7BC; margin-top: 25px; padding-top: 20px;">
                <div style="font-size: 14px; font-weight: 700; color: #68191D; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                  📦 Your Reserved Consignment Summary:
                </div>

                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.6; color: #3A2F2D;">
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top; width: 35%;"><strong>Main Item:</strong></td>
                    <td style="padding: 6px 0; color: #68191D; font-weight: 700;">${customer.itemsText}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>3x Free Luxury Oils:</strong></td>
                    <td style="padding: 6px 0; color: #2E7D32; font-weight: 600;">
                      ${customer.freeGifts.join("<br />")}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Delivery Address:</strong></td>
                    <td style="padding: 6px 0;">${customer.address}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Registered Mobile:</strong></td>
                    <td style="padding: 6px 0;">+91 ${customer.phone}</td>
                  </tr>
                </table>
              </div>

              <!-- Secondary Website Track Link -->
              <p style="margin: 25px 0 0 0; font-size: 13px; color: #5C4A45; text-align: center;">
                You can also view your live shipment tracker or convert to prepaid on our store anytime:<br />
                <a href="${customer.trackUrl}" target="_blank" style="color: #68191D; font-weight: 700; text-decoration: underline;">
                  View &amp; Track Order #${customer.orderId} on Store →
                </a>
              </p>

              <!-- Dispatch Notice & Scarcity Note -->
              <div style="background-color: #FFF9F2; border-left: 4px solid #C5A16B; padding: 14px 18px; margin-top: 25px; border-radius: 4px; font-size: 12.5px; color: #68483B; line-height: 1.55;">
                ⏰ <strong>Dispatch Notice:</strong> This ₹468 discount waiver is active until our morning courier handover manifest is finalized. Once the physical COD invoice is sealed, courier policy requires the full ₹2,429 cash to be collected at delivery.
              </div>

            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td bgcolor="#F8F5EE" style="background-color: #F8F5EE; padding: 24px 28px; text-align: center; border-top: 1px solid #EAD7BC; font-size: 12px; color: #7A6B66; line-height: 1.6;">
              <div style="font-weight: 700; color: #68191D; font-size: 13px; margin-bottom: 4px;">
                Namo Narayana — Pure A2 Gir Cow Vedic Ghee
              </div>
              Traditional Bilona Churned from Curd of Grass-Fed Gir Cows • Zero Additives • 100% Glass Jar Packaging<br />
              FSSAI Lic. No. 20824005000185<br /><br />
              Need assistance? Simply reply to this email or reach us at <a href="mailto:support@namonarayanaghee.store" style="color: #68191D; font-weight: 600;">support@namonarayanaghee.store</a>.<br />
              © ${new Date().getFullYear()} Namo Narayana. All rights reserved.
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
  return `NAMO NARAYANA — PURE A2 GIR COW VEDIC BILONA GHEE
Order #${customer.orderId} Confirmed (₹250 Advance Received)

Namaste ${customer.customerName} Ji 🙏

Thank you for choosing Namo Narayana. We have received your ₹250 advance booking payment (Payment ID: ${customer.paymentId}).

Your 2.5 Litre Family Pack of Pure A2 Gir Cow Vedic Ghee along with your 3 FREE Cold-Pressed Oil bottles is being packed at our dispatch station.

Under your current Cash on Delivery booking, a cash balance of ₹${customer.doorstepCash} is scheduled to be collected at your doorstep in Borivali West, Mumbai.

=======================================================
⚡ PREPAY PRIVILEGE: SAVE ₹468 INSTANTLY BEFORE MORNING DISPATCH
=======================================================

Why 87% of Mumbai customers switch to prepaid online:
1. No Change Hassle: Courier agents rarely carry loose change for ₹2,429. Having exact cash ready can lead to delayed deliveries.
2. Contactless & Easy: If you are out, anyone at home or society security at New MHB Colony can receive your package with zero cash required.
3. Priority Air Dispatch: Prepaid parcels get fast-track air courier allocation and priority handling.
4. Direct ₹468 Savings: We waive the ₹250 COD fee AND give you an extra 10% instant prepay discount!

YOUR DISCOUNT BREAKDOWN:
- Doorstep Cash Balance: ₹${customer.doorstepCash}
- ₹250 COD Fee Waived: -₹${customer.codFeeWaived}
- Extra 10% Prepay Privilege: -₹${customer.tenPercentDiscount}
-------------------------------------------------------
YOU PAY ONLINE RIGHT NOW: ₹${customer.finalPrepayAmount}
(You Save ₹${customer.totalSavings} Cash!)

PAY ₹1,961 ONLINE & SAVE ₹468 NOW:
${customer.payUrl}

Or track your shipment and prepay on our store:
${customer.trackUrl}

CONSIGNMENT SUMMARY:
- Item: ${customer.itemsText}
- Free Gifts: 3x 250ml Premium Cold-Pressed Oils (Groundnut, Yellow Mustard, Mustard)
- Delivery Address: ${customer.address}
- Contact Phone: +91 ${customer.phone}

Notice: This ₹468 savings offer is valid prior to morning courier dispatch manifest printing. Once sealed, courier policy requires physical collection of ₹2,429 cash.

Warm regards,
Namo Narayana Customer Care
support@namonarayanaghee.store | FSSAI Lic. 20824005000185
https://www.namonarayanaghee.store
`;
}

async function sendEmail(toEmail, toName, tag) {
  const subject = `Pranali ji, prepay & save ₹468 on your Pure Gir Cow Ghee 2.5L consignment (Order #${customer.orderId})`;
  const htmlContent = generateEmailHtml();
  const textContent = generatePlainText();

  const payload = {
    sender: { name: "Namo Narayana Support", email: SENDER_EMAIL },
    to: [{ email: toEmail, name: toName }],
    replyTo: { name: "Namo Narayana Support", email: "support@namonarayanaghee.store" },
    subject,
    htmlContent,
    textContent,
    headers: {
      "X-Mailin-Tag": tag,
      "Auto-Submitted": "auto-generated"
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
  console.log("Preparing to dispatch prepay conversion email for Pranali Bangal via Brevo...");

  // 1. Send to Customer
  console.log(`\n1. Sending to Customer: ${customer.email} (${customer.customerName})...`);
  const custResult = await sendEmail(customer.email, customer.customerName, "prepay-conversion-pranali");
  console.log("✓ Customer email dispatched successfully:", custResult);

  // 2. Send identical copy to Admin (littlecodr@gmail.com) for verification
  console.log(`\n2. Sending identical copy to Admin: ${customer.adminEmail}...`);
  const adminResult = await sendEmail(customer.adminEmail, "Little Codr (Admin Verification)", "prepay-conversion-pranali-admin");
  console.log("✓ Admin verification copy dispatched successfully:", adminResult);

  console.log("\n=======================================================");
  console.log(`BOTH EMAILS SUCCESSFULLY SENT VIA BREVO!`);
  console.log(`Message IDs: Customer [${custResult.messageId}], Admin [${adminResult.messageId}]`);
  console.log("=======================================================");
}

main().catch(err => {
  console.error("Error executing script:", err);
  process.exit(1);
});
