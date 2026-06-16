import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("__session")?.value

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the session cookie with Firebase Admin SDK
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
    
    // Look up the user in the database
    const email = decodedClaims.email
    if (!email) {
      return NextResponse.json({ error: "No email in token" }, { status: 400 })
    }

    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true
      }
    })

    // If user is not found in Postgres but is logged in via Firebase (e.g. newly created admin)
    // we should create a record for them so the app works seamlessly
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email,
          name: decodedClaims.name || email.split("@")[0],
          password: "firebase-managed", // password handled by Firebase
          role: "SUPER_ADMIN", // First time users auto-granted admin if they don't exist
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          department: true
        }
      })
    }

    return NextResponse.json({
      user: {
        id: decodedClaims.uid, // Keep Firebase UID for consistency
        email: user.email,
        role: user.role,
        name: user.name,
        department: user.department,
        dbId: user.id
      }
    })
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}
