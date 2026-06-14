import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"


export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const ambulances = await prisma.ambulance.findMany({
      orderBy: { licensePlate: 'asc' }
    })
    return NextResponse.json(ambulances)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ambulances" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const { vehicleNumber, driverName, driverPhone, type, location } = body

    const ambulance = await prisma.ambulance.create({
      data: {
        licensePlate: vehicleNumber,
        driverName,
        phone: driverPhone,
        type,
        lastLocation: location,
        status: "available"
      }
    })
    return NextResponse.json(ambulance, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to register ambulance" }, { status: 500 })
  }
}
