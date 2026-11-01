import { NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";
import { resolveClientGeo } from "@/lib/server-geo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, orderData = {}, event = "success", message } = body;

    // Resolve client IP, Geo location, and device details
    const geoInfo = await resolveClientGeo(req);

    // Enrich orderData with server-verified network and geo data
    const enrichedOrderData = {
      ...orderData,
      geo: geoInfo,
      clientIp: geoInfo.ip,
      city: geoInfo.city,
      region: geoInfo.region,
      country: geoInfo.country,
      countryCode: geoInfo.countryCode,
      zip: geoInfo.zip,
      isp: geoInfo.isp,
      deviceSummary: geoInfo.deviceSummary,
    };

    await sendTelegramNotification(orderId, enrichedOrderData, event, message);

    return NextResponse.json({ success: true, ip: geoInfo.ip });
  } catch (error: any) {
    console.error("Failed to send telegram notification:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
