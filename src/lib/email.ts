export async function sendOrderEmail(orderId: string, email: string, name: string, amount: number, orderData?: any) {
  if (!orderId || !email) {
    throw new Error("Missing orderId or email");
  }

  const amountInINR = (amount || 0) / 100;
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountInINR);

  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "namonarayana.contact@gmail.com";

  if (!brevoApiKey) {
    console.error("[BREVO_ERROR] BREVO_API_KEY is not set in environment variables");
    return false;
  }

  // Build items table if available
  const items = orderData?.items || [];
  const itemsTableHtml = items.length > 0 ? `
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px;">
      <thead>
        <tr style="background-color: #F8F4EB; color: #5E0B10; text-align: left;">
          <th style="padding: 10px; border-bottom: 2px solid #EAD7BC; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Item</th>
          <th style="padding: 10px; border-bottom: 2px solid #EAD7BC; text-align: center; font-size: 12px; text-transform: uppercase;">Qty</th>
          <th style="padding: 10px; border-bottom: 2px solid #EAD7BC; text-align: right; font-size: 12px; text-transform: uppercase;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((i: any) => `
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #F0E6D6; vertical-align: top;">
              <strong style="color: #2A1612; font-size: 14px;">${i.name || i.title}</strong>
              ${i.variantTitle ? `<br><span style="color: #7A4A3B; font-size: 12px;">Size: ${i.variantTitle}</span>` : ""}
              ${i.isGift || i.price === 0 ? `<br><span style="background-color: #E8F5E9; color: #2e7d32; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px; border: 1px solid #C8E6C9;">🎁 COMPLIMENTARY GIFT</span>` : ""}
            </td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #F0E6D6; text-align: center; font-weight: 600; vertical-align: middle;">
              ${i.quantity}
            </td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #F0E6D6; text-align: right; font-weight: bold; color: #8A1B14; vertical-align: middle; font-size: 14px;">
              ${i.price === 0 || i.isGift ? '<span style="color: #2e7d32; font-weight: 800;">FREE</span>' : `Rs. ${((i.price * i.quantity) / 100).toLocaleString('en-IN')}`}
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : "";

  // Free gifts highlight
  const freeGifts = orderData?.freeGifts || [];
  const freeGiftsHtml = freeGifts.length > 0 ? `
    <div style="background-color: #FFFDF7; border: 1px dashed #D4A017; border-radius: 8px; padding: 12px 15px; margin-top: 15px;">
      <strong style="color: #8A1B14; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">🎁 Free Gifts Included in Your Parcel:</strong>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #4A352F;">
        ${freeGifts.map((g: any) => `<li>${typeof g === 'string' ? g : `${g.name} (${g.size} x${g.quantity})`} <strong style="color: #2e7d32;">— FREE</strong></li>`).join("")}
      </ul>
    </div>
  ` : "";

  const shipping = orderData?.shippingAddress;
  const shippingHtml = shipping ? `
    <div style="background-color: #FCFAF5; border: 1px solid #EAD7BC; border-radius: 10px; padding: 16px; margin-top: 20px; font-size: 13px; line-height: 1.6; color: #4A352F;">
      <strong style="color: #5E0B10; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; display: block; margin-bottom: 6px;">📍 Shipping Address</strong>
      <div style="font-size: 14px; font-weight: bold; color: #2A1612;">${shipping.name || name}</div>
      <div>${shipping.address}</div>
      <div>${shipping.city}, ${shipping.state} ${shipping.pincode}</div>
      <div>India</div>
      ${orderData?.contactInfo?.phone ? `<div style="margin-top: 4px; color: #7A4A3B;">Phone: <strong>${orderData.contactInfo.phone}</strong></div>` : ""}
    </div>
  ` : "";

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmed - Namo Narayana</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F5; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(94, 11, 16, 0.08); border: 1px solid #EAD7BC; }
        .header { background: linear-gradient(135deg, #5E0B10 0%, #8A1B14 100%); padding: 35px 20px; text-align: center; border-bottom: 4px solid #D4A017; }
        .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; }
        .header p { color: #F5BD47; margin: 6px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; }
        .content { padding: 35px 30px; color: #4A352F; line-height: 1.6; }
        .greeting { color: #5E0B10; font-size: 22px; font-weight: bold; margin-top: 0; }
        .order-box { background: linear-gradient(to bottom, #FFFDF9, #FCFAF5); border: 1px solid #EAD7BC; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
        .amount { font-size: 28px; font-weight: 800; color: #8A1B14; margin: 6px 0; }
        .btn-container { text-align: center; margin: 30px 0 20px 0; }
        .btn { background: linear-gradient(135deg, #8A1B14 0%, #5E0B10 100%); color: #ffffff !important; text-decoration: none; padding: 16px 36px; border-radius: 10px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(138, 27, 20, 0.3); letter-spacing: 0.5px; }
        .footer { background-color: #FCFAF5; padding: 25px 20px; text-align: center; font-size: 12px; color: #7A4A3B; border-top: 1px solid #EAD7BC; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <!-- Brand Header -->
        <div class="header">
          <h1>NAMO NARAYANA</h1>
          <p>Pure Vedic A2 Gir Cow Ghee • Official Store</p>
        </div>

        <div class="content">
          <h2 class="greeting">Namaste ${name || "Customer"}, Your Order is Confirmed! 🙏</h2>
          <p style="font-size: 15px; margin: 0 0 16px 0;">
            Thank you for ordering with us. Your payment has been successfully verified, and our farm team is currently preparing your freshly churned Bilona Ghee jar.
          </p>

          <!-- Order Reference Card -->
          <div class="order-box">
            <span style="color: #7A4A3B; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Order Reference ID</span>
            <div style="font-size: 20px; color: #5E0B10; font-weight: 800; font-family: monospace; margin: 4px 0;">#${orderId}</div>
            <div class="amount">${formattedAmount}</div>
            <span style="display: inline-block; background-color: #E8F5E9; color: #2e7d32; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px; border: 1px solid #C8E6C9; margin-top: 6px;">
              ✓ Payment Verified &amp; Confirmed
            </span>
          </div>

          <!-- ─── Visual Order Progress Tracker ─── -->
          <div style="margin: 28px 0; background-color: #FAF6EF; border: 1px solid #EAD7BC; border-radius: 12px; padding: 18px 12px;">
            <div style="text-align: center; font-size: 11px; text-transform: uppercase; font-weight: 800; color: #5E0B10; letter-spacing: 1px; margin-bottom: 14px;">
              📦 Live Delivery Tracker
            </div>
            <table style="width: 100%; border-collapse: collapse; text-align: center;">
              <tr>
                <!-- Step 1: Order Placed (COMPLETED / TICKED) -->
                <td style="width: 25%; vertical-align: top;">
                  <div style="width: 34px; height: 34px; border-radius: 50%; background-color: #2e7d32; color: #ffffff; font-size: 16px; line-height: 34px; font-weight: bold; margin: 0 auto 6px auto; text-align: center; box-shadow: 0 2px 6px rgba(46,125,50,0.35);">
                    ✓
                  </div>
                  <strong style="font-size: 11px; color: #2e7d32; display: block; text-transform: uppercase;">Order Placed</strong>
                  <span style="font-size: 10px; color: #2e7d32; font-weight: 600;">Confirmed</span>
                </td>

                <!-- Line 1 -->
                <td style="width: 10%; vertical-align: top; padding-top: 15px;">
                  <div style="height: 3px; background-color: #2e7d32; border-radius: 2px;"></div>
                </td>

                <!-- Step 2: Farm Churn & Packing (ACTIVE) -->
                <td style="width: 25%; vertical-align: top;">
                  <div style="width: 34px; height: 34px; border-radius: 50%; background-color: #ffffff; border: 2px solid #D4A017; color: #8A1B14; font-size: 13px; line-height: 30px; font-weight: 800; margin: 0 auto 6px auto; text-align: center;">
                    2
                  </div>
                  <strong style="font-size: 11px; color: #5E0B10; display: block; text-transform: uppercase;">Farm Packing</strong>
                  <span style="font-size: 10px; color: #D4A017; font-weight: 700;">In Progress</span>
                </td>

                <!-- Line 2 -->
                <td style="width: 10%; vertical-align: top; padding-top: 15px;">
                  <div style="height: 3px; background-color: #EAD7BC; border-radius: 2px;"></div>
                </td>

                <!-- Step 3: Express Courier -->
                <td style="width: 25%; vertical-align: top;">
                  <div style="width: 34px; height: 34px; border-radius: 50%; background-color: #ffffff; border: 2px solid #EAD7BC; color: #9A7B70; font-size: 13px; line-height: 30px; font-weight: bold; margin: 0 auto 6px auto; text-align: center;">
                    3
                  </div>
                  <strong style="font-size: 11px; color: #8A7A70; display: block; text-transform: uppercase;">Express Air</strong>
                  <span style="font-size: 10px; color: #A08C80;">Dispatches 24h</span>
                </td>

                <!-- Line 3 -->
                <td style="width: 10%; vertical-align: top; padding-top: 15px;">
                  <div style="height: 3px; background-color: #EAD7BC; border-radius: 2px;"></div>
                </td>

                <!-- Step 4: Delivered -->
                <td style="width: 25%; vertical-align: top;">
                  <div style="width: 34px; height: 34px; border-radius: 50%; background-color: #ffffff; border: 2px solid #EAD7BC; color: #9A7B70; font-size: 13px; line-height: 30px; font-weight: bold; margin: 0 auto 6px auto; text-align: center;">
                    4
                  </div>
                  <strong style="font-size: 11px; color: #8A7A70; display: block; text-transform: uppercase;">Delivered</strong>
                  <span style="font-size: 10px; color: #A08C80;">3-5 Days</span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Order Items -->
          <h3 style="color: #5E0B10; font-size: 16px; margin: 25px 0 10px 0; border-bottom: 2px solid #FDF6E8; padding-bottom: 8px;">
            Order Breakdown
          </h3>

          ${itemsTableHtml}
          ${freeGiftsHtml}
          ${shippingHtml}

          <!-- Transit Reassurance -->
          <div style="background-color: #F8FFF5; border: 1px solid #C3E6CB; border-radius: 10px; padding: 14px 16px; margin-top: 25px;">
            <strong style="color: #155724; font-size: 13px; display: block; margin-bottom: 4px;">
              🛡️ 100% Zero-Breakage Transit Guarantee
            </strong>
            <p style="margin: 0; font-size: 12px; color: #1e4620; line-height: 1.5;">
              Every glass jar is individually cushioned in 4-layer shockproof air packaging. If your jar arrives damaged or leaking, reply to this email and we will dispatch a replacement jar immediately at zero cost.
            </p>
          </div>
          
          <!-- Track Order Button -->
          <div class="btn-container">
            <a href="https://www.namonarayanaghee.store/track-order?orderId=${orderId}" class="btn">
              Track My Order Live →
            </a>
          </div>

          <p style="text-align: center; font-size: 12px; color: #7A4A3B; margin-top: 10px;">
            Need help with your order? Reply directly to this email or contact us at <a href="mailto:namonarayana.contact@gmail.com" style="color: #8A1B14; font-weight: bold;">namonarayana.contact@gmail.com</a>
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0 0 6px 0; font-weight: bold; color: #5E0B10; font-size: 13px;">
            Namo Narayana Vedic Farm
          </p>
          <p style="margin: 0 0 8px 0;">Pure Vedic Bilona Ghee • Made from Curd of Gir Cows • Bharat 🙏</p>
          <p style="margin: 0; font-size: 11px; color: #9A7B70;">
            This email was sent to ${email} regarding your purchase on namonarayanaghee.store
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey
      },
      body: JSON.stringify({
        sender: { name: "Namo Narayana", email: senderEmail },
        to: [{ email, name: name || "Customer" }],
        subject: `Order Confirmed #${orderId} - Namo Narayana Pure A2 Ghee`,
        htmlContent
      })
    });

    if (!brevoRes.ok) {
      const errorText = await brevoRes.text();
      console.error(`[BREVO_ERROR] Status ${brevoRes.status} for order ${orderId}:`, errorText);
      return false;
    }

    console.log(`[BREVO_SUCCESS] Order confirmation email sent to ${email} for order ${orderId}`);
    return true;
  } catch (err) {
    console.error("[BREVO_EXCEPTION] Failed to send email via Brevo:", err);
    return false;
  }
}
