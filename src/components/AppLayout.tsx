"use client"

import { useSession, signOut } from "next-auth/react"
import { LogOut, Activity, Users, Settings, ShieldAlert, Sparkles, Calendar } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ServaAIPanel } from "./ServaAIPanel"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isAIOpen, setIsAIOpen] = useState(false)

  if (status === "loading") return <div className="h-screen bg-slate-950 flex items-center justify-center text-cyan-400">Loading...</div>
  if (!session) return <>{children}</>

  const role = session.user.role
  const isPortal = pathname.startsWith("/portal")

  if (isPortal) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Sevra Technologies
          </h1>
          <p className="text-xs text-slate-500 mt-1">Serva AI System</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}>
            <Activity className="w-5 h-5" /> Dashboard
          </Link>
          
          {(role === "ADMIN" || role === "DOCTOR" || role === "NURSE") && (
            <>
              <Link href="/patients" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/patients" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}>
                <Users className="w-5 h-5" /> Patients
              </Link>
              <Link href="/beds" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/beds" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}>
                <Activity className="w-5 h-5" /> Bed Management
              </Link>
              <Link href="/monitoring" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/monitoring" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}>
                <Activity className="w-5 h-5" /> Live Telemetry
              </Link>
              <Link href="/appointments" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/appointments" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}>
                <Calendar className="w-5 h-5" /> Appointments
              </Link>
              <Link href="/staff" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/staff" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}>
                <Users className="w-5 h-5" /> Staff Directory
              </Link>
              <Link href="/inventory" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/inventory" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}>
                <Activity className="w-5 h-5" /> Pharmacy
              </Link>
              <Link href="/labs" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/labs" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}>
                <Activity className="w-5 h-5" /> Labs & Diagnostics
              </Link>
              <Link href="/blood-bank" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/blood-bank" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}>
                <Activity className="w-5 h-5" /> Blood Bank
              </Link>
              <Link href="/ambulances" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/ambulances" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}>
                <Activity className="w-5 h-5" /> Ambulance Dispatch
              </Link>
              {role === "ADMIN" && (
                <Link href="/billing" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/billing" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}>
                  <Activity className="w-5 h-5" /> Billing & Finance
                </Link>
              )}
            </>
          )}

          {role === "ADMIN" && (
            <Link href="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === "/settings" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}>
              <Settings className="w-5 h-5" /> System Config
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-sm">
              {session.user.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-slate-400 truncate">{role}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 border-b border-slate-800 flex items-center px-8 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold capitalize">
            {pathname === "/" ? `Welcome back, ${session.user.name}` : pathname.replace("/", "")}
          </h2>
          
          <div className="ml-auto flex items-center gap-4">
            <button 
              onClick={() => setIsAIOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-400 px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)]"
            >
              <Sparkles className="w-4 h-4" /> Ask Serva AI
            </button>

            <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2
              ${role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : ''}
              ${role === 'DOCTOR' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : ''}
              ${role === 'NURSE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
            `}>
              {role === 'ADMIN' && <ShieldAlert className="w-3 h-3" />}
              {role} ACCESS
            </span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        {children}
      </main>

      {/* Slide-over AI Panel */}
      <ServaAIPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  )
}
