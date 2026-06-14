import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"

import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    const query = userId ? { userId } : {}
    const records = await prisma.attendance.findMany({
      where: query,
      include: { user: { select: { name: true, department: true } } },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(records)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Find if record exists for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let record = await prisma.attendance.findFirst({
      where: {
        userId: session.user.id,
        date: { gte: today }
      }
    })

    if (!record) {
      // Clock In
      record = await prisma.attendance.create({
        data: {
          userId: session.user.id,
          date: new Date(),
          clockIn: new Date(),
          status: "Present"
        }
      })
      return NextResponse.json({ message: "Clocked In", record })
    } else if (!record.clockOut) {
      // Clock Out
      const now = new Date()
      const diffMs = now.getTime() - record.clockIn!.getTime()
      const workHours = diffMs / (1000 * 60 * 60)
      
      record = await prisma.attendance.update({
        where: { id: record.id },
        data: {
          clockOut: now,
          workHours
        }
      })
      return NextResponse.json({ message: "Clocked Out", record })
    }

    return NextResponse.json({ error: "Already clocked out for today" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit attendance" }, { status: 500 })
  }
}
