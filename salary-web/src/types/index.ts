export interface Employee {
  id: number
  full_name: string
  email: string
  job_title: string
  country: string
  salary: string | number
  department: string
  employment_type: string
}

export interface PaginationMeta {
  current_page: number
  next_page: number | null
  prev_page: number | null
  total_pages: number
  total_count: number
}

export interface CountryStat {
  country: string
  min_salary: string
  max_salary: string
  avg_salary: string
}

export interface JobStat {
  country: string
  job_title: string
  avg_salary: string
}

export interface DeptStat {
  department: string
  total_spend: string
  avg_salary: string
}

export interface EmpTypeStat {
  employment_type: string
  avg_salary: string
}
