import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const patients = await prisma.patient.findMany({
      where: { departmentName: "IPD" },
      orderBy: { createdAt: "desc" },
      include: {
        bed: true
      }
    })

    const beds = await prisma.bed.findMany({
      where: { status: "available" }
    })

    return NextResponse.json({ patients, beds })
  } catch (error) {
    console.error("IPD GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch IPD data" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const data = await req.json()
    const { name, age, gender, diagnosis, doctorName, bedId } = data

    const patient = await prisma.patient.create({
      data: {
        patientId: `IPD-${Math.floor(Math.random() * 10000)}`,
        name,
        age: parseInt(age),
        gender,
        diagnosis,
        departmentName: "IPD",
        doctorName,
        status: "admitted",
        bedId: bedId || null
      }
    })

    if (bedId) {
      await prisma.bed.update({
        where: { id: bedId },
        data: { status: "occupied" }
      })
    }

    return NextResponse.json({ patient })
  } catch (error) {
    console.error("IPD POST Error:", error)
    return NextResponse.json({ error: "Failed to create IPD patient" }, { status: 500 })
  }
}
