import { NextResponse } from "next/server";
import { generateMerchantFeedTsv } from "@/lib/merchant-feed";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const tsvData = generateMerchantFeedTsv();

  return new NextResponse(tsvData, {
    status: 200,
    headers: {
      "Content-Type": "text/tab-separated-values; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
