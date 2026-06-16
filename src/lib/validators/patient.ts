import { z } from "zod"
import { emailValidator, phoneValidator, dateValidator, patientStatusValidator } from "./common"

export const PatientCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  age: z.number().int().min(0).max(150),
  gender: z.enum(["M", "F", "OTHER"]),
  email: emailValidator.optional(),
  phone: phoneValidator.optional(),
  departmentName: z.string().min(1, "Department required"),
  diagnosis: z.string().min(1, "Diagnosis required"),
  doctorName: z.string().min(2),
  allergies: z.string().optional().nullable(),
  isMediclaimSecure: z.boolean().default(false),
  isAyushmanBharat: z.boolean().default(false),
  insuranceCompany: z.string().optional().nullable(),
  guardianName: z.string().optional(),
  guardianRelation: z.string().optional(),
  guardianPhone: phoneValidator.optional(),
  guardianEmail: emailValidator.optional(),
})

export const PatientUpdateSchema = PatientCreateSchema.partial()

export const PatientPortalLoginSchema = z.object({
  patientId: z.string().min(1, "Patient ID required"),
  pin: z.string().length(6, "PIN must be 6 digits"),
})

export type PatientCreate = z.infer<typeof PatientCreateSchema>
export type PatientUpdate = z.infer<typeof PatientUpdateSchema>
export type PatientPortalLogin = z.infer<typeof PatientPortalLoginSchema>
