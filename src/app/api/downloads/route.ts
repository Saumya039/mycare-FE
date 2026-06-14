import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"

import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const documents = await prisma.document.findMany({
      orderBy: { uploadedAt: "desc" }
    })
    return NextResponse.json({ documents })
  } catch (error) {
    console.error("Downloads GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { title, type, url, uploadedBy } = await req.json()

    const newDoc = await prisma.document.create({
      data: { title, type, url, uploadedBy }
    })
    
    return NextResponse.json({ success: true, newDoc })
  } catch (error) {
    console.error("Downloads POST Error:", error)
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 })
  }
}
