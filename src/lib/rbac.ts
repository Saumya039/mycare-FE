import { Session } from "./auth-server"
import { AuthorizationError } from "./error-handler"

export enum Permission {
  // Patient permissions
  VIEW_OWN_PATIENT = "view:own:patient",
  VIEW_DEPARTMENT_PATIENTS = "view:department:patients",
  VIEW_ALL_PATIENTS = "view:all:patients",
  CREATE_PATIENT = "create:patient",
  UPDATE_PATIENT = "update:patient",
  DELETE_PATIENT = "delete:patient",

  // Appointment permissions
  VIEW_APPOINTMENTS = "view:appointments",
  CREATE_APPOINTMENT = "create:appointment",
  UPDATE_APPOINTMENT = "update:appointment",
  CANCEL_APPOINTMENT = "cancel:appointment",

  // Financial permissions
  VIEW_INVOICES = "view:invoices",
  CREATE_INVOICE = "create:invoice",
  UPDATE_INVOICE = "update:invoice",
  DELETE_INVOICE = "delete:invoice",
  VIEW_BILLING_REPORTS = "view:billing_reports",

  // Staff permissions
  VIEW_STAFF = "view:staff",
  CREATE_STAFF = "create:staff",
  UPDATE_STAFF = "update:staff",
  DELETE_STAFF = "delete:staff",
  MANAGE_ROLES = "manage:roles",

  // Admin permissions
  VIEW_AUDIT_LOGS = "view:audit_logs",
  VIEW_SYSTEM_CONFIG = "view:system_config",
  UPDATE_SYSTEM_CONFIG = "update:system_config",

  // AI permissions
  USE_AI_ASSISTANT = "use:ai_assistant",
}

type RolePermissions = {
  [key: string]: Permission[]
}

const rolePermissions: RolePermissions = {
  SUPER_ADMIN: Object.values(Permission),

  ADMIN: [
    Permission.VIEW_ALL_PATIENTS,
    Permission.CREATE_PATIENT,
    Permission.UPDATE_PATIENT,
    Permission.VIEW_APPOINTMENTS,
    Permission.CREATE_APPOINTMENT,
    Permission.UPDATE_APPOINTMENT,
    Permission.VIEW_INVOICES,
    Permission.CREATE_INVOICE,
    Permission.VIEW_BILLING_REPORTS,
    Permission.VIEW_STAFF,
    Permission.CREATE_STAFF,
    Permission.UPDATE_STAFF,
    Permission.VIEW_AUDIT_LOGS,
    Permission.USE_AI_ASSISTANT,
  ],

  DOCTOR: [
    Permission.VIEW_OWN_PATIENT,
    Permission.VIEW_DEPARTMENT_PATIENTS,
    Permission.CREATE_PATIENT,
    Permission.UPDATE_PATIENT,
    Permission.VIEW_APPOINTMENTS,
    Permission.CREATE_APPOINTMENT,
    Permission.UPDATE_APPOINTMENT,
    Permission.CANCEL_APPOINTMENT,
    Permission.USE_AI_ASSISTANT,
  ],

  NURSE: [
    Permission.VIEW_DEPARTMENT_PATIENTS,
    Permission.UPDATE_PATIENT,
    Permission.VIEW_APPOINTMENTS,
    Permission.USE_AI_ASSISTANT,
  ],

  RECEPTIONIST: [
    Permission.VIEW_DEPARTMENT_PATIENTS,
    Permission.CREATE_PATIENT,
    Permission.CREATE_APPOINTMENT,
    Permission.VIEW_APPOINTMENTS,
  ],

  PHARMACIST: [
    Permission.VIEW_APPOINTMENTS,
    Permission.USE_AI_ASSISTANT,
  ],

  PATHOLOGIST: [
    Permission.VIEW_APPOINTMENTS,
    Permission.USE_AI_ASSISTANT,
  ],

  RADIOLOGIST: [
    Permission.VIEW_APPOINTMENTS,
    Permission.USE_AI_ASSISTANT,
  ],

  ACCOUNTANT: [
    Permission.VIEW_ALL_PATIENTS,
    Permission.VIEW_INVOICES,
    Permission.CREATE_INVOICE,
    Permission.UPDATE_INVOICE,
    Permission.VIEW_BILLING_REPORTS,
  ],

  USER: [Permission.VIEW_OWN_PATIENT],
}

/**
 * Check if user has permission
 */
export function hasPermission(session: Session | null, permission: Permission): boolean {
  if (!session) return false

  const permissions = rolePermissions[session.user.role] || []
  return permissions.includes(permission)
}

/**
 * Check if user has any of the given permissions
 */
export function hasAnyPermission(session: Session | null, permissions: Permission[]): boolean {
  if (!session) return false
  return permissions.some((p) => hasPermission(session, p))
}

/**
 * Require permission or throw AuthorizationError
 */
export function requirePermission(session: Session | null, permission: Permission) {
  if (!session) {
    throw new AuthorizationError("Authentication required")
  }

  if (!hasPermission(session, permission)) {
    throw new AuthorizationError(`Permission denied: ${permission}`)
  }
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: string): Permission[] {
  return rolePermissions[role] || []
}

/**
 * Check if user can access patient data
 */
export function canAccessPatient(
  session: Session | null,
  patientDepartment: string | undefined,
  userId?: string
): boolean {
  if (!session) return false

  const { role, department, id } = session.user

  if (role === "SUPER_ADMIN" || role === "ADMIN") return true

  // Doctor can access own patients and department patients
  if (role === "DOCTOR") {
    return department === patientDepartment
  }

  // Nurse can access department patients
  if (role === "NURSE") {
    return department === patientDepartment
  }

  return false
}

/**
 * Check if user can modify patient data
 */
export function canModifyPatient(session: Session | null, role?: string): boolean {
  if (!session) return false

  const userRole = session.user.role
  return ["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTIONIST"].includes(userRole)
}
