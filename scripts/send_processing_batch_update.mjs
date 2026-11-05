import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore/lite";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "care@namonarayanaghee.store";
const SENDER_NAME = "Namo Narayana Care";
const SUPPORT_EMAIL = "care@namonarayanaghee.store";
const ADMIN_EMAIL = "littlecodr@gmail.com";

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

const TARGET_ORDER_IDS = [
  "wjw0SPx1uhQiclu6qhVd",
  "5vS8wmGWhkHp23FxtV2e",
  "ZU1dljFkoGIPWGlBwDhl",
  "nxpjfFp3D0pqi2VuA5vp",
  "GG50uo5QdQaqDPu2uPt1",
  "ITKHzcHKpLqdqczx1mFS",
  "M4NSoGJythM0NMpfJAPq",
  "1CJWJcn68hv3oZxYD9jq",
  "272NtGA4epoeTkpoDu9r",
  "ZErsX1eSvGBL0WJqDDif",
  "BVecxtZIZPKcyCyFQDET",
  "ksz39m21BVXsrf8dQUB7",
  "LI3IF0utzyE6ZM3RVfNe",
  "ZqtOf62rarVVIfFENwuE",
  "mAeOqWjETV1G09KG2fR8",
  "2D2TKXnjdH2UEy5k5JKz"
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildItemsHtml(items = [], freeGifts = []) {
  const combined = [];
  (items || []).forEach(it => {
    combined.push({
      name: it.title || it.name,
      variant: it.variantTitle || "",
      qty: it.quantity || 1,
      isGift: it.isGift || false
    });
  });

  return combined.map(it => `
    <div style="padding: 9px 0; border-bottom: 1px dashed #EAD7BC; font-size: 13px; color: #332B27; display: flex; justify-content: space-between; align-items: center;">
      <span>
        <strong>${it.qty}x</strong> ${it.name} ${it.variant ? `<span style="color: #5E0B10; font-size: 12px;">(${it.variant})</span>` : ""}
      </span>
      ${it.isGift ? `<span style="background-color: #F8F4EB; color: #8A1B14; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 10px; border: 1px solid #EAD7BC; text-transform: uppercase;">Free Gift</span>` : ""}
    </div>
  `).join("");
}

function generateCustomerProcessingEmailHtml(order) {
  const orderId = order.id;
  const customerName = order.name || "Valued Customer";
  const amountStr = order.formattedAmount;
  const itemsHtml = buildItemsHtml(order.items, order.freeGifts);
  const addressStr = order.fullAddress || "Registered Shipping Address";
  const trackUrl = `https://namonarayanaghee.store/track-order?orderId=${orderId}`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Processing Update] Order #${orderId} Preparation - Namo Narayana</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #24211E;">

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F2" style="background-color: #FAF8F2; padding: 25px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 22px rgba(78, 16, 19, 0.08); border: 1px solid #EAD7BC;">

          <!-- Brand Header -->
          <tr>
            <td bgcolor="#5E0B10" style="background: linear-gradient(135deg, #5E0B10 0%, #8A1B14 100%); padding: 30px 24px; text-align: center; border-bottom: 4px solid #D4A017;">
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 0 0 4px 0; letter-spacing: 1.5px; text-transform: uppercase;">
                NAMO NARAYANA
              </h1>
              <p style="color: #F5BD47; font-size: 11px; font-weight: 600; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
                Pure Vedic Gir Cow Bilona Ghee • Fulfillment Desk
              </p>
            </td>
          </tr>

          <!-- Status Highlight Banner -->
          <tr>
            <td bgcolor="#FCFAF5" style="background-color: #FCFAF5; padding: 20px 24px; border-bottom: 2px solid #EAD7BC; text-align: center;">
              <span style="display: inline-block; background-color: #D97706; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                🟡 Order In Processing &amp; Hand-Packing
              </span>
              <h2 style="color: #5E0B10; font-size: 18px; margin: 6px 0 2px 0; font-weight: 800;">
                Your Vedic Ghee is Being Freshly Prepared! 🙏
              </h2>
              <p style="color: #7A4A3B; font-size: 12px; margin: 0;">
                Order Reference: <strong>#${orderId}</strong>
              </p>
            </td>
          </tr>

          <!-- Progress Bar Tracker -->
          <tr>
            <td style="padding: 20px 24px 10px 24px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="text-align: center;">
                <tr>
                  <td width="25%" align="center">
                    <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #2E7D32; color: #FFFFFF; line-height: 28px; font-size: 13px; font-weight: bold; margin: 0 auto 4px auto;">✓</div>
                    <span style="font-size: 10px; font-weight: 700; color: #2E7D32; text-transform: uppercase;">Confirmed</span>
                  </td>
                  <td width="25%" align="center">
                    <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #D97706; color: #FFFFFF; line-height: 28px; font-size: 13px; font-weight: bold; margin: 0 auto 4px auto; box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.2);">2</div>
                    <span style="font-size: 10px; font-weight: 800; color: #D97706; text-transform: uppercase;">Processing</span>
                  </td>
                  <td width="25%" align="center">
                    <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #E2D9C8; color: #8C7B6D; line-height: 28px; font-size: 13px; font-weight: bold; margin: 0 auto 4px auto;">3</div>
                    <span style="font-size: 10px; font-weight: 600; color: #8C7B6D; text-transform: uppercase;">Dispatch</span>
                  </td>
                  <td width="25%" align="center">
                    <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #E2D9C8; color: #8C7B6D; line-height: 28px; font-size: 13px; font-weight: bold; margin: 0 auto 4px auto;">4</div>
                    <span style="font-size: 10px; font-weight: 600; color: #8C7B6D; text-transform: uppercase;">Delivery</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 16px 24px 28px 24px; color: #332B27; font-size: 14px; line-height: 1.7;">

              <p style="margin-top: 0; font-size: 15px;">
                Namaste <strong>${customerName}</strong>,
              </p>

              <p>
                We are pleased to inform you that your order <strong>#${orderId}</strong> has progressed into our active preparation &amp; hand-packing line at the farm.
              </p>

              <p>
                Our dairy artisans are carefully packing your glass jar of freshly churned Vedic Bilona Ghee with protective thermal cushioning and adding your complimentary festive gifts to the consignment.
              </p>

              <!-- AWB & Courier Notice Box (Explicit User Requirement) -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFDF9" style="background-color: #FFFDF9; border: 1.5px solid #EAD7BC; border-radius: 10px; margin: 20px 0;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="color: #5E0B10; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                      📦 Courier Pickup &amp; Tracking Update
                    </div>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px; color: #332B27;">
                      <tr>
                        <td style="padding: 4px 0; color: #7A4A3B; width: 140px;">Courier Partner:</td>
                        <td style="padding: 4px 0; font-weight: 700; color: #24211E;">Delhivery Express / Blue Dart</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #7A4A3B;">AWB / Tracking No:</td>
                        <td style="padding: 4px 0; font-weight: 800; color: #8A1B14; font-family: monospace;">Order not picked up yet</td>
                      </tr>
                    </table>

                    <div style="margin-top: 10px; padding: 10px 12px; background-color: #F8F4EB; border-radius: 6px; font-size: 12px; color: #6E3B2E; line-height: 1.6; border-left: 3px solid #D4A017;">
                      ℹ️ <strong>AWB Generation Note:</strong> Your official AWB number will be generated automatically upon successful courier pickup from our central warehouse facility. You will receive an SMS and email notification with your live tracking link as soon as the dispatch scan completes.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Order Summary Card -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F2" style="background-color: #FAF8F2; border: 1px solid #EAD7BC; border-radius: 10px; margin: 20px 0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-size: 11px; font-weight: 800; color: #5E0B10; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                      Order Specifications
                    </div>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px; color: #4A352F;">
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Order ID:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 700; color: #24211E;">#${orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Payment Method:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 600; color: #24211E; text-transform: uppercase;">${order.paymentMethod || "Prepaid"}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Total Consideration:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 800; color: #5E0B10; font-size: 14px;">${amountStr}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #735D54;">Delivery Address:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 500; color: #24211E; max-width: 250px;">${addressStr}</td>
                      </tr>
                    </table>

                    <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #EAD7BC;">
                      <div style="font-size: 11px; font-weight: 700; color: #735D54; text-transform: uppercase; margin-bottom: 6px;">
                        Items in Your Package:
                      </div>
                      ${itemsHtml}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <div style="text-align: center; margin: 28px 0 20px 0;">
                <a href="${trackUrl}" style="background: linear-gradient(135deg, #8A1B14 0%, #5E0B10 100%); color: #FFFFFF !important; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 800; font-size: 13px; display: inline-block; box-shadow: 0 4px 12px rgba(138, 27, 20, 0.25); text-transform: uppercase; letter-spacing: 0.5px;">
                  Track Order Status Online →
                </a>
              </div>

              <p style="margin: 20px 0 0 0; color: #5E0B10; font-weight: 600;">
                Warm Regards,<br/>
                <strong style="color: #24211E; font-size: 15px;">Namo Narayana Fulfillment Team</strong><br/>
                <span style="font-size: 12px; color: #735D54;">Pure Vedic Desi Gir Cow Bilona Ghee • Bharat 🙏</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#FAF4EB" style="background-color: #FAF4EB; padding: 20px 24px; text-align: center; border-top: 1px solid #EAD7BC; font-size: 11px; color: #735D54; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: 600; color: #5E0B10;">
                Namo Narayana Vedic Farm • Customer Care
              </p>
              <p style="margin: 0;">
                This transactional update was sent for Order #${orderId} to ${order.email}.<br/>
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

function generateAdminMasterEmailHtml(ordersList, dispatchResults) {
  const tableRows = ordersList.map((o, idx) => {
    const res = dispatchResults.find(r => r.orderId === o.id) || {};
    const statusColor = res.success ? "#2E7D32" : (res.skipped ? "#D97706" : "#C53030");
    const statusText = res.success ? `SENT` : (res.skipped ? `PHONE-ONLY (${res.reason})` : `FAILED`);

    return `
      <tr style="border-bottom: 1px solid #EAD7BC; font-size: 12px;">
        <td style="padding: 8px 6px; text-align: center; color: #735D54;">${idx + 1}</td>
        <td style="padding: 8px 6px; font-weight: 700; color: #5E0B10;">#${o.id}</td>
        <td style="padding: 8px 6px; color: #24211E;"><strong>${o.name}</strong><br/><span style="color: #735D54; font-size: 11px;">${o.email}</span></td>
        <td style="padding: 8px 6px; color: #24211E;">+91 ${o.phone || "-"}</td>
        <td style="padding: 8px 6px; font-weight: 700; color: #1B5E20; text-align: right;">${o.formattedAmount}</td>
        <td style="padding: 8px 6px; text-transform: uppercase; font-size: 11px; font-weight: 600;">${o.paymentMethod}</td>
        <td style="padding: 8px 6px; color: #8A1B14; font-family: monospace; font-size: 11px;">Order not picked up yet</td>
        <td style="padding: 8px 6px; color: ${statusColor}; font-weight: 700; font-size: 11px; text-align: center;">${statusText}</td>
      </tr>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ADMIN DISPATCH AUDIT: Processing Status & AWB Pending Pickup Dispatches</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F2; color: #24211E; padding: 20px;">
  <div style="max-width: 860px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EAD7BC; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
    
    <div style="background-color: #5E0B10; color: #FFFFFF; padding: 22px 24px; border-bottom: 4px solid #D4A017;">
      <h2 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
        Admin Master Audit Report
      </h2>
      <p style="margin: 4px 0 0 0; color: #F5BD47; font-size: 12px; font-weight: 600;">
        Order Processing Notifications &amp; Warehouse Pickup AWB Status (${ordersList.length} Orders)
      </p>
    </div>

    <div style="padding: 24px;">
      
      <div style="background-color: #FCFAF5; border: 1px solid #EAD7BC; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; font-size: 13px; color: #4A352F;">
        <strong>Execution Specifications:</strong><br/>
        • <strong>Order Status:</strong> Set to <code>processing</code> across all orders in Firestore.<br/>
        • <strong>AWB Status:</strong> Marked as <code>Order not picked up yet</code> (AWB will be generated after successful pickup from warehouse).<br/>
        • <strong>Customer Notice:</strong> Reassured customers that their Vedic Ghee is being hand-packed and AWB will follow courier warehouse pickup.<br/>
        • <strong>Total Orders Handled:</strong> ${ordersList.length} orders
      </div>

      <h3 style="font-size: 14px; color: #5E0B10; margin: 18px 0 10px 0; text-transform: uppercase;">
        Processed Orders List
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
              <th style="padding: 8px 6px;">Type</th>
              <th style="padding: 8px 6px;">AWB Status</th>
              <th style="padding: 8px 6px; text-align: center;">Notification</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #EAD7BC; font-size: 12px; color: #735D54;">
        Report automatically generated by Namo Narayana Operations Desk for admin <code>${ADMIN_EMAIL}</code>.
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
  console.log("PROCESSING STATUS & WAREHOUSE PICKUP AWB BATCH UPDATE");
  console.log(`MODE: ${isDryRun ? "🔍 DRY-RUN (Simulation only)" : "🚀 LIVE DISPATCH"}`);
  console.log("==================================================================");

  console.log(`Fetching ${TARGET_ORDER_IDS.length} target orders from Firestore...`);
  const orders = [];

  for (const id of TARGET_ORDER_IDS) {
    const snap = await getDoc(doc(db, "orders", id));
    if (!snap.exists()) {
      console.warn(`[WARNING] Order #${id} not found in Firestore!`);
      continue;
    }
    const d = snap.data();
    let amount = d.pricing?.finalTotal || d.totalAmount || 0;
    if (amount > 10000) amount = amount / 100;

    const email = (d.contactInfo?.email || d.shippingAddress?.email || d.email || "").trim().toLowerCase();
    const phone = d.contactInfo?.phone || d.shippingAddress?.phone || d.phone || "";
    const name = d.shippingAddress?.name || d.contactInfo?.name || "Customer";

    const street = d.shippingAddress?.address || d.shippingAddress?.street || "";
    const city = d.shippingAddress?.city || "";
    const state = d.shippingAddress?.state || "";
    const pincode = d.shippingAddress?.pincode || "";

    orders.push({
      id,
      name,
      email,
      phone,
      amountNum: amount,
      formattedAmount: "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      paymentMethod: d.paymentMethod || "prepaid",
      items: d.items || [],
      freeGifts: d.freeGifts || [],
      city,
      state,
      fullAddress: [street, city, state, pincode].filter(Boolean).join(", "),
      existingHistory: Array.isArray(d.statusHistory) ? d.statusHistory : [],
      isSyntheticEmail: email.endsWith("@customer.namonarayanaghee.store")
    });
  }

  console.log(`Loaded ${orders.length} orders for processing.`);

  const dispatchResults = [];

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    console.log(`\n[${i + 1}/${orders.length}] Processing Order #${order.id} for ${order.name} (${order.email}) - ${order.formattedAmount}`);

    // Update Firestore with AWB note and status
    const nowIso = new Date().toISOString();
    const newHistoryEntry = {
      status: "processing",
      timestamp: nowIso,
      courierPartner: "Delhivery Express",
      trackingNumber: "Order not picked up yet",
      adminNotes: "Order in hand-packing. Order not picked up yet, AWB will be generated after a successful pickup from our warehouse.",
      notified: !order.isSyntheticEmail
    };

    if (!isDryRun) {
      try {
        const orderRef = doc(db, "orders", order.id);
        await updateDoc(orderRef, {
          status: "processing",
          shippingStatus: "processing",
          shipmentStatus: "processing",
          courierPartner: "Delhivery Express (Warehouse Pickup Scheduled)",
          trackingNumber: "Order not picked up yet",
          awbNumber: "Order not picked up yet",
          pickupStatus: "pending_pickup",
          orderStatusNote: "Order in processing. Order not picked up yet, AWB will be generated after a successful pickup from our warehouse.",
          statusHistory: [...order.existingHistory, newHistoryEntry],
          lastNotificationSentAt: nowIso,
          lastNotificationStatus: "processing",
          updatedAt: new Date()
        });
        console.log(`   ✅ Firestore updated: status=processing, AWB="Order not picked up yet"`);
      } catch (fsErr) {
        console.error(`   ❌ Failed to update Firestore for ${order.id}:`, fsErr.message);
      }
    } else {
      console.log(`   [DRY-RUN] Would update Firestore: status=processing, AWB="Order not picked up yet"`);
    }

    // Skip sending email if synthetic placeholder email (phone-only checkout)
    if (order.isSyntheticEmail) {
      console.log(`   ℹ️ Synthetic email (@customer.namonarayanaghee.store). Skipping email dispatch (Phone: +91 ${order.phone}).`);
      dispatchResults.push({
        orderId: order.id,
        email: order.email,
        skipped: true,
        reason: "phone-only"
      });
      continue;
    }

    // Generate & Dispatch Email
    const htmlContent = generateCustomerProcessingEmailHtml(order);

    if (isDryRun) {
      console.log(`   [DRY-RUN] Would dispatch processing email to ${order.email}`);
      dispatchResults.push({
        orderId: order.id,
        email: order.email,
        success: true,
        messageId: "mock-message-id"
      });
      continue;
    }

    const emailPayload = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: order.email, name: order.name }],
      replyTo: { name: "Namo Narayana Support", email: SUPPORT_EMAIL },
      subject: `[Order Update] Your Namo Narayana Order #${order.id} is in Hand-Packing & Preparation 🙏`,
      htmlContent: htmlContent,
      headers: {
        "X-Mailin-Tag": "processing-status-awb-pending",
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
      console.error(`   ❌ Failed to dispatch email: ${res.error}`);
      dispatchResults.push({
        orderId: order.id,
        email: order.email,
        success: false,
        error: res.error
      });
    }

    // Sleep 600ms between sends
    await sleep(600);
  }

  // Dispatch Master Admin Verification to littlecodr@gmail.com
  console.log("\n==================================================================");
  console.log(`Sending Master Admin Verification Copy to ${ADMIN_EMAIL}...`);
  console.log("==================================================================");

  if (isDryRun) {
    console.log(`[DRY-RUN] Would send master audit report to ${ADMIN_EMAIL}`);
  } else {
    const adminHtml = generateAdminMasterEmailHtml(orders, dispatchResults);
    const adminPayload = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [
        { email: ADMIN_EMAIL, name: "Admin (Mayank)" },
        { email: "hurkinds@gmail.com", name: "Admin (Hurkinds)" }
      ],
      replyTo: { name: "Namo Narayana Support", email: SUPPORT_EMAIL },
      subject: `[ADMIN AUDIT] Processing Status & AWB Pending Pickup Dispatched (${orders.length} Orders)`,
      htmlContent: adminHtml,
      headers: {
        "X-Mailin-Tag": "admin-processing-audit"
      }
    };

    const adminRes = await sendBrevoEmail(adminPayload);
    if (adminRes.success) {
      console.log(`✅ Master Admin Report sent! MessageId: ${adminRes.messageId}`);
    } else {
      console.error(`❌ Master Admin Report failed: ${adminRes.error}`);
    }

    // Also send a sample copy of customer email to admin
    if (orders.length > 0) {
      const sampleOrder = orders[0];
      const sampleCustomerHtml = generateCustomerProcessingEmailHtml(sampleOrder);
      const samplePayload = {
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: ADMIN_EMAIL, name: "Admin Copy" }],
        replyTo: { name: "Namo Narayana Support", email: SUPPORT_EMAIL },
        subject: `[SAMPLE CUSTOMER COPY] [Order Update] Your Namo Narayana Order #${sampleOrder.id} is in Hand-Packing & Preparation 🙏`,
        htmlContent: sampleCustomerHtml
      };
      await sendBrevoEmail(samplePayload);
      console.log(`✅ Sample Customer Email Copy sent to ${ADMIN_EMAIL}!`);
    }
  }

  console.log("\n==================================================================");
  console.log("BATCH PROCESSING DISPATCH COMPLETE!");
  console.log(`Total Orders: ${orders.length}`);
  console.log(`Emailed Customers: ${dispatchResults.filter(r => r.success).length}`);
  console.log(`Phone-only (No Email): ${dispatchResults.filter(r => r.skipped).length}`);
  console.log(`Failed: ${dispatchResults.filter(r => !r.success && !r.skipped).length}`);
  console.log("==================================================================");
}

main().catch(err => {
  console.error("Fatal Error in main:", err);
  process.exit(1);
});

