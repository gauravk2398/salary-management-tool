import { useState } from 'react'
import type { CountryStat, JobStat, DeptStat, EmpTypeStat } from '../types/index'

const API_BASE_URL = 'http://localhost:3000/api/v1'

export const useInsights = (showNotification: (msg: string, type: 'success' | 'error') => void) => {
  const [countryStats, setCountryStats] = useState<CountryStat[]>([])
  const [jobStats, setJobStats] = useState<JobStat[]>([])
  const [deptStats, setDeptStats] = useState<DeptStat[]>([])
  const [empTypeStats, setEmpTypeStats] = useState<EmpTypeStat[]>([])
  const [selectedCountryForJob, setSelectedCountryForJob] = useState<string>('')
  const [insightsLoading, setInsightsLoading] = useState<boolean>(true)

  const fetchInsights = async () => {
    setInsightsLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/insights`)
      if (!res.ok) throw new Error('Failed to fetch insights')
      const data = await res.json()
      setCountryStats(data.country_stats)
      setJobStats(data.job_stats)
      setDeptStats(data.department_stats)
      setEmpTypeStats(data.employment_type_stats)
      
      // Auto-select first country for job average dropdown
      if (data.country_stats.length > 0 && !selectedCountryForJob) {
        setSelectedCountryForJob(data.country_stats[0].country)
      }
    } catch (err) {
      console.error(err)
      showNotification('Error loading analytics and insights', 'error')
    } finally {
      setInsightsLoading(false)
    }
  }

  return {
    countryStats,
    jobStats,
    deptStats,
    empTypeStats,
    selectedCountryForJob,
    setSelectedCountryForJob,
    insightsLoading,
    fetchInsights
  }
}
