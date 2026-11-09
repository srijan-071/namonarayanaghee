import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";

if (!BREVO_API_KEY) {
  console.error("Missing BREVO_API_KEY in .env.local");
  process.exit(1);
}

// TARGET: As instructed by user, send ONLY to littlecodr@gmail.com for verification first!
const ADMIN_VERIFICATION_EMAIL = "littlecodr@gmail.com";

const order1_komal = {
  orderId: "KNssTjYEFkgcQaxA6lLT",
  customerName: "Komal Singh",
  phone: "9262610266",
  customerEmail: "komalsingh04227@gmail.com",
  address: "Khusipur, Near The Kashi Paradise nearby, Varanasi, Uttar Pradesh 221011",
  itemsText: "1x Pure A2 Gir Cow Ghee 1 Litre (Flagship Bilona Pack)",
  freeGifts: [
    "1x Traditional Kachi Ghani Mustard Oil (250 ml) — 🎁 COMPLIMENTARY GIFT"
  ],
  totalOrderValue: "1,199.00",
  advancePaid: "250.00",
  doorstepCash: "949.00",
  codFeeWaived: "250.00",
  tenPercentDiscount: "70.00",
  totalSavings: "320.00",
  finalPrepayAmount: "629.00",
  // Paying button links to our website loader on namonarayanaghee.store, NOT directly to potter-world.com
  payUrl: "https://www.namonarayanaghee.store/pay-proxy?orderId=KNssTjYEFkgcQaxA6lLT&amount=629&name=Komal+Singh&email=komalsingh04227%40gmail.com&phone=9262610266&productinfo=Prepay+Upgrade+Order+%23KNssTjYEFkgcQaxA6lLT&action=prepay",
  trackUrl: "https://www.namonarayanaghee.store/track-order?orderId=KNssTjYEFkgcQaxA6lLT&phone=9262610266&prepay=true"
};

const order2_himanshu = {
  orderId: "LZXfsCUL3G2Rj6woZnXA",
  customerName: "Himanshu singh",
  phone: "7542812805",
  customerEmail: "komalsingh04227@gmail.com",
  address: "Sasaram st paul School, Near Dk hotel in, Rohtas, Bihar 821113",
  itemsText: "2x Pure A2 Gir Cow Ghee 2.5 Litre (5 Litres Total Mega Family Pack)",
  freeGifts: [
    "2x Cold-Pressed Groundnut Oil (250 ml each) — 🎁 COMPLIMENTARY GIFT",
    "2x Cold-Pressed Yellow Mustard Oil (250 ml each) — 🎁 COMPLIMENTARY GIFT",
    "2x Traditional Kachi Ghani Mustard Oil (250 ml each) — 🎁 COMPLIMENTARY GIFT"
  ],
  totalOrderValue: "4,028.20",
  advancePaid: "250.00",
  doorstepCash: "3,778.20",
  codFeeWaived: "250.00",
  tenPercentDiscount: "353.20",
  totalSavings: "603.20",
  finalPrepayAmount: "3,175.00",
  // Paying button links to our website loader on namonarayanaghee.store, NOT directly to potter-world.com
  payUrl: "https://www.namonarayanaghee.store/pay-proxy?orderId=LZXfsCUL3G2Rj6woZnXA&amount=3175&name=Himanshu+singh&email=komalsingh04227%40gmail.com&phone=7542812805&productinfo=Prepay+Upgrade+Order+%23LZXfsCUL3G2Rj6woZnXA&action=prepay",
  trackUrl: "https://www.namonarayanaghee.store/track-order?orderId=LZXfsCUL3G2Rj6woZnXA&phone=7542812805&prepay=true"
};

function generateEmailHtml(order, cityHighlight, spiritualOrFamilyAngle) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>${order.customerName} ji, prepay &amp; save ₹${order.totalSavings} on Order #${order.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #24211E;">

  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #FAF8F2; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Namaste ${order.customerName} ji, your consignment for ${cityHighlight} is confirmed. Save ₹${order.totalSavings} and avoid doorstep cash hassle by prepaying online.
  </div>

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F2" style="background-color: #FAF8F2; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 22px rgba(94, 11, 16, 0.08); border: 1px solid #EAD7BC;">

          <!-- Top Brand Header -->
          <tr>
            <td bgcolor="#5E0B10" style="background: linear-gradient(135deg, #5E0B10 0%, #8A1B14 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #D4A017;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://www.namonarayanaghee.store/assets/logo.png" alt="Namo Narayana" width="105" style="display: block; border: 0; max-width: 105px; height: auto; margin-bottom: 8px;" />
                    <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; letter-spacing: 1.5px; text-transform: uppercase;">NAMO NARAYANA</div>
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
                    <span style="display: inline-block; background-color: #2E7D32; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ✓ ADVANCE BOOKING CONFIRMED (₹250 PAID)
                    </span>
                    <div style="font-size: 14px; font-weight: 700; color: #5E0B10; margin-top: 5px;">
                      Order ID: #${order.orderId}
                    </div>
                  </td>
                  <td align="right" style="font-size: 12px; color: #7A4A3B;">
                    <strong>Destination: ${cityHighlight}</strong><br />
                    Prepay &amp; Save: <span style="color: #2E7D32; font-weight: 800;">₹${order.totalSavings} OFF</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Letter Body -->
          <tr>
            <td style="padding: 30px 28px 20px 28px; line-height: 1.65; color: #3A2F2D; font-size: 15px;">
              
              <div style="font-size: 20px; font-weight: 800; color: #5E0B10; margin-bottom: 14px;">
                Namaste ${order.customerName} Ji 🙏
              </div>

              <p style="margin: 0 0 16px 0; color: #4A352F;">
                Thank you for placing your order with <strong>Namo Narayana</strong>. We have received your ₹250 booking advance, and your freshly churned parcel is currently being secured with protective shockproof packaging at our Vedic Gaushala dispatch line.
              </p>

              <p style="margin: 0 0 18px 0; color: #4A352F;">
                As your order was booked under Cash on Delivery, a remaining balance of <strong>₹${order.doorstepCash}</strong> is currently scheduled to be collected in physical cash at your doorstep upon arrival.
              </p>

              <!-- Psychological Reason to Prepay Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #FFFDF9 0%, #FFF5E1 100%); border: 2px dashed #D4A017; border-radius: 12px; margin: 22px 0;">
                <tr>
                  <td style="padding: 22px 24px;">
                    <div style="font-size: 11px; font-weight: 800; color: #8A1B14; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                      ⚡ WHY EXPERIENCED CUSTOMERS CHOOSE TO PREPAY NOW:
                    </div>
                    <div style="font-size: 17px; font-weight: 800; color: #5E0B10; margin-bottom: 10px;">
                      Save ₹${order.totalSavings} Instantly + Zero Doorstep Hassle
                    </div>
                    
                    <div style="font-size: 13.5px; color: #5A3F33; line-height: 1.65;">
                      ${spiritualOrFamilyAngle}<br /><br />
                      • <strong>The Cash Change Problem:</strong> Delivery riders often do not carry change for ₹500 or ₹100 notes, leading to delayed deliveries, awkward disputes, or missed handovers.<br /><br />
                      • <strong>Contactless Handover:</strong> If you are busy, at work, or away from home, anyone in your family or your neighbors can receive your pure ghee without having to worry about paying cash.<br /><br />
                      • <strong>Instant ₹${order.totalSavings} Direct Savings:</strong> When you convert to prepaid before delivery, we waive the entire ₹250 COD courier handling fee PLUS apply an extra 10% instant discount!
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Prepay Savings Breakdown Table -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF6EF; border: 1px solid #EAD7BC; border-radius: 10px; margin: 24px 0; overflow: hidden;">
                <tr>
                  <td colspan="2" style="padding: 12px 18px; background-color: #F2E8D7; border-bottom: 1px solid #EAD7BC; font-weight: 700; color: #5E0B10; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                    💰 Your Live Prepay Discount Math (Order #${order.orderId})
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; color: #6E5D57; font-size: 13px; border-bottom: 1px solid #F0E4D4;">
                    Doorstep Cash to Collect:
                  </td>
                  <td align="right" style="padding: 10px 18px; color: #888888; font-size: 14px; text-decoration: line-through; border-bottom: 1px solid #F0E4D4;">
                    ₹${order.doorstepCash}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; color: #2E7D32; font-size: 13px; font-weight: 600; border-bottom: 1px solid #F0E4D4;">
                    ✓ ₹250 COD Handling Fee Waived:
                  </td>
                  <td align="right" style="padding: 10px 18px; color: #2E7D32; font-size: 13px; font-weight: 700; border-bottom: 1px solid #F0E4D4;">
                    −₹${order.codFeeWaived}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; color: #2E7D32; font-size: 13px; font-weight: 600; border-bottom: 1px solid #F0E4D4;">
                    ✓ Extra 10% Instant Prepay Privilege:
                  </td>
                  <td align="right" style="padding: 10px 18px; color: #2E7D32; font-size: 13px; font-weight: 700; border-bottom: 1px solid #F0E4D4;">
                    −₹${order.tenPercentDiscount}
                  </td>
                </tr>
                <tr bgcolor="#FFF2D6">
                  <td style="padding: 16px 18px; color: #5E0B10; font-size: 15px; font-weight: 800;">
                    You Pay Online Right Now:
                  </td>
                  <td align="right" style="padding: 16px 18px; color: #8A1B14; font-size: 20px; font-weight: 900;">
                    ₹${order.finalPrepayAmount}
                    <div style="font-size: 11px; color: #2E7D32; font-weight: 700; margin-top: 2px;">
                      (You Save ₹${order.totalSavings} Cash)
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Big Primary CTA Button: Links to OUR WEBSITE loader on namonarayanaghee.store -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="${order.payUrl}" target="_blank" style="display: block; background: linear-gradient(135deg, #8A1B14 0%, #5E0B10 100%); color: #FFFFFF; font-size: 16px; font-weight: 800; text-decoration: none; padding: 18px 28px; border-radius: 12px; box-shadow: 0 4px 16px rgba(138, 27, 20, 0.35); border: 2px solid #D4A017; text-align: center; letter-spacing: 0.3px;">
                      ⚡ Pay ₹${order.finalPrepayAmount} Online &amp; Save ₹${order.totalSavings} Now →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <span style="font-size: 11px; color: #7A6560;">
                      🔒 Opens Secure Gateway On Our Website • Instant Receipt &amp; Status Updated to ₹0 Cash Due
                    </span>
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
                    <td style="padding: 6px 0; vertical-align: top; width: 35%;"><strong>Item Ordered:</strong></td>
                    <td style="padding: 6px 0; color: #5E0B10; font-weight: 600;">${order.itemsText}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Complimentary Gifts:</strong></td>
                    <td style="padding: 6px 0; color: #2E7D32; font-weight: 600;">
                      ${order.freeGifts.join("<br />")}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Delivery Destination:</strong></td>
                    <td style="padding: 6px 0;">${order.address}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Contact Phone:</strong></td>
                    <td style="padding: 6px 0;">+91 ${order.phone}</td>
                  </tr>
                </table>
              </div>

              <!-- Secondary Website Track Link -->
              <p style="margin: 25px 0 0 0; font-size: 13px; color: #5C4A45; text-align: center;">
                You can also view your live shipment tracker or prepay on our store anytime:<br />
                <a href="${order.trackUrl}" target="_blank" style="color: #8A1B14; font-weight: 700; text-decoration: underline;">
                  View &amp; Track Order #${order.orderId} Online →
                </a>
              </p>

            </td>
          </tr>

          <!-- Footer & Support -->
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

function generatePlainText(order, cityHighlight) {
  return `NAMO NARAYANA - PURE A2 GIR COW VEDIC BILONA GHEE
Order #${order.orderId} Confirmed - Save ₹${order.totalSavings} by Prepaying Online
--------------------------------------------------------------------------------

Namaste ${order.customerName} Ji,

Thank you for placing your order with Namo Narayana! We have received your ₹250 booking advance, and your parcel is currently being secured with protective packaging for dispatch to ${cityHighlight}.

Order ID: #${order.orderId}
Item: ${order.itemsText}
Complimentary Gifts:
${order.freeGifts.map(g => "• " + g).join("\n")}
Delivery Address: ${order.address}
Contact Phone: +91 ${order.phone}

--------------------------------------------------------------------------------
⚡ PREPAY REMAINING BALANCE ONLINE & SAVE ₹${order.totalSavings}!
--------------------------------------------------------------------------------
Avoid the hassle of arranging physical cash change or delivery delays when the rider reaches your doorstep. Prepay online right now to unlock ₹${order.totalSavings} in instant savings:

• Doorstep Cash to Collect: Rs. ${order.doorstepCash}
• COD Handling Charge Waived: -Rs. ${order.codFeeWaived}
• Extra 10% Instant Prepay Privilege: -Rs. ${order.tenPercentDiscount}
--------------------------------------------------------------------------------
TOTAL AMOUNT PAYABLE ONLINE: Rs. ${order.finalPrepayAmount} (You Save Rs. ${order.totalSavings} Cash)
--------------------------------------------------------------------------------

Click below to open our secure checkout and pay Rs. ${order.finalPrepayAmount} via UPI, Google Pay, PhonePe, Paytm or Card:
${order.payUrl}

Or track your live order status on our official store:
${order.trackUrl}

Why Prepaying is Smoother & Recommended:
1. Save an instant ₹${order.totalSavings} directly on your order.
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

async function sendEmailToAdmin(subject, htmlContent, textContent, tag) {
  const payload = {
    sender: { name: "Namo Narayana Care", email: SENDER_EMAIL },
    to: [{ email: ADMIN_VERIFICATION_EMAIL, name: "Mayank (Admin Preview)" }],
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
  console.log("Preparing to dispatch verification copies to littlecodr@gmail.com ONLY...");

  // 1. Email for Komal Singh (Varanasi - 1 Litre Pack)
  const angleKomal = `• <strong>Sacred Purity for Kashi:</strong> Your ghee is crafted strictly using traditional Vedic curd-churning from indigenous Gir cows—ideal for sacred puja, daily Ayurvedic wellness, and satvik diet.<br /><br />• <strong>Honest Economics:</strong> At just ₹629 final prepay balance, you get 1 full Litre of pure Vedic Bilona Ghee PLUS a complimentary 250ml Mustard Oil bottle.`;
  const subjectKomal = `Komal ji, your Pure A2 Gir Cow Ghee (1 Litre) is reserved for Varanasi dispatch — Prepay & Save ₹320 (Order #${order1_komal.orderId})`;
  const htmlKomal = generateEmailHtml(order1_komal, "Varanasi, UP (221011)", angleKomal);
  const textKomal = generatePlainText(order1_komal, "Varanasi, UP");

  console.log(`\nDispatching Order 1 (Komal Singh) preview to ${ADMIN_VERIFICATION_EMAIL}...`);
  const res1 = await sendEmailToAdmin(subjectKomal, htmlKomal, textKomal, "prepay-preview-komal");
  console.log("✓ Order 1 email dispatched to admin:", res1);

  // 2. Email for Himanshu Singh (Rohtas, Bihar - 5 Litres Pack + 6 Free Oils)
  const angleHimanshu = `• <strong>Unmatched Family Value (5 Litres + 6 Free Oils):</strong> You have reserved a substantial 5 Litre family consignment along with 6 complimentary cold-pressed oil bottles (worth ₹1,200+ FREE).<br /><br />• <strong>Eliminate Large Cash Hassle:</strong> Arranging ₹3,778 in exact physical notes at your doorstep is cumbersome and frequently leads to delivery delays or change shortages with courier personnel. Paying ₹3,175 online saves you an instant ₹603 cash!`;
  const subjectHimanshu = `Himanshu ji, your Pure A2 Gir Cow Ghee (5 Litres + 6 Free Oils) is reserved for Rohtas dispatch — Prepay & Save ₹603 (Order #${order2_himanshu.orderId})`;
  const htmlHimanshu = generateEmailHtml(order2_himanshu, "Rohtas, Bihar (821113)", angleHimanshu);
  const textHimanshu = generatePlainText(order2_himanshu, "Rohtas, Bihar");

  console.log(`\nDispatching Order 2 (Himanshu Singh) preview to ${ADMIN_VERIFICATION_EMAIL}...`);
  const res2 = await sendEmailToAdmin(subjectHimanshu, htmlHimanshu, textHimanshu, "prepay-preview-himanshu");
  console.log("✓ Order 2 email dispatched to admin:", res2);

  console.log("\n=======================================================");
  console.log("BOTH VERIFICATION EMAILS DISPATCHED TO littlecodr@gmail.com!");
  console.log("Customer email (komalsingh04227@gmail.com) was NOT sent as instructed.");
  console.log("=======================================================");
}

main().catch(err => {
  console.error("Error executing script:", err);
  process.exit(1);
});
