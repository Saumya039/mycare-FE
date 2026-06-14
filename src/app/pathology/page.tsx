"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Microscope, Search, FileSignature, CheckCircle2, FlaskConical } from "lucide-react"

export default function PathologyPage() {
 const [data, setData] = useState<any>({ tests: [], patients: [] })
 const [loading, setLoading] = useState(true)
 const [showOrderModal, setShowOrderModal] = useState(false)
 const [showResultModal, setShowResultModal] = useState(false)
 const [selectedTest, setSelectedTest] = useState<any>(null)
 
 const [orderForm, setOrderForm] = useState({ patientId: '', testName: '' })
 const [resultText, setResultText] = useState('')

 useEffect(() => {
 fetchPathologyData()
 }, [])

 const fetchPathologyData = async () => {
 try {
 const res = await fetch("/api/pathology")
 const result = await res.json()
 if (result.tests) setData(result)
 } catch (e) {
 console.error(e)
 } finally {
 setLoading(false)
 }
 }

 const handleOrder = async (e: React.FormEvent) => {
 e.preventDefault()
 try {
 const res = await fetch("/api/pathology", {
 method: "POST",
 body: JSON.stringify({ action: "order", ...orderForm })
 })
 if (res.ok) {
 setShowOrderModal(false)
 setOrderForm({ patientId: '', testName: '' })
 fetchPathologyData()
 }
 } catch (e) {
 console.error(e)
 }
 }

 const handleUpdateResult = async (e: React.FormEvent) => {
 e.preventDefault()
 if (!selectedTest) return
 try {
 const res = await fetch("/api/pathology", {
 method: "POST",
 body: JSON.stringify({ action: "update", testId: selectedTest.id, resultText })
 })
 if (res.ok) {
 setShowResultModal(false)
 setSelectedTest(null)
 setResultText('')
 fetchPathologyData()
 }
 } catch (e) {
 console.error(e)
 }
 }

 const openResult = (test: any) => {
 setSelectedTest(test)
 setResultText(test.resultText || '')
 setShowResultModal(true)
 }

 return (
 <div className="p-4 lg:p-8 space-y-8 pb-20">
 <motion.div 
 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
 className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
 >
 <div>
 <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
 <Microscope className="text-purple-500 w-8 h-8" />
 Pathology Laboratory
 </h1>
 <p className="text-slate-500 mt-1">Manage lab test orders, samples, and diagnostic reports.</p>
 </div>
 <button 
 onClick={() => setShowOrderModal(true)}
 className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95"
 >
 <FlaskConical className="w-5 h-5" /> Order Test
 </button>
 </motion.div>

 <motion.div 
 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
 className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
 >
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 ">
 <div className="relative w-full max-w-md">
 <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
 <input type="text" placeholder="Search lab tests..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-purple-500 transition-colors" />
 </div>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-slate-50/50 text-slate-500 text-sm">
 <tr>
 <th className="px-6 py-4 font-medium">Date</th>
 <th className="px-6 py-4 font-medium">Patient</th>
 <th className="px-6 py-4 font-medium">Test Name</th>
 <th className="px-6 py-4 font-medium">Status</th>
 <th className="px-6 py-4 font-medium">Result</th>
 <th className="px-6 py-4 font-medium text-right">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
 {loading ? (
 <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading lab tests...</td></tr>
 ) : data.tests.length === 0 ? (
 <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No lab tests ordered.</td></tr>
 ) : data.tests.map((test: any, i: number) => (
 <motion.tr 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + (i * 0.05) }}
 key={test.id} className="hover:bg-slate-50 transition-colors"
 >
 <td className="px-6 py-4 text-slate-600 ">{new Date(test.createdAt).toLocaleDateString()}</td>
 <td className="px-6 py-4">
 <div className="font-bold text-slate-900">{test.patient?.name}</div>
 <div className="text-xs text-slate-500">{test.patient?.patientId}</div>
 </td>
 <td className="px-6 py-4 font-medium text-slate-800 ">{test.testName}</td>
 <td className="px-6 py-4">
 <span className={`px-3 py-1 text-xs font-medium rounded-full ${
 test.status === 'completed' ? 'bg-emerald-100 text-emerald-600 ' : 
 'bg-amber-100 text-amber-600 '
 }`}>
 {test.status.toUpperCase()}
 </span>
 </td>
 <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={test.resultText}>
 {test.resultText || "—"}
 </td>
 <td className="px-6 py-4 text-right">
 <button 
 onClick={() => openResult(test)}
 className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 justify-end w-full"
 >
 <FileSignature className="w-4 h-4" /> {test.status === 'completed' ? 'View' : 'Add Result'}
 </button>
 </td>
 </motion.tr>
 ))}
 </tbody>
 </table>
 </div>
 </motion.div>

 {/* Order Test Modal */}
 <AnimatePresence>
 {showOrderModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={() => setShowOrderModal(false)}
 className="absolute inset-0 bg-white/60 "
 />
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
 >
 <div className="p-6 border-b border-slate-200 bg-slate-50 ">
 <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
 <FlaskConical className="text-purple-500 w-6 h-6" /> Order Lab Test
 </h2>
 </div>
 <form onSubmit={handleOrder} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Patient</label>
 <select required value={orderForm.patientId} onChange={e => setOrderForm({...orderForm, patientId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 transition-colors">
 <option value="">Select Patient...</option>
 {data.patients.map((p: any) => (
 <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>
 ))}
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Test Name / Panel</label>
 <input required value={orderForm.testName} onChange={e => setOrderForm({...orderForm, testName: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 transition-colors" placeholder="e.g. Complete Blood Count (CBC)" />
 </div>
 <div className="pt-4 flex justify-end gap-3">
 <button type="button" onClick={() => setShowOrderModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-colors">Cancel</button>
 <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95">Place Order</button>
 </div>
 </form>
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 {/* Result Entry Modal */}
 <AnimatePresence>
 {showResultModal && selectedTest && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={() => setShowResultModal(false)}
 className="absolute inset-0 bg-white/60 "
 />
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
 >
 <div className="p-6 border-b border-slate-200 bg-slate-50 ">
 <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
 <FileSignature className="text-purple-500 w-6 h-6" /> Pathology Result
 </h2>
 <p className="text-sm text-slate-500 mt-1">{selectedTest.testName} for {selectedTest.patient?.name}</p>
 </div>
 <form onSubmit={handleUpdateResult} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-600 mb-1">Diagnostic Report / Values</label>
 <textarea required value={resultText} onChange={e => setResultText(e.target.value)} rows={6} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 transition-colors" placeholder="Enter findings, numeric values, and pathological interpretation..." />
 </div>
 <div className="pt-4 flex justify-end gap-3">
 <button type="button" onClick={() => setShowResultModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-colors">Cancel</button>
 <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4" /> Save Report
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
