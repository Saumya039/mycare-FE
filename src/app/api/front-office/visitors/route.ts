import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const query: any = {}
    if (status) query.status = status

    const records = await prisma.frontOfficeVisitor.findMany({
      where: query,
      orderBy: { checkInTime: "desc" },
    })

    return NextResponse.json(records)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch visitors" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "SUPER_ADMIN", "RECEPTIONIST"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { visitorName, phone, purpose, whomToMeet } = await req.json()

    if (!visitorName || !phone || !purpose || !whomToMeet) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const record = await prisma.frontOfficeVisitor.create({
      data: {
        visitorName,
        phone,
        purpose,
        whomToMeet,
        checkInTime: new Date()
      }
    })
    
    return NextResponse.json({ message: "Visitor registered", record })
  } catch (error) {
    return NextResponse.json({ error: "Failed to register visitor" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "SUPER_ADMIN", "RECEPTIONIST"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, status } = await req.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const record = await prisma.frontOfficeVisitor.update({
      where: { id },
      data: { 
        status,
        checkOutTime: status === "Checked-Out" ? new Date() : undefined
      }
    })
    
    return NextResponse.json({ message: "Visitor status updated", record })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update visitor" }, { status: 500 })
  }
}
