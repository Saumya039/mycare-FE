import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"
import { requirePermission, Permission } from "@/lib/rbac"
import { handleApiError } from "@/lib/error-handler"

export async function GET() {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.VIEW_AMBULANCES)

    const ambulances = await prisma.ambulance.findMany({
      orderBy: { licensePlate: 'asc' }
    })
    return NextResponse.json(ambulances)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.MANAGE_AMBULANCES)

    const { vehicleNumber, driverName, driverPhone, type, location } = await req.json()

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
    return handleApiError(error)
  }
}
