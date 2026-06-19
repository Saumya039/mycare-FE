"use client"

import { motion } from "framer-motion"
import { Pill, AlertTriangle, Package, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

const prescriptions = [
  { id: "RX-1029", patient: "Rajesh Kumar", items: 3, status: "Pending" },
  { id: "RX-1030", patient: "Amit Patel", items: 1, status: "Ready" },
  { id: "RX-1031", patient: "Neha Gupta", items: 5, status: "Pending" },
]

export function PharmacistDashboard({ userName }: { userName: string }) {
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
              <p className="text-slate-500 text-sm font-medium">Pending Prescriptions</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">24</h3>
            </div>
            <div className="p-3 bg-cyan-50 rounded-2xl">
              <Pill className="w-6 h-6 text-cyan-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Low Stock Items</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">12</h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Expiring Soon</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">8</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Inventory</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">1,402</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <Package className="w-6 h-6 text-emerald-500" />
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
          <h3 className="text-lg font-bold text-slate-900 mb-6">Prescription Queue</h3>
          <div className="space-y-4">
            {prescriptions.map((rx, idx) => (
              <div key={idx} className={`flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-cyan-500 transition-all cursor-pointer group`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                    <Pill className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{rx.patient}</h4>
                    <p className="text-sm text-slate-500">{rx.id} • {rx.items} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    rx.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {rx.status}
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-cyan-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">Dispense Meds</h4>
                <p className="text-sm text-slate-500 mt-1">Fulfill prescription</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-rose-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">Stock Alert</h4>
                <p className="text-sm text-slate-500 mt-1">Order low inventory</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Manage Stock</h4>
                <p className="text-sm text-slate-500 mt-1">Update inventory count</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Package className="w-5 h-5" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
