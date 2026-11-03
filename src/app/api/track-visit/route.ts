import { NextResponse } from "next/server";
import { sendVisitNotification } from "@/lib/telegram";
import { resolveClientGeo } from "@/lib/server-geo";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const geoInfo = await resolveClientGeo(req);

    const enrichedVisitData = {
      ...body,
      geo: geoInfo,
      clientIp: geoInfo.ip,
      city: geoInfo.city,
      region: geoInfo.region,
      country: geoInfo.country,
      zip: geoInfo.zip,
      isp: geoInfo.isp,
      deviceSummary: geoInfo.deviceSummary,
    };

    await sendVisitNotification(enrichedVisitData);

    return NextResponse.json({ success: true, ip: geoInfo.ip });
  } catch (error: any) {
    console.error("Failed to track visit and send notification:", error);
    return NextResponse.json({ error: error.message || "Failed to process visit" }, { status: 500 });
  }
}
