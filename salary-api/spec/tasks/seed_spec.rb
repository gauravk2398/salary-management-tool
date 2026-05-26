require 'rails_helper'
require 'rake'

RSpec.describe 'db:seed' do
  before :all do
    Rails.application.load_tasks if Rake::Task.tasks.empty?
  end

  it 'populates the database with exactly 10,000 employees in under 2 seconds' do
    # Clear database before seed
    Employee.delete_all

    start_time = Time.now
    
    # Re-enable the task in case it was invoked already
    Rake::Task['db:seed'].reenable
    Rake::Task['db:seed'].invoke
    
    end_time = Time.now

    duration = end_time - start_time
    
    expect(Employee.count).to eq(10_000)
    expect(duration).to be < 2.0
    
    # Verify diversity
    expect(Employee.distinct.count(:country)).to be > 3
    expect(Employee.distinct.count(:department)).to be > 3
    expect(Employee.distinct.count(:employment_type)).to eq(3) # Full-time, Part-time, Contract
  end
end
