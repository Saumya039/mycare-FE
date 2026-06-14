"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, Search, Plus, Printer, FileText } from "lucide-react"

export default function CertificatesPage() {
  const [certs, setCerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ patientName: '', type: 'Medical', issuedBy: '', notes: '' })

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/certificates")
      const result = await res.json()
      if (result.certificates) setCerts(result.certificates)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setShowModal(false)
        setFormData({ patientName: '', type: 'Medical', issuedBy: '', notes: '' })
        fetchCertificates()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const printCertificate = (cert: any) => {
    alert(`Printing ${cert.type} certificate for ${cert.patientName}...`)
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Award className="text-amber-500 w-8 h-8" />
            Certificate Generator
          </h1>
          <p className="text-slate-500 mt-1">Issue and manage official hospital certificates.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Generate Certificate
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-slate-200 dark:border-[#1e293b] flex justify-between items-center bg-slate-50/50 dark:bg-[#111c44]/50">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search certificates..." className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-amber-500 transition-colors" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-[#111c44]/50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Issue Date</th>
                <th className="px-6 py-4 font-medium">Patient Name</th>
                <th className="px-6 py-4 font-medium">Certificate Type</th>
                <th className="px-6 py-4 font-medium">Issued By</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading certificates...</td></tr>
              ) : certs.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No certificates generated yet.</td></tr>
              ) : certs.map((cert: any, i: number) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + (i * 0.05) }}
                  key={cert.id} className="hover:bg-slate-50 dark:hover:bg-[#152353] transition-colors"
                >
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{new Date(cert.issueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-100">{cert.patientName}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex w-max items-center gap-1">
                      <FileText className="w-3 h-3" /> {cert.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">Dr. {cert.issuedBy}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => printCertificate(cert)}
                      className="text-slate-500 hover:text-amber-500 font-medium text-sm flex items-center gap-1 justify-end w-full transition-colors"
                    >
                      <Printer className="w-4 h-4" /> Print
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Generate Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Award className="text-amber-500 w-6 h-6" /> Generate Certificate
                </h2>
              </div>
              <form onSubmit={handleGenerate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Patient Name</label>
                  <input required value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-500 transition-colors" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Certificate Type</label>
                  <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-500 transition-colors">
                    <option>Medical Fitness</option>
                    <option>Sick Leave</option>
                    <option>Discharge Summary</option>
                    <option>Birth Certificate</option>
                    <option>Death Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Issuing Authority (Doctor)</label>
                  <input required value={formData.issuedBy} onChange={e => setFormData({...formData, issuedBy: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Dr. Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Remarks / Notes</label>
                  <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-500 transition-colors" placeholder="Optional notes..." />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95">Generate</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
