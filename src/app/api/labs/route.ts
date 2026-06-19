import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"
import { z } from "zod"
import { requirePermission, Permission } from "@/lib/rbac"
import { handleApiError } from "@/lib/error-handler"

const LabTestCreateSchema = z.object({
  patientId: z.string().min(1),
  testName: z.string().min(1),
})

export async function GET() {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.VIEW_LABS)

    const labs = await prisma.labTest.findMany({
      include: {
        patient: { select: { name: true, patientId: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(labs)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.CREATE_LAB_TEST)

    const body = await req.json()
    const parsed = LabTestCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.errors }, { status: 422 })
    }

    let { patientId } = parsed.data
    const { testName } = parsed.data

    if (patientId.startsWith("P-")) {
      const patient = await prisma.patient.findUnique({ where: { patientId } })
      if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })
      patientId = patient.id
    }

    const lab = await prisma.labTest.create({
      data: {
        patientId,
        testName,
        orderedBy: session!.user.id,
        status: "pending"
      }
    })
    return NextResponse.json(lab, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
