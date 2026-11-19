import { NextResponse } from "next/server";
import crypto from "crypto";

// Hardcoded verified PayU credentials to guarantee consistent hash generation across environments
const PAYU_KEY = "BfDKZe";
const PAYU_SALT = "iQ7BOSg394ZQQKY2Mu5evsBnwobF4shg";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const txnid = (body.txnid || body.orderId || `ORD-${Date.now()}`).toString().trim();
    const rawAmount = body.amount;
    const firstname = (body.firstname || body.name || "Customer").toString().replace(/[^a-zA-Z ]/g, "").trim() || "Customer";
    const email = (body.email || "customer@namonarayanaghee.store").toString().trim();
    const phone = (body.phone || "").toString().replace(/\D/g, "").slice(-10) || "9999999999";
    const rawProductInfo = (body.productinfo || body.cartSummary || "Order Payment").toString();
    const productinfo = rawProductInfo.replace(/[^a-zA-Z0-9 ]/g, "").trim().slice(0, 100) || "Order Payment";

    const udf1 = (body.udf1 || "namonarayanaghee").toString().replace(/[^a-zA-Z0-9_-]/g, "").trim();
    const udf2 = "";
    const udf3 = "";
    const udf4 = "";
    const udf5 = "";

    const key = PAYU_KEY;
    const salt = PAYU_SALT;

    if (!txnid || rawAmount === undefined || rawAmount === null || rawAmount === "") {
      return NextResponse.json({ error: "Missing required parameters: txnid or amount" }, { status: 400 });
    }

    const numAmount = Number(rawAmount);
    const amountStr = !isNaN(numAmount) ? numAmount.toFixed(2) : String(rawAmount);

    // Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
    const hashString = `${key}|${txnid}|${amountStr}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    // Dynamically resolve caller origin for surl/furl
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "namonarayanaghee.store";
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const origin = `${proto}://${host}`;

    const surl = `${origin}/api/payu/callback`;
    const furl = `${origin}/api/payu/callback`;
    const action = "https://secure.payu.in/_payment";

    return NextResponse.json({
      action,
      key,
      txnid,
      amount: amountStr,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      service_provider: "payu_paisa",
    });
  } catch (error: any) {
    console.error("PayU hash error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
