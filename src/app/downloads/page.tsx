"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DownloadCloud, Search, UploadCloud, File, Image as ImageIcon, FileText, Link as LinkIcon } from "lucide-react"

export default function DownloadsPage() {
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', type: 'PDF', url: '', uploadedBy: '' })

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/downloads")
      const result = await res.json()
      if (result.documents) setDocs(result.documents)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/downloads", {
        method: "POST",
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setShowModal(false)
        setFormData({ title: '', type: 'PDF', url: '', uploadedBy: '' })
        fetchDocuments()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF': return <FileText className="w-8 h-8 text-red-500" />
      case 'IMAGE': return <ImageIcon className="w-8 h-8 text-blue-500" />
      default: return <File className="w-8 h-8 text-slate-500" />
    }
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <DownloadCloud className="text-teal-500 w-8 h-8" />
            Download Center
          </h1>
          <p className="text-slate-500 mt-1">Central repository for hospital policies, forms, and public documents.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-teal-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <UploadCloud className="w-5 h-5" /> Upload File
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-slate-500 py-10">Loading documents...</div>
        ) : docs.length === 0 ? (
          <div className="col-span-full text-center text-slate-500 py-10">No documents uploaded yet.</div>
        ) : docs.map((doc, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            key={doc.id} 
            className="bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 mb-6">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {getFileIcon(doc.type)}
              </div>
              <div>
                <h3 className="font-bold text-slate-100 line-clamp-2">{doc.title}</h3>
                <p className="text-xs text-slate-500 mt-1">By {doc.uploadedBy || "Admin"} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <a 
              href={doc.url} 
              target="_blank" 
              rel="noreferrer"
              className="w-full py-2.5 bg-slate-800 hover:bg-teal-500 hover:text-white text-slate-300 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <DownloadCloud className="w-4 h-4" /> Download
            </a>
          </motion.div>
        ))}
      </div>

      {/* Upload Modal */}
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
                  <UploadCloud className="text-teal-500 w-6 h-6" /> Upload Document
                </h2>
              </div>
              <form onSubmit={handleUpload} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Document Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 transition-colors" placeholder="e.g. Employee Handbook 2024" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">File Type</label>
                  <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 transition-colors">
                    <option value="PDF">PDF Document</option>
                    <option value="Image">Image (JPG/PNG)</option>
                    <option value="Doc">Word Document</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1"><LinkIcon className="w-4 h-4"/> Document URL</label>
                  <input required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} type="url" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 transition-colors" placeholder="https://..." />
                  <p className="text-xs text-slate-500 mt-1">Provide a direct link to the hosted file.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Uploaded By</label>
                  <input value={formData.uploadedBy} onChange={e => setFormData({...formData, uploadedBy: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 transition-colors" placeholder="e.g. HR Dept" />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-500/30 transition-all hover:scale-105 active:scale-95">Upload</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
