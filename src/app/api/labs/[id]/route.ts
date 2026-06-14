import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
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
