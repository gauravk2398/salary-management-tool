import { useState, useEffect } from 'react'
import type { Employee, PaginationMeta } from '../types'

const API_BASE_URL = 'http://localhost:3000/api/v1'

export const useEmployees = (currentPage: number, searchQuery: string, showNotification: (msg: string, type: 'success' | 'error') => void) => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 0
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchEmployees = async (page = 1, search = '') => {
    setIsLoading(true)
    try {
      const url = `${API_BASE_URL}/employees?page=${page}&search=${encodeURIComponent(search)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch employees')
      const data = await res.json()
      setEmployees(data.employees)
      setPagination(data.pagination)
    } catch (err) {
      console.error(err)
      showNotification('Error loading employees list', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees(currentPage, searchQuery)
  }, [currentPage])

  return {
    employees,
    pagination,
    isLoading,
    fetchEmployees
  }
}
