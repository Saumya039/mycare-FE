import { Session } from "./auth-server"
import { AuthorizationError } from "./error-handler"

export enum Permission {
  VIEW_OWN_PATIENT = "view:own:patient",
  VIEW_DEPARTMENT_PATIENTS = "view:department:patients",
  VIEW_ALL_PATIENTS = "view:all:patients",
  CREATE_PATIENT = "create:patient",
  UPDATE_PATIENT = "update:patient",
  DELETE_PATIENT = "delete:patient",

  VIEW_APPOINTMENTS = "view:appointments",
  CREATE_APPOINTMENT = "create:appointment",
  UPDATE_APPOINTMENT = "update:appointment",
  CANCEL_APPOINTMENT = "cancel:appointment",

  VIEW_INVOICES = "view:invoices",
  CREATE_INVOICE = "create:invoice",
  UPDATE_INVOICE = "update:invoice",
  DELETE_INVOICE = "delete:invoice",
  VIEW_BILLING_REPORTS = "view:billing_reports",

  VIEW_STAFF = "view:staff",
  CREATE_STAFF = "create:staff",
  UPDATE_STAFF = "update:staff",
  DELETE_STAFF = "delete:staff",
  MANAGE_ROLES = "manage:roles",

  VIEW_AUDIT_LOGS = "view:audit_logs",
  VIEW_SYSTEM_CONFIG = "view:system_config",
  UPDATE_SYSTEM_CONFIG = "update:system_config",

  USE_AI_ASSISTANT = "use:ai_assistant",

  VIEW_PHARMACY = "view:pharmacy",
  DISPENSE_MEDICATION = "dispense:medication",
  RESTOCK_INVENTORY = "restock:inventory",

  VIEW_LABS = "view:labs",
  CREATE_LAB_TEST = "create:lab_test",
  UPDATE_LAB_RESULT = "update:lab_result",

  VIEW_BLOOD_BANK = "view:blood_bank",
  MANAGE_BLOOD_BAGS = "manage:blood_bags",

  VIEW_AMBULANCES = "view:ambulances",
  MANAGE_AMBULANCES = "manage:ambulances",

  VIEW_BEDS = "view:beds",
  ASSIGN_BED = "assign:bed",
  RELEASE_BED = "release:bed",

  VIEW_ATTENDANCE = "view:attendance",
  MANAGE_ATTENDANCE = "manage:attendance",
  VIEW_LEAVES = "view:leaves",
  APPROVE_LEAVES = "approve:leaves",
  MANAGE_ROSTER = "manage:roster",

  VIEW_REFERRALS = "view:referrals",
  CREATE_REFERRAL = "create:referral",

  VIEW_TPA_CLAIMS = "view:tpa_claims",
  MANAGE_TPA_CLAIMS = "manage:tpa_claims",

  VIEW_FINANCE = "view:finance",
  MANAGE_FINANCE = "manage:finance",

  SEND_MESSAGE = "send:message",
  VIEW_MESSAGES = "view:messages",

  VIEW_INVENTORY = "view:inventory",
  MANAGE_INVENTORY = "manage:inventory",

  VIEW_DOCUMENTS = "view:documents",
  UPLOAD_DOCUMENTS = "upload:documents",

  VIEW_CERTIFICATES = "view:certificates",
  CREATE_CERTIFICATE = "create:certificate",

  VIEW_CONSULTATIONS = "view:consultations",
  CREATE_CONSULTATION = "create:consultation",

  VIEW_RECORDS = "view:records",
  CREATE_RECORDS = "create:records",

  VIEW_BRANCHES = "view:branches",
  MANAGE_BRANCHES = "manage:branches",

  VIEW_REPORTS = "view:reports",

  VIEW_VISITORS = "view:visitors",
  MANAGE_VISITORS = "manage:visitors",

  VIEW_OPD = "view:opd",
  VIEW_IPD = "view:ipd",
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
    Permission.CANCEL_APPOINTMENT,
    Permission.VIEW_INVOICES,
    Permission.CREATE_INVOICE,
    Permission.UPDATE_INVOICE,
    Permission.VIEW_BILLING_REPORTS,
    Permission.VIEW_STAFF,
    Permission.CREATE_STAFF,
    Permission.UPDATE_STAFF,
    Permission.VIEW_AUDIT_LOGS,
    Permission.USE_AI_ASSISTANT,
    Permission.VIEW_PHARMACY,
    Permission.DISPENSE_MEDICATION,
    Permission.RESTOCK_INVENTORY,
    Permission.VIEW_LABS,
    Permission.CREATE_LAB_TEST,
    Permission.UPDATE_LAB_RESULT,
    Permission.VIEW_BLOOD_BANK,
    Permission.MANAGE_BLOOD_BAGS,
    Permission.VIEW_AMBULANCES,
    Permission.MANAGE_AMBULANCES,
    Permission.VIEW_BEDS,
    Permission.ASSIGN_BED,
    Permission.RELEASE_BED,
    Permission.VIEW_ATTENDANCE,
    Permission.MANAGE_ATTENDANCE,
    Permission.VIEW_LEAVES,
    Permission.APPROVE_LEAVES,
    Permission.MANAGE_ROSTER,
    Permission.VIEW_REFERRALS,
    Permission.CREATE_REFERRAL,
    Permission.VIEW_TPA_CLAIMS,
    Permission.MANAGE_TPA_CLAIMS,
    Permission.VIEW_FINANCE,
    Permission.MANAGE_FINANCE,
    Permission.VIEW_MESSAGES,
    Permission.SEND_MESSAGE,
    Permission.VIEW_INVENTORY,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.VIEW_CERTIFICATES,
    Permission.CREATE_CERTIFICATE,
    Permission.VIEW_CONSULTATIONS,
    Permission.CREATE_CONSULTATION,
    Permission.VIEW_RECORDS,
    Permission.CREATE_RECORDS,
    Permission.VIEW_BRANCHES,
    Permission.VIEW_REPORTS,
    Permission.VIEW_VISITORS,
    Permission.MANAGE_VISITORS,
    Permission.VIEW_OPD,
    Permission.VIEW_IPD,
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
    Permission.VIEW_PHARMACY,
    Permission.DISPENSE_MEDICATION,
    Permission.VIEW_LABS,
    Permission.CREATE_LAB_TEST,
    Permission.VIEW_BLOOD_BANK,
    Permission.VIEW_AMBULANCES,
    Permission.VIEW_BEDS,
    Permission.ASSIGN_BED,
    Permission.VIEW_ATTENDANCE,
    Permission.VIEW_LEAVES,
    Permission.VIEW_REFERRALS,
    Permission.CREATE_REFERRAL,
    Permission.VIEW_TPA_CLAIMS,
    Permission.VIEW_MESSAGES,
    Permission.SEND_MESSAGE,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_CERTIFICATES,
    Permission.CREATE_CERTIFICATE,
    Permission.VIEW_CONSULTATIONS,
    Permission.CREATE_CONSULTATION,
    Permission.VIEW_RECORDS,
    Permission.CREATE_RECORDS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_OPD,
    Permission.VIEW_IPD,
  ],

  NURSE: [
    Permission.VIEW_DEPARTMENT_PATIENTS,
    Permission.UPDATE_PATIENT,
    Permission.VIEW_APPOINTMENTS,
    Permission.USE_AI_ASSISTANT,
    Permission.VIEW_PHARMACY,
    Permission.VIEW_LABS,
    Permission.VIEW_BLOOD_BANK,
    Permission.VIEW_AMBULANCES,
    Permission.VIEW_BEDS,
    Permission.ASSIGN_BED,
    Permission.RELEASE_BED,
    Permission.VIEW_ATTENDANCE,
    Permission.VIEW_LEAVES,
    Permission.VIEW_REFERRALS,
    Permission.VIEW_MESSAGES,
    Permission.SEND_MESSAGE,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_RECORDS,
    Permission.VIEW_VISITORS,
    Permission.VIEW_OPD,
    Permission.VIEW_IPD,
  ],

  RECEPTIONIST: [
    Permission.VIEW_DEPARTMENT_PATIENTS,
    Permission.CREATE_PATIENT,
    Permission.CREATE_APPOINTMENT,
    Permission.VIEW_APPOINTMENTS,
    Permission.VIEW_AMBULANCES,
    Permission.VIEW_BEDS,
    Permission.VIEW_REFERRALS,
    Permission.CREATE_REFERRAL,
    Permission.VIEW_MESSAGES,
    Permission.SEND_MESSAGE,
    Permission.VIEW_CERTIFICATES,
    Permission.VIEW_CONSULTATIONS,
    Permission.VIEW_VISITORS,
    Permission.MANAGE_VISITORS,
    Permission.VIEW_OPD,
  ],

  PHARMACIST: [
    Permission.VIEW_APPOINTMENTS,
    Permission.USE_AI_ASSISTANT,
    Permission.VIEW_PHARMACY,
    Permission.DISPENSE_MEDICATION,
    Permission.RESTOCK_INVENTORY,
    Permission.VIEW_INVENTORY,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_MESSAGES,
    Permission.SEND_MESSAGE,
  ],

  PATHOLOGIST: [
    Permission.VIEW_APPOINTMENTS,
    Permission.USE_AI_ASSISTANT,
    Permission.VIEW_LABS,
    Permission.CREATE_LAB_TEST,
    Permission.UPDATE_LAB_RESULT,
    Permission.VIEW_BLOOD_BANK,
    Permission.MANAGE_BLOOD_BAGS,
    Permission.VIEW_MESSAGES,
    Permission.SEND_MESSAGE,
  ],

  RADIOLOGIST: [
    Permission.VIEW_APPOINTMENTS,
    Permission.USE_AI_ASSISTANT,
    Permission.VIEW_LABS,
    Permission.CREATE_LAB_TEST,
    Permission.UPDATE_LAB_RESULT,
    Permission.VIEW_MESSAGES,
    Permission.SEND_MESSAGE,
  ],

  ACCOUNTANT: [
    Permission.VIEW_ALL_PATIENTS,
    Permission.VIEW_INVOICES,
    Permission.CREATE_INVOICE,
    Permission.UPDATE_INVOICE,
    Permission.VIEW_BILLING_REPORTS,
    Permission.VIEW_TPA_CLAIMS,
    Permission.MANAGE_TPA_CLAIMS,
    Permission.VIEW_FINANCE,
    Permission.MANAGE_FINANCE,
    Permission.VIEW_MESSAGES,
    Permission.SEND_MESSAGE,
    Permission.VIEW_REPORTS,
  ],

  USER: [
    Permission.VIEW_OWN_PATIENT,
  ],
}

export function hasPermission(session: Session | null, permission: Permission): boolean {
  if (!session) return false
  const permissions = rolePermissions[session.user.role] || []
  return permissions.includes(permission)
}

export function hasAnyPermission(session: Session | null, permissions: Permission[]): boolean {
  if (!session) return false
  return permissions.some((p) => hasPermission(session, p))
}

export function requirePermission(session: Session | null, permission: Permission) {
  if (!session) {
    throw new AuthorizationError("Authentication required")
  }
  if (!hasPermission(session, permission)) {
    throw new AuthorizationError(`Permission denied: ${permission}`)
  }
}

export function getRolePermissions(role: string): Permission[] {
  return rolePermissions[role] || []
}

export function canAccessPatient(
  session: Session | null,
  patientDepartment: string | undefined,
  userId?: string
): boolean {
  if (!session) return false
  const { role, department } = session.user
  if (role === "SUPER_ADMIN" || role === "ADMIN") return true
  if (role === "DOCTOR" || role === "NURSE") return department === patientDepartment
  return false
}

export function canModifyPatient(session: Session | null, role?: string): boolean {
  if (!session) return false
  return ["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTIONIST"].includes(session.user.role)
}
