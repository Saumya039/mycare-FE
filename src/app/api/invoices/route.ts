import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const invoices = await prisma.invoice.findMany({
      include: {
        patient: { select: { name: true, patientId: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(invoices)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const { patientId, totalAmount, dueDate, insuranceClaimStatus } = body

    // Check if patientId is display string
    let dbPatientId = patientId;
    if (patientId.startsWith("P-")) {
      const patient = await prisma.patient.findUnique({ where: { patientId } })
      if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })
      dbPatientId = patient.id
    }

    const invoice = await prisma.invoice.create({
      data: {
        patientId: dbPatientId,
        totalAmount: Number(totalAmount),
        dueDate: new Date(dueDate),
        insuranceClaimStatus,
        status: "pending"
      }
    })
    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}
