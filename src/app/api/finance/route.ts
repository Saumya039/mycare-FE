import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"

import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session || !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        patient: { select: { name: true, patientId: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    const totals = {
      revenue: invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.totalAmount, 0),
      pending: invoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.totalAmount, 0),
      overdue: invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.totalAmount, 0),
    }

    return NextResponse.json({ invoices, totals })
  } catch (error) {
    console.error("Finance API Error:", error)
    return NextResponse.json({ error: "Failed to fetch financial data" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession()
  if (!session || !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { id, status } = await req.json()
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status }
    })
    return NextResponse.json({ invoice })
  } catch (error) {
    console.error("Finance Update Error:", error)
    return NextResponse.json({ error: "Failed to update invoice status" }, { status: 500 })
  }
}
