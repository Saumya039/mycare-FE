import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "NURSE")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { status, lastLocation } = body

    const updatedAmbulance = await prisma.ambulance.update({
      where: { id },
      data: { status, lastLocation }
    })

    return NextResponse.json(updatedAmbulance)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update ambulance" }, { status: 500 })
  }
}
