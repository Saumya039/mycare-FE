import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get("patientId")

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
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

    return NextResponse.json(patient)
  } catch (error) {
    console.error("Portal fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch patient data" }, { status: 500 })
  }
}
