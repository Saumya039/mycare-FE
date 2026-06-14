import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"


export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    // Only Doctors can prescribe
    if (!session || session.user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden. Only doctors can write prescriptions." }, { status: 403 })
    }

    const body = await req.json()
    const { patientId, medicationName, dosage, frequency, duration } = body

    if (!patientId || !medicationName || !dosage || !frequency || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the real DB ID of the patient if a display ID like P-1001 is passed
    let dbPatientId = patientId;
    if (patientId.startsWith("P-")) {
      const patient = await prisma.patient.findUnique({ where: { patientId } })
      if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })
      dbPatientId = patient.id
    }

    const newPx = await prisma.prescription.create({
      data: {
        patientId: dbPatientId,
        doctorId: session.user.id, // ID from the session token
        medicationName,
        dosage,
        frequency,
        duration,
        status: "active"
      }
    })

    return NextResponse.json(newPx, { status: 201 })
  } catch (error) {
    console.error("Error creating prescription:", error)
    return NextResponse.json({ error: "Failed to create prescription" }, { status: 500 })
  }
}
