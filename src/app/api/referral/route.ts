import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"

import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const userRole = session.user.role as string

    // Super Admin/Admin see all referrals. Doctors see their own.
    let referrals = []
    if (["SUPER_ADMIN", "ADMIN", "RECEPTIONIST"].includes(userRole)) {
      referrals = await prisma.referral.findMany({
        include: { 
          patient: { select: { name: true, patientId: true } },
          doctor: { select: { name: true, role: true } }
        },
        orderBy: { date: "desc" }
      })
    } else {
      referrals = await prisma.referral.findMany({
        where: { doctor: { email: session.user.email as string } },
        include: { 
          patient: { select: { name: true, patientId: true } },
          doctor: { select: { name: true, role: true } }
        },
        orderBy: { date: "desc" }
      })
    }
    
    const patients = await prisma.patient.findMany({
      select: { id: true, name: true, patientId: true }
    })

    return NextResponse.json({ referrals, patients })
  } catch (error) {
    console.error("Referral GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { patientId, referredTo, reason } = await req.json()
    const user = await prisma.user.findUnique({ where: { email: session.user.email as string } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const referral = await prisma.referral.create({
      data: { patientId, referredBy: user.id, referredTo, reason }
    })
    return NextResponse.json({ referral })
  } catch (error) {
    console.error("Referral POST Error:", error)
    return NextResponse.json({ error: "Failed to create referral" }, { status: 500 })
  }
}
