"use client"

import { motion } from "framer-motion"
import { Users, Phone, Calendar as CalendarIcon, UserPlus, CreditCard, ArrowRight, Ambulance } from 'lucide-react'

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

const waitingList = [
  { time: "09:00 AM", patient: "Rajesh Kumar", token: "T-01", status: "Waiting" },
  { time: "09:30 AM", patient: "Priya Singh", token: "T-02", status: "Consulting" },
  { time: "09:45 AM", patient: "Amit Patel", token: "T-03", status: "Waiting" },
  { time: "10:00 AM", patient: "Neha Gupta", token: "T-04", status: "Next" },
]

export function ReceptionistDashboard({ userName }: { userName: string }) {
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
              <p className="text-slate-500 text-sm font-medium">Walk-ins Today</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">42</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Appointments</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">128</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <CalendarIcon className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Pending Payments</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">15</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl">
              <CreditCard className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Ambulances</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">2</h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-2xl">
              <Ambulance className="w-6 h-6 text-rose-500" />
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
          <h3 className="text-lg font-bold text-slate-900 mb-6">OPD Waiting List</h3>
          <div className="space-y-4">
            {waitingList.map((pt, idx) => (
              <div key={idx} className={`flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-cyan-500 transition-all cursor-pointer group`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm font-bold text-cyan-600">
                    {pt.token}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{pt.patient}</h4>
                    <p className="text-sm text-slate-500">{pt.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    pt.status === 'Waiting' ? 'bg-amber-100 text-amber-700' :
                    pt.status === 'Next' ? 'bg-cyan-100 text-cyan-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {pt.status}
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
                <h4 className="font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">Register Patient</h4>
                <p className="text-sm text-slate-500 mt-1">Walk-in or Emergency</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                <UserPlus className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Collect Payment</h4>
                <p className="text-sm text-slate-500 mt-1">OPD Registration Fee</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-amber-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">Dispatch Ambulance</h4>
                <p className="text-sm text-slate-500 mt-1">Manage active fleet</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Ambulance className="w-5 h-5" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
