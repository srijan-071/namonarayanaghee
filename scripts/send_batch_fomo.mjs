import fetch from "node-fetch";

const BREVO_API_KEY = "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";

function buildEmailHtml(lead) {
  const { customerName, orderId, email, phone, address, productTitle, productUnit, originalPrice, discountedPrice, discountAmount, freeGifts, productSlug, productImage } = lead;
  
  const giftsHtml = freeGifts && freeGifts.length > 0 ? `
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #DDD8CE;">
      <tr>
        <td>
          <p style="margin: 0 0 8px 0; color: #C38936; font-size: 13px; font-weight: 700;">
            🎁 ${freeGifts.length} Complimentary Gift${freeGifts.length > 1 ? 's' : ''} Included With Your Order:
          </p>
          <ul style="margin: 0; padding-left: 18px; color: #3A4A3B; font-size: 13px; line-height: 1.6;">
            ${freeGifts.map(g => `<li><strong>${g}</strong> (<span style="color: #2D7A42; font-weight: bold;">FREE</span>)</li>`).join('\n')}
          </ul>
        </td>
      </tr>
    </table>
  ` : '';

  const reservationText = freeGifts && freeGifts.length > 0
    ? `your <strong>${productTitle}</strong> and <strong>${freeGifts.length} Free Cold-Pressed Gift${freeGifts.length > 1 ? 's' : ''}</strong> are currently held in reserved status.`
    : `your <strong>${productTitle}</strong> is currently held in reserved status.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Namo Narayana Order #${orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222D23; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #FAF9F5; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Namaste ${customerName}, your ${productTitle} is reserved. Use code ELVISH10 to complete checkout with 10% off.
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
                We noticed you recently started placing your order for our <strong>${productTitle}</strong>, but the payment was not completed.
              </p>

              <!-- Urgent Reservation Notice / FOMO Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFF9EF; border: 1px solid #F0D5A3; border-left: 4px solid #C38936; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <p style="margin: 0 0 6px 0; color: #8A5610; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                      ⏳ Fresh Bilona Batch Reserved Temporarily
                    </p>
                    <p style="margin: 0; color: #4F3815; font-size: 14px; line-height: 1.5;">
                      Because each batch of our A2 Gir Cow Ghee is hand-churned using traditional Vedic bilona methods in strictly limited quantities, ${reservationText} If payment is not completed, this reserved fresh batch will be released to the next waitlisted customer.
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
                      (10% Instant Discount automatically saves you <strong>₹${discountAmount}</strong> on this order)
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
                          <a href="https://www.namonarayanaghee.store/products/${productSlug}" target="_blank" style="text-decoration: none; display: block;">
                            <img src="${productImage}" alt="${productTitle}" width="130" style="display: block; width: 130px; border-radius: 8px; border: 1px solid #E0DDD5;" />
                          </a>
                        </td>
                        <!-- Product Info -->
                        <td valign="top">
                          <p style="margin: 0 0 4px 0; color: #576B55; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                            Order Ref: #${orderId}
                          </p>
                          <h3 style="margin: 0 0 8px 0; color: #1E3A24; font-size: 17px; font-weight: 700; line-height: 1.3;">
                            ${productTitle}
                          </h3>
                          <p style="margin: 0 0 10px 0; color: #576B55; font-size: 13px; line-height: 1.4;">
                            100% Traditional Bilona Method • Vedic Curd-Churned • Rich Golden Granules • Zero Preservatives
                          </p>
                          
                          <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="color: #7A8978; font-size: 13px; text-decoration: line-through; padding-right: 10px;">
                                ₹${originalPrice}
                              </td>
                              <td style="color: #1E3A24; font-size: 18px; font-weight: 800;">
                                ₹${discountedPrice} <span style="font-size: 12px; color: #2D7A42; font-weight: 600;">(with ELVISH10)</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Free Gifts Section -->
                    ${giftsHtml}

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
                    <a href="https://www.namonarayanaghee.store/pay-proxy?orderId=${orderId}&amount=${discountedPrice}&name=${encodeURIComponent(customerName)}&email=${encodeURIComponent(email)}&phone=${phone}&productinfo=${encodeURIComponent(productTitle)}" target="_blank" style="display: inline-block; background-color: #C38936; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; padding: 15px 36px; border-radius: 8px; box-shadow: 0 4px 12px rgba(195, 137, 54, 0.35); text-align: center; letter-spacing: 0.3px;">
                      Complete Order & Save 10% (Pay ₹${discountedPrice}) →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <a href="https://www.namonarayanaghee.store/products/${productSlug}" target="_blank" style="color: #1E3A24; font-size: 13px; font-weight: 600; text-decoration: underline;">
                      Or click here to view the ${productTitle} product page directly
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

function buildEmailText(lead) {
  const { customerName, orderId, email, phone, address, productTitle, originalPrice, discountedPrice, discountAmount, freeGifts, productSlug } = lead;

  const giftsText = freeGifts && freeGifts.length > 0
    ? `• Free Gifts Included:\n${freeGifts.map(g => `  - ${g} (FREE)`).join('\n')}\n`
    : '';

  return `Namaste ${customerName} ji,

We noticed you recently started placing your order for our ${productTitle}, but the payment was not completed.

Your order reference: #${orderId}

⏳ FRESH BILONA BATCH RESERVED TEMPORARILY:
Because each batch of our A2 Gir Cow Ghee is hand-churned using traditional Vedic bilona methods in limited quantities, your ${productTitle} is currently held in reserved status. If payment is not completed, this reserved batch will be released to the next waitlisted customer.

SPECIAL 10% DISCOUNT CODE:
Coupon Code: ELVISH10 (10% instant discount, saving ₹${discountAmount})

ORDER SUMMARY:
• Product: ${productTitle}
• Regular Price: ₹${originalPrice}
• Price with ELVISH10: ₹${discountedPrice}
${giftsText}• Shipping Address: ${address}
• Delivery: Express Delivery (FREE)

COMPLETE YOUR ORDER:
👉 Direct Checkout Link:
https://www.namonarayanaghee.store/pay-proxy?orderId=${orderId}&amount=${discountedPrice}&name=${encodeURIComponent(customerName)}&email=${encodeURIComponent(email)}&phone=${phone}&productinfo=${encodeURIComponent(productTitle)}

👉 Or visit the product page directly:
https://www.namonarayanaghee.store/products/${productSlug}

NEED HELP OR PREFER DIRECT UPI?
If you faced any issue with UPI, Google Pay, PhonePe, or Card, simply reply to this email or reach out on WhatsApp/Call to our team at +91 8580532042 / +91 8816035157.

Warm regards,
The Namo Narayana Team
Pure Food. Stronger Bharat.
https://www.namonarayanaghee.store
`;
}

const LEADS = [
  {
    orderId: "cLgVlBKQIuSpALIlB5kp",
    customerName: "MUKESH KUMAR SINGH",
    email: "jaishivsupaul@gmail.com",
    phone: "06203968845",
    address: "Ward No. 09 Near Axis Bank, Supaul, Bihar 852131, India",
    productTitle: "Pure A2 Gir Cow Ghee (5 Litre)",
    productUnit: "5 Litre",
    originalPrice: "3,499",
    discountedPrice: "3,149",
    discountAmount: "350",
    freeGifts: ["Coconut Oil – 250 ml", "Groundnut Oil – 250 ml", "Mustard Oil – 500 ml"],
    productSlug: "pure-desi-cow-ghee-5-litre",
    productImage: "https://www.namonarayanaghee.store/media/6-5L_jpg_813cfb.webp"
  },
  {
    orderId: "YaXJc0KlVmHyVnA4AbYk",
    customerName: "Bindiya Ekka",
    email: "bindiyaekka596@gmail.com",
    phone: "7000507594",
    address: "Isprava calisto vaddo maina vaddo sodium siolim goa, North Goa, Goa 403517, India",
    productTitle: "Pure A2 Gir Cow Ghee (500 ml)",
    productUnit: "500 ml",
    originalPrice: "599",
    discountedPrice: "539",
    discountAmount: "60",
    freeGifts: [],
    productSlug: "pure-desi-cow-ghee-500-ml",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_cab5f3.webp"
  },
  {
    orderId: "BYNqdZYB1oWHeTPWLrKN",
    customerName: "Priyanka Verma",
    email: "priyankaverma0107003@gmail.com",
    phone: "9839829344",
    address: "Rajendra nagar ballia, Ballia, Uttar Pradesh 277001, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    productUnit: "1 Litre",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "hOazOazmVZptjYxu5oum",
    customerName: "Krishna",
    email: "7042908967krishna@gmail.com",
    phone: "7983301108",
    address: "Car laB Saharnpur road, Dehradun, Uttarakhand 248001, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    productUnit: "1 Litre",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "nZ5WWQJTYUqhCVR9MbxS",
    customerName: "Farhi",
    email: "farhimalik@12gmail.com",
    secondaryEmail: "farhimalik12@gmail.com",
    phone: "8966946830",
    address: "People highrise peopleMall, Bhopal, Madhya Pradesh 462037, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    productUnit: "1 Litre",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "4C8jeSWfdoO0NbWlNWKZ",
    customerName: "Chandan Patel",
    email: "patelandcompany72@gmail.com",
    phone: "7284838557",
    address: "Puraniganj, Ghazipur, Uttar Pradesh 275201, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    productUnit: "1 Litre",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "V7daPJmKoUdA523RgQX0",
    customerName: "SHALIBHADRA P SHAH",
    email: "karunapshah@gmail.com",
    phone: "9173626056",
    address: "I C B Bhavya, Motera Stadium Road, Motera, Ahmedabad, Gujarat 380005, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    productUnit: "1 Litre",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "ygQNhZx05T9rRKkvdzxa",
    customerName: "Ruchi Kashyap",
    email: "mayankvisuals5550@gmail.com",
    phone: "09336963961",
    address: "House No. 12 JafarPur Mohalla Asraf Cement Store, Ghazipur, Uttar Pradesh 233227, India",
    productTitle: "Pure A2 Gir Cow Ghee (500 ml)",
    productUnit: "500 ml",
    originalPrice: "599",
    discountedPrice: "539",
    discountAmount: "60",
    freeGifts: [],
    productSlug: "pure-desi-cow-ghee-500-ml",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_cab5f3.webp"
  },
  {
    orderId: "I6brHDubWArALmD7OSV2",
    customerName: "Srijan Rai",
    email: "littlecodr@gmail.com",
    phone: "09910707756",
    address: "A-431 3rd floor Durga Gali Mandawali Delhi 92, East Delhi, Delhi 110092, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    productUnit: "1 Litre",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "jl5uEwyKfWjz27CeszQZ",
    customerName: "Aaditya Nama",
    email: "namag477@gmail.com",
    phone: "6377114392",
    address: "Flat no 303, Tower no 16 , Lavanya Homes Apartment, Near Ajmer Road, Jaipur, Rajasthan 302026, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    productUnit: "1 Litre",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  }
];

async function sendSingleEmail(recipientEmail, recipientName, lead) {
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
    subject: `Action Required: Complete your order #${lead.orderId} (Batch Reserved)`,
    htmlContent: buildEmailHtml(lead),
    textContent: buildEmailText(lead),
    headers: {
      "X-Mailin-Tag": "order-recovery-fomo"
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

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Failed to send to ${recipientEmail} (${res.status}): ${body}`);
  }

  return JSON.parse(body);
}

async function run() {
  console.log(`Starting batch email dispatch for ${LEADS.length} leads...\n`);
  const results = [];

  for (const lead of LEADS) {
    console.log(`--> Sending for Order #${lead.orderId} to ${lead.customerName} (${lead.email})...`);
    try {
      const res = await sendSingleEmail(lead.email, lead.customerName, lead);
      console.log(`    ✓ Sent! Message ID: ${res.messageId}`);
      results.push({ orderId: lead.orderId, customer: lead.customerName, email: lead.email, success: true, messageId: res.messageId });

      if (lead.secondaryEmail) {
        console.log(`    --> Also sending to fallback ${lead.secondaryEmail}...`);
        try {
          const resSec = await sendSingleEmail(lead.secondaryEmail, lead.customerName, lead);
          console.log(`    ✓ Sent to fallback! Message ID: ${resSec.messageId}`);
        } catch (errSec) {
          console.log(`    ✗ Fallback send failed: ${errSec.message}`);
        }
      }

      // Small delay between requests to be gentle with rate limits
      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      console.error(`    ✗ Error: ${err.message}`);
      results.push({ orderId: lead.orderId, customer: lead.customerName, email: lead.email, success: false, error: err.message });
    }
  }

  // Also send an admin copy of each distinct product type (500ml, 1L, 5L) to littlecodr@gmail.com
  console.log("\n--> Sending admin verification copy to littlecodr@gmail.com...");
  try {
    const sampleLead = LEADS[0]; // Mukesh (5L)
    const resAdmin = await sendSingleEmail("littlecodr@gmail.com", "Little Codr (Admin Verification)", sampleLead);
    console.log(`    ✓ Admin copy sent! Message ID: ${resAdmin.messageId}`);
  } catch (err) {
    console.error(`    ✗ Admin copy failed: ${err.message}`);
  }

  console.log("\n=== DISPATCH SUMMARY ===");
  console.table(results);
}

run().catch(console.error);
