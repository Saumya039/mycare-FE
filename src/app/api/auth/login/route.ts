import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/jwt"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if this is the absolute first user ever logging in
    const userCount = await prisma.user.count()
    
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!user) {
      if (userCount === 0) {
        // Bootstrap the first user automatically as a SUPER_ADMIN
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await prisma.user.create({
          data: {
            email: email.toLowerCase().trim(),
            name: email.split("@")[0],
            password: hashedPassword,
            role: "SUPER_ADMIN"
          }
        })
      } else {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
    } else {
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
    }

    // Generate JWT token
    const token = await signToken(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        department: user.department || undefined
      },
      { exp: "7d" } // Token expires in 7 days
    )

    // Set HTTP-Only Cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: "__session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department
      }
    })

  } catch (error) {
    console.error("Login Error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
