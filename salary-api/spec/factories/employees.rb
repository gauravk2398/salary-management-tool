FactoryBot.define do
  factory :employee do
    full_name { "John Doe" }
    sequence(:email) { |n| "employee#{n}@example.com" }
    job_title { "Software Engineer" }
    country { "United States" }
    salary { 85000.00 }
    department { "Engineering" }
    employment_type { "Full-time" }
  end
end
