import fetch from "node-fetch";

const BREVO_API_KEY = "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";

function buildEmailHtml(lead) {
  const { customerName, orderId, email, phone, address, productTitle, originalPrice, discountedPrice, discountAmount, freeGifts, productSlug, productImage } = lead;
  
  const giftsHtml = freeGifts && freeGifts.length > 0 ? `
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 18px; padding-top: 16px; border-top: 1px dashed #E0D3C1;">
      <tr>
        <td>
          <p style="margin: 0 0 8px 0; color: #9A2419; font-size: 13px; font-weight: 700; letter-spacing: 0.3px;">
            🎁 Complimentary Deepotsav Festive Gifts Included:
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #3A4739; font-size: 13px; line-height: 1.7;">
            ${freeGifts.map(g => `<li><strong>${g}</strong> (<span style="color: #24753B; font-weight: bold;">FREE DIWALI GIFT</span>)</li>`).join('\n')}
          </ul>
        </td>
      </tr>
    </table>
  ` : '';

  const reservationText = freeGifts && freeGifts.length > 0
    ? `your <strong>${productTitle}</strong> and <strong>${freeGifts.length} Free Cold-Pressed Festive Gifts</strong> are currently held in sacred reserved status.`
    : `your <strong>${productTitle}</strong> is currently held in sacred reserved status.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shubh Deepotsav - Namo Narayana Order #${orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #222B21; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text (visible in inbox preview, hidden in body) -->
  <div style="display: none; font-size: 1px; color: #FAF7F2; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Shubh Deepotsav ${customerName}! Your fresh Vedic Bilona Ghee batch is reserved for Diwali puja. Use code ELVISH10 for 10% off.
  </div>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; padding: 26px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #EADBCE; box-shadow: 0 8px 30px rgba(107, 20, 23, 0.08);">
          
          <!-- Festive Diwali Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6B1417 0%, #8A1B1E 50%, #540F11 100%); padding: 30px 24px 24px 24px; text-align: center; border-bottom: 3px solid #D49A3D;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 10px 0; color: #F5D38A; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;">
                      🪔 ✨ SHUBH DEEPOTSAV ✨ 🪔
                    </p>
                    <img src="https://www.namonarayanaghee.store/media/Namo_Narayana_Officail_Logo_df30ed.png" alt="Namo Narayana" width="145" style="display: block; max-width: 145px; height: auto; border: 0; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));" />
                    <p style="margin: 10px 0 0 0; color: #F3C068; font-size: 11px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;">
                      Pure A2 Gir Cow Vedic Bilona Ghee
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Festive Gold Sub-ribbon -->
          <tr>
            <td style="background-color: #FDF6E9; padding: 10px 20px; text-align: center; border-bottom: 1px solid #F0DFBF;">
              <p style="margin: 0; color: #8C550E; font-size: 12px; font-weight: 700; letter-spacing: 0.5px;">
                ✨ Handcrafted for Lakshmi Aarti, Akhand Diyas & Festive Delicacies ✨
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 34px 30px 24px 30px;">
              <h1 style="margin: 0 0 14px 0; color: #6B1417; font-size: 22px; font-weight: 700; line-height: 1.35;">
                Shubh Deepotsav, ${customerName} ji! 🪔
              </h1>
              
              <p style="margin: 0 0 18px 0; color: #3A4739; font-size: 15px; line-height: 1.65;">
                We noticed you recently started placing your Diwali festive order for our <strong>${productTitle}</strong>, but the payment remained pending.
              </p>

              <!-- Urgent Reservation Notice / Festive FOMO Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFF8EE; border: 1.5px solid #E8C888; border-left: 5px solid #C38936; border-radius: 10px; margin: 22px 0;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <p style="margin: 0 0 6px 0; color: #9A5A0A; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px;">
                      ⏳ Sacred Batch Reserved Temporarily for Your Home
                    </p>
                    <p style="margin: 0; color: #523712; font-size: 14px; line-height: 1.6;">
                      Because every batch of our Vedic Ghee is churned in auspicious morning hours using wooden bilona from desi Gir cows, demand for Deepotsav pujas is at its peak. ${reservationText} We can hold this fresh batch for a limited window before it is released for festive dispatch to waitlisted families.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Special Diwali Discount Code Highlight -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #FBF4EB 0%, #F5E8D3 100%); border: 1.5px dashed #C38936; border-radius: 12px; margin: 26px 0; text-align: center;">
                <tr>
                  <td style="padding: 22px 20px;">
                    <p style="margin: 0 0 10px 0; color: #6B1417; font-size: 14px; font-weight: 700;">
                      🪔 Claim an Extra <strong>10% Festive Deepotsav Discount</strong>:
                    </p>
                    <div style="display: inline-block; background-color: #6B1417; color: #FFFFFF; font-size: 20px; font-weight: 800; letter-spacing: 2.5px; padding: 11px 28px; border-radius: 8px; font-family: monospace; box-shadow: 0 3px 10px rgba(107, 20, 23, 0.25);">
                      ELVISH10
                    </div>
                    <p style="margin: 10px 0 0 0; color: #695133; font-size: 13px;">
                      (Automatically saves you <strong>₹${discountAmount}</strong> immediately on this festive order)
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Order Summary Card with Visuals -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FCFBF7; border: 1px solid #EAE0D3; border-radius: 12px; margin: 24px 0;">
                <tr>
                  <td style="padding: 22px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <!-- Product Image -->
                        <td width="130" valign="top" style="padding-right: 18px;">
                          <a href="https://www.namonarayanaghee.store/products/${productSlug}" target="_blank" style="text-decoration: none; display: block;">
                            <img src="${productImage}" alt="${productTitle}" width="130" style="display: block; width: 130px; border-radius: 10px; border: 1px solid #DFD5C6; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
                          </a>
                        </td>
                        <!-- Product Info -->
                        <td valign="top">
                          <p style="margin: 0 0 4px 0; color: #8A6842; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                            Order Ref: #${orderId}
                          </p>
                          <h3 style="margin: 0 0 8px 0; color: #6B1417; font-size: 17px; font-weight: 700; line-height: 1.3;">
                            ${productTitle}
                          </h3>
                          <p style="margin: 0 0 12px 0; color: #5A6A58; font-size: 13px; line-height: 1.45;">
                            100% Traditional Curd-Churned Bilona • Vedic Gir Cow Milk • Golden Granular Texture • Pure Festive Aroma
                          </p>
                          
                          <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="color: #8C998B; font-size: 13px; text-decoration: line-through; padding-right: 10px;">
                                ₹${originalPrice}
                              </td>
                              <td style="color: #6B1417; font-size: 19px; font-weight: 800;">
                                ₹${discountedPrice} <span style="font-size: 12px; color: #24753B; font-weight: 700;">(with ELVISH10)</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Free Gifts Section -->
                    ${giftsHtml}

                    <!-- Shipping Address -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 16px; padding-top: 14px; border-top: 1px solid #ECE3D7;">
                      <tr>
                        <td>
                          <p style="margin: 0; color: #586956; font-size: 12px; line-height: 1.6;">
                            📍 <strong>Festive Delivery To:</strong> ${address}<br>
                            🚚 <strong>Shipping Status:</strong> Priority Safe Dispatch (Free)
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Big Primary CTA Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0 20px 0;">
                <tr>
                  <td align="center">
                    <a href="https://www.namonarayanaghee.store/pay-proxy?orderId=${orderId}&amount=${discountedPrice}&name=${encodeURIComponent(customerName)}&email=${encodeURIComponent(email)}&phone=${phone}&productinfo=${encodeURIComponent(productTitle)}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #C38936 0%, #D89839 100%); color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 36px; border-radius: 9px; box-shadow: 0 4px 16px rgba(195, 137, 54, 0.4); text-align: center; letter-spacing: 0.3px;">
                      Complete Order & Save 10% (Pay ₹${discountedPrice}) 🪔 →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <a href="https://www.namonarayanaghee.store/products/${productSlug}" target="_blank" style="color: #6B1417; font-size: 13px; font-weight: 600; text-decoration: underline;">
                      Or click here to view the ${productTitle} product page directly
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Personal Support & Diwali Warmth Note -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F5EE; border-radius: 10px; margin-top: 26px;">
                <tr>
                  <td style="padding: 18px 20px; font-size: 13px; color: #4B5B49; line-height: 1.65;">
                    <strong>Need assistance with payment or UPI?</strong><br>
                    If you faced any difficulty completing your payment via Google Pay, PhonePe, Paytm, or Card, simply reply directly to this email or WhatsApp/Call our dispatch desk at <strong>+91 8580532042</strong> / <strong>+91 8816035157</strong>.
                  </td>
                </tr>
              </table>

              <p style="margin: 28px 0 0 0; color: #6B1417; font-size: 14px; line-height: 1.65;">
                May this sacred Deepotsav illuminate your home with boundless health, joy, and prosperity! 🙏🪔<br><br>
                Warm regards,<br>
                <strong>The Namo Narayana Team</strong><br>
                <span style="color: #8C6F48; font-size: 12px;">Pure Vedic Nutrition • Handcrafted Direct from Farm</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F3ECE1; padding: 24px; text-align: center; border-top: 1px solid #E5D7C5;">
              <p style="margin: 0 0 6px 0; color: #6B1417; font-size: 13px; font-weight: 700;">
                Namo Narayana Ghee
              </p>
              <p style="margin: 0 0 8px 0; color: #667563; font-size: 12px;">
                Pure Food. Stronger Bharat. 🪔 🙏
              </p>
              <p style="margin: 0; color: #8F9E8D; font-size: 11px;">
                © 2026 Namo Narayana. All rights reserved. | <a href="https://www.namonarayanaghee.store" target="_blank" style="color: #6B1417; text-decoration: underline;">namonarayanaghee.store</a>
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
    ? `• Complimentary Diwali Gifts Included:\n${freeGifts.map(g => `  - ${g} (FREE)`).join('\n')}\n`
    : '';

  return `Shubh Deepotsav, ${customerName} ji! 🪔

We noticed you recently started placing your Diwali festive order for our ${productTitle}, but the payment remained pending.

Your order reference: #${orderId}

⏳ SACRED BATCH RESERVED TEMPORARILY FOR YOUR HOME:
Because every batch of our Vedic Ghee is hand-churned in auspicious morning hours using wooden bilona from desi Gir cows, demand for Deepotsav pujas is at its peak. Your ${productTitle} is currently held in sacred reserved status. We can hold this fresh batch for a limited window before it is released for festive dispatch to waitlisted families.

SPECIAL 10% DIWALI DISCOUNT CODE:
Coupon Code: ELVISH10 (Extra 10% festive discount, saving ₹${discountAmount} instantly)

FESTIVE ORDER SUMMARY:
• Product: ${productTitle}
• Regular Price: ₹${originalPrice}
• Price with ELVISH10: ₹${discountedPrice}
${giftsText}• Shipping Address: ${address}
• Delivery: Priority Festive Dispatch (FREE)

COMPLETE YOUR ORDER:
👉 Direct Checkout Link:
https://www.namonarayanaghee.store/pay-proxy?orderId=${orderId}&amount=${discountedPrice}&name=${encodeURIComponent(customerName)}&email=${encodeURIComponent(email)}&phone=${phone}&productinfo=${encodeURIComponent(productTitle)}

👉 Or visit the product page directly:
https://www.namonarayanaghee.store/products/${productSlug}

NEED HELP OR PREFER DIRECT UPI?
If you faced any difficulty completing your payment via Google Pay, PhonePe, Paytm, or Card, simply reply directly to this email or reach out on WhatsApp/Call to our team at +91 8580532042 / +91 8816035157.

May this sacred Deepotsav illuminate your home with health, joy, and prosperity! 🪔 🙏

Warm regards,
The Namo Narayana Team
Pure Food. Stronger Bharat.
https://www.namonarayanaghee.store
`;
}

// Current Batch of Leads
const DIWALI_LEADS = [
  {
    orderId: "db0KLj1fyXU6EOz2nQk9",
    customerName: "Sunny Yadav",
    email: "giftofgod786@gmail.com",
    phone: "07007411788",
    address: "403 dhairya apartment, Varanasi, Uttar Pradesh 221010, India",
    productTitle: "Pure A2 Gir Cow Ghee (5 Litre)",
    originalPrice: "3,499",
    discountedPrice: "3,149",
    discountAmount: "350",
    freeGifts: ["Coconut Oil – 250 ml", "Groundnut Oil – 250 ml", "Mustard Oil – 500 ml"],
    productSlug: "pure-desi-cow-ghee-5-litre",
    productImage: "https://www.namonarayanaghee.store/media/6-5L_jpg_813cfb.webp"
  },
  {
    orderId: "QXvozSk9GZ1VjbeV542Q",
    customerName: "Harsh Tripathi",
    email: "harshtripathi582012@gmail.com",
    phone: "07235918321",
    address: "Sector 7, Gurgaon, Haryana 122001, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "eis9rO2FpDj8pGvLzFnV",
    customerName: "Arjun Khawaspur",
    email: "arjunkhawaspur@gmail.com",
    phone: "8053758158",
    address: "Khawaspur Gurugram Haryana, Gurgaon, Haryana 122503, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "ECU1xa3HLCYImzCqYNdD",
    customerName: "Piyush Singh",
    email: "piyushsinght.2909@gmail.com",
    phone: "8891919190",
    address: "2, Navjivan Society, Green Park Society, Varachha, Surat, Gujarat 395010, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "AdXgobw8NymrlfkZVEGX",
    customerName: "Sangeeta Verma",
    email: "madhavagarwal45@gmail.com",
    phone: "9896312306",
    address: "Aut inventore nihil, Bangalore, Karnataka 560048, India",
    productTitle: "Pure A2 Gir Cow Ghee (2.5 Litre)",
    originalPrice: "2,099",
    discountedPrice: "1,889",
    discountAmount: "210",
    freeGifts: ["Groundnut Oil – 250 ml", "Yellow Mustard Oil – 250 ml", "Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-2-5-litre",
    productImage: "https://www.namonarayanaghee.store/media/6-2p5_jpg_988c76.webp"
  },
  {
    orderId: "fx2PNHGvjGvmMk2xOpe7",
    customerName: "Rohit kumar",
    email: "rr4530736@gmail.com",
    phone: "9353795362",
    address: "Vill mahwary po gawan, Giridh, Jharkhand 815313, India",
    productTitle: "Pure A2 Gir Cow Ghee (500 ml)",
    originalPrice: "599",
    discountedPrice: "539",
    discountAmount: "60",
    freeGifts: [],
    productSlug: "pure-desi-cow-ghee-500-ml",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_cab5f3.webp"
  },
  {
    orderId: "fOxFrDWw4tHEhYwoR02v",
    customerName: "lalit meena",
    email: "ishu7034op@gmail.com",
    phone: "9257695687",
    address: "177 vigyan nagar, Jaipur, Rajasthan 302017, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "vbyo6BLrxzIRV2vuvGlB",
    customerName: "Coder DracWound",
    email: "coderdracwound@gmail.com",
    phone: "06200502358",
    address: "Mata Vaishno Devi Nagar, Phase 2, Ranchi, Jharkhand 834004, India",
    productTitle: "Pure A2 Gir Cow Ghee (2.5 Litre)",
    originalPrice: "2,099",
    discountedPrice: "1,889",
    discountAmount: "210",
    freeGifts: ["Groundnut Oil – 250 ml", "Yellow Mustard Oil – 250 ml", "Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-2-5-litre",
    productImage: "https://www.namonarayanaghee.store/media/6-2p5_jpg_988c76.webp"
  },
  {
    orderId: "DUIJm2zSQ6aXg4hvpO3V",
    customerName: "Amaan Khan",
    email: "amaankhan020202@gmail.com",
    phone: "9818867865",
    address: "562/1 Amtul haseen apartment 1st floor Street no 18 zakir nagar Okhla, South Delhi, Delhi 110025, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "DVfDRPdbyR12KzH1kYCP",
    customerName: "Jaikey sharma",
    email: "jaikesharma@6gmail.com",
    secondaryEmail: "jaikesharma6@gmail.com",
    phone: "7869864072",
    address: "Ward ni 12, Bhopal, Madhya Pradesh 463105, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "Kt8hAwOZ590RscCPa6LX",
    customerName: "Gaurav Srivastav",
    email: "gaurav.sri2914@gmail.com",
    phone: "9999970007",
    address: "601, UGF , NitiKhand -2, Ghaziabad, Uttar Pradesh 201014, India",
    productTitle: "Deepotsav Lakshmi Aarti & Kitchen Pack (1 Litre)",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "lF0oGVKlUqJ8TxQFgDsP",
    customerName: "Ramashankar Vishwakarma",
    email: "ramashankarv734@gmail.com",
    phone: "9935588965",
    address: "A-201 , charan singh complex saidulajab saket New Delhi, South West Delhi, Delhi 110030, India",
    productTitle: "Pure A2 Gir Cow Ghee (1 Litre)",
    originalPrice: "949",
    discountedPrice: "854",
    discountAmount: "95",
    freeGifts: ["Mustard Oil – 250 ml"],
    productSlug: "pure-desi-cow-ghee-1-litre",
    productImage: "https://www.namonarayanaghee.store/media/6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942_ea1640.webp"
  },
  {
    orderId: "7SHsF8sbga1pMa4bss4p",
    customerName: "Ajaypal Singh",
    email: "jobansarkaria0001@gmail.com",
    phone: "7986681535",
    address: "96, Sunshine avenue , backside GNDU Regional campus, Ladhewali, Jalandhar, Punjab 144007, India",
    productTitle: "Pure A2 Gir Cow Ghee (5 Litre)",
    originalPrice: "3,499",
    discountedPrice: "3,149",
    discountAmount: "350",
    freeGifts: ["Coconut Oil – 250 ml", "Groundnut Oil – 250 ml", "Mustard Oil – 500 ml"],
    productSlug: "pure-desi-cow-ghee-5-litre",
    productImage: "https://www.namonarayanaghee.store/media/6-5L_jpg_813cfb.webp"
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
    subject: `Action Required: Complete your Deepotsav order #${lead.orderId} (Diwali Batch Reserved 🪔)`,
    htmlContent: buildEmailHtml(lead),
    textContent: buildEmailText(lead),
    headers: {
      "X-Mailin-Tag": "order-recovery-fomo-diwali"
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
  console.log(`Starting Festive Diwali FOMO dispatch for ${DIWALI_LEADS.length} leads...\n`);
  const results = [];

  for (const lead of DIWALI_LEADS) {
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
          console.log(`    ✗ Fallback failed: ${errSec.message}`);
        }
      }

      await new Promise(r => setTimeout(r, 350));
    } catch (err) {
      console.error(`    ✗ Error: ${err.message}`);
      results.push({ orderId: lead.orderId, customer: lead.customerName, email: lead.email, success: false, error: err.message });
    }
  }

  // Also send an admin verification copy to littlecodr@gmail.com
  console.log("\n--> Sending Diwali admin verification copy to littlecodr@gmail.com...");
  try {
    const adminLead = DIWALI_LEADS[0]; // Sunny Yadav 5L
    const resAdmin = await sendSingleEmail("littlecodr@gmail.com", "Little Codr (Admin Diwali Test)", adminLead);
    console.log(`    ✓ Admin copy sent! Message ID: ${resAdmin.messageId}`);
  } catch (err) {
    console.error(`    ✗ Admin copy failed: ${err.message}`);
  }

  console.log("\n=== DISPATCH SUMMARY ===");
  console.table(results);
}

run().catch(console.error);
