"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, LogOut, Activity, CalendarDays, Pill, FileText, FlaskConical, Stethoscope } from "lucide-react"

export default function PortalDashboard() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const pid = localStorage.getItem("portal_patient_id")
    if (!pid) {
      router.push("/portal/login")
      return
    }

    fetch(`/api/patients/portal?patientId=${pid}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(() => {
        localStorage.removeItem("portal_patient_id")
        router.push("/portal/login")
      })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("portal_patient_id")
    router.push("/portal/login")
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">Loading your records...</div>
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-cyan-500" />
          <div>
            <h1 className="text-xl font-bold text-white">Patient Portal</h1>
            <p className="text-xs text-slate-400">Sevra Technologies Serva AI</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <h2 className="text-3xl font-bold text-white mb-2">Hello, {data.name}</h2>
          <p className="text-slate-300">
            Welcome to your personal health dashboard. Below you will find your current admission details, prescriptions, and scheduled appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Status & ETA */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-400 uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Admission Status
            </h3>
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-1">Current Status</p>
              <p className={`text-xl font-bold capitalize ${data.status === 'critical' ? 'text-red-400' : 'text-emerald-400'}`}>
                {data.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Expected Discharge</p>
              {data.dischargeEta ? (
                <p className="text-xl font-bold text-slate-200">
                  {new Date(data.dischargeEta).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-sm text-slate-400">Not set yet</p>
              )}
            </div>
          </div>

          {/* Medical Profile */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:col-span-2">
            <h3 className="font-semibold text-slate-400 uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" /> Medical Profile
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Diagnosis</p>
                <p className="font-medium text-slate-200">{data.diagnosis || "Pending Evaluation"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Attending Physician</p>
                <p className="font-medium text-slate-200">{data.doctorName || "Unassigned"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Department</p>
                <p className="font-medium text-slate-200">{data.departmentName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Allergies</p>
                <p className="font-medium text-red-400">{data.allergies || "None reported"}</p>
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prescriptions */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-400 uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
              <Pill className="w-4 h-4 text-cyan-400" /> Active Prescriptions
            </h3>
            {data.prescriptions.length === 0 ? (
              <p className="text-slate-500 text-sm">No prescriptions currently assigned.</p>
            ) : (
              <div className="space-y-4">
                {data.prescriptions.map((px: any) => (
                  <div key={px.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <p className="font-bold text-slate-200">{px.medicationName} <span className="text-slate-400 font-normal ml-1">({px.dosage})</span></p>
                    <p className="text-sm text-slate-400 mt-1">{px.frequency} for {px.duration}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointments & Tests */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-400 uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-purple-400" /> Appointments
              </h3>
              {data.appointments.length === 0 ? (
                <p className="text-slate-500 text-sm">No upcoming appointments.</p>
              ) : (
                <div className="space-y-4">
                  {data.appointments.map((apt: any) => (
                    <div key={apt.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                      <p className="font-bold text-slate-200">{new Date(apt.date).toLocaleDateString()}</p>
                      <p className="text-sm text-slate-400 mt-1">{apt.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-400 uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" /> Lab Results
              </h3>
              {data.labTests.length === 0 ? (
                <p className="text-slate-500 text-sm">No lab tests ordered.</p>
              ) : (
                <div className="space-y-4">
                  {data.labTests.map((lab: any) => (
                    <div key={lab.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-slate-200">{lab.testName}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold ${lab.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {lab.status}
                        </span>
                      </div>
                      {lab.status === "completed" && (
                        <p className="text-sm text-slate-300 mt-2 p-2 bg-slate-900 rounded border border-slate-800">
                          {lab.resultText}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
