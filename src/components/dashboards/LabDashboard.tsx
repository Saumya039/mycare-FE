"use client"

import { motion } from "framer-motion"
import { FlaskConical, ClipboardList, CheckCircle2, ArrowRight, Clock, Activity } from 'lucide-react'

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

const pendingTests = [
  { id: "LAB-4091", patient: "Rajesh Kumar", test: "Complete Blood Count", type: "Pathology", priority: "High" },
  { id: "LAB-4092", patient: "Amit Patel", test: "Chest X-Ray", type: "Radiology", priority: "Normal" },
  { id: "LAB-4093", patient: "Neha Gupta", test: "Lipid Profile", type: "Pathology", priority: "Normal" },
]

export function LabDashboard({ userName, role }: { userName: string, role: string }) {
  const isRadiology = role === "RADIOLOGIST"
  const title = isRadiology ? "Radiology Dashboard" : "Pathology Dashboard"

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
              <p className="text-slate-500 text-sm font-medium">Pending Requests</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">16</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Completed Today</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">45</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Urgent Samples</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">3</h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-2xl">
              <Activity className="w-6 h-6 text-rose-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total {isRadiology ? 'Scans' : 'Tests'}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">61</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-2xl">
              {isRadiology ? <Activity className="w-6 h-6 text-indigo-500" /> : <FlaskConical className="w-6 h-6 text-indigo-500" />}
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
          <h3 className="text-lg font-bold text-slate-900 mb-6">Pending {isRadiology ? 'Scans' : 'Tests'}</h3>
          <div className="space-y-4">
            {pendingTests.filter(t => isRadiology ? t.type === 'Radiology' : t.type === 'Pathology').map((test, idx) => (
              <div key={idx} className={`flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-cyan-500 transition-all cursor-pointer group`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                    <ClipboardList className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{test.patient}</h4>
                    <p className="text-sm text-slate-500">{test.id} • {test.test}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    test.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {test.priority} Priority
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                </div>
              </div>
            ))}
            {pendingTests.filter(t => isRadiology ? t.type === 'Radiology' : t.type === 'Pathology').length === 0 && (
               <div className="text-center py-8 text-slate-500">No pending tasks.</div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-cyan-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">Upload Report</h4>
                <p className="text-sm text-slate-500 mt-1">Submit test results</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Scan Document</h4>
                <p className="text-sm text-slate-500 mt-1">Digitize physical forms</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ClipboardList className="w-5 h-5" />
              </div>
            </div>
            
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
