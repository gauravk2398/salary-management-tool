require 'rails_helper'

RSpec.describe "Api::V1::Employees", type: :request do
  let!(:employees) { create_list(:employee, 25) } # 25 employees
  let(:employee_id) { employees.first.id }

  describe "GET /api/v1/employees" do
    context "without search query" do
      before { get "/api/v1/employees" }

      it "returns a successful response" do
        expect(response).to have_http_status(200)
      end

      it "returns the first page of employees (default 20 per page)" do
        json = JSON.parse(response.body)
        expect(json["employees"].size).to eq(20)
      end

      it "returns correct pagination metadata" do
        json = JSON.parse(response.body)
        expect(json["pagination"]).to be_present
        expect(json["pagination"]["current_page"]).to eq(1)
        expect(json["pagination"]["total_pages"]).to eq(2)
        expect(json["pagination"]["total_count"]).to eq(25)
      end
    end

    context "with page parameter" do
      before { get "/api/v1/employees?page=2" }

      it "returns the second page of employees" do
        json = JSON.parse(response.body)
        expect(json["employees"].size).to eq(5)
      end

      it "returns correct page metadata" do
        json = JSON.parse(response.body)
        expect(json["pagination"]["current_page"]).to eq(2)
      end
    end

    context "with search query" do
      let!(:specific_employee) do
        create(:employee, full_name: "Unique SearchName", job_title: "Unique Title", country: "Unique Country")
      end

      it "filters employees by full name" do
        get "/api/v1/employees?search=Unique SearchName"
        json = JSON.parse(response.body)
        expect(json["employees"].size).to eq(1)
        expect(json["employees"].first["full_name"]).to eq("Unique SearchName")
      end

      it "filters employees by job title" do
        get "/api/v1/employees?search=Unique Title"
        json = JSON.parse(response.body)
        expect(json["employees"].size).to eq(1)
        expect(json["employees"].first["job_title"]).to eq("Unique Title")
      end

      it "filters employees by country" do
        get "/api/v1/employees?search=Unique Country"
        json = JSON.parse(response.body)
        expect(json["employees"].size).to eq(1)
        expect(json["employees"].first["country"]).to eq("Unique Country")
      end
    end
  end

  describe "GET /api/v1/employees/:id" do
    before { get "/api/v1/employees/#{employee_id}" }

    context "when the employee exists" do
      it "returns the employee data" do
        expect(response).to have_http_status(200)
        json = JSON.parse(response.body)
        expect(json["id"]).to eq(employee_id)
      end
    end

    context "when the employee does not exist" do
      let(:employee_id) { 9999 }

      it "returns status code 404" do
        expect(response).to have_http_status(404)
      end
    end
  end

  describe "POST /api/v1/employees" do
    let(:valid_attributes) do
      {
        full_name: "Alice Smith",
        email: "alice.smith@example.com",
        job_title: "Data Scientist",
        country: "Canada",
        salary: "95000.00",
        department: "Engineering",
        employment_type: "Full-time"
      }
    end

    context "when the request is valid" do
      before { post "/api/v1/employees", params: { employee: valid_attributes } }

      it "creates an employee" do
        expect(response).to have_http_status(201)
        json = JSON.parse(response.body)
        expect(json["full_name"]).to eq("Alice Smith")
        expect(json["email"]).to eq("alice.smith@example.com")
      end
    end

    context "when the request is invalid" do
      before { post "/api/v1/employees", params: { employee: { full_name: "" } } }

      it "returns status code 422" do
        expect(response).to have_http_status(422)
      end

      it "returns validation failure messages" do
        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
        expect(json["errors"]["full_name"]).to include("can't be blank")
      end
    end
  end

  describe "PATCH /api/v1/employees/:id" do
    let(:valid_attributes) { { job_title: "Lead Engineer", salary: "110000.00" } }

    context "when the record exists" do
      before { patch "/api/v1/employees/#{employee_id}", params: { employee: valid_attributes } }

      it "updates the record" do
        expect(response).to have_http_status(200)
        json = JSON.parse(response.body)
        expect(json["job_title"]).to eq("Lead Engineer")
        expect(BigDecimal(json["salary"])).to eq(BigDecimal("110000.00"))
      end
    end

    context "when the record is updated with invalid data" do
      before { patch "/api/v1/employees/#{employee_id}", params: { employee: { salary: "-100" } } }

      it "returns status code 422" do
        expect(response).to have_http_status(422)
      end
    end
  end

  describe "DELETE /api/v1/employees/:id" do
    before { delete "/api/v1/employees/#{employee_id}" }

    it "returns status code 204" do
      expect(response).to have_http_status(204)
    end

    it "deletes the employee record" do
      expect(Employee.find_by(id: employee_id)).to be_nil
    end
  end
end
