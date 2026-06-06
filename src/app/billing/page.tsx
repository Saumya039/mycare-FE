"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { CreditCard, DollarSign, Download, Plus, Search } from "lucide-react"

type Invoice = {
  id: string
  patientId: string
  totalAmount: number
  status: string
  insuranceClaimStatus: string | null
  dueDate: string
  createdAt: string
  patient: { name: string, patientId: string }
}

export default function BillingPage() {
  const { data: session } = useSession()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [invoiceForm, setInvoiceForm] = useState({ patientId: "", amount: "", dueDate: "", insuranceStatus: "" })

  const fetchInvoices = () => {
    fetch("/api/billing")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setInvoices(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceForm)
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        setIsInvoiceModalOpen(false)
        setInvoiceForm({ patientId: "", amount: "", dueDate: "", insuranceStatus: "" })
        fetchInvoices()
      }
    } catch (err) {
      alert("Failed to generate invoice")
    }
  }

  if (!session || session.user.role !== "ADMIN") {
    return <div className="p-8 text-red-400">Unauthorized. Only Administrators can view the Billing module.</div>
  }

  return (
    <div className="p-8 h-full bg-slate-950 text-slate-100 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-green-400" /> Billing & Finance
          </h1>
          <p className="text-slate-400">Manage patient invoices and insurance claims</p>
        </div>

        <button 
          onClick={() => setIsInvoiceModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
        >
          <Plus className="w-5 h-5" /> Generate Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm font-medium mb-1">Total Outstanding</h3>
          <p className="text-3xl font-bold text-slate-100">${invoices.reduce((acc, inv) => acc + (inv.status !== 'paid' ? inv.totalAmount : 0), 0).toFixed(2)}</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm font-medium mb-1">Claims Pending</h3>
          <p className="text-3xl font-bold text-blue-400">{invoices.filter(i => i.insuranceClaimStatus === 'pending').length}</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm font-medium mb-1">Total Generated</h3>
          <p className="text-3xl font-bold text-emerald-400">{invoices.length}</p>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-sm">
                <th className="p-4 font-medium">Invoice ID</th>
                <th className="p-4 font-medium">Patient</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Due Date</th>
                <th className="p-4 font-medium">Insurance</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-500">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-500">No invoices found.</td></tr>
              ) : (
                invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono text-sm text-slate-300">{inv.id.slice(0, 8).toUpperCase()}</td>
                    <td className="p-4 font-medium">{inv.patient.name} <span className="text-xs text-slate-500 ml-1">({inv.patient.patientId})</span></td>
                    <td className="p-4 font-bold text-slate-100">${inv.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize
                        ${inv.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                        ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                        ${inv.status === 'overdue' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                      `}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-slate-400 capitalize">{inv.insuranceClaimStatus || "None"}</td>
                    <td className="p-4">
                      <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1" onClick={() => alert("Downloading Invoice PDF...")}>
                        <Download className="w-4 h-4" /> PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GENERATE INVOICE MODAL */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" /> Generate Invoice
              </h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <form onSubmit={handleGenerateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Patient ID</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. P-1001"
                  value={invoiceForm.patientId}
                  onChange={(e) => setInvoiceForm({...invoiceForm, patientId: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Total Amount ($)</label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    placeholder="0.00"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({...invoiceForm, amount: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    required
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({...invoiceForm, dueDate: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Insurance Status</label>
                <select 
                  value={invoiceForm.insuranceStatus}
                  onChange={(e) => setInvoiceForm({...invoiceForm, insuranceStatus: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">None</option>
                  <option value="pending">Pending Claim</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="pt-4 border-t border-slate-800 flex gap-3">
                <button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium">Generate Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
