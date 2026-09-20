/**
 * Client-side invoice generator using a print-friendly popup window.
 * No external dependencies needed - uses pure HTML/CSS for PDF-quality output.
 */

interface InvoiceOrder {
  id: string;
  orderId: string;
  items: {
    name?: string;
    title?: string;
    variantTitle?: string;
    quantity: number;
    price: number;
    slug?: string;
  }[];
  subtotal: number;
  discount?: number;
  discountPercent?: number;
  totalAmount: number;
  amountToPay?: number;
  amountRemaining?: number;
  shippingCost: number;
  tax: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  billingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contactInfo: {
    email: string;
    phone: string;
  };
  gstDetails?: {
    companyName: string;
    gstin: string;
  } | null;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: { seconds: number } | null;
}

function formatInvoicePrice(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

function formatDate(ts: { seconds: number } | null): string {
  if (!ts) return new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  return new Date(ts.seconds * 1000).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export function generateInvoiceHTML(order: InvoiceOrder): string {
  const invoiceNumber = `NN-${(order.orderId || order.id).slice(-8).toUpperCase()}`;
  const invoiceDate = formatDate(order.createdAt);

  const itemsRows = order.items
    .map(
      (item, idx) => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #E9E5D9; text-align: left; font-size: 14px;">
        ${idx + 1}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #E9E5D9; text-align: left;">
        <div style="font-weight: 600; color: #1E3A24; font-size: 14px;">${item.name || item.title}</div>
        ${item.variantTitle ? `<div style="font-size: 12px; color: #576B55; margin-top: 2px;">${item.variantTitle}</div>` : ""}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #E9E5D9; text-align: center; font-size: 14px;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #E9E5D9; text-align: right; font-size: 14px;">
        ${formatInvoicePrice(item.price)}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #E9E5D9; text-align: right; font-weight: 600; font-size: 14px; color: #1E3A24;">
        ${formatInvoicePrice(item.price * item.quantity)}
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceNumber} | Namo Narayana</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #364935;
      background: #fff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
      @page { margin: 15mm; }
    }
  </style>
</head>
<body>

  <!-- Print Button -->
  <div class="no-print" style="text-align: center; margin-bottom: 24px;">
    <button onclick="window.print()" style="background: #1E3A24; color: white; border: none; padding: 12px 32px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: Inter, sans-serif;">
      📄 Download / Print Invoice
    </button>
  </div>

  <!-- Header -->
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #C38936; padding-bottom: 24px;">
    <div>
      <h1 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #1E3A24; margin-bottom: 4px;">Namo Narayana</h1>
      <p style="font-size: 12px; color: #C38936; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Pure A2 Gir Cow Ghee & Traditional Foods</p>
      <div style="margin-top: 12px; font-size: 12px; color: #576B55; line-height: 1.8;">
        <div>📧 namonarayana.contact@gmail.com</div>
        <div>📞 +91 99999 93821</div>
        <div>🌐 namonarayanaghee.store</div>
      </div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 32px; font-family: 'Playfair Display', serif; font-weight: 700; color: #1E3A24;">INVOICE</div>
      <div style="margin-top: 8px; font-size: 13px;">
        <div style="color: #576B55;">Invoice No: <strong style="color: #1E3A24;">${invoiceNumber}</strong></div>
        <div style="color: #576B55; margin-top: 4px;">Date: <strong style="color: #1E3A24;">${invoiceDate}</strong></div>
        <div style="color: #576B55; margin-top: 4px;">Order ID: <strong style="color: #1E3A24;">${order.orderId || order.id}</strong></div>
      </div>
    </div>
  </div>

  <!-- Customer Details -->
  <div style="display: flex; gap: 32px; margin-bottom: 32px;">
    <div style="flex: 1; background: #FAF9F5; padding: 20px; border-radius: 12px; border: 1px solid #E9E5D9;">
      <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #C38936; font-weight: 700; margin-bottom: 10px;">Ship To</h3>
      <div style="font-size: 13px; line-height: 1.7; color: #1E3A24;">
        <strong>${order.shippingAddress.name}</strong><br>
        ${order.shippingAddress.address}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
        ${order.shippingAddress.country}
      </div>
      <div style="margin-top: 8px; font-size: 12px; color: #576B55;">
        ${order.contactInfo.email} • ${order.contactInfo.phone}
      </div>
    </div>
    <div style="flex: 1; background: #FAF9F5; padding: 20px; border-radius: 12px; border: 1px solid #E9E5D9;">
      <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #C38936; font-weight: 700; margin-bottom: 10px;">Bill To</h3>
      <div style="font-size: 13px; line-height: 1.7; color: #1E3A24;">
        <strong>${order.billingAddress.name}</strong><br>
        ${order.billingAddress.address}<br>
        ${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.pincode}<br>
        ${order.billingAddress.country}
      </div>
      ${
        order.gstDetails
          ? `<div style="margin-top: 8px; font-size: 12px; color: #576B55;">
              GSTIN: <strong>${order.gstDetails.gstin}</strong><br>
              ${order.gstDetails.companyName}
            </div>`
          : ""
      }
    </div>
  </div>

  <!-- Items Table -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <thead>
      <tr style="background: #1E3A24;">
        <th style="padding: 12px 16px; text-align: left; color: white; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; border-radius: 8px 0 0 0;">#</th>
        <th style="padding: 12px 16px; text-align: left; color: white; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Product</th>
        <th style="padding: 12px 16px; text-align: center; color: white; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Qty</th>
        <th style="padding: 12px 16px; text-align: right; color: white; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Unit Price</th>
        <th style="padding: 12px 16px; text-align: right; color: white; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; border-radius: 0 8px 0 0;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  <!-- Summary -->
  <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
    <div style="width: 300px;">
      <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
        <span>Subtotal</span>
        <span style="font-weight: 600;">${formatInvoicePrice(order.subtotal)}</span>
      </div>
      ${
        order.discount && order.discount > 0
          ? `<div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #16a34a;">
              <span>Discount (${order.discountPercent || 10}%)</span>
              <span style="font-weight: 600;">-${formatInvoicePrice(order.discount)}</span>
            </div>`
          : ""
      }
      <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
        <span>Shipping</span>
        <span style="font-weight: 600; color: #C38936;">${order.shippingCost === 0 ? "FREE" : formatInvoicePrice(order.shippingCost)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
        <span>Tax (Included)</span>
        <span style="font-weight: 600;">${formatInvoicePrice(order.tax || 0)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: 700; color: #1E3A24; border-top: 2px solid #1E3A24; margin-top: 8px;">
        <span>Total</span>
        <span>${formatInvoicePrice(order.totalAmount)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 12px; font-size: 13px; background: #F4F6F0; border-radius: 8px; margin-top: 8px;">
        <span>Paid Online</span>
        <span style="font-weight: 600; color: #1E3A24;">${formatInvoicePrice(order.amountToPay || order.totalAmount)}</span>
      </div>
      ${
        order.amountRemaining && order.amountRemaining > 0
          ? `<div style="display: flex; justify-content: space-between; padding: 8px 12px; font-size: 13px; background: #FFF7ED; border-radius: 8px; margin-top: 4px;">
              <span>Due on Delivery (COD)</span>
              <span style="font-weight: 600; color: #C38936;">${formatInvoicePrice(order.amountRemaining)}</span>
            </div>`
          : ""
      }
    </div>
  </div>

  <!-- Payment Info -->
  <div style="background: #FAF9F5; padding: 16px 20px; border-radius: 12px; border: 1px solid #E9E5D9; margin-bottom: 32px; font-size: 13px;">
    <strong style="color: #1E3A24;">Payment:</strong>
    <span style="color: #576B55; margin-left: 8px;">
      ${order.paymentMethod === "cod" ? "Cash on Delivery (20% Advance Paid)" : "Prepaid (Online Payment)"}
      — Status: <strong style="color: ${order.paymentStatus === "paid" ? "#16a34a" : "#C38936"};">${order.paymentStatus === "paid" ? "Paid ✓" : "Pending"}</strong>
    </span>
  </div>

  <!-- Footer -->
  <div style="text-align: center; padding-top: 24px; border-top: 1px solid #E9E5D9;">
    <p style="font-family: 'Playfair Display', serif; font-size: 16px; color: #1E3A24; margin-bottom: 4px;">Thank you for shopping with Namo Narayana!</p>
    <p style="font-size: 12px; color: #576B55;">Pure Food. Stronger Bharat. 🙏</p>
    <p style="font-size: 11px; color: #8C988B; margin-top: 12px;">This is a computer-generated invoice and does not require a signature.</p>
  </div>

</body>
</html>`;
}

export function downloadInvoice(order: InvoiceOrder) {
  const html = generateInvoiceHTML(order);
  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
