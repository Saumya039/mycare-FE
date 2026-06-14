import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        // Replace literal \n with actual newlines for the private key
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n") || "mock_key",
      }),
    })
  } catch (error) {
    console.error("Firebase admin initialization error", error)
  }
}

let authObj, dbObj;
try {
  authObj = getAuth()
  dbObj = getFirestore()
} catch (e) {
  console.warn("Failed to initialize Firebase Admin SDK objects. Mocking to prevent build crashes.")
  authObj = {} as any
  dbObj = {} as any
}

export const adminAuth = authObj
export const adminDb = dbObj
