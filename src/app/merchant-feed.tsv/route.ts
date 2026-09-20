import { NextResponse } from "next/server";
import { generateMerchantFeedTsv } from "@/lib/merchant-feed";

export async function GET() {
  const tsvData = generateMerchantFeedTsv();

  return new NextResponse(tsvData, {
    status: 200,
    headers: {
      "Content-Type": "text/tab-separated-values",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}
