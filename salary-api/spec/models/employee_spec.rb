require 'rails_helper'

RSpec.describe Employee, type: :model do
  describe 'validations' do
    subject { build(:employee) }

    it { should validate_presence_of(:full_name) }
    it { should validate_presence_of(:job_title) }
    it { should validate_presence_of(:country) }
    it { should validate_presence_of(:department) }
    it { should validate_presence_of(:employment_type) }
    
    it { should validate_presence_of(:salary) }
    it { should validate_numericality_of(:salary).is_greater_than_or_equal_to(0) }

    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }
    
    it 'allows valid email formats' do
      valid_emails = %w[user@example.com USER@foo.COM first.last@foo.jp alice+bob@co.uk]
      valid_emails.each do |email|
        subject.email = email
        expect(subject).to be_valid
      end
    end

    it 'disallows invalid email formats' do
      invalid_emails = ['user@example,com', 'user_at_foo.org', 'user.name@example.', 'foo@bar_baz.com']
      invalid_emails.each do |email|
        subject.email = email
        expect(subject).not_to be_valid
      end
    end

    it 'allows valid employment types' do
      valid_types = %w[Full-time Part-time Contract]
      valid_types.each do |type|
        subject.employment_type = type
        expect(subject).to be_valid
      end
    end

    it 'disallows invalid employment types' do
      invalid_types = %w[Freelance Intern Temporary]
      invalid_types.each do |type|
        subject.employment_type = type
        expect(subject).not_to be_valid
      end
    end
  end
end
