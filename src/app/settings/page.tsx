"use client"

import { useSession } from "@/context/NativeAuthContext"
import { Settings, Server, Database, Shield, Save } from "lucide-react"

export default function SettingsPage() {
 const { data: session } = useSession()

 if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
 return <div className="p-8 text-red-400">Unauthorized. Only Administrators can view System Configuration.</div>
 }

 return (
 <div className="p-8 h-full bg-slate-50 text-slate-900 overflow-y-auto">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h1 className="text-2xl font-bold flex items-center gap-3">
 <Settings className="w-6 h-6 text-slate-500" /> System Configuration
 </h1>
 <p className="text-slate-500">Manage hospital-wide settings and integrations</p>
 </div>
 
 <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-5 py-2 rounded-xl shadow-lg transition-all font-medium">
 <Save className="w-4 h-4" /> Save Changes
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 
 {/* Hospital Details */}
 <div className="bg-white border border-slate-200 rounded-2xl p-6">
 <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
 <Server className="w-5 h-5 text-cyan-400" /> General Settings
 </h2>
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Hospital Name</label>
 <input type="text" defaultValue="Sevra Technologies Memorial Hospital" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Contact Email</label>
 <input type="email" defaultValue="admin@Sevra Technologies.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-cyan-500" />
 </div>
 <div className="flex items-center justify-between pt-2">
 <span className="text-sm text-slate-700">Enable New Admissions</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input type="checkbox" defaultChecked className="sr-only peer" />
 <div className="w-11 h-6 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
 </label>
 </div>
 </div>
 </div>

 {/* System Diagnostics */}
 <div className="bg-white border border-slate-200 rounded-2xl p-6">
 <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
 <Database className="w-5 h-5 text-purple-400" /> Serva AI & Integrations
 </h2>
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-500 mb-1">Gemini API Key</label>
 <input type="password" value="************************" readOnly className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed" />
 <p className="text-xs text-slate-500 mt-1">Stored securely in environment variables.</p>
 </div>
 
 <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
 <span className="text-sm text-slate-700">Serva AI Auto-Summarization</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input type="checkbox" defaultChecked className="sr-only peer" />
 <div className="w-11 h-6 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
 </label>
 </div>
 </div>
 </div>

 </div>
 </div>
 )
}
