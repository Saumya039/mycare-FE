import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") || "birth"

    if (type === "birth") {
      const records = await prisma.birthRecord.findMany({
        include: { parent: { select: { name: true, patientId: true } } },
        orderBy: { dateOfBirth: "desc" }
      })
      const patients = await prisma.patient.findMany({ select: { id: true, name: true, patientId: true } })
      return NextResponse.json({ records, patients })
    } else {
      const records = await prisma.deathRecord.findMany({
        include: { patient: { select: { name: true, patientId: true } } },
        orderBy: { dateOfDeath: "desc" }
      })
      const patients = await prisma.patient.findMany({ select: { id: true, name: true, patientId: true } })
      return NextResponse.json({ records, patients })
    }
  } catch (error) {
    console.error("Records GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const data = await req.json()
    const { type } = data

    if (type === "birth") {
      const newRecord = await prisma.birthRecord.create({
        data: {
          childName: data.childName,
          gender: data.gender,
          weight: parseFloat(data.weight),
          dateOfBirth: new Date(data.dateOfBirth),
          parentId: data.parentId
        }
      })
      return NextResponse.json({ success: true, newRecord })
    } else if (type === "death") {
      const newRecord = await prisma.deathRecord.create({
        data: {
          patientId: data.patientId,
          dateOfDeath: new Date(data.dateOfDeath),
          cause: data.cause,
          reportedBy: data.reportedBy
        }
      })
      return NextResponse.json({ success: true, newRecord })
    }

    return NextResponse.json({ error: "Invalid record type" }, { status: 400 })
  } catch (error) {
    console.error("Records POST Error:", error)
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 })
  }
}
