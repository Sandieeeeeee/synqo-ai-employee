import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseAdminApp() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("FIREBASE_ADMIN_NOT_CONFIGURED");
  }
  const existingApp = getApps()[0];
  if (existingApp) return existingApp;
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey: privateKey.replace(/\\n/g, "\n") }) });
}

export function getAdminAuth() { return getAuth(getFirebaseAdminApp()); }
export function getAdminDb() { return getFirestore(getFirebaseAdminApp()); }

export const adminAuth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(_target, property) { const auth = getAdminAuth(); const value = Reflect.get(auth, property); return typeof value === "function" ? value.bind(auth) : value; },
});
export const adminDb = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(_target, property) { const db = getAdminDb(); const value = Reflect.get(db, property); return typeof value === "function" ? value.bind(db) : value; },
});
