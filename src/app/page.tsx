"use client"

import { useSession } from "next-auth/react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts'
import { Activity, Users, Bed, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react'

// Mock Analytics Data
const flowData = [
  { name: 'Mon', Admissions: 40, Discharges: 24 },
  { name: 'Tue', Admissions: 30, Discharges: 13 },
  { name: 'Wed', Admissions: 20, Discharges: 58 },
  { name: 'Thu', Admissions: 27, Discharges: 39 },
  { name: 'Fri', Admissions: 18, Discharges: 48 },
  { name: 'Sat', Admissions: 23, Discharges: 38 },
  { name: 'Sun', Admissions: 34, Discharges: 43 },
]

const deptData = [
  { name: 'Emergency', value: 400 },
  { name: 'ICU', value: 300 },
  { name: 'Cardiology', value: 300 },
  { name: 'Neurology', value: 200 },
  { name: 'Pediatrics', value: 150 },
]

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function DashboardPage() {
  const { data: session } = useSession()

  if (!session) return null
  const role = session.user.role

  return (
    <div className="p-8 h-full bg-slate-950 text-slate-100 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Hospital Command Center</h1>
        <p className="text-slate-400">Welcome back, {session.user.name}. Here is today's overview.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Patients</p>
              <h3 className="text-3xl font-bold text-slate-100 mt-1">1,248</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-emerald-400 text-sm font-medium flex items-center gap-1 relative z-10">
            <TrendingUp className="w-4 h-4" /> +12% from last month
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium">Available Beds</p>
              <h3 className="text-3xl font-bold text-slate-100 mt-1">42 <span className="text-lg text-slate-500 font-normal">/ 500</span></h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Bed className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-red-400 text-sm font-medium flex items-center gap-1 relative z-10">
            <AlertTriangle className="w-4 h-4" /> High occupancy alert
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Doctors</p>
              <h3 className="text-3xl font-bold text-slate-100 mt-1">86</h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-emerald-400 text-sm font-medium flex items-center gap-1 relative z-10">
            On shift currently
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium">Today's Revenue</p>
              <h3 className="text-3xl font-bold text-slate-100 mt-1">₹1.2M</h3>
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-xl">
              <CreditCard className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <p className="text-emerald-400 text-sm font-medium flex items-center gap-1 relative z-10">
            <TrendingUp className="w-4 h-4" /> +5% from yesterday
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        
        {/* Patient Flow Chart */}
        <div className="xl:col-span-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Patient Flow (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={flowData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="Admissions" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Discharges" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Load */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Department Load</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar Chart */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue Trend (YTD)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} 
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions based on Role */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
          
          <div className="space-y-4">
            <div className="p-4 border border-slate-800 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">Admit New Patient</h4>
                <p className="text-sm text-slate-500">Register a walk-in or emergency patient</p>
              </div>
              <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>

            <div className="p-4 border border-slate-800 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-medium text-slate-200 group-hover:text-purple-400 transition-colors">Bed Management</h4>
                <p className="text-sm text-slate-500">View ward map and reassign beds</p>
              </div>
              <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>

            <div className="p-4 border border-slate-800 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between group">
              <div>
                <h4 className="font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">Generate Invoice</h4>
                <p className="text-sm text-slate-500">Process billing and discharge procedures</p>
              </div>
              <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
