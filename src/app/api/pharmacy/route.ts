import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"

import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
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
    console.error("Pharmacy GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch pharmacy data" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { action, prescriptionId, itemId, quantity } = await req.json()

    if (action === "dispense" && prescriptionId) {
      const updated = await prisma.prescription.update({
        where: { id: prescriptionId },
        data: { status: "completed" }
      })
      return NextResponse.json({ success: true, updated })
    }

    if (action === "restock" && itemId && quantity) {
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
    console.error("Pharmacy POST Error:", error)
    return NextResponse.json({ error: "Failed to update pharmacy data" }, { status: 500 })
  }
}
