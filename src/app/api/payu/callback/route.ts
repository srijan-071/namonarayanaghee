import { NextResponse } from 'next/server';

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

    // Do NOT mark order paid in Firestore here!
    // The order will be marked paid and notifications (Telegram + Email) dispatched
    // ONLY when the customer reaches the Thank You page (/checkout/success).
    const redirectUrl = new URL(`${origin}/checkout/success`);
    redirectUrl.searchParams.set('orderId', txnid);
    redirectUrl.searchParams.set('txnid', txnid);
    redirectUrl.searchParams.set('status', isSuccess ? 'success' : 'failed');
    if (payuid) redirectUrl.searchParams.set('payuid', payuid);
    if (amount) redirectUrl.searchParams.set('amount', amount);
    if (error_Message) redirectUrl.searchParams.set('error', error_Message);

    return NextResponse.redirect(redirectUrl.toString(), 302);
  } catch (error: any) {
    console.error('PayU callback handling error:', error);
    return NextResponse.json({ error: 'Failed to process PayU callback' }, { status: 500 });
  }
}
