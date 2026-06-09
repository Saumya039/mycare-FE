"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, X, Send, Bot, User as UserIcon, Loader2 } from "lucide-react"

export function ServaAIPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: "Hello. I am Serva AI, integrated directly into Sevra Technologies. I monitor live telemetry, patient records, and hospital capacity. How can I assist you?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await res.json()
      
      setMessages(prev => [...prev, { role: 'ai', text: data.response || "Error generating response." }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Connection to Serva AI failed." }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
        <div className="flex items-center gap-2 text-cyan-400">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-semibold tracking-wide">Serva AI</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-cyan-500/20 text-cyan-400'}`}>
              {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none text-sm flex gap-1 items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Serva about patients..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  )
}
