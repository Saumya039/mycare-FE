import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"
import { requirePermission, Permission } from "@/lib/rbac"
import { handleApiError } from "@/lib/error-handler"

export async function GET() {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.VIEW_PHARMACY)

    const inventory = await prisma.inventoryItem.findMany({
      where: { category: "Medicine" },
      orderBy: { itemName: "asc" }
    })

    const prescriptions = await prisma.prescription.findMany({
      where: { status: "active" },
      include: {
        patient: { select: { name: true, patientId: true } },
        doctor: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ inventory, prescriptions })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.VIEW_PHARMACY)

    const { action, prescriptionId, itemId, quantity } = await req.json()

    if (action === "dispense" && prescriptionId) {
      requirePermission(session, Permission.DISPENSE_MEDICATION)
      const updated = await prisma.prescription.update({
        where: { id: prescriptionId },
        data: { status: "completed" }
      })
      return NextResponse.json({ success: true, updated })
    }

    if (action === "restock" && itemId && quantity) {
      requirePermission(session, Permission.RESTOCK_INVENTORY)
      const updated = await prisma.inventoryItem.update({
        where: { id: itemId },
        data: {
          quantity: { increment: parseInt(quantity) },
          lastRestocked: new Date()
        }
      })
      return NextResponse.json({ success: true, updated })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return handleApiError(error)
  }
}
