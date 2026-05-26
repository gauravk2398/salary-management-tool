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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/15">
      <div className="w-full max-w-md bg-white border border-gray-250 rounded-lg overflow-hidden shadow-md relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-md transition-all cursor-pointer bg-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="p-4 border-b border-gray-150 bg-gray-50/20">
          <h2 className="text-xs font-semibold text-gray-950">
            {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
          </h2>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {mode === 'add' 
              ? 'Populate the fields below to register a new employee.' 
              : 'Modify the team member record below.'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-450">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-md px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none"
                placeholder="John Doe"
                required
              />
              {formErrors.full_name && (
                <span className="text-[9px] text-rose-500 font-medium mt-0.5">{formErrors.full_name.join(', ')}</span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-450">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-md px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none"
                placeholder="john.doe@org.com"
                required
              />
              {formErrors.email && (
                <span className="text-[9px] text-rose-500 font-medium mt-0.5">{formErrors.email.join(', ')}</span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-450">Job Title</label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-md px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none"
                placeholder="Software Engineer"
                required
              />
              {formErrors.job_title && (
                <span className="text-[9px] text-rose-500 font-medium mt-0.5">{formErrors.job_title.join(', ')}</span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-450">Salary (USD)</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-md px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none font-mono"
                placeholder="85000"
                min="0"
                required
              />
              {formErrors.salary && (
                <span className="text-[9px] text-rose-500 font-medium mt-0.5">{formErrors.salary.join(', ')}</span>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-450">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-md px-2 py-1.5 text-xs text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-450">Employment Type</label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-md px-2 py-1.5 text-xs text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="flex flex-col gap-0.5 sm:col-span-2">
              <label className="text-[9px] font-semibold uppercase tracking-wider text-gray-450">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={onChange}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 rounded-md px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none"
                placeholder="Canada"
                required
              />
              {formErrors.country && (
                <span className="text-[9px] text-rose-500 font-medium mt-0.5">{formErrors.country.join(', ')}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-md text-xs font-medium cursor-pointer transition-all bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-950 hover:bg-gray-900 text-white rounded-md text-xs font-medium active:scale-95 transition-all cursor-pointer disabled:opacity-40"
            >
              {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
              {mode === 'add' ? 'Register Employee' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
