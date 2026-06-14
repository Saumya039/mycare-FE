import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getMessaging, isSupported } from "firebase/messaging"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase only if config exists to prevent crashing during build or if unconfigured
let app;
try {
  if (!getApps().length && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig)
  } else if (getApps().length > 0) {
    app = getApp()
  } else {
    app = null
  }
} catch (e) {
  console.warn("Failed to initialize Firebase Client app:", e)
  app = null
}

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null

// Messaging is only supported in browser contexts
export const messaging = async () => {
  if (app && typeof window !== "undefined" && await isSupported()) {
    return getMessaging(app)
  }
  return null
}
