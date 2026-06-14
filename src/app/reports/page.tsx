"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PieChart, Users, Bed, Activity, Pill, Video, TrendingUp, Download } from "lucide-react"

export default function ReportsPage() {
 const [stats, setStats] = useState<any>(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 const fetchStats = async () => {
 try {
 const res = await fetch("/api/reports")
 const data = await res.json()
 setStats(data)
 } catch (e) {
 console.error(e)
 } finally {
 setLoading(false)
 }
 }
 fetchStats()
 }, [])

 const statCards = [
 { title: "Total Patients", value: stats?.totalPatients || 0, icon: <Users className="w-6 h-6" />, color: "text-blue-500", bg: "bg-blue-500/10" },
 { title: "IPD Admissions", value: stats?.totalIPD || 0, icon: <Bed className="w-6 h-6" />, color: "text-indigo-500", bg: "bg-indigo-500/10" },
 { title: "OPD Visits", value: stats?.totalOPD || 0, icon: <Activity className="w-6 h-6" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
 { title: "Lab Tests Done", value: stats?.labTests || 0, icon: <PieChart className="w-6 h-6" />, color: "text-purple-500", bg: "bg-purple-500/10" },
 { title: "Prescriptions", value: stats?.prescriptions || 0, icon: <Pill className="w-6 h-6" />, color: "text-pink-500", bg: "bg-pink-500/10" },
 { title: "Telehealth Sessions", value: stats?.liveConsultations || 0, icon: <Video className="w-6 h-6" />, color: "text-amber-500", bg: "bg-amber-500/10" }
 ]

 return (
 <div className="p-4 lg:p-8 space-y-8 pb-20">
 <motion.div 
 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
 className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
 >
 <div>
 <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
 <PieChart className="text-rose-500 w-8 h-8" />
 Hospital Reports & Analytics
 </h1>
 <p className="text-slate-500 mt-1">Real-time statistics and administrative reports overview.</p>
 </div>
 <button 
 onClick={() => alert("Downloading PDF report...")}
 className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-rose-500/30 transition-all hover:scale-105 active:scale-95"
 >
 <Download className="w-5 h-5" /> Export Report
 </button>
 </motion.div>

 {loading ? (
 <div className="flex items-center justify-center py-20 text-slate-500">Generating analytics...</div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {statCards.map((stat, i) => (
 <motion.div 
 key={stat.title}
 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
 className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
 >
 <div className="flex justify-between items-start z-10 relative">
 <div>
 <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
 <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
 <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-500">
 <TrendingUp className="w-3 h-3" /> +12% this month
 </div>
 </div>
 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
 {stat.icon}
 </div>
 </div>
 <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${stat.bg} opacity-50 blur-2xl group-hover:blur-3xl transition-all`} />
 </motion.div>
 ))}
 </div>
 )}

 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
 className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]"
 >
 <PieChart className="w-16 h-16 text-slate-700 mb-4" />
 <h3 className="text-xl font-bold text-slate-800 ">Advanced Charting</h3>
 <p className="text-slate-500 mt-2 max-w-md">Detailed graphical reports (Revenue, Department Load, Bed Occupancy) will be implemented in the final charting phase using Chart.js or Recharts.</p>
 </motion.div>
 </div>
 )
}
