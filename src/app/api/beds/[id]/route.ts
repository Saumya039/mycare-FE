import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "NURSE" && session.user.role !== "DOCTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { action, patientId } = body

    if (action === "assign") {
      // Find patient
      const patient = await prisma.patient.findUnique({ where: { patientId } })
      if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

      // First, remove patient from any existing bed
      await prisma.bed.updateMany({
        where: { patient: { id: patient.id } },
        data: { status: "available" }
      })

      // Now assign to new bed
      const updatedBed = await prisma.bed.update({
        where: { id },
        data: { status: "occupied" }
      })

      await prisma.patient.update({
        where: { id: patient.id },
        data: { bedId: id }
      })

      return NextResponse.json(updatedBed)
    } 
    else if (action === "release") {
      const updatedBed = await prisma.bed.update({
        where: { id },
        data: { status: "available" }
      })

      // Also disconnect patient
      const patient = await prisma.patient.findFirst({ where: { bedId: id } })
      if (patient) {
        await prisma.patient.update({
          where: { id: patient.id },
          data: { bedId: null }
        })
      }

      return NextResponse.json(updatedBed)
    }
    else if (action === "maintenance") {
      const updatedBed = await prisma.bed.update({
        where: { id },
        data: { status: "maintenance" }
      })
      return NextResponse.json(updatedBed)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating bed:", error)
    return NextResponse.json({ error: "Failed to update bed" }, { status: 500 })
  }
}
