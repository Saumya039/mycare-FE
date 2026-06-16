import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { GoogleGenAI } from "@google/genai"
import { auditLog, AuditAction } from "@/lib/audit-logger"
import { hasPermission, Permission } from "@/lib/rbac"

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Check permission to use AI
    if (!hasPermission(session, Permission.USE_AI_ASSISTANT)) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    const { message } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        response: "I am Serva AI. To fully activate my live capabilities, please add a `GEMINI_API_KEY` to the `.env` file and restart the server. You can get a free key from Google AI Studio.",
      })
    }

    // Initialize the Gemini client
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    // Fetch ONLY non-PHI hospital statistics (NO PATIENT NAMES, DIAGNOSES, PERSONAL DATA)
    const totalPatients = await prisma.patient.count()
    const admittedPatients = await prisma.patient.count({ where: { status: "ADMITTED" } })
    const dischargedToday = await prisma.patient.count({
      where: {
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        status: "DISCHARGED",
      },
    })

    const bedsCount = await prisma.bed.count()
    const availableBeds = await prisma.bed.count({ where: { status: "available" } })
    const occupiedBeds = bedsCount - availableBeds

    // Aggregate inventory counts only (no item details)
    const lowStockItems = await prisma.inventoryItem.count({
      where: {
        quantity: {
          lte: prisma.inventoryItem.fields.minimumThreshold,
        },
      },
    })

    // Appointment statistics only (no patient or doctor names)
    const todaysAppointments = await prisma.appointment.count({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    })

    const totalAppointments = await prisma.appointment.count()

    // Financial summary ONLY (no patient names or invoice IDs)
    const pendingInvoices = await prisma.invoice.count({ where: { status: "PENDING" } })
    const totalInvoiceAmount = await prisma.invoice.aggregate({
      _sum: {
        totalAmount: true,
      },
    })

    const systemPrompt = `You are Serva AI, the intelligent virtual assistant integrated into the Hospital Management System.
You are currently talking to ${session.user.name}, who is a ${session.user.role}.

HOSPITAL OPERATIONAL STATISTICS (Non-PHI data):
- Total Registered Patients: ${totalPatients}
- Currently Admitted: ${admittedPatients}
- Discharged Today: ${dischargedToday}
- Total Beds: ${bedsCount}
- Available Beds: ${availableBeds}
- Occupied Beds: ${occupiedBeds}
- Low Stock Items: ${lowStockItems}
- Today's Appointments: ${todaysAppointments}
- Total Appointments (all time): ${totalAppointments}
- Pending Invoices: ${pendingInvoices}
- Total Invoice Value: ₹${totalInvoiceAmount._sum.totalAmount || 0}

IMPORTANT RULES:
1. You only have access to NON-PERSONAL, aggregate operational statistics. You do NOT have access to patient names, diagnoses, or personal health information.
2. Be concise, professional, and helpful.
3. Provide hospital-wide insights based on the statistics provided above.
4. Do NOT make up or hallucinate any patient-specific data.
5. Keep answers under 3-4 short paragraphs.
6. If asked for patient-specific information, respond that you cannot access individual patient data for privacy reasons.`

    // Log AI usage
    await auditLog({
      userId: session.user.id,
      action: AuditAction.SENSITIVE_DATA_ACCESSED,
      resource: "AI_ASSISTANT",
      status: "SUCCESS",
    })

    // Call Gemini Model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
      },
    })

    return NextResponse.json({ response: response.text })
  } catch (error) {
    console.error("Gemini API Error:", error)
    return NextResponse.json({ error: "Serva AI encountered an error" }, { status: 500 })
  }
}

