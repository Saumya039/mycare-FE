import { z } from "zod"
import { dateValidator, appointmentStatusValidator } from "./common"

export const AppointmentCreateSchema = z.object({
  patientId: z.string().cuid("Invalid patient ID"),
  doctorId: z.string().cuid("Invalid doctor ID"),
  scheduledAt: dateValidator.refine((date) => date > new Date(), "Appointment must be in future"),
  reason: z.string().min(5, "Reason must be at least 5 characters").max(500),
  notes: z.string().optional().nullable(),
  type: z.enum(["CONSULTATION", "FOLLOW_UP", "ROUTINE_CHECKUP"]).default("CONSULTATION"),
})

export const AppointmentUpdateSchema = AppointmentCreateSchema.partial().extend({
  status: appointmentStatusValidator.optional(),
})

export type AppointmentCreate = z.infer<typeof AppointmentCreateSchema>
export type AppointmentUpdate = z.infer<typeof AppointmentUpdateSchema>
