class Api::V1::EmployeesController < ApplicationController
  before_action :set_employee, only: [:show, :update, :destroy]

  # GET /api/v1/employees
  def index
    page = (params[:page] || 1).to_i
    per_page = 20
    offset = (page - 1) * per_page

    employees = Employee.all

    if params[:search].present?
      search_query = "%#{params[:search]}%"
      employees = employees.where(
        "full_name ILIKE :query OR job_title ILIKE :query OR country ILIKE :query",
        query: search_query
      )
    end

    total_count = employees.count
    total_pages = (total_count.to_f / per_page).ceil
    
    # Order by ID to have deterministic pagination for RSpec
    paginated_employees = employees.order(:id).offset(offset).limit(per_page)

    render json: {
      employees: paginated_employees,
      pagination: {
        current_page: page,
        next_page: page < total_pages ? page + 1 : nil,
        prev_page: page > 1 ? page - 1 : nil,
        total_pages: total_pages,
        total_count: total_count
      }
    }
  end

  # GET /api/v1/employees/:id
  def show
    render json: @employee
  end

  # POST /api/v1/employees
  def create
    employee = Employee.new(employee_params)

    if employee.save
      render json: employee, status: :created
    else
      render json: { errors: employee.errors }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/employees/:id
  def update
    if @employee.update(employee_params)
      render json: @employee
    else
      render json: { errors: @employee.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/employees/:id
  def destroy
    @employee.destroy
    head :no_content
  end

  private

  def set_employee
    @employee = Employee.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Employee not found" }, status: :not_found
  end

  def employee_params
    params.require(:employee).permit(
      :full_name, :email, :job_title, :country, 
      :salary, :department, :employment_type
    )
  end
end
