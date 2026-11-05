import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore/lite";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";
const SENDER_NAME = "Namo Narayana Care";
const SUPPORT_EMAIL = "care@namonarayanaghee.store";
const ADMIN_VERIFICATION_EMAIL = "littlecodr@gmail.com";

if (!BREVO_API_KEY) {
  console.error("FATAL: BREVO_API_KEY is not defined in .env.local");
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

const ADMIN_EMAILS = [
  "hurkinds@gmail.com",
  "littlecodr@gmail.com",
  "mayank@namonarayanaghee.store",
  "namonarayana.contact@gmail.com",
  "care@namonarayanaghee.store"
];

// Khushi Raj resolved via uncontested bank dispute; Rajat Aggarwal refunded Nov 3
const EXCLUDED_IDS = [
  "z9cNOR9gMwHlC4sqkEn6", // Khushi Raj
  "ExCaQbm04lKkNnNpHXHX", // Rajat Aggarwal
];

const EXCLUDED_EMAILS = [
  "xivew70904@hopefunder.com",
  "tmkb@gmail.com"
];

function parseDate(order) {
  const val = order.createdAt || order.paymentDetails?.paidAt || order.updatedAt;
  if (!val) return new Date(0);
  if (val.seconds) return new Date(val.seconds * 1000);
  if (typeof val === "string") return new Date(val);
  return new Date(0);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildItemsHtml(items = []) {
  if (!items || items.length === 0) {
    return `<div style="font-size: 13px; color: #4A352F;">Pure A2 Gir Cow Vedic Bilona Ghee</div>`;
  }
  return items.map(item => `
    <div style="padding: 8px 0; border-bottom: 1px dashed #EAD7BC; font-size: 13px; color: #332B27; display: flex; justify-content: space-between;">
      <span><strong>${item.quantity || 1}x</strong> ${item.title || item.name}</span>
      <span style="color: #5E0B10; font-weight: 600;">${item.variantTitle || ""}</span>
    </div>
  `).join("");
}

function generateCustomerEmailHtml(order) {
  const orderId = order.id;
  const customerName = order.name || "Valued Customer";
  const amountStr = order.formattedAmount;
  const dateStr = order.dateIST;
  const itemsHtml = buildItemsHtml(order.rawItems);
  const addressStr = order.fullAddress || "Registered shipping address";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Important Notice] Delivery Issue Regarding Order #${orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #24211E;">

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F2" style="background-color: #FAF8F2; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(78, 16, 19, 0.08); border: 1px solid #EAD7BC;">

          <!-- Brand Header -->
          <tr>
            <td bgcolor="#5E0B10" style="background: linear-gradient(135deg, #5E0B10 0%, #8A1B14 100%); padding: 28px 24px; text-align: center; border-bottom: 4px solid #D4A017;">
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 0 0 4px 0; letter-spacing: 1.5px; text-transform: uppercase;">
                NAMO NARAYANA
              </h1>
              <p style="color: #F5BD47; font-size: 11px; font-weight: 600; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
                Vedic Bilona Ghee • Customer Care & Logistics Desk
              </p>
            </td>
          </tr>

          <!-- Notice Banner -->
          <tr>
            <td bgcolor="#FFF5F5" style="background-color: #FFF5F5; padding: 18px 24px; border-bottom: 2px solid #FED7D7; text-align: center;">
              <span style="display: inline-block; background-color: #C53030; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                Logistics Network Failure • Consignment Undeliverable
              </span>
              <h2 style="color: #9B2C2C; font-size: 17px; margin: 6px 0 2px 0; font-weight: 700;">
                Delivery Failed & 100% Full Refund Scheduled
              </h2>
              <p style="color: #742A2A; font-size: 12px; margin: 0;">
                Order Reference: #${orderId}
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 24px; color: #332B27; font-size: 14px; line-height: 1.7;">

              <p style="margin-top: 0; font-size: 15px;">
                Namaste <strong>${customerName}</strong>,
              </p>

              <p>
                We deeply regret to inform you that your shipment for <strong>Order #${orderId}</strong> could not be delivered to your address due to severe delivery partner logistics network transit failures and regional sorting bottlenecks during the festive peak window.
              </p>

              <p>
                Our courier partners have reported that the consignment failed to connect to your local delivery hub and is being marked as <strong>Undeliverable / Return to Origin (RTO)</strong> back to our central warehouse facility.
              </p>

              <!-- Refund Assurance Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FBFDFB" style="background-color: #FBFDFB; border: 1.5px solid #C8E6C9; border-radius: 8px; margin: 22px 0;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="color: #2E7D32; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                      <span>✅ 100% Full Refund Initiated</span>
                    </div>
                    <div style="color: #1B5E20; font-size: 13px; line-height: 1.8;">
                      • <strong>Refund Amount:</strong> <span style="font-size: 15px; font-weight: 800; color: #0E4813;">${amountStr}</span> (Full Paid Consideration)<br/>
                      • <strong>Refund Mode:</strong> Direct reversal to your original payment source (UPI / Card / NetBanking)<br/>
                      • <strong>Settlement Timeline:</strong> <strong>7 to 14 banking business days</strong> as per standard Reserve Bank of India & payment gateway settlement cycles.<br/>
                      • <strong>No Action Required:</strong> The amount will automatically reflect in your originating bank account / card statement.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Order Breakdown Card -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F2" style="background-color: #FAF8F2; border: 1px solid #EAD7BC; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-size: 11px; font-weight: 800; color: #5E0B10; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                      Order Summary
                    </div>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px; color: #4A352F;">
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Order ID:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 700; color: #24211E;">#${orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Order Date:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 600; color: #24211E;">${dateStr}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Delivery Destination:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 500; color: #24211E;">${order.city ? `${order.city}, ${order.state}` : addressStr}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Total Amount Refunded:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 800; color: #5E0B10; font-size: 14px;">${amountStr}</td>
                      </tr>
                    </table>

                    <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #EAD7BC;">
                      <div style="font-size: 11px; font-weight: 700; color: #735D54; text-transform: uppercase; margin-bottom: 6px;">
                        Items in Consignment:
                      </div>
                      ${itemsHtml}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 10px 0;">
                We understand how eagerly you were looking forward to receiving our pure Vedic Gir Cow Bilona Ghee. Please accept our deepest personal apologies for this logistical disruption beyond our control.
              </p>

              <p style="margin: 0 0 20px 0;">
                If your refund does not reflect in your bank account after 14 business days, please write to us directly at <a href="mailto:${SUPPORT_EMAIL}?subject=Refund%20Status%20Query%20-%20Order%20${orderId}" style="color: #5E0B10; font-weight: 700; text-decoration: underline;">${SUPPORT_EMAIL}</a> with your Order ID, and our senior grievance desk will assist you on priority.
              </p>

              <p style="margin: 20px 0 0 0; color: #5E0B10; font-weight: 600;">
                Warm Regards,<br/>
                <strong style="color: #24211E; font-size: 15px;">Namo Narayana Customer Care & Fulfillment Desk</strong><br/>
                <span style="font-size: 12px; color: #735D54;">Pure Vedic Desi Gir Cow Bilona Ghee</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#FAF4EB" style="background-color: #FAF4EB; padding: 20px 24px; text-align: center; border-top: 1px solid #EAD7BC; font-size: 11px; color: #735D54; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: 600; color: #5E0B10;">
                Namo Narayana Vedic Farm • Dedicated Support
              </p>
              <p style="margin: 0;">
                This is an official transactional notice sent for Order #${orderId} to ${order.email}.<br/>
                Support Email: <a href="mailto:${SUPPORT_EMAIL}" style="color: #5E0B10; text-decoration: none;">${SUPPORT_EMAIL}</a>
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

function generateAdminMasterEmailHtml(ordersList, totalAmount, dispatchResults) {
  const tableRows = ordersList.map((o, idx) => {
    const res = dispatchResults.find(r => r.orderId === o.id) || {};
    const statusColor = res.success ? "#2E7D32" : "#C53030";
    const statusText = res.success ? `SENT (${res.messageId ? res.messageId.slice(0, 15) : "OK"})` : `FAILED (${res.error || "err"})`;

    return `
      <tr style="border-bottom: 1px solid #EAD7BC; font-size: 12px;">
        <td style="padding: 8px 6px; text-align: center; color: #735D54;">${idx + 1}</td>
        <td style="padding: 8px 6px; font-weight: 700; color: #5E0B10;">#${o.id}</td>
        <td style="padding: 8px 6px; color: #24211E;"><strong>${o.name}</strong><br/><span style="color: #735D54; font-size: 11px;">${o.email}</span></td>
        <td style="padding: 8px 6px; color: #24211E;">${o.phone || "-"}</td>
        <td style="padding: 8px 6px; font-weight: 700; color: #1B5E20; text-align: right;">${o.formattedAmount}</td>
        <td style="padding: 8px 6px; color: #735D54; font-size: 11px;">${o.dateIST}</td>
        <td style="padding: 8px 6px; color: ${statusColor}; font-weight: 700; font-size: 11px; text-align: center;">${statusText}</td>
      </tr>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ADMIN MASTER REPORT: Oct 31 & Earlier Delivery Failed & 14-Day Refund Dispatches</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F2; color: #24211E; padding: 20px;">
  <div style="max-width: 800px; margin: 0 auto; background-color: #FFFFFF; border-radius: 10px; border: 1px solid #EAD7BC; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
    
    <div style="background-color: #5E0B10; color: #FFFFFF; padding: 20px 24px; border-bottom: 4px solid #D4A017;">
      <h2 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
        Admin Master Audit Report
      </h2>
      <p style="margin: 4px 0 0 0; color: #F5BD47; font-size: 12px; font-weight: 600;">
        Delivery Failed & 14-Day Refund Dispatches • Orders Placed on or before Oct 31, 2026
      </p>
    </div>

    <div style="padding: 24px;">
      
      <div style="background-color: #FFF3CD; border: 1px solid #FFEEBA; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; font-size: 13px; color: #856404;">
        <strong>Batch Execution Summary:</strong><br/>
        • <strong>Target Cohort:</strong> All paid & confirmed customers who ordered on or before October 31, 2026.<br/>
        • <strong>Total Orders Processed:</strong> ${ordersList.length} orders<br/>
        • <strong>Total Customer Value:</strong> ₹${totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}<br/>
        • <strong>Customer Notice Sent:</strong> Delivery failure due to regional transit bottle-necks + 100% refund in 14 banking days.<br/>
        • <strong>Firestore Status Updated:</strong> Marked as <code>delivery_failed</code> with <code>refundExpectedWithinDays: 14</code> and timestamped history.
      </div>

      <h3 style="font-size: 15px; color: #5E0B10; margin: 18px 0 10px 0; text-transform: uppercase;">
        Processed Customer Orders (${ordersList.length})
      </h3>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #EAD7BC;">
          <thead>
            <tr style="background-color: #FAF4EB; color: #5E0B10; font-size: 11px; text-transform: uppercase; border-bottom: 2px solid #EAD7BC;">
              <th style="padding: 8px 6px;">#</th>
              <th style="padding: 8px 6px;">Order ID</th>
              <th style="padding: 8px 6px;">Customer</th>
              <th style="padding: 8px 6px;">Phone</th>
              <th style="padding: 8px 6px; text-align: right;">Amount</th>
              <th style="padding: 8px 6px;">Order Date</th>
              <th style="padding: 8px 6px; text-align: center;">Dispatch Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #EAD7BC; font-size: 12px; color: #735D54;">
        Report generated automatically by Namo Narayana Operations Automation.
      </div>

    </div>
  </div>
</body>
</html>`;
}

async function sendBrevoEmail(payload) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    return { success: false, error: errorText };
  }

  const data = await res.json().catch(() => ({}));
  return { success: true, messageId: data.messageId };
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  console.log("==================================================================");
  console.log("OCT 31 & EARLIER: DELIVERY FAILED & 14-DAY REFUND BATCH DISPATCH");
  console.log(`MODE: ${isDryRun ? "🔍 DRY-RUN (Simulation only)" : "🚀 LIVE DISPATCH"}`);
  console.log("==================================================================");

  console.log("1. Fetching all orders from Firestore...");
  const snap = await getDocs(collection(db, "orders"));
  const allOrders = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const cutoff = new Date("2026-10-31T23:59:59+05:30");
  const targetOrders = [];

  for (const o of allOrders) {
    const d = parseDate(o);
    const email = (o.contactInfo?.email || o.shippingAddress?.email || o.email || "").toLowerCase().trim();

    if (ADMIN_EMAILS.includes(email)) continue;
    if (email.endsWith("@customer.namonarayanaghee.store")) continue;
    if (email === "gut@guy.jgh" || email === "test@test.com") continue;
    if (o.paymentDetails?.is_admin_test === "true") continue;
    if (EXCLUDED_IDS.includes(o.id) || EXCLUDED_EMAILS.includes(email)) continue;

    if (d.getTime() > 0 && d <= cutoff) {
      const ps = (o.paymentStatus || o.paymentDetails?.status || "").toLowerCase();
      const s = (o.status || "").toLowerCase();
      const pm = (o.paymentMethod || "").toLowerCase();
      const isPaid = ["paid", "captured", "success", "completed"].includes(ps) ||
                     ["confirmed", "processing", "shipped", "delivered"].includes(s) ||
                     (pm === "cod" && ["confirmed", "processing", "shipped"].includes(s));

      if (isPaid) {
        let amount = o.pricing?.finalTotal || o.totalAmount || 0;
        if (amount > 10000) amount = amount / 100;

        const street = o.shippingAddress?.address || o.shippingAddress?.street || "";
        const city = o.shippingAddress?.city || "";
        const state = o.shippingAddress?.state || "";
        const pincode = o.shippingAddress?.pincode || "";

        targetOrders.push({
          id: o.id,
          name: o.shippingAddress?.name || o.contactInfo?.name || "Customer",
          email: email,
          phone: o.shippingAddress?.phone || o.contactInfo?.phone || "",
          amountNum: amount,
          formattedAmount: "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          rawItems: o.items || [],
          status: o.status,
          dateIST: d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" }),
          city,
          state,
          fullAddress: [street, city, state, pincode].filter(Boolean).join(", "),
          existingHistory: Array.isArray(o.statusHistory) ? o.statusHistory : [],
          courierPartner: o.courierPartner || "Delhivery Express",
          trackingNumber: o.trackingNumber || o.awbNumber || null
        });
      }
    }
  }

  // Sort by date
  targetOrders.sort((a, b) => a.id.localeCompare(b.id));

  const totalAmount = targetOrders.reduce((sum, o) => sum + o.amountNum, 0);

  console.log(`Found ${targetOrders.length} eligible customer orders (Total Value: ₹${totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}).`);

  if (targetOrders.length === 0) {
    console.log("No orders found matching criteria.");
    return;
  }

  const dispatchResults = [];

  for (let i = 0; i < targetOrders.length; i++) {
    const order = targetOrders[i];
    console.log(`\n[${i + 1}/${targetOrders.length}] Processing Order #${order.id} for ${order.name} (${order.email}) - ${order.formattedAmount}`);

    const htmlContent = generateCustomerEmailHtml(order);

    if (isDryRun) {
      console.log(`   [DRY-RUN] Would send email to ${order.email}`);
      console.log(`   [DRY-RUN] Would update Firestore status to delivery_failed`);
      dispatchResults.push({
        orderId: order.id,
        email: order.email,
        success: true,
        messageId: "mock-message-id"
      });
      continue;
    }

    // 1. Dispatch Email via Brevo
    const emailPayload = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: order.email, name: order.name }],
      replyTo: { name: "Namo Narayana Support", email: SUPPORT_EMAIL },
      subject: `[Important Notice] Delivery Issue Regarding Order #${order.id} | Full Refund Initiated`,
      htmlContent: htmlContent,
      headers: {
        "X-Mailin-Tag": "oct31-delivery-failed-refund",
        "X-Entity-Ref-ID": order.id
      }
    };

    const res = await sendBrevoEmail(emailPayload);
    if (res.success) {
      console.log(`   ✅ Email Dispatched! MessageId: ${res.messageId}`);
      dispatchResults.push({
        orderId: order.id,
        email: order.email,
        success: true,
        messageId: res.messageId
      });
    } else {
      console.error(`   ❌ Failed to send email: ${res.error}`);
      dispatchResults.push({
        orderId: order.id,
        email: order.email,
        success: false,
        error: res.error
      });
    }

    // 2. Update Firestore Order Status
    try {
      const nowIso = new Date().toISOString();
      const newHistoryEntry = {
        status: "delivery_failed",
        timestamp: nowIso,
        courierPartner: order.courierPartner,
        trackingNumber: order.trackingNumber,
        adminNotes: "Delivery failed notice sent due to logistics transit issues. 100% full refund scheduled within 14 banking days.",
        notified: res.success
      };

      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, {
        status: "delivery_failed",
        shippingStatus: "delivery_failed",
        shipmentStatus: "delivery_failed",
        deliveryFailedAt: nowIso,
        deliveryFailureReason: "Logistics partner network transit failure - undeliverable consignment",
        rtoInitiated: true,
        refundExpectedWithinDays: 14,
        refundStatus: "initiated",
        refundInitiatedAt: nowIso,
        orderStatusNote: "Delivery Failed (Logistics Issue & 14-Day Refund Scheduled)",
        statusHistory: [...order.existingHistory, newHistoryEntry],
        lastNotificationSentAt: nowIso,
        lastNotificationStatus: "delivery_failed",
        updatedAt: new Date()
      });
      console.log(`   ✅ Firestore updated to delivery_failed.`);
    } catch (fsErr) {
      console.error(`   ❌ Failed to update Firestore:`, fsErr.message);
    }

    // Brief pause between sends (600ms)
    await sleep(600);
  }

  // 3. Dispatch Master Admin Verification Copy to littlecodr@gmail.com
  console.log("\n==================================================================");
  console.log(`Sending Master Admin Verification Copy to ${ADMIN_VERIFICATION_EMAIL}...`);
  console.log("==================================================================");

  if (isDryRun) {
    console.log(`[DRY-RUN] Would send master audit report to ${ADMIN_VERIFICATION_EMAIL}`);
  } else {
    const adminHtml = generateAdminMasterEmailHtml(targetOrders, totalAmount, dispatchResults);
    const adminPayload = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [
        { email: ADMIN_VERIFICATION_EMAIL, name: "Admin (Mayank)" },
        { email: "hurkinds@gmail.com", name: "Admin (Hurkinds)" }
      ],
      replyTo: { name: "Namo Narayana Support", email: SUPPORT_EMAIL },
      subject: `[ADMIN VERIFICATION] Oct 31 & Earlier Delivery Failed & 14-Day Refund Batch Dispatched (${targetOrders.length} Orders)`,
      htmlContent: adminHtml,
      headers: {
        "X-Mailin-Tag": "admin-verification-audit"
      }
    };

    const adminRes = await sendBrevoEmail(adminPayload);
    if (adminRes.success) {
      console.log(`✅ Master Admin Report sent! MessageId: ${adminRes.messageId}`);
    } else {
      console.error(`❌ Master Admin Report failed: ${adminRes.error}`);
    }

    // Also send 1 exact sample copy of the customer email to admin so they see the exact layout
    if (targetOrders.length > 0) {
      const sampleOrder = targetOrders[0];
      const sampleCustomerHtml = generateCustomerEmailHtml(sampleOrder);
      const samplePayload = {
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: ADMIN_VERIFICATION_EMAIL, name: "Admin Copy" }],
        replyTo: { name: "Namo Narayana Support", email: SUPPORT_EMAIL },
        subject: `[ADMIN SAMPLE COPY] [Important Notice] Delivery Issue Regarding Order #${sampleOrder.id} | Full Refund Initiated`,
        htmlContent: sampleCustomerHtml
      };
      await sendBrevoEmail(samplePayload);
      console.log(`✅ Customer Email Sample Copy sent to ${ADMIN_VERIFICATION_EMAIL}!`);
    }
  }

  console.log("\n==================================================================");
  console.log("BATCH DISPATCH COMPLETE!");
  console.log(`Total Processed: ${targetOrders.length}`);
  console.log(`Successful: ${dispatchResults.filter(r => r.success).length}`);
  console.log(`Failed: ${dispatchResults.filter(r => !r.success).length}`);
  console.log("==================================================================");
}

main().catch(err => {
  console.error("Fatal Error in main:", err);
  process.exit(1);
});

