import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";

if (!BREVO_API_KEY) {
  console.error("Error: BREVO_API_KEY is not defined in .env.local");
  process.exit(1);
}

const customerRecipient = {
  email: "rajatdaggarwal@gmail.com",
  name: "Advocate Rajat Aggarwal"
};

const adminRecipients = [
  { email: "hurkinds@gmail.com", name: "Admin (Verification)" },
  { email: "littlecodr@gmail.com", name: "Admin (Verification)" },
  { email: "namonarayana.contact@gmail.com", name: "Admin (Verification)" }
];

const orderDetails = {
  orderId: "ExCaQbm04lKkNnNpHXHX",
  paymentId: "pay_TqyeXixo2UxBSP",
  razorpayOrderId: "order_TqyZJnBIAH53N1",
  amount: "₹3,149.10",
  items: "Pure A2 Gir Cow Ghee 5 Litre (+ 3 Festive Gifts: Coconut Oil 250ml, Groundnut Oil 250ml, Mustard Oil 500ml)",
  awbNumber: "NNGNPHXHXIN",
  courierPartner: "Delhivery Express / Blue Dart",
  orderDate: "October 22, 2026",
  status: "Cancelled",
  deliveryFailureReason: "Logistics partner network transit failure / Hub misrouting",
  couponCode: "NAMO10"
};

function generateEmailHtml(isCcAdmin = false) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Re: Order ExCaQbm04lKkNnNpHXHX – Formal Apology, Full Refund Confirmation & Order Cancellation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #24211E;">

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F2" style="background-color: #FAF8F2; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(78, 16, 19, 0.08); border: 1px solid #EAD7BC;">

          ${isCcAdmin ? `
          <!-- Admin Notice Banner -->
          <tr>
            <td bgcolor="#FFF3CD" style="background-color: #FFF3CD; padding: 10px 20px; border-bottom: 1px solid #FFEEBA; color: #856404; font-size: 12px; font-weight: bold; text-align: center;">
              ⚠️ ADMIN VERIFICATION COPY: Delivered to customer (rajatdaggarwal@gmail.com) & Admin Team.
            </td>
          </tr>
          ` : ""}

          <!-- Top Brand Header -->
          <tr>
            <td bgcolor="#701619" style="background: linear-gradient(135deg, #701619 0%, #4E1013 100%); padding: 28px 24px; text-align: center; border-bottom: 3px solid #D6A53B;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://www.namonarayanaghee.store/assets/namo-narayana-logo.webp" alt="Namo Narayana Ghee" width="130" style="display: block; border: 0; max-width: 130px; height: auto; margin-bottom: 8px;" />
                    <div style="font-size: 11px; letter-spacing: 2.5px; color: #F5E1A4; text-transform: uppercase; font-weight: 700;">Pure Vedic A2 Gir Cow Ghee • Official Care</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conversational Letter -->
          <tr>
            <td style="padding: 28px 26px 16px 26px; line-height: 1.65; color: #24211E; font-size: 15px;">

              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #4E1013;">
                Dear Advocate Rajat Aggarwal,
              </p>

              <p style="margin: 0 0 16px 0;">
                We have received your email regarding Order <strong>#ExCaQbm04lKkNnNpHXHX</strong> placed on October 22, 2026, for <strong>Pure A2 Gir Cow Ghee (5 Litre)</strong>.
              </p>

              <!-- Apology Box -->
              <div style="background-color: #FDF4F4; border-left: 4px solid #701619; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #701619;">
                  Our Unreserved Apology
                </p>
                <p style="margin: 0; font-size: 14px; color: #4E1013; line-height: 1.55;">
                  We sincerely and deeply apologize for the anxiety, frustration, and delay this has caused you. We completely respect your profession as an advocate and understand why the prolonged &ldquo;In Transit&rdquo; status led you to believe there was bad faith. 
                  <br><br>
                  We wish to reassure you with utmost clarity: <strong>Namo Narayana was founded on principles of Vedic purity, ethics, and absolute transparency. There was never any intention of fraud, deception, or compromising your experience.</strong>
                </p>
              </div>

              <!-- Root Cause / Logistics Explanation -->
              <p style="margin: 0 0 14px 0; font-weight: 700; color: #4E1013; font-size: 15px;">
                What Happened to Your Consignment:
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #3A322D; line-height: 1.6;">
                Upon receiving your communication, our senior dispatch and operations team immediately audited consignment AWB <strong>${orderDetails.awbNumber}</strong> with our logistics partner (${orderDetails.courierPartner}).
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #3A322D; line-height: 1.6;">
                The AWB was genuine and generated at the time of packing; however, the carrier encountered an internal transit network and regional hub misrouting failure, preventing the consignment from moving forward or scanning properly. We have formally registered a severe escalation with the courier partner for failing to deliver the parcel to your address in Rewari. Because this logistics failure is completely unacceptable, we have pulled back the shipment and cancelled the order from our end.
              </p>

              <!-- Order Action & Refund Box -->
              <div style="background-color: #FAF8F2; border: 1.5px solid #D6A53B; border-radius: 10px; padding: 20px; margin: 22px 0;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #701619; font-weight: 800; margin-bottom: 6px;">
                        RESOLUTION DETAILS
                      </div>
                      <div style="font-size: 18px; font-weight: 800; color: #4E1013; margin-bottom: 12px;">
                        Full Refund of ₹3,149.10 Will Be Initiated Today by EOD
                      </div>
                    </td>
                  </tr>
                </table>

                <table width="100%" border="0" cellpadding="6" cellspacing="0" style="font-size: 13px; color: #3A322D; border-collapse: collapse; margin-top: 6px;">
                  <tr style="border-bottom: 1px solid #EAD7BC;">
                    <td style="font-weight: 600; padding: 6px 0; width: 45%;">Order ID:</td>
                    <td style="font-family: monospace; font-weight: 700; color: #701619;">${orderDetails.orderId}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #EAD7BC;">
                    <td style="font-weight: 600; padding: 6px 0;">Order Status:</td>
                    <td><span style="background-color: #F8D7DA; color: #721C24; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px;">CANCELLED FROM OUR END</span></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #EAD7BC;">
                    <td style="font-weight: 600; padding: 6px 0;">Product Ordered:</td>
                    <td style="font-weight: 600;">Pure A2 Gir Cow Ghee 5 Litre</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #EAD7BC;">
                    <td style="font-weight: 600; padding: 6px 0;">Total Amount Paid:</td>
                    <td style="font-weight: 800; color: #701619; font-size: 15px;">₹3,149.10</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #EAD7BC;">
                    <td style="font-weight: 600; padding: 6px 0;">Razorpay Payment ID:</td>
                    <td style="font-family: monospace; font-size: 12px; color: #555;">${orderDetails.paymentId}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600; padding: 6px 0;">Refund Timeline:</td>
                    <td style="font-weight: 700; color: #155724;">Initiated by EOD Today (Nov 2, 2026)</td>
                  </tr>
                </table>

                <p style="margin: 14px 0 0 0; font-size: 12px; color: #665C54; line-height: 1.5;">
                  * Note: Once initiated by EOD today via Razorpay, funds typically credit back to your original payment account/bank within 2 to 5 business days, depending on your bank&rsquo;s standard clearance cycle. You will also receive the automated Razorpay Refund confirmation email.
                </p>
              </div>

              <!-- Goodwill Gesture / NAMO10 Coupon -->
              <p style="margin: 0 0 14px 0; font-weight: 700; color: #4E1013; font-size: 15px;">
                Goodwill Discount for Future Orders:
              </p>
              <p style="margin: 0 0 14px 0; font-size: 14px; color: #3A322D; line-height: 1.6;">
                We are genuinely saddened that your first interaction with our brand was tarnished by a courier misrouting. While we understand if you feel let down, should you ever choose to give our Vedic ghee another chance in the future, we have set up an exclusive 10% discount coupon for you:
              </p>

              <div style="background: linear-gradient(135deg, #FDF8EE 0%, #FAF0D7 100%); border: 2px dashed #D6A53B; border-radius: 8px; padding: 14px; margin: 16px 0; text-align: center;">
                <div style="font-size: 12px; color: #701619; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Exclusive Goodwill Coupon</div>
                <div style="background-color: #FFFFFF; display: inline-block; padding: 6px 18px; border: 1.5px solid #D6A53B; border-radius: 6px; font-family: monospace; font-size: 18px; font-weight: 800; color: #701619; letter-spacing: 2px;">
                  ${orderDetails.couponCode}
                </div>
                <div style="font-size: 12px; color: #7A6348; margin-top: 6px;">Valid for 10% OFF on any future order if you wish to place a fresh order.</div>
              </div>

              <!-- Closing -->
              <p style="margin: 18px 0 12px 0; font-size: 14px; color: #3A322D; line-height: 1.6;">
                There is no need for any dispute, cyber complaint, or legal escalation—your grievance is completely justified, and we have proactively addressed it by cancelling the order and committing your 100% refund today.
              </p>

              <p style="margin: 0 0 20px 0; font-size: 14px; color: #3A322D; line-height: 1.6;">
                If you have any further questions or require immediate confirmation, please feel free to reply directly to this email or reach our leadership desk at <a href="mailto:namonarayana.contact@gmail.com" style="color: #701619; font-weight: bold;">namonarayana.contact@gmail.com</a>.
              </p>

              <p style="margin: 0 0 6px 0; font-size: 14px; color: #24211E;">
                Yours sincerely,
              </p>
              <p style="margin: 0; font-weight: 700; color: #4E1013; font-size: 15px;">
                Customer Relations & Escalation Desk<br>
                <span style="font-weight: 500; font-size: 13px; color: #701619;">Namo Narayana Vedic Farm</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#FAF8F2" style="background-color: #FAF8F2; padding: 20px 24px; border-top: 1px solid #EAD7BC; text-align: center; font-size: 12px; color: #7A6348;">
              <p style="margin: 0 0 4px 0; font-weight: bold; color: #4E1013;">
                Namo Narayana Pure Vedic Ghee
              </p>
              <p style="margin: 0 0 6px 0; font-size: 11px;">
                Traditional Bilona Curd Churned • Bharat 🙏
              </p>
              <p style="margin: 0; font-size: 11px; color: #9A8A7A;">
                Official store: <a href="https://www.namonarayanaghee.store" style="color: #701619; text-decoration: none;">namonarayanaghee.store</a> • Email: care@namonarayanaghee.store
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

function generateEmailText(isCcAdmin = false) {
  return `${isCcAdmin ? "[ADMIN VERIFICATION COPY - Customer: rajatdaggarwal@gmail.com]\n\n" : ""}Dear Advocate Rajat Aggarwal,

We have received your email regarding Order #ExCaQbm04lKkNnNpHXHX placed on October 22, 2026, for Pure A2 Gir Cow Ghee (5 Litre).

OUR UNRESERVED APOLOGY:
We sincerely and deeply apologize for the anxiety, frustration, and delay this has caused you. We completely respect your profession as an advocate and understand why the prolonged "In Transit" status led you to believe there was bad faith.

We wish to reassure you with utmost clarity: Namo Narayana was founded on principles of Vedic purity, ethics, and absolute transparency. There was never any intention of fraud, deception, or compromising your experience.

WHAT HAPPENED TO YOUR CONSIGNMENT:
Upon receiving your communication, our senior dispatch and operations team immediately audited consignment AWB ${orderDetails.awbNumber} with our logistics partner (${orderDetails.courierPartner}).

The AWB was genuine and generated at the time of packing; however, the carrier encountered an internal transit network and regional hub misrouting failure, preventing the consignment from moving forward or scanning properly. We have formally registered a severe escalation with the courier partner for failing to deliver the parcel to your address in Rewari. Because this logistics failure is completely unacceptable, we have pulled back the shipment and cancelled the order from our end.

RESOLUTION DETAILS:
- Order ID: ${orderDetails.orderId}
- Status: CANCELLED FROM OUR END
- Product Ordered: Pure A2 Gir Cow Ghee 5 Litre
- Total Amount Paid: ₹3,149.10
- Razorpay Payment ID: ${orderDetails.paymentId}
- Refund Action: 100% Full Refund will be initiated by End of Day (EOD) Today (November 2, 2026).

* Note: Once initiated by EOD today via Razorpay, funds typically credit back to your original payment account/bank within 2 to 5 business days depending on your bank's clearance cycle. You will also receive an automated Razorpay confirmation email.

GOODWILL DISCOUNT FOR FUTURE ORDERS:
We are genuinely saddened that your first interaction with our brand was tarnished by a courier misrouting. Should you ever choose to give our Vedic ghee another chance in the future, we have set up an exclusive 10% discount coupon for you:

COUPON CODE: ${orderDetails.couponCode}
(Valid for 10% OFF on any future order if you wish to place a fresh order)

There is no need for any dispute, cyber complaint, or legal escalation—your grievance is completely justified, and we have proactively addressed it by cancelling the order and committing your 100% refund today.

If you have any further questions or require immediate confirmation, please feel free to reply directly to this email or reach our leadership desk at namonarayana.contact@gmail.com.

Yours sincerely,
Customer Relations & Escalation Desk
Namo Narayana Vedic Farm
Official store: https://www.namonarayanaghee.store
Email: care@namonarayanaghee.store
`;
}

async function sendEmail(recipient, isCcAdmin = false) {
  const subject = `Re: Order ExCaQbm04lKkNnNpHXHX – Formal Apology, Full Refund Confirmation & Order Cancellation`;

  const payload = {
    sender: {
      name: "Namo Narayana Care",
      email: SENDER_EMAIL
    },
    to: [
      {
        email: recipient.email,
        name: recipient.name
      }
    ],
    replyTo: {
      name: "Namo Narayana Escalations",
      email: "namonarayana.contact@gmail.com"
    },
    subject: subject,
    htmlContent: generateEmailHtml(isCcAdmin),
    textContent: generateEmailText(isCcAdmin),
    headers: {
      "X-Mailin-Tag": "customer-refund-apology",
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
  console.log("DISPATCHING REFUND & APOLOGY EMAIL TO CUSTOMER AND ADMINS");
  console.log(`Customer: ${customerRecipient.name} <${customerRecipient.email}>`);
  console.log(`Order ID: ${orderDetails.orderId} | Refund: ${orderDetails.amount}`);
  console.log("=================================================================\n");

  // 1. Send to Customer
  console.log(`Sending to Customer: ${customerRecipient.name} <${customerRecipient.email}>...`);
  try {
    const custRes = await sendEmail(customerRecipient, false);
    console.log(`✅ DISPATCHED to Customer (${customerRecipient.email})! Message ID: ${custRes.messageId || JSON.stringify(custRes)}`);
  } catch (err) {
    console.error(`❌ FAILED for Customer (${customerRecipient.email}):`, err.message);
    process.exit(1);
  }

  // 2. Send to Admin Verification Recipients
  console.log("\nSending copies to Admin for Verification...");
  for (const admin of adminRecipients) {
    console.log(`Sending to Admin: ${admin.name} <${admin.email}>...`);
    try {
      const adminRes = await sendEmail(admin, true);
      console.log(`✅ DISPATCHED to Admin (${admin.email})! Message ID: ${adminRes.messageId || JSON.stringify(adminRes)}`);
    } catch (err) {
      console.error(`❌ FAILED for Admin (${admin.email}):`, err.message);
    }
  }

  console.log("\n🎉 ALL REFUND & APOLOGY NOTIFICATION EMAILS COMPLETED SUCCESSFULLY.");
}

main();

