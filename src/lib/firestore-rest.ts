import { importPKCS8, SignJWT } from "jose";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "namonarayanaghee";

// Generates an OAuth2 token for Firestore REST API using the Service Account JSON
export async function getFirestoreAccessToken(): Promise<string> {
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

export function jsonToFirestore(obj: any): any {
  if (obj === null) return { nullValue: null };
  if (typeof obj === "string") return { stringValue: obj };
  if (typeof obj === "boolean") return { booleanValue: obj };
  if (typeof obj === "number") {
    if (Number.isInteger(obj)) return { integerValue: obj.toString() };
    return { doubleValue: obj };
  }
  if (Array.isArray(obj)) {
    return { arrayValue: { values: obj.map(jsonToFirestore) } };
  }
  if (obj instanceof Date) {
    return { timestampValue: obj.toISOString() };
  }
  if (typeof obj === "object") {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) {
        fields[k] = jsonToFirestore(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(obj) };
}

export function firestoreToJson(obj: any): any {
  if (!obj) return null;
  if ("nullValue" in obj) return null;
  if ("stringValue" in obj) return obj.stringValue;
  if ("booleanValue" in obj) return obj.booleanValue;
  if ("integerValue" in obj) return parseInt(obj.integerValue, 10);
  if ("doubleValue" in obj) return obj.doubleValue;
  if ("timestampValue" in obj) return obj.timestampValue;
  if ("arrayValue" in obj) {
    return (obj.arrayValue.values || []).map(firestoreToJson);
  }
  if ("mapValue" in obj) {
    const res: Record<string, any> = {};
    const fields = obj.mapValue.fields || {};
    for (const [k, v] of Object.entries(fields)) {
      res[k] = firestoreToJson(v);
    }
    return res;
  }
  // Root document format
  if (obj.fields) {
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj.fields)) {
      res[k] = firestoreToJson(v);
    }
    return res;
  }
  return null;
}

export async function firestoreSetDoc(collection: string, docId: string, data: any, merge = false) {
  const token = await getFirestoreAccessToken();
  const documentPath = `projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;
  
  const payload = {
    name: documentPath,
    fields: jsonToFirestore(data).mapValue.fields
  };

  let url = `https://firestore.googleapis.com/v1/${documentPath}`;
  if (merge) {
    const updateMask = Object.keys(data).map(field => `updateMask.fieldPaths=${field}`).join("&");
    url += `?${updateMask}`;
  }

  const res = await fetch(url, {
    method: "PATCH", // Firestore uses PATCH for both create and update when specifying document ID in URL with updateMask
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firestore REST setDoc error: ${err}`);
  }
  return res.json();
}

export async function firestoreUpdateDoc(collection: string, docId: string, data: any) {
  return firestoreSetDoc(collection, docId, data, true);
}

export async function firestoreGetDoc(collection: string, docId: string) {
  const token = await getFirestoreAccessToken();
  const documentPath = `projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;
  
  const res = await fetch(`https://firestore.googleapis.com/v1/${documentPath}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (res.status === 404) return null;
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firestore REST getDoc error: ${err}`);
  }
  const raw = await res.json();
  return firestoreToJson(raw);
}

export async function firestoreDeleteDoc(collection: string, docId: string) {
  const token = await getFirestoreAccessToken();
  const documentPath = `projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;
  
  const res = await fetch(`https://firestore.googleapis.com/v1/${documentPath}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firestore REST deleteDoc error: ${err}`);
  }
}
