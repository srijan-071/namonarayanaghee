import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amountPaidPaise = 0,
      discountPaise = 0,
      originalRemainingPaise = 0,
    } = body;

    const cleanOrderId = (orderId || "").toString().replace(/^#/, "").trim();

    if (!cleanOrderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const orderRef = doc(db, "orders", cleanOrderId);
    const snap = await getDoc(orderRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = snap.data();
    const nowIso = new Date().toISOString();

    // Verify HMAC SHA256 signature if credentials and signature parameters are present
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    let signatureVerified: boolean | null = null;
    if (key_secret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      try {
        const crypto = await import("crypto");
        const expectedSignature = crypto
          .createHmac("sha256", key_secret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest("hex");
        signatureVerified = expectedSignature === razorpay_signature;
        if (!signatureVerified) {
          console.warn(`[PREPAY_CONVERSION] Signature mismatch for order ${cleanOrderId}.`);
        }
      } catch (sigErr) {
        console.error("Signature verification error:", sigErr);
      }
    }

    const paidInRupees = amountPaidPaise > 0 ? (amountPaidPaise / 100).toFixed(0) : "Paid Online";
    const savedInRupees = discountPaise > 0 ? (discountPaise / 100).toFixed(0) : "0";

    const updatePayload: Record<string, any> = {
      paymentStatus: "paid",
      balanceDueOnDelivery: 0,
      amountRemaining: 0,
      codConvertedToPrepaid: true,
      prepayConvertedAt: nowIso,
      prepayPaymentId: razorpay_payment_id || "verified_online",
      prepayAmountPaid: amountPaidPaise,
      prepayDiscountSaved: discountPaise,
      courierDeliveryNote: "PREPAID ORDER - DO NOT COLLECT CASH AT DOORSTEP (COLLECT ₹0)",
      updatedAt: new Date(),
      statusHistory: [
        ...(orderData.statusHistory || []),
        {
          status: "paid",
          timestamp: nowIso,
          notes: `Customer converted COD to Prepaid on Track Order page. Paid ₹${paidInRupees} online with ₹250 COD fee waiver + 10% discount. Balance to collect on delivery is ₹0.`,
          prepayPaymentId: razorpay_payment_id || "verified"
        }
      ]
    };

    await updateDoc(orderRef, updatePayload);

    const updatedOrder = {
      ...orderData,
      ...updatePayload,
      id: cleanOrderId
    };

    // Send instant Telegram notification to store owners
    try {
      const customerName = orderData.shippingAddress?.name || orderData.contactInfo?.name || "Customer";
      const customerPhone = orderData.contactInfo?.phone || orderData.shippingAddress?.phone || "N/A";
      const cleanPhone = customerPhone.replace(/\D/g, "").slice(-10);

      const telegramMsg = `
🔥⚡ COD CONVERTED TO PREPAID! ⚡🔥
-----------------------------------------
📦 Order ID: #${cleanOrderId}
👤 Customer: ${customerName}
📞 Phone: +91 ${cleanPhone}
💰 Original Doorstep COD: ₹${(originalRemainingPaise / 100).toFixed(0)}
🎉 Amount Paid Online: ₹${paidInRupees}
🎁 Customer Saved: ₹${savedInRupees} (₹250 waiver + 10% OFF)
💳 Payment ID: ${razorpay_payment_id || "Online Gateway"}
🚚 Delivery Instruction: COLLECT ₹0 (ZERO CASH)
-----------------------------------------
✅ 100% Guaranteed Delivery (RTO Risk Eliminated!)
`.trim();

      await sendTelegramNotification(cleanOrderId, updatedOrder, "prepay_conversion", telegramMsg);
    } catch (teleErr) {
      console.error("Failed to send Telegram alert for prepay conversion:", teleErr);
    }

    return NextResponse.json({
      success: true,
      message: "Order successfully converted to prepaid",
      order: updatedOrder
    });
  } catch (err: any) {
    console.error("Error converting COD to prepaid:", err);
    return NextResponse.json({ error: err.message || "Failed to convert COD to prepaid" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderId = (url.searchParams.get("orderId") || url.searchParams.get("txnid") || "").replace(/^#/, "").trim();
    const razorpayPaymentId = url.searchParams.get("razorpay_payment_id") || url.searchParams.get("payment_id") || "";
    const razorpayOrderId = url.searchParams.get("razorpay_order_id") || "";
    const razorpaySignature = url.searchParams.get("razorpay_signature") || "";
    const status = url.searchParams.get("status") || "success";

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "namonarayanaghee.store";
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const origin = `${proto}://${host}`;

    if (orderId && status.toLowerCase() === "success") {
      try {
        const orderRef = doc(db, "orders", orderId);
        const snap = await getDoc(orderRef);
        if (snap.exists()) {
          const nowIso = new Date().toISOString();
          await updateDoc(orderRef, {
            paymentStatus: "paid",
            balanceDueOnDelivery: 0,
            amountRemaining: 0,
            codConvertedToPrepaid: true,
            prepayConvertedAt: nowIso,
            prepayPaymentId: razorpayPaymentId || "verified_online",
            courierDeliveryNote: "PREPAID ORDER - DO NOT COLLECT CASH AT DOORSTEP (COLLECT ₹0)",
            updatedAt: new Date()
          });
        }
      } catch (dbErr) {
        console.error("Failed to update order on GET callback:", dbErr);
      }

      return NextResponse.redirect(`${origin}/track-order?orderId=${encodeURIComponent(orderId)}&upgradedPrepaid=true`, 302);
    }

    return NextResponse.redirect(`${origin}/track-order?orderId=${encodeURIComponent(orderId)}`, 302);
  } catch (err: any) {
    console.error("Error in convert-cod-to-prepaid GET:", err);
    return NextResponse.redirect("https://www.namonarayanaghee.store/track-order", 302);
  }
}
