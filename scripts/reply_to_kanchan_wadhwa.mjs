import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";

if (!BREVO_API_KEY) {
  console.error("FATAL: BREVO_API_KEY is not defined in .env.local");
  process.exit(1);
}

const customerRecipient = {
  email: "wadhwakanchan.8@gmail.com",
  name: "Kanchan Wadhwa"
};

const adminRecipient = {
  email: "littlecodr@gmail.com",
  name: "Admin (Mayank)"
};

const orderDetails = {
  orderId: "2OOnRTtPgZpYAAmmjDu7",
  customerOrderIdTyped: "200nRTtPgZpYAAm mjDu7",
  orderDate: "30 October 2026",
  amount: "₹854.10",
  paymentId: "pay_Tu8AGisFF5oZqJ",
  paymentRRN: "630365980347",
  paymentMethod: "UPI (7023756139@pthdfc)",
  refundInitiatedDate: "5 November 2026",
  expectedCreditWindow: "12 November – 19 November 2026",
  bankingDays: "7 to 14 banking business days",
  itemsText: "1x Pure A2 Gir Cow Ghee 1 Litre (Vedic Bilona) + 1x Kachi Ghani Mustard Oil 250 ml (Free Gift)",
  address: "Flat no. 104, RGS green apartment, Near Rajapur pul, Gate Number 32, Patna, Bihar – 800001"
};

function generateEmailHtml(isCcAdmin = false) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Re: Urgent: Refund Confirmation Required - Order #${orderDetails.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #24211E;">

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F2" style="background-color: #FAF8F2; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(78, 16, 19, 0.08); border: 1px solid #EAD7BC;">

          ${isCcAdmin ? `
          <!-- Admin Header Banner -->
          <tr>
            <td bgcolor="#FFF3CD" style="background-color: #FFF3CD; padding: 12px 20px; border-bottom: 2px solid #FFEEBA; color: #856404; font-size: 12px; font-weight: bold; text-align: center;">
              ⚠️ ADMIN VERIFICATION COPY: Dispatched to Kanchan Wadhwa &lt;wadhwakanchan.8@gmail.com&gt; &amp; Admin Record.
            </td>
          </tr>` : ""}

          <!-- Brand Header -->
          <tr>
            <td bgcolor="#5E0B10" style="background: linear-gradient(135deg, #5E0B10 0%, #8A1B14 100%); padding: 28px 24px; text-align: center; border-bottom: 4px solid #D4A017;">
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 0 0 4px 0; letter-spacing: 1.5px; text-transform: uppercase;">
                NAMO NARAYANA
              </h1>
              <p style="color: #F5BD47; font-size: 11px; font-weight: 600; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
                Customer Support &amp; Grievance Redressal Cell
              </p>
            </td>
          </tr>

          <!-- Ticket Status Banner -->
          <tr>
            <td bgcolor="#F3F8F3" style="background-color: #F3F8F3; padding: 14px 24px; border-bottom: 1px solid #D5E8D4; text-align: center;">
              <span style="display: inline-block; background-color: #2E7D32; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 3px 12px; border-radius: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                Ticket Status: Resolved &amp; Closed
              </span>
              <div style="color: #1B5E20; font-size: 13px; font-weight: 600; margin-top: 4px;">
                Refund Already Processed from Merchant End on 5 November 2026
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 24px; color: #332B27; font-size: 14px; line-height: 1.7;">

              <p style="margin-top: 0; font-size: 15px;">
                Dear <strong>Ms. Kanchan Wadhwa</strong>,
              </p>

              <p>
                We acknowledge receipt of your communication regarding <strong>Order ID: #${orderDetails.orderId}</strong> (referenced as <em>#${orderDetails.customerOrderIdTyped}</em>) placed on <strong>${orderDetails.orderDate}</strong> for the sum of <strong>${orderDetails.amount}</strong>.
              </p>

              <p>
                Please accept our sincere apologies for any technical difficulty or delivery bounce you experienced with our automated notification address. This email reaches you directly from our dedicated customer grievance desk, and your inquiry has been attended to on priority.
              </p>

              <!-- Resolution & Clarification Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FBFDFB" style="background-color: #FBFDFB; border: 1.5px solid #C8E6C9; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="color: #2E7D32; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
                      📋 Official Refund &amp; Banking Clarification:
                    </div>
                    <div style="color: #1B5E20; font-size: 13px; line-height: 1.8;">
                      • <strong>Merchant Action Completed:</strong> The 100% full refund of <strong>${orderDetails.amount}</strong> was already initiated from our merchant end on <strong>5th November 2026</strong> following the courier transit issue.<br/>
                      • <strong>Banking Settlement Cycle:</strong> As per standard Reserve Bank of India (RBI) and inter-bank clearing guidelines, gateway refunds require <strong>7 to 14 banking business days</strong> to clear the acquirer settlement network.<br/>
                      • <strong>Expected Date of Credit:</strong> You can expect the amount of <strong>${orderDetails.amount}</strong> to be credited to your original payment method between <strong>12th November and 19th November 2026</strong>.<br/>
                      • <strong>Destination:</strong> Reversed directly into the originating bank account linked to your original payment mode (<strong>${orderDetails.paymentMethod}</strong>).
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Transaction Reference Card -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F2" style="background-color: #FAF8F2; border: 1px solid #EAD7BC; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-size: 11px; font-weight: 800; color: #5E0B10; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                      Order &amp; Banking Identification Summary
                    </div>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px; color: #4A352F;">
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Official Order ID:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 700; color: #24211E;">#${orderDetails.orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Order Date:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 600; color: #24211E;">${orderDetails.orderDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Payment Transaction ID:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 600; color: #24211E; font-family: monospace;">${orderDetails.paymentId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Acquirer Settlement RRN:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 700; color: #5E0B10; font-family: monospace;">${orderDetails.paymentRRN}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Refund Amount:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 800; color: #5E0B10; font-size: 14px;">${orderDetails.amount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Expected Credit Window:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 700; color: #1B5E20;">${orderDetails.expectedCreditWindow}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Ticket Closure Notice -->
              <p style="margin: 20px 0 10px 0; color: #332B27;">
                As the refund instruction has already been formally initiated from our merchant end and is actively progressing through the inter-bank clearance cycle, <strong>we are closing this support ticket for now</strong>.
              </p>

              <p style="margin: 0 0 20px 0; color: #554841; font-size: 13px; line-height: 1.6;">
                In the rare event that the credit of <strong>${orderDetails.amount}</strong> does not appear in your account statement by <strong>19th November 2026</strong>, you may simply reply directly to this email with your updated bank statement, and our senior finance officers will personally liaise with the nodal bank authorities to resolve it immediately.
              </p>

              <p style="margin: 24px 0 0 0; color: #5E0B10; font-weight: 600;">
                Warm Regards,<br/>
                <strong style="color: #24211E; font-size: 15px;">Namo Narayana Customer Care &amp; Grievance Cell</strong><br/>
                <span style="font-size: 12px; color: #735D54;">Pure Vedic Desi Gir Cow Bilona Ghee • Support Desk</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#FAF4EB" style="background-color: #FAF4EB; padding: 18px 24px; text-align: center; border-top: 1px solid #EAD7BC; font-size: 11px; color: #735D54; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 600; color: #5E0B10;">
                Namo Narayana Vedic Farm • Dedicated Support &amp; Grievance Redressal
              </p>
              <p style="margin: 0;">
                Official Transactional Notice for Order #${orderDetails.orderId} | Dispatched to ${orderDetails.customerEmail || "registered customer"}
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

async function sendBrevoEmail(toRecipient, subject, htmlContent) {
  const url = "https://api.brevo.com/v3/smtp/email";

  const payload = {
    sender: {
      name: "Namo Narayana Care",
      email: SENDER_EMAIL
    },
    to: [toRecipient],
    replyTo: {
      name: "Namo Narayana Support Desk",
      email: "littlecodr@gmail.com"
    },
    subject: subject,
    htmlContent: htmlContent,
    headers: {
      "X-Mailin-Tag": "refund-inquest-resolution"
    }
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
  const subject = `Re: Urgent: Refund Confirmation Required - Order #${orderDetails.orderId}`;

  console.log("=================================================================");
  console.log("DISPATCHING RESOLUTION & TICKET CLOSURE EMAIL");
  console.log(`Customer: ${customerRecipient.name} <${customerRecipient.email}>`);
  console.log(`Admin Verification: ${adminRecipient.name} <${adminRecipient.email}>`);
  console.log(`Order ID: #${orderDetails.orderId} | Amount: ${orderDetails.amount}`);
  console.log(`Expected Credit Window: ${orderDetails.expectedCreditWindow}`);
  console.log("=================================================================\n");

  // 1. Send to Customer (Kanchan Wadhwa)
  try {
    console.log(`1. Sending to Customer: ${customerRecipient.name} <${customerRecipient.email}>...`);
    const customerHtml = generateEmailHtml(false);
    const result = await sendBrevoEmail(customerRecipient, subject, customerHtml);
    console.log(`✅ DISPATCHED to Customer (${customerRecipient.email})! Message ID: ${result.messageId}`);
  } catch (err) {
    console.error(`❌ FAILED sending to Customer:`, err.message);
    process.exit(1);
  }

  // 2. Send to Admin (littlecodr@gmail.com) for verification
  try {
    console.log(`\n2. Sending verification copy to Admin: ${adminRecipient.name} <${adminRecipient.email}>...`);
    const adminHtml = generateEmailHtml(true);
    const result = await sendBrevoEmail(adminRecipient, `[ADMIN VERIFICATION COPY] ${subject}`, adminHtml);
    console.log(`✅ DISPATCHED to Admin (${adminRecipient.email})! Message ID: ${result.messageId}`);
  } catch (err) {
    console.error(`❌ FAILED sending to Admin:`, err.message);
  }

  console.log("\n=================================================================");
  console.log("ALL DISPATCHES COMPLETED SUCCESSFULLY!");
  console.log("=================================================================");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

