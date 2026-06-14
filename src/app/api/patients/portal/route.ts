import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { patientId, portalPin } = body

    if (!patientId || !portalPin) {
      return NextResponse.json({ error: "Patient ID and PIN are required" }, { status: 400 })
    }

    const patient = await prisma.patient.findUnique({
      where: { patientId },
      include: {
        appointments: { orderBy: { date: "desc" } },
        prescriptions: { orderBy: { createdAt: "desc" } },
        labTests: { orderBy: { createdAt: "desc" } },
        invoices: { orderBy: { createdAt: "desc" } }
      }
    })

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    if (patient.portalPin !== portalPin) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error("Portal fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch patient data" }, { status: 500 })
  }
}

// force reload