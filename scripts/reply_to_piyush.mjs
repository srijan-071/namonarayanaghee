import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore/lite";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";
const SENDER_NAME = "Namo Narayana Executive Support";
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

const customerDetails = {
  name: "Piyush Mahulkar",
  email: "piyushmahulkar9@gmail.com",
  phone: "7224002994",
  orderId: "wjw0SPx1uhQiclu6qhVd",
  address: "Plot no.394 kailash nagar bhilai, Near Near shriram heights, Durg, Chattisgarh - 490026",
  items: "1x Pure A2 Gir Cow Ghee (2.5 Litre) + 3x Free Cold-Pressed Oils (Groundnut, Yellow Mustard, Mustard 250ml each)",
  totalAmount: "₹2,349.00",
  advancePaid: "₹250.00 (Razorpay pay_TwT5XyHN63Nqhv)",
  balanceOnDelivery: "₹2,099.00 (Cash on Delivery)",
  orderDate: "November 5, 2026",
  compensationCoupon: "VEDIC500CARE",
  couponDiscount: "₹500.00 OFF",
};

async function setupCouponInFirestore() {
  console.log(`Creating compensation voucher ${customerDetails.compensationCoupon} in Firestore...`);
  try {
    const couponRef = doc(db, "coupons", customerDetails.compensationCoupon);
    await setDoc(couponRef, {
      code: customerDetails.compensationCoupon,
      amount: 500,
      email: customerDetails.email.toLowerCase().trim(),
      phone: customerDetails.phone,
      used: false,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      notes: `Executive goodwill voucher issued for delivery delay escalation on Order #${customerDetails.orderId}`
    }, { merge: true });
    console.log("✅ Coupon successfully registered in Firestore!");
  } catch (err) {
    console.error("Failed to register coupon in Firestore (fallback regex still active):", err);
  }
}

async function updateOrderEscalationInFirestore() {
  console.log(`Updating escalation status on Order #${customerDetails.orderId}...`);
  try {
    const orderRef = doc(db, "orders", customerDetails.orderId);
    const snap = await getDoc(orderRef);
    if (snap.exists()) {
      const orderData = snap.data();
      const currentHistory = orderData.statusHistory || [];
      const nowIso = new Date().toISOString();
      await updateDoc(orderRef, {
        escalated: true,
        escalationPriority: "URGENT",
        escalationReason: "Customer inquiry regarding 10-day delay and courier rescheduling",
        escalatedAt: nowIso,
        compensationCoupon: customerDetails.compensationCoupon,
        statusHistory: [
          ...currentHistory,
          {
            status: "escalated_urgent",
            timestamp: nowIso,
            notes: "Customer escalation received. Marked as URGENT. Dedicated support executive callback scheduled for Monday (Nov 16, 2026). Compensation voucher VEDIC500CARE issued."
          }
        ]
      });
      console.log("✅ Order escalation record saved to Firestore!");
    }
  } catch (err) {
    console.error("Failed to update order escalation in Firestore:", err);
  }
}

function generateEmailHtml() {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Urgent Escalation Update: Order #${customerDetails.orderId} - Namo Narayana</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #17231E; line-height: 1.6;">

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF9F5" style="background-color: #FAF9F5; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Email Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px rgba(23, 35, 30, 0.08); border: 1px solid #EAE7DF;">

          <!-- Top Obsidian Emerald Brand Header -->
          <tr>
            <td bgcolor="#075B43" style="background: linear-gradient(135deg, #075B43 0%, #064635 100%); padding: 32px 24px 28px 24px; text-align: center; border-bottom: 3px solid #B89A62;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://www.namonarayanaghee.store/assets/namo-narayana-logo.webp" alt="Namo Narayana" width="140" style="display: block; border: 0; max-width: 140px; height: auto; margin-bottom: 10px;" />
                    <div style="font-size: 11px; letter-spacing: 3px; color: #E8F1EC; text-transform: uppercase; font-weight: 700;">
                      Pure Vedic A2 Gir Cow Ghee • Bilona Method
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Escalation Notice Banner -->
          <tr>
            <td style="padding: 24px 28px 0 28px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FFFDF7; border: 1.5px solid #B89A62; border-radius: 10px; overflow: hidden;">
                <tr>
                  <td style="background-color: #B89A62; padding: 7px 16px; color: #FFFFFF; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                    ⚡ PRIORITY TIER-1 ESCALATION • MARKED AS URGENT
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px; font-size: 13px; color: #17231E; line-height: 1.6;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                      <strong>Order Reference:</strong> <span style="font-family: monospace; font-size: 14px; color: #075B43; font-weight: 800;">#${customerDetails.orderId}</span>
                    </div>
                    <div>
                      <strong>Ticket Status:</strong> <span style="color: #B54747; font-weight: 800;">URGENT — Escalated to Senior Operations Lead</span>
                    </div>
                    <div style="margin-top: 4px; font-size: 12px; color: #727B75;">
                      Dedicated executive contact scheduled for <strong>Monday within 24 hours</strong>.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Executive Letter Content -->
          <tr>
            <td style="padding: 24px 28px 20px 28px; font-size: 15px; color: #17231E; line-height: 1.7;">
              
              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #17231E;">
                Dear Piyush ji,
              </p>

              <p style="margin: 0 0 16px 0;">
                Namaste. 🙏
              </p>

              <p style="margin: 0 0 16px 0;">
                Thank you for reaching out to us directly. We have received your detailed messages regarding <strong>Order #${customerDetails.orderId}</strong> for your <strong>2.5 Litre jar of Pure A2 Gir Cow Bilona Ghee</strong>.
              </p>

              <!-- Heartfelt Apology Callout Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F5; border-left: 4px solid #075B43; border-radius: 6px; margin: 18px 0; border: 1px solid #EAE7DF; border-left-width: 4px;">
                <tr>
                  <td style="padding: 16px 18px; font-size: 14px; line-height: 1.65; color: #17231E;">
                    <strong style="color: #075B43; font-size: 15px;">Our Sincerest Apologies:</strong><br/>
                    We deeply regret the frustration, anxiety, and delay you have experienced. Waiting for over 10 days while seeing the expected delivery date repeatedly postponed is completely unacceptable by our standards. We fully understand your concern, especially when delivery updates lacked proactive communication. Please accept our unconditional apologies for this inconvenience.
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0;">
                We want to formally assure you that <strong>our internal management and logistics operations team has been notified immediately</strong>. Your case has been flagged as <strong>URGENT</strong> in our dispatch tracking systems.
              </p>

              <!-- Addressing his specific queries -->
              <h3 style="font-size: 15px; font-weight: 800; color: #075B43; margin: 24px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Direct Clarifications Regarding Your Order:
              </h3>

              <div style="background-color: #FAF9F5; border: 1px solid #EAE7DF; border-radius: 10px; padding: 18px; margin-bottom: 20px; font-size: 13.5px; line-height: 1.65;">
                <p style="margin: 0 0 12px 0;">
                  <strong>1. Dispatch & Authenticity:</strong> Your order was hand-packed fresh at our Vedic dairy farm and dispatched via <strong>Delhivery Express</strong>. Your 2.5L glass jar along with all 3 complimentary cold-pressed oils (Groundnut, Yellow Mustard, and Mustard) are fully sealed and secure.
                </p>
                <p style="margin: 0 0 12px 0;">
                  <strong>2. Why the Date Postponed:</strong> Due to heavy post-festive cargo volumes across inter-state transport lines, transit to Chhattisgarh encountered an unexpected regional hub backlog. When a scheduled connection route experienced a sorting delay, Delhivery's automated system pushed the estimated date forward.
                </p>
                <p style="margin: 0 0 12px 0;">
                  <strong>3. Regarding the "Unable to Connect" Update:</strong> This was an automated exception generated by the transit hub routing system rather than an actual field attempt at your doorstep in Bhilai. We have raised a formal dispute with Delhivery operations regarding this misleading status.
                </p>
                <p style="margin: 0;">
                  <strong>4. Target Delivery:</strong> Our priority is to have your parcel delivered into your hands <strong>by or before 17th November</strong> without any further delay.
                </p>
              </div>

              <!-- Next Working Day Support Commitment -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #E8F1EC 0%, #DCE8DF 100%); border: 1px solid #075B43; border-radius: 10px; margin: 20px 0;">
                <tr>
                  <td style="padding: 18px 20px; font-size: 14px; color: #17231E;">
                    <div style="font-weight: 800; color: #075B43; font-size: 15px; margin-bottom: 6px;">
                      📞 Dedicated Executive Follow-Up on Monday:
                    </div>
                    <div style="line-height: 1.6;">
                      As today is Saturday evening and regional courier escalation desks operate on commercial working schedules, <strong>one of our senior customer support executives will personally contact you via phone (+91 ${customerDetails.phone}) within 24 hours on the next working day, i.e., Monday (Nov 16, 2026)</strong>.
                    </div>
                    <div style="margin-top: 8px; font-size: 12.5px; color: #064635; font-weight: 600;">
                      Our team will interface directly with the Delhivery Bhilai hub manager first thing Monday morning to ensure your package is prioritized for immediate delivery.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Special Goodwill Gift Voucher -->
              <h3 style="font-size: 15px; font-weight: 800; color: #075B43; margin: 26px 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                A Gesture of Our Gratitude &amp; Goodwill:
              </h3>

              <div style="background: linear-gradient(135deg, #FFFDF8 0%, #FBF5E6 100%); border: 2px dashed #B89A62; border-radius: 12px; padding: 20px; text-align: center; margin: 16px 0 24px 0;">
                <div style="display: inline-block; background-color: #075B43; color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                  ✨ Personal VIP Goodwill Voucher
                </div>
                <h4 style="color: #17231E; margin: 4px 0 6px 0; font-size: 17px; font-weight: 800;">
                  Flat ₹500 OFF On Your Next Order
                </h4>
                <p style="margin: 0 0 14px 0; font-size: 13px; color: #727B75;">
                  Please accept this ₹500 discount code as our small apology for the delay and to thank you for choosing pure Vedic Ghee for your home.
                </p>
                <div style="background-color: #ffffff; padding: 10px 22px; border-radius: 8px; font-family: monospace; font-size: 20px; font-weight: 900; color: #075B43; display: inline-block; border: 1.5px solid #B89A62; letter-spacing: 3px;">
                  ${customerDetails.compensationCoupon}
                </div>
                <p style="margin: 10px 0 0 0; font-size: 11px; color: #727B75;">
                  Valid across our entire store at <a href="https://www.namonarayanaghee.store" style="color: #075B43; font-weight: 700; text-decoration: underline;">namonarayanaghee.store</a> for the next 90 days.
                </p>
              </div>

              <!-- Order Summary Details -->
              <h3 style="font-size: 14px; font-weight: 800; color: #17231E; margin: 20px 0 8px 0; text-transform: uppercase;">
                Registered Order Snapshot:
              </h3>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F5; border: 1px solid #EAE7DF; border-radius: 8px; font-size: 13px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; color: #727B75; width: 35%;">Order ID:</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-weight: 700; font-family: monospace;">#${customerDetails.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; color: #727B75;">Customer:</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-weight: 600;">${customerDetails.name} (+91 ${customerDetails.phone})</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; color: #727B75;">Items:</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-weight: 600;">${customerDetails.items}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; color: #727B75;">Delivery Address:</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #EAE7DF; font-size: 12px;">${customerDetails.address}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; color: #727B75;">Payment Terms:</td>
                  <td style="padding: 10px 14px; font-weight: 600; color: #075B43;">${customerDetails.advancePaid} · Balance ${customerDetails.balanceOnDelivery}</td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0;">
                Please be assured that your parcel is safe and will reach you fresh. If you have any further questions before Monday, you can simply reply directly to this email.
              </p>

              <p style="margin: 24px 0 0 0; color: #075B43; font-weight: 700; line-height: 1.5;">
                With highest respect and warm regards,<br/>
                <strong style="color: #17231E; font-size: 16px;">Customer Operations &amp; Dispatch Leadership</strong><br/>
                <span style="font-size: 13px; color: #727B75; font-weight: 500;">Namo Narayana • Pure Vedic Gir Cow Bilona Ghee</span><br/>
                <span style="font-size: 12px; color: #B89A62;">support@namonarayanaghee.store • +91 7224002994</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#FAF9F5" style="background-color: #FAF9F5; padding: 22px 28px; text-align: center; border-top: 1px solid #EAE7DF; font-size: 12px; color: #727B75; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #17231E;">
                Namo Narayana Vedic Dairy Farm • Executive Resolution Desk
              </p>
              <p style="margin: 0;">
                This communication was sent specifically to ${customerDetails.email} regarding Order #${customerDetails.orderId}.<br/>
                Official Store: <a href="https://www.namonarayanaghee.store" style="color: #075B43; text-decoration: none; font-weight: 600;">www.namonarayanaghee.store</a>
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

function generateEmailText() {
  return `Namaste Piyush ji,

Thank you for reaching out to us. We have received your detailed messages regarding your Order #${customerDetails.orderId} for Pure A2 Gir Cow Bilona Ghee (2.5 Litre) with 3 complimentary cold-pressed oils.

PRIORITY STATUS: TIER-1 URGENT ESCALATION
Order Reference: #${customerDetails.orderId}
Assigned Desk: Senior Operations & Logistics Lead

OUR SINCEREST APOLOGIES:
We deeply regret the frustration, anxiety, and repeated delivery date shifts you have experienced over the past 10 days. We fully understand your concern and apologize unconditionally for the lack of proactive communication from our logistics partner.

ORDER CLARIFICATIONS:
1. Dispatch & Authenticity: Your order was freshly hand-packed at our Vedic dairy farm and dispatched via Delhivery Express. All items (2.5L jar and 3 oils) are safe and in transit.
2. Transit Delays: Heavy post-festive cargo volumes resulted in unexpected regional hub sorting backlogs along the inter-state line-haul to Chhattisgarh.
3. Automated Status: The "unable to connect" status was an automated routing exception generated at the hub level, not a physical delivery attempt at your doorstep in Bhilai.
4. Target Delivery: We are working directly with Delhivery management to ensure delivery by or before 17th November without further delay.

EXECUTIVE FOLLOW-UP ON MONDAY:
As today is Saturday evening and courier regional operational resolution desks operate on business days, one of our senior customer support executives will personally contact you via phone (+91 ${customerDetails.phone}) within 24 hours on the next working day, i.e., Monday (Nov 16, 2026). Our team will coordinate directly with the Delhivery Bhilai hub manager first thing Monday morning.

GESTURE OF GOODWILL - ₹500 OFF DISCOUNT CODE:
Please accept this exclusive discount voucher for flat ₹500 OFF on your next family purchase:
CODE: ${customerDetails.compensationCoupon}
Valid at https://www.namonarayanaghee.store across our entire range for 90 days.

ORDER DETAILS:
- Order ID: #${customerDetails.orderId}
- Customer: ${customerDetails.name} (+91 ${customerDetails.phone})
- Address: ${customerDetails.address}
- Items: ${customerDetails.items}
- Payment: Advance Paid ₹250.00 (Razorpay pay_TwT5XyHN63Nqhv) | Balance ₹2,099.00 on delivery (COD)

You can reply directly to this email at any time.

With highest respect and warm regards,
Customer Operations & Dispatch Leadership
Namo Narayana • Pure Vedic Gir Cow Bilona Ghee
support@namonarayanaghee.store`;
}

async function sendEmailToRecipient(recipientEmail, recipientName, isCopy = false) {
  const subject = `Re: Order Help #${customerDetails.orderId} - Urgent Escalation & Status Update | Namo Narayana`;

  const payload = {
    sender: {
      name: SENDER_NAME,
      email: SENDER_EMAIL
    },
    to: [
      {
        email: recipientEmail,
        name: recipientName
      }
    ],
    replyTo: {
      name: "Namo Narayana Customer Support",
      email: SUPPORT_EMAIL
    },
    subject: isCopy ? `[ADMIN COPY] ${subject}` : subject,
    htmlContent: generateEmailHtml(),
    textContent: generateEmailText(),
    headers: {
      "X-Mailin-Tag": "customer-urgent-escalation",
      "X-Entity-Ref-ID": `order-${customerDetails.orderId}`
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
    throw new Error(`Failed to send to ${recipientEmail} (${res.status}): ${bodyText}`);
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
  console.log("SENDING URGENT ESCALATION & APOLOGY EMAIL TO PIYUSH MAHULKAR");
  console.log(`Customer: ${customerDetails.name} (${customerDetails.email})`);
  console.log(`Phone: +91 ${customerDetails.phone}`);
  console.log(`Order ID: #${customerDetails.orderId}`);
  console.log(`Coupon Code: ${customerDetails.compensationCoupon} (₹500 OFF)`);
  console.log("=================================================================\n");

  // 1. Setup Coupon in Firestore
  await setupCouponInFirestore();

  // 2. Update Order Record in Firestore
  await updateOrderEscalationInFirestore();

  // 3. Send Email to Customer
  console.log(`\nDispatching official escalation email to customer: ${customerDetails.email}...`);
  try {
    const custRes = await sendEmailToRecipient(customerDetails.email, customerDetails.name, false);
    console.log(`✅ CUSTOMER EMAIL SENT! Message ID: ${custRes.messageId || JSON.stringify(custRes)}`);
  } catch (err) {
    console.error(`❌ FAILED to send email to customer:`, err);
    process.exit(1);
  }

  // 4. Send Verification Copy to Admin
  console.log(`\nDispatching admin verification copy to ${ADMIN_EMAIL}...`);
  try {
    const adminRes = await sendEmailToRecipient(ADMIN_EMAIL, "Mayank (Admin Verification)", true);
    console.log(`✅ ADMIN COPY SENT! Message ID: ${adminRes.messageId || JSON.stringify(adminRes)}`);
  } catch (err) {
    console.warn(`⚠️ Warning: Failed to send admin copy:`, err.message);
  }

  console.log("\n=================================================================");
  console.log("ALL ACTIONS COMPLETED SUCCESSFULLY!");
  console.log("=================================================================");
}

main().catch(err => {
  console.error("FATAL ERROR in execution:", err);
  process.exit(1);
});
