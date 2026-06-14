"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Stethoscope, Plus, Search, ExternalLink } from "lucide-react"

export default function ReferralPage() {
 const [data, setData] = useState<any>({ referrals: [], patients: [] })
 const [loading, setLoading] = useState(true)
 const [showModal, setShowModal] = useState(false)
 const [formData, setFormData] = useState({ patientId: '', referredTo: '', reason: '' })

 useEffect(() => {
 fetchReferrals()
 }, [])

 const fetchReferrals = async () => {
 try {
 const res = await fetch("/api/referral")
 const result = await res.json()
 if (result.referrals) setData(result)
 } catch (e) {
 console.error(e)
 } finally {
 setLoading(false)
 }
 }

 const handleCreateReferral = async (e: React.FormEvent) => {
 e.preventDefault()
 try {
 const res = await fetch("/api/referral", {
 method: "POST",
 body: JSON.stringify(formData)
 })
 if (res.ok) {
 setShowModal(false)
 setFormData({ patientId: '', referredTo: '', reason: '' })
 fetchReferrals()
 } else {
 alert("Failed to submit referral")
 }
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
 <Stethoscope className="text-pink-500 w-8 h-8" />
 Patient Referrals
 </h1>
 <p className="text-slate-500 mt-1">Track outgoing transfers and specialist recommendations.</p>
 </div>
 <button 
 onClick={() => setShowModal(true)}
 className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-pink-500/30 transition-all hover:scale-105 active:scale-95"
 >
 <Plus className="w-5 h-5" /> New Referral
 </button>
 </motion.div>

 <motion.div 
 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
 className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
 >
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 ">
 <div className="relative w-full max-w-md">
 <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
 <input type="text" placeholder="Search referrals..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-pink-500 transition-colors" />
 </div>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-slate-50/50 text-slate-500 text-sm">
 <tr>
 <th className="px-6 py-4 font-medium">Date</th>
 <th className="px-6 py-4 font-medium">Patient</th>
 <th className="px-6 py-4 font-medium">Referred By (Internal)</th>
 <th className="px-6 py-4 font-medium">Referred To (External)</th>
 <th className="px-6 py-4 font-medium">Reason</th>
 <th className="px-6 py-4 font-medium">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
 {loading ? (
 <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading referrals...</td></tr>
 ) : data.referrals.length === 0 ? (
 <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No patient referrals found.</td></tr>
 ) : data.referrals.map((ref: any, i: number) => (
 <motion.tr 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + (i * 0.05) }}
 key={ref.id} className="hover:bg-slate-50 transition-colors"
 >
 <td className="px-6 py-4 text-slate-600 ">{new Date(ref.date).toLocaleDateString()}</td>
 <td className="px-6 py-4">
 <div className="font-bold text-slate-900">{ref.patient?.name}</div>
 <div className="text-xs text-slate-500">{ref.patient?.patientId}</div>
 </td>
 <td className="px-6 py-4">
 <div className="font-semibold text-slate-700 ">Dr. {ref.doctor?.name}</div>
 </td>
 <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
 <ExternalLink className="w-4 h-4 text-pink-500" /> {ref.referredTo}
 </td>
 <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={ref.reason}>{ref.reason}</td>
 <td className="px-6 py-4">
 <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
 {ref.status}
 </span>
 </td>
 </motion.tr>
 ))}
 </tbody>
 </table>
 </div>
 </motion.div>

 {/* New Referral Modal */}
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
 <Stethoscope className="text-pink-500 w-6 h-6" /> Create Patient Referral
 </h2>
 </div>
 
 <form onSubmit={handleCreateReferral} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Select Patient</label>
 <select required value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 transition-colors">
 <option value="">Select patient...</option>
 {data.patients.map((p: any) => (
 <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>
 ))}
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Referred To (External Specialist / Facility)</label>
 <input required value={formData.referredTo} onChange={e => setFormData({...formData, referredTo: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 transition-colors" placeholder="e.g. City Orthopedic Center" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Reason for Referral / Medical Notes</label>
 <textarea required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 transition-colors" placeholder="e.g. Patient requires advanced MRI scan for suspected..." />
 </div>
 
 <div className="pt-4 flex justify-end gap-3">
 <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-colors">
 Cancel
 </button>
 <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/30 transition-all hover:scale-105 active:scale-95">
 Submit Referral
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
