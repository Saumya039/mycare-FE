"use client"

import { useSession } from "@/context/SupabaseAuthContext"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts'
import { Activity, Users, Bed, CreditCard, TrendingUp, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react'

// Mock Analytics Data
const flowData = [
 { name: 'Mon', Admissions: 40, Discharges: 24 },
 { name: 'Tue', Admissions: 30, Discharges: 13 },
 { name: 'Wed', Admissions: 20, Discharges: 58 },
 { name: 'Thu', Admissions: 27, Discharges: 39 },
 { name: 'Fri', Admissions: 18, Discharges: 48 },
 { name: 'Sat', Admissions: 23, Discharges: 38 },
 { name: 'Sun', Admissions: 34, Discharges: 43 },
]

const deptData = [
 { name: 'Emergency', value: 400 },
 { name: 'ICU', value: 300 },
 { name: 'Cardiology', value: 300 },
 { name: 'Neurology', value: 200 },
 { name: 'Pediatrics', value: 150 },
]

const revenueData = [
 { name: 'Jan', revenue: 4000 },
 { name: 'Feb', revenue: 3000 },
 { name: 'Mar', revenue: 2000 },
 { name: 'Apr', revenue: 2780 },
 { name: 'May', revenue: 1890 },
 { name: 'Jun', revenue: 2390 },
]

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const containerVariants: any = {
 hidden: { opacity: 0 },
 show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants: any = {
 hidden: { opacity: 0, y: 20 },
 show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function DashboardPage() {
 const { data: session } = useSession()

 if (!session) return null
 const role = session.user.role

 return (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="p-4 lg:p-8 space-y-8 pb-20"
 >
 {/* Top Stat Cards */}
 <motion.div 
 variants={containerVariants}
 initial="hidden"
 animate="show"
 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
 >
 <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
 <div className="flex justify-between items-start mb-4 relative z-10">
 <div>
 <p className="text-slate-500 text-sm font-medium">Total Patients</p>
 <h3 className="text-3xl font-bold text-slate-900 mt-1">1,248</h3>
 </div>
 <div className="p-3 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
 <Users className="w-6 h-6 text-[#0d6efd]" />
 </div>
 </div>
 <p className="text-emerald-500 text-sm font-medium flex items-center gap-1 relative z-10">
 <TrendingUp className="w-4 h-4" /> +12% from last month
 </p>
 </motion.div>

 <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
 <div className="flex justify-between items-start mb-4 relative z-10">
 <div>
 <p className="text-slate-500 text-sm font-medium">Available Beds</p>
 <h3 className="text-3xl font-bold text-slate-900 mt-1">42 <span className="text-lg text-slate-500 font-normal">/ 500</span></h3>
 </div>
 <div className="p-3 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
 <Bed className="w-6 h-6 text-emerald-500" />
 </div>
 </div>
 <p className="text-orange-500 text-sm font-medium flex items-center gap-1 relative z-10">
 <AlertTriangle className="w-4 h-4" /> High occupancy alert
 </p>
 </motion.div>

 <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
 <div className="flex justify-between items-start mb-4 relative z-10">
 <div>
 <p className="text-slate-500 text-sm font-medium">Active Doctors</p>
 <h3 className="text-3xl font-bold text-slate-900 mt-1">86</h3>
 </div>
 <div className="p-3 bg-purple-50 rounded-2xl group-hover:scale-110 transition-transform">
 <Activity className="w-6 h-6 text-purple-500" />
 </div>
 </div>
 <p className="text-emerald-500 text-sm font-medium flex items-center gap-1 relative z-10">
 On shift currently
 </p>
 </motion.div>

 <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
 <div className="flex justify-between items-start mb-4 relative z-10">
 <div>
 <p className="text-slate-500 text-sm font-medium">Today's Revenue</p>
 <h3 className="text-3xl font-bold text-slate-900 mt-1">₹1.2M</h3>
 </div>
 <div className="p-3 bg-[#0d6efd]/10 rounded-2xl group-hover:scale-110 transition-transform">
 <CreditCard className="w-6 h-6 text-[#0d6efd]" />
 </div>
 </div>
 <p className="text-emerald-500 text-sm font-medium flex items-center gap-1 relative z-10">
 <TrendingUp className="w-4 h-4" /> +5% from yesterday
 </p>
 </motion.div>
 </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl p-8 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">What is the difference between the first and second vaccines?</h2>
            <p className="text-white/90 mb-6 text-sm">
              The purpose of the two vaccines is actually different, yes, the first (vaccine) is to see the body's response, now the second (vaccine) is to form immunity (body).
            </p>
            <p className="font-semibold text-white">dr. Inddria Safitriaw</p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
            <Sparkles className="w-64 h-64 text-white" />
          </div>
        </motion.div>
      </motion.div>

 <motion.div 
 variants={containerVariants}
 initial="hidden"
 animate="show"
 className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
 >
 {/* Patient Flow Chart */}
 <motion.div variants={itemVariants} className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
 <h3 className="text-lg font-bold text-slate-900 mb-6">Patient Flow (Last 7 Days)</h3>
 <div className="h-[300px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={flowData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
 <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
 <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
 <Tooltip 
 contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px', color: '#fff' }} 
 itemStyle={{ color: '#fff' }}
 />
 <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
 <Line type="monotone" dataKey="Admissions" stroke="#06b6d4" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
 <Line type="monotone" dataKey="Discharges" stroke="#10b981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} />
 </LineChart>
 </ResponsiveContainer>
 </div>
 </motion.div>

 {/* Department Load */}
 <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
 <h3 className="text-lg font-bold text-slate-900 mb-2">Department Load</h3>
 <p className="text-sm text-slate-500 mb-6">Distribution across wards</p>
 <div className="flex-1 w-full flex items-center justify-center">
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={deptData}
 cx="50%"
 cy="50%"
 innerRadius={80}
 outerRadius={110}
 paddingAngle={5}
 dataKey="value"
 stroke="none"
 >
 {deptData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
 ))}
 </Pie>
 <Tooltip 
 contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px', color: '#fff' }} 
 itemStyle={{ color: '#fff' }}
 />
 </PieChart>
 </ResponsiveContainer>
 </div>
 </motion.div>
 </motion.div>

 <motion.div 
 variants={containerVariants}
 initial="hidden"
 animate="show"
 className="grid grid-cols-1 lg:grid-cols-2 gap-6"
 >
 {/* Revenue Bar Chart */}
 <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
 <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trend (YTD)</h3>
 <div className="h-[300px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
 <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
 <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
 <Tooltip 
 contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px', color: '#fff' }} 
 formatter={(value) => [`₹${value}`, 'Revenue']}
 cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
 />
 <Bar dataKey="revenue" fill="#06b6d4" radius={[6, 6, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </motion.div>

 {/* Quick Actions based on Role */}
 <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
 <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
 
 <div className="space-y-4">
 <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-md">
 <div>
 <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Admit New Patient</h4>
 <p className="text-sm text-slate-500 mt-1">Register a walk-in or emergency patient</p>
 </div>
 <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
 <ArrowRight className="w-5 h-5" />
 </div>
 </div>

 <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-purple-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-md">
 <div>
 <h4 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">Bed Management</h4>
 <p className="text-sm text-slate-500 mt-1">View ward map and reassign beds</p>
 </div>
 <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
 <ArrowRight className="w-5 h-5" />
 </div>
 </div>

 <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-md">
 <div>
 <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Generate Invoice</h4>
 <p className="text-sm text-slate-500 mt-1">Process billing and discharge procedures</p>
 </div>
 <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
 <ArrowRight className="w-5 h-5" />
 </div>
 </div>
 </div>
 </motion.div>
 </motion.div>
 </motion.div>
 )
}
