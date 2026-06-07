"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Package, AlertTriangle, Search, Plus, ShoppingCart } from "lucide-react"

type InventoryItem = {
  id: string
  itemName: string
  category: string
  quantity: number
  minimumThreshold: number
  lastRestocked: string
}

export default function InventoryPage() {
  const { data: session } = useSession()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [orderQuantity, setOrderQuantity] = useState("50")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchInventory = () => {
    fetch("/api/inventory")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setItems(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleOrderMore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/inventory/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addQuantity: orderQuantity })
      })

      if (res.ok) {
        setOrderModalOpen(false)
        fetchInventory()
      } else {
        alert("Failed to order inventory.")
      }
    } catch (err) {
      alert("Error processing order.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) return null

  return (
    <div className="p-8 h-full bg-slate-950 text-slate-100 relative overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Package className="w-6 h-6 text-cyan-400" /> Pharmacy & Inventory
          </h1>
          <p className="text-slate-400">Manage hospital supplies, medications, and equipment</p>
        </div>

        {session.user.role === "ADMIN" && (
          <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
            <Plus className="w-5 h-5" /> Add Stock
          </button>
        )}
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-sm">
                <th className="p-4 font-medium">Item Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Quantity</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Last Restocked</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading inventory...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No inventory items found.</td></tr>
              ) : (
                items.map(item => {
                  const isLow = item.quantity <= item.minimumThreshold
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 font-medium">{item.itemName}</td>
                      <td className="p-4 text-sm text-slate-400">{item.category}</td>
                      <td className={`p-4 font-mono font-bold ${isLow ? 'text-red-400' : 'text-slate-100'}`}>
                        {item.quantity}
                      </td>
                      <td className="p-4">
                        {isLow ? (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-red-500/10 text-red-400 border-red-500/20 w-max">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 w-max">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-slate-400">
                        {new Date(item.lastRestocked).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {(session.user.role === "ADMIN" || session.user.role === "NURSE") && (
                          <button 
                            onClick={() => {
                              setSelectedItem(item)
                              setOrderModalOpen(true)
                            }}
                            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Order More
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER MORE MODAL */}
      {orderModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-cyan-400" /> Order Stock
              </h3>
              <button onClick={() => setOrderModalOpen(false)} className="text-slate-400 hover:text-slate-200 transition-colors">✕</button>
            </div>
            <form onSubmit={handleOrderMore} className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-4">
                  You are ordering more <strong className="text-slate-200">{selectedItem.itemName}</strong>. Current quantity is <strong className="text-slate-200">{selectedItem.quantity}</strong>.
                </p>
                <label className="block text-sm font-medium text-slate-400 mb-1">Quantity to Order</label>
                <input 
                  type="number" min="1" required
                  value={orderQuantity} onChange={(e) => setOrderQuantity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              
              <div className="pt-4 border-t border-slate-800 flex gap-3">
                <button type="button" onClick={() => setOrderModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">Place Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
