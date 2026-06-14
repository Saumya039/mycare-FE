import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden. Only Admins can modify staff." }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { action, shiftStart, shiftEnd, departmentName, contactInfo, homeAddress } = body

    if (action === "shift") {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { shiftStart, shiftEnd }
      })
      return NextResponse.json(updatedUser)
    } 
    else if (action === "profile") {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { department: departmentName, contactInfo, homeAddress }
      })
      return NextResponse.json(updatedUser)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating staff:", error)
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 })
  }
}
