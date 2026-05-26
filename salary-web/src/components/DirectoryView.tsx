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
    <div className="flex flex-col gap-4">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <form onSubmit={onSearch} className="relative flex-grow max-w-sm flex items-center">
          <Search className="w-3 h-3 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search directory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-md py-1.5 pl-8 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
          />
        </form>
        <button
          onClick={onAddTrigger}
          className="flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-950 hover:bg-gray-900 text-white rounded-md text-xs font-medium active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          Add Employee
        </button>
      </div>

      {/* Directory Data Grid Container */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-250 bg-gray-50/40">
                <th className="py-2.5 px-4 text-[9px] font-semibold uppercase tracking-wider text-gray-400">Name</th>
                <th className="py-2.5 px-4 text-[9px] font-semibold uppercase tracking-wider text-gray-400">Email</th>
                <th className="py-2.5 px-4 text-[9px] font-semibold uppercase tracking-wider text-gray-400">Job Title</th>
                <th className="py-2.5 px-4 text-[9px] font-semibold uppercase tracking-wider text-gray-400">Department</th>
                <th className="py-2.5 px-4 text-[9px] font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">Type</th>
                <th className="py-2.5 px-4 text-[9px] font-semibold uppercase tracking-wider text-gray-400">Country</th>
                <th className="py-2.5 px-4 text-[9px] font-semibold uppercase tracking-wider text-gray-400 text-right">Salary</th>
                <th className="py-2.5 px-4 text-[9px] font-semibold uppercase tracking-wider text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                      <span className="text-[11px] text-gray-400">Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <span className="text-[11px] text-gray-400">No records found.</span>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/20 transition-all duration-75">
                    <td className="py-2.5 px-4 text-xs font-medium text-gray-900">{emp.full_name}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-400">{emp.email}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-500">{emp.job_title}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-400">{emp.department}</td>
                    <td className="py-2.5 px-4 text-xs whitespace-nowrap">
                      <span className="px-1.5 py-0.5 text-[9px] font-medium rounded-md border border-gray-150 bg-gray-50 text-gray-500 whitespace-nowrap">
                        {emp.employment_type}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-400">{emp.country}</td>
                    <td className="py-2.5 px-4 text-xs text-right font-medium text-gray-850 font-mono">{formatCurrency(emp.salary)}</td>
                    <td className="py-2.5 px-4 text-xs text-center">
                      <div className="flex justify-center items-center gap-1">
                        <button
                          onClick={() => onEditTrigger(emp)}
                          className="p-1 border border-gray-150 hover:border-gray-300 text-gray-400 hover:text-gray-700 rounded-md transition-all cursor-pointer bg-white"
                          title="Edit"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTrigger(emp.id)}
                          className="p-1 border border-gray-150 hover:border-rose-250 text-gray-400 hover:text-rose-500 rounded-md transition-all cursor-pointer bg-white"
                          title="Delete"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
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
          <div className="border-t border-gray-150 px-4 py-2.5 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/20">
            <div className="text-[10px] text-gray-400">
              Showing <span className="font-medium text-gray-600">{employees.length}</span> of{' '}
              <span className="font-medium text-gray-600">{pagination.total_count}</span> records
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!pagination.prev_page}
                className="p-1 border border-gray-150 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-40 disabled:hover:bg-white disabled:text-gray-300 rounded-md transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              
              <span className="text-[10px] text-gray-400 px-1.5">
                Page <span className="font-medium text-gray-650">{pagination.current_page}</span> of{' '}
                <span className="font-medium text-gray-650">{pagination.total_pages}</span>
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
                disabled={!pagination.next_page}
                className="p-1 border border-gray-150 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-40 disabled:hover:bg-white disabled:text-gray-300 rounded-md transition-all cursor-pointer"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
