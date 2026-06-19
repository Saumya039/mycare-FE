import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"
import { requirePermission, Permission } from "@/lib/rbac"
import { handleApiError } from "@/lib/error-handler"

export async function GET() {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.VIEW_INVOICES)

    const invoices = await prisma.invoice.findMany({
      include: {
        patient: { select: { name: true, patientId: true } }
      },
      orderBy: { dueDate: "asc" }
    })

    return NextResponse.json(invoices)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.CREATE_INVOICE)

    const { patientId, amount, dueDate, insuranceStatus } = await req.json()

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

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
