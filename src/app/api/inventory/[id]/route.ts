import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "NURSE")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { addQuantity } = body

    if (!addQuantity || isNaN(parseInt(addQuantity))) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
    }

    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: {
        quantity: { increment: parseInt(addQuantity) },
        lastRestocked: new Date()
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error updating inventory:", error)
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 })
  }
}
