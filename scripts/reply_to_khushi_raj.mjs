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
  items: "Pure A2 Gir Cow Ghee 2.5 Litre (+ 3 Complimentary Festive Oils: Groundnut 250ml, Yellow Mustard 250ml, Mustard 250ml)",
  wrongAwb: "786758192312",
  orderDate: "October 31, 2026, 10:49 AM IST",
  address: "Rajeshwar Palace, Sukh Sansar Colony, Near Navya Grand Hotel, East Lakshmi Nagar, Khemnichak, Patna – 800030, Bihar"
};

function generateEmailHtml(isCcAdmin = false) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Re: Urgent: Order Cancellation and Full Refund Request - Order Ref ID #z9cNOR9gMwHlC4sqkEn6</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #24211E;">

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F2" style="background-color: #FAF8F2; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Container Card -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(78, 16, 19, 0.08); border: 1px solid #EAD7BC;">

          ${isCcAdmin ? `
          <!-- Admin Verification Header -->
          <tr>
            <td bgcolor="#FFF3CD" style="background-color: #FFF3CD; padding: 12px 20px; border-bottom: 2px solid #FFEEBA; color: #856404; font-size: 12px; font-weight: bold; text-align: center;">
              ⚠️ ADMIN VERIFICATION COPY: Dispatched to Khushi Raj &lt;khushiraj23k3@gmail.com&gt; and Admin Record.
            </td>
          </tr>` : ""}

          <!-- Brand Header -->
          <tr>
            <td bgcolor="#5E0B10" style="background: linear-gradient(135deg, #5E0B10 0%, #8A1B14 100%); padding: 32px 30px; text-align: center; border-bottom: 4px solid #D4A017;">
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: 1px; text-transform: uppercase;">
                NAMO NARAYANA
              </h1>
              <p style="color: #F5BD47; font-size: 12px; font-weight: 600; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
                Legal & Customer Grievance Cell
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 35px 30px; color: #332B27; font-size: 14px; line-height: 1.7;">

              <p style="margin-top: 0; font-size: 15px;">
                Dear <strong>Ms. Khushi Raj</strong>,
              </p>

              <p>
                We acknowledge receipt of your follow-up communication regarding <strong>Order Ref ID: #${orderDetails.orderId}</strong>.
              </p>

              <!-- Notice Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FDFBF7" style="background-color: #FDFBF7; border: 1px solid #EAD7BC; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 16px 20px; font-size: 13px;">
                    <strong style="color: #5E0B10; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">
                      📄 Formal Record & Order Particulars:
                    </strong>
                    <div style="color: #4A352F; line-height: 1.8;">
                      • <strong>Order ID:</strong> #${orderDetails.orderId}<br/>
                      • <strong>Razorpay Payment ID:</strong> ${orderDetails.paymentId}<br/>
                      • <strong>Order Placement:</strong> ${orderDetails.orderDate}<br/>
                      • <strong>Total Consideration:</strong> ${orderDetails.amount} (Paid Online via RuPay Card)<br/>
                      • <strong>Consignment:</strong> ${orderDetails.items}<br/>
                      • <strong>Delivery Address:</strong> ${orderDetails.address}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Section 1: Logistics Error Admission -->
              <h3 style="color: #5E0B10; font-size: 16px; margin: 25px 0 10px 0; border-bottom: 1px solid #F0E6D6; padding-bottom: 6px;">
                1. Acknowledgement of Internal Logistics Error
              </h3>
              <p>
                Following an internal verification of our fulfillment ledger, <strong>we explicitly acknowledge that an administrative logistics error occurred on the part of our dispatch desk</strong>. 
              </p>
              <p>
                An incorrect, unlinked internal consignment manifest number (<code>AWB #${orderDetails.wrongAwb}</code>) was inadvertently mapped to your order notification, while your actual package was detained in our sorting facility. We accept that this operational oversight provided erroneous tracking visibility on the Delhivery network, and our fulfillment desk has been officially reprimanded for this administrative fault.
              </p>

              <!-- Section 2: Legal & Contractual Framework -->
              <h3 style="color: #5E0B10; font-size: 16px; margin: 25px 0 10px 0; border-bottom: 1px solid #F0E6D6; padding-bottom: 6px;">
                2. Legal Terms of Sale & Delivery SLA Framework
              </h3>
              <p>
                While we take full ownership of the erroneous tracking communication, your demand for unilateral immediate cancellation and allegations of statutory default must be evaluated strictly against the legally binding terms of sale:
              </p>
              <ul style="padding-left: 20px; margin: 10px 0; color: #4A352F;">
                <li style="margin-bottom: 8px;">
                  <strong>Binding Agreement (Terms of Service, Section 3):</strong> Under the <em>Information Technology Act, 2000</em> and the <em>Indian Contract Act, 1872</em>, completing online checkout constitutes a legally executed contract. Section 3 of our published Terms explicitly provides: <em>"Please review your order carefully before submitting, as Namo Narayana may be unable to accommodate cancellation requests after an order is accepted and enters processing."</em>
                </li>
                <li style="margin-bottom: 8px;">
                  <strong>Perishable Food Commodity (Refund Policy):</strong> Our Pure A2 Gir Cow Bilona Ghee is a fresh, handcrafted agricultural dairy commodity churned and packaged specifically upon order. Under the <em>Consumer Protection (E-Commerce) Rules, 2020</em> and our Refund Policy, perishable food goods that have entered the packing and sorting phase cannot be unilaterally cancelled upon arbitrary post-placement demand.
                </li>
                <li style="margin-bottom: 8px;">
                  <strong>Standard Shipping SLA (Shipping Policy):</strong> Your order was confirmed on <strong>Saturday, October 31, 2026</strong>. As published in our Shipping Policy, order processing takes 1 to 2 business days, and interstate standard transit from our northern facility to Patna, Bihar takes <strong>3 to 7 business days</strong>. Excluding Sunday (November 1), only <strong>two business days</strong> had elapsed when you initiated cancellation demands on November 3.
                </li>
              </ul>

              <!-- Section 3: The Chargeback Conflict -->
              <h3 style="color: #5E0B10; font-size: 16px; margin: 25px 0 10px 0; border-bottom: 1px solid #F0E6D6; padding-bottom: 6px;">
                3. Banking Chargeback Protocol & Current Fund Status
              </h3>
              <p>
                Our payment gateway partner (Razorpay) has notified us that on <strong>November 3, 2026 at 11:37 AM</strong>, you formally initiated a banking Chargeback Dispute:
              </p>
              <div style="background-color: #FFF5F5; border-left: 4px solid #C53030; padding: 12px 16px; margin: 15px 0; font-size: 13px; color: #742A2A;">
                <strong>Active Banking Dispute Details:</strong><br/>
                • <strong>Dispute ID:</strong> ${orderDetails.disputeId}<br/>
                • <strong>Disputed Amount:</strong> ${orderDetails.amount}<br/>
                • <strong>Card Used:</strong> RuPay ending in 1064<br/>
                • <strong>Ground Cited:</strong> <em>"Goods or services not received"</em>
              </div>
              <p>
                Under Reserve Bank of India (RBI) and National Payments Corporation of India (NPCI) chargeback regulations, <strong>the disputed sum of ₹1,889.10 has already been automatically debited from our merchant balance and placed under banking escrow</strong>. 
              </p>
              <p>
                <strong>As a matter of statutory banking protocol, a merchant CANNOT simultaneously issue an in-house refund for a transaction currently subject to active bank dispute adjudication</strong>, as doing so would trigger a fraudulent duplicate debit. Demanding a direct merchant refund while simultaneously locking the funds via a bank chargeback is legally contradictory.
              </p>

              <!-- Section 4: Response to Escalation Threats -->
              <h3 style="color: #5E0B10; font-size: 16px; margin: 25px 0 10px 0; border-bottom: 1px solid #F0E6D6; padding-bottom: 6px;">
                4. Rebuttal to Statutory Escalation Notice
              </h3>
              <p>
                Namo Narayana is an FSSAI-licensed, GST-compliant corporate enterprise operating with complete legal transparency. Threatening escalation to authorities within 48 to 72 hours of placing an interstate weekend order—where the product is an authentic perishable food consignment actively being fulfillment-processed and where you have already availed banking dispute arbitration—is legally premature and unsupported by consumer jurisprudence.
              </p>

              <!-- Section 5: The Operative Resolution -->
              <div style="background-color: #F8FBF8; border: 2px solid #2E7D32; border-radius: 10px; padding: 18px 20px; margin: 25px 0;">
                <h4 style="color: #1B5E20; margin: 0 0 10px 0; font-size: 15px; text-transform: uppercase;">
                  ⚖️ OPERATIVE RESOLUTION & PATH FORWARD
                </h4>
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #2E7D32; line-height: 1.6;">
                  We have resolved to handle this matter with complete institutional integrity. You have two legal options:
                </p>
                <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #1B5E20; line-height: 1.7;">
                  <li style="margin-bottom: 10px;">
                    <strong>Expedited Re-Shipment (Recommended):</strong> Our management has intervened directly. A <strong>fresh, prioritized consignment of your Pure A2 Gir Cow Ghee (2.5L) along with your 3 complimentary cold-pressed festive oils</strong> is being dispatched directly from our Vedic facility via priority express courier with a genuine, live, verified tracking AWB to your doorstep at Rajeshwar Palace, Patna. Upon successful physical receipt, you will be required to notify your card-issuing bank to close dispute <code>${orderDetails.disputeId}</code>.
                  </li>
                  <li>
                    <strong>Banking Adjudication:</strong> If you elect not to accept the re-shipment, you must allow the active bank dispute channel (<code>${orderDetails.disputeId}</code>) to run its statutory course with your card-issuing bank before the November 6 deadline. Our legal and finance team will submit our formal evidence representation, and the funds will be resolved as per banking chargeback protocols.
                  </li>
                </ol>
              </div>

              <p style="margin-bottom: 0;">
                Our logistics supervisor will communicate your verified new dispatch consignment credentials via SMS and email within the next 24 business hours.
              </p>

              <p style="margin-top: 25px; margin-bottom: 0;">
                Yours sincerely,<br/>
                <strong>Legal & Grievance Officer</strong><br/>
                <em>Namo Narayana Ghee & Traditional Foods</em><br/>
                <span style="font-size: 12px; color: #7A4A3B;">Email: support@namonarayanaghee.store | care@namonarayanaghee.store</span><br/>
                <span style="font-size: 12px; color: #7A4A3B;">Website: www.namonarayanaghee.store</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#F5EFE6" style="background-color: #F5EFE6; padding: 18px 24px; text-align: center; font-size: 11px; color: #7A4A3B; border-top: 1px solid #EAD7BC;">
              This is an official communication from Namo Narayana regarding Order Ref #${orderDetails.orderId}.<br/>
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
      name: "Namo Narayana Legal & Support",
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
  const subject = "Re: Urgent: Order Cancellation and Full Refund Request - Order Ref ID #z9cNOR9gMwHlC4sqkEn6";

  console.log("=================================================================");
  console.log("DISPATCHING LEGAL RESPONSE & APOLOGY TO KHUSHI RAJ & ADMINS");
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

  console.log("\n🎉 ALL LEGAL NOTIFICATION EMAILS COMPLETED SUCCESSFULLY.");
}

main().catch(console.error);

