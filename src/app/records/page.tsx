"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileBox, Search, Plus, Baby, Cross } from "lucide-react"

export default function RecordsPage() {
 const [activeTab, setActiveTab] = useState<'birth' | 'death'>('birth')
 const [records, setRecords] = useState<any[]>([])
 const [patients, setPatients] = useState<any[]>([])
 const [loading, setLoading] = useState(true)
 const [showModal, setShowModal] = useState(false)
 
 const [birthForm, setBirthForm] = useState({ childName: '', gender: 'Male', weight: '', dateOfBirth: '', parentId: '' })
 const [deathForm, setDeathForm] = useState({ patientId: '', dateOfDeath: '', cause: '', reportedBy: '' })

 useEffect(() => {
 fetchRecords()
 }, [activeTab])

 const fetchRecords = async () => {
 setLoading(true)
 try {
 const res = await fetch(`/api/records?type=${activeTab}`)
 const result = await res.json()
 if (result.records) setRecords(result.records)
 if (result.patients) setPatients(result.patients)
 } catch (e) {
 console.error(e)
 } finally {
 setLoading(false)
 }
 }

 const handleAddBirth = async (e: React.FormEvent) => {
 e.preventDefault()
 try {
 const res = await fetch("/api/records", {
 method: "POST",
 body: JSON.stringify({ type: 'birth', ...birthForm })
 })
 if (res.ok) {
 setShowModal(false)
 setBirthForm({ childName: '', gender: 'Male', weight: '', dateOfBirth: '', parentId: '' })
 fetchRecords()
 }
 } catch (e) {
 console.error(e)
 }
 }

 const handleAddDeath = async (e: React.FormEvent) => {
 e.preventDefault()
 try {
 const res = await fetch("/api/records", {
 method: "POST",
 body: JSON.stringify({ type: 'death', ...deathForm })
 })
 if (res.ok) {
 setShowModal(false)
 setDeathForm({ patientId: '', dateOfDeath: '', cause: '', reportedBy: '' })
 fetchRecords()
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
 <FileBox className="text-orange-500 w-8 h-8" />
 Vital Records
 </h1>
 <p className="text-slate-500 mt-1">Manage official birth and death records.</p>
 </div>
 <button 
 onClick={() => setShowModal(true)}
 className={`px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 text-white ${
 activeTab === 'birth' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : 'bg-slate-700 hover:bg-slate-100 shadow-slate-900/30'
 }`}
 >
 <Plus className="w-5 h-5" /> Add {activeTab === 'birth' ? 'Birth' : 'Death'} Record
 </button>
 </motion.div>

 {/* Tabs */}
 <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl w-max">
 <button 
 onClick={() => setActiveTab('birth')}
 className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
 activeTab === 'birth' ? 'bg-white shadow-sm text-orange-500' : 'text-slate-500 hover:text-slate-700 '
 }`}
 >
 <Baby className="w-4 h-4" /> Birth Records
 </button>
 <button 
 onClick={() => setActiveTab('death')}
 className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
 activeTab === 'death' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700 '
 }`}
 >
 <Cross className="w-4 h-4" /> Death Records
 </button>
 </div>

 <motion.div 
 key={activeTab}
 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
 className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
 >
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 ">
 <div className="relative w-full max-w-md">
 <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
 <input type="text" placeholder={`Search ${activeTab} records...`} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 transition-colors" />
 </div>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-slate-50/50 text-slate-500 text-sm">
 <tr>
 {activeTab === 'birth' ? (
 <>
 <th className="px-6 py-4 font-medium">Date of Birth</th>
 <th className="px-6 py-4 font-medium">Child Name</th>
 <th className="px-6 py-4 font-medium">Gender & Weight</th>
 <th className="px-6 py-4 font-medium">Parent (Patient ID)</th>
 </>
 ) : (
 <>
 <th className="px-6 py-4 font-medium">Date of Death</th>
 <th className="px-6 py-4 font-medium">Patient Name</th>
 <th className="px-6 py-4 font-medium">Cause of Death</th>
 <th className="px-6 py-4 font-medium">Reported By</th>
 </>
 )}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
 {loading ? (
 <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading records...</td></tr>
 ) : records.length === 0 ? (
 <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No {activeTab} records found.</td></tr>
 ) : records.map((record, i) => (
 <motion.tr 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
 key={record.id} className="hover:bg-slate-50 transition-colors"
 >
 {activeTab === 'birth' ? (
 <>
 <td className="px-6 py-4 font-medium text-slate-800 ">{new Date(record.dateOfBirth).toLocaleString()}</td>
 <td className="px-6 py-4 font-bold text-slate-900">{record.childName}</td>
 <td className="px-6 py-4 text-slate-700">{record.gender}, {record.weight}kg</td>
 <td className="px-6 py-4 text-slate-600 ">{record.parent?.name}</td>
 </>
 ) : (
 <>
 <td className="px-6 py-4 font-medium text-slate-800 ">{new Date(record.dateOfDeath).toLocaleString()}</td>
 <td className="px-6 py-4 font-bold text-slate-900">{record.patient?.name}</td>
 <td className="px-6 py-4 text-slate-700">{record.cause}</td>
 <td className="px-6 py-4 text-slate-600 ">Dr. {record.reportedBy}</td>
 </>
 )}
 </motion.tr>
 ))}
 </tbody>
 </table>
 </div>
 </motion.div>

 {/* Add Record Modal */}
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
 {activeTab === 'birth' ? <Baby className="text-orange-500 w-6 h-6" /> : <Cross className="text-slate-500 w-6 h-6" />}
 Add {activeTab === 'birth' ? 'Birth' : 'Death'} Record
 </h2>
 </div>
 
 {activeTab === 'birth' ? (
 <form onSubmit={handleAddBirth} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Parent (Mother)</label>
 <select required value={birthForm.parentId} onChange={e => setBirthForm({...birthForm, parentId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 transition-colors">
 <option value="">Select Parent...</option>
 {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>)}
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Child Name</label>
 <input required value={birthForm.childName} onChange={e => setBirthForm({...birthForm, childName: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 transition-colors" placeholder="e.g. Baby Doe" />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Gender</label>
 <select required value={birthForm.gender} onChange={e => setBirthForm({...birthForm, gender: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 transition-colors">
 <option>Male</option><option>Female</option><option>Other</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Weight (kg)</label>
 <input required value={birthForm.weight} onChange={e => setBirthForm({...birthForm, weight: e.target.value})} type="number" step="0.01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 transition-colors" placeholder="3.5" />
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Date & Time of Birth</label>
 <input required value={birthForm.dateOfBirth} onChange={e => setBirthForm({...birthForm, dateOfBirth: e.target.value})} type="datetime-local" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 transition-colors" />
 </div>
 <div className="pt-4 flex justify-end gap-3">
 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-colors">Cancel</button>
 <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95">Save Record</button>
 </div>
 </form>
 ) : (
 <form onSubmit={handleAddDeath} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Patient</label>
 <select required value={deathForm.patientId} onChange={e => setDeathForm({...deathForm, patientId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-500 transition-colors">
 <option value="">Select Patient...</option>
 {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>)}
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Cause of Death</label>
 <input required value={deathForm.cause} onChange={e => setDeathForm({...deathForm, cause: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-500 transition-colors" placeholder="e.g. Cardiac Arrest" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Reported By (Doctor)</label>
 <input required value={deathForm.reportedBy} onChange={e => setDeathForm({...deathForm, reportedBy: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-500 transition-colors" placeholder="e.g. Dr. House" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Date & Time of Death</label>
 <input required value={deathForm.dateOfDeath} onChange={e => setDeathForm({...deathForm, dateOfDeath: e.target.value})} type="datetime-local" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-500 transition-colors" />
 </div>
 <div className="pt-4 flex justify-end gap-3">
 <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-colors">Cancel</button>
 <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-slate-700 hover:bg-slate-100 shadow-lg shadow-slate-900/30 transition-all hover:scale-105 active:scale-95">Save Record</button>
 </div>
 </form>
 )}
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 )
}
