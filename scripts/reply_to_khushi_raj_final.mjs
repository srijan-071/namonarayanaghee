import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";

if (!BREVO_API_KEY) {
  console.error("Error: BREVO_API_KEY is not defined in .env.local");
  process.exit(1);
}

const customerRecipient = {
  email: "khushiraj23k3@gmail.com",
  name: "Khushi Raj"
};

const adminRecipients = [
  { email: "littlecodr@gmail.com", name: "Admin (Verification)" },
  { email: "hurkinds@gmail.com", name: "Admin (Verification)" },
  { email: "namonarayana.contact@gmail.com", name: "Admin (Verification)" }
];

const orderDetails = {
  orderId: "z9cNOR9gMwHlC4sqkEn6",
  paymentId: "pay_TuOhenqWTq906T",
  disputeId: "disp_Tvb8G4iHvtgV6e",
  amount: "₹1,889.10",
  items: "Pure A2 Gir Cow Ghee 2.5 Litre (+ 3 Complimentary Festive Oils)",
  card: "RuPay ending in 1064"
};

function generateEmailHtml(isCcAdmin = false) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Re: Order Cancellation and Refund - Order ID #${orderDetails.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #24211E;">

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F2" style="background-color: #FAF8F2; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Container Card -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(78, 16, 19, 0.08); border: 1px solid #EAD7BC;">

          ${isCcAdmin ? `
          <!-- Admin Verification Header -->
          <tr>
            <td bgcolor="#FFF3CD" style="background-color: #FFF3CD; padding: 12px 20px; border-bottom: 2px solid #FFEEBA; color: #856404; font-size: 12px; font-weight: bold; text-align: center;">
              ⚠️ ADMIN VERIFICATION COPY: Dispatched to Khushi Raj &lt;khushiraj23k3@gmail.com&gt; and Admin Record.
            </td>
          </tr>` : ""}

          <!-- Brand Header -->
          <tr>
            <td bgcolor="#5E0B10" style="background: linear-gradient(135deg, #5E0B10 0%, #8A1B14 100%); padding: 28px 24px; text-align: center; border-bottom: 4px solid #D4A017;">
              <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 800; margin: 0 0 4px 0; letter-spacing: 1px; text-transform: uppercase;">
                NAMO NARAYANA
              </h1>
              <p style="color: #F5BD47; font-size: 11px; font-weight: 600; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
                Customer Support & Grievance Desk
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 30px 24px; color: #332B27; font-size: 14px; line-height: 1.7;">

              <p style="margin-top: 0; font-size: 15px;">
                Dear <strong>Ms. Khushi Raj</strong>,
              </p>

              <p>
                We acknowledge receipt of your latest communication regarding <strong>Order ID: #${orderDetails.orderId}</strong>.
              </p>

              <p>
                We note your explicit instructions:
              </p>
              <ul style="padding-left: 20px; margin: 10px 0; color: #4A352F;">
                <li>You have instructed our facility <strong>not to dispatch</strong> any replacement shipment or reschedule delivery.</li>
                <li>You prefer to have the total consideration of <strong>${orderDetails.amount}</strong> refunded via the formal banking dispute channel you initiated.</li>
              </ul>

              <!-- Confirmation Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#F8FBF8" style="background-color: #F8FBF8; border: 1px solid #C8E6C9; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 16px 20px; font-size: 13px;">
                    <strong style="color: #2E7D32; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">
                      ✅ Fulfillment & Banking Actions Confirmed:
                    </strong>
                    <div style="color: #1B5E20; line-height: 1.8;">
                      1. <strong>Dispatch Cancelled:</strong> In direct compliance with your request, the physical shipment has been completely halted and cancelled at our fulfillment center. No parcel will be dispatched to your Patna address.<br/>
                      2. <strong>Banking Channel Resolution Accepted:</strong> The full disputed amount of <strong>${orderDetails.amount}</strong> has already been deducted from our merchant balance and is held in escrow by the payment gateway/banking system under Dispute ID: <strong>${orderDetails.disputeId}</strong>.<br/>
                      3. <strong>Uncontested Settlement:</strong> To cooperate fully with your request and ensure a smooth resolution without further complications, our finance desk will not contest this chargeback. We will accept the dispute via Razorpay, enabling your card-issuing bank to credit the full amount of <strong>${orderDetails.amount}</strong> directly back to your original source payment method (<strong>${orderDetails.card}</strong>).
                    </div>
                  </td>
                </tr>
              </table>

              <p>
                As this matter is now being finalized through your card-issuing bank's official chargeback settlement cycle, the funds will reflect in your account statement according to your bank's standard turnaround schedule.
              </p>

              <p>
                Our internal records for Order Ref <strong>#${orderDetails.orderId}</strong> have been formally closed under cancellation. No further action or correspondence is required from your side.
              </p>

              <p>
                We appreciate your communication and wish you the very best.
              </p>

              <p style="margin-top: 25px; margin-bottom: 0;">
                Yours sincerely,<br/>
                <strong>Customer Support Desk</strong><br/>
                <em>Namo Narayana Ghee & Traditional Foods</em><br/>
                <span style="font-size: 12px; color: #7A4A3B;">Email: support@namonarayanaghee.store | care@namonarayanaghee.store</span><br/>
                <span style="font-size: 12px; color: #7A4A3B;">Website: www.namonarayanaghee.store</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#F5EFE6" style="background-color: #F5EFE6; padding: 16px 20px; text-align: center; font-size: 11px; color: #7A4A3B; border-top: 1px solid #EAD7BC;">
              This is an official communication regarding Order #${orderDetails.orderId} and Banking Dispute #${orderDetails.disputeId}.<br/>
              © 2026 Namo Narayana. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

async function sendBrevoEmail(toRecipient, subject, htmlContent) {
  const url = "https://api.brevo.com/v3/smtp/email";
  const payload = {
    sender: {
      name: "Namo Narayana Support",
      email: SENDER_EMAIL
    },
    to: [toRecipient],
    subject: subject,
    htmlContent: htmlContent
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo API Error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

async function main() {
  const subject = "Re: Order Cancellation and Refund - Order ID z9cNOR9gMwHlC4sqkEn6";

  console.log("=================================================================");
  console.log("DISPATCHING FINAL RESOLUTION EMAIL TO KHUSHI RAJ & ADMINS");
  console.log(`Customer: ${customerRecipient.name} <${customerRecipient.email}>`);
  console.log(`Order ID: ${orderDetails.orderId} | Amount: ${orderDetails.amount}`);
  console.log("=================================================================\n");

  // 1. Send to Customer
  try {
    console.log(`Sending to Customer: ${customerRecipient.name} <${customerRecipient.email}>...`);
    const customerHtml = generateEmailHtml(false);
    const result = await sendBrevoEmail(customerRecipient, subject, customerHtml);
    console.log(`✅ DISPATCHED to Customer (${customerRecipient.email})! Message ID: ${result.messageId}`);
  } catch (err) {
    console.error(`❌ FAILED sending to Customer:`, err.message);
  }

  // 2. Send to Admins for Verification
  console.log("\nSending copies to Admin for Verification...");
  for (const admin of adminRecipients) {
    try {
      console.log(`Sending to Admin: ${admin.name} <${admin.email}>...`);
      const adminHtml = generateEmailHtml(true);
      const result = await sendBrevoEmail(admin, `[ADMIN COPY] ${subject}`, adminHtml);
      console.log(`✅ DISPATCHED to Admin (${admin.email})! Message ID: ${result.messageId}`);
    } catch (err) {
      console.error(`❌ FAILED sending to Admin (${admin.email}):`, err.message);
    }
  }

  console.log("\n🎉 ALL FINAL EMAILS COMPLETED SUCCESSFULLY.");
}

main().catch(console.error);
