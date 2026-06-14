"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Activity, Calendar as CalendarIcon, CheckCircle2, UserCheck } from "lucide-react"

export default function AttendancePage() {
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState<any[]>([])
  const [clockingIn, setClockingIn] = useState(false)
  const [todayRecord, setTodayRecord] = useState<any>(null)

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/hr/attendance")
      const data = await res.json()
      if (Array.isArray(data)) {
        setRecords(data)
        const today = new Date().toDateString()
        const tr = data.find(r => new Date(r.date).toDateString() === today)
        setTodayRecord(tr || null)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleClockInOut = async () => {
    setClockingIn(true)
    try {
      const res = await fetch("/api/hr/attendance", { method: "POST", body: JSON.stringify({}) })
      const data = await res.json()
      if (res.ok) {
        fetchAttendance()
      } else {
        alert(data.error)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setClockingIn(false)
    }
  }

  const formatTime = (isoString: string) => {
    if (!isoString) return "--:--"
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <UserCheck className="text-cyan-500 w-8 h-8" />
            Attendance & Biometrics
          </h1>
          <p className="text-slate-500 mt-1">Clock in/out and view your historical attendance records.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Clock In Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="lg:col-span-1 bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center"
        >
          <div className="w-24 h-24 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center mb-6 shadow-inner">
            <Clock className="w-10 h-10 text-cyan-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Current Status</h2>
          
          <div className="mb-8">
            {loading ? (
              <p className="text-slate-400">Loading...</p>
            ) : !todayRecord ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-600 dark:text-slate-400 font-medium text-sm">
                Not Clocked In
              </span>
            ) : !todayRecord.clockOut ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 font-medium text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Active Shift
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-medium text-sm">
                <CheckCircle2 className="w-4 h-4" /> Shift Completed
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleClockInOut}
            disabled={loading || clockingIn || (todayRecord && todayRecord.clockOut)}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
              !todayRecord 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/40' 
                : !todayRecord.clockOut 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-red-500/40'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {clockingIn ? "Processing..." : !todayRecord ? "Clock In Now" : !todayRecord.clockOut ? "Clock Out" : "Done for Today"}
          </motion.button>
        </motion.div>

        {/* History Table */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 dark:border-[#1e293b] flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-cyan-500" /> Recent Attendance Log
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-[#111c44]/50 text-slate-500 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Clock In</th>
                  <th className="px-6 py-4 font-medium">Clock Out</th>
                  <th className="px-6 py-4 font-medium">Work Hours</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading records...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No attendance history found.</td></tr>
                ) : records.map((record, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + (i * 0.05) }}
                    key={record.id} className="hover:bg-slate-50 dark:hover:bg-[#152353] transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">
                      {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{formatTime(record.clockIn)}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{formatTime(record.clockOut)}</td>
                    <td className="px-6 py-4 text-slate-800 dark:text-slate-300 font-mono">
                      {record.workHours ? record.workHours.toFixed(2) + ' hrs' : '--'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        record.status === 'Present' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
