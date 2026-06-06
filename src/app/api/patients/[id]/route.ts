import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const patient = await prisma.patient.findUnique({
      where: { patientId: params.id },
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
