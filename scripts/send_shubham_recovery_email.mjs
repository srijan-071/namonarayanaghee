import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";

if (!BREVO_API_KEY) {
  console.error("Missing BREVO_API_KEY in .env.local");
  process.exit(1);
}

const customer = {
  name: "Shubham Jaiswal",
  orderId: "sL50hRxpOhHhkhEEkHuG",
  phone: "9140694780",
  email: "shubham498198@gmail.com",
  address: "554kha/426a, Sri Nagar Colony, Singar Nagar, Alambagh, Near behind BN Lal, Lucknow, Uttar Pradesh 226005",
  product: "Pure A2 Gir Cow Ghee (5 Litre Mega Pack)",
  freeGifts: [
    "Wood-Pressed Coconut Oil (250 ml)",
    "Cold-Pressed Groundnut Oil (250 ml)",
    "Traditional Kachi Ghani Mustard Oil (500 ml)"
  ],
  subtotal: "3,499.00",
  tenPercentDiscount: "349.90",
  prepaidDiscount: "100.00",
  codFeeSaved: "250.00",
  totalPayable: "3,049.10",
  totalSavings: "699.90",
  payUrl: "https://potter-world.com/pay-proxy?order_id=sL50hRxpOhHhkhEEkHuG&txnid=sL50hRxpOhHhkhEEkHuG&amount=3049.10&firstname=shubham+jaiswal&email=shubham498198%40gmail.com&phone=9140694780&productinfo=Order+sL50hRxpOhHhkhEEkHuG+%28Prepaid%29&embed=true&returnUrl=https%3A%2F%2Fnamonarayanaghee.store%2Fapi%2Frazorpay%2Fcallback&cancelUrl=https%3A%2F%2Fnamonarayanaghee.store%2Fcheckout&brand=namonarayanaghee",
  storeUrl: "https://www.namonarayanaghee.store/track-order?orderId=sL50hRxpOhHhkhEEkHuG"
};

function generateEmailHtml() {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Shubham ji, your 5L A2 Vedic Ghee is held for Lucknow dispatch</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #24211E;">

  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #FAF8F2; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Namaste Shubham ji, your 5L Pure A2 Gir Cow Ghee + 3 Free Cold-Pressed Oils (₹3,049 locked price) are reserved for Lucknow dispatch. Complete in 1 click.
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
                    <span style="display: inline-block; background-color: #8A1B14; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ⏳ RESERVED PARCEL • AWAITING COMPLETION
                    </span>
                    <div style="font-size: 14px; font-weight: 700; color: #5E0B10; margin-top: 5px;">
                      Order ID: #${customer.orderId}
                    </div>
                  </td>
                  <td align="right" style="font-size: 12px; color: #7A4A3B;">
                    <strong>Destination: Lucknow (226005)</strong><br />
                    Locked Discount: ₹${customer.totalSavings} OFF
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Letter Body -->
          <tr>
            <td style="padding: 30px 28px 20px 28px; line-height: 1.65; color: #3A2F2D; font-size: 15px;">
              
              <div style="font-size: 20px; font-weight: 800; color: #5E0B10; margin-bottom: 14px;">
                Namaste Shubham Ji 🙏
              </div>

              <p style="margin: 0 0 16px 0; color: #4A352F;">
                We noticed you reached the final payment step for your <strong>Pure A2 Gir Cow Ghee (5 Litre Family Tin)</strong> earlier this evening, but the session timed out before the UPI / gateway confirmation went through.
              </p>

              <p style="margin: 0 0 18px 0; color: #4A352F;">
                When investing over ₹3,000 for your household's daily nutrition, it is completely natural to pause and verify. As a family brand that stands uncompromisingly for purity, we want to give you total clarity on why this single tin is the most rewarding health decision you will make for your home this winter.
              </p>

              <!-- The Value & Quality Breakdown Card -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #FFFDF9 0%, #FFF5E1 100%); border: 2px dashed #D4A017; border-radius: 12px; margin: 22px 0;">
                <tr>
                  <td style="padding: 22px 24px;">
                    <div style="font-size: 11px; font-weight: 800; color: #8A1B14; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                      ✨ What Makes This 5 Litre Tin Truly Rare:
                    </div>
                    <div style="font-size: 17px; font-weight: 800; color: #5E0B10; margin-bottom: 12px;">
                      Over 130+ Litres of Fresh Milk in One Jar
                    </div>
                    
                    <div style="font-size: 13.5px; color: #5A3F33; line-height: 1.65;">
                      • <strong>True Vedic Bilona Process:</strong> Not industrial machine butter boiled down in minutes. Whole A2 Gir cow milk is boiled, set into thick curd overnight, and hand-churned bi-directionally with wooden bilonas before the makhan is slow-simmered on low wood flame.<br /><br />
                      • <strong>Winter Joint &amp; Gut Immunity:</strong> Rich in natural butyric acid, fat-soluble vitamins (A, D, E, K2), and CLA. Essential for protecting elderly parents' joints and building lasting stamina during North India's colder months.<br /><br />
                      • <strong>Honest Economics (Under ₹610 / Litre):</strong> Commercial market brands sell adulterated buffalo butter oil for ₹800–₹1,000/L. At your locked price of <strong>₹3,049.10</strong> for 5 Litres, authentic Vedic Ghee costs you barely <strong>₹609/L</strong>—less than ₹25 a day for your entire family's cooking!
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Complimentary Gifts Banner -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F0F9F1; border: 1px solid #C8E6C9; border-radius: 10px; margin: 18px 0; padding: 14px 18px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 800; color: #2E7D32; text-transform: uppercase; margin-bottom: 6px;">
                      🎁 3 Complimentary Full-Sized Gifts Held in Your Box (Worth ₹650+ Free):
                    </div>
                    <div style="font-size: 13px; color: #1B5E20; line-height: 1.6;">
                      1. <strong>Wood-Pressed Coconut Oil (250 ml)</strong> — Pure edible cold-press<br />
                      2. <strong>Cold-Pressed Groundnut Oil (250 ml)</strong> — Traditional aroma &amp; purity<br />
                      3. <strong>Kachi Ghani Mustard Oil (500 ml)</strong> — Pungent authentic Sarson tel
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Pricing Math Breakdown Table -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF6EF; border: 1px solid #EAD7BC; border-radius: 10px; margin: 24px 0; overflow: hidden;">
                <tr>
                  <td colspan="2" style="padding: 12px 18px; background-color: #F2E8D7; border-bottom: 1px solid #EAD7BC; font-weight: 700; color: #5E0B10; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                    🏷️ Your Locked Order Pricing (Order #${customer.orderId})
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; color: #6E5D57; font-size: 13px; border-bottom: 1px solid #F0E4D4;">
                    5 Litre Vedic A2 Gir Cow Ghee:
                  </td>
                  <td align="right" style="padding: 10px 18px; color: #4A352F; font-size: 13px; font-weight: 600; border-bottom: 1px solid #F0E4D4;">
                    ₹${customer.subtotal}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; color: #2E7D32; font-size: 13px; font-weight: 600; border-bottom: 1px solid #F0E4D4;">
                    ✓ 10% Instant Festive Privilege:
                  </td>
                  <td align="right" style="padding: 10px 18px; color: #2E7D32; font-size: 13px; font-weight: 700; border-bottom: 1px solid #F0E4D4;">
                    −₹${customer.tenPercentDiscount}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; color: #2E7D32; font-size: 13px; font-weight: 600; border-bottom: 1px solid #F0E4D4;">
                    ✓ Extra 1-Click Prepaid Rebate:
                  </td>
                  <td align="right" style="padding: 10px 18px; color: #2E7D32; font-size: 13px; font-weight: 700; border-bottom: 1px solid #F0E4D4;">
                    −₹${customer.prepaidDiscount}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; color: #2E7D32; font-size: 13px; font-weight: 600; border-bottom: 1px solid #F0E4D4;">
                    ✓ 3 Free Cold-Pressed Oils:
                  </td>
                  <td align="right" style="padding: 10px 18px; color: #2E7D32; font-size: 13px; font-weight: 800; border-bottom: 1px solid #F0E4D4;">
                    FREE (Saved ₹650+)
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; color: #2E7D32; font-size: 13px; font-weight: 600; border-bottom: 1px solid #F0E4D4;">
                    ✓ Doorstep COD Surcharge Waived:
                  </td>
                  <td align="right" style="padding: 10px 18px; color: #2E7D32; font-size: 13px; font-weight: 700; border-bottom: 1px solid #F0E4D4;">
                    Saved ₹${customer.codFeeSaved}
                  </td>
                </tr>
                <tr bgcolor="#FFF2D6">
                  <td style="padding: 16px 18px; color: #5E0B10; font-size: 15px; font-weight: 800;">
                    Total Final Amount:
                  </td>
                  <td align="right" style="padding: 16px 18px; color: #8A1B14; font-size: 20px; font-weight: 900;">
                    ₹${customer.totalPayable}
                    <div style="font-size: 11px; color: #2E7D32; font-weight: 700; margin-top: 2px;">
                      (You Save ₹${customer.totalSavings} + Free Oils)
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Big Primary CTA Button -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="${customer.payUrl}" target="_blank" style="display: block; background: linear-gradient(135deg, #8A1B14 0%, #5E0B10 100%); color: #FFFFFF; font-size: 16px; font-weight: 800; text-decoration: none; padding: 18px 28px; border-radius: 12px; box-shadow: 0 4px 16px rgba(138, 27, 20, 0.35); border: 2px solid #D4A017; text-align: center; letter-spacing: 0.3px;">
                      ⚡ Complete Order Now for ₹${customer.totalPayable} →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <span style="font-size: 11px; color: #7A6560;">
                      🔒 Instant 256-Bit Razorpay Gateway • Supports Google Pay, PhonePe, Paytm, UPI &amp; Cards
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Transit Protection & Safe Delivery to Lucknow -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #FDFCF9; border-radius: 8px; padding: 14px 18px; border: 1px solid #EFE8DA;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; color: #5E0B10; text-transform: uppercase; margin-bottom: 6px;">
                      📍 Your Confirmed Delivery Details:
                    </div>
                    <div style="font-size: 13px; color: #4A352F; line-height: 1.6;">
                      <strong>Recipient:</strong> ${customer.name} (+91 ${customer.phone})<br />
                      <strong>Address:</strong> ${customer.address}<br />
                      <strong>Packaging:</strong> Heavy-duty shockproof thermal cushioning for safe Lucknow arrival.<br />
                      <strong>Zero Risk:</strong> If any jar arrives damaged in transit, we provide immediate free replacement.
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 13px; color: #5C4A45; text-align: center;">
                Need to view or modify your order? You can also access it on our official store:<br />
                <a href="${customer.storeUrl}" target="_blank" style="color: #8A1B14; font-weight: 700; text-decoration: underline;">
                  Track Order #${customer.orderId} on Store →
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

function generatePlainText() {
  return `NAMO NARAYANA - PURE A2 GIR COW VEDIC BILONA GHEE
Order #${customer.orderId} - Reserved for Shubham Jaiswal (Lucknow)
--------------------------------------------------------------------------------

Namaste Shubham Ji,

We noticed you reached the final payment step for your Pure A2 Gir Cow Ghee (5 Litre Family Tin) earlier this evening, but the session timed out before the UPI / gateway confirmation went through.

When investing over ₹3,000 for your household's daily nutrition, it is completely natural to pause and evaluate. As a family brand that stands uncompromisingly for purity, here is why this single tin is the most rewarding health decision you will make for your home this winter:

1. THE VEDIC BILONA METHOD (NOT INDUSTRIAL BUTTER):
Whole milk from indigenous grass-fed Gir cows is boiled, set into thick curd overnight, and churned bi-directionally with wooden bilonas. Over 130+ Litres of pure milk go into crafting this single 5L tin.

2. WINTER IMMUNITY FOR PARENTS & CHILDREN:
Rich in natural butyric acid, fat-soluble vitamins (A, D, E, K2), and healthy CLA. Essential for joint lubrication, smooth digestion, and cold resistance across North India's winter.

3. UNMATCHED ECONOMICS (UNDER ₹610 / LITRE):
Commercial adulterated butter oil sells in stores for ₹800–₹1,000/L. At your locked price of ₹3,049.10 for 5 Litres, authentic Vedic Ghee costs you barely ₹609/L—less than ₹25 a day for your family!

--------------------------------------------------------------------------------
🏷️ YOUR LOCKED ORDER BREAKDOWN:
--------------------------------------------------------------------------------
• 5L Pure A2 Gir Cow Ghee: Rs. ${customer.subtotal}
• 10% Instant Festive Discount: -Rs. ${customer.tenPercentDiscount}
• Extra 1-Click Prepaid Rebate: -Rs. ${customer.prepaidDiscount}
• 3 Free Cold-Pressed Oils: FREE (Saved Rs. 650+)
  1) Wood-Pressed Coconut Oil (250ml) - FREE
  2) Cold-Pressed Groundnut Oil (250ml) - FREE
  3) Kachi Ghani Mustard Oil (500ml) - FREE
• Doorstep COD Fee: Waived (Saved Rs. ${customer.codFeeSaved})
--------------------------------------------------------------------------------
TOTAL AMOUNT PAYABLE: Rs. ${customer.totalPayable} (You Save Rs. ${customer.totalSavings} + Free Oils)
--------------------------------------------------------------------------------

Click below to complete your order in 1 click via Google Pay, PhonePe, Paytm, UPI or Card:
${customer.payUrl}

Or view and track your order on our store:
${customer.storeUrl}

Delivery Address:
${customer.address}

Need any assistance? Reply directly to this email or write to support@namonarayanaghee.store.

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
    subject: `Shubham ji, your 5L A2 Vedic Ghee (+ 3 Free Cold-Pressed Oils) is held for Lucknow dispatch (Order #${customer.orderId})`,
    htmlContent: generateEmailHtml(),
    textContent: generatePlainText(),
    headers: {
      "X-Mailin-Tag": "cart-recovery-5l",
      "Auto-Submitted": "auto-generated",
      "X-Entity-Ref-ID": customer.orderId
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
  console.log("Preparing to dispatch high-converting recovery email for Shubham Jaiswal via Brevo...");

  // 1. Send to Customer
  console.log(`\n1. Sending to Customer: ${customer.email} (${customer.name})...`);
  const custResult = await sendEmail(customer.email, customer.name);
  console.log("✓ Customer email dispatched successfully:", custResult);

  // 2. Send identical copy to Admin (littlecodr@gmail.com) with zero admin verification branding
  console.log(`\n2. Sending identical copy to Admin: littlecodr@gmail.com...`);
  const adminResult = await sendEmail("littlecodr@gmail.com", customer.name);
  console.log("✓ Admin copy dispatched successfully:", adminResult);

  console.log("\nAll recovery emails dispatched successfully via Brevo!");
}

main().catch(err => {
  console.error("Error executing recovery script:", err);
  process.exit(1);
});

