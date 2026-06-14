"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Truck, Plus, Search, MapPin, Phone, CheckCircle2, Navigation, Loader2 } from "lucide-react"

export default function AmbulancesPage() {
  const { data: session } = useSession()
  const [ambulances, setAmbulances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ vehicleNumber: "", driverName: "", driverPhone: "", type: "Basic Life Support", location: "" })

  const fetchAmbulances = () => {
    setLoading(true)
    fetch("/api/ambulances")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAmbulances(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAmbulances()
  }, [])

  const handleAddAmbulance = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/ambulances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        setIsModalOpen(false)
        setForm({ vehicleNumber: "", driverName: "", driverPhone: "", type: "Basic Life Support", location: "" })
        fetchAmbulances()
      } else {
        alert("Failed to add ambulance")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/ambulances/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      fetchAmbulances()
    } catch (e) {
      console.error(e)
    }
  }

  if (!session) return null

  const availableCount = ambulances.filter(a => a.status === "available").length
  const dispatchedCount = ambulances.filter(a => a.status === "dispatched").length
  const maintenanceCount = ambulances.filter(a => a.status === "maintenance").length

  return (
    <div className="p-8 h-full bg-slate-950 text-slate-100 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Truck className="w-8 h-8 text-amber-500" /> Ambulance Dispatch
          </h1>
          <p className="text-slate-400">Manage emergency vehicle fleet and dispatch operations</p>
        </div>

        {(["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["NURSE", "SUPER_ADMIN"].includes(session.user.role)) && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all font-medium"
          >
            <Plus className="w-5 h-5" /> Register Vehicle
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-center">
          <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Available Fleet
          </h3>
          <p className="text-4xl font-bold text-slate-100">{availableCount}</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 flex flex-col justify-center">
          <h3 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
            <Navigation className="w-5 h-5" /> En Route
          </h3>
          <p className="text-4xl font-bold text-slate-100">{dispatchedCount}</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 flex flex-col justify-center">
          <h3 className="text-slate-400 font-semibold mb-2 flex items-center gap-2">
            <Truck className="w-5 h-5" /> In Maintenance
          </h3>
          <p className="text-4xl font-bold text-slate-100">{maintenanceCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-500">Loading fleet status...</div>
        ) : ambulances.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500 bg-slate-900/50 border border-slate-800 rounded-2xl">No ambulances registered.</div>
        ) : (
          ambulances.map(amb => (
            <div key={amb.id} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-slate-700 transition-colors">
              <div className={`h-2 w-full ${amb.status === 'available' ? 'bg-emerald-500' : amb.status === 'dispatched' ? 'bg-amber-500' : 'bg-slate-500'}`} />
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-200">{amb.licensePlate}</h3>
                    <p className="text-sm text-slate-500">{amb.type}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1
                    ${amb.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      amb.status === 'dispatched' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                    {amb.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Driver</p>
                      <p className="font-medium">{amb.driverName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Contact</p>
                      <p className="font-mono">{amb.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Current Location</p>
                      <p className="font-medium truncate max-w-[200px]">{amb.lastLocation || "Unknown"}</p>
                    </div>
                  </div>
                </div>

                {(["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["NURSE", "SUPER_ADMIN"].includes(session.user.role)) && (
                  <div className="pt-4 border-t border-slate-800 flex gap-2">
                    {amb.status === "available" ? (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(amb.id, "dispatched")}
                          className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                        >
                          Dispatch
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(amb.id, "maintenance")}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                        >
                          Send to Maintenance
                        </button>
                      </>
                    ) : amb.status === "dispatched" ? (
                      <button 
                        onClick={() => handleUpdateStatus(amb.id, "available")}
                        className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                      >
                        Complete Run & Return
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUpdateStatus(amb.id, "available")}
                        className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                      >
                        Maintenance Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-500" /> Register New Ambulance
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200 transition-colors">✕</button>
            </div>
            <form onSubmit={handleAddAmbulance} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Vehicle Number</label>
                <input 
                  type="text" required placeholder="e.g. MH-12-AB-1234"
                  value={form.vehicleNumber} onChange={(e) => setForm({...form, vehicleNumber: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Ambulance Type</label>
                <select 
                  required 
                  value={form.type} 
                  onChange={(e) => setForm({...form, type: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Basic Life Support">Basic Life Support (BLS)</option>
                  <option value="Advanced Life Support">Advanced Life Support (ALS)</option>
                  <option value="Patient Transport">Patient Transport</option>
                  <option value="Neonatal">Neonatal</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Driver Name</label>
                  <input 
                    type="text" required
                    value={form.driverName} onChange={(e) => setForm({...form, driverName: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Contact Phone</label>
                  <input 
                    type="tel" required
                    value={form.driverPhone} onChange={(e) => setForm({...form, driverPhone: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Base Location</label>
                <input 
                  type="text" required placeholder="e.g. Main Hospital Base"
                  value={form.location} onChange={(e) => setForm({...form, location: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              
              <div className="pt-4 border-t border-slate-800 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
