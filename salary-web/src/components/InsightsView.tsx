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
import type { CountryStat, JobStat, DeptStat, EmpTypeStat } from '../types'

interface InsightsViewProps {
  countryStats: CountryStat[]
  jobStats: JobStat[]
  deptStats: DeptStat[]
  empTypeStats: EmpTypeStat[]
  selectedCountryForJob: string
  setSelectedCountryForJob: (country: string) => void
  insightsLoading: boolean
}

const COLORS = ['#64748b', '#94a3b8', '#cbd5e1', '#475569', '#334155', '#1e293b']

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
    <div className="flex flex-col gap-6">

      {/* Top Cards for Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Employees</span>
            <span className="text-lg font-bold text-gray-900 font-mono">10,000</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Avg Global Salary</span>
            <span className="text-lg font-bold text-gray-900 font-mono">
              {countryStats.length > 0
                ? formatCurrency(Math.round(countryStats.reduce((acc, curr) => acc + parseFloat(curr.avg_salary), 0) / countryStats.length))
                : '$0'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Max Global Salary</span>
            <span className="text-lg font-bold text-gray-900 font-mono">
              {countryStats.length > 0
                ? formatCurrency(Math.max(...countryStats.map(s => parseFloat(s.max_salary))))
                : '$0'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl">
            <ChartIcon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Budget Spend</span>
            <span className="text-lg font-bold text-gray-900 font-mono">
              {deptStats.length > 0
                ? formatCurrency(deptStats.reduce((acc, curr) => acc + parseFloat(curr.total_spend), 0))
                : '$0'}
            </span>
          </div>
        </div>
      </div>

      {insightsLoading ? (
        <div className="bg-white border border-gray-200 rounded-xl py-24 text-center shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            <span className="text-xs text-gray-400">Loading insights...</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* Visualizations Block */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Department budget spending Bar Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-150 pb-2">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  Department Budgets
                </h2>
                <span className="text-[10px] text-gray-400">Total Spend (USD)</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedDeptChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: 11 }}
                      formatter={(v: any) => [formatCurrency(v), 'Spend']}
                    />
                    <Bar dataKey="budget" fill="#475569" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Country averages comparisons Area/Bar Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-150 pb-2">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-gray-500" />
                  Salary Range by Country
                </h2>
                <span className="text-[10px] text-gray-400">Avg / Min / Max</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedCountryChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: 11 }}
                      formatter={(v: any) => formatCurrency(v)}
                    />
                    <Bar dataKey="min" fill="#94a3b8" radius={[3, 3, 0, 0]} name="Min" />
                    <Bar dataKey="avg" fill="#475569" radius={[3, 3, 0, 0]} name="Avg" />
                    <Bar dataKey="max" fill="#1e293b" radius={[3, 3, 0, 0]} name="Max" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Secondary Aggregation Blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Job averages in selected Country (dropdown filtered) */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center border-b border-gray-150 pb-2">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  Role Averages
                </h2>

                <select
                  value={selectedCountryForJob}
                  onChange={(e) => setSelectedCountryForJob(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-gray-700 focus:outline-none focus:border-gray-900 transition-all cursor-pointer"
                >
                  {countryStats.map(s => (
                    <option key={s.country} value={s.country}>{s.country}</option>
                  ))}
                </select>
              </div>

              {filteredJobStats.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs">No records.</div>
              ) : (
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredJobStats} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={9} tickFormatter={(v) => `$${v / 1000}k`} />
                      <YAxis dataKey="job_title" type="category" stroke="#94a3b8" fontSize={9} width={130} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: 11 }}
                        formatter={(v: any) => [formatCurrency(v), 'Avg Salary']}
                      />
                      <Bar dataKey="avg_salary" fill="#475569" radius={[0, 3, 3, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Employment type pie breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
              <div className="border-b border-gray-150 pb-2">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <ChartIcon className="w-4 h-4 text-gray-500" />
                  Employment Type Salaries
                </h2>
              </div>

              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={empTypeStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={4}
                      dataKey="avg_salary"
                    >
                      {empTypeStats.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: 11 }}
                      formatter={(v: any) => formatCurrency(v)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-1.5 mt-1 border-t border-gray-100 pt-2">
                {empTypeStats.map((item, index) => (
                  <div key={item.employment_type} className="flex justify-between items-center text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-gray-500 font-medium">{item.employment_type}</span>
                    </div>
                    <span className="font-semibold text-gray-800 font-mono">{formatCurrency(item.avg_salary)}</span>
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
