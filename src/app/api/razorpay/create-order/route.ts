import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, customerInfo, notes } = body;

    const email = (customerInfo?.email || notes?.customer_email || '').toLowerCase().trim();
    const isAdmin = email === 'littlecodr@gmail.com';

    // 100 paise = ₹1.00 for admin test
    const finalAmount = isAdmin ? 100 : Math.round(Number(amount));

    if (!finalAmount || finalAmount < 100) {
      return NextResponse.json(
        { error: 'Amount is required and must be at least 100 paise' },
        { status: 400 }
      );
    }

    const key_id = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string) || 'rzp_live_TX8xr1CVxZnqPs';
    const key_secret = (process.env.RAZORPAY_KEY_SECRET as string) || 'JC4fbxH7njMTfzctnXrFVyPs';

    const auth = Buffer.from(`${key_id}:${key_secret}`).toString('base64');

    // Create Razorpay order via direct API
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: finalAmount,
        currency: 'INR',
        receipt: (orderId || `rcpt_${Date.now()}`).toString().slice(0, 40),
        notes: {
          merchant: 'namonarayanaghee',
          origin_order_id: orderId,
          customer_email: email,
          customer_phone: customerInfo?.phone || '',
          customer_name: customerInfo?.name || '',
          is_admin_test: isAdmin ? 'true' : 'false',
          ...notes,
        },
      }),
    });

    const data = await rzpRes.json();

    if (!rzpRes.ok || !data.id) {
      console.error('Direct Razorpay order error:', data);
      // Fallback: try via potter-world.com/api/create-order
      try {
        const fallbackRes = await fetch('https://potter-world.com/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalAmount,
            currency: 'INR',
            receipt: (orderId || `rcpt_${Date.now()}`).toString().slice(0, 40),
            notes: {
              merchant: 'namonarayanaghee',
              origin_order_id: orderId,
              customer_email: email,
              ...notes,
            },
          }),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok && (fallbackData.order_id || fallbackData.id)) {
          return NextResponse.json({
            success: true,
            order_id: fallbackData.order_id || fallbackData.id,
            amount: fallbackData.amount,
            currency: fallbackData.currency || 'INR',
            key_id,
          });
        }
      } catch (fbErr) {
        console.error('Fallback create-order error:', fbErr);
      }

      throw new Error(data.error?.description || data.error?.message || 'Failed to create payment session');
    }

    return NextResponse.json({
      success: true,
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      key_id,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
