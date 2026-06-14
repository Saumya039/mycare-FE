"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, AlertCircle, FileText, CheckCircle2 } from "lucide-react"

export default function FinancePage() {
 const [data, setData] = useState<any>({ invoices: [], totals: { revenue: 0, pending: 0, overdue: 0 } })
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 fetchFinance()
 }, [])

 const fetchFinance = async () => {
 try {
 const res = await fetch("/api/finance")
 const result = await res.json()
 if (result.invoices) setData(result)
 } catch (e) {
 console.error(e)
 } finally {
 setLoading(false)
 }
 }

 const handleStatusChange = async (id: string, status: string) => {
 try {
 const res = await fetch("/api/finance", {
 method: "PATCH",
 body: JSON.stringify({ id, status })
 })
 if (res.ok) fetchFinance()
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
 <DollarSign className="text-emerald-500 w-8 h-8" />
 Financial Dashboard
 </h1>
 <p className="text-slate-500 mt-1">CFO-level overview of revenue, accounts receivable, and invoices.</p>
 </div>
 </motion.div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex items-center gap-4">
 <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
 <TrendingUp className="text-white w-7 h-7" />
 </div>
 <div>
 <p className="text-emerald-600 font-medium text-sm">Total Revenue (Paid)</p>
 <h2 className="text-3xl font-bold text-slate-900">${data.totals.revenue.toLocaleString()}</h2>
 </div>
 </motion.div>

 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex items-center gap-4">
 <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
 <FileText className="text-white w-7 h-7" />
 </div>
 <div>
 <p className="text-amber-600 font-medium text-sm">Accounts Receivable</p>
 <h2 className="text-3xl font-bold text-slate-900">${data.totals.pending.toLocaleString()}</h2>
 </div>
 </motion.div>

 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 flex items-center gap-4">
 <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
 <AlertCircle className="text-white w-7 h-7" />
 </div>
 <div>
 <p className="text-red-600 font-medium text-sm">Overdue Collections</p>
 <h2 className="text-3xl font-bold text-slate-900">${data.totals.overdue.toLocaleString()}</h2>
 </div>
 </motion.div>
 </div>

 <motion.div 
 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
 className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
 >
 <div className="p-6 border-b border-slate-200 bg-slate-50/50 ">
 <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
 Recent Invoices
 </h3>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-slate-50/50 text-slate-500 text-sm">
 <tr>
 <th className="px-6 py-4 font-medium">Invoice ID</th>
 <th className="px-6 py-4 font-medium">Patient</th>
 <th className="px-6 py-4 font-medium">Date Issued</th>
 <th className="px-6 py-4 font-medium">Due Date</th>
 <th className="px-6 py-4 font-medium">Amount</th>
 <th className="px-6 py-4 font-medium">Status</th>
 <th className="px-6 py-4 font-medium">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
 {loading ? (
 <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading financials...</td></tr>
 ) : data.invoices.length === 0 ? (
 <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No invoices found.</td></tr>
 ) : data.invoices.map((inv: any, i: number) => (
 <motion.tr 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + (i * 0.05) }}
 key={inv.id} className="hover:bg-slate-50 transition-colors"
 >
 <td className="px-6 py-4 font-mono text-sm text-slate-500">{inv.id.slice(-8).toUpperCase()}</td>
 <td className="px-6 py-4">
 <div className="font-bold text-slate-900">{inv.patient?.name}</div>
 <div className="text-xs text-slate-500">{inv.patient?.patientId}</div>
 </td>
 <td className="px-6 py-4 text-slate-600 ">{new Date(inv.createdAt).toLocaleDateString()}</td>
 <td className="px-6 py-4 text-slate-600 ">{new Date(inv.dueDate).toLocaleDateString()}</td>
 <td className="px-6 py-4 font-bold text-slate-900">${inv.totalAmount.toLocaleString()}</td>
 <td className="px-6 py-4">
 <span className={`px-3 py-1 text-xs font-medium rounded-full ${
 inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 
 inv.status === 'overdue' ? 'bg-red-500/10 text-red-500' : 
 'bg-amber-500/10 text-amber-500'
 }`}>
 {inv.status.toUpperCase()}
 </span>
 </td>
 <td className="px-6 py-4">
 {inv.status !== 'paid' && (
 <button 
 onClick={() => handleStatusChange(inv.id, "paid")}
 className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
 >
 <CheckCircle2 className="w-4 h-4" /> Mark Paid
 </button>
 )}
 </td>
 </motion.tr>
 ))}
 </tbody>
 </table>
 </div>
 </motion.div>
 </div>
 )
}
