"use client"

import { useSession } from "@/context/NativeAuthContext"
import { AdminDashboard } from "@/components/dashboards/AdminDashboard"
import { DoctorDashboard } from "@/components/dashboards/DoctorDashboard"
import { NurseDashboard } from "@/components/dashboards/NurseDashboard"
import { ReceptionistDashboard } from "@/components/dashboards/ReceptionistDashboard"
import { AccountantDashboard } from "@/components/dashboards/AccountantDashboard"
import { PharmacistDashboard } from "@/components/dashboards/PharmacistDashboard"
import { LabDashboard } from "@/components/dashboards/LabDashboard"

export default function DashboardRouterPage() {
  const { data: session } = useSession()

  if (!session) return null
  const { role, name } = session.user

  // Route to the correct dashboard based on role
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return <AdminDashboard />
    
    case "DOCTOR":
      return <DoctorDashboard userName={name || "Doctor"} />
    
    case "NURSE":
      return <NurseDashboard userName={name || "Nurse"} />
    
    case "RECEPTIONIST":
      return <ReceptionistDashboard userName={name || "Receptionist"} />
      
    case "ACCOUNTANT":
      return <AccountantDashboard userName={name || "Accountant"} />
      
    case "PHARMACIST":
      return <PharmacistDashboard userName={name || "Pharmacist"} />
      
    case "PATHOLOGIST":
    case "RADIOLOGIST":
      return <LabDashboard userName={name || "Specialist"} role={role} />
      
    default:
      // Fallback for unknown roles
      return <AdminDashboard />
  }
}
