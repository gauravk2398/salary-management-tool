import React from 'react'
import { Search, Plus, Loader2, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Employee, PaginationMeta } from '../types/index'

interface DirectoryViewProps {
  employees: Employee[]
  pagination: PaginationMeta
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  searchQuery: string
  setSearchQuery: (query: string) => void
  isLoading: boolean
  onSearch: (e: React.FormEvent) => void
  onAddTrigger: () => void
  onEditTrigger: (emp: Employee) => void
  onDeleteTrigger: (id: number) => void
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  employees,
  pagination,
  currentPage,
  setCurrentPage,
  searchQuery,
  setSearchQuery,
  isLoading,
  onSearch,
  onAddTrigger,
  onEditTrigger,
  onDeleteTrigger
}) => {
  const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
  }

  return (
    <div className="flex flex-col gap-5">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <form onSubmit={onSearch} className="relative flex-grow max-w-md flex items-center">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-lg py-2 pl-9 pr-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900/10 transition-all"
          />
        </form>
        <button
          onClick={onAddTrigger}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold shadow-sm active:scale-98 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Employee
        </button>
      </div>

      {/* Directory Data Grid Container */}
      <div className="bg-white border border-gray-250 rounded-xl overflow-hidden shadow-sm">
        
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Name</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Email</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Job Title</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Department</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Type</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Country</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-right">Salary</th>
                <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-150">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                      <span className="text-xs text-gray-400">Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <span className="text-xs text-gray-400">No records found.</span>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/30 transition-all duration-100">
                    <td className="py-3 px-5 text-xs font-semibold text-gray-900">{emp.full_name}</td>
                    <td className="py-3 px-5 text-xs text-gray-500">{emp.email}</td>
                    <td className="py-3 px-5 text-xs text-gray-600">{emp.job_title}</td>
                    <td className="py-3 px-5 text-xs text-gray-500">{emp.department}</td>
                    <td className="py-3 px-5 text-xs">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${
                        emp.employment_type === 'Full-time' 
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : emp.employment_type === 'Part-time'
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}>
                        {emp.employment_type}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-xs text-gray-500">{emp.country}</td>
                    <td className="py-3 px-5 text-xs text-right font-semibold text-gray-800 font-mono">{formatCurrency(emp.salary)}</td>
                    <td className="py-3 px-5 text-xs text-center">
                      <div className="flex justify-center items-center gap-1.5">
                        <button
                          onClick={() => onEditTrigger(emp)}
                          className="p-1 border border-gray-200 hover:border-gray-400 text-gray-500 hover:text-gray-900 rounded-md transition-all cursor-pointer bg-white"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteTrigger(emp.id)}
                          className="p-1 border border-gray-200 hover:border-rose-300 text-gray-500 hover:text-rose-600 rounded-md transition-all cursor-pointer bg-white"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!isLoading && employees.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/20">
            <div className="text-[11px] text-gray-500">
              Showing <span className="font-semibold text-gray-850">{employees.length}</span> of{' '}
              <span className="font-semibold text-gray-850">{pagination.total_count}</span> records
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!pagination.prev_page}
                className="p-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-white disabled:text-gray-300 rounded-lg transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              
              <span className="text-[11px] text-gray-500 px-2">
                Page <span className="font-semibold text-gray-800">{pagination.current_page}</span> of{' '}
                <span className="font-semibold text-gray-800">{pagination.total_pages}</span>
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
                disabled={!pagination.next_page}
                className="p-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-white disabled:text-gray-300 rounded-lg transition-all cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
