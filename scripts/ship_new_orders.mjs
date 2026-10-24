import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore/lite";
import fs from "fs";
import { sendEmailViaBrevo, generateTrackingNumber } from "./send_shipping_update.mjs";

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

const newOrders = [
  {
    "Order ID": "#Jg8wxeAYGynkDsIZxXvF",
    "Order Status": "shipped",
    "Payment Status": "Payment Verified",
    "Payment Method": "PREPAID",
    "Customer Name": "Sneha Mapari",
    "Customer Email": "sneha.mapari@gmail.com",
    "Customer Phone": "8805794840",
    "Shipping Address Line": "D-803, Kumar Piccadilly, near Akshara International School, Bhumkar Chowk,Wakad",
    "City / District": "Pune",
    "State": "Maharashtra",
    "Pincode": "411057",
    "Country": "India",
    "Full Shipping Address": "D-803, Kumar Piccadilly, near Akshara International School, Bhumkar Chowk,Wakad, Pune, Maharashtra 411057, India",
    "Purchased Items": "1x Pure A2 Gir Cow Ghee 500 ml (500 ml)",
    "Free Gifts": "None",
    "All Items Detailed": "1x Pure A2 Gir Cow Ghee 500 ml (500 ml) - Rs. 599.00",
    "Subtotal (Raw)": "Rs. 599.00",
    "Discount (Raw)": "Rs. 0.00",
    "Total Amount (Raw)": "Rs. 599.00",
    "Amount Paid (Raw)": "Rs. 599.00",
    "Amount Remaining (Raw)": "Rs. 0.00",
    "Subtotal (INR)": "₹599.00",
    "Discount (INR)": "₹0.00",
    "Total Amount (INR)": "₹599.00",
    "Amount Paid (INR)": "₹599.00",
    "Amount Remaining (INR)": "₹0.00"
  },
  {
    "Order ID": "#i8KKOOHfA3zJklyisB5q",
    "Order Status": "shipped",
    "Payment Status": "Payment Verified",
    "Payment Method": "PREPAID",
    "Customer Name": "Preeti Kumari",
    "Customer Email": "pritygupta897@gmail.com",
    "Customer Phone": "7561935413",
    "Shipping Address Line": "Rda apartment sarona house no.110 E block ",
    "City / District": "Raipur",
    "State": "Chattisgarh",
    "Pincode": "492099",
    "Country": "India",
    "Full Shipping Address": "Rda apartment sarona house no.110 E block , Raipur, Chattisgarh 492099, India",
    "Purchased Items": "1x Pure A2 Gir Cow Ghee 1 Litre (1 Litre)",
    "Free Gifts": "1x Mustard Oil – 250 ml (Free Gift)",
    "All Items Detailed": "1x Pure A2 Gir Cow Ghee 1 Litre (1 Litre) - Rs. 949.00; 1x Mustard Oil – 250 ml (Free Gift) (250ml (Free Gift)) - FREE GIFT",
    "Subtotal (Raw)": "Rs. 949.00",
    "Discount (Raw)": "Rs. 94.90",
    "Total Amount (Raw)": "Rs. 854.10",
    "Amount Paid (Raw)": "Rs. 854.10",
    "Amount Remaining (Raw)": "Rs. 0.00",
    "Subtotal (INR)": "₹949.00",
    "Discount (INR)": "₹94.90",
    "Total Amount (INR)": "₹854.10",
    "Amount Paid (INR)": "₹854.10",
    "Amount Remaining (INR)": "₹0.00"
  },
  {
    "Order ID": "#8R9PsVjhYtxHtOcXvLQK",
    "Order Status": "shipped",
    "Payment Status": "Payment Verified",
    "Payment Method": "PREPAID",
    "Customer Name": "Mridul tandon",
    "Customer Email": "rajeshtandon02@gmail.com",
    "Customer Phone": "08700012040",
    "Shipping Address Line": "a-9,jangpura extension,opp.dav school",
    "City / District": "South Delhi",
    "State": "Delhi",
    "Pincode": "110014",
    "Country": "India",
    "Full Shipping Address": "a-9,jangpura extension,opp.dav school, South Delhi, Delhi 110014, India",
    "Purchased Items": "1x Pure A2 Gir Cow Ghee 5 Litre (5 Litre)",
    "Free Gifts": "1x Coconut Oil – 250 ml (Free Gift), 1x Groundnut Oil – 250 ml (Free Gift), 1x Mustard Oil – 500 ml (Free Gift)",
    "All Items Detailed": "1x Pure A2 Gir Cow Ghee 5 Litre (5 Litre) - Rs. 3,499.00; 1x Coconut Oil – 250 ml (Free Gift) - FREE GIFT; 1x Groundnut Oil – 250 ml (Free Gift) - FREE GIFT; 1x Mustard Oil – 500 ml (Free Gift) - FREE GIFT",
    "Subtotal (Raw)": "Rs. 3,499.00",
    "Discount (Raw)": "Rs. 0.00",
    "Total Amount (Raw)": "Rs. 3,499.00",
    "Amount Paid (Raw)": "Rs. 3,499.00",
    "Amount Remaining (Raw)": "Rs. 0.00",
    "Subtotal (INR)": "₹3,499.00",
    "Discount (INR)": "₹0.00",
    "Total Amount (INR)": "₹3,499.00",
    "Amount Paid (INR)": "₹3,499.00",
    "Amount Remaining (INR)": "₹0.00"
  }
];

async function main() {
  console.log("=================================================================");
  console.log(`PROCESSING ${newOrders.length} ORDERS: UPDATE FIRESTORE & SEND SHIPPING EMAIL`);
  console.log("=================================================================\n");

  for (let i = 0; i < newOrders.length; i++) {
    const order = newOrders[i];
    const rawOrderId = order["Order ID"];
    const cleanOrderId = rawOrderId.replace(/^#/, "");
    const email = order["Customer Email"];
    const name = order["Customer Name"];
    const trackingAwb = generateTrackingNumber(cleanOrderId);

    console.log(`\n--------------------------------------------------------------`);
    console.log(`[${i + 1}/${newOrders.length}] Processing Order ${rawOrderId} for ${name} <${email}>`);
    console.log(`AWB: ${trackingAwb}`);

    // 1. Update Firestore
    try {
      const orderRef = doc(db, "orders", cleanOrderId);
      const snap = await getDoc(orderRef);
      if (!snap.exists()) {
        console.warn(`⚠️ Warning: Order ${cleanOrderId} not found in Firestore!`);
      } else {
        const updateData = {
          status: "shipped",
          shippingStatus: "shipped",
          shipmentStatus: "shipped",
          shippedAt: new Date().toISOString(),
          trackingNumber: trackingAwb,
          awbNumber: trackingAwb,
          courierPartner: "Delhivery Express / Blue Dart",
          trackingUrl: "https://www.namonarayanaghee.store/track-order"
        };
        await updateDoc(orderRef, updateData);
        console.log(`✅ Firestore Updated: Status set to "shipped", AWB: ${trackingAwb}`);
      }
    } catch (err) {
      console.error(`❌ Firestore update failed:`, err.message);
    }

    // 2. Send Shipping Confirmation Email via Brevo
    try {
      console.log(`Sending shipping update email via Brevo to ${email}...`);
      const emailResult = await sendEmailViaBrevo(email, name, order);
      console.log(`✅ Email Sent Successfully! Message ID:`, emailResult.data.messageId || emailResult.data);
    } catch (err) {
      console.error(`❌ Email sending failed:`, err.message);
    }
  }

  // 3. Append to successful_orders.csv if not already present
  try {
    const csvPath = "./successful_orders.csv";
    let csv = fs.readFileSync(csvPath, "utf-8");
    for (const order of newOrders) {
      const orderId = order["Order ID"];
      if (!csv.includes(orderId)) {
        const row = [
          order["Order ID"],
          order["Order Status"],
          order["Payment Status"],
          order["Payment Method"],
          `"${order["Customer Name"]}"`,
          order["Customer Email"],
          order["Customer Phone"],
          `"${order["Shipping Address Line"]}"`,
          `"${order["City / District"]}"`,
          `"${order["State"]}"`,
          order["Pincode"],
          order["Country"],
          `"${order["Full Shipping Address"]}"`,
          `"${order["Purchased Items"]}"`,
          `"${order["Free Gifts"]}"`,
          `"${order["All Items Detailed"]}"`,
          order["Subtotal (Raw)"],
          order["Discount (Raw)"],
          order["Total Amount (Raw)"],
          order["Amount Paid (Raw)"],
          order["Amount Remaining (Raw)"],
          `"${order["Subtotal (INR)"]}"`,
          `"${order["Discount (INR)"]}"`,
          `"${order["Total Amount (INR)"]}"`,
          `"${order["Amount Paid (INR)"]}"`,
          `"${order["Amount Remaining (INR)"]}"`
        ].join(",");
        csv += "\n" + row;
        console.log(`✅ Appended ${orderId} to successful_orders.csv`);
      }
    }
    fs.writeFileSync(csvPath, csv, "utf-8");
  } catch (err) {
    console.error(`❌ Failed to update CSV:`, err.message);
  }

  console.log("\n=================================================================");
  console.log("ALL 3 ORDERS HAVE BEEN UPDATED IN FIRESTORE AND EMAILS DISPATCHED!");
  console.log("=================================================================");
}

main().catch(console.error);
