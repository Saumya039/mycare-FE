"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, CalendarClock, Check, X, Plus } from "lucide-react"

export default function HrPage() {
  const [leaves, setLeaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ leaveType: 'Sick', startDate: '', endDate: '', reason: '' })

  useEffect(() => {
    fetchLeaves()
  }, [])

  const fetchLeaves = async () => {
    try {
      const res = await fetch("/api/hr/leaves")
      const data = await res.json()
      if (Array.isArray(data)) setLeaves(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/hr/leaves", {
        method: "POST",
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setShowModal(false)
        fetchLeaves()
      } else {
        const data = await res.json()
        alert(data.error)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const updateLeaveStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/hr/leaves", {
        method: "PATCH",
        body: JSON.stringify({ id, status })
      })
      if (res.ok) fetchLeaves()
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
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Briefcase className="text-purple-500 w-8 h-8" />
            HR & Leave Management
          </h1>
          <p className="text-slate-500 mt-1">Manage staff leave requests and HR operations.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Apply for Leave
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 dark:border-[#1e293b] bg-slate-50/50 dark:bg-[#111c44]/50">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-purple-500" /> Pending & Recent Leave Requests
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-[#111c44]/50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Staff Member</th>
                <th className="px-6 py-4 font-medium">Leave Type</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading requests...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No leave requests found.</td></tr>
              ) : leaves.map((leave, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + (i * 0.05) }}
                  key={leave.id} className="hover:bg-slate-50 dark:hover:bg-[#152353] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-100">{leave.user.name}</div>
                    <div className="text-sm text-slate-500">{leave.user.department || leave.user.role}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{leave.leaveType}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title={leave.reason}>
                    {leave.reason}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      leave.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 
                      leave.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 
                      'bg-orange-500/10 text-orange-500'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {leave.status === 'Pending' && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateLeaveStatus(leave.id, "Approved")} className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateLeaveStatus(leave.id, "Rejected")} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* New Leave Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Plus className="text-purple-500 w-6 h-6" /> Apply for Leave
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Leave Type</label>
                  <select required value={formData.leaveType} onChange={e => setFormData({...formData, leaveType: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 transition-colors">
                    <option>Sick</option>
                    <option>Casual</option>
                    <option>Paid</option>
                    <option>Unpaid</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
                    <input required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">End Date</label>
                    <input required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Reason</label>
                  <textarea required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 transition-colors" placeholder="Please provide details..." />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95">
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
