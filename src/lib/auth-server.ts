import { createClient } from "./supabase/server"
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
 * Get the current user session from Supabase
 * Returns null if no valid session found
 */
export async function getServerSession(): Promise<Session> {
  try {
    const supabase = await createClient()
    
    // Get session securely from Supabase
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Look up user in database to get their true role
    const email = user.email || ""
    const dbUser = await prisma.user.findUnique({
      where: { email }
    })

    const role = dbUser ? dbUser.role : "USER"
    const name = dbUser ? dbUser.name : (user.user_metadata?.name || email.split("@")[0])
    const department = dbUser ? (dbUser.department || undefined) : undefined

    return {
      user: {
        id: user.id,
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
