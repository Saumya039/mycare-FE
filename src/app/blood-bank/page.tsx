"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Droplet, Plus, Search, CheckCircle2, ArrowRightLeft, Heart, Loader2 } from "lucide-react"

export default function BloodBankPage() {
  const { data: session } = useSession()
  const [bloodBags, setBloodBags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ bloodType: "A+", units: "1", expiryDate: "" })

  const fetchBloodBags = () => {
    setLoading(true)
    fetch("/api/bloodbank")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBloodBags(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchBloodBags()
  }, [])

  const handleAddBlood = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const unitsNum = parseInt(form.units)
      // Create 'units' number of entries
      const promises = Array.from({ length: unitsNum }).map(() => 
        fetch("/api/bloodbank", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bloodType: form.bloodType, expiryDate: form.expiryDate })
        })
      )
      await Promise.all(promises)
      setIsModalOpen(false)
      setForm({ bloodType: "A+", units: "1", expiryDate: "" })
      fetchBloodBags()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/bloodbank/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      fetchBloodBags()
    } catch (e) {
      console.error(e)
    }
  }

  if (!session) return null

  // Calculate totals
  const availableBags = bloodBags.filter(b => b.status === "available")
  const totals = availableBags.reduce((acc, bag) => {
    acc[bag.bloodType] = (acc[bag.bloodType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  return (
    <div className="p-8 h-full bg-slate-950 text-slate-100 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Droplet className="w-8 h-8 text-red-500" /> Blood Bank
          </h1>
          <p className="text-slate-400">Manage blood inventory and transfusions</p>
        </div>

        {(["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["NURSE", "SUPER_ADMIN"].includes(session.user.role)) && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all font-medium"
          >
            <Plus className="w-5 h-5" /> Add Inventory
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {bloodTypes.map(type => (
          <div key={type} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-2xl font-bold text-slate-200 mb-1 z-10">{type}</h3>
            <p className="text-sm font-medium text-red-400 z-10 flex items-center gap-1">
              <Droplet className="w-3 h-3" /> {totals[type] || 0} Units
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search blood bags..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-sm">
                <th className="p-4 font-medium">Bag ID</th>
                <th className="p-4 font-medium">Blood Type</th>
                <th className="p-4 font-medium">Collection Date</th>
                <th className="p-4 font-medium">Expiry Date</th>
                <th className="p-4 font-medium">Status</th>
                {(["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["NURSE", "SUPER_ADMIN"].includes(session.user.role)) && <th className="p-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading inventory...</td></tr>
              ) : bloodBags.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No blood bags in inventory.</td></tr>
              ) : (
                bloodBags.map(bag => (
                  <tr key={bag.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono text-sm text-slate-400">{bag.id.substring(0, 8).toUpperCase()}</td>
                    <td className="p-4 font-bold text-red-400 text-lg">{bag.bloodType}</td>
                    <td className="p-4 text-sm text-slate-300">{new Date(bag.collectionDate).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-slate-300">{new Date(bag.expiryDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit
                        ${bag.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          bag.status === 'used' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                          'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {bag.status.toUpperCase()}
                      </span>
                    </td>
                    {(["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["NURSE", "SUPER_ADMIN"].includes(session.user.role)) && (
                      <td className="p-4 text-right">
                        {bag.status === "available" && (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleUpdateStatus(bag.id, "used")}
                              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            >
                              Mark Used
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(bag.id, "expired")}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            >
                              Discard
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Droplet className="w-5 h-5 text-red-400" /> Add Blood Inventory
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200 transition-colors">✕</button>
            </div>
            <form onSubmit={handleAddBlood} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Blood Type</label>
                <select 
                  required 
                  value={form.bloodType} 
                  onChange={(e) => setForm({...form, bloodType: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-red-500"
                >
                  {bloodTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Number of Units (Bags)</label>
                <input 
                  type="number" required min="1" max="50"
                  value={form.units} onChange={(e) => setForm({...form, units: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Expiry Date</label>
                <input 
                  type="date" required
                  value={form.expiryDate} onChange={(e) => setForm({...form, expiryDate: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
              
              <div className="pt-4 border-t border-slate-800 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Add Inventory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
