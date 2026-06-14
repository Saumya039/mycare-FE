import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"


export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Check if we need to seed beds
    const count = await prisma.bed.count()
    if (count === 0) {
      const depts = ["Emergency", "ICU", "Cardiology", "Neurology", "Pediatrics"]
      for (let i = 1; i <= 30; i++) {
        await prisma.bed.create({
          data: {
            label: `BED-${String(i).padStart(2, '0')}`,
            departmentName: depts[i % depts.length],
            floor: (i % 3) + 1,
            wing: ["North", "South", "East"][i % 3],
          }
        })
      }
    }

    const beds = await prisma.bed.findMany({
      include: {
        patient: {
          select: { name: true, patientId: true, status: true, diagnosis: true }
        }
      },
      orderBy: { label: "asc" }
    })

    return NextResponse.json(beds)
  } catch (error) {
    console.error("Error fetching beds:", error)
    return NextResponse.json({ error: "Failed to fetch beds" }, { status: 500 })
  }
}
