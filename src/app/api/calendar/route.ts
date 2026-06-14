import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"

import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const userRole = session.user.role as string
    
    // Fetch appointments
    let appointments: any[] = []
    if (["SUPER_ADMIN", "ADMIN", "RECEPTIONIST"].includes(userRole)) {
      appointments = await prisma.appointment.findMany({
        include: { patient: { select: { name: true } }, doctor: { select: { name: true } } },
        orderBy: { date: "asc" }
      })
    } else if (userRole === "DOCTOR") {
      appointments = await prisma.appointment.findMany({
        where: { doctor: { email: session.user.email as string } },
        include: { patient: { select: { name: true } }, doctor: { select: { name: true } } },
        orderBy: { date: "asc" }
      })
    }

    // Fetch roster shifts
    let rosters: any[] = []
    if (["SUPER_ADMIN", "ADMIN", "HR"].includes(userRole)) {
      rosters = await prisma.dutyRoster.findMany({
        include: { user: { select: { name: true, role: true } } },
        orderBy: { date: "asc" }
      })
    } else {
      rosters = await prisma.dutyRoster.findMany({
        where: { user: { email: session.user.email as string } },
        include: { user: { select: { name: true, role: true } } },
        orderBy: { date: "asc" }
      })
    }

    return NextResponse.json({ appointments, rosters })
  } catch (error) {
    console.error("Calendar API Error:", error)
    return NextResponse.json({ error: "Failed to fetch calendar data" }, { status: 500 })
  }
}
