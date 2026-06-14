"use client"

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/components/ThemeProvider"
import { Shield, ShieldCheck, Stethoscope, Calculator, UserPlus, Pill, Microscope, Radiation, Bed, ArrowLeft, Loader2, Lock, Mail, Sun, Moon, BrainCircuit } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const portals = [
  { id: "SUPER_ADMIN", name: "Super Admin", desc: "Secure Access", icon: Shield },
  { id: "ADMIN", name: "Admin", desc: "System Control", icon: ShieldCheck },
  { id: "DOCTOR", name: "Doctor", desc: "Medical Staff", icon: Stethoscope },
  { id: "ACCOUNTANT", name: "Accountant", desc: "Finance & Billing", icon: Calculator },
  { id: "RECEPTIONIST", name: "Receptionist", desc: "Front Desk Ops", icon: UserPlus },
  { id: "PHARMACIST", name: "Pharmacist", desc: "Dispensary Ops", icon: Pill },
  { id: "PATHOLOGIST", name: "Pathologist", desc: "Lab Diagnostics", icon: Microscope },
  { id: "RADIOLOGIST", name: "Radiologist", desc: "Imaging Dept", icon: Radiation },
  { id: "NURSE", name: "Nurse", desc: "Patient Care", icon: Bed },
]

// Variants for Framer Motion
const containerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function LoginPage() {
  const router = useRouter()
  const [selectedPortal, setSelectedPortal] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePortalSelect = (portal: any) => {
    if (portal.link) {
      router.push(portal.link)
      return
    }
    setSelectedPortal(portal)
    setEmail("")
    setPassword("")
    setError("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid email or password")
        setLoading(false)
      } else {
        router.push("/")
      }
    } catch (err) {
      setError("An error occurred during login")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#081028] flex items-center justify-center p-4 lg:p-12 transition-colors duration-500 relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <div className="absolute top-8 right-8 flex items-center gap-4 z-20">
        <Link href="/portal/login" className="px-5 py-2 rounded-full border border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          Patient Portal
        </Link>
      </div>



      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl flex flex-col lg:flex-row bg-white/80 dark:bg-[#0b1437]/90 backdrop-blur-xl border border-slate-200 dark:border-[#1e293b] rounded-3xl overflow-hidden shadow-2xl min-h-[600px] z-10"
      >
        
        {/* Left Side Branding */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 bg-gradient-to-br from-slate-100/50 to-slate-200/50 dark:from-[#0b1437]/50 dark:to-[#081028]/50 border-r border-slate-200 dark:border-[#1e293b] relative transition-colors duration-500">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-10 left-10 flex items-center gap-3"
          >
            <div className="bg-cyan-500/20 p-2 rounded-xl text-cyan-600 dark:text-cyan-400">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Sevra AI</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Enterprise System</p>
            </div>
          </motion.div>

          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Mock Orbit Animation Rings */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="absolute inset-0 border border-cyan-500/30 dark:border-cyan-500/10 rounded-full animate-[spin_10s_linear_infinite]" 
            />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.2, type: "spring" }}
              className="absolute inset-4 border border-blue-500/30 dark:border-blue-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" 
            />
            
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="z-10 flex flex-col items-center transition-transform hover:scale-110 duration-300 cursor-pointer"
            >
              <BrainCircuit className="w-16 h-16 text-cyan-500 dark:text-cyan-400 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] dark:drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              <h3 className="text-slate-700 dark:text-slate-300 font-semibold tracking-wider text-sm">SEVRA AI</h3>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-10 text-center animate-bounce"
          >
            <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-200">System Orbit</h4>
            <p className="text-sm text-slate-500 mt-2">Choose a module on the right to access</p>
          </motion.div>
        </div>

        {/* Right Side Content */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white/50 dark:bg-[#0d173e]/50 transition-colors duration-500 relative">
          <AnimatePresence mode="wait">
            {!selectedPortal ? (
              <motion.div 
                key="portal-selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-slate-100 transition-transform hover:translate-x-2">Select Portal</h1>
                  <p className="text-sm text-slate-400 mt-1">Choose your role to access the management system.</p>
                </div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {portals.map((portal) => (
                    <motion.button
                      variants={itemVariants}
                      key={portal.id}
                      onClick={() => handlePortalSelect(portal)}
                      className="flex items-center p-4 bg-slate-50/80 dark:bg-[#111c44]/80 backdrop-blur-sm border border-slate-200 dark:border-[#1e293b] hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-[#1a295c]/80 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(6,182,212,0.3)] group text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mr-4 group-hover:scale-110 transition-transform">
                        <portal.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-200 text-sm">{portal.name}</h3>
                        <p className="text-xs text-slate-500">{portal.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-md w-full mx-auto"
              >
                <button 
                  onClick={() => setSelectedPortal(null)}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-8 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Portals
                </button>

                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    {selectedPortal.icon && <selectedPortal.icon className="w-6 h-6" />}
                  </div>
                  <h1 className="text-3xl font-bold text-slate-100 tracking-tight">{selectedPortal.name}</h1>
                  <p className="text-sm text-slate-400 mt-2">Sign in to your enterprise account.</p>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-6"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onSubmit={handleLogin} 
                  className="space-y-5"
                >
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-cyan-500">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#111c44] border border-slate-200 dark:border-[#1e293b] rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 transition-all outline-none"
                        placeholder={`${selectedPortal?.id?.toLowerCase().replace('_', '') || 'admin'}@sevraai.com`}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-cyan-500">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 transition-colors" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#111c44] border border-slate-200 dark:border-[#1e293b] rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 transition-all outline-none"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center disabled:opacity-50 mt-4 border border-cyan-400/20"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Secure Login"}
                  </motion.button>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
