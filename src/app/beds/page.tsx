"use client"

import { useSession } from "@/context/SupabaseAuthContext"
import { useEffect, useState } from "react"
import { BedDouble, UserPlus, LogOut, CheckCircle2 } from "lucide-react"

type Patient = {
 name: string
 patientId: string
 status: string
 diagnosis: string
}

type Bed = {
 id: string
 label: string
 departmentName: string
 floor: number
 wing: string
 status: string
 patient: Patient | null
}

export default function BedsPage() {
 const { data: session } = useSession()
 const [beds, setBeds] = useState<Bed[]>([])
 const [loading, setLoading] = useState(true)

 const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
 const [selectedBed, setSelectedBed] = useState<string | null>(null)
 const [patientInput, setPatientInput] = useState("")

 const fetchBeds = () => {
 fetch("/api/beds")
 .then((res) => res.json())
 .then((data) => {
 if (Array.isArray(data)) setBeds(data)
 setLoading(false)
 })
 }

 useEffect(() => {
 fetchBeds()
 }, [])

 const handleAssign = async (e: React.FormEvent) => {
 e.preventDefault()
 if (!selectedBed || !patientInput.trim()) return

 try {
 const res = await fetch("/api/beds/assign", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ action: "assign", bedId: selectedBed, patientId: patientInput })
 })
 const data = await res.json()
 if (data.error) {
 alert(data.error)
 } else {
 setIsAssignModalOpen(false)
 setPatientInput("")
 fetchBeds()
 }
 } catch (err) {
 alert("Failed to assign bed")
 }
 }

 const handleRelease = async (bedId: string) => {
 if (!confirm("Are you sure you want to release this bed?")) return
 
 await fetch("/api/beds/assign", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ action: "release", bedId })
 })
 fetchBeds()
 }

 if (!session) return null

 // Group by department
 const depts = Array.from(new Set(beds.map(b => b.departmentName)))

 return (
 <div className="p-8 h-full bg-slate-50 text-slate-900 overflow-y-auto">
 <div className="mb-8">
 <h1 className="text-2xl font-bold">Bed Management Map</h1>
 <p className="text-slate-500">Live overview of hospital capacity and patient locations</p>
 </div>

 {loading ? (
 <div className="text-slate-500">Loading bed map...</div>
 ) : (
 <div className="space-y-8">
 {depts.map(dept => {
 const deptBeds = beds.filter(b => b.departmentName === dept)
 return (
 <div key={dept} className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-6">
 <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-cyan-400 border-b border-slate-200 pb-4">
 {dept} Ward
 <span className="text-xs font-normal bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
 {deptBeds.filter(b => b.status === "available").length} Available
 </span>
 </h2>
 
 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
 {deptBeds.map(bed => (
 <div 
 key={bed.id} 
 className={`relative rounded-xl p-4 border transition-all ${
 bed.status === 'available' ? 'bg-slate-50 border-emerald-500/20 hover:border-emerald-500/50' :
 'bg-slate-100/80 border-slate-300'
 }`}
 >
 <div className="flex justify-between items-start mb-3">
 <span className="text-xs font-mono font-bold text-slate-700">{bed.label}</span>
 <BedDouble className={`w-5 h-5 ${bed.status === 'available' ? 'text-emerald-500' : 'text-slate-500'}`} />
 </div>
 
 {bed.status === 'occupied' && bed.patient ? (
 <div>
 <p className="text-sm font-semibold truncate text-slate-800">{bed.patient.name}</p>
 <p className="text-xs text-slate-500 truncate">{bed.patient.patientId}</p>
 
 {(["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["NURSE", "SUPER_ADMIN"].includes(session.user.role)) && (
 <button 
 onClick={() => handleRelease(bed.id)}
 className="mt-3 w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
 >
 <LogOut className="w-3 h-3" /> Release
 </button>
 )}
 </div>
 ) : (
 <div>
 <p className="text-xs text-emerald-400 font-medium">Available</p>
 {(["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["NURSE", "SUPER_ADMIN"].includes(session.user.role)) && (
 <button 
 onClick={() => {
 setSelectedBed(bed.id)
 setIsAssignModalOpen(true)
 }}
 className="mt-3 w-full bg-slate-100 hover:bg-slate-700 text-slate-700 text-xs py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
 >
 <UserPlus className="w-3 h-3" /> Assign
 </button>
 )}
 </div>
 )}
 </div>
 ))}
 </div>
 </div>
 )
 })}
 </div>
 )}

 {/* ASSIGN BED MODAL */}
 {isAssignModalOpen && (
 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
 <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
 <h3 className="font-semibold text-lg flex items-center gap-2">
 <BedDouble className="w-5 h-5 text-cyan-400" /> Assign Patient to Bed
 </h3>
 <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-500 hover:text-slate-800 transition-colors">
 ✕
 </button>
 </div>
 <form onSubmit={handleAssign} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Patient ID</label>
 <input 
 type="text" 
 required
 placeholder="e.g. P-1001"
 value={patientInput}
 onChange={(e) => setPatientInput(e.target.value)}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:border-cyan-500 transition-colors"
 />
 <p className="text-xs text-slate-500 mt-2">Enter the ID of an unassigned patient to place them in this bed.</p>
 </div>
 
 <div className="pt-4 border-t border-slate-200 flex gap-3">
 <button type="button" onClick={() => setIsAssignModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors">
 Cancel
 </button>
 <button type="submit" className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-medium transition-colors">
 Assign Bed
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 )
}
