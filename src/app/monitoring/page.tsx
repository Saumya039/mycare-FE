"use client"

import { useSession } from "@/context/SupabaseAuthContext"
import { useEffect, useState } from "react"
import { HeartPulse, Wind, Activity, AlertTriangle } from "lucide-react"

type LiveVital = {
 patientId: string
 name: string
 status: string
 department: string
 heartRate: number
 oxygenLevel: number
 systolic: number
 diastolic: number
}

export default function MonitoringPage() {
 const { data: session } = useSession()
 const [vitals, setVitals] = useState<LiveVital[]>([])
 const [connectionStatus, setConnectionStatus] = useState<"connecting" | "live" | "offline">("connecting")

 useEffect(() => {
 let evtSource: EventSource

 const connectStream = () => {
 evtSource = new EventSource("/api/vitals/stream")

 evtSource.onmessage = (event) => {
 setConnectionStatus("live")
 try {
 const data = JSON.parse(event.data)
 setVitals(data)
 } catch (e) {
 // Parse error or connection message
 }
 }

 evtSource.onerror = () => {
 setConnectionStatus("offline")
 evtSource.close()
 // Try to reconnect in 5s
 setTimeout(connectStream, 5000)
 }
 }

 connectStream()

 return () => {
 if (evtSource) evtSource.close()
 }
 }, [])

 if (!session) return null

 return (
 <div className="p-8 h-full bg-slate-50 text-slate-900">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h1 className="text-2xl font-bold flex items-center gap-3">
 <Activity className="w-6 h-6 text-cyan-400" /> Live Telemetry
 </h1>
 <p className="text-slate-500">Real-time vital sign monitoring across all departments</p>
 </div>

 <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 border
 ${connectionStatus === 'live' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
 connectionStatus === 'connecting' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
 'bg-red-500/10 text-red-400 border-red-500/20'}
 `}>
 <div className={`w-2 h-2 rounded-full ${connectionStatus === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
 {connectionStatus.toUpperCase()}
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
 {vitals.length === 0 && connectionStatus === "live" && (
 <div className="col-span-full p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
 No active patients are currently being monitored. Admit a patient to begin telemetry.
 </div>
 )}

 {vitals.map(v => {
 const isHrCritical = v.heartRate > 100 || v.heartRate < 60
 const isO2Critical = v.oxygenLevel < 95

 return (
 <div 
 key={v.patientId} 
 className={`bg-white border rounded-2xl p-5 shadow-xl transition-all ${
 v.status === 'critical' || isHrCritical || isO2Critical 
 ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-pulse' 
 : 'border-slate-200'
 }`}
 >
 <div className="flex justify-between items-start mb-4 border-b border-slate-200 pb-3">
 <div>
 <h3 className="font-semibold text-slate-800 truncate pr-2" title={v.name}>{v.name}</h3>
 <p className="text-xs text-slate-500">{v.patientId} • {v.department}</p>
 </div>
 {(isHrCritical || isO2Critical || v.status === "critical") && (
 <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
 )}
 </div>

 <div className="grid grid-cols-2 gap-4">
 {/* Heart Rate */}
 <div className="space-y-1">
 <div className="flex items-center gap-1.5 text-xs text-slate-500">
 <HeartPulse className={`w-3.5 h-3.5 ${isHrCritical ? 'text-red-400' : 'text-cyan-400'}`} />
 HR (bpm)
 </div>
 <div className={`text-3xl font-bold font-mono tracking-tighter ${isHrCritical ? 'text-red-400' : 'text-slate-900'}`}>
 {v.heartRate}
 </div>
 </div>

 {/* SpO2 */}
 <div className="space-y-1">
 <div className="flex items-center gap-1.5 text-xs text-slate-500">
 <Wind className={`w-3.5 h-3.5 ${isO2Critical ? 'text-red-400' : 'text-blue-400'}`} />
 SpO2 (%)
 </div>
 <div className={`text-3xl font-bold font-mono tracking-tighter ${isO2Critical ? 'text-red-400' : 'text-slate-900'}`}>
 {v.oxygenLevel}
 </div>
 </div>

 {/* Blood Pressure */}
 <div className="col-span-2 mt-2 pt-3 border-t border-slate-200/50 flex justify-between items-end">
 <span className="text-xs text-slate-500 uppercase font-medium tracking-wider">NIBP</span>
 <span className="text-lg font-mono font-medium text-slate-700">
 {v.systolic}/{v.diastolic}
 </span>
 </div>
 </div>
 </div>
 )
 })}
 </div>
 </div>
 )
}
