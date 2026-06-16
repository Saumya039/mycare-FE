"use client"

import { useSession } from "@/context/FirebaseAuthContext"
import { signOut as firebaseSignOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { LogOut, Activity, Users, Settings, ShieldAlert, Sparkles, Calendar, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ServaAIPanel } from "./ServaAIPanel"
import { useTheme } from "./ThemeProvider"

import Image from "next/image"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname() || ""
  const router = useRouter()
  const [isAIOpen, setIsAIOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleSignOut = async () => {
    if (auth) {
      await firebaseSignOut(auth)
    }
    router.push("/login")
  }

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/login" && !pathname.startsWith("/portal")) {
      router.push("/login")
    }
  }, [status, pathname, router])

  if (status === "loading") {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>
  }

  // Allow login page and patient portal to render without a session
  if (pathname === "/login" || pathname.startsWith("/portal")) {
    return <>{children}</>
  }

  if (status === "unauthenticated" && pathname !== "/login" && !pathname.startsWith("/portal")) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Redirecting to login...</div>
  }

  if (!session) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Authenticating...</div>
  }

  const role = session.user.role

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-50 overflow-hidden transition-colors duration-500">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-[#0b1437] border-r border-slate-200 dark:border-slate-200 flex flex-col transition-colors duration-500 z-30">
        <div className="p-6 border-b border-slate-200 dark:border-slate-200">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/30">
              <Image src="/logo.jpg" alt="Sevra AI Logo" fill className="object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 dark:text-slate-900 tracking-tight">Sevra AI</h1>
              <p className="text-[10px] text-slate-500 tracking-widest uppercase">Enterprise System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {[
            { name: "Dashboard", icon: Activity, href: "/", roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE", "ACCOUNTANT", "RECEPTIONIST", "PHARMACIST", "PATHOLOGIST", "RADIOLOGIST"] },
            { name: "Patient", icon: Users, href: "/patients", roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"] },
            { name: "Billing", icon: Activity, href: "/billing", roles: ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"] },
            { name: "Appointment", icon: Calendar, href: "/appointments", roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTIONIST"] },
            { name: "OPD - Out Patient", icon: Activity, href: "/opd", roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE"] },
            { name: "IPD - In Patient", icon: Activity, href: "/ipd", roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE"] },
            { name: "Pharmacy", icon: Activity, href: "/pharmacy", roles: ["SUPER_ADMIN", "ADMIN", "PHARMACIST"] },
            { name: "Pathology", icon: Activity, href: "/pathology", roles: ["SUPER_ADMIN", "ADMIN", "PATHOLOGIST"] },
            { name: "Radiology", icon: Activity, href: "/radiology", roles: ["SUPER_ADMIN", "ADMIN", "RADIOLOGIST"] },
            { name: "Blood Bank", icon: Activity, href: "/blood-bank", roles: ["SUPER_ADMIN", "ADMIN", "PATHOLOGIST"] },
            { name: "Ambulance", icon: Activity, href: "/ambulances", roles: ["SUPER_ADMIN", "ADMIN", "RECEPTIONIST"] },
            { name: "Front Office", icon: Activity, href: "/front-office", roles: ["SUPER_ADMIN", "ADMIN", "RECEPTIONIST"] },
            { name: "Birth & Death Record", icon: Activity, href: "/records", roles: ["SUPER_ADMIN", "ADMIN"] },
            { name: "Multi Branch", icon: Activity, href: "/branches", roles: ["SUPER_ADMIN"] },
            { name: "Human Resource", icon: Users, href: "/hr", roles: ["SUPER_ADMIN", "ADMIN"] },
            { name: "QR Code Attendance", icon: Activity, href: "/attendance", roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "ACCOUNTANT", "PHARMACIST", "PATHOLOGIST", "RADIOLOGIST"] },
            { name: "Duty Roster", icon: Activity, href: "/roster", roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "ACCOUNTANT", "PHARMACIST", "PATHOLOGIST", "RADIOLOGIST"] },
            { name: "Annual Calendar", icon: Calendar, href: "/calendar", roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "ACCOUNTANT", "PHARMACIST", "PATHOLOGIST", "RADIOLOGIST"] },
            { name: "Referral", icon: Activity, href: "/referral", roles: ["SUPER_ADMIN", "ADMIN", "RECEPTIONIST"] },
            { name: "TPA Management", icon: Activity, href: "/tpa", roles: ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"] },
            { name: "Finance", icon: Activity, href: "/finance", roles: ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"] },
            { name: "Messaging", icon: Activity, href: "/messaging", roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "ACCOUNTANT", "PHARMACIST", "PATHOLOGIST", "RADIOLOGIST"] },
            { name: "Inventory", icon: Activity, href: "/inventory", roles: ["SUPER_ADMIN", "ADMIN", "PHARMACIST"] },
            { name: "Download Center", icon: Activity, href: "/downloads", roles: ["SUPER_ADMIN", "ADMIN"] },
            { name: "Certificate", icon: Activity, href: "/certificates", roles: ["SUPER_ADMIN", "ADMIN", "RECEPTIONIST"] },
            { name: "Live Consultation", icon: Activity, href: "/consultation", roles: ["SUPER_ADMIN", "ADMIN", "DOCTOR"] },
            { name: "Reports", icon: Activity, href: "/reports", roles: ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT", "DOCTOR"] },
            { name: "Setup", icon: Settings, href: "/settings", roles: ["SUPER_ADMIN", "ADMIN"] }
          ].filter(item => item.roles.includes(role)).map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === item.href ? "bg-[#0d6efd] text-white shadow-md shadow-blue-500/20" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              <item.icon className="w-4 h-4" /> {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-50 rounded-xl mb-4 border border-slate-100 dark:border-slate-300">
            <div className="w-10 h-10 rounded-full bg-[#0d6efd] flex items-center justify-center font-bold text-sm text-white">
              {session.user.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-900 truncate">{session.user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-600 truncate">{role}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar relative">
        <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-slate-50/80 sticky top-0 z-20 border-b border-slate-200 dark:border-slate-200 transition-colors shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold capitalize text-slate-900 dark:text-slate-900 tracking-tight">
              {pathname === "/" ? "Overview" : pathname.replace("/", "").replace("-", " ")}
            </h2>
            <div className="hidden md:flex h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <p className="hidden md:block text-sm text-slate-500 dark:text-slate-600">
              {pathname === "/" ? `Welcome back, ${session.user.name}. Here is today's overview.` : "Enterprise System Workspace"}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAIOpen(true)}
              className="group flex items-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-100 dark:hover:bg-slate-700 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Sparkles className="w-4 h-4 group-hover:animate-pulse" /> Ask Sevra AI
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#111c44] border border-slate-200 dark:border-[#1e293b]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-700">
                {role.replace('_', ' ')}
              </span>
            </div>
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
