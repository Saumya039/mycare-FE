import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const consultations = await prisma.liveConsultation.findMany({
      orderBy: { date: "asc" }
    })
    return NextResponse.json({ consultations })
  } catch (error) {
    console.error("Consultation GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { action, id, patientName, doctorName, date, meetingLink } = await req.json()

    if (action === "updateStatus" && id) {
      const updated = await prisma.liveConsultation.update({
        where: { id },
        data: { status: "Completed" }
      })
      return NextResponse.json({ success: true, updated })
    }

    if (patientName && doctorName && date && meetingLink) {
      const newConsult = await prisma.liveConsultation.create({
        data: {
          patientName,
          doctorName,
          date: new Date(date),
          meetingLink
        }
      })
      return NextResponse.json({ success: true, newConsult })
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  } catch (error) {
    console.error("Consultation POST Error:", error)
    return NextResponse.json({ error: "Failed to create consultation" }, { status: 500 })
  }
}
