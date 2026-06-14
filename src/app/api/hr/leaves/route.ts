import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    const query: any = {}
    if (userId) query.userId = userId
    if (status) query.status = status

    const records = await prisma.leaveRequest.findMany({
      where: query,
      include: { user: { select: { name: true, department: true, role: true } } },
      orderBy: { appliedAt: "desc" },
    })

    return NextResponse.json(records)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaves" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { leaveType, startDate, endDate, reason } = await req.json()

    if (!leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const record = await prisma.leaveRequest.create({
      data: {
        userId: session.user.id,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason
      }
    })
    
    return NextResponse.json({ message: "Leave applied", record })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit leave request" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "SUPER_ADMIN", "HR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, status } = await req.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const record = await prisma.leaveRequest.update({
      where: { id },
      data: { status }
    })
    
    return NextResponse.json({ message: "Leave status updated", record })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update leave request" }, { status: 500 })
  }
}
