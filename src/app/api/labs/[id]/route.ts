import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { status, resultText } = body

    const updatedLab = await prisma.labTest.update({
      where: { id },
      data: { status, resultText }
    })

    return NextResponse.json(updatedLab)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lab" }, { status: 500 })
  }
}
