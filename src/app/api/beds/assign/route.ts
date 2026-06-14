import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "NURSE")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { bedId, patientId, action } = body

    if (action === "assign") {
      // Find patient
      const patient = await prisma.patient.findUnique({ where: { patientId } })
      if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

      // Assign bed to patient, set bed to occupied
      await prisma.$transaction([
        prisma.patient.update({
          where: { id: patient.id },
          data: { bedId }
        }),
        prisma.bed.update({
          where: { id: bedId },
          data: { status: "occupied" }
        })
      ])
      
      return NextResponse.json({ success: true })
    } else if (action === "release") {
      await prisma.$transaction([
        prisma.patient.updateMany({
          where: { bedId },
          data: { bedId: null }
        }),
        prisma.bed.update({
          where: { id: bedId },
          data: { status: "available" }
        })
      ])

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating bed:", error)
    return NextResponse.json({ error: "Failed to update bed" }, { status: 500 })
  }
}
