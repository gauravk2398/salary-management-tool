import React from 'react'

interface DashboardHeaderProps {
  activeTab: 'directory' | 'insights'
  setActiveTab: (tab: 'directory' | 'insights') => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Salary Management</h1>
        <p className="text-xs text-gray-500">
          Internal administration and salary analysis dashboard.
        </p>
      </div>

      <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl w-full sm:w-auto">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex-1 sm:flex-initial text-xs font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'directory' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Directory
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 sm:flex-initial text-xs font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'insights' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Insights
        </button>
      </div>
    </header>
  )
}
