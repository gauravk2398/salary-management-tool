class AddOptimizedIndexesToEmployees < ActiveRecord::Migration[7.1]
  def change
    add_index :employees, [:country, :job_title, :salary], name: 'idx_employees_country_job_salary'
    add_index :employees, [:department, :salary], name: 'idx_employees_department_salary'
    add_index :employees, [:employment_type, :salary], name: 'idx_employees_employment_type_salary'
  end
end
