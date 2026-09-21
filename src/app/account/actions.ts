"use server";

import { importPKCS8, SignJWT } from "jose";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "namonarayanaghee";

async function getFirestoreAccessToken(): Promise<string> {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
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
  if (!res.ok) throw new Error("Failed to authenticate with Google OAuth2");
  const data = await res.json();
  return data.access_token;
}

export async function fetchAllOrdersAdmin() {
  try {
    const token = await getFirestoreAccessToken();
    const queryPayload = {
      structuredQuery: {
        from: [{ collectionId: "orders" }],
        orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }],
        limit: { value: 100 }
      }
    };
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(queryPayload)
    });
    
    if (!res.ok) {
      console.error("Firestore REST runQuery error:", await res.text());
      return [];
    }

    const data = await res.json();
    const orders = data
      .filter((d: any) => d.document)
      .map((d: any) => {
        const doc = d.document;
        // Parse fields
        const id = doc.name.split("/").pop();
        
        // This is a rough parser for Firestore REST structure
        const parseValue = (val: any): any => {
          if (!val) return null;
          if (val.stringValue !== undefined) return val.stringValue;
          if (val.integerValue !== undefined) return parseInt(val.integerValue);
          if (val.doubleValue !== undefined) return val.doubleValue;
          if (val.booleanValue !== undefined) return val.booleanValue;
          if (val.timestampValue !== undefined) return { seconds: Math.floor(new Date(val.timestampValue).getTime() / 1000) };
          if (val.arrayValue !== undefined) return (val.arrayValue.values || []).map(parseValue);
          if (val.mapValue !== undefined) {
            const obj: any = {};
            for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
              obj[k] = parseValue(v);
            }
            return obj;
          }
          return null;
        };

        const parsedFields: any = {};
        for (const [k, v] of Object.entries(doc.fields || {})) {
          parsedFields[k] = parseValue(v);
        }
        return { id, ...parsedFields };
      });
      
    return orders;
  } catch (err) {
    console.error("fetchAllOrdersAdmin error:", err);
    return [];
  }
}
