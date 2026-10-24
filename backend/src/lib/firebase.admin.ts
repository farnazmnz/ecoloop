import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

type ServiceAccount = { project_id: string; client_email: string; private_key: string };

function loadServiceAccount(): ServiceAccount {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 is not set — see backend/.env.example");
  }
  return JSON.parse(Buffer.from(b64, "base64").toString("utf8")) as ServiceAccount;
}

/** Lazily initialised Admin app so importing this module never throws at startup. */
export function adminApp(): App {
  if (getApps().length) return getApp();
  const sa = loadServiceAccount();
  return initializeApp({
    credential: cert({
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      privateKey: sa.private_key,
    }),
    // TODO: confirm the bucket name in Firebase console → Storage. Newer projects use
    // <project-id>.firebasestorage.app; older ones use <project-id>.appspot.com.
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${sa.project_id}.firebasestorage.app`,
  });
}

export const adminAuth = () => getAuth(adminApp());
export const db = () => getFirestore(adminApp());
export const bucket = () => getStorage(adminApp()).bucket();

/** Public URL format used for every uploaded photo (docs/SPEC.md §7). */
export function publicUrl(path: string): string {
  return `https://storage.googleapis.com/${bucket().name}/${path}`;
}
