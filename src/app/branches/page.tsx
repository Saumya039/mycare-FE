"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Network, Search, Plus, MapPin, PhoneCall, Building2 } from "lucide-react"

export default function BranchesPage() {
 const [branches, setBranches] = useState<any[]>([])
 const [loading, setLoading] = useState(true)
 const [showModal, setShowModal] = useState(false)
 const [formData, setFormData] = useState({ name: '', location: '', contactNum: '', head: '' })

 useEffect(() => {
 fetchBranches()
 }, [])

 const fetchBranches = async () => {
 try {
 const res = await fetch("/api/branches")
 const result = await res.json()
 if (result.branches) setBranches(result.branches)
 } catch (e) {
 console.error(e)
 } finally {
 setLoading(false)
 }
 }

 const handleAdd = async (e: React.FormEvent) => {
 e.preventDefault()
 try {
 const res = await fetch("/api/branches", {
 method: "POST",
 body: JSON.stringify(formData)
 })
 if (res.ok) {
 setShowModal(false)
 setFormData({ name: '', location: '', contactNum: '', head: '' })
 fetchBranches()
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
 <Network className="text-pink-500 w-8 h-8" />
 Hospital Network Branches
 </h1>
 <p className="text-slate-500 mt-1">Manage multiple facilities across the entire enterprise.</p>
 </div>
 <button 
 onClick={() => setShowModal(true)}
 className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-pink-500/30 transition-all hover:scale-105 active:scale-95"
 >
 <Plus className="w-5 h-5" /> Add Branch
 </button>
 </motion.div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {loading ? (
 <div className="col-span-full text-center text-slate-500 py-10">Loading network data...</div>
 ) : branches.length === 0 ? (
 <div className="col-span-full text-center text-slate-500 py-10">No branches added to network yet.</div>
 ) : branches.map((branch, i) => (
 <motion.div 
 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
 key={branch.id} 
 className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all"
 >
 <div className="flex items-center gap-4 mb-4">
 <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500">
 <Building2 className="w-6 h-6" />
 </div>
 <div>
 <h3 className="font-bold text-lg text-slate-900">{branch.name}</h3>
 <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {branch.location}</p>
 </div>
 </div>
 
 <div className="space-y-3 pt-4 border-t border-slate-200">
 <div className="flex items-center gap-3 text-slate-600 ">
 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
 <PhoneCall className="w-4 h-4 text-slate-500" />
 </div>
 <span className="font-medium">{branch.contactNum}</span>
 </div>
 <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
 <span className="text-xs text-slate-500 font-medium">Branch Head</span>
 <span className="text-sm font-bold text-slate-700 ">Dr. {branch.head || "TBA"}</span>
 </div>
 </div>
 </motion.div>
 ))}
 </div>

 {/* Add Branch Modal */}
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
 className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
 >
 <div className="p-6 border-b border-slate-200 bg-slate-50 ">
 <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
 <Building2 className="text-pink-500 w-6 h-6" /> Add New Branch
 </h2>
 </div>
 <form onSubmit={handleAdd} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Branch Name</label>
 <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 transition-colors" placeholder="e.g. MyCare Westside" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Location / Address</label>
 <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 transition-colors" placeholder="e.g. 123 Healthcare Ave, CA" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Contact Number</label>
 <input required value={formData.contactNum} onChange={e => setFormData({...formData, contactNum: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 transition-colors" placeholder="e.g. (555) 123-4567" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Branch Head (Doctor/Admin)</label>
 <input value={formData.head} onChange={e => setFormData({...formData, head: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 transition-colors" placeholder="e.g. Sarah Jenkins" />
 </div>
 <div className="pt-4 flex justify-end gap-3">
 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-colors">Cancel</button>
 <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/30 transition-all hover:scale-105 active:scale-95">Add Facility</button>
 </div>
 </form>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 )
}
