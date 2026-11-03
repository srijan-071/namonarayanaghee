import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore/lite";
import { sendOrderEmail } from "@/lib/email";
import { sendTelegramNotification } from "@/lib/telegram";
import { resolveClientGeo } from "@/lib/server-geo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      txnid,
      id,
      razorpay_payment_id,
      payment_id,
      payuid,
      sessionId,
      razorpay_order_id,
      razorpay_signature,
      gateway = "razorpay"
    } = body;

    const cleanOrderId = orderId || txnid || id;
    const paymentId = razorpay_payment_id || payment_id || payuid || sessionId || "verified";

    if (!cleanOrderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const orderRef = doc(db, "orders", cleanOrderId);
    const snap = await getDoc(orderRef);
    if (!snap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = snap.data();

    // Idempotency: Only skip if BOTH thank-you page has been reached AND notifications have already been sent
    if (orderData.thankYouPageReached && orderData.notificationsSent && (orderData.paymentStatus === "paid" || orderData.paymentStatus === "advance_paid")) {
      return NextResponse.json({
        success: true,
        alreadyConfirmed: true,
        order: { ...orderData, id: cleanOrderId }
      });
    }

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
          console.warn(`[PAYMENT_WARNING] Signature mismatch for order ${cleanOrderId}.`);
        }
      } catch (sigErr) {
        console.error("Signature verification error:", sigErr);
      }
    }

    const isCod = orderData.paymentMethod === "cod";
    const paymentStatus = isCod ? "advance_paid" : "paid";
    const advancePaid = isCod ? (orderData.amountToPay || 25000) : 0;
    const balanceDueOnDelivery = isCod ? (orderData.amountRemaining || 0) : 0;

    // Helper to deeply sanitize data so Firestore updateDoc never throws:
    // "Unsupported field value: undefined"
    const sanitizeFirestoreData = (data: any): any => {
      if (data === undefined) return null;
      if (data === null || typeof data !== "object") return data;
      if (data instanceof Date) return data;
      if (Array.isArray(data)) return data.map(sanitizeFirestoreData);
      const cleaned: Record<string, any> = {};
      for (const [k, v] of Object.entries(data)) {
        if (v !== undefined) {
          cleaned[k] = sanitizeFirestoreData(v);
        }
      }
      return cleaned;
    };

    const cleanPaymentDetails: Record<string, any> = {
      ...(orderData.paymentDetails || {}),
      razorpay_payment_id: paymentId,
      razorpay_order_id: razorpay_order_id || orderData.paymentDetails?.razorpay_order_id || null,
      razorpay_signature: razorpay_signature || orderData.paymentDetails?.razorpay_signature || null,
      signatureVerified: signatureVerified ?? orderData.paymentDetails?.signatureVerified ?? null,
      gateway: gateway || orderData.paymentDetails?.gateway || "razorpay",
      proxyDomain: "potter-world.com",
      paidAt: orderData.paymentDetails?.paidAt || nowIso,
      thankYouPageReachedAt: nowIso,
      advancePaidAmount: isCod ? advancePaid : 0,
      balanceDueAmount: isCod ? balanceDueOnDelivery : 0,
    };

    // 1. Mark order as PAID / ADVANCE_PAID in Firestore now that user has reached the Thank You page
    const updatedFields: Record<string, any> = {
      paymentStatus,
      status: "processing",
      advancePaid,
      balanceDueOnDelivery,
      paymentSessionId: paymentId !== "verified" ? paymentId : (orderData.paymentSessionId || paymentId),
      paymentDetails: cleanPaymentDetails,
      statusHistory: [
        ...(orderData.statusHistory || []),
        {
          status: paymentStatus,
          timestamp: nowIso,
          notes: isCod
            ? `Advance ₹${(advancePaid / 100).toFixed(0)} received online. Balance ₹${(balanceDueOnDelivery / 100).toFixed(0)} to be collected on delivery.`
            : "100% prepaid order verified via gateway."
        }
      ],
      thankYouPageReached: true,
      updatedAt: new Date()
    };

    await updateDoc(orderRef, sanitizeFirestoreData(updatedFields));

    const mergedOrder = {
      ...orderData,
      ...updatedFields,
      id: cleanOrderId
    };

    // 1.5. Issue Diwali Coupon
    const items = orderData.items || [];
    let gheeVolume = 0;
    items.forEach((item: any) => {
      const title = (item.name || item.title || "").toLowerCase();
      if (title.includes("500 ml") || title.includes("500ml")) gheeVolume += 0.5;
      else if (title.includes("1 litre") || title.includes("1l")) gheeVolume += 1;
      else if (title.includes("2.5 litre") || title.includes("2.5")) gheeVolume += 2.5;
      else if (title.includes("5 litre") || title.includes("5l")) gheeVolume += 5;
    });

    let rewardAmount = 0;
    if (gheeVolume >= 5) rewardAmount = 1000;
    else if (gheeVolume >= 2.5) rewardAmount = 500;
    else if (gheeVolume >= 1) rewardAmount = 250;
    else if (gheeVolume >= 0.5) rewardAmount = 100;

    let couponCode = "";
    if (rewardAmount > 0) {
      try {
        const { generateDiwaliCoupon } = await import("@/lib/coupons");
        const customerEmail = orderData.contactInfo?.email || orderData.shippingAddress?.email || "";
        const customerPhone = orderData.contactInfo?.phone || orderData.shippingAddress?.phone || "";
        couponCode = await generateDiwaliCoupon(customerEmail, customerPhone, rewardAmount);
        await updateDoc(orderRef, { diwaliCoupon: couponCode, rewardAmount });
        (mergedOrder as any).diwaliCoupon = couponCode;
        (mergedOrder as any).rewardAmount = rewardAmount;
      } catch (couponErr) {
        console.error("Failed to generate Diwali coupon:", couponErr);
      }
    }

    const geoInfo = await resolveClientGeo(req);
    const orderWithGeo = {
      ...mergedOrder,
      geo: geoInfo,
      clientIp: geoInfo.ip,
      isp: geoInfo.isp,
      deviceSummary: geoInfo.deviceSummary,
    };

    // 2. Dispatch Telegram Bot notification and Customer Brevo Confirmation Email in parallel
    const customerEmail = orderData.contactInfo?.email || orderData.shippingAddress?.email || orderData.customerEmail;
    const customerPhone = orderData.contactInfo?.phone || orderData.shippingAddress?.phone || orderData.customerPhone;
    const customerName = orderData.shippingAddress?.name || orderData.contactInfo?.name || "Customer";
    const orderTotal = orderData.amountToPay || orderData.totalAmount;

    const { updateAbandonedCartStatus } = await import("@/lib/abandoned-cart");

    const [telegramRes, emailRes] = await Promise.allSettled([
      sendTelegramNotification(cleanOrderId, orderWithGeo, "success").catch((err) => {
        console.error("Telegram notification error on thank-you page:", err);
        throw err;
      }),
      customerEmail
        ? sendOrderEmail(cleanOrderId, customerEmail, customerName, orderTotal, mergedOrder).catch((err) => {
            console.error("Customer confirmation email error on thank-you page:", err);
            throw err;
          })
        : Promise.resolve(true),
      // Transition abandoned-cart lead to 'paid' / recovered across both phone and email
      customerPhone
        ? updateAbandonedCartStatus(customerPhone.replace(/\D/g, ""), "paid", { orderId: cleanOrderId }).catch(() => {})
        : Promise.resolve(),
      customerEmail && !customerEmail.endsWith("@customer.namonarayanaghee.store")
        ? updateAbandonedCartStatus(customerEmail, "paid", { orderId: cleanOrderId }).catch(() => {})
        : Promise.resolve()
    ]);

    const telegramSent = telegramRes.status === "fulfilled";
    const emailSent = emailRes.status === "fulfilled";

    console.log(`[ORDER_CONFIRMATION_DISPATCH] Order #${cleanOrderId} - Telegram: ${telegramSent ? "SUCCESS" : "FAILED"}, Email: ${emailSent ? "SUCCESS" : "FAILED"}`);

    if (telegramSent || emailSent) {
      try {
        await updateDoc(orderRef, { notificationsSent: true });
        (mergedOrder as any).notificationsSent = true;
      } catch (saveErr) {
        console.error("Failed to mark notificationsSent in Firestore:", saveErr);
      }
    }

    return NextResponse.json({
      success: true,
      order: mergedOrder
    });
  } catch (error: any) {
    console.error("Verify payment / thank you page confirmation error:", error);
    return NextResponse.json({ error: error.message || "Failed to confirm order" }, { status: 500 });
  }
}
