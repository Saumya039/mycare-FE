"use client"

import { motion } from "framer-motion"
import { Calendar, Users, Activity, FileText, ArrowRight, Clock } from 'lucide-react'

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

const appointments = [
  { time: "09:00 AM", patient: "Rajesh Kumar", type: "Follow-up", status: "Waiting" },
  { time: "09:30 AM", patient: "Priya Singh", type: "Consultation", status: "Confirmed" },
  { time: "10:15 AM", patient: "Amit Patel", type: "Report Review", status: "Delayed" },
  { time: "11:00 AM", patient: "Neha Gupta", type: "Consultation", status: "Confirmed" },
]

export function DoctorDashboard({ userName }: { userName: string }) {
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
        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-500 text-sm font-medium">Today's Appointments</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">12</h3>
            </div>
            <div className="p-3 bg-cyan-50 rounded-2xl group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-cyan-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-500 text-sm font-medium">My IPD Patients</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">5</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-2xl group-hover:scale-110 transition-transform">
              <Bed className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-500 text-sm font-medium">Pending Reports</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">3</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-500 text-sm font-medium">Next Shift</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Tomorrow, 9 AM</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-emerald-500" />
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
        {/* Appointments List */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Today's Queue</h3>
          <div className="space-y-4">
            {appointments.map((apt, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-cyan-500 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-700 shadow-sm">
                    {apt.time.split(' ')[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{apt.patient}</h4>
                    <p className="text-sm text-slate-500">{apt.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    apt.status === 'Waiting' ? 'bg-amber-100 text-amber-700' :
                    apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {apt.status}
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-4 flex-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-cyan-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group shadow-sm">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">Write Prescription</h4>
                <p className="text-sm text-slate-500 mt-1">Draft a new e-prescription</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group shadow-sm">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">IPD Rounds</h4>
                <p className="text-sm text-slate-500 mt-1">View admitted patients</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-purple-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group shadow-sm">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">Lab Results</h4>
                <p className="text-sm text-slate-500 mt-1">Review pending pathology reports</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
// Keep an extra generic Bed icon import here for consistency if needed later
import { Bed } from 'lucide-react'
