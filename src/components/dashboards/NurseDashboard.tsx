"use client"

import { motion } from "framer-motion"
import { Activity, Thermometer, Bell, ArrowRight, BedDouble, Stethoscope } from 'lucide-react'

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

const tasks = [
  { time: "10:00 AM", patient: "Rajesh Kumar (Bed 42)", task: "Administer IV Antibiotics", type: "Medication", urgent: true },
  { time: "10:30 AM", patient: "Priya Singh (Bed 12)", task: "Check Vitals", type: "Observation", urgent: false },
  { time: "11:00 AM", patient: "Amit Patel (ICU-3)", task: "Change Dressing", type: "Care", urgent: false },
]

export function NurseDashboard({ userName }: { userName: string }) {
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
              <p className="text-slate-500 text-sm font-medium">Assigned Patients</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">14</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <BedDouble className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Pending Tasks</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">8</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl">
              <Activity className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Alerts</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">2</h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-2xl">
              <Bell className="w-6 h-6 text-rose-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Ward Capacity</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">85% Full</h3>
            </div>
            <div className="p-3 bg-cyan-50 rounded-2xl">
              <Activity className="w-6 h-6 text-cyan-500" />
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
          <h3 className="text-lg font-bold text-slate-900 mb-6">Upcoming Care Tasks</h3>
          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <div key={idx} className={`flex items-center justify-between p-4 bg-slate-50 border rounded-2xl hover:bg-white transition-all cursor-pointer group ${task.urgent ? 'border-rose-200 hover:border-rose-500' : 'border-slate-200 hover:border-cyan-500'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-white border rounded-full flex items-center justify-center shadow-sm ${task.urgent ? 'border-rose-200 text-rose-600' : 'border-slate-200 text-slate-700'}`}>
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{task.patient}</h4>
                    <p className={`text-sm ${task.urgent ? 'text-rose-500 font-medium' : 'text-slate-500'}`}>{task.task}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-600">{task.time}</span>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Record Vitals</h4>
                <p className="text-sm text-slate-500 mt-1">Log temperature, BP, HR</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Medication Round</h4>
                <p className="text-sm text-slate-500 mt-1">View dispense list</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-rose-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">Report Emergency</h4>
                <p className="text-sm text-slate-500 mt-1">Code Blue / Code Red</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <Bell className="w-5 h-5" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
