import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "NURSE" && session.user.role !== "DOCTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { status } = body

    const updatedBag = await prisma.bloodBag.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json(updatedBag)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blood bag" }, { status: 500 })
  }
}
