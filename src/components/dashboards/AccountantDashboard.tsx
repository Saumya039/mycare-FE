"use client"

import { motion } from "framer-motion"
import { CreditCard, TrendingUp, FileText, ArrowRight, DollarSign, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

const revenueData = [
  { name: 'Mon', revenue: 420 },
  { name: 'Tue', revenue: 380 },
  { name: 'Wed', revenue: 510 },
  { name: 'Thu', revenue: 470 },
  { name: 'Fri', revenue: 590 },
  { name: 'Sat', revenue: 620 },
  { name: 'Sun', revenue: 300 },
]

export function AccountantDashboard({ userName }: { userName: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 lg:p-8 space-y-8 pb-20"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Today's Revenue</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">₹420k</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Pending Invoices</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">18</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Pending TPA</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">12</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Expenses</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">₹140k</h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-2xl">
              <DollarSign className="w-6 h-6 text-rose-500" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trend (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px', color: '#fff' }} 
                  formatter={(value: any) => [`₹${value}k`, 'Revenue']}
                  cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Generate Invoice</h4>
                <p className="text-sm text-slate-500 mt-1">Process patient billing</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">TPA Claims</h4>
                <p className="text-sm text-slate-500 mt-1">Process insurance claims</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-purple-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">Finance Report</h4>
                <p className="text-sm text-slate-500 mt-1">Export daily summary</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
