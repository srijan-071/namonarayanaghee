import { NextResponse } from "next/server";
import { generateMerchantFeedXml } from "@/lib/merchant-feed";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const xmlData = generateMerchantFeedXml();

  return new NextResponse(xmlData, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
