"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Calendar as CalendarIcon, Clock, User as UserIcon, Plus, Edit3 } from "lucide-react"

type Appointment = {
  id: string
  date: string
  reason: string
  status: string
  isFollowUp: boolean
  patient: { name: string, patientId: string }
  doctor: { name: string }
}

export default function AppointmentsPage() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [newApt, setNewApt] = useState({ patientId: "", doctorId: "", date: "", reason: "", isFollowUp: false })

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editApt, setEditApt] = useState({ id: "", date: "", reason: "", status: "", isFollowUp: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchAppointments = () => {
    fetch("/api/appointments")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAppointments(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApt)
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        setIsScheduleModalOpen(false)
        setNewApt({ patientId: "", doctorId: "", date: "", reason: "", isFollowUp: false })
        fetchAppointments()
      }
    } catch (err) {
      alert("Failed to schedule appointment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/appointments/${editApt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editApt)
      })
      if (res.ok) {
        setIsEditModalOpen(false)
        fetchAppointments()
      } else {
        alert("Failed to update appointment")
      }
    } catch (err) {
      alert("Failed to update appointment")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) return null

  return (
    <div className="p-8 h-full bg-slate-950 text-slate-100 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-purple-400" /> Appointments & Follow-ups
          </h1>
          <p className="text-slate-400">Manage patient consultations, surgeries, and follow-ups</p>
        </div>

        {(["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["NURSE", "SUPER_ADMIN"].includes(session.user.role)) && (
          <button 
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
          >
            <Plus className="w-5 h-5" /> Schedule New
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col: Upcoming list */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold border-b border-slate-800 pb-2 mb-4">Upcoming Schedule</h2>
          {loading ? (
            <div className="text-slate-500">Loading schedule...</div>
          ) : appointments.length === 0 ? (
            <div className="text-slate-500 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-center">No upcoming appointments.</div>
          ) : (
            appointments.map(apt => {
              const aptDate = new Date(apt.date)
              // Local format to populate datetime-local input safely
              const localIsoStr = new Date(aptDate.getTime() - (aptDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
              return (
                <div key={apt.id} className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex items-center gap-6">
                  
                  {/* Date Block */}
                  <div className="flex flex-col items-center justify-center bg-slate-950 rounded-xl p-3 border border-slate-800 min-w-24 relative overflow-hidden">
                    {apt.isFollowUp && <div className="absolute top-0 w-full bg-purple-500 text-[9px] font-bold text-center text-white py-0.5 uppercase tracking-widest">Follow-Up</div>}
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-2">{aptDate.toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-2xl font-black text-purple-400">{aptDate.getDate()}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-slate-200">{apt.patient.name} <span className="text-xs text-slate-500 font-normal ml-2">({apt.patient.patientId})</span></h3>
                        <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                          <UserIcon className="w-4 h-4" /> with {apt.doctor.name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${apt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : apt.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                          {apt.status}
                        </span>
                        {(["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["NURSE", "SUPER_ADMIN"].includes(session.user.role) || ["DOCTOR", "SUPER_ADMIN"].includes(session.user.role)) && (
                          <button 
                            onClick={() => {
                              setEditApt({ id: apt.id, date: localIsoStr, reason: apt.reason, status: apt.status, isFollowUp: apt.isFollowUp || false })
                              setIsEditModalOpen(true)
                            }}
                            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-xs font-medium"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm bg-slate-950/50 rounded-lg px-3 py-2 border border-slate-800 inline-block text-slate-300">
                      <span className="text-slate-500 mr-2">Reason:</span> {apt.reason}
                    </div>
                  </div>

                </div>
              )
            })
          )}
        </div>

        {/* Right Col: Mini Calendar / Stats */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4 border-b border-slate-800 pb-2">Today's Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Scheduled</span>
                <span className="font-semibold text-slate-200 text-lg">{appointments.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Follow-ups</span>
                <span className="font-semibold text-purple-400 text-lg">{appointments.filter(a => a.isFollowUp).length}</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-sm font-medium transition-colors">
              View Full Calendar
            </button>
          </div>
        </div>

      </div>

      {/* SCHEDULE MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-400" /> Schedule Appointment
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-200 transition-colors">✕</button>
            </div>
            <form onSubmit={handleSchedule} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Patient ID</label>
                <input 
                  type="text" required placeholder="e.g. P-1001"
                  value={newApt.patientId} onChange={(e) => setNewApt({...newApt, patientId: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Doctor ID (User ID)</label>
                <input 
                  type="text" required placeholder="Doctor's Database ID"
                  value={newApt.doctorId} onChange={(e) => setNewApt({...newApt, doctorId: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Date & Time</label>
                <input 
                  type="datetime-local" required
                  value={newApt.date} onChange={(e) => setNewApt({...newApt, date: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Reason</label>
                <textarea 
                  required rows={2}
                  value={newApt.reason} onChange={(e) => setNewApt({...newApt, reason: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
                ></textarea>
              </div>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:border-purple-500/50">
                <input type="checkbox" checked={newApt.isFollowUp} onChange={e => setNewApt({...newApt, isFollowUp: e.target.checked})} className="w-4 h-4 accent-purple-500" />
                <span className="text-sm">Mark as Follow-up Appointment</span>
              </label>
              
              <div className="pt-4 border-t border-slate-800 flex gap-3">
                <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-400" /> Edit Appointment
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-200 transition-colors">✕</button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Date & Time</label>
                <input 
                  type="datetime-local" required
                  value={editApt.date} onChange={(e) => setEditApt({...editApt, date: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Reason</label>
                <textarea 
                  required rows={2}
                  value={editApt.reason} onChange={(e) => setEditApt({...editApt, reason: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                <select value={editApt.status} onChange={(e) => setEditApt({...editApt, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500">
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:border-purple-500/50">
                <input type="checkbox" checked={editApt.isFollowUp} onChange={e => setEditApt({...editApt, isFollowUp: e.target.checked})} className="w-4 h-4 accent-purple-500" />
                <span className="text-sm">Mark as Follow-up</span>
              </label>
              
              <div className="pt-4 border-t border-slate-800 flex gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
