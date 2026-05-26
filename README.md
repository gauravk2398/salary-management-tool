# Salary Management & Analytics Portal

This is a clean, highly optimized salary administration and insights dashboard. I built this project from scratch using a modular, decoupled architecture, separating a **Ruby on Rails 7 API** and a **Vite + React + TypeScript SPA** under a unified Docker Compose network.

Rather than stacking everything into a single monolith, I structured the codebase logically in the exact chronological order of how I developed and scaled the systems.

---

## 🛠️ My Development Journey & Architecture

Here is the step-by-step modular approach I followed during the development of this portal:

### 1. Multi-Container Infrastructure
I started by containerizing the local development workspace using Docker Compose. I split the architecture into three isolated services:
* **`db`**: A PostgreSQL 15 instance with persistent volume mapping.
* **`api`**: A Rails 7 application booted in API-only mode.
* **`web`**: A React single-page application served dynamically via a Vite dev server.

All services are joined on a local Docker network, ensuring the frontend container communicates cleanly with the API inside the isolated subnet.

---

### 2. Backend Foundation & Sub-Second Seeding
Next, I established the database layer with rigorous constraints:
* Added strict model-level validations and database-level check constraints to guarantee payroll integrity (e.g., ensuring `salary > 0` and emails are unique/valid).
* **The Seeding Challenge**: Generating 10,000 realistic employee records. Standard ActiveRecord create-loops are slow due to repeated SQL inserts and validation checks. I solved this by writing a custom seed using batch ActiveRecord `insert_all!` insertions, populating all **10,000 records in 0.6 seconds** inside the Postgres container.

---

### 3. Paginated REST APIs & Index Optimizations
To support an administration interface managing large volumes of records, I implemented:
* **Paginated CRUD API**: Paginated `GET /employees` using offset parameters to return lightweight 20-employee chunks, complete with custom pagination header metadata (`total_count`, `total_pages`).
* **Insights Engine**: To calculate aggregate metrics (budgets, averages, min/max ranges) across 10,000 employees instantly, I created a single optimized `/insights` endpoint.
* **Composite DB Indexing**: I added composite database indexes (such as `[:country, :job_title, :salary]` and `[:department, :salary]`) directly in a database migration. This turned slow database table scans into **milliseconds-fast index-only scans**, ensuring dashboard analytics load instantly.

---

### 4. Decoupled, Module-Centric Frontend
On the client side, I structured the React SPA using a strict **module-centric approach** to keep files focused, reusable, and single-purpose:
* **Shared Types (`src/types/index.ts`)**: Unified TypeScript declarations for employees, paginated metadata, and aggregate dashboard metrics.
* **Custom React Hooks (`src/hooks/`)**: I decoupled all API fetch logic and state coordination out of visual components into hooks (`useEmployees.ts` and `useInsights.ts`).
* **Visual Components (`src/components/`)**: Pure presentational layers that receive state via props:
  * `DashboardHeader.tsx`: Handles application tabs.
  * `DirectoryView.tsx`: Manages the clean list grid, pagination toggles, and searching.
  * `InsightsView.tsx`: Displays aggregations using responsive Recharts diagrams.
  * `EmployeeModal.tsx`: Controls modal registers and form validations.

---

### 5. Ultra-Sleek, Minimalist Styling Revamp
Following the layout scaffolding, I redesigned the entire visual identity into an **ultra-sleek, minimalist greyscale theme** (reminiscent of Stripe or Linear's modern tool interfaces):
* Imported the **Inter** font family via Google Fonts inside `src/index.css` and mapped it as my global layout typeface.
* Cleaned up the navigation header to use elegant bottom-underline active highlights.
* Stripped away heavy colored badges and shadows in favor of thin borders (`border-gray-200`) and soft monochrome tags with `whitespace-nowrap` layout guarantees.
* Configured all charts inside the insights view to use a polished charcoal gradient palette (`#0f172a`, `#475569`, `#cbd5e1`).

---

### 6. DevOps Caching & CI Pipeline
To finalize the codebase for production readiness:
* **Multi-Stage Dockerfile**: I refactored `salary-web/Dockerfile` into a two-stage build. The `builder` stage installs NPM packages and caches `node_modules` in an isolated layer, while the lightweight `runner` stage copies the pre-built directory and serves the app.
* **Continuous Integration**: I wrote a GitHub Actions pipeline (`.github/workflows/ci.yml`) that concurrently tests Rails RSpec specs (setting up an isolated PostgreSQL service container) and checks frontend TypeScript builds (`npm run build`) on every push.

---

## 🐋 Docker Run Book (How to Run Locally)

You can launch and verify the entire system in a few simple commands:

### 1. Build and Boot Containers
```bash
docker compose build
docker compose up -d
```

### 2. Create, Migrate, and Seed the Database
```bash
# Setup schemas and index migrations
docker compose exec api bundle exec rails db:create db:migrate

# Seed 10,000 employee records
docker compose exec api bundle exec rails db:seed
```

### 3. Verify Seeding Count
```bash
docker compose exec api bundle exec rails runner "puts Employee.count"
# Expected output: 10000
```

### 4. Run RSpec Tests inside the Container
```bash
docker compose exec api env RAILS_ENV=test bundle exec rspec
```

---

## 🌐 Mapped Entrypoints

* **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
* **Backend API Base**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
