import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"


export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const appointments = await prisma.appointment.findMany({
      include: {
        patient: { select: { name: true, patientId: true } },
        doctor: { select: { name: true } }
      },
      orderBy: { date: "asc" }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "NURSE")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { patientId, doctorId, date, reason, isFollowUp } = body

    // Find the real DB ID of the patient
    const patient = await prisma.patient.findUnique({ where: { patientId } })
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctorId,
        date: new Date(date),
        reason: reason,
        isFollowUp: isFollowUp || false,
        status: "scheduled"
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}
