import { z } from "zod"

// Common validators
export const emailValidator = z.string().email("Invalid email address").toLowerCase()
export const phoneValidator = z.string().regex(/^[0-9\+\-\(\)\s]+$/, "Invalid phone number").min(10)
export const idValidator = z.string().cuid("Invalid ID")
export const dateValidator = z.coerce.date()
export const currencyValidator = z.number().nonnegative("Amount must be positive").finite()
export const urlValidator = z.string().url("Invalid URL").optional()

// Role validator
export const roleValidator = z.enum([
  "SUPER_ADMIN",
  "ADMIN",
  "DOCTOR",
  "NURSE",
  "RECEPTIONIST",
  "PHARMACIST",
  "PATHOLOGIST",
  "RADIOLOGIST",
  "ACCOUNTANT",
  "USER",
])

// Status validators
export const appointmentStatusValidator = z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"])
export const patientStatusValidator = z.enum(["ADMITTED", "DISCHARGED", "WAITING", "TREATMENT"])
export const prescriptionStatusValidator = z.enum(["ACTIVE", "COMPLETED", "CANCELLED"])
