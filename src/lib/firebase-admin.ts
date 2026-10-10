import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function getAdminDb() {
  if (!getApps().length) {
    try {
      const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      if (serviceAccountStr) {
        const serviceAccount = JSON.parse(serviceAccountStr);
        initializeApp({
          credential: cert(serviceAccount)
        });
      }
    } catch (error) {
      console.error('Firebase admin initialization error', error);
    }
  }

  return getFirestore();
}
