import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    // Only fetch pathology tests (using a simple heuristic for demo, e.g. tests that don't sound like radiology)
    // In a real app we'd have a 'category' field. Here we'll just fetch all LabTests.
    const tests = await prisma.labTest.findMany({
      include: {
        patient: { select: { name: true, patientId: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    const patients = await prisma.patient.findMany({
      select: { id: true, name: true, patientId: true }
    })

    return NextResponse.json({ tests, patients })
  } catch (error) {
    console.error("Pathology GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch pathology data" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { action, testId, resultText, patientId, testName } = await req.json()

    if (action === "update" && testId && resultText) {
      const updated = await prisma.labTest.update({
        where: { id: testId },
        data: { 
          status: "completed",
          resultText 
        }
      })
      return NextResponse.json({ success: true, updated })
    }

    if (action === "order" && patientId && testName) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email as string } })
      const newTest = await prisma.labTest.create({
        data: {
          patientId,
          testName,
          orderedBy: user?.id,
          status: "pending"
        }
      })
      return NextResponse.json({ success: true, newTest })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Pathology POST Error:", error)
    return NextResponse.json({ error: "Failed to process pathology request" }, { status: 500 })
  }
}
