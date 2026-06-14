import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        vitalSigns: {
          orderBy: { recordedAt: "desc" },
          take: 1, // Only get the most recent vital sign
        },
      },
    })

    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "DOCTOR" && session.user.role !== "RECEPTIONIST")) {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 })
    }

    const body = await request.json()
    
    // Generate a new Patient ID e.g., P-1002
    const count = await prisma.patient.count()
    const patientId = `P-${1001 + count}`

    const newPatient = await prisma.patient.create({
      data: {
        patientId,
        name: body.name,
        age: parseInt(body.age),
        gender: body.gender,
        diagnosis: body.diagnosis,
        status: body.status || "monitoring",
        departmentName: body.departmentName,
        doctorName: body.doctorName,
        allergies: body.allergies || null,
        
        // Phase 3 additions
        isMediclaimSecure: body.isMediclaimSecure === true || body.isMediclaimSecure === "true",
        advanceMoneyTaken: body.advanceMoneyTaken ? parseFloat(body.advanceMoneyTaken) : 0,
        isAyushmanBharat: body.isAyushmanBharat === true || body.isAyushmanBharat === "true",
        insuranceCompany: body.insuranceCompany || null,
        guardianName: body.guardianName || null,
        guardianRelation: body.guardianRelation || null,
        guardianPhone: body.guardianPhone || null,
        guardianEmail: body.guardianEmail || null,
      },
    })

    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    console.error("Error creating patient:", error)
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}
