import React from 'react'
import { Users, DollarSign, TrendingUp, Globe, Briefcase, PieChart as ChartIcon, Loader2 } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Cell,
  Pie
} from 'recharts'
import type { CountryStat, JobStat, DeptStat, EmpTypeStat } from '../types/index'

interface InsightsViewProps {
  countryStats: CountryStat[]
  jobStats: JobStat[]
  deptStats: DeptStat[]
  empTypeStats: EmpTypeStat[]
  selectedCountryForJob: string
  setSelectedCountryForJob: (country: string) => void
  insightsLoading: boolean
}

const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1']

export const InsightsView: React.FC<InsightsViewProps> = ({
  countryStats,
  jobStats,
  deptStats,
  empTypeStats,
  selectedCountryForJob,
  setSelectedCountryForJob,
  insightsLoading
}) => {
  const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
  }

  // Format chart data
  const formattedDeptChartData = deptStats.map(d => ({
    name: d.department,
    budget: Math.round(parseFloat(d.total_spend)),
    avg: Math.round(parseFloat(d.avg_salary))
  }))

  const formattedCountryChartData = countryStats.map(c => ({
    name: c.country,
    avg: Math.round(parseFloat(c.avg_salary)),
    min: Math.round(parseFloat(c.min_salary)),
    max: Math.round(parseFloat(c.max_salary))
  }))

  const filteredJobStats = jobStats
    .filter(s => s.country === selectedCountryForJob)
    .map(s => ({
      job_title: s.job_title,
      avg_salary: Math.round(parseFloat(s.avg_salary))
    }))

  return (
    <div className="flex flex-col gap-5">
      
      {/* Top Cards for Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1">
          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Total Employees</span>
          <span className="text-lg font-bold text-gray-950 font-mono tracking-tight">10,000</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1">
          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Avg Global Salary</span>
          <span className="text-lg font-bold text-gray-950 font-mono tracking-tight">
            {countryStats.length > 0
              ? formatCurrency(Math.round(countryStats.reduce((acc, curr) => acc + parseFloat(curr.avg_salary), 0) / countryStats.length))
              : '$0'}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1">
          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Max Global Salary</span>
          <span className="text-lg font-bold text-gray-950 font-mono tracking-tight">
            {countryStats.length > 0
              ? formatCurrency(Math.max(...countryStats.map(s => parseFloat(s.max_salary))))
              : '$0'}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1">
          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Budget Spend</span>
          <span className="text-lg font-bold text-gray-950 font-mono tracking-tight">
            {deptStats.length > 0
              ? formatCurrency(deptStats.reduce((acc, curr) => acc + parseFloat(curr.total_spend), 0))
              : '$0'}
          </span>
        </div>
      </div>

      {insightsLoading ? (
        <div className="bg-white border border-gray-200 rounded-lg py-20 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            <span className="text-[11px] text-gray-400">Loading insights...</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          
          {/* Visualizations Block */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Department budget spending Bar Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h2 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-gray-450" />
                  Department Budgets
                </h2>
                <span className="text-[9px] text-gray-400">Total Spend (USD)</span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedDeptChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(v) => `$${v/1000}k`} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: 10, padding: '4px 8px' }}
                      formatter={(v: any) => [formatCurrency(v), 'Spend']}
                    />
                    <Bar dataKey="budget" fill="#0f172a" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Country averages comparisons Area/Bar Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h2 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-gray-450" />
                  Salary Range by Country
                </h2>
                <span className="text-[9px] text-gray-400">Avg / Min / Max</span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedCountryChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(v) => `$${v/1000}k`} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: 10, padding: '4px 8px' }}
                      formatter={(v: any) => formatCurrency(v)}
                    />
                    <Bar dataKey="min" fill="#94a3b8" radius={[2, 2, 0, 0]} name="Min" />
                    <Bar dataKey="avg" fill="#475569" radius={[2, 2, 0, 0]} name="Avg" />
                    <Bar dataKey="max" fill="#0f172a" radius={[2, 2, 0, 0]} name="Max" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Secondary Aggregation Blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Job averages in selected Country (dropdown filtered) */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3 lg:col-span-2">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h2 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-gray-450" />
                  Role Averages
                </h2>
                
                <select
                  value={selectedCountryForJob}
                  onChange={(e) => setSelectedCountryForJob(e.target.value)}
                  className="bg-white border border-gray-200 rounded-md px-2 py-0.5 text-[10px] font-medium text-gray-700 focus:outline-none transition-all cursor-pointer"
                >
                  {countryStats.map(s => (
                    <option key={s.country} value={s.country}>{s.country}</option>
                  ))}
                </select>
              </div>

              {filteredJobStats.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-xs">No records.</div>
              ) : (
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredJobStats} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={9} tickFormatter={(v) => `$${v/1000}k`} tickLine={false} />
                      <YAxis dataKey="job_title" type="category" stroke="#94a3b8" fontSize={9} width={110} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: 10, padding: '4px 8px' }}
                        formatter={(v: any) => [formatCurrency(v), 'Avg Salary']}
                      />
                      <Bar dataKey="avg_salary" fill="#475569" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Employment type pie breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
              <div className="border-b border-gray-100 pb-2">
                <h2 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                  <ChartIcon className="w-3.5 h-3.5 text-gray-450" />
                  Employment Type
                </h2>
              </div>

              <div className="h-36 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={empTypeStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={48}
                      paddingAngle={3}
                      dataKey="avg_salary"
                    >
                      {empTypeStats.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: 10, padding: '4px 8px' }}
                      formatter={(v: any) => formatCurrency(v)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-1 mt-1 border-t border-gray-100 pt-2">
                {empTypeStats.map((item, index) => (
                  <div key={item.employment_type} className="flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-gray-450 font-medium">{item.employment_type}</span>
                    </div>
                    <span className="font-medium text-gray-800 font-mono">{formatCurrency(item.avg_salary)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  )
}
