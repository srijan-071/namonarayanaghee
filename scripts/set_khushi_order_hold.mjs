import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore/lite";

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

const ORDER_ID = "z9cNOR9gMwHlC4sqkEn6";

async function putOrderUnderHold() {
  console.log(`Fetching order #${ORDER_ID}...`);
  const orderRef = doc(db, "orders", ORDER_ID);
  const snap = await getDoc(orderRef);

  if (!snap.exists()) {
    console.error(`Order #${ORDER_ID} does not exist in Firestore!`);
    process.exit(1);
  }

  const existingData = snap.data();
  console.log(`Current Status: ${existingData.status}`);
  console.log(`Current AWB: ${existingData.awbNumber || existingData.trackingNumber || "None"}`);

  const existingHistory = Array.isArray(existingData.statusHistory) ? existingData.statusHistory : [];

  const newHistoryEntry = {
    status: "under_hold",
    timestamp: new Date().toISOString(),
    courierPartner: null,
    trackingNumber: null,
    adminNotes: "Order placed under hold. Preparing new priority shipment from facility.",
    notified: false
  };

  const updatePayload = {
    status: "under_hold",
    shippingStatus: "under_hold",
    shipmentStatus: "under_hold",
    orderStatusNote: "Under Hold - Reprocessing Fresh Shipment",
    courierPartner: null,
    trackingNumber: null,
    awbNumber: null,
    adminNotes: "Order on hold due to logistics manifest error. Arranging fresh priority dispatch.",
    statusHistory: [...existingHistory, newHistoryEntry],
    updatedAt: new Date().toISOString()
  };

  console.log("Applying update to Firestore...");
  await updateDoc(orderRef, updatePayload);

  console.log(`✅ Order #${ORDER_ID} has been successfully updated to status: 'under_hold'!`);

  // Verify
  const verifySnap = await getDoc(orderRef);
  const updatedData = verifySnap.data();
  console.log("\n--- Verification ---");
  console.log("Status:", updatedData.status);
  console.log("Shipping Status:", updatedData.shippingStatus);
  console.log("Tracking Number:", updatedData.trackingNumber);
  console.log("AWB Number:", updatedData.awbNumber);
  console.log("Courier Partner:", updatedData.courierPartner);
  console.log("Admin Notes:", updatedData.adminNotes);
  console.log("History entries:", updatedData.statusHistory.length);
}

putOrderUnderHold().catch(err => {
  console.error("Error updating order:", err);
  process.exit(1);
});
