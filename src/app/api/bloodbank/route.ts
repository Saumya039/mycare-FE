import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const bags = await prisma.bloodBag.findMany({
      orderBy: { expiryDate: 'asc' }
    })
    return NextResponse.json(bags)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blood bank" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "NURSE")) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const { bloodGroup, volumeMl, expiryDate } = body

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
    return NextResponse.json({ error: "Failed to log blood bag" }, { status: 500 })
  }
}
