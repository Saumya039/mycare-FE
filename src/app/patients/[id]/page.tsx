"use client"

import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { FileText, Activity, Clock, Pill, Stethoscope, ChevronLeft, Shield, Users, CalendarDays, CheckCircle2 } from "lucide-react"
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
  dischargeEta: string | null
  isMediclaimSecure: boolean
  advanceMoneyTaken: number
  isAyushmanBharat: boolean
  insuranceCompany: string | null
  guardianName: string | null
  guardianRelation: string | null
  guardianPhone: string | null
  guardianEmail: string | null
  error?: string
}

export default function EHRPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const [data, setData] = useState<EHRData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUpdatingEta, setIsUpdatingEta] = useState(false)
  const [newEta, setNewEta] = useState("")
  
  // Next.js 16 requires unwrapping params Promise in Client Components using React.use()
  const { id } = React.use(params)

  const fetchData = () => {
    fetch(`/api/patients/${id}`)
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleUpdateEta = async () => {
    try {
      setIsUpdatingEta(true)
      const res = await fetch(`/api/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dischargeEta: newEta })
      })
      if (res.ok) {
        fetchData()
      } else {
        alert("Failed to update ETA.")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsUpdatingEta(false)
    }
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left Col: Vitals & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-slate-800 pb-2 text-slate-200">
              <Stethoscope className="w-5 h-5 text-cyan-400" /> Medical Profile
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="col-span-2 md:col-span-1">
                <p className="text-sm text-slate-500 mb-1">Current Diagnosis</p>
                <p className="font-medium text-slate-200">{data.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Attending Physician</p>
                <p className="font-medium text-slate-200">{data.doctorName || "Unassigned"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Known Allergies</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.allergies ? data.allergies.split(",").map(a => (
                    <span key={a} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-medium">
                      {a.trim()}
                    </span>
                  )) : (
                    <span className="text-slate-400 text-sm">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-slate-800 pb-2 text-slate-200">
                <Shield className="w-5 h-5 text-emerald-400" /> Insurance & Finance
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${data.isMediclaimSecure ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className="text-sm text-slate-300">Mediclaim Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${data.isAyushmanBharat ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className="text-sm text-slate-300">Ayushman Bharat</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Insurance Provider</p>
                  <p className="text-sm font-medium">{data.insuranceCompany || "Self-Pay / None"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Advance Collected</p>
                  <p className="text-sm font-mono text-emerald-400">₹{data.advanceMoneyTaken.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-slate-800 pb-2 text-slate-200">
                <Users className="w-5 h-5 text-purple-400" /> Guardian Details
              </h2>
              {data.guardianName ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Name & Relation</p>
                    <p className="text-sm font-medium">{data.guardianName} <span className="text-slate-400 font-normal">({data.guardianRelation || "Unknown"})</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Contact Phone</p>
                    <p className="text-sm font-mono">{data.guardianPhone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <p className="text-sm">{data.guardianEmail || "N/A"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No guardian information provided.</p>
              )}
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
            <h3 className="font-semibold mb-4 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-blue-400" /> Discharge ETA</span>
            </h3>
            {data.dischargeEta ? (
              <div className="mb-4">
                <p className="text-2xl font-bold text-slate-100">{new Date(data.dischargeEta).toLocaleDateString()}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {Math.ceil((new Date(data.dischargeEta).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days remaining
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 mb-4">No discharge ETA set by doctor.</p>
            )}
            
            {(session.user.role === "ADMIN" || session.user.role === "DOCTOR") && (
              <div className="flex gap-2">
                <input 
                  type="date" 
                  value={newEta}
                  onChange={(e) => setNewEta(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" 
                />
                <button 
                  onClick={handleUpdateEta}
                  disabled={isUpdatingEta || !newEta}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {isUpdatingEta ? "..." : "Update"}
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" /> History & Appointments
            </h3>
            {data.appointments.length === 0 ? (
              <p className="text-slate-500 text-sm">No past or upcoming appointments.</p>
            ) : (
              <div className="space-y-3">
                {data.appointments.map((apt: any) => (
                  <div key={apt.id} className="text-sm border-l-2 border-purple-500/50 pl-3 py-1 relative group">
                    <p className="font-medium text-slate-300 flex justify-between">
                      {new Date(apt.date).toLocaleDateString()}
                      {apt.isFollowUp && <span className="bg-purple-500/20 text-purple-300 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">Follow-up</span>}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">{apt.reason} • Dr. {apt.doctor?.name}</p>
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
