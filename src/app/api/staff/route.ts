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
        contactInfo: true,
        homeAddress: true
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

import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden. Only Admins can add staff." }, { status: 403 })
    }

    const { name, email, password, role, department, contactInfo, homeAddress } = await req.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        department,
        contactInfo,
        homeAddress
      }
    })

    return NextResponse.json(newStaff, { status: 201 })
  } catch (error) {
    console.error("Error adding staff:", error)
    return NextResponse.json({ error: "Failed to add staff" }, { status: 500 })
  }
}
