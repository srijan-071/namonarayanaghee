import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore/lite";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";
const SENDER_NAME = "Namo Narayana Executive Care";
const SUPPORT_EMAIL = "support@namonarayanaghee.store";
const ADMIN_EMAIL = "littlecodr@gmail.com";

if (!BREVO_API_KEY) {
  console.error("FATAL: BREVO_API_KEY is missing in .env.local");
  process.exit(1);
}

const firebaseConfig = {
  apiKey: "AIzaSyC5-gVyFeo-WLlI8RU4Tlhftci_1f5gOfc",
  authDomain: "namonarayanaghee.firebaseapp.com",
  projectId: "namonarayanaghee",
  storageBucket: "namonarayanaghee.firebasestorage.app",
  messagingSenderId: "468130197887",
  appId: "1:468130197887:web:3b1460a8ec522e1923aa4a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data structure for the 9 customer inquiries
const customers = [
  {
    key: "pranali",
    name: "Pranali Bangal",
    email: "pranalibangal2893@gmail.com",
    phone: "8104637689",
    orderId: "enPFvmMvJwgU2e8sxsPk",
    address: "Flat no 102 D wing M building new mhb colony, Near Ashtavinayak nagar borivali west, Mumbai, Maharashtra - 400092",
    items: "Pure A2 Gir Cow Ghee (2.5 Litre) + 3 Complimentary Cold-Pressed Oils (Groundnut, Yellow Mustard, Mustard 250ml each)",
    amount: "₹2,679.10",
    paymentType: "Paid Online",
    couponCode: "VEDIC500CARE",
    discountAmount: 500,
    subject: "Regarding your Order #enPFvmMvJwgU2e8sxsPk Details & Status Update - Namo Narayana",
    specificExplanation: "We noticed your inquiry stating that your payment was deducted but you did not receive order confirmation details immediately. Please be 100% assured: Your payment of ₹2,679.10 is safely received and verified, and your order for our 2.5 Litre Pure A2 Gir Cow Bilona Ghee is active and confirmed under Order ID #enPFvmMvJwgU2e8sxsPk. Our dispatch team is preparing your fresh Vedic batch and ensuring it reaches your Borivali West address as soon as possible.",
  },
  {
    key: "ankita",
    name: "Ankita Saha",
    email: "ankitasaha2244@gmail.com",
    phone: "9144865601",
    orderId: "rfzxrXMOt6nnjUpuS9qE",
    address: "Opposite Jadav Saha House, Bidut Sangha Club, North 24 Parganas, West Bengal - 743233",
    items: "Pure A2 Gir Cow Ghee (1 Litre) + Complimentary Cold-Pressed Mustard Oil (250ml)",
    amount: "₹854.10",
    paymentType: "Prepaid",
    couponCode: "VEDIC250CARE",
    discountAmount: 250,
    subject: "Re: Order rfzxrXMOt6nnjUpuS9qE - Delivery Status & Resolution Update | Namo Narayana",
    specificExplanation: "We understand your deep frustration regarding the prolonged courier delay along the West Bengal transit route. We sincerely apologize for the delay. Your order (#rfzxrXMOt6nnjUpuS9qE) was dispatched with Delhivery Express under Tracking Number 5746785678569. Our senior logistics team is actively coordinating with the regional sorting hub to clear the backlog and get your consignment delivered to your doorstep as soon as possible.",
  },
  {
    key: "shaalibhadra",
    name: "Shaalibhadra",
    email: "shalishah023@gmail.com",
    phone: "9173626056",
    orderId: "ZqtOf62rarVVIfFENwuE",
    address: "Registered Delivery Address",
    items: "Pure A2 Gir Cow Ghee (500 ml)",
    amount: "₹439.10",
    paymentType: "Prepaid",
    couponCode: "VEDIC100CARE",
    discountAmount: 100,
    subject: "Re: Where is my order ZqtOf62rarVVIfFENwuE - Order Status & Delivery Update | Namo Narayana",
    specificExplanation: "We received your message asking for your order delivery or refund. As our pure Bilona Ghee is handcrafted in small batches and your jar is already in the fulfillment pipeline, we do not cancel or refund orders. However, our team is personally tracking and expediting your shipment with the courier partner to ensure it reaches you safely and promptly.",
  },
  {
    key: "candycrunch",
    name: "Vikaran Thakur",
    email: "candycrunch2@gmail.com",
    phone: "9113970958",
    orderId: "e2CqBdnIk6CU7VRGRQ82 & #hIq5oncon5KBJaIKkHkT",
    address: "Wing5 - 201, Ark Cloud City, 3G Homes Crimson Layout, Kadugodi, Whitefield, Bangalore - 560067",
    items: "Pure A2 Gir Cow Ghee (1 Litre x 2 jars per order) + Complimentary Cold-Pressed Oils",
    amount: "₹1,703.10 & ₹1,708.20",
    paymentType: "100% Prepaid",
    couponCode: "VEDIC500CARE",
    discountAmount: 500,
    subject: "Urgent Update: Order #e2CqBdnIk6CU7VRGRQ82 & #hIq5oncon5KBJaIKkHkT - Namo Narayana",
    specificExplanation: "We received your inquiry regarding both your orders and your request for cancellation/refund due to kitchen stock running low. Please understand that because our pure Vedic Ghee consignments are packed in protective glass jars and already assigned in fulfillment, cancellations or refunds cannot be processed. Instead, our team is treating both your shipments with high priority—coordinating with the Bangalore Whitefield delivery hub to accelerate handover so you receive your pure ghee without further disruption.",
  },
  {
    key: "monika",
    name: "Monika Sondhi",
    email: "sondhimonika10@gmail.com",
    phone: "9987586510",
    orderId: "YpaTSbHa9adxtMU0sXNT",
    address: "A block Flat AM04, Near J.P. Nagar Metro Pillar #70, Bangalore, Karnataka - 560078",
    items: "Pure A2 Gir Cow Ghee (500 ml)",
    amount: "₹439.10",
    paymentType: "Prepaid",
    couponCode: "VEDIC100CARE",
    discountAmount: 100,
    subject: "Re: Order Help #YPaTSbHa9adxtMU0sXNT - Official Status & Assistance | Namo Narayana",
    specificExplanation: "We sincerely apologize for any difficulty in reaching us on phone and for the delay in your order. Your order #YpaTSbHa9adxtMU0sXNT for our 500ml A2 Gir Cow Ghee is active and safely confirmed. Our customer operations desk is following up directly with Delhivery Express to expedite delivery to your Bangalore J.P. Nagar address as soon as possible.",
  },
  {
    key: "raghav",
    name: "Raghav Dhingra",
    email: "raghavd275@gmail.com",
    phone: "8572042445",
    orderId: "Ct6HJgvbSfmyeWm2XWas",
    address: "#387 Huda Part 2, Near Back side of MN College, Kurukshetra, Haryana - 136135",
    items: "Pure A2 Gir Cow Ghee (1 Litre) + Complimentary Cold-Pressed Mustard Oil (250ml)",
    amount: "₹854.10",
    paymentType: "Prepaid",
    couponCode: "VEDIC250CARE",
    discountAmount: 250,
    subject: "Re: Namo Narayana Order & Support Inquiry - Order #Ct6HJgvbSfmyeWm2XWas Status",
    specificExplanation: "We completely understand your concern regarding waiting 10 days for your 1 Litre jar of Pure Gir Cow Ghee to Kurukshetra. We sincerely apologize for this unexpected delay. Your order is safely in transit with Delhivery Express. Our logistics team is actively coordinating with the regional Haryana line-haul to ensure your parcel reaches your doorstep as soon as possible.",
  },
  {
    key: "ashwani",
    name: "Ashwani Mittal",
    email: "mittal.ashwani60@gmail.com",
    phone: "9888473043",
    orderId: "nqeVZsCkuRy4d9Hv65Li",
    address: "H No 26, Sector-18, Near In front of park, Panchkula, Haryana - 134109",
    items: "Pure A2 Gir Cow Ghee (1 Litre) + Complimentary Cold-Pressed Mustard Oil (250ml)",
    amount: "₹749.00",
    paymentType: "Prepaid",
    couponCode: "VEDIC250CARE",
    discountAmount: 250,
    subject: "Re: Inquiry regarding my order status #nqeVZsCkuRy4d9Hv65Li - Namo Narayana",
    specificExplanation: "Thank you for reaching out with your details. We apologize for missing the November 10th estimated date for your Panchkula address. Your order #nqeVZsCkuRy4d9Hv65Li is confirmed, freshly packed, and our logistics team is actively tracking the courier transit to ensure your Pure A2 Ghee jar is delivered to you as soon as possible.",
  },
  {
    key: "siraj",
    name: "MD Siraj",
    email: "sirajdesigner01@gmail.com",
    phone: "8617353673",
    orderId: "X2ReFavGf7Ty5Eov0uNx",
    address: "Chunavati More, East Dhantala, Satellite Township, Jalpaiguri, West Bengal - 734015",
    items: "Pure A2 Gir Cow Ghee (1 Litre) + Complimentary Cold-Pressed Mustard Oil (250ml)",
    amount: "₹949.00",
    paymentType: "Prepaid",
    couponCode: "VEDIC250CARE",
    discountAmount: 250,
    subject: "Re: Urgent Request regarding Order #X2ReFavGf7Ty5Eov0uNx - Delivery Status | Namo Narayana",
    specificExplanation: "We have carefully noted your message regarding your shipment encountering a delivery issue with the courier. Please note that as our authentic Vedic Ghee consignments are already packed and in transit/courier custody, we do not process refunds or cancellations. However, our senior dispatch desk has intervened with Delhivery Express to arrange a priority delivery re-attempt to your Jalpaiguri address so you receive your fresh 1 Litre jar as soon as possible.",
  },
  {
    key: "swapnil",
    name: "Swapnil Chitte",
    email: "chittesnil595@gmail.com",
    phone: "9372755316",
    orderId: "vXESbzsdR5mNI8pk1wzv",
    address: "Building no 56, Flat no 1007, Gurukrupa Anantam, Kannamwar Nagar I, Vikhroli East, Mumbai - 400083",
    items: "Pure A2 Gir Cow Ghee (1 Litre) + Complimentary Cold-Pressed Mustard Oil (250ml)",
    amount: "₹854.10",
    paymentType: "Prepaid",
    couponCode: "VEDIC250CARE",
    discountAmount: 250,
    subject: "Re: Regarding the ghee order update - Order #vXESbzsdR5mNI8pk1wzv Details - Namo Narayana",
    specificExplanation: "Thank you for contacting us with the screenshot of your payment confirmation. Your order #vXESbzsdR5mNI8pk1wzv was safely verified and dispatched with Delhivery Express. We apologize for the delay in providing delivery timings. Our operations team is following up directly with the Mumbai logistics hub to ensure your fresh jar arrives at your Vikhroli East home as soon as possible.",
  }
];

async function registerVoucher(code, amount, email) {
  try {
    const couponRef = doc(db, "coupons", code);
    await setDoc(couponRef, {
      code,
      amount,
      email: email.toLowerCase().trim(),
      used: false,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Executive goodwill compensation voucher for transit delay resolution"
    }, { merge: true });
  } catch (err) {
    console.error(`Failed to register voucher ${code}:`, err.message);
  }
}

function buildHtmlEmail(c) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>${c.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #17231E; line-height: 1.6;">

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF9F5" style="background-color: #FAF9F5; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Email Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px rgba(23, 35, 30, 0.08); border: 1px solid #EAE7DF;">

          <!-- Obsidian Emerald Header -->
          <tr>
            <td bgcolor="#075B43" style="background: linear-gradient(135deg, #075B43 0%, #064635 100%); padding: 30px 24px 26px 24px; text-align: center; border-bottom: 3px solid #B89A62;">
              <img src="https://www.namonarayanaghee.store/assets/namo-narayana-logo.webp" alt="Namo Narayana" width="135" style="display: block; border: 0; max-width: 135px; height: auto; margin: 0 auto 8px auto;" />
              <div style="font-size: 11px; letter-spacing: 2.5px; color: #E8F1EC; text-transform: uppercase; font-weight: 700;">
                Pure Vedic A2 Gir Cow Ghee • Official Store
              </div>
            </td>
          </tr>

          <!-- Priority Notice Ribbon -->
          <tr>
            <td style="background-color: #E8F1EC; border-bottom: 1px solid #DCE8DF; padding: 12px 24px; font-size: 12px; font-weight: 700; color: #075B43; text-align: center;">
              ⚡ ORDER ASSISTANCE &amp; DISPATCH STATUS UPDATE • ORDER #${c.orderId}
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 26px 28px 20px 28px; font-size: 15px; color: #17231E; line-height: 1.7;">

              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700;">
                Dear ${c.name} ji,
              </p>

              <p style="margin: 0 0 16px 0;">
                Namaste. 🙏
              </p>

              <p style="margin: 0 0 16px 0;">
                Thank you for reaching out to us. We have received your inquiry regarding your <strong>Namo Narayana Pure Vedic A2 Gir Cow Ghee order (#${c.orderId})</strong>.
              </p>

              <!-- Personalized Order Status Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F5; border-left: 4px solid #075B43; border-radius: 6px; margin: 18px 0; border: 1px solid #EAE7DF; border-left-width: 4px;">
                <tr>
                  <td style="padding: 16px 18px; font-size: 14px; line-height: 1.65; color: #17231E;">
                    <strong style="color: #075B43; font-size: 14.5px;">Order Status &amp; Clarification:</strong><br/>
                    ${c.specificExplanation}
                  </td>
                </tr>
              </table>

              <!-- Sincere Apology & Ongoing Action -->
              <p style="margin: 0 0 16px 0;">
                We are <strong>sincerely sorry for the delay and any inconvenience or worry caused to you</strong>. Due to high post-festive cargo volumes across inter-state courier line-hauls, shipments have faced unexpected regional sorting backlogs.
              </p>

              <p style="margin: 0 0 16px 0;">
                Please be assured that <strong>our internal team is actively checking your shipment and making our best efforts to get it delivered to you as soon as possible</strong>. We kindly request you to please have patience and wait a little while our operations team resolves the transit delay with the courier partner.
              </p>

              <!-- Goodwill Discount Voucher -->
              <h3 style="font-size: 14.5px; font-weight: 800; color: #075B43; margin: 24px 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                A Small Gesture of Our Gratitude &amp; Apology:
              </h3>

              <div style="background: linear-gradient(135deg, #FFFDF8 0%, #FBF5E6 100%); border: 2px dashed #B89A62; border-radius: 12px; padding: 18px; text-align: center; margin: 14px 0 22px 0;">
                <div style="display: inline-block; background-color: #075B43; color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                  ✨ Goodwill Privilege Voucher
                </div>
                <h4 style="color: #17231E; margin: 4px 0 6px 0; font-size: 16px; font-weight: 800;">
                  Flat ₹${c.discountAmount} OFF On Your Next Order
                </h4>
                <p style="margin: 0 0 12px 0; font-size: 12.5px; color: #727B75;">
                  Please accept this discount code for your next family order across our entire pure ghee and cold-pressed oil range.
                </p>
                <div style="background-color: #ffffff; padding: 8px 20px; border-radius: 8px; font-family: monospace; font-size: 19px; font-weight: 900; color: #075B43; display: inline-block; border: 1.5px solid #B89A62; letter-spacing: 2px;">
                  ${c.couponCode}
                </div>
                <p style="margin: 8px 0 0 0; font-size: 11px; color: #727B75;">
                  Valid for 90 days at <a href="https://www.namonarayanaghee.store" style="color: #075B43; font-weight: 700; text-decoration: underline;">namonarayanaghee.store</a>.
                </p>
              </div>

              <!-- Order Summary Snapshot -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F5; border: 1px solid #EAE7DF; border-radius: 8px; font-size: 13px; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; color: #727B75; width: 32%;">Order Reference:</td>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; font-weight: 700; font-family: monospace;">#${c.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; color: #727B75;">Items:</td>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; font-weight: 600;">${c.items}</td>
                </tr>
                <tr>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; color: #727B75;">Amount / Payment:</td>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #EAE7DF; font-weight: 600; color: #075B43;">${c.amount} (${c.paymentType})</td>
                </tr>
                <tr>
                  <td style="padding: 9px 12px; color: #727B75;">Shipping To:</td>
                  <td style="padding: 9px 12px; font-size: 12px;">${c.address}</td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0;">
                If you have any further questions or need additional information, please feel free to reply directly to this email at any time.
              </p>

              <p style="margin: 22px 0 0 0; color: #075B43; font-weight: 700; line-height: 1.5;">
                Warm Regards &amp; Gratitude,<br/>
                <strong style="color: #17231E; font-size: 15px;">Customer Operations &amp; Dispatch Team</strong><br/>
                <span style="font-size: 13px; color: #727B75; font-weight: 500;">Namo Narayana • Pure Vedic Gir Cow Bilona Ghee</span><br/>
                <span style="font-size: 12px; color: #B89A62;">support@namonarayanaghee.store</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#FAF9F5" style="background-color: #FAF9F5; padding: 18px 24px; text-align: center; border-top: 1px solid #EAE7DF; font-size: 11.5px; color: #727B75; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 700; color: #17231E;">
                Namo Narayana Vedic Farm • Customer Care Desk
              </p>
              <p style="margin: 0;">
                Official Website: <a href="https://www.namonarayanaghee.store" style="color: #075B43; text-decoration: none; font-weight: 600;">www.namonarayanaghee.store</a>
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

function buildTextEmail(c) {
  return `Namaste ${c.name} ji,

Thank you for contacting us regarding your Namo Narayana Pure Vedic A2 Gir Cow Ghee order (#${c.orderId}).

ORDER STATUS & CLARIFICATION:
${c.specificExplanation}

OUR SINCERE APOLOGIES:
We are sincerely sorry for the delay and any inconvenience caused. Due to heavy post-festive cargo volumes across courier transit routes, shipments have experienced unexpected regional sorting backlogs.

We want to assure you that our internal team is actively checking your shipment and making our best efforts to get it delivered to you as soon as possible. We kindly request you to please have patience and wait a little while our operations team resolves the transit delay.

GOODWILL APOLOGY DISCOUNT CODE:
Please accept this discount code for flat ₹${c.discountAmount} OFF on your next order:
CODE: ${c.couponCode}
Valid for 90 days across our entire store at https://www.namonarayanaghee.store

ORDER DETAILS:
- Order Reference: #${c.orderId}
- Items: ${c.items}
- Amount: ${c.amount} (${c.paymentType})
- Delivery Address: ${c.address}

You can reply directly to this email if you need any further assistance.

Warm Regards & Gratitude,
Customer Operations & Dispatch Team
Namo Narayana • Pure Vedic Gir Cow Bilona Ghee
support@namonarayanaghee.store`;
}

async function sendBrevo(toEmail, toName, subject, html, text) {
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
    htmlContent: html,
    textContent: text,
    headers: {
      "X-Mailin-Tag": "customer-delay-resolution"
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
    throw new Error(`Failed to send email to ${toEmail} (${res.status}): ${bodyText}`);
  }

  try {
    return JSON.parse(bodyText);
  } catch (e) {
    return { response: bodyText };
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("=================================================================");
  console.log(`DISPATCHING PERSONALIZED EXPLANATION & APOLOGY EMAILS TO ${customers.length} CUSTOMERS`);
  console.log("=================================================================\n");

  const results = [];

  for (let i = 0; i < customers.length; i++) {
    const c = customers[i];
    console.log(`\n[${i + 1}/${customers.length}] Processing: ${c.name} <${c.email}> | Order: #${c.orderId}`);

    // 1. Register Voucher in Firestore
    await registerVoucher(c.couponCode, c.discountAmount, c.email);

    // 2. Prepare HTML and Text
    const html = buildHtmlEmail(c);
    const text = buildTextEmail(c);

    // 3. Send Email via Brevo
    try {
      const res = await sendBrevo(c.email, c.name, c.subject, html, text);
      console.log(`   ✅ SENT to customer (${c.email})! Message ID: ${res.messageId}`);
      results.push({ name: c.name, email: c.email, orderId: c.orderId, success: true, messageId: res.messageId });
    } catch (err) {
      console.error(`   ❌ FAILED to send to ${c.email}:`, err.message);
      results.push({ name: c.name, email: c.email, orderId: c.orderId, success: false, error: err.message });
    }

    // Small delay between calls to be gentle on API rate limits
    await sleep(400);
  }

  // Also send an admin summary copy to littlecodr@gmail.com
  console.log(`\nDispatching summary audit copy to admin: ${ADMIN_EMAIL}...`);
  try {
    const adminHtml = `<h2>Customer Delay Resolution Summary</h2>
    <p>Personalized explanation, sincere apologies, and goodwill vouchers were dispatched to <strong>${results.filter(r => r.success).length}/${customers.length}</strong> customers.</p>
    <ul>
      ${results.map(r => `<li><strong>${r.name}</strong> (${r.email}) - Order #${r.orderId}: ${r.success ? `<span style="color: green;">SENT (ID: ${r.messageId})</span>` : `<span style="color: red;">FAILED (${r.error})</span>`}</li>`).join("")}
    </ul>`;

    await sendBrevo(ADMIN_EMAIL, "Admin Operations Audit", `[AUDIT REPORT] Customer Delay Explanations Dispatched (${results.length} Customers)`, adminHtml, "Customer delay explanations dispatched.");
    console.log("✅ Admin summary audit copy dispatched!");
  } catch (err) {
    console.warn("Warning: Admin audit email failed:", err.message);
  }

  console.log("\n=================================================================");
  console.log("ALL DISPATCHES COMPLETED!");
  console.log("=================================================================");
}

main().catch(err => {
  console.error("FATAL ERROR in main:", err);
  process.exit(1);
});
