"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert, Plus, CheckCircle, XCircle, Search, ShieldCheck } from "lucide-react"

export default function TPAPage() {
 const [data, setData] = useState<any>({ claims: [], patients: [] })
 const [loading, setLoading] = useState(true)
 const [showModal, setShowModal] = useState(false)
 const [formData, setFormData] = useState({ patientId: '', insuranceCompany: '', policyNumber: '', claimAmount: '' })

 useEffect(() => {
 fetchTPA()
 }, [])

 const fetchTPA = async () => {
 try {
 const res = await fetch("/api/tpa")
 const result = await res.json()
 if (result.claims) setData(result)
 } catch (e) {
 console.error(e)
 } finally {
 setLoading(false)
 }
 }

 const handleCreateClaim = async (e: React.FormEvent) => {
 e.preventDefault()
 try {
 const res = await fetch("/api/tpa", {
 method: "POST",
 body: JSON.stringify(formData)
 })
 if (res.ok) {
 setShowModal(false)
 setFormData({ patientId: '', insuranceCompany: '', policyNumber: '', claimAmount: '' })
 fetchTPA()
 } else {
 alert("Failed to submit claim")
 }
 } catch (e) {
 console.error(e)
 }
 }

 const updateClaimStatus = async (id: string, status: string) => {
 try {
 const res = await fetch("/api/tpa", {
 method: "PATCH",
 body: JSON.stringify({ id, status })
 })
 if (res.ok) fetchTPA()
 } catch (e) {
 console.error(e)
 }
 }

 return (
 <div className="p-4 lg:p-8 space-y-8 pb-20">
 <motion.div 
 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
 className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
 >
 <div>
 <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
 <ShieldCheck className="text-indigo-500 w-8 h-8" />
 TPA & Insurance Claims
 </h1>
 <p className="text-slate-500 mt-1">Manage Third-Party Administrator claims and approvals.</p>
 </div>
 <button 
 onClick={() => setShowModal(true)}
 className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
 >
 <Plus className="w-5 h-5" /> Submit New Claim
 </button>
 </motion.div>

 <motion.div 
 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
 className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
 >
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 ">
 <div className="relative w-full max-w-md">
 <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
 <input type="text" placeholder="Search claims..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-colors" />
 </div>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-slate-50/50 text-slate-500 text-sm">
 <tr>
 <th className="px-6 py-4 font-medium">Claim ID</th>
 <th className="px-6 py-4 font-medium">Patient</th>
 <th className="px-6 py-4 font-medium">Provider & Policy</th>
 <th className="px-6 py-4 font-medium">Claim Amount</th>
 <th className="px-6 py-4 font-medium">Submission Date</th>
 <th className="px-6 py-4 font-medium">Status</th>
 <th className="px-6 py-4 font-medium">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
 {loading ? (
 <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading claims...</td></tr>
 ) : data.claims.length === 0 ? (
 <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No insurance claims found.</td></tr>
 ) : data.claims.map((claim: any, i: number) => (
 <motion.tr 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + (i * 0.05) }}
 key={claim.id} className="hover:bg-slate-50 transition-colors"
 >
 <td className="px-6 py-4 font-mono text-sm text-slate-500">{claim.id.slice(-8).toUpperCase()}</td>
 <td className="px-6 py-4">
 <div className="font-bold text-slate-900">{claim.patient?.name}</div>
 <div className="text-xs text-slate-500">{claim.patient?.patientId}</div>
 </td>
 <td className="px-6 py-4">
 <div className="font-semibold text-slate-700 ">{claim.insuranceCompany}</div>
 <div className="text-xs text-slate-500">Pol: {claim.policyNumber}</div>
 </td>
 <td className="px-6 py-4 font-bold text-slate-900">${claim.claimAmount.toLocaleString()}</td>
 <td className="px-6 py-4 text-slate-600 ">{new Date(claim.submittedAt).toLocaleDateString()}</td>
 <td className="px-6 py-4">
 <span className={`px-3 py-1 text-xs font-medium rounded-full ${
 claim.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 
 claim.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 
 'bg-amber-500/10 text-amber-500'
 }`}>
 {claim.status}
 </span>
 </td>
 <td className="px-6 py-4">
 {claim.status === 'Pending' && (
 <div className="flex items-center gap-2">
 <button onClick={() => updateClaimStatus(claim.id, "Approved")} className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-colors" title="Approve Claim">
 <CheckCircle className="w-5 h-5" />
 </button>
 <button onClick={() => updateClaimStatus(claim.id, "Rejected")} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors" title="Reject Claim">
 <XCircle className="w-5 h-5" />
 </button>
 </div>
 )}
 </td>
 </motion.tr>
 ))}
 </tbody>
 </table>
 </div>
 </motion.div>

 {/* Submit Claim Modal */}
 <AnimatePresence>
 {showModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={() => setShowModal(false)}
 className="absolute inset-0 bg-white/60 "
 />
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
 >
 <div className="p-6 border-b border-slate-200 bg-slate-50 ">
 <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
 <ShieldAlert className="text-indigo-500 w-6 h-6" /> Submit TPA Claim
 </h2>
 </div>
 
 <form onSubmit={handleCreateClaim} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Select Patient</label>
 <select required value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-colors">
 <option value="">Select patient...</option>
 {data.patients.map((p: any) => (
 <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>
 ))}
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Insurance Provider (TPA)</label>
 <input required value={formData.insuranceCompany} onChange={e => setFormData({...formData, insuranceCompany: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. BlueCross, Star Health..." />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Policy Number</label>
 <input required value={formData.policyNumber} onChange={e => setFormData({...formData, policyNumber: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. POL12345" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Claim Amount ($)</label>
 <input required value={formData.claimAmount} onChange={e => setFormData({...formData, claimAmount: e.target.value})} type="number" min="0" step="0.01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-colors" placeholder="0.00" />
 </div>
 </div>
 
 <div className="pt-4 flex justify-end gap-3">
 <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-colors">
 Cancel
 </button>
 <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95">
 Submit Claim
 </button>
 </div>
 </form>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 )
}
