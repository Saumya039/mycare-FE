import { NextResponse } from "next/server"
import { createSessionCookie, revokeSessionCookie } from "@/lib/auth-server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json({ error: "No ID token provided" }, { status: 400 })
    }

    // Create session cookie from ID token
    // Expires in 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    const sessionCookie = await createSessionCookie(idToken, expiresIn)

    // Set the cookie
    const cookieStore = await cookies()
    cookieStore.set("__session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax"
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 401 })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("__session")?.value

    if (sessionCookie) {
      await revokeSessionCookie(sessionCookie)
    }

    cookieStore.delete("__session")
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Session revocation error:", error)
    return NextResponse.json({ error: "Failed to revoke session" }, { status: 500 })
  }
}
