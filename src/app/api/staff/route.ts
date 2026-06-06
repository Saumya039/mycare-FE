import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Only fetch staff members
    const staff = await prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "DOCTOR", "NURSE"] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        shiftStart: true,
        shiftEnd: true,
        contactInfo: true
      },
      orderBy: {
        department: "asc"
      }
    })

    return NextResponse.json(staff)
  } catch (error) {
    console.error("Error fetching staff:", error)
    return NextResponse.json({ error: "Failed to fetch staff directory" }, { status: 500 })
  }
}
