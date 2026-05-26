class Api::V1::InsightsController < ApplicationController
  # GET /api/v1/insights
  def index
    country_stats = Employee.group(:country)
                            .select("country, MIN(salary) AS min_salary, MAX(salary) AS max_salary, AVG(salary) AS avg_salary")
                            .order(:country)

    job_stats = Employee.group(:country, :job_title)
                        .select("country, job_title, AVG(salary) AS avg_salary")
                        .order(:country, :job_title)

    department_stats = Employee.group(:department)
                               .select("department, SUM(salary) AS total_spend, AVG(salary) AS avg_salary")
                               .order(:department)

    employment_type_stats = Employee.group(:employment_type)
                                    .select("employment_type, AVG(salary) AS avg_salary")
                                    .order(:employment_type)

    render json: {
      country_stats: country_stats,
      job_stats: job_stats,
      department_stats: department_stats,
      employment_type_stats: employment_type_stats
    }
  end
end
