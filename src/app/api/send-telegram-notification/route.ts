import { NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const { orderId, orderData, event = "success", message } = await req.json();

    await sendTelegramNotification(orderId, orderData, event, message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to send telegram notification:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
