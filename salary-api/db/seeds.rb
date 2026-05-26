# This file seeds 10,000 realistic employees into the database with high performance.

first_names = File.read(Rails.root.join('db/data/first_names.txt')).split("\n").map(&:strip).reject(&:empty?)
last_names = File.read(Rails.root.join('db/data/last_names.txt')).split("\n").map(&:strip).reject(&:empty?)

departments = ["Engineering", "Sales", "Marketing", "Human Resources", "Finance", "Legal"]
titles = {
  "Engineering" => ["Software Engineer", "Senior Engineer", "DevOps Engineer", "Engineering Manager"],
  "Sales" => ["Account Executive", "Sales Manager", "Business Development Representative"],
  "Marketing" => ["Marketing Specialist", "SEO Strategist", "Marketing Director"],
  "Human Resources" => ["HR Generalist", "Recruiter", "HR Director"],
  "Finance" => ["Financial Analyst", "Accountant", "Finance Manager"],
  "Legal" => ["Legal Counsel", "Associate Counsel", "Legal Director"]
}
countries = ["USA", "India", "Canada", "Germany", "United Kingdom", "Japan", "Australia"]

employees_data = []

10_000.times do |i|
  first = first_names.sample
  last = last_names.sample
  dept = departments.sample
  title = titles[dept]&.sample || "Associate"
  emp_type = ["Full-time", "Part-time", "Contract"].sample
  country = countries.sample
  
  # Ensure unique emails by appending the index i
  email = "#{first.downcase}.#{last.downcase}.#{i}@organization.com"
  salary = emp_type == "Contract" ? rand(40_000..90_000) : rand(60_000..160_000)

  employees_data << {
    full_name: "#{first} #{last}",
    email: email,
    job_title: title,
    department: dept,
    employment_type: emp_type,
    country: country,
    salary: salary,
    created_at: Time.current,
    updated_at: Time.current
  }
end

# Bulk insert in slices
employees_data.each_slice(2500) do |slice|
  Employee.insert_all!(slice)
end
