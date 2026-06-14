import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const claims = await prisma.tPAClaim.findMany({
      include: { patient: { select: { name: true, patientId: true } } },
      orderBy: { submittedAt: "desc" }
    })
    
    // Also fetch patients for the new claim dropdown
    const patients = await prisma.patient.findMany({
      select: { id: true, name: true, patientId: true, isMediclaimSecure: true, insuranceCompany: true }
    })

    return NextResponse.json({ claims, patients })
  } catch (error) {
    console.error("TPA GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { patientId, insuranceCompany, policyNumber, claimAmount } = await req.json()
    const claim = await prisma.tPAClaim.create({
      data: { patientId, insuranceCompany, policyNumber, claimAmount: parseFloat(claimAmount) }
    })
    return NextResponse.json({ claim })
  } catch (error) {
    console.error("TPA POST Error:", error)
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { id, status } = await req.json()
    const claim = await prisma.tPAClaim.update({
      where: { id },
      data: { status }
    })
    return NextResponse.json({ claim })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update claim" }, { status: 500 })
  }
}
