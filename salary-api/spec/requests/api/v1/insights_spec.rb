require 'rails_helper'

RSpec.describe "Api::V1::Insights", type: :request do
  before do
    # Clear and create deterministic records for testing calculations
    Employee.delete_all

    create(:employee, country: "USA", job_title: "Software Engineer", department: "Engineering", employment_type: "Full-time", salary: 100000.00, email: "e1@org.com")
    create(:employee, country: "USA", job_title: "Software Engineer", department: "Engineering", employment_type: "Full-time", salary: 120000.00, email: "e2@org.com")
    create(:employee, country: "USA", job_title: "HR Generalist", department: "Human Resources", employment_type: "Part-time", salary: 50000.00, email: "e3@org.com")
    create(:employee, country: "India", job_title: "Software Engineer", department: "Engineering", employment_type: "Contract", salary: 40000.00, email: "e4@org.com")
    create(:employee, country: "India", job_title: "Recruiter", department: "Human Resources", employment_type: "Full-time", salary: 30000.00, email: "e5@org.com")
  end

  describe "GET /api/v1/insights" do
    before { get "/api/v1/insights" }

    it "returns HTTP success status 200" do
      expect(response).to have_http_status(200)
    end

    it "returns correct country-level salary metrics (min, max, average)" do
      json = JSON.parse(response.body)
      country_stats = json["country_stats"]
      expect(country_stats).to be_present

      usa_stats = country_stats.find { |s| s["country"] == "USA" }
      expect(usa_stats).to be_present
      expect(BigDecimal(usa_stats["min_salary"])).to eq(BigDecimal("50000.00"))
      expect(BigDecimal(usa_stats["max_salary"])).to eq(BigDecimal("120000.00"))
      expect(BigDecimal(usa_stats["avg_salary"])).to eq(BigDecimal("90000.00"))

      india_stats = country_stats.find { |s| s["country"] == "India" }
      expect(india_stats).to be_present
      expect(BigDecimal(india_stats["min_salary"])).to eq(BigDecimal("30000.00"))
      expect(BigDecimal(india_stats["max_salary"])).to eq(BigDecimal("40000.00"))
      expect(BigDecimal(india_stats["avg_salary"])).to eq(BigDecimal("35000.00"))
    end

    it "returns correct job title averages by country" do
      json = JSON.parse(response.body)
      job_stats = json["job_stats"]
      expect(job_stats).to be_present

      usa_eng = job_stats.find { |s| s["country"] == "USA" && s["job_title"] == "Software Engineer" }
      expect(usa_eng).to be_present
      expect(BigDecimal(usa_eng["avg_salary"])).to eq(BigDecimal("110000.00"))

      usa_hr = job_stats.find { |s| s["country"] == "USA" && s["job_title"] == "HR Generalist" }
      expect(usa_hr).to be_present
      expect(BigDecimal(usa_hr["avg_salary"])).to eq(BigDecimal("50000.00"))

      india_eng = job_stats.find { |s| s["country"] == "India" && s["job_title"] == "Software Engineer" }
      expect(india_eng).to be_present
      expect(BigDecimal(india_eng["avg_salary"])).to eq(BigDecimal("40000.00"))
    end

    it "returns correct department budget distribution (total and average spend)" do
      json = JSON.parse(response.body)
      dept_stats = json["department_stats"]
      expect(dept_stats).to be_present

      eng = dept_stats.find { |s| s["department"] == "Engineering" }
      expect(eng).to be_present
      expect(BigDecimal(eng["total_spend"])).to eq(BigDecimal("260000.00"))
      expect(BigDecimal(eng["avg_salary"]).round(2)).to eq(BigDecimal("86666.67"))

      hr = dept_stats.find { |s| s["department"] == "Human Resources" }
      expect(hr).to be_present
      expect(BigDecimal(hr["total_spend"])).to eq(BigDecimal("80000.00"))
      expect(BigDecimal(hr["avg_salary"])).to eq(BigDecimal("40000.00"))
    end

    it "returns correct employment type averages" do
      json = JSON.parse(response.body)
      type_stats = json["employment_type_stats"]
      expect(type_stats).to be_present

      ft = type_stats.find { |s| s["employment_type"] == "Full-time" }
      expect(ft).to be_present
      expect(BigDecimal(ft["avg_salary"]).round(2)).to eq(BigDecimal("83333.33"))

      pt = type_stats.find { |s| s["employment_type"] == "Part-time" }
      expect(pt).to be_present
      expect(BigDecimal(pt["avg_salary"])).to eq(BigDecimal("50000.00"))

      contract = type_stats.find { |s| s["employment_type"] == "Contract" }
      expect(contract).to be_present
      expect(BigDecimal(contract["avg_salary"])).to eq(BigDecimal("40000.00"))
    end
  end
end
