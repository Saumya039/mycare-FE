"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar as CalendarIcon, Clock, Users, Activity } from "lucide-react"

export default function CalendarPage() {
  const [data, setData] = useState<any>({ appointments: [], rosters: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCalendarData()
  }, [])

  const fetchCalendarData = async () => {
    try {
      const res = await fetch("/api/calendar")
      const result = await res.json()
      if (result.appointments) setData(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Very basic grouping by date (just taking the date string part)
  const groupedAppointments = data.appointments.reduce((acc: any, curr: any) => {
    const d = new Date(curr.date).toLocaleDateString()
    if (!acc[d]) acc[d] = []
    acc[d].push(curr)
    return acc
  }, {})

  const groupedRosters = data.rosters.reduce((acc: any, curr: any) => {
    const d = new Date(curr.date).toLocaleDateString()
    if (!acc[d]) acc[d] = []
    acc[d].push(curr)
    return acc
  }, {})

  // Get unique dates
  const allDates = Array.from(new Set([...Object.keys(groupedAppointments), ...Object.keys(groupedRosters)])).sort(
    (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime()
  )

  return (
    <div className="p-4 lg:p-8 space-y-8 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <CalendarIcon className="text-cyan-500 w-8 h-8" />
            Hospital Calendar
          </h1>
          <p className="text-slate-500 mt-1">Unified view of upcoming appointments and staff shift rosters.</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-slate-500 text-center py-20">Loading calendar data...</div>
      ) : allDates.length === 0 ? (
        <div className="bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl p-12 text-center text-slate-500">
          No upcoming schedule found.
        </div>
      ) : (
        <div className="space-y-6">
          {allDates.map((dateStr, index) => (
            <motion.div 
              key={dateStr}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className="bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl shadow-sm overflow-hidden"
            >
              <div className="p-4 bg-slate-50/50 dark:bg-[#111c44]/50 border-b border-slate-200 dark:border-[#1e293b]">
                <h2 className="text-lg font-bold text-slate-100">{new Date(dateStr).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Appointments for this date */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Patient Appointments
                  </h3>
                  <div className="space-y-3">
                    {groupedAppointments[dateStr] ? groupedAppointments[dateStr].map((apt: any) => (
                      <div key={apt.id} className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Activity className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100">{apt.patient?.name}</p>
                          <p className="text-sm text-slate-500">with Dr. {apt.doctor?.name}</p>
                          <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(apt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    )) : <p className="text-sm text-slate-400 italic">No appointments</p>}
                  </div>
                </div>

                {/* Duty Rosters for this date */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Staff Duty Roster
                  </h3>
                  <div className="space-y-3">
                    {groupedRosters[dateStr] ? groupedRosters[dateStr].map((rst: any) => (
                      <div key={rst.id} className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                          <CalendarIcon className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100">{rst.user?.name}</p>
                          <p className="text-sm text-slate-500">{rst.user?.role} - {rst.department}</p>
                          <p className="text-xs text-orange-500 mt-1">
                            {rst.shiftName} Shift {rst.wardOrFloor && `(${rst.wardOrFloor})`}
                          </p>
                        </div>
                      </div>
                    )) : <p className="text-sm text-slate-400 italic">No duty rosters scheduled</p>}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
