import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "./../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { GoogleGenAI } from "@google/genai"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { message } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        response: "I am Serva AI. To fully activate my live capabilities, please add a `GEMINI_API_KEY` to the `.env` file and restart the server. You can get a free key from Google AI Studio." 
      })
    }

    // Initialize the Gemini client
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    // Fetch live hospital context
    const patients = await prisma.patient.findMany({
      select: { patientId: true, name: true, status: true, diagnosis: true, departmentName: true }
    })
    
    const bedsCount = await prisma.bed.count()
    const availableBeds = await prisma.bed.count({ where: { status: "available" } })
    
    const inventory = await prisma.inventoryItem.findMany({
      select: { itemName: true, quantity: true, minimumThreshold: true }
    })
    
    const appointments = await prisma.appointment.findMany({
      select: { patientId: true, date: true, reason: true, doctor: { select: { name: true } } }
    })

    const systemPrompt = `You are Serva AI, the intelligent virtual assistant integrated into the Sevra Technologies Hospital Management System. 
You are currently talking to ${session.user.name}, who is a ${session.user.role}.
Here is the LIVE data from the hospital database right now:
- Total Beds: ${bedsCount}
- Available Beds: ${availableBeds}
- Admitted Patients: ${JSON.stringify(patients)}
- Pharmacy Inventory: ${JSON.stringify(inventory)}
- Upcoming Appointments: ${JSON.stringify(appointments)}

Rules:
1. Be concise, professional, and helpful.
2. If asked about patients, inventory, or appointments, use the real live data provided above. Do not hallucinate data.
3. If asked to write a Discharge Summary for a patient, write a professional medical summary based on their diagnosis.
4. Keep answers under 3-4 short paragraphs so they fit well in the chat UI.`

    // Call Gemini Model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
      }
    })

    return NextResponse.json({ response: response.text })
  } catch (error) {
    console.error("Gemini API Error:", error)
    return NextResponse.json({ error: "Serva AI encountered an error" }, { status: 500 })
  }
}
