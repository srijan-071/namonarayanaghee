import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  // In production, use GOOGLE_APPLICATION_CREDENTIALS or a service account key.
  // For development, we initialize without credentials which works when
  // the FIREBASE_CONFIG or GCLOUD_PROJECT env vars are set,
  // or we use the project ID directly.
  const projectId = process.env.FIREBASE_PROJECT_ID || "namonarayanaghee";

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    return initializeApp({
      credential: cert(serviceAccount),
      projectId,
    });
  }

  // Fallback: initialize with just projectId (works in Google Cloud environments)
  return initializeApp({ projectId });
}

const adminApp = getAdminApp();
export const adminDb = getFirestore(adminApp);
