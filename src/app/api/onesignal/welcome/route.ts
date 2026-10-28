import { NextResponse } from "next/server";

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "c467b8e5-6a21-4134-b8f6-9da89a7a9e06";
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY || "";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { subscriptionId, onesignalId } = body;

    const payload: Record<string, any> = {
      app_id: ONESIGNAL_APP_ID,
      headings: {
        en: "🎉 Namo Narayana: FLAT 10% OFF Unlocked!",
      },
      contents: {
        en: "Your secret code is DIWALI. Tap to apply 10% discount on Pure Vedic A2 Gir Cow Ghee!",
      },
      url: "https://www.namonarayanaghee.store/collections/all-products?coupon=DIWALI",
      web_url: "https://www.namonarayanaghee.store/collections/all-products?coupon=DIWALI",
      chrome_web_icon: "https://www.namonarayanaghee.store/assets/logo.png",
      chrome_web_badge: "https://www.namonarayanaghee.store/assets/logo.png",
      web_buttons: [
        {
          id: "claim-code",
          text: "Claim 10% OFF Now",
          icon: "https://www.namonarayanaghee.store/assets/logo.png",
          url: "https://www.namonarayanaghee.store/collections/all-products?coupon=DIWALI",
        },
      ],
    };

    if (subscriptionId) {
      payload.include_subscription_ids = [subscriptionId];
    } else if (onesignalId) {
      payload.include_aliases = { onesignal_id: [onesignalId] };
    } else {
      payload.included_segments = ["Subscribed Users"];
    }

    const res = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json({ success: true, onesignal: data });
  } catch (error: any) {
    console.error("OneSignal notification error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const payload = {
      app_id: ONESIGNAL_APP_ID,
      included_segments: ["Subscribed Users"],
      headings: {
        en: "🎉 Namo Narayana: FLAT 10% OFF Unlocked!",
      },
      contents: {
        en: "Your secret code is DIWALI. Tap to apply 10% discount on Pure Vedic A2 Gir Cow Ghee!",
      },
      url: "https://www.namonarayanaghee.store/collections/all-products?coupon=DIWALI",
      web_url: "https://www.namonarayanaghee.store/collections/all-products?coupon=DIWALI",
      chrome_web_icon: "https://www.namonarayanaghee.store/assets/logo.png",
      chrome_web_badge: "https://www.namonarayanaghee.store/assets/logo.png",
    };

    const res = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json({ success: true, onesignal: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
