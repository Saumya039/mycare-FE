import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"
import { z } from "zod"
import { getAdminClient } from "@/lib/supabase/admin"

const ALL_STAFF_ROLES = ["ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACIST", "PATHOLOGIST", "RADIOLOGIST", "ACCOUNTANT"]

const StaffCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACIST", "PATHOLOGIST", "RADIOLOGIST", "ACCOUNTANT", "USER"]),
  department: z.string().optional(),
  contactInfo: z.string().optional(),
  homeAddress: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const staff = await prisma.user.findMany({
      where: {
        role: { in: ALL_STAFF_ROLES }
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden. Only Admins can add staff." }, { status: 403 })
    }

    const body = await req.json()
    const parsed = StaffCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 422 }
      )
    }

    const { name, email, password, role, department, contactInfo, homeAddress } = parsed.data

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Create Supabase Auth user
    let supabaseUserId: string
    try {
      const adminClient = getAdminClient()
      const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role, department },
      })

      if (authError || !authUser.user) {
        console.error("Supabase auth user creation failed:", authError)
        return NextResponse.json(
          { error: "Failed to create authentication account. Check Supabase service role configuration." },
          { status: 500 }
        )
      }

      supabaseUserId = authUser.user.id
    } catch (authErr) {
      console.error("Supabase admin client error:", authErr)
      return NextResponse.json(
        { error: "Auth service unavailable. Ensure SUPABASE_SERVICE_ROLE_KEY is configured." },
        { status: 500 }
      )
    }

    const newStaff = await prisma.user.create({
      data: {
        id: supabaseUserId,
        name,
        email,
        password: "supabase-managed",
        role,
        department,
        contactInfo,
        homeAddress
      }
    })

    const { password: _, ...safeStaff } = newStaff
    return NextResponse.json(safeStaff, { status: 201 })
  } catch (error) {
    console.error("Error adding staff:", error)
    return NextResponse.json({ error: "Failed to add staff" }, { status: 500 })
  }
}
