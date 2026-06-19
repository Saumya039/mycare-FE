"use client"

import { useSession } from "@/context/NativeAuthContext"
import { useEffect, useState } from "react"
import { FileText, Plus, Search, IndianRupee, CheckCircle2, Clock, X, Loader2 } from "lucide-react"

export default function BillingPage() {
 const { data: session } = useSession()
 const [invoices, setInvoices] = useState<any[]>([])
 const [patients, setPatients] = useState<any[]>([])
 const [loading, setLoading] = useState(true)

 const [isModalOpen, setIsModalOpen] = useState(false)
 const [isSubmitting, setIsSubmitting] = useState(false)
 
 const [form, setForm] = useState({
 patientId: "",
 totalAmount: "",
 dueDate: "",
 insuranceClaimStatus: "none"
 })

 const fetchData = async () => {
 setLoading(true)
 try {
 const [invRes, patRes] = await Promise.all([
 fetch("/api/invoices"),
 fetch("/api/patients")
 ])
 if (invRes.ok) setInvoices(await invRes.json())
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

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setIsSubmitting(true)

 try {
 const res = await fetch("/api/invoices", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(form)
 })

 if (res.ok) {
 setIsModalOpen(false)
 setForm({ patientId: "", totalAmount: "", dueDate: "", insuranceClaimStatus: "none" })
 fetchData()
 } else {
 alert("Failed to create invoice")
 }
 } catch (error) {
 console.error(error)
 } finally {
 setIsSubmitting(false)
 }
 }

 const handleUpdateStatus = async (id: string, newStatus: string) => {
 try {
 await fetch(`/api/invoices/${id}`, {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ status: newStatus })
 })
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
 <FileText className="w-8 h-8 text-cyan-400" /> Billing & Invoicing
 </h1>
 <p className="text-slate-500">Generate patient invoices and track payments</p>
 </div>

 {["ADMIN", "SUPER_ADMIN"].includes(session.user.role) && (
 <button 
 onClick={() => setIsModalOpen(true)}
 className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all font-medium"
 >
 <Plus className="w-5 h-5" /> Generate Invoice
 </button>
 )}
 </div>

 <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
 <div className="p-4 border-b border-slate-200 bg-white">
 <div className="relative w-72">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
 <input 
 type="text" 
 placeholder="Search invoices..." 
 className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
 />
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-200 bg-slate-100 text-slate-500 text-sm">
 <th className="p-4 font-medium">Invoice ID</th>
 <th className="p-4 font-medium">Patient</th>
 <th className="p-4 font-medium">Amount</th>
 <th className="p-4 font-medium">Insurance</th>
 <th className="p-4 font-medium">Due Date</th>
 <th className="p-4 font-medium">Status</th>
 {["ADMIN", "SUPER_ADMIN"].includes(session.user.role) && <th className="p-4 font-medium text-right">Actions</th>}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200">
 {loading ? (
 <tr><td colSpan={7} className="p-8 text-center text-slate-500">Loading invoices...</td></tr>
 ) : invoices.length === 0 ? (
 <tr><td colSpan={7} className="p-8 text-center text-slate-500">No invoices generated yet.</td></tr>
 ) : (
 invoices.map(inv => (
 <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
 <td className="p-4 font-mono text-sm text-slate-500">{inv.id.substring(0, 8).toUpperCase()}</td>
 <td className="p-4">
 <p className="font-medium text-slate-800">{inv.patient?.name}</p>
 <p className="text-xs text-slate-500">{inv.patient?.patientId}</p>
 </td>
 <td className="p-4 font-mono font-bold text-emerald-400 flex items-center gap-1 mt-2">
 <IndianRupee className="w-4 h-4" /> {inv.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
 </td>
 <td className="p-4 text-sm text-slate-500 capitalize">{inv.insuranceClaimStatus}</td>
 <td className="p-4 text-sm text-slate-700">{new Date(inv.dueDate).toLocaleDateString()}</td>
 <td className="p-4">
 <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit
 ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
 inv.status === 'overdue' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
 {inv.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
 {inv.status.toUpperCase()}
 </span>
 </td>
 {["ADMIN", "SUPER_ADMIN"].includes(session.user.role) && (
 <td className="p-4 text-right">
 {inv.status !== "paid" && (
 <button 
 onClick={() => handleUpdateStatus(inv.id, "paid")}
 className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
 >
 Mark Paid
 </button>
 )}
 </td>
 )}
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* NEW INVOICE MODAL */}
 {isModalOpen && (
 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
 <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
 <h3 className="font-semibold text-lg flex items-center gap-2">
 <FileText className="w-5 h-5 text-emerald-400" /> Generate Invoice
 </h3>
 <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800 transition-colors">✕</button>
 </div>
 <form onSubmit={handleSubmit} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Select Patient</label>
 <select 
 required 
 value={form.patientId} 
 onChange={(e) => setForm({...form, patientId: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-emerald-500"
 >
 <option value="">Select a patient...</option>
 {patients.map(p => (
 <option key={p.id} value={p.patientId}>{p.name} ({p.patientId})</option>
 ))}
 </select>
 </div>
 
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Total Amount (₹)</label>
 <input 
 type="number" required min="0" step="0.01"
 value={form.totalAmount} onChange={(e) => setForm({...form, totalAmount: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-emerald-500"
 placeholder="e.g. 15000.00"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Due Date</label>
 <input 
 type="date" required
 value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-emerald-500"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Insurance Claim Status</label>
 <select 
 value={form.insuranceClaimStatus} onChange={(e) => setForm({...form, insuranceClaimStatus: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-emerald-500"
 >
 <option value="none">Not Applicable / Self-Pay</option>
 <option value="submitted">Submitted to Provider</option>
 <option value="approved">Approved</option>
 <option value="rejected">Rejected</option>
 </select>
 </div>
 
 <div className="pt-4 border-t border-slate-200 flex gap-3">
 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors">Cancel</button>
 <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
 {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create Invoice"}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 )
}
