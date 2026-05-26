class CreateEmployees < ActiveRecord::Migration[7.1]
  def change
    create_table :employees do |t|
      t.string :full_name, null: false
      t.string :email, null: false
      t.string :job_title, null: false
      t.string :country, null: false
      t.decimal :salary, null: false, precision: 15, scale: 2
      t.string :department, null: false
      t.string :employment_type, null: false

      t.timestamps

      t.check_constraint "salary >= 0", name: "salary_non_negative"
    end

    add_index :employees, :email, unique: true
  end
end
