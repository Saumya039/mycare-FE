import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"

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
 * Get the current user session from the native JWT cookie
 * Returns null if no valid session found
 */
export async function getServerSession(): Promise<Session> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("__session")?.value
    
    if (!token) {
      return null
    }

    // Verify session securely using jose
    const payload = await verifyToken<any>(token)
    
    if (!payload || !payload.sub) {
      return null
    }

    // Look up user in database to get their true role (optional but secure)
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.sub }
    })

    if (!dbUser) {
      return null
    }

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        name: dbUser.name,
        department: dbUser.department || undefined,
      },
    }
  } catch (error) {
    return null
  }
}
