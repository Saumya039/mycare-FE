import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-server"
import { validateRequest, validationErrorResponse } from "@/lib/validators"
import { PatientCreateSchema } from "@/lib/validators/patient"
import { handleApiError, AuthenticationError, AuthorizationError } from "@/lib/error-handler"
import { requirePermission, Permission, canAccessPatient, canModifyPatient } from "@/lib/rbac"
import { auditLog, AuditAction } from "@/lib/audit-logger"
import { encrypt, generatePin, hashPassword } from "@/lib/encryption"

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) throw new AuthenticationError()

    // Get patients based on role access
    const where: any = {}

    if (session.user.role === "DOCTOR" || session.user.role === "NURSE") {
      where.departmentName = session.user.department
    }

    const patients = await prisma.patient.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        vitalSigns: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
    })

    // Audit log for sensitive data access (if admin accessing all patients)
    if (session.user.role === "SUPER_ADMIN" || session.user.role === "ADMIN") {
      await auditLog({
        userId: session.user.id,
        action: AuditAction.SENSITIVE_DATA_ACCESSED,
        resource: "PATIENT_LIST",
        status: "SUCCESS",
      })
    }

    return NextResponse.json(patients)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) throw new AuthenticationError()

    // Check permission to create patient
    requirePermission(session, Permission.CREATE_PATIENT)

    // Validate request
    const validation = await validateRequest<typeof PatientCreateSchema>(request, PatientCreateSchema)
    if (!validation.success) {
      return validationErrorResponse(validation.errors)
    }

    const body = validation.data as any

    // Generate patient ID and portal PIN
    const count = await prisma.patient.count()
    const patientId = `P-${1001 + count}`
    const portalPin = generatePin(6)
    const hashedPin = await hashPassword(portalPin)

    const newPatient = await prisma.patient.create({
      data: {
        patientId,
        name: encrypt(body.name),
        age: body.age,
        gender: body.gender,
        diagnosis: encrypt(body.diagnosis),
        status: "ADMITTED",
        departmentName: body.departmentName,
        doctorName: body.doctorName,
        allergies: body.allergies ? encrypt(body.allergies) : null,
        isMediclaimSecure: body.isMediclaimSecure || false,
        isAyushmanBharat: body.isAyushmanBharat || false,
        insuranceCompany: body.insuranceCompany,
        guardianName: body.guardianName ? encrypt(body.guardianName) : null,
        guardianRelation: body.guardianRelation,
        guardianPhone: body.guardianPhone,
        guardianEmail: body.guardianEmail ? encrypt(body.guardianEmail) : null,
        portalPin: hashedPin,
      },
    })

    // Log audit event
    await auditLog({
      userId: session.user.id,
      action: AuditAction.PATIENT_CREATED,
      resource: "PATIENT",
      resourceId: newPatient.id,
      status: "SUCCESS",
      details: `Created patient ${patientId}`,
    })

    // Return response WITHOUT sensitive data
    return NextResponse.json(
      {
        ...newPatient,
        portalPin, // Send unencrypted PIN only at creation time
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      return handleApiError(error)
    }

    await auditLog({
      userId: "unknown",
      action: AuditAction.PATIENT_CREATED,
      resource: "PATIENT",
      status: "FAILURE",
      details: error instanceof Error ? error.message : "Unknown error",
    })

    return handleApiError(error)
  }
}

