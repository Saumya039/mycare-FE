"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, KeyRound, Loader2, User, ArrowLeft } from "lucide-react"

export default function PortalLogin() {
  const [patientId, setPatientId] = useState("")
  const [portalPin, setPortalPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/patients/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, portalPin })
      })
      
      if (res.ok) {
        localStorage.setItem("portal_patient_id", patientId)
        localStorage.setItem("portal_pin", portalPin)
        router.push("/portal/dashboard")
      } else {
        const errData = await res.json()
        setError(errData.error || "Invalid Patient ID or PIN. Please check your credentials.")
      }
    } catch (e) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900 relative">
      {/* Navigation */}
      <div className="absolute top-8 right-8 flex items-center gap-4 z-20">
        <Link href="/login" className="px-5 py-2 rounded-full border border-slate-200 bg-white backdrop-blur text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Staff Portal
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Shield className="mx-auto h-12 w-12 text-cyan-500" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Sevra Technologies Patient Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Access your electronic health records securely
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl shadow-cyan-500/10 sm:rounded-2xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-slate-700">
                Patient ID
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="patientId"
                  name="patientId"
                  type="text"
                  required
                  placeholder="e.g. P-1001"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="portalPin" className="block text-sm font-medium text-slate-700">
                4-Digit Secure PIN
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="portalPin"
                  name="portalPin"
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={portalPin}
                  onChange={(e) => setPortalPin(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all text-center tracking-[0.5em] font-bold"
                />
              </div>
            </div>

            {error && <div className="text-red-400 text-sm font-medium">{error}</div>}

            <div>
              <button
                type="submit"
                disabled={loading || !patientId || portalPin.length < 4}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Secure Login"}
              </button>
            </div>
            
            <div className="text-center text-xs text-slate-500 mt-4 border-t border-slate-200 pt-4">
              <Shield className="w-4 h-4 mx-auto mb-1 opacity-50" />
              Your Patient ID and 4-Digit PIN are provided on your admission slip.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
