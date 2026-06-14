"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Activity, Plus, Search, User as UserIcon, X, Loader2, Eye, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Patient = {
  id: string
  patientId: string
  name: string
  age: number
  gender: string
  diagnosis: string
  status: string
  departmentName: string
}

const topInsuranceCompanies = [
  "Star Health and Allied Insurance",
  "HDFC ERGO General Insurance",
  "ICICI Lombard General Insurance",
  "Niva Bupa Health Insurance",
  "Care Health Insurance",
  "Aditya Birla Health Insurance",
  "New India Assurance",
  "Oriental Insurance",
  "National Insurance",
  "United India Insurance",
  "SBI General Insurance",
  "Tata AIG General Insurance",
  "Bajaj Allianz General Insurance",
  "Reliance General Insurance",
  "ManipalCigna Health Insurance",
  "Other (Specify)"
]

export default function PatientsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStep, setFormStep] = useState(1)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    symptoms: "",
    departmentName: "Emergency",
    diagnosis: "",
    status: "monitoring",
    allergies: "",
    isMediclaimSecure: false,
    advanceMoneyTaken: "",
    isAyushmanBharat: false,
    insuranceCompany: "",
    insuranceCompanyOther: "",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    guardianEmail: ""
  })

  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)

  const handleAiTriage = async () => {
    if (!formData.symptoms) {
      alert("Please enter symptoms first.");
      return;
    }
    setIsAiAnalyzing(true);
    // Simulate AI delay
    await new Promise(r => setTimeout(r, 1500));
    
    const sym = formData.symptoms.toLowerCase();
    let dept = "Emergency";
    let diag = "Pending evaluation";
    let status = "monitoring";

    if (sym.includes("chest pain") || sym.includes("heart")) {
      dept = "Cardiology";
      diag = "Suspected Cardiac Event";
      status = "critical";
    } else if (sym.includes("headache") || sym.includes("stroke") || sym.includes("seizure")) {
      dept = "Neurology";
      diag = "Neurological Evaluation Needed";
      status = "critical";
    } else if (sym.includes("child") || sym.includes("baby") || sym.includes("infant")) {
      dept = "Pediatrics";
      diag = "Pediatric Assessment";
      status = "stable";
    } else if (sym.includes("fever") || sym.includes("cough")) {
      dept = "Emergency";
      diag = "Viral Infection";
      status = "stable";
    }

    setFormData({
      ...formData,
      departmentName: dept,
      diagnosis: diag,
      status: status
    });
    setIsAiAnalyzing(false);
  }

  const fetchPatients = () => {
    setLoading(true)
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPatients(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formStep === 1) {
      setFormStep(2)
      return
    }

    setIsSubmitting(true)

    try {
      const finalInsurance = formData.insuranceCompany === "Other (Specify)" 
        ? formData.insuranceCompanyOther 
        : formData.insuranceCompany;

      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          insuranceCompany: finalInsurance,
          age: parseInt(formData.age),
          doctorName: session?.user.name
        })
      })

      if (res.ok) {
        setIsModalOpen(false)
        setFormStep(1)
        setFormData({
          name: "", age: "", gender: "Male", symptoms: "", departmentName: "", diagnosis: "", status: "monitoring", allergies: "",
          isMediclaimSecure: false, advanceMoneyTaken: "", isAyushmanBharat: false,
          insuranceCompany: "", insuranceCompanyOther: "", guardianName: "", guardianRelation: "", guardianPhone: "", guardianEmail: ""
        })
        fetchPatients()
      } else {
        alert("Failed to admit patient. Ensure you have the correct permissions.")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) return null

  return (
    <div className="p-8 h-full bg-slate-950 text-slate-100 relative overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Patient Directory</h1>
          <p className="text-slate-400">Manage hospital admissions and patient records</p>
        </div>

        {(["ADMIN", "SUPER_ADMIN"].includes(session.user.role) || ["DOCTOR", "SUPER_ADMIN"].includes(session.user.role)) && (
          <button 
            onClick={() => { setIsModalOpen(true); setFormStep(1); }}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
          >
            <Plus className="w-5 h-5" />
            Admit Patient
          </button>
        )}
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-sm">
                <th className="p-4 font-medium">Patient</th>
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Diagnosis</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading patients...</td></tr>
              ) : patients.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No patients currently admitted.</td></tr>
              ) : (
                patients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.age} yrs • {p.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 text-sm font-mono">{p.patientId}</td>
                    <td className="p-4 text-sm truncate max-w-[150px]">{p.diagnosis}</td>
                    <td className="p-4 text-sm text-slate-400">{p.departmentName || "Unassigned"}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                        ${p.status === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          p.status === 'stable' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => router.push(`/patients/${p.patientId}`)}
                          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admit Patient Modal (Multi-step) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
              <h3 className="text-lg font-semibold">Admit New Patient (Step {formStep} of 2)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formStep === 1 ? (
                <>
                  {/* STEP 1: Medical & Basic Details */}
                  <h4 className="text-cyan-400 text-sm font-medium border-b border-slate-800 pb-2 mb-4">Medical Profile</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Age</label>
                      <input required type="number" min="0" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1 bg-blue-900/10 p-4 rounded-xl border border-blue-500/20 relative">
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-xs font-medium text-blue-400">Patient Symptoms (AI Triage)</label>
                      <button 
                        type="button" 
                        onClick={handleAiTriage}
                        disabled={isAiAnalyzing}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {isAiAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "🤖 AI Analyze"}
                      </button>
                    </div>
                    <textarea 
                      rows={2}
                      value={formData.symptoms} 
                      onChange={e => setFormData({...formData, symptoms: e.target.value})} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none resize-none" 
                      placeholder="Describe symptoms here... (e.g., severe chest pain and sweating)" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Gender</label>
                      <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none text-slate-100">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Department</label>
                      <select value={formData.departmentName} onChange={e => setFormData({...formData, departmentName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none text-slate-100">
                        <option>Emergency</option>
                        <option>ICU</option>
                        <option>Cardiology</option>
                        <option>Neurology</option>
                        <option>Pediatrics</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 ml-1">Primary Diagnosis</label>
                    <input required type="text" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none" placeholder="e.g. Acute Myocardial Infarction" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 ml-1">Initial Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none text-slate-100">
                      <option value="monitoring">Monitoring (Standard)</option>
                      <option value="stable">Stable</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 ml-1">Allergies (Optional)</label>
                    <input type="text" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none" placeholder="e.g. Penicillin, Peanuts" />
                  </div>
                </>
              ) : (
                <>
                  {/* STEP 2: Financial & Guardian Details */}
                  <h4 className="text-emerald-400 text-sm font-medium border-b border-slate-800 pb-2 mb-4 mt-2">Financial & Insurance Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:border-emerald-500/50">
                      <input type="checkbox" checked={formData.isMediclaimSecure} onChange={e => setFormData({...formData, isMediclaimSecure: e.target.checked})} className="w-4 h-4 accent-emerald-500" />
                      <span className="text-sm">Mediclaim Secure</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:border-emerald-500/50">
                      <input type="checkbox" checked={formData.isAyushmanBharat} onChange={e => setFormData({...formData, isAyushmanBharat: e.target.checked})} className="w-4 h-4 accent-emerald-500" />
                      <span className="text-sm">Ayushman Bharat Covered</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Advance Money Collected (₹)</label>
                      <input type="number" min="0" value={formData.advanceMoneyTaken} onChange={e => setFormData({...formData, advanceMoneyTaken: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none" placeholder="0.00" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Insurance Company</label>
                      <select value={formData.insuranceCompany} onChange={e => setFormData({...formData, insuranceCompany: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none text-slate-100">
                        <option value="">None / Self-Pay</option>
                        {topInsuranceCompanies.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {formData.insuranceCompany === "Other (Specify)" && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Specify Insurance Company</label>
                      <input required type="text" value={formData.insuranceCompanyOther} onChange={e => setFormData({...formData, insuranceCompanyOther: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none" />
                    </div>
                  )}

                  <h4 className="text-purple-400 text-sm font-medium border-b border-slate-800 pb-2 mb-4 mt-6">Responsible Person / Guardian</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Guardian Name</label>
                      <input type="text" required value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Relationship to Patient</label>
                      <input type="text" required value={formData.guardianRelation} onChange={e => setFormData({...formData, guardianRelation: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" placeholder="e.g. Father, Spouse" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Phone Number</label>
                      <input type="tel" required value={formData.guardianPhone} onChange={e => setFormData({...formData, guardianPhone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 ml-1">Email Address (Optional)</label>
                      <input type="email" value={formData.guardianEmail} onChange={e => setFormData({...formData, guardianEmail: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-6 border-t border-slate-800 flex justify-between">
                {formStep === 2 ? (
                  <button type="button" onClick={() => setFormStep(1)} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 bg-slate-800 rounded-xl">Back</button>
                ) : (
                  <div></div> // spacer
                )}
                
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (formStep === 1 ? "Next: Guardian & Finance" : "Complete Admission")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
