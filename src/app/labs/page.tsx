"use client"

import { useSession } from "@/context/FirebaseAuthContext"
import { useEffect, useState } from "react"
import { FlaskConical, Search, Plus, Loader2, CheckCircle2 } from "lucide-react"

export default function LabsPage() {
 const { data: session } = useSession()
 const [labs, setLabs] = useState<any[]>([])
 const [patients, setPatients] = useState<any[]>([])
 const [loading, setLoading] = useState(true)

 const [isModalOpen, setIsModalOpen] = useState(false)
 const [isSubmitting, setIsSubmitting] = useState(false)
 const [form, setForm] = useState({ patientId: "", testName: "" })

 const [activeResultId, setActiveResultId] = useState<string | null>(null)
 const [resultText, setResultText] = useState("")

 const fetchData = async () => {
 setLoading(true)
 try {
 const [labRes, patRes] = await Promise.all([fetch("/api/labs"), fetch("/api/patients")])
 if (labRes.ok) setLabs(await labRes.json())
 if (patRes.ok) setPatients(await patRes.json())
 } catch (e) {
 console.error(e)
 } finally {
 setLoading(false)
 }
 }

 useEffect(() => {
 fetchData()
 }, [])

 const handleOrderTest = async (e: React.FormEvent) => {
 e.preventDefault()
 setIsSubmitting(true)
 try {
 const res = await fetch("/api/labs", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(form)
 })
 if (res.ok) {
 setIsModalOpen(false)
 setForm({ patientId: "", testName: "" })
 fetchData()
 }
 } catch (error) {
 console.error(error)
 } finally {
 setIsSubmitting(false)
 }
 }

 const handleUpdateResult = async (id: string) => {
 try {
 await fetch(`/api/labs/${id}`, {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ status: "completed", resultText })
 })
 setActiveResultId(null)
 setResultText("")
 fetchData()
 } catch (e) {
 console.error(e)
 }
 }

 if (!session) return null

 return (
 <div className="p-8 h-full bg-slate-50 text-slate-900 overflow-y-auto">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h1 className="text-2xl font-bold flex items-center gap-3">
 <FlaskConical className="w-8 h-8 text-cyan-400" /> Labs & Diagnostics
 </h1>
 <p className="text-slate-500">Order tests and track pathology results</p>
 </div>

 {(["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["DOCTOR", "SUPER_ADMIN"].includes(session.user.role)) && (
 <button 
 onClick={() => setIsModalOpen(true)}
 className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-medium"
 >
 <Plus className="w-5 h-5" /> Order Test
 </button>
 )}
 </div>

 <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
 <div className="p-4 border-b border-slate-200 bg-white">
 <div className="relative w-72">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
 <input 
 type="text" 
 placeholder="Search tests..." 
 className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
 />
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-200 bg-slate-100 text-slate-500 text-sm">
 <th className="p-4 font-medium">Test Name</th>
 <th className="p-4 font-medium">Patient</th>
 <th className="p-4 font-medium">Date Ordered</th>
 <th className="p-4 font-medium">Status</th>
 <th className="p-4 font-medium">Results</th>
 <th className="p-4 font-medium text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200">
 {loading ? (
 <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading labs...</td></tr>
 ) : labs.length === 0 ? (
 <tr><td colSpan={6} className="p-8 text-center text-slate-500">No tests ordered.</td></tr>
 ) : (
 labs.map(lab => (
 <tr key={lab.id} className="hover:bg-slate-50 transition-colors">
 <td className="p-4 font-medium text-slate-800">{lab.testName}</td>
 <td className="p-4">
 <p className="font-medium text-slate-800">{lab.patient?.name}</p>
 <p className="text-xs text-slate-500">{lab.patient?.patientId}</p>
 </td>
 <td className="p-4 text-sm text-slate-700">{new Date(lab.createdAt).toLocaleDateString()}</td>
 <td className="p-4">
 <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
 ${lab.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
 {lab.status.toUpperCase()}
 </span>
 </td>
 <td className="p-4 text-sm text-slate-500 max-w-xs truncate">
 {lab.resultText || "—"}
 </td>
 <td className="p-4 text-right">
 {lab.status === "pending" && (["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["NURSE", "SUPER_ADMIN"].includes(session.user.role)) && (
 activeResultId === lab.id ? (
 <div className="flex items-center gap-2 justify-end">
 <input 
 type="text" 
 value={resultText}
 onChange={e => setResultText(e.target.value)}
 className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:border-cyan-500"
 placeholder="Enter results..."
 />
 <button onClick={() => handleUpdateResult(lab.id)} className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 p-1 rounded transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
 </div>
 ) : (
 <button 
 onClick={() => setActiveResultId(lab.id)}
 className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
 >
 Upload Result
 </button>
 )
 )}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {isModalOpen && (
 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
 <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
 <h3 className="font-semibold text-lg flex items-center gap-2">
 <FlaskConical className="w-5 h-5 text-cyan-400" /> Order Lab Test
 </h3>
 <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800 transition-colors">✕</button>
 </div>
 <form onSubmit={handleOrderTest} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Select Patient</label>
 <select 
 required 
 value={form.patientId} 
 onChange={(e) => setForm({...form, patientId: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
 >
 <option value="">Select a patient...</option>
 {patients.map(p => (
 <option key={p.id} value={p.patientId}>{p.name} ({p.patientId})</option>
 ))}
 </select>
 </div>
 
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Test Name</label>
 <input 
 type="text" required placeholder="e.g. Complete Blood Count (CBC)"
 value={form.testName} onChange={(e) => setForm({...form, testName: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
 />
 </div>
 
 <div className="pt-4 border-t border-slate-200 flex gap-3">
 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors">Cancel</button>
 <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
 {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Order Test"}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 )
}
