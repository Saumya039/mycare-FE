import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Force this route to be dynamic so it doesn't cache
export const dynamic = "force-dynamic"

export async function GET() {
  const encoder = new TextEncoder()

  const customReadable = new ReadableStream({
    async start(controller) {
      // Send an initial connected message
      controller.enqueue(encoder.encode("event: connected\ndata: connected\n\n"))

      // Polling loop to simulate live vitals from monitors
      while (true) {
        try {
          const patients = await prisma.patient.findMany({
            where: { status: { not: "discharged" } },
            select: { id: true, patientId: true, name: true, status: true, departmentName: true }
          })

          const vitalsUpdate = patients.map(p => {
            // Generate realistic random fluctuations
            const baseHr = p.status === "critical" ? 110 : 75
            const baseO2 = p.status === "critical" ? 92 : 98
            
            return {
              patientId: p.patientId,
              name: p.name,
              status: p.status,
              department: p.departmentName,
              heartRate: Math.floor(baseHr + (Math.random() * 15 - 5)), // fluctuate +/- 5-10
              oxygenLevel: Math.max(80, Math.min(100, Math.floor(baseO2 + (Math.random() * 4 - 2)))),
              systolic: Math.floor(120 + (Math.random() * 20 - 10)),
              diastolic: Math.floor(80 + (Math.random() * 10 - 5)),
            }
          })

          const dataString = JSON.stringify(vitalsUpdate)
          controller.enqueue(encoder.encode(`data: ${dataString}\n\n`))
          
          // Wait 2 seconds before the next reading
          await new Promise(resolve => setTimeout(resolve, 2000))
        } catch (err) {
          console.error("Stream error", err)
          break
        }
      }
    },
    cancel() {
      console.log("Client disconnected from vitals stream")
    }
  })

  return new NextResponse(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  })
}
