import fs from 'fs';
import path from 'path';

const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const CSV_FILE = path.resolve("./successful_orders.csv");

// Read all orders from CSV natively without external dependencies
export function loadOrders() {
  const content = fs.readFileSync(CSV_FILE, 'utf-8').trim();
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const orders = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] !== undefined ? values[idx] : "";
    });
    orders.push(obj);
  }
  return orders;
}

function parseCSVLine(text) {
  const result = [];
  let curr = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        curr += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(curr);
      curr = '';
    } else {
      curr += char;
    }
  }
  result.push(curr);
  return result;
}

export function generateTrackingNumber(orderId) {
  const cleanId = (orderId || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const suffix = cleanId.slice(-6) || "782910";
  return `NNG${suffix}IN`;
}

function getProductImage(itemStr) {
  const lower = (itemStr || "").toLowerCase();
  if (lower.includes("5 litre") || lower.includes("5l")) {
    return "https://www.namonarayanaghee.store/assets/product_6-5L_jpg.webp";
  }
  if (lower.includes("2.5 litre") || lower.includes("2.5l")) {
    return "https://www.namonarayanaghee.store/assets/product_6-2p5_jpg.webp";
  }
  return "https://www.namonarayanaghee.store/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp";
}

function getGiftItems(giftStr) {
  if (!giftStr || giftStr === "None") return [];
  const gifts = [];
  const parts = giftStr.split(",").map(s => s.trim());
  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower.includes("coconut")) {
      gifts.push({
        title: "Cold-Pressed Coconut Oil (250 ml)",
        image: "https://www.namonarayanaghee.store/assets/coconut-oil-250ml.webp"
      });
    } else if (lower.includes("groundnut")) {
      gifts.push({
        title: "Cold-Pressed Groundnut Oil (250 ml)",
        image: "https://www.namonarayanaghee.store/assets/groundnut-oil-250ml.webp"
      });
    } else if (lower.includes("yellow mustard")) {
      gifts.push({
        title: "Pili Sarson / Yellow Mustard Oil (250 ml)",
        image: "https://www.namonarayanaghee.store/assets/yellow-mustard-oil-250ml.webp"
      });
    } else if (lower.includes("mustard") && (lower.includes("500") || lower.includes("500ml"))) {
      gifts.push({
        title: "Pure Kacchi Ghani Mustard Oil (500 ml)",
        image: "https://www.namonarayanaghee.store/assets/mustard-oil-500ml.webp"
      });
    } else if (lower.includes("mustard")) {
      gifts.push({
        title: "Pure Kacchi Ghani Mustard Oil (250 ml)",
        image: "https://www.namonarayanaghee.store/assets/mustard-oil-250ml.webp"
      });
    }
  }
  return gifts;
}

export function buildShippingEmailHtml(order) {
  const name = order["Customer Name"] || "Valued Customer";
  const orderId = order["Order ID"] || "";
  const cleanOrderId = orderId.replace(/^#/, "");
  const trackingNumber = generateTrackingNumber(cleanOrderId);
  const items = order["Purchased Items"] || "Pure A2 Gir Cow Ghee";
  const giftsList = getGiftItems(order["Free Gifts"]);
  const address = order["Full Shipping Address"] || order["Shipping Address Line"] || "";
  const phone = order["Customer Phone"] || "";
  const paymentMethod = order["Payment Method"] || "PREPAID";
  const totalAmount = order["Total Amount (INR)"] || order["Total Amount (Raw)"] || "";
  const remaining = order["Amount Remaining (Raw)"] || "";
  const productImage = getProductImage(items);

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Your Namo Narayana Order Has Been Shipped</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, a, span { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F7F2E8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%;">

  <!-- Background Wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#F7F2E8" style="background-color: #F7F2E8; padding: 25px 10px;">
    <tr>
      <td align="center">

        <!-- Main Card (600px Max) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #EAE2D2; box-shadow: 0 4px 20px rgba(7, 91, 79, 0.06);">
          
          <!-- Top Header: Forest Green with Gold Accent -->
          <tr>
            <td bgcolor="#075B4F" style="background-color: #075B4F; padding: 32px 20px 24px 20px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="https://www.namonarayanaghee.store" target="_blank" style="text-decoration: none;">
                      <img src="https://www.namonarayanaghee.store/assets/logo.png" alt="Namo Narayana Logo" width="80" height="80" style="display: block; width: 80px; height: 80px; border: 0; outline: none; margin: 0 auto;" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="color: #FFFFFF; font-family: Georgia, 'Times New Roman', serif; font-size: 23px; font-weight: normal; letter-spacing: 2.5px; margin: 0; text-transform: uppercase;">
                      Namo Narayana
                    </h1>
                    <p style="color: #C99A3D; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 6px 0 0 0; font-weight: 600;">
                      Pure A2 Gir Cow Bilona Ghee
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold Divider Strip -->
          <tr>
            <td height="4" bgcolor="#C99A3D" style="background-color: #C99A3D; line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Dispatch Announcement Banner -->
          <tr>
            <td bgcolor="#FCFAF5" style="background-color: #FCFAF5; padding: 30px 30px 20px 30px; border-bottom: 1px solid #EAE2D2;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #E6F3EE; color: #075B4F; font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #B8DFD2;">
                      Dispatched &bull; In Transit
                    </span>
                    <h2 style="color: #1A2421; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: normal; margin: 14px 0 8px 0; line-height: 1.3;">
                      Your Pure A2 Ghee Has Been Shipped!
                    </h2>
                    <p style="color: #4A5450; font-size: 15px; line-height: 1.6; margin: 0;">
                      Namaste <strong>${name}</strong>, your fresh batch of hand-churned Vedic Bilona Ghee has been safely packed in our secure cushioned packaging and handed over to our delivery partner.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================== -->
          <!-- VISUAL ORDER TRACKER (5 STEPS, CHECKED TILL SHIPPED) -->
          <!-- ============================================== -->
          <tr>
            <td style="padding: 28px 24px 20px 24px; background-color: #FFFFFF;">
              
              <p style="color: #1A2421; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 20px 0;">
                Live Package Tracker
              </p>

              <!-- Progress Bar Table -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <!-- Row 1: Circles & Connecting Lines -->
                <tr>
                  <!-- 1. Ordered (Checked) -->
                  <td align="center" width="34" valign="middle">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="32" height="32" style="background-color: #075B4F; border-radius: 50%; width: 32px; height: 32px; text-align: center;">
                      <tr>
                        <td align="center" valign="middle" style="color: #FFFFFF; font-size: 15px; font-weight: bold; line-height: 32px;">
                          &#10003;
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- Line 1 to 2 (Active Solid Green) -->
                  <td valign="middle" style="padding: 0 2px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" height="4" style="background-color: #075B4F; border-radius: 2px;">
                      <tr><td height="4" style="line-height: 4px; font-size: 4px;">&nbsp;</td></tr>
                    </table>
                  </td>

                  <!-- 2. Processed (Checked) -->
                  <td align="center" width="34" valign="middle">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="32" height="32" style="background-color: #075B4F; border-radius: 50%; width: 32px; height: 32px; text-align: center;">
                      <tr>
                        <td align="center" valign="middle" style="color: #FFFFFF; font-size: 15px; font-weight: bold; line-height: 32px;">
                          &#10003;
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- Line 2 to 3 (Active Solid Green) -->
                  <td valign="middle" style="padding: 0 2px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" height="4" style="background-color: #075B4F; border-radius: 2px;">
                      <tr><td height="4" style="line-height: 4px; font-size: 4px;">&nbsp;</td></tr>
                    </table>
                  </td>

                  <!-- 3. Shipped (Checked & Highlighted) -->
                  <td align="center" width="36" valign="middle">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="34" height="34" style="background-color: #075B4F; border: 2px solid #C99A3D; border-radius: 50%; width: 34px; height: 34px; text-align: center;">
                      <tr>
                        <td align="center" valign="middle" style="color: #FFFFFF; font-size: 16px; font-weight: bold; line-height: 34px;">
                          &#10003;
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- Line 3 to 4 (Inactive Grey) -->
                  <td valign="middle" style="padding: 0 2px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" height="4" style="background-color: #E2E8F0; border-radius: 2px;">
                      <tr><td height="4" style="line-height: 4px; font-size: 4px;">&nbsp;</td></tr>
                    </table>
                  </td>

                  <!-- 4. Out for Delivery (Pending) -->
                  <td align="center" width="34" valign="middle">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="30" height="30" style="background-color: #F8FAFC; border: 2px solid #CBD5E1; border-radius: 50%; width: 30px; height: 30px; text-align: center;">
                      <tr>
                        <td align="center" valign="middle" style="color: #94A3B8; font-size: 12px; font-weight: 700; line-height: 30px;">
                          4
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- Line 4 to 5 (Inactive Grey) -->
                  <td valign="middle" style="padding: 0 2px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" height="4" style="background-color: #E2E8F0; border-radius: 2px;">
                      <tr><td height="4" style="line-height: 4px; font-size: 4px;">&nbsp;</td></tr>
                    </table>
                  </td>

                  <!-- 5. Delivered (Pending) -->
                  <td align="center" width="34" valign="middle">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="30" height="30" style="background-color: #F8FAFC; border: 2px solid #CBD5E1; border-radius: 50%; width: 30px; height: 30px; text-align: center;">
                      <tr>
                        <td align="center" valign="middle" style="color: #94A3B8; font-size: 12px; font-weight: 700; line-height: 30px;">
                          5
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Row 2: Step Titles -->
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <span style="color: #075B4F; font-size: 11px; font-weight: 700; display: block;">Ordered</span>
                  </td>
                  <td></td>
                  <td align="center" style="padding-top: 8px;">
                    <span style="color: #075B4F; font-size: 11px; font-weight: 700; display: block;">Packed</span>
                  </td>
                  <td></td>
                  <td align="center" style="padding-top: 8px;">
                    <span style="color: #075B4F; font-size: 12px; font-weight: 800; display: block;">Shipped</span>
                    <span style="color: #C99A3D; font-size: 9px; font-weight: 700; text-transform: uppercase;">Current</span>
                  </td>
                  <td></td>
                  <td align="center" style="padding-top: 8px;">
                    <span style="color: #94A3B8; font-size: 10px; font-weight: 600; display: block;">Out for Delivery</span>
                  </td>
                  <td></td>
                  <td align="center" style="padding-top: 8px;">
                    <span style="color: #94A3B8; font-size: 11px; font-weight: 600; display: block;">Delivered</span>
                  </td>
                </tr>
              </table>

              <!-- Shipment Details Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#F7FBF9" style="background-color: #F7FBF9; border: 1px solid #D5EBE2; border-radius: 8px; margin-top: 22px; padding: 16px;">
                <tr>
                  <td>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="50%" valign="top" style="padding: 4px 8px;">
                          <p style="margin: 0; color: #4A5450; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Courier Partner</p>
                          <p style="margin: 4px 0 0 0; color: #1A2421; font-size: 14px; font-weight: bold;">Delhivery Express / Blue Dart</p>
                        </td>
                        <td width="50%" valign="top" style="padding: 4px 8px;">
                          <p style="margin: 0; color: #4A5450; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Tracking AWB Number</p>
                          <p style="margin: 4px 0 0 0; color: #075B4F; font-size: 14px; font-weight: bold; font-family: monospace;">${trackingNumber}</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" valign="top" style="padding: 12px 8px 4px 8px;">
                          <p style="margin: 0; color: #4A5450; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Estimated Delivery</p>
                          <p style="margin: 4px 0 0 0; color: #1A2421; font-size: 14px; font-weight: bold;">2 &ndash; 4 Business Days</p>
                        </td>
                        <td width="50%" valign="top" style="padding: 12px 8px 4px 8px;">
                          <p style="margin: 0; color: #4A5450; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Order Reference</p>
                          <p style="margin: 4px 0 0 0; color: #1A2421; font-size: 14px; font-weight: bold; font-family: monospace;">#${cleanOrderId}</p>
                        </td>
                      </tr>
                    </table>

                    <div style="text-align: center; margin-top: 16px; padding-top: 14px; border-top: 1px dashed #CBD5E1;">
                      <a href="https://www.namonarayanaghee.store/track-order" target="_blank" style="background-color: #075B4F; color: #FFFFFF; text-decoration: none; padding: 10px 22px; font-size: 13px; font-weight: bold; border-radius: 6px; display: inline-block;">
                        Track Order on Website &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Order Summary Section with Images -->
          <tr>
            <td style="padding: 10px 24px 20px 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid #EAE2D2; border-radius: 8px; overflow: hidden;">
                <tr bgcolor="#FAF8F3">
                  <td colspan="2" style="padding: 12px 16px; border-bottom: 1px solid #EAE2D2;">
                    <p style="margin: 0; color: #1A2421; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Package Contents
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #F1ECE1;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="64" valign="middle" style="padding-right: 14px;">
                          <img src="${productImage}" alt="${items}" width="60" height="60" style="display: block; width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #EAE2D2;" />
                        </td>
                        <td valign="middle">
                          <p style="margin: 0; color: #1A2421; font-size: 15px; font-weight: 700; line-height: 1.3;">
                            ${items}
                          </p>
                          <p style="margin: 4px 0 0 0; color: #7A5A3A; font-size: 12px;">
                            Vedic Bilona Churned &bull; Free-Grazing Gir Cow
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle" style="padding: 14px 16px; border-bottom: 1px solid #F1ECE1; font-size: 15px; color: #1A2421; font-weight: bold; white-space: nowrap;">
                    ${totalAmount}
                  </td>
                </tr>

                ${giftsList.length > 0 ? `
                <tr bgcolor="#FCFBF7">
                  <td colspan="2" style="padding: 14px 16px; border-bottom: 1px solid #F1ECE1;">
                    <p style="margin: 0 0 10px 0; color: #C99A3D; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                      &#10024; Included Complimentary Gifts
                    </p>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      ${giftsList.map(g => `
                      <tr>
                        <td width="48" valign="middle" style="padding: 6px 12px 6px 0;">
                          <img src="${g.image}" alt="${g.title}" width="42" height="42" style="display: block; width: 42px; height: 42px; object-fit: cover; border-radius: 6px; border: 1px solid #EAE2D2;" />
                        </td>
                        <td valign="middle" style="padding: 6px 0;">
                          <p style="margin: 0; color: #1A2421; font-size: 13px; font-weight: 600;">
                            ${g.title}
                          </p>
                          <span style="display: inline-block; background-color: #E6F3EE; color: #075B4F; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; margin-top: 2px;">
                            FREE GIFT
                          </span>
                        </td>
                        <td align="right" valign="middle" style="padding: 6px 0; color: #075B4F; font-size: 13px; font-weight: bold;">
                          FREE
                        </td>
                      </tr>
                      `).join('')}
                    </table>
                  </td>
                </tr>
                ` : ''}

                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; color: #4A5450;">
                    Payment Method: <strong>${paymentMethod}</strong>
                    ${remaining && remaining !== 'Rs. 0' ? `<br /><span style="color: #C99A3D; font-weight: bold;">Amount Due on Delivery: ${remaining}</span>` : ''}
                  </td>
                  <td align="right" style="padding: 12px 16px; font-size: 13px; color: #075B4F; font-weight: bold; white-space: nowrap;">
                    Verified &bull; Dispatched
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address Box -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FAF8F3" style="background-color: #FAF8F3; border: 1px solid #EAE2D2; border-radius: 8px; padding: 16px;">
                <tr>
                  <td>
                    <p style="margin: 0; color: #4A5450; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                      Shipping Destination
                    </p>
                    <p style="margin: 6px 0 0 0; color: #1A2421; font-size: 14px; font-weight: 600;">
                      ${name}
                    </p>
                    <p style="margin: 4px 0 0 0; color: #4A5450; font-size: 13px; line-height: 1.5;">
                      ${address}
                    </p>
                    ${phone ? `
                    <p style="margin: 6px 0 0 0; color: #4A5450; font-size: 13px;">
                      <strong>Phone:</strong> ${phone}
                    </p>
                    ` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Farm Story & Vedic Storage Guide (Authentic High-Trust Content) -->
          <tr>
            <td bgcolor="#FAF9F5" style="background-color: #FAF9F5; padding: 24px; border-top: 1px solid #EAE2D2; border-bottom: 1px solid #EAE2D2;">
              <h3 style="color: #075B4F; font-family: Georgia, 'Times New Roman', serif; font-size: 17px; margin: 0 0 10px 0;">
                🌱 Fresh from our Gaushala: How to Enjoy &amp; Store
              </h3>
              <p style="color: #4A5450; font-size: 13px; line-height: 1.6; margin: 0 0 10px 0;">
                &bull; <strong>Signature Danedar Texture:</strong> Authentic Bilona Ghee naturally forms a granular, golden texture at room temperature because it is slowly cultured from whole curd, not separated directly by industrial cream separators.
              </p>
              <p style="color: #4A5450; font-size: 13px; line-height: 1.6; margin: 0 0 10px 0;">
                &bull; <strong>No Refrigeration Needed:</strong> Store the glass jar in a cool, dry place. Using a clean, dry spoon preserves its divine aroma and medicinal qualities for over a year.
              </p>
              <p style="color: #4A5450; font-size: 13px; line-height: 1.6; margin: 0;">
                &bull; <strong>Ancient Vedic Method:</strong> It takes nearly 25 to 30 litres of pure milk from grass-fed indigenous Gir cows to churn one single litre of this sacred ghee.
              </p>
            </td>
          </tr>

          <!-- Contact & Support -->
          <tr>
            <td style="padding: 24px; text-align: center; color: #4A5450; font-size: 13px; line-height: 1.6;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #1A2421;">
                Need help with your delivery or have a question?
              </p>
              <p style="margin: 0 0 14px 0;">
                Reply directly to this email or write to us at <a href="mailto:care@namonarayanaghee.store" style="color: #075B4F; font-weight: bold; text-decoration: none;">care@namonarayanaghee.store</a>.
              </p>
              <p style="margin: 0; color: #7A5A3A; font-family: Georgia, serif; font-style: italic;">
                Pure Food. Stronger Bharat. &bull; Namo Narayana Vedic Farm
              </p>
            </td>
          </tr>

          <!-- Footer Legal -->
          <tr>
            <td bgcolor="#075B4F" style="background-color: #075B4F; padding: 18px 20px; text-align: center; color: #A5D6CE; font-size: 11px; line-height: 1.5;">
              <p style="margin: 0;">
                &copy; ${new Date().getFullYear()} Namo Narayana Vedic Farm. All rights reserved.<br />
                You received this transactional dispatch notification for your confirmed order at namonarayanaghee.store.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Main Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

export function buildShippingEmailText(order) {
  const name = order["Customer Name"] || "Customer";
  const orderId = (order["Order ID"] || "").replace(/^#/, "");
  const trackingNumber = generateTrackingNumber(orderId);
  const items = order["Purchased Items"] || "Pure A2 Gir Cow Ghee";
  const gifts = order["Free Gifts"] && order["Free Gifts"] !== "None" ? order["Free Gifts"] : "None";
  const address = order["Full Shipping Address"] || order["Shipping Address Line"] || "";
  const totalAmount = order["Total Amount (INR)"] || order["Total Amount (Raw)"] || "";
  const paymentMethod = order["Payment Method"] || "PREPAID";

  return `Namaste ${name},

Your order #${orderId} from Namo Narayana has been dispatched!

SHIPMENT TRACKER STATUS:
[✓] Step 1: Order Placed
[✓] Step 2: Packed & Sealed at Farm
[✓] Step 3: Shipped / In Transit (CURRENT STATUS)
[ ] Step 4: Out for Delivery
[ ] Step 5: Delivered

SHIPMENT DETAILS:
- Courier Partner: Delhivery Express / Blue Dart Air
- Tracking AWB Number: ${trackingNumber}
- Estimated Delivery: 2 to 4 business days
- Track your package live: https://www.namonarayanaghee.store/track-order

ORDER SUMMARY:
- Order Reference: #${orderId}
- Item(s): ${items}
- Complimentary Gifts: ${gifts}
- Amount: ${totalAmount} (${paymentMethod})

DELIVERY ADDRESS:
${name}
${address}

HOW TO ENJOY & STORE YOUR BILONA GHEE:
1. Natural Danedar Texture: The granular consistency is proof of 100% authentic bilona churning from cultured curd.
2. Store in a cool, dry spot away from direct heat. No refrigeration required.
3. Use a dry spoon to preserve its divine aroma and Vedic purity.

If you have any questions, reply directly to this email or contact us at care@namonarayanaghee.store.

Warm regards,
Team Namo Narayana
Pure Food. Stronger Bharat.
https://www.namonarayanaghee.store
`;
}

export async function sendEmailViaBrevo(toEmail, toName, order) {
  const orderId = (order["Order ID"] || "").replace(/^#/, "");
  const subject = `Your order has been shipped: Pure A2 Gir Cow Ghee (#${orderId})`;

  const payload = {
    sender: {
      name: "Namo Narayana",
      email: "care@namonarayanaghee.store"
    },
    to: [
      {
        email: toEmail,
        name: toName || "Customer"
      }
    ],
    replyTo: {
      name: "Namo Narayana Support",
      email: "care@namonarayanaghee.store"
    },
    subject: subject,
    htmlContent: buildShippingEmailHtml(order),
    textContent: buildShippingEmailText(order),
    headers: {
      "X-Mailin-Tag": "order-shipped-notification",
      "X-Entity-Ref-ID": `order-${orderId}`
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
    throw new Error(`Brevo API returned status ${res.status}: ${bodyText}`);
  }

  let parsed = {};
  try {
    parsed = JSON.parse(bodyText);
  } catch (e) {
    parsed = { response: bodyText };
  }
  return { status: res.status, data: parsed, subject };
}

async function main() {
  const mode = process.argv[2] || "--test";
  const orders = await loadOrders();

  console.log(`Loaded ${orders.length} orders from CSV.`);

  if (mode === "--test") {
    const sampleOrder = orders.find(o => o["Customer Name"] === "Rajat Aggarwal") || orders[0];
    const testRecipient = "littlecodr@gmail.com";
    const testName = "Mayank (Test Preview)";

    console.log(`\n======================================================`);
    console.log(`TEST MODE: Sending ONLY to ${testRecipient}`);
    console.log(`Using sample Order: ${sampleOrder["Order ID"]} (${sampleOrder["Purchased Items"]})`);
    console.log(`======================================================\n`);

    const result = await sendEmailViaBrevo(testRecipient, testName, sampleOrder);
    console.log(`✅ Test email successfully dispatched via Brevo!`);
    console.log(`Message ID:`, result.data.messageId || result.data);
    console.log(`Subject: "${result.subject}"`);
    console.log(`Recipient: ${testRecipient}`);
  } else if (mode === "--send-all") {
    console.log(`\n🚀 Starting batch dispatch for all ${orders.length} successful orders...\n`);
    
    let successCount = 0;
    let failCount = 0;
    const report = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const email = order["Customer Email"];
      const name = order["Customer Name"];
      const orderId = order["Order ID"];
      
      console.log(`[${i + 1}/${orders.length}] Sending to ${name} <${email}> for Order ${orderId}...`);
      try {
        const res = await sendEmailViaBrevo(email, name, order);
        const msgId = res.data.messageId || "OK";
        console.log(`   ✅ Success! Message ID: ${msgId}`);
        successCount++;
        report.push({ index: i + 1, orderId, name, email, status: "Sent", messageId: msgId });
      } catch (err) {
        console.error(`   ❌ Failed: ${err.message}`);
        failCount++;
        report.push({ index: i + 1, orderId, name, email, status: "Failed", error: err.message });
      }

      // 1.5 second pause between sends to maintain high inbox deliverability & avoid spam rate limits
      if (i < orders.length - 1) {
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    console.log(`\n======================================================`);
    console.log(`BATCH COMPLETE: ${successCount} sent successfully, ${failCount} failed.`);
    console.log(`======================================================\n`);
  } else {
    console.log(`Unknown mode: ${mode}. Use --test or --send-all`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('send_shipping_update.mjs')) {
  main().catch(err => {
    console.error("Execution error:", err);
    process.exit(1);
  });
}
