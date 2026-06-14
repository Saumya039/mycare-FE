import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const department = searchParams.get("department")
    const dateStr = searchParams.get("date") // specific date

    const query: any = {}
    if (department) query.department = department
    if (dateStr) {
      const d = new Date(dateStr)
      d.setHours(0, 0, 0, 0)
      const nextD = new Date(d)
      nextD.setDate(d.getDate() + 1)
      query.date = { gte: d, lt: nextD }
    }

    const records = await prisma.dutyRoster.findMany({
      where: query,
      include: {
        user: { select: { name: true, role: true } }
      },
      orderBy: { date: "desc" }
    })

    const users = await prisma.user.findMany({
      select: { id: true, name: true, role: true }
    })

    return NextResponse.json({ records, users })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch roster" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "SUPER_ADMIN", "HR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId, shiftName, department, wardOrFloor, date } = await req.json()

    if (!userId || !shiftName || !department || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const record = await prisma.dutyRoster.create({
      data: {
        userId,
        shiftName,
        department,
        wardOrFloor,
        date: new Date(date)
      }
    })
    
    return NextResponse.json({ message: "Roster assigned", record })
  } catch (error) {
    return NextResponse.json({ error: "Failed to assign roster" }, { status: 500 })
  }
}
