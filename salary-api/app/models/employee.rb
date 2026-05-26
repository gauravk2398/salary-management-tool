class Employee < ApplicationRecord
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  VALID_EMPLOYMENT_TYPES = %w[Full-time Part-time Contract].freeze

  validates :full_name, presence: true
  validates :job_title, presence: true
  validates :country, presence: true
  validates :department, presence: true
  
  validates :employment_type, presence: true, inclusion: { in: VALID_EMPLOYMENT_TYPES }
  
  validates :salary, presence: true, numericality: { greater_than_or_equal_to: 0 }
  
  validates :email, presence: true, 
                    uniqueness: { case_sensitive: false }, 
                    format: { with: VALID_EMAIL_REGEX }
end
