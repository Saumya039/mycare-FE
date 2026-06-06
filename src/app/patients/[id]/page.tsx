"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { FileText, Activity, Clock, Pill, Stethoscope, ChevronLeft } from "lucide-react"
import Link from "next/link"

type EHRData = {
  patientId: string
  name: string
  age: number
  gender: string
  diagnosis: string
  status: string
  departmentName: string
  doctorName: string
  allergies: string | null
  appointments: any[]
  prescriptions: any[]
}

export default function EHRPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [data, setData] = useState<EHRData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/patients/${params.id}`)
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
  }, [params.id])

  if (!session) return null
  if (loading) return <div className="p-8 text-cyan-400">Loading Electronic Health Record...</div>
  if (!data || data.error) return <div className="p-8 text-red-400">Patient not found.</div>

  return (
    <div className="p-8 h-full bg-slate-950 text-slate-100 overflow-y-auto">
      <Link href="/patients" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Directory
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {data.name}
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">{data.patientId}</span> • {data.age} y/o {data.gender} • {data.departmentName}
          </p>
        </div>

        {session.user.role === "DOCTOR" && (
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-medium flex items-center gap-2">
            <Pill className="w-5 h-5" /> New Prescription
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Vitals & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-slate-800 pb-2 text-slate-200">
              <Stethoscope className="w-5 h-5 text-cyan-400" /> Medical Profile
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Current Diagnosis</p>
                <p className="font-medium text-slate-200">{data.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Attending Physician</p>
                <p className="font-medium text-slate-200">{data.doctorName || "Unassigned"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-500 mb-1">Known Allergies</p>
                <div className="flex gap-2 mt-1">
                  {data.allergies ? data.allergies.split(",").map(a => (
                    <span key={a} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-medium">
                      {a.trim()}
                    </span>
                  )) : (
                    <span className="text-slate-400 text-sm">No known allergies.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-slate-800 pb-2 text-slate-200">
              <FileText className="w-5 h-5 text-cyan-400" /> Active Prescriptions
            </h2>
            {data.prescriptions.length === 0 ? (
              <p className="text-slate-500 text-sm">No active prescriptions.</p>
            ) : (
              <div className="space-y-4">
                {data.prescriptions.map((px: any) => (
                  <div key={px.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-200">{px.medicationName} <span className="text-slate-400 font-normal ml-1">({px.dosage})</span></p>
                      <p className="text-xs text-slate-500 mt-1">Prescribed by {px.doctor.name} • {px.frequency} for {px.duration}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {px.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Appointments & Status */}
        <div className="space-y-6">
          <div className={`backdrop-blur-md border rounded-2xl p-6 ${data.status === 'critical' ? 'bg-red-500/5 border-red-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
            <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider mb-2">Current Status</h3>
            <div className={`text-2xl font-bold capitalize flex items-center gap-2 ${data.status === 'critical' ? 'text-red-400' : 'text-emerald-400'}`}>
              <Activity className="w-6 h-6" /> {data.status}
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" /> History
            </h3>
            {data.appointments.length === 0 ? (
              <p className="text-slate-500 text-sm">No past or upcoming appointments.</p>
            ) : (
              <div className="space-y-3">
                {data.appointments.map((apt: any) => (
                  <div key={apt.id} className="text-sm border-l-2 border-purple-500/50 pl-3 py-1">
                    <p className="font-medium text-slate-300">{new Date(apt.date).toLocaleDateString()}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{apt.reason} • {apt.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
