import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"

import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") || "birth"

    if (type === "birth") {
      const records = await prisma.birthRecord.findMany({
        orderBy: { birthDate: "desc" }
      })
      const patients = await prisma.patient.findMany({ select: { id: true, name: true, patientId: true } })
      return NextResponse.json({ records, patients })
    } else {
      const records = await prisma.deathRecord.findMany({
        orderBy: { deathDate: "desc" }
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
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const data = await req.json()
    const { type } = data

    if (type === "birth") {
      const newRecord = await prisma.birthRecord.create({
        data: {
          childName: data.childName || "Unknown",
          gender: data.gender || "Unknown",
          weight: parseFloat(data.weight) || 0,
          birthDate: new Date(data.dateOfBirth || new Date()),
          motherName: data.motherName || "Unknown",
          fatherName: data.fatherName || "Unknown",
          doctorName: session.user.name || "System"
        }
      })
      return NextResponse.json({ success: true, newRecord })
    } else if (type === "death") {
      const newRecord = await prisma.deathRecord.create({
        data: {
          patientName: data.patientName || "Unknown",
          age: parseInt(data.age) || 0,
          gender: data.gender || "Unknown",
          deathDate: new Date(data.dateOfDeath || new Date()),
          cause: data.cause || "Unknown",
          doctorName: session.user.name || "System"
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
