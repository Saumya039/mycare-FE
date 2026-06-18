import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Look up the user in the database
    const email = user.email
    if (!email) {
      return NextResponse.json({ error: "No email in token" }, { status: 400 })
    }

    let dbUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true
      }
    })

    // If user is not found in Postgres but is logged in via Supabase
    // we should create a record for them so the app works seamlessly
    if (!dbUser) {
      // Check if this is the very first user in the entire database
      const userCount = await prisma.user.count()
      const isFirstUser = userCount === 0

      dbUser = await prisma.user.create({
        data: {
          email: email,
          name: user.user_metadata?.name || email.split("@")[0],
          password: "supabase-managed", // password handled by Supabase
          role: isFirstUser ? "SUPER_ADMIN" : "USER", // Only first user gets admin
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
        id: user.id, // Supabase UID
        email: dbUser.email,
        role: dbUser.role,
        name: dbUser.name,
        department: dbUser.department,
        dbId: dbUser.id
      }
    })
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}
