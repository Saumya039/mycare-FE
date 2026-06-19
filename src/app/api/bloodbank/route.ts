import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"
import { requirePermission, Permission } from "@/lib/rbac"
import { handleApiError } from "@/lib/error-handler"

export async function GET() {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.VIEW_BLOOD_BANK)

    const bags = await prisma.bloodBag.findMany({
      orderBy: { expiryDate: 'asc' }
    })
    return NextResponse.json(bags)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    requirePermission(session, Permission.MANAGE_BLOOD_BAGS)

    const { bloodGroup, volumeMl, expiryDate } = await req.json()

    const bag = await prisma.bloodBag.create({
      data: {
        bloodGroup,
        volumeMl: Number(volumeMl) || 450,
        expiryDate: new Date(expiryDate),
        status: "available"
      }
    })
    return NextResponse.json(bag, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
