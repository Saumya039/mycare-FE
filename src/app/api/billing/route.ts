import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const invoices = await prisma.invoice.findMany({
      include: {
        patient: { select: { name: true, patientId: true } }
      },
      orderBy: { dueDate: "asc" }
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error fetching billing:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden. Only Admins can generate invoices." }, { status: 403 })
    }

    const { patientId, amount, dueDate, insuranceStatus } = await req.json()

    // Find the real DB ID of the patient
    const patient = await prisma.patient.findUnique({ where: { patientId } })
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })

    const invoice = await prisma.invoice.create({
      data: {
        patientId: patient.id,
        totalAmount: parseFloat(amount),
        dueDate: new Date(dueDate),
        status: "pending",
        insuranceClaimStatus: insuranceStatus || null
      }
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}
