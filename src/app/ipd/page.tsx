"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Plus, Search, BedDouble } from "lucide-react"

export default function IpdPage() {
 const [data, setData] = useState<any>({ patients: [], beds: [] })
 const [loading, setLoading] = useState(true)
 const [showModal, setShowModal] = useState(false)
 const [formData, setFormData] = useState({ name: '', age: '', gender: 'Male', diagnosis: '', doctorName: '', bedId: '' })

 useEffect(() => {
 fetchIpdData()
 }, [])

 const fetchIpdData = async () => {
 try {
 const res = await fetch("/api/ipd")
 const result = await res.json()
 if (result.patients) setData(result)
 } catch (e) {
 console.error(e)
 } finally {
 setLoading(false)
 }
 }

 const handleAdmit = async (e: React.FormEvent) => {
 e.preventDefault()
 try {
 const res = await fetch("/api/ipd", {
 method: "POST",
 body: JSON.stringify(formData)
 })
 if (res.ok) {
 setShowModal(false)
 setFormData({ name: '', age: '', gender: 'Male', diagnosis: '', doctorName: '', bedId: '' })
 fetchIpdData()
 } else {
 alert("Failed to admit patient")
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
 <Activity className="text-cyan-500 w-8 h-8" />
 IPD - In Patient Department
 </h1>
 <p className="text-slate-500 mt-1">Manage hospital admissions and bed assignments.</p>
 </div>
 <button 
 onClick={() => setShowModal(true)}
 className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95"
 >
 <Plus className="w-5 h-5" /> Admit Patient
 </button>
 </motion.div>

 <motion.div 
 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
 className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
 >
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 ">
 <div className="relative w-full max-w-md">
 <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
 <input type="text" placeholder="Search IPD patients..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
 </div>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-slate-50/50 text-slate-500 text-sm">
 <tr>
 <th className="px-6 py-4 font-medium">Patient ID</th>
 <th className="px-6 py-4 font-medium">Name & Details</th>
 <th className="px-6 py-4 font-medium">Diagnosis</th>
 <th className="px-6 py-4 font-medium">Assigned Doctor</th>
 <th className="px-6 py-4 font-medium">Bed/Location</th>
 <th className="px-6 py-4 font-medium">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
 {loading ? (
 <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading IPD data...</td></tr>
 ) : data.patients.length === 0 ? (
 <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No patients currently admitted to IPD.</td></tr>
 ) : data.patients.map((patient: any, i: number) => (
 <motion.tr 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + (i * 0.05) }}
 key={patient.id} className="hover:bg-slate-50 transition-colors"
 >
 <td className="px-6 py-4 text-slate-600 font-medium">{patient.patientId}</td>
 <td className="px-6 py-4">
 <div className="font-bold text-slate-900">{patient.name}</div>
 <div className="text-xs text-slate-500">{patient.age}y • {patient.gender}</div>
 </td>
 <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate" title={patient.diagnosis}>{patient.diagnosis}</td>
 <td className="px-6 py-4">
 <div className="font-semibold text-slate-700 ">Dr. {patient.doctorName}</div>
 </td>
 <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
 <BedDouble className="w-4 h-4 text-cyan-500" /> {patient.bed ? patient.bed.label : "Unassigned"}
 </td>
 <td className="px-6 py-4">
 <span className="px-3 py-1 text-xs font-medium rounded-full bg-cyan-100 text-cyan-600 ">
 {patient.status.toUpperCase()}
 </span>
 </td>
 </motion.tr>
 ))}
 </tbody>
 </table>
 </div>
 </motion.div>

 {/* Admit Patient Modal */}
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
 <Activity className="text-cyan-500 w-6 h-6" /> Admit New IPD Patient
 </h2>
 </div>
 
 <form onSubmit={handleAdmit} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Patient Name</label>
 <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Age</label>
 <input required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Gender</label>
 <select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-colors">
 <option>Male</option>
 <option>Female</option>
 <option>Other</option>
 </select>
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Primary Diagnosis</label>
 <input required value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Attending Doctor Name</label>
 <input required value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Assign Bed (Optional)</label>
 <select value={formData.bedId} onChange={e => setFormData({...formData, bedId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-colors">
 <option value="">Do not assign bed yet</option>
 {data.beds.map((b: any) => (
 <option key={b.id} value={b.id}>{b.label} ({b.departmentName})</option>
 ))}
 </select>
 </div>
 
 <div className="pt-4 flex justify-end gap-3">
 <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-colors">
 Cancel
 </button>
 <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95">
 Admit to IPD
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
