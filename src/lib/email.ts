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

  const brevoApiKey = process.env.BREVO_API_KEY || "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";
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "namonarayana.contact@gmail.com";

  // Build items table if available
  const items = orderData?.items || [];
  const itemsTableHtml = items.length > 0 ? `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
      <thead>
        <tr style="background-color: #F8F4EB; color: #5E0B10; text-align: left;">
          <th style="padding: 8px 10px; border-bottom: 1px solid #EAD7BC;">Item</th>
          <th style="padding: 8px 10px; border-bottom: 1px solid #EAD7BC; text-align: center;">Qty</th>
          <th style="padding: 8px 10px; border-bottom: 1px solid #EAD7BC; text-align: right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((i: any) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #F0E6D6;">
              <strong>${i.name || i.title}</strong>
              ${i.variantTitle ? `<br><span style="color: #7A4A3B; font-size: 11px;">${i.variantTitle}</span>` : ""}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #F0E6D6; text-align: center;">${i.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #F0E6D6; text-align: right; font-weight: bold; color: #8A1B14;">
              ${i.price === 0 || i.isGift ? '<span style="color: #2e7d32;">FREE GIFT</span>' : `Rs. ${((i.price * i.quantity) / 100).toLocaleString('en-IN')}`}
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : "";

  const shipping = orderData?.shippingAddress;
  const shippingHtml = shipping ? `
    <div style="background-color: #FCFAF5; border: 1px solid #EAD7BC; border-radius: 8px; padding: 15px; margin-top: 20px; font-size: 13px; line-height: 1.5; color: #4A352F;">
      <strong style="color: #5E0B10; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; display: block; margin-bottom: 6px;">📍 Delivery Address</strong>
      <div><strong>${shipping.name || name}</strong></div>
      <div>${shipping.address}</div>
      <div>${shipping.city}, ${shipping.state} ${shipping.pincode}</div>
      <div>India</div>
    </div>
  ` : "";

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF9F5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #5E0B10; padding: 40px 20px; text-align: center; border-bottom: 4px solid #D4A017; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
        .header p { color: #F5BD47; margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 40px 30px; color: #4A352F; line-height: 1.6; }
        .content h2 { color: #5E0B10; font-size: 22px; margin-top: 0; }
        .order-box { background-color: #FCFAF5; border: 1px solid #EAD7BC; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center; }
        .order-box p { margin: 5px 0; }
        .amount { font-size: 24px; font-weight: bold; color: #8A1B14; margin-top: 10px !important; }
        .btn-container { text-align: center; margin: 35px 0; }
        .btn { background-color: #8A1B14; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block; }
        .footer { background-color: #FCFAF5; padding: 30px; text-align: center; font-size: 13px; color: #7A4A3B; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Namo Narayana</h1>
          <p>Pure A2 Gir Cow Ghee</p>
        </div>
        <div class="content">
          <h2>Thank you for your order, ${name || "Customer"}! 🙏</h2>
          <p>We are delighted to confirm that your payment has been received and your order is confirmed. Our farm team is preparing your freshly churned Bilona Ghee.</p>
          
          <div class="order-box">
            <p style="color: #7A4A3B; font-size: 13px; text-transform: uppercase; font-weight: bold;">Order Reference</p>
            <p style="font-size: 20px; color: #5E0B10; font-weight: bold; font-family: monospace;">#${orderId}</p>
            <p class="amount">${formattedAmount}</p>
            <p style="font-size: 12px; color: #2e7d32; font-weight: bold; margin-top: 6px;">✓ Payment Verified &amp; Confirmed</p>
          </div>

          ${itemsTableHtml}
          ${shippingHtml}
          
          <p style="margin-top: 25px;">⚡ <strong>Dispatch Timeline:</strong> Your order will dispatch from our farm within 24 hours. Expected delivery is 3 - 5 business days across India.</p>
          
          <div class="btn-container">
            <a href="https://www.namonarayanaghee.store/track-order?orderId=${orderId}" class="btn">Track Your Order</a>
          </div>
        </div>
        <div class="footer">
          <p>Questions? Reply directly to this email or reach us at <a href="mailto:namonarayana.contact@gmail.com" style="color: #8A1B14;">namonarayana.contact@gmail.com</a></p>
          <p><strong>Namo Narayana</strong><br>Pure Vedic Food • Made from Gir Cow Curd • Bharat 🙏</p>
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
      console.error("Brevo API error:", errorText);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to send email via Brevo:", err);
    return false;
  }
}
