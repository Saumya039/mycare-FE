"use client"

import { useSession } from "@/context/NativeAuthContext"
import React, { useEffect, useState } from "react"
import { FileText, Activity, Clock, Pill, Stethoscope, ChevronLeft, Shield, Users, CalendarDays, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

const COMMON_MEDICATIONS = [
 "Amoxicillin", "Azithromycin", "Paracetamol", "Ibuprofen", 
 "Omeprazole", "Metformin", "Atorvastatin", "Losartan", 
 "Amlodipine", "Levothyroxine", "Lisinopril", "Albuterol",
 "Pantoprazole", "Gabapentin", "Sertraline", "Fluticasone",
 "Ciprofloxacin", "Cephalexin", "Prednisone", "Montelukast",
 "Aspirin", "Clopidogrel", "Hydrochlorothiazide", "Doxycycline"
]

export default function EHRPage({ params }: { params: Promise<{ id: string }> }) {
 const { data: session } = useSession()
 const router = useRouter()
 const [data, setData] = useState<EHRData | null>(null)
 const [loading, setLoading] = useState(true)
 const [isUpdatingEta, setIsUpdatingEta] = useState(false)
 const [newEta, setNewEta] = useState("")

 const [isPxModalOpen, setIsPxModalOpen] = useState(false)
 const [isSubmittingPx, setIsSubmittingPx] = useState(false)
 const [pxForm, setPxForm] = useState({ medicationName: "", dosage: "", frequency: "", duration: "" })
 const [showSuggestions, setShowSuggestions] = useState(false)
 
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

 const handleAddPx = async (e: React.FormEvent) => {
 e.preventDefault()
 setIsSubmittingPx(true)
 try {
 const res = await fetch("/api/prescriptions", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ ...pxForm, patientId: data?.patientId })
 })
 if (res.ok) {
 setIsPxModalOpen(false)
 setPxForm({ medicationName: "", dosage: "", frequency: "", duration: "" })
 fetchData()
 } else {
 const err = await res.json()
 alert(err.error || "Failed to add prescription")
 }
 } catch (err) {
 console.error(err)
 } finally {
 setIsSubmittingPx(false)
 }
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
 <div className="p-8 h-full bg-slate-50 text-slate-900 overflow-y-auto">
 <Link href="/patients" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium mb-6">
 <ChevronLeft className="w-4 h-4" /> Back to Directory
 </Link>

 <div className="flex items-center justify-between mb-8">
 <div>
 <h1 className="text-3xl font-bold flex items-center gap-3">
 {data.name}
 </h1>
 <p className="text-slate-500 mt-1 flex items-center gap-2">
 <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{data.patientId}</span> • {data.age} y/o {data.gender} • {data.departmentName}
 </p>
 </div>

 {["DOCTOR", "SUPER_ADMIN"].includes(session.user.role) && (
 <div className="flex items-center gap-3">
 <button 
 onClick={() => router.push('/labs')}
 className="bg-slate-100 hover:bg-slate-700 border border-slate-300 text-slate-800 px-5 py-2.5 rounded-xl transition-all font-medium flex items-center gap-2"
 >
 Order Lab Test
 </button>
 <button 
 onClick={() => setIsPxModalOpen(true)}
 className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-medium flex items-center gap-2"
 >
 <Pill className="w-5 h-5" /> New Prescription
 </button>
 </div>
 )}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
 
 {/* Left Col: Vitals & History */}
 <div className="lg:col-span-2 space-y-6">
 <div className="bg-white border border-slate-200 rounded-2xl p-6">
 <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-slate-200 pb-2 text-slate-800">
 <Stethoscope className="w-5 h-5 text-cyan-400" /> Medical Profile
 </h2>
 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
 <div className="col-span-2 md:col-span-1">
 <p className="text-sm text-slate-500 mb-1">Current Diagnosis</p>
 <p className="font-medium text-slate-800">{data.diagnosis}</p>
 </div>
 <div>
 <p className="text-sm text-slate-500 mb-1">Attending Physician</p>
 <p className="font-medium text-slate-800">{data.doctorName || "Unassigned"}</p>
 </div>
 <div>
 <p className="text-sm text-slate-500 mb-1">Known Allergies</p>
 <div className="flex flex-wrap gap-2 mt-1">
 {data.allergies ? data.allergies.split(",").map(a => (
 <span key={a} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-medium">
 {a.trim()}
 </span>
 )) : (
 <span className="text-slate-500 text-sm">None</span>
 )}
 </div>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="bg-white border border-slate-200 rounded-2xl p-6">
 <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-slate-200 pb-2 text-slate-800">
 <Shield className="w-5 h-5 text-emerald-400" /> Insurance & Finance
 </h2>
 <div className="space-y-4">
 <div className="flex items-center gap-2">
 <CheckCircle2 className={`w-4 h-4 ${data.isMediclaimSecure ? 'text-emerald-400' : 'text-slate-600'}`} />
 <span className="text-sm text-slate-700">Mediclaim Secure</span>
 </div>
 <div className="flex items-center gap-2">
 <CheckCircle2 className={`w-4 h-4 ${data.isAyushmanBharat ? 'text-emerald-400' : 'text-slate-600'}`} />
 <span className="text-sm text-slate-700">Ayushman Bharat</span>
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

 <div className="bg-white border border-slate-200 rounded-2xl p-6">
 <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-slate-200 pb-2 text-slate-800">
 <Users className="w-5 h-5 text-purple-400" /> Guardian Details
 </h2>
 {data.guardianName ? (
 <div className="space-y-4">
 <div>
 <p className="text-xs text-slate-500 mb-1">Name & Relation</p>
 <p className="text-sm font-medium">{data.guardianName} <span className="text-slate-500 font-normal">({data.guardianRelation || "Unknown"})</span></p>
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

 <div className="bg-white border border-slate-200 rounded-2xl p-6">
 <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-slate-200 pb-2 text-slate-800">
 <FileText className="w-5 h-5 text-cyan-400" /> Active Prescriptions
 </h2>
 {data.prescriptions.length === 0 ? (
 <p className="text-slate-500 text-sm">No active prescriptions.</p>
 ) : (
 <div className="space-y-4">
 {data.prescriptions.map((px: any) => (
 <div key={px.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
 <div>
 <p className="font-semibold text-slate-800">{px.medicationName} <span className="text-slate-500 font-normal ml-1">({px.dosage})</span></p>
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
 <div className={` border rounded-2xl p-6 ${data.status === 'critical' ? 'bg-red-500/5 border-red-500/30' : 'bg-white border-slate-200'}`}>
 <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-2">Current Status</h3>
 <div className={`text-2xl font-bold capitalize flex items-center gap-2 ${data.status === 'critical' ? 'text-red-400' : 'text-emerald-400'}`}>
 <Activity className="w-6 h-6" /> {data.status}
 </div>
 </div>

 <div className="bg-white border border-slate-200 rounded-2xl p-6">
 <h3 className="font-semibold mb-4 border-b border-slate-200 pb-2 flex items-center justify-between">
 <span className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-blue-400" /> Discharge ETA</span>
 </h3>
 {data.dischargeEta ? (
 <div className="mb-4">
 <p className="text-2xl font-bold text-slate-900">{new Date(data.dischargeEta).toLocaleDateString()}</p>
 <p className="text-xs text-slate-500 mt-1">
 {Math.ceil((new Date(data.dischargeEta).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days remaining
 </p>
 </div>
 ) : (
 <p className="text-sm text-slate-500 mb-4">No discharge ETA set by doctor.</p>
 )}
 
 {(["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["DOCTOR", "SUPER_ADMIN"].includes(session.user.role)) && (
 <div className="flex gap-2">
 <input 
 type="date" 
 value={newEta}
 onChange={(e) => setNewEta(e.target.value)}
 className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" 
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

 <div className="bg-white border border-slate-200 rounded-2xl p-6">
 <h3 className="font-semibold mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
 <Clock className="w-5 h-5 text-purple-400" /> History & Appointments
 </h3>
 {data.appointments.length === 0 ? (
 <p className="text-slate-500 text-sm">No past or upcoming appointments.</p>
 ) : (
 <div className="space-y-3">
 {data.appointments.map((apt: any) => (
 <div key={apt.id} className="text-sm border-l-2 border-purple-500/50 pl-3 py-1 relative group">
 <p className="font-medium text-slate-700 flex justify-between">
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

 {/* NEW PRESCRIPTION MODAL */}
 {isPxModalOpen && (
 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
 <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
 <h3 className="font-semibold text-lg flex items-center gap-2">
 <Pill className="w-5 h-5 text-cyan-400" /> New Prescription
 </h3>
 <button onClick={() => setIsPxModalOpen(false)} className="text-slate-500 hover:text-slate-800 transition-colors">✕</button>
 </div>
 <form onSubmit={handleAddPx} className="p-6 space-y-4">
 <div className="relative">
 <label className="block text-sm font-medium text-slate-500 mb-1">Medication Name (AI Assist)</label>
 <input 
 type="text" required placeholder="Type to search e.g. Amo..."
 value={pxForm.medicationName} 
 onChange={(e) => {
 setPxForm({...pxForm, medicationName: e.target.value})
 setShowSuggestions(true)
 }}
 onFocus={() => setShowSuggestions(true)}
 onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
 />
 {showSuggestions && pxForm.medicationName.length > 0 && (
 <div className="absolute z-10 w-full mt-1 bg-slate-100 border border-slate-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
 {COMMON_MEDICATIONS.filter(m => m.toLowerCase().includes(pxForm.medicationName.toLowerCase())).length > 0 ? (
 COMMON_MEDICATIONS.filter(m => m.toLowerCase().includes(pxForm.medicationName.toLowerCase())).map(med => (
 <div 
 key={med}
 onClick={() => {
 setPxForm({...pxForm, medicationName: med});
 setShowSuggestions(false);
 }}
 className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-slate-800 text-sm"
 >
 {med}
 </div>
 ))
 ) : (
 <div className="px-4 py-2 text-slate-500 text-sm italic">No AI suggestions found</div>
 )}
 </div>
 )}
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Dosage</label>
 <input 
 type="text" required placeholder="e.g. 500mg"
 value={pxForm.dosage} onChange={(e) => setPxForm({...pxForm, dosage: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Frequency</label>
 <input 
 type="text" required placeholder="e.g. 2x a day"
 value={pxForm.frequency} onChange={(e) => setPxForm({...pxForm, frequency: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
 />
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Duration</label>
 <input 
 type="text" required placeholder="e.g. 7 days"
 value={pxForm.duration} onChange={(e) => setPxForm({...pxForm, duration: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
 />
 </div>
 
 <div className="pt-4 border-t border-slate-200 flex gap-3">
 <button type="button" onClick={() => setIsPxModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors">Cancel</button>
 <button type="submit" disabled={isSubmittingPx} className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">Issue Prescription</button>
 </div>
 </form>
 </div>
 </div>
 )}

 </div>
 )
}
