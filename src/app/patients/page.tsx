"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Activity, Plus, Search, User as UserIcon, X, Loader2 } from "lucide-react"
import Link from "next/link"

type Patient = {
  id: string
  patientId: string
  name: string
  age: number
  gender: string
  diagnosis: string
  status: string
  departmentName: string
}

export default function PatientsPage() {
  const { data: session } = useSession()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    departmentName: "Emergency",
    diagnosis: "",
    status: "monitoring"
  })

  const fetchPatients = () => {
    setLoading(true)
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPatients(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          doctorName: session?.user.name
        })
      })

      if (res.ok) {
        setIsModalOpen(false)
        setFormData({ name: "", age: "", gender: "Male", departmentName: "Emergency", diagnosis: "", status: "monitoring" })
        fetchPatients()
      } else {
        alert("Failed to admit patient. Ensure you have the correct permissions.")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) return null

  return (
    <div className="p-8 h-full bg-slate-950 text-slate-100 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Patient Directory</h1>
          <p className="text-slate-400">Manage hospital admissions and patient records</p>
        </div>

        {(session.user.role === "ADMIN" || session.user.role === "DOCTOR") && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
          >
            <Plus className="w-5 h-5" />
            Admit Patient
          </button>
        )}
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-sm">
                <th className="p-4 font-medium">Patient</th>
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Diagnosis</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading patients...</td></tr>
              ) : patients.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No patients currently admitted.</td></tr>
              ) : (
                patients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.age} yrs • {p.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 text-sm font-mono">{p.patientId}</td>
                    <td className="p-4 text-sm">{p.diagnosis}</td>
                    <td className="p-4 text-sm text-slate-400">{p.departmentName || "Unassigned"}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                        ${p.status === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          p.status === 'stable' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">View Detail</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admit Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
              <h3 className="text-lg font-semibold">Admit New Patient</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Age</label>
                  <input required type="number" min="0" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none text-slate-100">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Department</label>
                  <select value={formData.departmentName} onChange={e => setFormData({...formData, departmentName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none text-slate-100">
                    <option>Emergency</option>
                    <option>ICU</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>Pediatrics</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-1">Primary Diagnosis</label>
                <input required type="text" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none" placeholder="e.g. Acute Myocardial Infarction" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-1">Initial Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none text-slate-100">
                  <option value="monitoring">Monitoring (Standard)</option>
                  <option value="stable">Stable</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Admit Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
