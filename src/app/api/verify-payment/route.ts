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

    // Idempotency: Prevent duplicate notifications if customer refreshes the Thank You page
    if (orderData.thankYouPageReached && orderData.paymentStatus === "paid") {
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

    // 1. Mark order as PAID in Firestore now that user has officially reached the Thank You page
    const updatedFields: Record<string, any> = {
      paymentStatus: "paid",
      status: "processing",
      paymentSessionId: paymentId !== "verified" ? paymentId : (orderData.paymentSessionId || paymentId),
      paymentDetails: {
        ...(orderData.paymentDetails || {}),
        razorpay_payment_id: paymentId,
        razorpay_order_id: razorpay_order_id || orderData.paymentDetails?.razorpay_order_id || null,
        razorpay_signature: razorpay_signature || orderData.paymentDetails?.razorpay_signature || null,
        signatureVerified: signatureVerified ?? orderData.paymentDetails?.signatureVerified ?? null,
        gateway: gateway || orderData.paymentDetails?.gateway || "razorpay",
        proxyDomain: "potter-world.com",
        paidAt: orderData.paymentDetails?.paidAt || nowIso,
        thankYouPageReachedAt: nowIso,
      },
      thankYouPageReached: true,
      notificationsSent: true,
      updatedAt: new Date()
    };

    await updateDoc(orderRef, updatedFields);

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

    await Promise.allSettled([
      sendTelegramNotification(cleanOrderId, orderWithGeo, "success").catch((err) => {
        console.error("Telegram notification error on thank-you page:", err);
      }),
      customerEmail
        ? sendOrderEmail(cleanOrderId, customerEmail, customerName, orderTotal, mergedOrder).catch((err) => {
            console.error("Customer confirmation email error on thank-you page:", err);
          })
        : Promise.resolve(),
      // Transition abandoned-cart lead to 'paid' / recovered across both phone and email
      customerPhone
        ? updateAbandonedCartStatus(customerPhone.replace(/\D/g, ""), "paid", { orderId: cleanOrderId }).catch(() => {})
        : Promise.resolve(),
      customerEmail && !customerEmail.endsWith("@customer.namonarayanaghee.store")
        ? updateAbandonedCartStatus(customerEmail, "paid", { orderId: cleanOrderId }).catch(() => {})
        : Promise.resolve()
    ]);

    return NextResponse.json({
      success: true,
      order: mergedOrder
    });
  } catch (error: any) {
    console.error("Verify payment / thank you page confirmation error:", error);
    return NextResponse.json({ error: error.message || "Failed to confirm order" }, { status: 500 });
  }
}
