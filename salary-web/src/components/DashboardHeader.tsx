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
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/80 pb-4">
      <div className="flex flex-col">
        <h1 className="text-base font-semibold tracking-tight text-gray-950">Salary Management</h1>
        <p className="text-[11px] text-gray-400">
          Internal organization directory and analytics.
        </p>
      </div>

      <div className="flex gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
        <button
          onClick={() => setActiveTab('directory')}
          className={`text-xs font-medium pb-4 sm:-mb-4 transition-all cursor-pointer ${
            activeTab === 'directory' 
              ? 'text-gray-950 border-b-2 border-gray-950 font-semibold' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Directory
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`text-xs font-medium pb-4 sm:-mb-4 transition-all cursor-pointer ${
            activeTab === 'insights' 
              ? 'text-gray-950 border-b-2 border-gray-950 font-semibold' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Insights
        </button>
      </div>
    </header>
  )
}
