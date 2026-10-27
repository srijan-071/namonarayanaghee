import fetch from "node-fetch";

const BREVO_API_KEY = process.env.BREVO_API_KEY || "";

function buildEmailHtml({ customerName, orderId, email, phone, address }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Namo Narayana Order #${orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222D23; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text (invisible in body, visible in inbox preview) -->
  <div style="display: none; font-size: 1px; color: #FAF9F5; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Namaste ${customerName}, your 5L Pure A2 Gir Cow Ghee and 3 free oils are reserved. Use code ELVISH10 to complete checkout with 10% off.
  </div>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9F5; padding: 25px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #EAE6DF; box-shadow: 0 4px 20px rgba(30, 58, 36, 0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #1E3A24; padding: 26px 24px; text-align: center; border-bottom: 3px solid #C38936;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <img src="https://www.namonarayanaghee.store/media/Namo_Narayana_Officail_Logo_df30ed.png" alt="Namo Narayana" width="140" style="display: block; max-width: 140px; height: auto; border: 0;" />
                    <p style="margin: 8px 0 0 0; color: #D49A3D; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                      Pure A2 Gir Cow Vedic Bilona Ghee
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 28px 24px 28px;">
              <h1 style="margin: 0 0 14px 0; color: #1E3A24; font-size: 22px; font-weight: 700; line-height: 1.3;">
                Namaste ${customerName} ji,
              </h1>
              
              <p style="margin: 0 0 18px 0; color: #3A4A3B; font-size: 15px; line-height: 1.6;">
                We noticed you recently started placing your order for our <strong>Pure A2 Gir Cow Ghee (5 Litre)</strong>, but the payment was not completed.
              </p>

              <!-- Urgent Reservation Notice / FOMO Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFF9EF; border: 1px solid #F0D5A3; border-left: 4px solid #C38936; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <p style="margin: 0 0 6px 0; color: #8A5610; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                      ⏳ Fresh Bilona Batch Reserved Temporarily
                    </p>
                    <p style="margin: 0; color: #4F3815; font-size: 14px; line-height: 1.5;">
                      Because each batch of our A2 Gir Cow Ghee is hand-churned using traditional Vedic bilona methods in limited quantities, your <strong>5L Tin</strong> and <strong>3 Free Cold-Pressed Oils</strong> are currently held in reserved status. If payment is not completed, this reserved fresh batch will be released to the next waitlisted customer.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Special Discount Code Highlight -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F3F8F4; border: 1.5px dashed #3D7A4D; border-radius: 10px; margin: 24px 0; text-align: center;">
                <tr>
                  <td style="padding: 20px 18px;">
                    <p style="margin: 0 0 8px 0; color: #1E3A24; font-size: 14px; font-weight: 600;">
                      Claim an instant <strong>10% OFF</strong> to complete your order right now:
                    </p>
                    <div style="display: inline-block; background-color: #1E3A24; color: #FFFFFF; font-size: 19px; font-weight: 800; letter-spacing: 2px; padding: 10px 24px; border-radius: 6px; font-family: monospace;">
                      ELVISH10
                    </div>
                    <p style="margin: 8px 0 0 0; color: #576B55; font-size: 12px;">
                      (10% Instant Discount automatically saves you <strong>₹350</strong> on this order)
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Product Details with Image -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9F5; border: 1px solid #EAE6DF; border-radius: 10px; margin: 24px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <!-- Product Image -->
                        <td width="130" valign="top" style="padding-right: 18px;">
                          <a href="https://www.namonarayanaghee.store/products/pure-desi-cow-ghee-5-litre" target="_blank" style="text-decoration: none; display: block;">
                            <img src="https://www.namonarayanaghee.store/media/6-5L_jpg_813cfb.webp" alt="Pure A2 Gir Cow Ghee 5 Litre" width="130" style="display: block; width: 130px; border-radius: 8px; border: 1px solid #E0DDD5;" />
                          </a>
                        </td>
                        <!-- Product Info -->
                        <td valign="top">
                          <p style="margin: 0 0 4px 0; color: #576B55; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                            Order Ref: #${orderId}
                          </p>
                          <h3 style="margin: 0 0 8px 0; color: #1E3A24; font-size: 17px; font-weight: 700; line-height: 1.3;">
                            Pure A2 Gir Cow Ghee (5 Litre)
                          </h3>
                          <p style="margin: 0 0 10px 0; color: #576B55; font-size: 13px; line-height: 1.4;">
                            100% Traditional Bilona Method • Vedic Curd-Churned • Rich Golden Granules • Zero Preservatives
                          </p>
                          
                          <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="color: #7A8978; font-size: 13px; text-decoration: line-through; padding-right: 10px;">
                                ₹3,499
                              </td>
                              <td style="color: #1E3A24; font-size: 18px; font-weight: 800;">
                                ₹3,149 <span style="font-size: 12px; color: #2D7A42; font-weight: 600;">(with ELVISH10)</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Free Gifts Section -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #DDD8CE;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 8px 0; color: #C38936; font-size: 13px; font-weight: 700;">
                            🎁 3 Complimentary Gifts Included With Your Order:
                          </p>
                          <ul style="margin: 0; padding-left: 18px; color: #3A4A3B; font-size: 13px; line-height: 1.6;">
                            <li><strong>Coconut Oil – 250 ml</strong> (<span style="color: #2D7A42; font-weight: bold;">FREE</span>)</li>
                            <li><strong>Groundnut Oil – 250 ml</strong> (<span style="color: #2D7A42; font-weight: bold;">FREE</span>)</li>
                            <li><strong>Mustard Oil – 500 ml</strong> (<span style="color: #2D7A42; font-weight: bold;">FREE</span>)</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <!-- Delivery Destination -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #EAE6DF;">
                      <tr>
                        <td>
                          <p style="margin: 0; color: #576B55; font-size: 12px; line-height: 1.5;">
                            📍 <strong>Shipping To:</strong> ${address}<br>
                            🚚 <strong>Delivery:</strong> Express Safe Delivery (Free)
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Big Primary CTA Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 20px 0;">
                <tr>
                  <td align="center">
                    <a href="https://www.namonarayanaghee.store/pay-proxy?orderId=${orderId}&amount=3149&name=ANIL%20SONUNE&email=${encodeURIComponent(email)}&phone=${phone}&productinfo=Pure%20A2%20Gir%20Cow%20Ghee%205L" target="_blank" style="display: inline-block; background-color: #C38936; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; padding: 15px 36px; border-radius: 8px; box-shadow: 0 4px 12px rgba(195, 137, 54, 0.35); text-align: center; letter-spacing: 0.3px;">
                      Complete Order & Save 10% (Pay ₹3,149) →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <a href="https://www.namonarayanaghee.store/products/pure-desi-cow-ghee-5-litre" target="_blank" style="color: #1E3A24; font-size: 13px; font-weight: 600; text-decoration: underline;">
                      Or click here to view the 5L Ghee product page directly
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Personal Support Guarantee Note -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F7F2; border-radius: 8px; margin-top: 24px;">
                <tr>
                  <td style="padding: 16px 18px; font-size: 13px; color: #4A5B49; line-height: 1.6;">
                    <strong>Have a question or facing payment difficulties?</strong><br>
                    If you faced any issue with UPI, Google Pay, PhonePe or Card, simply reply directly to this email or reach out on WhatsApp/Call to our team at <strong>+91 8580532042</strong> / <strong>+91 8816035157</strong>. We are here to help you.
                  </td>
                </tr>
              </table>

              <p style="margin: 28px 0 0 0; color: #1E3A24; font-size: 14px; line-height: 1.6;">
                Warm regards,<br>
                <strong>The Namo Narayana Team</strong><br>
                <span style="color: #576B55; font-size: 12px;">Pure Vedic Nutrition • Direct from Farm</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F4F6F0; padding: 22px 24px; text-align: center; border-top: 1px solid #EAE6DF;">
              <p style="margin: 0 0 6px 0; color: #1E3A24; font-size: 13px; font-weight: 700;">
                Namo Narayana
              </p>
              <p style="margin: 0 0 8px 0; color: #576B55; font-size: 12px;">
                Pure Food. Stronger Bharat. 🙏
              </p>
              <p style="margin: 0; color: #8A9988; font-size: 11px;">
                © 2026 Namo Narayana. All rights reserved. | <a href="https://www.namonarayanaghee.store" target="_blank" style="color: #1E3A24; text-decoration: underline;">namonarayanaghee.store</a>
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

function buildEmailText({ customerName, orderId, email, phone, address }) {
  return `Namaste ${customerName} ji,

We noticed you recently started placing your order for our Pure A2 Gir Cow Ghee (5 Litre), but the payment was not completed.

Your order reference: #${orderId}

⏳ FRESH BILONA BATCH RESERVED TEMPORARILY:
Because each batch of our A2 Gir Cow Ghee is hand-churned using traditional Vedic bilona methods in limited quantities, your 5L Tin and 3 Free Cold-Pressed Oils are currently held in reserved status. If payment is not completed, this reserved batch will be released to the next waitlisted customer.

SPECIAL 10% DISCOUNT CODE:
Coupon Code: ELVISH10 (10% instant discount, saving ₹350)

ORDER SUMMARY:
• Product: Pure A2 Gir Cow Ghee (5 Litre)
• Regular Price: ₹3,499
• Price with ELVISH10: ₹3,149
• Free Gifts Included:
  - 1x Coconut Oil 250ml (FREE)
  - 1x Groundnut Oil 250ml (FREE)
  - 1x Mustard Oil 500ml (FREE)
• Shipping Address: ${address}
• Delivery: Express Delivery (FREE)

COMPLETE YOUR ORDER:
👉 Direct Checkout Link:
https://www.namonarayanaghee.store/pay-proxy?orderId=${orderId}&amount=3149&name=ANIL%20SONUNE&email=${encodeURIComponent(email)}&phone=${phone}&productinfo=Pure%20A2%20Gir%20Cow%20Ghee%205L

👉 Or visit the 5L product page directly:
https://www.namonarayanaghee.store/products/pure-desi-cow-ghee-5-litre

NEED HELP OR PREFER DIRECT UPI?
If you faced any issue with UPI, Google Pay, PhonePe, or Card, simply reply to this email or reach out on WhatsApp/Call to our team at +91 8580532042 / +91 8816035157.

Warm regards,
The Namo Narayana Team
Pure Food. Stronger Bharat.
https://www.namonarayanaghee.store
`;
}

const LEAD_DATA = {
  customerName: "ANIL SONUNE",
  orderId: "GaQ5HOXPGkgPTDPCAQG3",
  email: "testtst901@gmail.com",
  phone: "9011581867",
  address: "B606, Alankapuram Society's, near Sankalpa garder mangal karyalaya, Wadmulhwadi, Pune, Maharashtra 412105, India"
};

async function sendEmail(recipientEmail, recipientName) {
  const payload = {
    sender: {
      name: "Namo Narayana Support",
      email: "care@namonarayanaghee.store"
    },
    to: [
      {
        email: recipientEmail,
        name: recipientName
      }
    ],
    replyTo: {
      name: "Namo Narayana Support",
      email: "care@namonarayanaghee.store"
    },
    subject: `Action Required: Complete your order #${LEAD_DATA.orderId} (3 Free Gifts Reserved)`,
    htmlContent: buildEmailHtml(LEAD_DATA),
    textContent: buildEmailText(LEAD_DATA),
    headers: {
      "X-Mailin-Tag": "order-recovery-fomo"
    }
  };

  console.log(`Sending email to: ${recipientEmail} (${recipientName})...`);

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY
    },
    body: JSON.stringify(payload)
  });

  const body = await res.text();
  console.log(`Response status: ${res.status}`);
  console.log(`Response body: ${body}`);

  if (!res.ok) {
    throw new Error(`Failed with status ${res.status}: ${body}`);
  }

  return JSON.parse(body);
}

async function main() {
  console.log("=== SENDING TO CUSTOMER AND ADMIN ===");

  console.log("\n1. Sending to admin littlecodr@gmail.com...");
  const resAdmin = await sendEmail("littlecodr@gmail.com", "Little Codr (Admin Copy)");
  console.log("Admin email sent:", resAdmin);

  console.log("\n2. Sending to customer testtst901@gmail.com...");
  const resCustomer = await sendEmail("testtst901@gmail.com", "ANIL SONUNE");
  console.log("Customer email sent:", resCustomer);
}

main().catch(err => {
  console.error("Execution error:", err);
  process.exit(1);
});
