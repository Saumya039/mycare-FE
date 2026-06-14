"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, UserPlus, Clock, Activity, Calendar as CalendarIcon, Filter, Search, Plus, X } from "lucide-react"

const MOCK_OPD_PATIENTS = [
  { id: "OPD-101", name: "Rahul Verma", age: 34, gender: "Male", doctor: "Dr. Sharma", status: "Waiting", time: "09:30 AM" },
  { id: "OPD-102", name: "Priya Singh", age: 28, gender: "Female", doctor: "Dr. Patel", status: "In Consultation", time: "09:45 AM" },
  { id: "OPD-103", name: "Amit Kumar", age: 45, gender: "Male", doctor: "Dr. Sharma", status: "Completed", time: "08:15 AM" },
  { id: "OPD-104", name: "Neha Gupta", age: 52, gender: "Female", doctor: "Dr. Reddy", status: "Waiting", time: "10:00 AM" },
]

export default function OPDPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewPatientModal, setShowNewPatientModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  return (
    <div className="p-4 lg:p-8 space-y-8 pb-20">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Users className="text-cyan-500 w-8 h-8" />
            OPD - Out Patient
          </h1>
          <p className="text-slate-500 mt-1">Manage outpatient department visits, queuing, and consultations.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewPatientModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow"
        >
          <Plus className="w-5 h-5" /> New OPD Patient
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: "Total Visits Today", value: "124", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Currently Waiting", value: "18", icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "In Consultation", value: "6", icon: Activity, color: "text-cyan-500", bg: "bg-cyan-500/10" },
          { label: "New Registrations", value: "45", icon: UserPlus, color: "text-green-500", bg: "bg-green-500/10" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white/60 dark:bg-[#111c44]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(6,182,212,0.1)] transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-100 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Table Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 dark:border-[#1e293b] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Patient Name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#111c44] border border-slate-200 dark:border-[#1e293b] rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111c44] border border-slate-200 dark:border-[#1e293b] text-slate-700 dark:text-slate-300 rounded-xl hover:bg-white dark:hover:bg-[#152353] hover:border-cyan-500/50 transition-all shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111c44] border border-slate-200 dark:border-[#1e293b] text-slate-700 dark:text-slate-300 rounded-xl hover:bg-white dark:hover:bg-[#152353] hover:border-cyan-500/50 transition-all shadow-sm">
              <CalendarIcon className="w-4 h-4" /> Today
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-[#111c44]/50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Patient ID</th>
                <th className="px-6 py-4 font-medium">Patient Name</th>
                <th className="px-6 py-4 font-medium">Age / Gender</th>
                <th className="px-6 py-4 font-medium">Consultant</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
              {MOCK_OPD_PATIENTS.map((patient, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  key={patient.id} 
                  className="hover:bg-slate-50 dark:hover:bg-[#152353] transition-colors group"
                >
                  <td className="px-6 py-4 text-slate-800 dark:text-slate-300 font-medium">{patient.id}</td>
                  <td className="px-6 py-4 text-slate-100 font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      {patient.name.charAt(0)}
                    </div>
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{patient.age} Y / {patient.gender.charAt(0)}</td>
                  <td className="px-6 py-4 text-slate-800 dark:text-slate-300">{patient.doctor}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{patient.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      patient.status === 'Waiting' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                      patient.status === 'In Consultation' ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' :
                      'bg-green-500/10 text-green-500 border border-green-500/20'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedPatient(patient)}
                      className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* NEW PATIENT MODAL */}
      <AnimatePresence>
        {showNewPatientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowNewPatientModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0b1437] border border-slate-200 dark:border-[#1e293b] rounded-3xl shadow-2xl p-6 lg:p-8"
            >
              <button onClick={() => setShowNewPatientModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">New OPD Patient</h2>
              <p className="text-slate-500 mb-6 text-sm">Register a new patient for outpatient consultation.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <input type="text" className="w-full mt-1 px-4 py-2.5 bg-[#111c44] border border-slate-200 dark:border-[#1e293b] rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g. John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Age</label>
                    <input type="number" className="w-full mt-1 px-4 py-2.5 bg-[#111c44] border border-slate-200 dark:border-[#1e293b] rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g. 35" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
                    <select className="w-full mt-1 px-4 py-2.5 bg-[#111c44] border border-slate-200 dark:border-[#1e293b] rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assign Doctor</label>
                  <select className="w-full mt-1 px-4 py-2.5 bg-[#111c44] border border-slate-200 dark:border-[#1e293b] rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100">
                    <option>Dr. Sharma (Cardiology)</option>
                    <option>Dr. Patel (Neurology)</option>
                    <option>Dr. Reddy (General)</option>
                  </select>
                </div>
                <button 
                  onClick={() => setShowNewPatientModal(false)}
                  className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all hover:-translate-y-0.5"
                >
                  Register Patient
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW PROFILE MODAL */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPatient(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-[#0b1437] border-l border-slate-200 dark:border-[#1e293b] shadow-2xl p-6 lg:p-8 overflow-y-auto"
            >
              <button onClick={() => setSelectedPatient(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-800 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-8 mt-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-cyan-500/20">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{selectedPatient.name}</h2>
                  <p className="text-slate-500">{selectedPatient.id}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-[#111c44] rounded-2xl border border-slate-200 dark:border-[#1e293b]">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Patient Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-slate-500">Age:</span><span className="font-medium text-slate-800 dark:text-slate-200">{selectedPatient.age} Years</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Gender:</span><span className="font-medium text-slate-800 dark:text-slate-200">{selectedPatient.gender}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Blood Group:</span><span className="font-medium text-slate-800 dark:text-slate-200">O+</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="font-medium text-slate-800 dark:text-slate-200">+91 9876543210</span></div>
                  </div>
                </div>

                <div className="p-4 bg-[#111c44] rounded-2xl border border-slate-200 dark:border-[#1e293b]">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Current Visit</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-slate-500">Doctor:</span><span className="font-medium text-cyan-600 dark:text-cyan-400">{selectedPatient.doctor}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Time:</span><span className="font-medium text-slate-800 dark:text-slate-200">{selectedPatient.time}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Status:</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        selectedPatient.status === 'Waiting' ? 'bg-orange-500/10 text-orange-500' :
                        selectedPatient.status === 'In Consultation' ? 'bg-cyan-500/10 text-cyan-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {selectedPatient.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4 mt-auto">
                <button 
                  onClick={() => window.location.href = '/consultation'}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
                >
                  Start Consult
                </button>
                <button 
                  onClick={() => alert("Edit details functionality coming soon")}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 rounded-xl transition-all"
                >
                  Edit Details
                </button>
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
