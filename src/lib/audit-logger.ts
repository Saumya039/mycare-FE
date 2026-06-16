import { prisma } from "./prisma"

export enum AuditAction {
  // Authentication
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  LOGIN_FAILED = "LOGIN_FAILED",

  // Patient operations
  PATIENT_CREATED = "PATIENT_CREATED",
  PATIENT_UPDATED = "PATIENT_UPDATED",
  PATIENT_DELETED = "PATIENT_DELETED",
  PATIENT_VIEWED = "PATIENT_VIEWED",

  // Appointment operations
  APPOINTMENT_CREATED = "APPOINTMENT_CREATED",
  APPOINTMENT_UPDATED = "APPOINTMENT_UPDATED",
  APPOINTMENT_CANCELLED = "APPOINTMENT_CANCELLED",

  // Financial operations
  INVOICE_CREATED = "INVOICE_CREATED",
  INVOICE_PAID = "INVOICE_PAID",
  INVOICE_DELETED = "INVOICE_DELETED",

  // Staff operations
  STAFF_CREATED = "STAFF_CREATED",
  STAFF_UPDATED = "STAFF_UPDATED",
  STAFF_DELETED = "STAFF_DELETED",

  // Permission changes
  PERMISSION_CHANGED = "PERMISSION_CHANGED",
  ROLE_CHANGED = "ROLE_CHANGED",

  // Sensitive data access
  SENSITIVE_DATA_ACCESSED = "SENSITIVE_DATA_ACCESSED",
}

export type AuditLogInput = {
  userId: string
  action: AuditAction
  resource: string
  resourceId?: string
  changes?: Record<string, any>
  status: "SUCCESS" | "FAILURE"
  ipAddress?: string
  userAgent?: string
  details?: string
}

/**
 * Log an audit event (non-blocking)
 */
export async function auditLog(input: AuditLogInput) {
  try {
    // Fire and forget to prevent blocking operations
    setImmediate(async () => {
      try {
        await prisma.auditLog.create({
          data: {
            userId: input.userId,
            action: input.action,
            resource: input.resource,
            resourceId: input.resourceId,
            changes: input.changes,
            status: input.status,
            ipAddress: input.ipAddress,
            userAgent: input.userAgent,
            details: input.details,
            timestamp: new Date(),
          },
        })
      } catch (error) {
        console.error("Failed to write audit log:", error)
      }
    })
  } catch (error) {
    console.error("Audit logging error:", error)
  }
}

/**
 * Get audit logs (admin only)
 */
export async function getAuditLogs(filters?: {
  userId?: string
  action?: AuditAction
  resource?: string
  status?: "SUCCESS" | "FAILURE"
  startDate?: Date
  endDate?: Date
  limit?: number
}) {
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.action && { action: filters.action }),
        ...(filters?.resource && { resource: filters.resource }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.startDate && {
          timestamp: {
            gte: filters.startDate,
          },
        }),
        ...(filters?.endDate && {
          timestamp: {
            lte: filters.endDate,
          },
        }),
      },
      orderBy: {
        timestamp: "desc",
      },
      take: filters?.limit || 100,
    })

    return logs
  } catch (error) {
    console.error("Failed to fetch audit logs:", error)
    return []
  }
}

/**
 * Get user activity summary
 */
export async function getUserActivitySummary(userId: string, days: number = 30) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const logs = await prisma.auditLog.findMany({
      where: {
        userId,
        timestamp: {
          gte: startDate,
        },
      },
      select: {
        action: true,
        timestamp: true,
        status: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    })

    return {
      totalActions: logs.length,
      successCount: logs.filter((l) => l.status === "SUCCESS").length,
      failureCount: logs.filter((l) => l.status === "FAILURE").length,
      actions: logs,
    }
  } catch (error) {
    console.error("Failed to get user activity summary:", error)
    return null
  }
}
