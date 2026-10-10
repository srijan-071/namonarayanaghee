export async function sendOrderEmail(orderId: string, email: string, name: string, amount: number) {
  if (!orderId || !email) {
    throw new Error("Missing orderId or email");
  }

  const amountInINR = (amount || 0) / 100;
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amountInINR);

  const brevoApiKey = "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";
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF9F5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #1E3A24; padding: 40px 20px; text-align: center; border-bottom: 4px solid #C38936; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
        .header p { color: #C38936; margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 40px 30px; color: #364935; line-height: 1.6; }
        .content h2 { color: #1E3A24; font-size: 22px; margin-top: 0; }
        .order-box { background-color: #FAF9F5; border: 1px solid #E9E5D9; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center; }
        .order-box p { margin: 5px 0; }
        .amount { font-size: 24px; font-weight: bold; color: #C38936; margin-top: 10px !important; }
        .btn-container { text-align: center; margin: 35px 0; }
        .btn { background-color: #C38936; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block; }
        .footer { background-color: #F4F6F0; padding: 30px; text-align: center; font-size: 13px; color: #576B55; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Namo Narayana</h1>
          <p>Pure A2 Gir Cow Ghee</p>
        </div>
        <div class="content">
          <h2>Thank you for your order, ${name || "Customer"}!</h2>
          <p>We are thrilled to let you know that we've received your order and it is currently being processed by our team.</p>
          
          <div class="order-box">
            <p style="color: #576B55; font-size: 13px; text-transform: uppercase; font-weight: bold;">Order Reference</p>
            <p style="font-size: 18px; color: #1E3A24; font-weight: bold; font-family: monospace;">#${orderId}</p>
            <p class="amount">${formattedAmount}</p>
          </div>
          
          <p>You will receive another update with tracking information as soon as your package ships. Our ghee is freshly packed to ensure you get the best quality.</p>
          
          <div class="btn-container">
            <a href="https://namonarayanaghee.store/track-order" class="btn">Track Your Order</a>
          </div>
        </div>
        <div class="footer">
          <p>If you have any questions, reply to this email or contact us at <a href="mailto:namonarayana.contact@gmail.com" style="color: #1E3A24;">namonarayana.contact@gmail.com</a></p>
          <p><strong>Namo Narayana</strong><br>Pure Food. Stronger Bharat. 🙏</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoApiKey
    },
    body: JSON.stringify({
      sender: { name: "Namo Narayana", email: "noreply@namonarayanaghee.store" },
      to: [{ email, name: name || "Customer" }],
      subject: `Order Confirmation - ${orderId}`,
      htmlContent
    })
  });

  if (!brevoRes.ok) {
    const errorText = await brevoRes.text();
    console.error("Brevo API error:", errorText);
    throw new Error("Failed to send email via Brevo");
  }

  return true;
}
