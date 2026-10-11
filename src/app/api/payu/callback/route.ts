import { NextResponse } from 'next/server';
import { firestoreGetDoc, firestoreUpdateDoc, firestoreDeleteDoc } from "@/lib/firestore-rest";
import { sendOrderEmail } from "@/lib/email";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const status = formData.get('status')?.toString() || '';
    const txnid = formData.get('txnid')?.toString() || '';
    const payuid = formData.get('mihpayid')?.toString() || '';
    const error_Message = formData.get('error_Message')?.toString() || '';
    const amount = formData.get('amount')?.toString() || '';

    // Dynamically resolve origin from headers
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'namonarayanaghee.store';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const origin = `${proto}://${host}`;

    const isSuccess = status.toLowerCase() === 'success';

    if (txnid && isSuccess) {
      try {
        const orderData = await firestoreGetDoc("orders", txnid);
        if (orderData) {
          await firestoreUpdateDoc("orders", txnid, {
            paymentStatus: "paid",
            status: "processing",
            paymentSessionId: payuid || null,
            paymentDetails: {
              payuid: payuid || null,
              amount: Number(amount) || 0,
              gateway: "payu",
              paidAt: new Date().toISOString()
            },
            updatedAt: new Date()
          });

          // Send confirmation notifications
          if (orderData.contactInfo?.email) {
            await sendOrderEmail(
              txnid,
              orderData.contactInfo.email,
              orderData.shippingAddress?.name || "Customer",
              orderData.amountToPay || orderData.totalAmount
            ).catch(err => console.error("Email notification failed:", err));

            await firestoreDeleteDoc("abandoned_carts", orderData.contactInfo.email)
              .catch(err => console.error("Abandoned cart cleanup failed:", err));
          }

          await sendTelegramNotification(txnid, orderData, "success")
            .catch(err => console.error("Telegram notification failed:", err));
        }
      } catch (firestoreErr) {
        console.error("Firestore order update error in PayU callback:", firestoreErr);
      }
    }

    const redirectUrl = new URL(`${origin}/checkout/success`);
    redirectUrl.searchParams.set('orderId', txnid);
    redirectUrl.searchParams.set('txnid', txnid);
    redirectUrl.searchParams.set('status', isSuccess ? 'success' : 'failed');
    if (payuid) redirectUrl.searchParams.set('payuid', payuid);
    if (error_Message) redirectUrl.searchParams.set('error', error_Message);

    return NextResponse.redirect(redirectUrl.toString(), 302);
  } catch (error: any) {
    console.error('PayU callback handling error:', error);
    return NextResponse.json({ error: 'Failed to process PayU callback' }, { status: 500 });
  }
}
