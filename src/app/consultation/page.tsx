"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Video, Search, Plus, ExternalLink, Calendar, CheckCircle2 } from "lucide-react"

export default function ConsultationPage() {
  const [consults, setConsults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ patientName: '', doctorName: '', date: '', meetingLink: '' })

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    try {
      const res = await fetch("/api/consultation")
      const result = await res.json()
      if (result.consultations) setConsults(result.consultations)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setShowModal(false)
        setFormData({ patientName: '', doctorName: '', date: '', meetingLink: '' })
        fetchConsultations()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const markCompleted = async (id: string) => {
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        body: JSON.stringify({ action: "updateStatus", id })
      })
      if (res.ok) fetchConsultations()
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
            <Video className="text-blue-500 w-8 h-8" />
            Live Consultation
          </h1>
          <p className="text-slate-500 mt-1">Schedule and manage telehealth video appointments.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <Calendar className="w-5 h-5" /> Schedule Meeting
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-slate-200 dark:border-[#1e293b] flex justify-between items-center bg-slate-50/50 dark:bg-[#111c44]/50">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search consultations..." className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-blue-500 transition-colors" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-[#111c44]/50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Scheduled Date & Time</th>
                <th className="px-6 py-4 font-medium">Patient Name</th>
                <th className="px-6 py-4 font-medium">Doctor</th>
                <th className="px-6 py-4 font-medium">Meeting Link</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading schedule...</td></tr>
              ) : consults.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No live consultations scheduled.</td></tr>
              ) : consults.map((consult, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + (i * 0.05) }}
                  key={consult.id} className="hover:bg-slate-50 dark:hover:bg-[#152353] transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{new Date(consult.date).toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-100">{consult.patientName}</td>
                  <td className="px-6 py-4 text-slate-300">Dr. {consult.doctorName}</td>
                  <td className="px-6 py-4">
                    <a href={consult.meetingLink} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
                      Join <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      consult.status === 'Completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                    }`}>
                      {consult.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {consult.status !== 'Completed' && (
                      <button 
                        onClick={() => markCompleted(consult.id)}
                        className="text-emerald-500 hover:text-emerald-600 font-medium text-sm flex items-center gap-1 justify-end w-full transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Done
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Schedule Modal */}
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
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Video className="text-blue-500 w-6 h-6" /> Schedule Consultation
                </h2>
              </div>
              <form onSubmit={handleSchedule} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Patient Name</label>
                  <input required value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Doctor Name</label>
                  <input required value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="e.g. Sarah Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Date & Time</label>
                  <input required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} type="datetime-local" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Meeting Link (Zoom/Meet)</label>
                  <input required value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} type="url" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="https://meet.google.com/..." />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">Schedule</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
