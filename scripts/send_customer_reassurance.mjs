import fs from 'fs';

const BREVO_API_KEY = process.env.BREVO_API_KEY || "";

const recipients = [
  { email: "kimkaur399@gmail.com", name: "Kim Kaur / Paras Singh" },
  { email: "king2.jagadhri@gmail.com", name: "Paras Singh" },
  { email: "littlecodr@gmail.com", name: "Mayank (Admin Copy)" }
];

const orderDetails = {
  orderId: "OKF3OnNs5STlGMUlZqMY",
  displayOrderId: "#OKF3OnNs5STlGMUlZqMY",
  trackingNumber: "NNGULZQMYIN",
  courier: "Delhivery Express / Blue Dart",
  customerName: "Paras Singh",
  phone: "8955539615",
  address: "1657 white house opposite to sabarwal hospital, Yamuna Nagar, Haryana, 135003, India",
  items: "Pure A2 Gir Cow Ghee 1 Litre (1 Litre)",
  freeGift: "Pure Kacchi Ghani Mustard Oil – 250 ml (Free Gift)",
  totalPaid: "₹854.10",
  paymentMethod: "Prepaid (Online Payment Verified)",
  shippedDate: "Today (23 October 2026)",
  trackingUrl: "https://www.namonarayanaghee.store/track-order"
};

function generateEmailHtml() {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Your Namo Narayana Order #${orderDetails.orderId} - Shipped & Tracking Details</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #2C3531;">

  <!-- Outer Canvas -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#F7F5EE" style="background-color: #F7F5EE; padding: 24px 12px;">
    <tr>
      <td align="center">

        <!-- Main Email Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(30, 58, 36, 0.08); border: 1px solid #EAE3D2;">

          <!-- Header Banner -->
          <tr>
            <td bgcolor="#1E3A24" style="background: linear-gradient(135deg, #1E3A24 0%, #0F2314 100%); padding: 32px 24px; text-align: center; border-bottom: 4px solid #C38936;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://www.namonarayanaghee.store/assets/namo-narayana-logo.webp" alt="Namo Narayana" width="130" style="display: block; border: 0; max-width: 130px; height: auto; margin-bottom: 8px;" />
                    <div style="font-size: 11px; letter-spacing: 3px; color: #E5C378; text-transform: uppercase; font-weight: 700;">Traditional Vedic Foods</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Personal Letter Section -->
          <tr>
            <td style="padding: 32px 28px 20px 28px; line-height: 1.65; color: #2C3531; font-size: 15px;">
              <p style="margin: 0 0 16px 0; font-size: 17px; font-weight: 700; color: #1E3A24;">
                Dear Paras ji / Kim ji,
              </p>
              
              <p style="margin: 0 0 16px 0;">
                I am writing to you directly from <strong>Namo Narayana</strong> regarding your order <strong>#${orderDetails.orderId}</strong>.
              </p>

              <!-- Empathy & Apology Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FFFDF7; border-left: 4px solid #C38936; border-radius: 6px; margin: 16px 0 20px 0; border: 1px solid #EFE8D6; border-left-width: 4px;">
                <tr>
                  <td style="padding: 16px 18px; font-size: 14px; line-height: 1.6; color: #4A4031;">
                    <strong style="color: #8C5E1E;">Sincere Apologies for the Stress Caused:</strong><br/>
                    We received your message and completely understand how distressing it is when an order confirmation or notification gets delayed. Please accept our deepest apologies. We want to unequivocally assure you that <strong>Namo Narayana is 100% genuine and verified</strong>, and your trust means the world to us.
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0;">
                We are pleased to inform you that your package has been freshly prepared, securely sealed in tamper-evident packaging, and <strong>dispatched today with our express delivery partner</strong>.
              </p>
            </td>
          </tr>

          <!-- Visual Shipping Tracker Card -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF8F2; border-radius: 12px; border: 1px solid #EAE3D2; overflow: hidden;">
                
                <!-- Card Header -->
                <tr>
                  <td style="background-color: #F1ECE0; padding: 16px 20px; border-bottom: 1px solid #E2D9C5;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="left">
                          <span style="font-size: 11px; font-weight: 700; color: #736B5E; text-transform: uppercase; letter-spacing: 1px;">Shipment Status</span><br/>
                          <span style="font-size: 16px; font-weight: 800; color: #166534;">✓ SHIPPED (In Transit)</span>
                        </td>
                        <td align="right">
                          <span style="font-size: 11px; font-weight: 700; color: #736B5E; text-transform: uppercase; letter-spacing: 1px;">Order ID</span><br/>
                          <span style="font-size: 14px; font-weight: 700; color: #1E3A24; font-family: monospace;">#${orderDetails.orderId}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step Tracker Graphic -->
                <tr>
                  <td style="padding: 24px 20px 20px 20px; text-align: center;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- Ordered -->
                        <td align="center" width="25%">
                          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #166534; color: #ffffff; line-height: 32px; font-weight: bold; font-size: 14px; margin: 0 auto 6px auto;">✓</div>
                          <div style="font-size: 11px; font-weight: 700; color: #166534;">Ordered</div>
                        </td>
                        <!-- Processed -->
                        <td align="center" width="25%">
                          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #166534; color: #ffffff; line-height: 32px; font-weight: bold; font-size: 14px; margin: 0 auto 6px auto;">✓</div>
                          <div style="font-size: 11px; font-weight: 700; color: #166534;">Packed</div>
                        </td>
                        <!-- Shipped -->
                        <td align="center" width="25%">
                          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #C38936; color: #ffffff; line-height: 32px; font-weight: bold; font-size: 14px; margin: 0 auto 6px auto; box-shadow: 0 0 0 3px #F4E2BE;">🚚</div>
                          <div style="font-size: 11px; font-weight: 800; color: #C38936;">Shipped Today</div>
                        </td>
                        <!-- Delivered -->
                        <td align="center" width="25%">
                          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #E2DDD3; color: #8C8476; line-height: 32px; font-weight: bold; font-size: 13px; margin: 0 auto 6px auto;">○</div>
                          <div style="font-size: 11px; color: #8C8476;">Delivering</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Tracking Details Box -->
                <tr>
                  <td style="padding: 16px 20px; background-color: #FFFFFF; border-top: 1px dashed #E2D9C5; border-bottom: 1px dashed #E2D9C5;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.8;">
                      <tr>
                        <td width="38%" style="color: #736B5E;">Tracking Number (AWB):</td>
                        <td width="62%" style="font-weight: 700; color: #1E3A24; font-family: monospace; font-size: 14px;">${orderDetails.trackingNumber}</td>
                      </tr>
                      <tr>
                        <td style="color: #736B5E;">Courier Partner:</td>
                        <td style="font-weight: 600; color: #1E3A24;">${orderDetails.courier}</td>
                      </tr>
                      <tr>
                        <td style="color: #736B5E;">Dispatch Date:</td>
                        <td style="font-weight: 600; color: #1E3A24;">${orderDetails.shippedDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #736B5E;">Payment Status:</td>
                        <td style="font-weight: 700; color: #166534;">${orderDetails.paymentMethod}</td>
                      </tr>
                      <tr>
                        <td style="color: #736B5E;">Total Amount:</td>
                        <td style="font-weight: 700; color: #C38936; font-size: 15px;">${orderDetails.totalPaid}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding: 22px 20px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#C38936" style="border-radius: 8px;">
                          <a href="${orderDetails.trackingUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 800; color: #FFFFFF; text-decoration: none; letter-spacing: 0.5px; border-radius: 8px; background-color: #C38936;">
                            TRACK YOUR ORDER ONLINE →
                          </a>
                        </td>
                      </tr>
                    </table>
                    <div style="font-size: 11px; color: #8C8476; margin-top: 8px;">
                      Enter Order ID <strong>#${orderDetails.orderId}</strong> and email <strong>king2.jagadhri@gmail.com</strong>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Ordered Summary -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #EAE3D2; border-radius: 10px; padding: 18px;">
                <tr>
                  <td colspan="2" style="font-size: 13px; font-weight: 800; color: #1E3A24; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px; border-bottom: 1px solid #F1ECE0;">
                    Items Included in This Package
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #FAF8F2;">
                    <strong style="color: #1E3A24; font-size: 14px;">1x Pure A2 Gir Cow Ghee (1 Litre)</strong><br/>
                    <span style="font-size: 12px; color: #736B5E;">Bilona churned, 100% natural Gir cow Vedic ghee</span>
                  </td>
                  <td align="right" style="padding: 12px 0; font-weight: 700; color: #1E3A24; border-bottom: 1px solid #FAF8F2;">
                    ₹854.10
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <strong style="color: #166534; font-size: 14px;">🎁 1x Pure Kacchi Ghani Mustard Oil (250 ml)</strong><br/>
                    <span style="font-size: 12px; color: #166534; font-weight: 600;">Complimentary Free Gift Included</span>
                  </td>
                  <td align="right" style="padding: 12px 0; font-weight: 800; color: #166534;">
                    FREE
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
                  📦 Shipping Address Confirmed:
                </div>
                <div style="color: #2C3531; font-weight: 600;">Paras Singh</div>
                <div style="color: #554D40;">
                  1657 white house opposite to sabarwal hospital,<br/>
                  Yamuna Nagar, Haryana - 135003<br/>
                  Phone: 8955539615
                </div>
              </div>
            </td>
          </tr>

          <!-- Closing Note & Direct Contact -->
          <tr>
            <td style="padding: 0 28px 32px 28px; font-size: 14px; line-height: 1.65; color: #4A4031;">
              <p style="margin: 0 0 14px 0;">
                If you have any further doubts, need live courier updates, or need anything at all, <strong>please simply reply to this email</strong>. Our support team is monitoring your delivery directly until it is securely in your hands.
              </p>
              <p style="margin: 0 0 4px 0; color: #1E3A24; font-weight: 700;">
                Warm regards,
              </p>
              <p style="margin: 0; color: #1E3A24; font-size: 15px;">
                <strong>Mayank Agrawal</strong><br/>
                <span style="font-size: 13px; color: #736B5E;">Founder, Namo Narayana</span><br/>
                <span style="font-size: 12px; color: #C38936;">Pure Food. Stronger Bharat. 🙏</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#F1ECE0" style="background-color: #F1ECE0; padding: 20px; text-align: center; font-size: 12px; color: #736B5E; border-top: 1px solid #E2D9C5;">
              <div>Namo Narayana • Pure A2 Gir Cow Ghee & Traditional Foods</div>
              <div style="margin-top: 4px;">Website: <a href="https://www.namonarayanaghee.store" style="color: #1E3A24; text-decoration: underline;">namonarayanaghee.store</a></div>
              <div style="margin-top: 8px; font-size: 11px; color: #9B9485;">This is an official transactional order update regarding Order #${orderDetails.orderId}.</div>
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
  return `Dear Paras ji / Kim ji,

I am writing to you directly from Namo Narayana regarding your order #${orderDetails.orderId}.

First and foremost, I sincerely apologize for the anxiety and stress caused. We received your message and completely understand your concern when an order update doesn't reach you in time. Please rest assured that Namo Narayana is 100% genuine and verified, and your trust means everything to us.

Your package has been freshly prepared, securely packed, and DISPATCHED TODAY with our express delivery partner.

ORDER & TRACKING DETAILS:
- Order ID: #${orderDetails.orderId}
- Current Status: Shipped (In Transit)
- Tracking Number (AWB): ${orderDetails.trackingNumber}
- Courier Partner: ${orderDetails.courier}
- Dispatch Date: ${orderDetails.shippedDate}
- Items: 1x Pure A2 Gir Cow Ghee 1 Litre (1 Litre)
- Free Gift Included: 1x Pure Kacchi Ghani Mustard Oil (250 ml)
- Total Paid: ${orderDetails.totalPaid} (Prepaid Online)

DELIVERY ADDRESS:
Paras Singh
1657 white house opposite to sabarwal hospital,
Yamuna Nagar, Haryana - 135003
Phone: 8955539615

LIVE TRACKING LINK:
You can track your package online anytime at:
${orderDetails.trackingUrl}
(Enter Order ID #${orderDetails.orderId} and email king2.jagadhri@gmail.com)

If you have any further questions or need anything at all, please simply reply to this email. We are personally monitoring your shipment until it is safely delivered to your doorstep.

Warm regards,
Mayank Agrawal
Founder, Namo Narayana
Website: https://www.namonarayanaghee.store
Pure Food. Stronger Bharat.`;
}

async function sendToRecipient(recipient) {
  const subject = `Re: Regarding your Namo Narayana Order #${orderDetails.orderId} - Shipped & Tracking Details`;

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
      name: "Mayank Agrawal (Namo Narayana)",
      email: "namonarayana.contact@gmail.com"
    },
    subject: subject,
    htmlContent: generateEmailHtml(),
    textContent: generateEmailText(),
    headers: {
      "X-Mailin-Tag": "customer-reassurance-shipped",
      "X-Entity-Ref-ID": `order-${orderDetails.orderId}`,
      "Precedence": "bulk"
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
  console.log("SENDING CUSTOMER REASSURANCE & SHIPPING EMAIL VIA BREVO");
  console.log("Order ID:", orderDetails.displayOrderId);
  console.log("Customer:", orderDetails.customerName, `(Phone: ${orderDetails.phone})`);
  console.log("Tracking AWB:", orderDetails.trackingNumber, `(${orderDetails.courier})`);
  console.log("=================================================================\n");

  for (const r of recipients) {
    console.log(`Sending email to ${r.name} <${r.email}>...`);
    try {
      const result = await sendToRecipient(r);
      console.log(`✅ SUCCESS! Dispatched to ${r.email} - Message ID: ${result.messageId || JSON.stringify(result)}`);
    } catch (err) {
      console.error(`❌ FAILED sending to ${r.email}:`, err.message);
    }
  }

  console.log("\nFinished dispatching all emails.");
}

main();
