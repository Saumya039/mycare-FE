import { adminAuth } from "./firebase-admin"
import { cookies } from "next/headers"

export type SessionUser = {
  id: string
  email: string
  role: string
  name: string
  department?: string
}

export type Session = {
  user: SessionUser
} | null

/**
 * Get the current user session from Firebase session cookie
 * Returns null if no valid session found
 */
export async function getServerSession(): Promise<Session> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("__session")?.value

    if (!sessionCookie) {
      return null
    }

    // Verify the session cookie with Firebase Admin SDK
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)

    // Extract user info from claims
    const uid = decodedClaims.uid
    const email = decodedClaims.email || ""
    const role = (decodedClaims.role as string) || "USER"
    const name = decodedClaims.name || email.split("@")[0]
    const department = (decodedClaims.department as string) || undefined

    return {
      user: {
        id: uid,
        email,
        role,
        name,
        department,
      },
    }
  } catch (error) {
    return null
  }
}

/**
 * Create a session cookie for a user (called after Firebase sign-in)
 * This should be called from a server action or API route
 */
export async function createSessionCookie(idToken: string, expiresIn: number = 60 * 60 * 24 * 5) {
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
    return sessionCookie
  } catch (error) {
    console.error("Failed to create session cookie:", error)
    throw error
  }
}

/**
 * Revoke a session cookie (called on logout)
 */
export async function revokeSessionCookie(sessionCookie: string) {
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
    await adminAuth.revokeRefreshTokens(decodedClaims.uid)
  } catch (error) {
    console.error("Failed to revoke session:", error)
  }
}

/**
 * Set Firebase Custom Claims for a user (admin only)
 * Call this after user registration to set role
 */
export async function setUserClaims(uid: string, claims: { role: string; department?: string; name: string }) {
  try {
    await adminAuth.setCustomUserClaims(uid, claims)
  } catch (error) {
    console.error("Failed to set user claims:", error)
    throw error
  }
}

/**
 * Get a user from Firebase Auth
 */
export async function getUserFromAuth(uid: string) {
  try {
    const user = await adminAuth.getUser(uid)
    return user
  } catch (error) {
    console.error("Failed to get user:", error)
    return null
  }
}
