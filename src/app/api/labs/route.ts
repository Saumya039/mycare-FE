import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"


export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const labs = await prisma.labTest.findMany({
      include: {
        patient: { select: { name: true, patientId: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(labs)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch labs" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const { patientId, testName } = body

    let dbPatientId = patientId;
    if (patientId.startsWith("P-")) {
      const patient = await prisma.patient.findUnique({ where: { patientId } })
      if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })
      dbPatientId = patient.id
    }

    const lab = await prisma.labTest.create({
      data: {
        patientId: dbPatientId,
        testName,
        orderedBy: session.user.id,
        status: "pending"
      }
    })
    return NextResponse.json(lab, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lab test" }, { status: 500 })
  }
}
