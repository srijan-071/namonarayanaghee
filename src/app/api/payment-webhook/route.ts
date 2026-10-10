import { NextResponse } from "next/server";
import { importPKCS8, SignJWT } from "jose";


const PAYMENT_HUB_SECRET = process.env.PAYMENT_HUB_SECRET || "INTERNAL_HUB_SECRET_2026";
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "namonarayanaghee";

// Generates an OAuth2 token for Firestore REST API using the Service Account JSON
async function getFirestoreAccessToken(): Promise<string> {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY or invalid format");
  }

  const privateKey = await importPKCS8(serviceAccount.private_key, "RS256");

  const jwt = await new SignJWT({
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token"
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(privateKey);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to authenticate with Google OAuth2");
  }

  const data = await res.json();
  return data.access_token;
}

// Update the Firestore document using the REST API
async function updateOrderPaid(orderId: string, sessionId: string, amount: number, currency: string, metadata: any) {
  const token = await getFirestoreAccessToken();
  const documentPath = `projects/${PROJECT_ID}/databases/(default)/documents/orders/${orderId}`;

  // We construct the update payload (updateMask ensures we only update these fields)
  // Firestore REST requires values in strongly typed format (e.g. stringValue, integerValue)
  const payload = {
    fields: {
      paymentStatus: { stringValue: "paid" },
      paymentSessionId: { stringValue: sessionId },
      paymentDetails: {
        mapValue: {
          fields: {
            sessionId: { stringValue: sessionId },
            amount: { doubleValue: amount },
            currency: { stringValue: currency },
            paidAt: { stringValue: new Date().toISOString() },
            metadata: { stringValue: JSON.stringify(metadata) } // Storing as string to avoid complex deep mapping
          }
        }
      },
      updatedAt: { stringValue: new Date().toISOString() }
    }
  };

  const updateMask = [
    "paymentStatus", 
    "paymentSessionId", 
    "paymentDetails", 
    "updatedAt"
  ].map(field => `updateMask.fieldPaths=${field}`).join("&");

  const res = await fetch(`https://firestore.googleapis.com/v1/${documentPath}?${updateMask}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Firestore REST update error:", errorText);
    throw new Error("Failed to update Firestore document");
  }

  // Clear abandoned cart
  if (metadata?.email) {
    const deleteCartPath = `projects/${PROJECT_ID}/databases/(default)/documents/abandoned_carts/${metadata.email}`;
    await fetch(`https://firestore.googleapis.com/v1/${deleteCartPath}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    }).catch(e => console.error("Failed to delete abandoned cart on webhook", e));
  }
}

export async function POST(req: Request) {
  try {
    // Verify authorization
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${PAYMENT_HUB_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, orderId, status, amount, currency, metadata } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (status === "SUCCESS") {
      await updateOrderPaid(orderId, sessionId, amount, currency, metadata);
      console.log(`Order ${orderId} payment confirmed via webhook (Edge REST)`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payment webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
