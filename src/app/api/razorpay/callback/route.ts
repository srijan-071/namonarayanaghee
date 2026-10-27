import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore/lite";
import { sendOrderEmail } from "@/lib/email";
import { sendTelegramNotification } from "@/lib/telegram";

async function handleCallback(req: Request) {
  try {
    let orderId = '';
    let razorpayPaymentId = '';
    let razorpayOrderId = '';
    let razorpaySignature = '';
    let status = '';
    let amount = '';

    const url = new URL(req.url);
    if (req.method === 'GET') {
      orderId = url.searchParams.get('orderId') || url.searchParams.get('txnid') || url.searchParams.get('order_id') || '';
      razorpayPaymentId = url.searchParams.get('razorpay_payment_id') || url.searchParams.get('payment_id') || '';
      razorpayOrderId = url.searchParams.get('razorpay_order_id') || '';
      razorpaySignature = url.searchParams.get('razorpay_signature') || '';
      status = url.searchParams.get('status') || '';
      amount = url.searchParams.get('amount') || '';
    } else {
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await req.json();
        orderId = json.orderId || json.txnid || json.order_id || '';
        razorpayPaymentId = json.razorpay_payment_id || json.payment_id || '';
        razorpayOrderId = json.razorpay_order_id || '';
        razorpaySignature = json.razorpay_signature || '';
        status = json.status || '';
        amount = json.amount || '';
      } else {
        const formData = await req.formData();
        orderId = formData.get('orderId')?.toString() || formData.get('txnid')?.toString() || formData.get('order_id')?.toString() || '';
        razorpayPaymentId = formData.get('razorpay_payment_id')?.toString() || formData.get('payment_id')?.toString() || '';
        razorpayOrderId = formData.get('razorpay_order_id')?.toString() || '';
        razorpaySignature = formData.get('razorpay_signature')?.toString() || '';
        status = formData.get('status')?.toString() || '';
        amount = formData.get('amount')?.toString() || '';
      }
    }

    // Dynamically resolve host & protocol
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'namonarayanaghee.store';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const origin = `${proto}://${host}`;

    const isSuccess = status.toLowerCase() === 'success' || !!razorpayPaymentId;

    if (orderId && isSuccess) {
      try {
        const orderRef = doc(db, "orders", orderId);
        const snap = await getDoc(orderRef);
        if (snap.exists()) {
          const orderData = snap.data();
          await updateDoc(orderRef, {
            paymentStatus: "paid",
            status: "processing",
            paymentSessionId: razorpayPaymentId || null,
            paymentDetails: {
              razorpay_payment_id: razorpayPaymentId || null,
              razorpay_order_id: razorpayOrderId || null,
              razorpay_signature: razorpaySignature || null,
              amount: Number(amount) || orderData.amountToPay || 0,
              gateway: "razorpay",
              proxyDomain: "potter-world.com",
              paidAt: new Date().toISOString()
            },
            updatedAt: new Date()
          });

          // Send confirmation notifications
          if (orderData.contactInfo?.email) {
            sendOrderEmail(
              orderId,
              orderData.contactInfo.email,
              orderData.shippingAddress?.name || "Customer",
              orderData.amountToPay || orderData.totalAmount,
              orderData
            ).catch(err => console.error("Email notification failed:", err));

            deleteDoc(doc(db, "abandoned_carts", orderData.contactInfo.email))
              .catch(err => console.error("Abandoned cart cleanup failed:", err));
          }

          sendTelegramNotification(orderId, {
            ...orderData,
            paymentSessionId: razorpayPaymentId || orderData.paymentSessionId,
            paymentStatus: "paid"
          }, "success")
            .catch(err => console.error("Telegram notification failed:", err));
        }
      } catch (firestoreErr) {
        console.error("Firestore order update error in Razorpay callback:", firestoreErr);
      }
    }

    const redirectUrl = new URL(`${origin}/checkout/success`);
    redirectUrl.searchParams.set('orderId', orderId);
    redirectUrl.searchParams.set('txnid', orderId);
    redirectUrl.searchParams.set('status', isSuccess ? 'success' : 'failed');
    if (razorpayPaymentId) redirectUrl.searchParams.set('razorpay_payment_id', razorpayPaymentId);
    if (razorpayOrderId) redirectUrl.searchParams.set('razorpay_order_id', razorpayOrderId);

    return NextResponse.redirect(redirectUrl.toString(), 302);
  } catch (error: any) {
    console.error('Razorpay callback handling error:', error);
    return NextResponse.json({ error: 'Failed to process Razorpay callback' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return handleCallback(req);
}

export async function POST(req: Request) {
  return handleCallback(req);
}
