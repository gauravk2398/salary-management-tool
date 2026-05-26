import React from 'react'
import { X, Loader2 } from 'lucide-react'

interface EmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  formData: {
    full_name: string
    email: string
    job_title: string
    country: string
    salary: string
    department: string
    employment_type: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  formErrors: Record<string, string[]>
  isSubmitting: boolean
  mode: 'add' | 'edit'
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  formErrors,
  isSubmitting,
  mode
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-lg transition-all cursor-pointer bg-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="p-5 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-900">
            {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
          </h2>
          <p className="text-[11px] text-gray-500">
            {mode === 'add' 
              ? 'Populate the fields below to enroll a new member into the organization.' 
              : 'Modify the records of this team member below.'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-5 flex flex-col gap-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900/10"
                placeholder="John Doe"
                required
              />
              {formErrors.full_name && (
                <span className="text-[10px] text-rose-500 font-medium">{formErrors.full_name.join(', ')}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900/10"
                placeholder="john.doe@org.com"
                required
              />
              {formErrors.email && (
                <span className="text-[10px] text-rose-500 font-medium">{formErrors.email.join(', ')}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Job Title</label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900/10"
                placeholder="Software Engineer"
                required
              />
              {formErrors.job_title && (
                <span className="text-[10px] text-rose-500 font-medium">{formErrors.job_title.join(', ')}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Salary (USD)</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900/10 font-mono"
                placeholder="85000"
                min="0"
                required
              />
              {formErrors.salary && (
                <span className="text-[10px] text-rose-500 font-medium">{formErrors.salary.join(', ')}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-lg px-2.5 py-2 text-xs text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Employment Type</label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-lg px-2.5 py-2 text-xs text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900/10"
                placeholder="Canada"
                required
              />
              {formErrors.country && (
                <span className="text-[10px] text-rose-500 font-medium">{formErrors.country.join(', ')}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-3 border-t border-gray-150 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold cursor-pointer active:scale-98 transition-all bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-45"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {mode === 'add' ? 'Register Employee' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
