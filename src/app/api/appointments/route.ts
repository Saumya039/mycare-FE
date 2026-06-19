import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"
import { z } from "zod"
import { requirePermission, Permission } from "@/lib/rbac"
import { handleApiError, AuthenticationError } from "@/lib/error-handler"

const AppointmentCreateSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  date: z.string().min(1),
  reason: z.string().min(1),
  isFollowUp: z.boolean().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.VIEW_APPOINTMENTS)

    const appointments = await prisma.appointment.findMany({
      include: {
        patient: { select: { name: true, patientId: true } },
        doctor: { select: { name: true } }
      },
      orderBy: { date: "asc" }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.CREATE_APPOINTMENT)

    const body = await req.json()
    const parsed = AppointmentCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.errors }, { status: 422 })
    }

    const { patientId, doctorId, date, reason, isFollowUp } = parsed.data

    const patient = await prisma.patient.findUnique({ where: { patientId } })
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        date: new Date(date),
        reason,
        isFollowUp: isFollowUp || false,
        status: "scheduled"
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
