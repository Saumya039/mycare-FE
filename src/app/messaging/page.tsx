"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, Search, UserCircle2, Mail, CheckCircle2 } from "lucide-react"

export default function MessagingPage() {
  const [data, setData] = useState<any>({ received: [], sent: [], users: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("inbox") // inbox, sent
  const [showCompose, setShowCompose] = useState(false)
  const [formData, setFormData] = useState({ receiverId: '', content: '' })
  const [activeMessage, setActiveMessage] = useState<any>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messaging")
      const result = await res.json()
      if (result.received) setData(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/messaging", {
        method: "POST",
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setShowCompose(false)
        setFormData({ receiverId: '', content: '' })
        fetchMessages()
        setActiveTab("sent")
      } else {
        alert("Failed to send message")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const markAsRead = async (msg: any) => {
    setActiveMessage(msg)
    if (!msg.isRead && activeTab === "inbox") {
      try {
        await fetch("/api/messaging", {
          method: "PATCH",
          body: JSON.stringify({ id: msg.id, isRead: true })
        })
        fetchMessages()
      } catch (e) {
        console.error(e)
      }
    }
  }

  const displayList = activeTab === "inbox" ? data.received : data.sent

  return (
    <div className="p-4 lg:p-8 space-y-8 pb-20 h-[calc(100vh-80px)] flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <MessageSquare className="text-blue-500 w-8 h-8" />
            Internal Comms
          </h1>
          <p className="text-slate-500 mt-1">Secure messaging across hospital departments.</p>
        </div>
        <button 
          onClick={() => setShowCompose(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <Send className="w-5 h-5" /> Compose
        </button>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Inbox Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-1 bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl shadow-sm flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-slate-200 dark:border-[#1e293b] flex gap-2">
            <button 
              onClick={() => { setActiveTab("inbox"); setActiveMessage(null); }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === "inbox" ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Inbox
            </button>
            <button 
              onClick={() => { setActiveTab("sent"); setActiveMessage(null); }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === "sent" ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Sent
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 p-3 space-y-2">
            {loading ? (
              <p className="text-center text-slate-400 py-10">Loading messages...</p>
            ) : displayList.length === 0 ? (
              <p className="text-center text-slate-400 py-10">Empty {activeTab}</p>
            ) : displayList.map((msg: any) => (
              <button 
                key={msg.id}
                onClick={() => markAsRead(msg)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${activeMessage?.id === msg.id ? 'bg-blue-50 dark:bg-[#152353] border-blue-200 dark:border-blue-900 shadow-sm' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-bold ${!msg.isRead && activeTab === "inbox" ? 'text-slate-900 dark:text-white' : 'text-slate-300'}`}>
                    {activeTab === "inbox" ? msg.sender?.name : `To: ${msg.receiver?.name}`}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-sm truncate ${!msg.isRead && activeTab === "inbox" ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}`}>
                  {msg.content}
                </p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Message View Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white/60 dark:bg-[#0b1437]/60 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl shadow-sm flex flex-col overflow-hidden"
        >
          {activeMessage ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-slate-200 dark:border-[#1e293b] flex items-center justify-between bg-slate-50/50 dark:bg-[#111c44]/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                    <UserCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">
                      {activeTab === "inbox" ? activeMessage.sender?.name : activeMessage.receiver?.name}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {activeTab === "inbox" ? activeMessage.sender?.role : activeMessage.receiver?.role}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">{new Date(activeMessage.timestamp).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-500">{new Date(activeMessage.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="p-8 flex-1 overflow-y-auto">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
                  {activeMessage.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
              <Mail className="w-20 h-20 text-slate-200 dark:text-slate-800 mb-6" />
              <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400">No Message Selected</h2>
              <p className="max-w-xs mt-2">Select a message from your inbox to read it, or compose a new one.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCompose(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Send className="text-blue-500 w-6 h-6" /> Compose Message
                </h2>
              </div>
              
              <form onSubmit={handleSend} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">To: Staff Member</label>
                  <select required value={formData.receiverId} onChange={e => setFormData({...formData, receiverId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 transition-colors">
                    <option value="">Select recipient...</option>
                    {data.users.map((u: any) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Message</label>
                  <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={6} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="Type your message here..." />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowCompose(false)} className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
                    Send Message
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
