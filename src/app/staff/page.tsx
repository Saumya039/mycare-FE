"use client"

import { useSession } from "@/context/FirebaseAuthContext"
import { useEffect, useState } from "react"
import { Users, Phone, Clock, BriefcaseMedical, Home, Plus } from "lucide-react"

type Staff = {
 id: string
 name: string
 email: string
 role: string
 department: string | null
 shiftStart: string | null
 shiftEnd: string | null
 contactInfo: string | null
 homeAddress: string | null
}

export default function StaffPage() {
 const { data: session } = useSession()
 const [staffList, setStaffList] = useState<Staff[]>([])
 const [loading, setLoading] = useState(true)
 const [isSubmitting, setIsSubmitting] = useState(false)

 const [editModalOpen, setEditModalOpen] = useState(false)
 const [shiftModalOpen, setShiftModalOpen] = useState(false)
 const [addModalOpen, setAddModalOpen] = useState(false)
 const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
 
 const [profileForm, setProfileForm] = useState({ departmentName: "", contactInfo: "", homeAddress: "" })
 const [shiftForm, setShiftForm] = useState({ shiftStart: "", shiftEnd: "" })
 const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "DOCTOR", department: "Emergency", contactInfo: "", homeAddress: "" })

 const fetchStaff = () => {
 fetch("/api/staff")
 .then(res => res.json())
 .then(data => {
 if (Array.isArray(data)) setStaffList(data)
 setLoading(false)
 })
 }

 useEffect(() => {
 fetchStaff()
 }, [])

 const handleUpdateProfile = async (e: React.FormEvent) => {
 e.preventDefault()
 if (!selectedStaff) return
 setIsSubmitting(true)
 try {
 const res = await fetch(`/api/staff/${selectedStaff.id}`, {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ action: "profile", ...profileForm })
 })
 if (res.ok) {
 setEditModalOpen(false)
 fetchStaff()
 }
 } catch (err) {
 alert("Failed to update profile")
 } finally {
 setIsSubmitting(false)
 }
 }

 const handleUpdateShift = async (e: React.FormEvent) => {
 e.preventDefault()
 if (!selectedStaff) return
 setIsSubmitting(true)
 try {
 const res = await fetch(`/api/staff/${selectedStaff.id}`, {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ action: "shift", ...shiftForm })
 })
 if (res.ok) {
 setShiftModalOpen(false)
 fetchStaff()
 }
 } catch (err) {
 alert("Failed to update shift")
 } finally {
 setIsSubmitting(false)
 }
 }

 const handleAddStaff = async (e: React.FormEvent) => {
 e.preventDefault()
 setIsSubmitting(true)
 try {
 const res = await fetch("/api/staff", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(addForm)
 })
 if (res.ok) {
 setAddModalOpen(false)
 setAddForm({ name: "", email: "", password: "", role: "DOCTOR", department: "Emergency", contactInfo: "", homeAddress: "" })
 fetchStaff()
 } else {
 const err = await res.json()
 alert(err.error || "Failed to add staff")
 }
 } catch (err) {
 alert("Failed to add staff")
 } finally {
 setIsSubmitting(false)
 }
 }

 if (!session) return null

 const isCurrentlyOnShift = (start: string | null, end: string | null) => {
 if (!start || !end) return false
 const now = new Date()
 const currentHour = now.getHours()
 const currentMin = now.getMinutes()
 const currentTime = currentHour + currentMin / 60

 const [startH, startM] = start.split(":").map(Number)
 const [endH, endM] = end.split(":").map(Number)
 
 const startTime = startH + startM / 60
 let endTime = endH + endM / 60
 
 if (endTime < startTime) {
 return currentTime >= startTime || currentTime <= endTime
 }
 return currentTime >= startTime && currentTime <= endTime
 }

 return (
 <div className="p-8 h-full bg-slate-50 text-slate-900 overflow-y-auto">
 <div className="mb-8 flex justify-between items-center">
 <div>
 <h1 className="text-2xl font-bold flex items-center gap-3">
 <Users className="w-6 h-6 text-cyan-400" /> Staff Directory
 </h1>
 <p className="text-slate-500">Manage hospital personnel, roles, and shift schedules</p>
 </div>

 {["ADMIN", "SUPER_ADMIN"].includes(session.user.role) && (
 <button 
 onClick={() => setAddModalOpen(true)}
 className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
 >
 <Plus className="w-5 h-5" />
 Add Staff Member
 </button>
 )}
 </div>

 {loading ? (
 <div className="text-slate-500">Loading directory...</div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {staffList.map(staff => {
 const onShift = isCurrentlyOnShift(staff.shiftStart, staff.shiftEnd)
 
 return (
 <div key={staff.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-colors">
 <div className="flex justify-between items-start mb-4">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-cyan-400">
 {staff.name.charAt(0)}
 </div>
 <div>
 <h3 className="font-semibold text-lg">{staff.name}</h3>
 <p className="text-xs text-slate-500">
 {staff.role} • {staff.department || "General"}
 </p>
 </div>
 </div>
 </div>

 <div className="space-y-3 mt-6">
 <div className="flex items-center gap-3 text-sm text-slate-700">
 <Clock className="w-4 h-4 text-slate-500" />
 <span>
 {staff.shiftStart && staff.shiftEnd 
 ? `${staff.shiftStart} - ${staff.shiftEnd}` 
 : "No shift assigned"}
 </span>
 {staff.shiftStart && (
 <span className={`ml-auto px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${onShift ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-100 text-slate-500'}`}>
 {onShift ? 'On Shift' : 'Off Duty'}
 </span>
 )}
 </div>
 
 <div className="flex items-center gap-3 text-sm text-slate-700">
 <Phone className="w-4 h-4 text-slate-500" />
 <span className="truncate">{staff.contactInfo || staff.email}</span>
 </div>

 {staff.homeAddress && (
 <div className="flex items-start gap-3 text-sm text-slate-700">
 <Home className="w-4 h-4 text-slate-500 mt-0.5" />
 <span className="flex-1">{staff.homeAddress}</span>
 </div>
 )}
 </div>

 {["ADMIN", "SUPER_ADMIN"].includes(session.user.role) && (
 <div className="mt-6 pt-4 border-t border-slate-200 flex gap-2">
 <button 
 onClick={() => {
 setSelectedStaff(staff)
 setProfileForm({ 
 departmentName: staff.department || "", 
 contactInfo: staff.contactInfo || "",
 homeAddress: staff.homeAddress || ""
 })
 setEditModalOpen(true)
 }}
 className="flex-1 bg-slate-100 hover:bg-slate-700 py-2 rounded-lg text-xs font-medium text-slate-700 transition-colors"
 >
 Edit Profile
 </button>
 <button 
 onClick={() => {
 setSelectedStaff(staff)
 setShiftForm({ shiftStart: staff.shiftStart || "", shiftEnd: staff.shiftEnd || "" })
 setShiftModalOpen(true)
 }}
 className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 py-2 rounded-lg text-xs font-medium transition-colors border border-cyan-500/20"
 >
 Change Shift
 </button>
 </div>
 )}
 </div>
 )
 })}
 </div>
 )}

 {/* ADD STAFF MODAL */}
 {addModalOpen && (
 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
 <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
 <h3 className="font-semibold text-lg">Add New Staff Member</h3>
 <button onClick={() => setAddModalOpen(false)} className="text-slate-500 hover:text-slate-800">✕</button>
 </div>
 <form onSubmit={handleAddStaff} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
 <input required type="text" value={addForm.name} onChange={(e) => setAddForm({...addForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Email (Login ID)</label>
 <input required type="email" value={addForm.email} onChange={(e) => setAddForm({...addForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500" />
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Password</label>
 <input required type="password" value={addForm.password} onChange={(e) => setAddForm({...addForm, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Role</label>
 <select value={addForm.role} onChange={(e) => setAddForm({...addForm, role: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500">
 <option value="DOCTOR">Doctor</option>
 <option value="NURSE">Nurse</option>
 <option value="ADMIN">Admin</option>
 </select>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Department</label>
 <select value={addForm.department} onChange={(e) => setAddForm({...addForm, department: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500">
 <option>Emergency</option>
 <option>ICU</option>
 <option>Cardiology</option>
 <option>Neurology</option>
 <option>Pediatrics</option>
 <option>General</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Phone Number</label>
 <input type="tel" value={addForm.contactInfo} onChange={(e) => setAddForm({...addForm, contactInfo: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500" />
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Home Address</label>
 <textarea rows={2} value={addForm.homeAddress} onChange={(e) => setAddForm({...addForm, homeAddress: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500 resize-none"></textarea>
 </div>

 <div className="pt-4 border-t border-slate-200 flex gap-3">
 <button type="button" onClick={() => setAddModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-700 rounded-xl text-sm font-medium">Cancel</button>
 <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-medium disabled:opacity-50">Create Account</button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* EDIT PROFILE MODAL */}
 {editModalOpen && selectedStaff && (
 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
 <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
 <h3 className="font-semibold text-lg">Edit Profile: {selectedStaff.name}</h3>
 <button onClick={() => setEditModalOpen(false)} className="text-slate-500 hover:text-slate-800">✕</button>
 </div>
 <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Department</label>
 <input 
 type="text" 
 value={profileForm.departmentName}
 onChange={(e) => setProfileForm({...profileForm, departmentName: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Phone Number</label>
 <input 
 type="text" 
 value={profileForm.contactInfo}
 onChange={(e) => setProfileForm({...profileForm, contactInfo: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Home Address</label>
 <textarea 
 rows={2}
 value={profileForm.homeAddress}
 onChange={(e) => setProfileForm({...profileForm, homeAddress: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500 resize-none"
 ></textarea>
 </div>
 <div className="pt-4 border-t border-slate-200 flex gap-3">
 <button type="button" onClick={() => setEditModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-700 rounded-xl text-sm font-medium">Cancel</button>
 <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-medium disabled:opacity-50">Save Profile</button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* CHANGE SHIFT MODAL */}
 {shiftModalOpen && selectedStaff && (
 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
 <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
 <h3 className="font-semibold text-lg">Change Shift: {selectedStaff.name}</h3>
 <button onClick={() => setShiftModalOpen(false)} className="text-slate-500 hover:text-slate-800">✕</button>
 </div>
 <form onSubmit={handleUpdateShift} className="p-6 space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Start Time (HH:MM)</label>
 <input 
 type="time" 
 required
 value={shiftForm.shiftStart}
 onChange={(e) => setShiftForm({...shiftForm, shiftStart: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">End Time (HH:MM)</label>
 <input 
 type="time" 
 required
 value={shiftForm.shiftEnd}
 onChange={(e) => setShiftForm({...shiftForm, shiftEnd: e.target.value})}
 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
 />
 </div>
 </div>
 <div className="pt-4 border-t border-slate-200 flex gap-3">
 <button type="button" onClick={() => setShiftModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-700 rounded-xl text-sm font-medium">Cancel</button>
 <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-medium disabled:opacity-50">Save Shift</button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 )
}
