import { useState } from 'react'
import { 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react'
import type { Employee } from './types/index'
import { DashboardHeader } from './components/DashboardHeader'
import { DirectoryView } from './components/DirectoryView'
import { InsightsView } from './components/InsightsView'
import { EmployeeModal } from './components/EmployeeModal'
import { useEmployees } from './hooks/useEmployees'
import { useInsights } from './hooks/useInsights'

const API_BASE_URL = 'http://localhost:3000/api/v1'

function App() {
  const [activeTab, setActiveTab] = useState<'directory' | 'insights'>('directory')
  
  // Notification State
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  // Hook-managed states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState<string>('')

  const {
    employees,
    pagination,
    isLoading,
    fetchEmployees
  } = useEmployees(currentPage, submittedSearchQuery, showNotification)

  const {
    countryStats,
    jobStats,
    deptStats,
    empTypeStats,
    selectedCountryForJob,
    setSelectedCountryForJob,
    insightsLoading,
    fetchInsights
  } = useInsights(showNotification)

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  
  // Form States
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    job_title: '',
    country: '',
    salary: '',
    department: 'Engineering',
    employment_type: 'Full-time'
  })
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleTabChange = (tab: 'directory' | 'insights') => {
    setActiveTab(tab)
    if (tab === 'insights') {
      fetchInsights()
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    setSubmittedSearchQuery(searchQuery)
  }

  const handleOpenAddModal = () => {
    setFormData({
      full_name: '',
      email: '',
      job_title: '',
      country: '',
      salary: '',
      department: 'Engineering',
      employment_type: 'Full-time'
    })
    setFormErrors({})
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (employee: Employee) => {
    setSelectedEmployee(employee)
    setFormData({
      full_name: employee.full_name,
      email: employee.email,
      job_title: employee.job_title,
      country: employee.country,
      salary: employee.salary.toString(),
      department: employee.department,
      employment_type: employee.employment_type
    })
    setFormErrors({})
    setIsEditModalOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormErrors({})
    try {
      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee: formData })
      })
      const data = await res.json()
      if (res.status === 201) {
        setIsAddModalOpen(false)
        fetchEmployees(currentPage, submittedSearchQuery)
        showNotification('Employee successfully added to organization!', 'success')
      } else {
        setFormErrors(data.errors || { general: ['Submission failed'] })
      }
    } catch (err) {
      console.error(err)
      showNotification('Error creating employee record', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee) return
    setIsSubmitting(true)
    setFormErrors({})
    try {
      const res = await fetch(`${API_BASE_URL}/employees/${selectedEmployee.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee: formData })
      })
      const data = await res.json()
      if (res.status === 200) {
        setIsEditModalOpen(false)
        fetchEmployees(currentPage, submittedSearchQuery)
        showNotification('Employee record updated successfully', 'success')
      } else {
        setFormErrors(data.errors || { general: ['Submission failed'] })
      }
    } catch (err) {
      console.error(err)
      showNotification('Error updating employee record', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('Are you absolutely sure you want to delete this employee? This action is irreversible.')) return
    try {
      const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE'
      })
      if (res.status === 204) {
        fetchEmployees(currentPage, submittedSearchQuery)
        showNotification('Employee record successfully deleted', 'success')
      } else {
        showNotification('Could not delete record', 'error')
      }
    } catch (err) {
      console.error(err)
      showNotification('Error deleting record from server', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 flex flex-col font-sans select-none antialiased">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg shadow-sm border bg-white transition-all duration-200 ${
          notification.type === 'success' 
            ? 'border-gray-200 text-gray-900' 
            : 'border-rose-200 text-rose-600 bg-rose-50/30'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
          <span className="text-xs font-medium">{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 flex-grow">
        
        {/* Glowing Gradient Header */}
        <DashboardHeader activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Directory View */}
        {activeTab === 'directory' && (
          <DirectoryView
            employees={employees}
            pagination={pagination}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isLoading={isLoading}
            onSearch={handleSearchSubmit}
            onAddTrigger={handleOpenAddModal}
            onEditTrigger={handleOpenEditModal}
            onDeleteTrigger={handleDeleteEmployee}
          />
        )}

        {/* Insights View */}
        {activeTab === 'insights' && (
          <InsightsView
            countryStats={countryStats}
            jobStats={jobStats}
            deptStats={deptStats}
            empTypeStats={empTypeStats}
            selectedCountryForJob={selectedCountryForJob}
            setSelectedCountryForJob={setSelectedCountryForJob}
            insightsLoading={insightsLoading}
          />
        )}

      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 mt-12 bg-white">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Salary Management Portal. All rights reserved.
        </div>
      </footer>

      {/* Add Employee Modal */}
      <EmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateEmployee}
        formData={formData}
        onChange={handleInputChange}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        mode="add"
      />

      {/* Edit Employee Modal */}
      <EmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateEmployee}
        formData={formData}
        onChange={handleInputChange}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        mode="edit"
      />

    </div>
  )
}

export default App
