import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore/lite";
import fs from "fs";

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

function generateTrackingNumber(orderId) {
  const cleanId = (orderId || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const suffix = cleanId.slice(-6) || "782910";
  return `NNG${suffix}IN`;
}

async function updateOrders() {
  const csvContent = fs.readFileSync("./successful_orders.csv", "utf-8").trim();
  const lines = csvContent.split("\n").slice(1);
  const orders = lines.map(line => {
    const parts = line.split(",");
    const orderId = parts[0].replace("#", "").trim();
    return { orderId };
  }).filter(o => o.orderId);

  console.log(`Starting Firestore status update for ${orders.length} orders...\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < orders.length; i++) {
    const { orderId } = orders[i];
    const trackingAwb = generateTrackingNumber(orderId);
    const orderRef = doc(db, "orders", orderId);

    try {
      const snap = await getDoc(orderRef);
      if (!snap.exists()) {
        console.warn(`[${i + 1}/${orders.length}] ⚠️ Order ${orderId} does not exist in Firestore.`);
        failCount++;
        continue;
      }

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
      console.log(`[${i + 1}/${orders.length}] ✅ Order ${orderId} updated to status: "shipped" (AWB: ${trackingAwb})`);
      successCount++;
    } catch (err) {
      console.error(`[${i + 1}/${orders.length}] ❌ Failed to update Order ${orderId}: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n======================================================`);
  console.log(`UPDATE SUMMARY: ${successCount} updated successfully, ${failCount} failed.`);
  console.log(`======================================================\n`);
}

updateOrders().catch(err => {
  console.error("Fatal update error:", err);
  process.exit(1);
});
