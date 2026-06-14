import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"

import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const totalPatients = await prisma.patient.count()
    const totalIPD = await prisma.patient.count({ where: { departmentName: "IPD" } })
    const totalOPD = await prisma.patient.count({ where: { departmentName: "OPD" } })
    const labTests = await prisma.labTest.count()
    const prescriptions = await prisma.prescription.count()
    const liveConsultations = await prisma.liveConsultation.count()

    return NextResponse.json({
      totalPatients,
      totalIPD,
      totalOPD,
      labTests,
      prescriptions,
      liveConsultations
    })
  } catch (error) {
    console.error("Reports GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch report data" }, { status: 500 })
  }
}
