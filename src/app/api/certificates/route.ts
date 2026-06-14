import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"

import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { issueDate: "desc" }
    })
    return NextResponse.json({ certificates })
  } catch (error) {
    console.error("Certificates GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { patientName, type, issuedBy, notes } = await req.json()

    const newCert = await prisma.certificate.create({
      data: { patientName, type, issuedBy, notes }
    })
    
    return NextResponse.json({ success: true, newCert })
  } catch (error) {
    console.error("Certificates POST Error:", error)
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 })
  }
}
