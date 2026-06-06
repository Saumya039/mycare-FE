"use client"

import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session } = useSession()

  if (!session) return null

  const role = session.user.role

  return (
    <div className="p-8">
      {/* RBAC specific content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Total Active Patients</h3>
          <p className="text-3xl font-bold">142</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Available Beds</h3>
          <p className="text-3xl font-bold">18</p>
        </div>
        
        {role === "ADMIN" ? (
          <div className="p-6 rounded-2xl bg-purple-900/20 border border-purple-500/20">
            <h3 className="text-purple-400 text-sm font-medium mb-2">System Status</h3>
            <p className="text-xl font-bold text-purple-300">All Systems Operational</p>
          </div>
        ) : role === "DOCTOR" ? (
          <div className="p-6 rounded-2xl bg-blue-900/20 border border-blue-500/20">
            <h3 className="text-blue-400 text-sm font-medium mb-2">My Appointments Today</h3>
            <p className="text-3xl font-bold text-blue-300">8</p>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-emerald-900/20 border border-emerald-500/20">
            <h3 className="text-emerald-400 text-sm font-medium mb-2">My Ward Status</h3>
            <p className="text-xl font-bold text-emerald-300">Nominal</p>
          </div>
        )}
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800">
        <h3 className="text-xl font-semibold mb-4">Role-Based Authentication Active</h3>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          You are currently logged in as a <strong>{role}</strong>. The backend safely injects your role into the NextAuth session, which is used to conditionally render navigation items, dashboard metrics, and secure API routes.
          <br/><br/>
          To test the other roles, sign out and log in with: <br/>
          <code className="text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded mx-1 mt-2 inline-block">doctor@mycare.com</code> or <code className="text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded mx-1 inline-block">nurse@mycare.com</code>
          <br/>(Password: password123)
        </p>
      </div>
    </div>
  )
}
