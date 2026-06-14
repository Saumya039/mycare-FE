import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params

    const patient = await prisma.patient.findUnique({
      where: { patientId: id },
      include: {
        appointments: { include: { doctor: { select: { name: true } } } },
        prescriptions: { include: { doctor: { select: { name: true } } } }
      }
    })

    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

    return NextResponse.json(patient)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch EHR" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "DOCTOR" && session.user.role !== "NURSE")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { dischargeEta } = body

    const updatedPatient = await prisma.patient.update({
      where: { patientId: id },
      data: {
        dischargeEta: dischargeEta ? new Date(dischargeEta) : null
      }
    })

    return NextResponse.json(updatedPatient)
  } catch (error) {
    console.error("Error updating patient:", error)
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 })
  }
}
