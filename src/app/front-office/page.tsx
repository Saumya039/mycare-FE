"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, UserPlus, LogOut, Search, Clock } from "lucide-react"

export default function FrontOfficePage() {
 const [visitors, setVisitors] = useState<any[]>([])
 const [loading, setLoading] = useState(true)
 const [showModal, setShowModal] = useState(false)
 const [formData, setFormData] = useState({ visitorName: '', phone: '', purpose: '', whomToMeet: '' })

 useEffect(() => {
 fetchVisitors()
 }, [])

 const fetchVisitors = async () => {
 try {
 const res = await fetch("/api/front-office/visitors")
 const data = await res.json()
 if (Array.isArray(data)) setVisitors(data)
 } catch (e) {
 console.error(e)
 } finally {
 setLoading(false)
 }
 }

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 try {
 const res = await fetch("/api/front-office/visitors", {
 method: "POST",
 body: JSON.stringify(formData)
 })
 if (res.ok) {
 setShowModal(false)
 setFormData({ visitorName: '', phone: '', purpose: '', whomToMeet: '' })
 fetchVisitors()
 } else {
 const data = await res.json()
 alert(data.error)
 }
 } catch (e) {
 console.error(e)
 }
 }

 const handleCheckOut = async (id: string) => {
 try {
 const res = await fetch("/api/front-office/visitors", {
 method: "PATCH",
 body: JSON.stringify({ id, status: "Checked-Out" })
 })
 if (res.ok) fetchVisitors()
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
 <Users className="text-emerald-500 w-8 h-8" />
 Front Office
 </h1>
 <p className="text-slate-500 mt-1">Live visitor log and reception management.</p>
 </div>
 <button 
 onClick={() => setShowModal(true)}
 className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
 >
 <UserPlus className="w-5 h-5" /> Register Visitor
 </button>
 </motion.div>

 <motion.div 
 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
 className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
 >
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 ">
 <div className="relative w-full max-w-md">
 <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
 <input type="text" placeholder="Search visitors..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors" />
 </div>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-slate-50/50 text-slate-500 text-sm">
 <tr>
 <th className="px-6 py-4 font-medium">Visitor Name</th>
 <th className="px-6 py-4 font-medium">Contact</th>
 <th className="px-6 py-4 font-medium">Whom To Meet</th>
 <th className="px-6 py-4 font-medium">Purpose</th>
 <th className="px-6 py-4 font-medium">Check-In</th>
 <th className="px-6 py-4 font-medium">Status / Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
 {loading ? (
 <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading visitors...</td></tr>
 ) : visitors.length === 0 ? (
 <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No visitors logged today.</td></tr>
 ) : visitors.map((visitor, i) => (
 <motion.tr 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + (i * 0.05) }}
 key={visitor.id} className="hover:bg-slate-50 transition-colors"
 >
 <td className="px-6 py-4 text-slate-800 font-medium">{visitor.visitorName}</td>
 <td className="px-6 py-4 text-slate-600 ">{visitor.phone}</td>
 <td className="px-6 py-4 text-slate-800 font-medium">
 <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm">
 {visitor.whomToMeet}
 </span>
 </td>
 <td className="px-6 py-4 text-slate-600 ">{visitor.purpose}</td>
 <td className="px-6 py-4 text-slate-600 font-mono text-sm flex items-center gap-2">
 <Clock className="w-4 h-4 text-slate-500" />
 {new Date(visitor.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </td>
 <td className="px-6 py-4">
 {visitor.status === 'Active' ? (
 <button 
 onClick={() => handleCheckOut(visitor.id)}
 className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
 >
 <LogOut className="w-4 h-4" /> Check Out
 </button>
 ) : (
 <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-sm font-medium flex items-center gap-2 w-max">
 Checked Out at {new Date(visitor.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </span>
 )}
 </td>
 </motion.tr>
 ))}
 </tbody>
 </table>
 </div>
 </motion.div>

 {/* New Visitor Modal */}
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
 <UserPlus className="text-emerald-500 w-6 h-6" /> Register New Visitor
 </h2>
 </div>
 
 <form onSubmit={handleSubmit} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Visitor Name</label>
 <input required value={formData.visitorName} onChange={e => setFormData({...formData, visitorName: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors" placeholder="John Doe" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
 <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors" placeholder="+1 (555) 000-0000" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Whom To Meet</label>
 <input required value={formData.whomToMeet} onChange={e => setFormData({...formData, whomToMeet: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors" placeholder="Dr. Smith (Cardiology) or Room 204" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Purpose of Visit</label>
 <input required value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors" placeholder="Patient meeting, Vendor, Interview..." />
 </div>
 
 <div className="pt-4 flex justify-end gap-3">
 <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-colors">
 Cancel
 </button>
 <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95">
 Register Visitor
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
