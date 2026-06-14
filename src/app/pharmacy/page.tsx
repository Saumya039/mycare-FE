"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pill, Search, PackagePlus, CheckCircle2, AlertCircle } from "lucide-react"

export default function PharmacyPage() {
  const [data, setData] = useState<any>({ inventory: [], prescriptions: [] })
  const [loading, setLoading] = useState(true)
  const [showRestockModal, setShowRestockModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [restockQty, setRestockQty] = useState('')

  useEffect(() => {
    fetchPharmacyData()
  }, [])

  const fetchPharmacyData = async () => {
    try {
      const res = await fetch("/api/pharmacy")
      const result = await res.json()
      if (result.inventory) setData(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDispense = async (prescriptionId: string) => {
    try {
      const res = await fetch("/api/pharmacy", {
        method: "POST",
        body: JSON.stringify({ action: "dispense", prescriptionId })
      })
      if (res.ok) fetchPharmacyData()
    } catch (e) {
      console.error(e)
    }
  }

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return
    try {
      const res = await fetch("/api/pharmacy", {
        method: "POST",
        body: JSON.stringify({ action: "restock", itemId: selectedItem.id, quantity: restockQty })
      })
      if (res.ok) {
        setShowRestockModal(false)
        setSelectedItem(null)
        setRestockQty('')
        fetchPharmacyData()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const openRestock = (item: any) => {
    setSelectedItem(item)
    setShowRestockModal(true)
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Pill className="text-emerald-500 w-8 h-8" />
            Pharmacy Central
          </h1>
          <p className="text-slate-500 mt-1">Manage medicine inventory and dispense active prescriptions.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prescriptions Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl shadow-sm overflow-hidden flex flex-col h-[600px]"
        >
          <div className="p-6 border-b border-slate-200 dark:border-[#1e293b] bg-slate-50/50 dark:bg-[#111c44]/50">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Active Prescriptions
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="text-center text-slate-500 py-10">Loading prescriptions...</div>
            ) : data.prescriptions.length === 0 ? (
              <div className="text-center text-slate-500 py-10">No active prescriptions to dispense.</div>
            ) : data.prescriptions.map((rx: any) => (
              <div key={rx.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-900 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-100">{rx.medicationName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-600 dark:text-slate-400">{rx.dosage}</span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Patient: <span className="font-medium text-slate-800 dark:text-slate-300">{rx.patient?.name}</span> ({rx.patient?.patientId})
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Prescribed by Dr. {rx.doctor?.name} • {rx.frequency} for {rx.duration}
                  </div>
                </div>
                <button onClick={() => handleDispense(rx.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors w-full sm:w-auto">
                  Dispense
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Inventory Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl shadow-sm overflow-hidden flex flex-col h-[600px]"
        >
          <div className="p-6 border-b border-slate-200 dark:border-[#1e293b] bg-slate-50/50 dark:bg-[#111c44]/50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <PackagePlus className="w-5 h-5 text-emerald-500" /> Medicine Inventory
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-[#111c44]/50 text-slate-500 text-sm sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-medium">Medicine Name</th>
                  <th className="px-6 py-4 font-medium">Stock Level</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
                {loading ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Loading inventory...</td></tr>
                ) : data.inventory.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No medicines found in inventory.</td></tr>
                ) : data.inventory.map((item: any) => {
                  const isLow = item.quantity <= item.minimumThreshold;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-[#152353] transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{item.itemName}</td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 font-bold ${isLow ? 'text-red-500' : 'text-emerald-500'}`}>
                          {item.quantity} units
                          {isLow && <AlertCircle className="w-4 h-4" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openRestock(item)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium text-sm underline decoration-emerald-500/30 underline-offset-4">
                          Restock
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Restock Modal */}
      <AnimatePresence>
        {showRestockModal && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRestockModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <PackagePlus className="text-emerald-500 w-5 h-5" /> Restock Medicine
                </h2>
              </div>
              
              <form onSubmit={handleRestock} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Medicine Name</label>
                  <input disabled value={selectedItem.itemName} type="text" className="w-full px-4 py-3 bg-slate-800/50 text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Units to Add</label>
                  <input required value={restockQty} onChange={e => setRestockQty(e.target.value)} type="number" min="1" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 transition-colors" placeholder="e.g. 50" />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowRestockModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95">
                    Confirm Restock
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
