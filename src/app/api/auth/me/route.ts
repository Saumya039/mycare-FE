import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("__session")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Verify our custom JWT
    const payload = await verifyToken<any>(token)

    // Optional: Fetch latest data from database to ensure role is completely up-to-date
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true
      }
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User no longer exists" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        name: dbUser.name,
        department: dbUser.department,
      }
    })
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}
