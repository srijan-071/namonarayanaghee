import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;

const recipients = [
  { email: "divyasaxena14june2001@gmail.com", name: "Divya" },
  { email: "littlecodr@gmail.com", name: "Mayank (Admin Verification)" }
];

const orderDetails = {
  orderId: "ALdWvPwMqkflCiTu35fr",
  displayOrderId: "#ALdWvPwMqkflCiTu35fr",
  customerName: "Divya",
  phone: "8824130993",
  address: "C120 Trusted pg sector 14 main road old DLF gurugram, Gurgaon, Haryana, 122006, India",
  productName: "Shuddh Ghee Diwali Trial Pack (500 ml)",
  offerPrice: "₹599.00",
  discountApplied: "₹59.90 (10% Diwali Discount)",
  totalPaid: "₹539.10",
  paymentStatus: "Paid & Verified (Razorpay pay_Tsu0IPZd7AqoU7)",
  currentStage: "Farm Packing & Quality Sealing",
  trackingUrl: "https://namonarayanaghee.store/track-order"
};

function generateEmailHtml() {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Re: Regarding order - Details for #${orderDetails.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #2C3531;">

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#F7F5EE" style="background-color: #F7F5EE; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(30, 58, 36, 0.08); border: 1px solid #EAE3D2;">

          <!-- Top Vedic Header -->
          <tr>
            <td bgcolor="#1E3A24" style="background: linear-gradient(135deg, #1E3A24 0%, #0F2314 100%); padding: 30px 24px; text-align: center; border-bottom: 4px solid #C38936;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://www.namonarayanaghee.store/assets/namo-narayana-logo.webp" alt="Namo Narayana" width="130" style="display: block; border: 0; max-width: 130px; height: auto; margin-bottom: 8px;" />
                    <div style="font-size: 11px; letter-spacing: 3px; color: #E5C378; text-transform: uppercase; font-weight: 700;">Pure Vedic A2 Gir Cow Ghee</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conversational Letter -->
          <tr>
            <td style="padding: 30px 28px 16px 28px; line-height: 1.65; color: #2C3531; font-size: 15px;">
              <p style="margin: 0 0 16px 0; font-size: 17px; font-weight: 700; color: #1E3A24;">
                Dear Divya ji,
              </p>

              <p style="margin: 0 0 16px 0;">
                Namaste! 🙏 I am writing to you directly regarding your recent inquiry about your <strong>₹599 Diwali Trial Offer</strong> ghee order.
              </p>

              <!-- Sincere Apology Callout -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FFFDF7; border-left: 4px solid #C38936; border-radius: 6px; margin: 16px 0 20px 0; border: 1px solid #EFE8D6; border-left-width: 4px;">
                <tr>
                  <td style="padding: 16px 18px; font-size: 14px; line-height: 1.6; color: #4A4031;">
                    <strong style="color: #8C5E1E;">Heartfelt Apologies for the Worry Caused:</strong><br/>
                    We noticed that you didn't receive your instant order confirmation email right after payment. We truly understand how concerning that can be, especially when shopping online for the first time. Please accept our sincere apologies for the inconvenience.
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0;">
                Please be completely assured: <strong>Your order is 100% confirmed, your payment was safely received, and your freshly churned Bilona Ghee jar is safe with us!</strong>
              </p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF8F2; border-radius: 12px; border: 1px solid #EAE3D2; overflow: hidden;">
                
                <!-- Card Header -->
                <tr>
                  <td style="background-color: #F1ECE0; padding: 16px 20px; border-bottom: 1px solid #E2D9C5;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="left">
                          <span style="font-size: 11px; font-weight: 700; color: #736B5E; text-transform: uppercase; letter-spacing: 1px;">Your Order Reference Number</span><br/>
                          <span style="font-size: 18px; font-weight: 800; color: #1E3A24; font-family: monospace;">#${orderDetails.orderId}</span>
                        </td>
                        <td align="right">
                          <span style="display: inline-block; background-color: #E8F5E9; color: #166534; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 20px; border: 1px solid #C8E6C9;">
                            ✓ Verified & Paid
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Item Details -->
                <tr>
                  <td style="padding: 20px; background-color: #FFFFFF; border-bottom: 1px dashed #E2D9C5;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 14px; line-height: 1.8;">
                      <tr>
                        <td style="color: #736B5E;">Product:</td>
                        <td style="font-weight: 700; color: #1E3A24;">${orderDetails.productName}</td>
                      </tr>
                      <tr>
                        <td style="color: #736B5E;">Offer Base Price:</td>
                        <td style="font-weight: 600; color: #4A4031;">${orderDetails.offerPrice}</td>
                      </tr>
                      <tr>
                        <td style="color: #736B5E;">Diwali Coupon Discount:</td>
                        <td style="font-weight: 700; color: #166534;">- ${orderDetails.discountApplied}</td>
                      </tr>
                      <tr>
                        <td style="color: #736B5E;">Final Amount Paid:</td>
                        <td style="font-weight: 800; color: #C38936; font-size: 16px;">${orderDetails.totalPaid}</td>
                      </tr>
                      <tr>
                        <td style="color: #736B5E;">Payment Method:</td>
                        <td style="font-weight: 600; color: #166534;">Online Prepaid (Verified)</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Visual Tracker Graphic -->
                <tr>
                  <td style="padding: 20px 16px; text-align: center; background-color: #FAF8F2;">
                    <div style="font-size: 12px; font-weight: 800; color: #1E3A24; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px;">
                      📦 Current Order Status
                    </div>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- 1. Confirmed -->
                        <td align="center" width="25%">
                          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #166534; color: #ffffff; line-height: 32px; font-weight: bold; font-size: 14px; margin: 0 auto 6px auto;">✓</div>
                          <div style="font-size: 11px; font-weight: 700; color: #166534;">Order Placed</div>
                        </td>
                        <!-- 2. Farm Packing (CURRENT) -->
                        <td align="center" width="25%">
                          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #C38936; color: #ffffff; line-height: 32px; font-weight: bold; font-size: 13px; margin: 0 auto 6px auto; box-shadow: 0 0 0 3px #F4E2BE;">2</div>
                          <div style="font-size: 11px; font-weight: 800; color: #C38936;">Farm Packing<br/><span style="font-size: 9px; font-weight: normal;">(Current Stage)</span></div>
                        </td>
                        <!-- 3. Express Courier -->
                        <td align="center" width="25%">
                          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #E2DDD3; color: #8C8476; line-height: 32px; font-weight: bold; font-size: 13px; margin: 0 auto 6px auto;">3</div>
                          <div style="font-size: 11px; color: #8C8476;">Express Dispatch</div>
                        </td>
                        <!-- 4. Delivered -->
                        <td align="center" width="25%">
                          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #E2DDD3; color: #8C8476; line-height: 32px; font-weight: bold; font-size: 13px; margin: 0 auto 6px auto;">4</div>
                          <div style="font-size: 11px; color: #8C8476;">Delivered</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding: 20px; background-color: #FFFFFF; border-top: 1px solid #EAE3D2;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#1E3A24" style="border-radius: 8px;">
                          <a href="${orderDetails.trackingUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 800; color: #FFFFFF; text-decoration: none; letter-spacing: 0.5px; border-radius: 8px; background-color: #1E3A24;">
                            TRACK YOUR ORDER ONLINE →
                          </a>
                        </td>
                      </tr>
                    </table>
                    <div style="font-size: 11px; color: #8C8476; margin-top: 8px;">
                      Enter Order ID: <strong>#${orderDetails.orderId}</strong> & Email: <strong>divyasaxena14june2001@gmail.com</strong>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address Confirmation -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <div style="background-color: #FAF8F2; border-radius: 10px; padding: 16px 20px; border: 1px solid #EAE3D2; font-size: 13px; line-height: 1.6;">
                <div style="font-weight: 800; color: #1E3A24; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-size: 12px;">
                  📍 Your Shipping Address on File:
                </div>
                <div style="color: #2C3531; font-weight: 600;">Divya</div>
                <div style="color: #554D40;">
                  C120 Trusted pg, Sector 14 Main Road,<br/>
                  Old DLF, Gurugram, Haryana - 122006<br/>
                  Phone: 8824130993
                </div>
              </div>
            </td>
          </tr>

          <!-- Reassurance Closing -->
          <tr>
            <td style="padding: 0 28px 30px 28px; font-size: 14px; line-height: 1.65; color: #4A4031;">
              <p style="margin: 0 0 14px 0;">
                Our team is packing your ghee in multi-layer cushioned glass protection to ensure it arrives pure and untouched. As soon as the courier scans your box for dispatch, you will receive another update with the live AWB tracking number.
              </p>
              <p style="margin: 0 0 14px 0;">
                If you have any further questions at all, <strong>simply reply directly to this email</strong> or contact us anytime. We are here to support you until your ghee is safely in your hands.
              </p>
              <p style="margin: 0 0 4px 0; color: #1E3A24; font-weight: 700;">
                Warmest regards,
              </p>
              <p style="margin: 0; color: #1E3A24; font-size: 15px;">
                <strong>Team Namo Narayana</strong><br/>
                <span style="font-size: 12px; color: #C38936;">Pure Food. Stronger Bharat. 🙏</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#F1ECE0" style="background-color: #F1ECE0; padding: 18px; text-align: center; font-size: 12px; color: #736B5E; border-top: 1px solid #E2D9C5;">
              <div>Namo Narayana • Pure Vedic A2 Gir Cow Ghee</div>
              <div style="margin-top: 4px;">Website: <a href="https://www.namonarayanaghee.store" style="color: #1E3A24; text-decoration: underline;">namonarayanaghee.store</a></div>
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
  return `Dear Divya ji,

Namaste! 🙏

I am writing to you directly regarding your inquiry about your order for the ₹599 Diwali Trial Offer.

First and foremost, please accept our sincere apologies for the anxiety and stress caused. We noticed you didn't receive your confirmation email immediately after payment, and we completely understand how concerning that feels when shopping online.

Please be completely assured: Your order is 100% verified, your payment was successfully received, and your freshly churned Vedic Bilona Ghee is safe with us!

HERE ARE YOUR COMPLETE ORDER DETAILS:
- Order Reference Number: #${orderDetails.orderId}
- Item: ${orderDetails.productName}
- Offer Base Price: ${orderDetails.offerPrice}
- Diwali Discount Applied: - ${orderDetails.discountApplied}
- Total Amount Paid: ${orderDetails.totalPaid} (Prepaid Verified)
- Current Stage: Farm Packing & Sealing in Progress

DELIVERY ADDRESS:
Divya
C120 Trusted pg, Sector 14 Main Road,
Old DLF, Gurugram, Haryana - 122006
Phone: 8824130993

ONLINE TRACKING LINK:
You can track your package online anytime at:
${orderDetails.trackingUrl}
(Enter Order ID: #${orderDetails.orderId} and Email: divyasaxena14june2001@gmail.com)

Our team is hand-packing your ghee with multi-layer cushioned protection. You will receive an express courier tracking update as soon as the package is handed over to the courier partner.

If you have any further questions, please feel free to reply directly to this email. We are monitoring your order personally.

Warm regards,
Team Namo Narayana
Website: https://namonarayanaghee.store
Pure Food. Stronger Bharat. 🙏`;
}

async function sendReply(recipient) {
  const subject = `Re: Regarding order - Details & Confirmation for #${orderDetails.orderId}`;

  const payload = {
    sender: {
      name: "Mayank | Namo Narayana",
      email: "care@namonarayanaghee.store"
    },
    to: [
      {
        email: recipient.email,
        name: recipient.name
      }
    ],
    replyTo: {
      name: "Namo Narayana Support",
      email: "namonarayana.contact@gmail.com"
    },
    subject: subject,
    htmlContent: generateEmailHtml(),
    textContent: generateEmailText(),
    headers: {
      "X-Mailin-Tag": "customer-inquiry-reply",
      "X-Entity-Ref-ID": `order-${orderDetails.orderId}`
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
    throw new Error(`Failed to send to ${recipient.email} (${res.status}): ${bodyText}`);
  }

  let parsed = {};
  try {
    parsed = JSON.parse(bodyText);
  } catch (e) {
    parsed = { response: bodyText };
  }
  return parsed;
}

async function main() {
  console.log("=================================================================");
  console.log("SENDING BEAUTIFUL CONVERSATIONAL APOLOGY & ORDER DETAILS EMAIL");
  console.log("Customer: Divya (divyasaxena14june2001@gmail.com)");
  console.log("Order ID: #" + orderDetails.orderId);
  console.log("=================================================================\n");

  for (const r of recipients) {
    console.log(`Sending to ${r.name} <${r.email}>...`);
    try {
      const res = await sendReply(r);
      console.log(`✅ DISPATCHED to ${r.email}! Message ID: ${res.messageId || JSON.stringify(res)}`);
    } catch (err) {
      console.error(`❌ FAILED for ${r.email}:`, err.message);
    }
  }

  console.log("\nFinished dispatching emails.");
}

main();
