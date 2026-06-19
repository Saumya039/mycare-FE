import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"
import { requirePermission, Permission } from "@/lib/rbac"
import { handleApiError } from "@/lib/error-handler"

export async function GET() {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.VIEW_IPD)

    const patients = await prisma.patient.findMany({
      where: { departmentName: "IPD" },
      orderBy: { createdAt: "desc" },
      include: { bed: true }
    })

    const beds = await prisma.bed.findMany({
      where: { status: "available" }
    })

    return NextResponse.json({ patients, beds })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.VIEW_IPD)

    const { name, age, gender, diagnosis, doctorName, bedId } = await req.json()

    const patient = await prisma.patient.create({
      data: {
        patientId: `IPD-${Math.floor(Math.random() * 10000)}`,
        name,
        age: parseInt(age),
        gender,
        diagnosis,
        departmentName: "IPD",
        doctorName,
        status: "admitted",
        bedId: bedId || null
      }
    })

    if (bedId) {
      await prisma.bed.update({
        where: { id: bedId },
        data: { status: "occupied" }
      })
    }

    return NextResponse.json({ patient }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
