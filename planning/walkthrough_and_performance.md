# Implementation Walkthrough & Performance Metrics

This document provides a walkthrough of the completed Salary Management implementation, including our Test-Driven Development (TDD) spec execution and the module-centric frontend architecture.

---

## 1. TDD Validation & Verification

I followed Test-Driven Development closely, ensuring model validations, constraints, seeding speeds, and aggregate serialization specs were written first (RED) before writing active queries (GREEN). 

The test suite runs inside an isolated containerized PostgreSQL test database:

```bash
docker compose exec api env RAILS_ENV=test bundle exec rspec
```

### Spec Verification Log
All **36 specs** pass seamlessly in **1.56 seconds**:

```text
Finished in 1.56 seconds (files took 0.835 seconds to load)
36 examples, 0 failures
```

---

## 2. Decoupled, Module-Centric Frontend Architecture

On the client side, I built the Vite + React single-page application using a highly modular approach. Instead of wrapping state, layout, styling, and networking into a single file, I split them into distinct layers:

```text
src/
├── types/
│   └── index.ts        # Modular TypeScript type definitions (no logic)
├── hooks/
│   ├── useEmployees.ts # Isolated payroll directory API hooks
│   └── useInsights.ts  # Isolated aggregate metrics hooks
└── components/
    ├── DashboardHeader.tsx # Tab navigation and metadata
    ├── DirectoryView.tsx   # Paginated employee list table & searching
    ├── InsightsView.tsx    # Payroll aggregations & Recharts analytics
    └── EmployeeModal.tsx   # Employee Modal register & validations
```

### Benefits of this Approach:
* **Separation of Concerns**: Visual components are thin and presentational; they receive data through props and trigger custom hook callbacks.
* **Testability**: Custom state hooks (`useEmployees`, `useInsights`) can be tested independently of DOM rendering.
* **Typing Safety**: Shared types prevent syntax mismatches between API endpoints and visual charts.

---

## 3. Sleek, Stripe-Like Design Aesthetics

The user interface was styled in an ultra-sleek, minimalist greyscale design system (comparable to modern developer tools like Stripe and Linear):
* **Typography**: Integrated the crisp sans-serif typeface **Inter** via Google Fonts.
* **Contrast & Borders**: Removed bulky borders, color containers, and shadows in favor of thin 1px dividers (`border-gray-200`) and soft monochrome tags.
* **Monochrome Visuals**: Set up **Recharts** charts to use a curated charcoal greyscale gradient palette (`#0f172a`, `#334155`, `#475569`), making it feel clean and extremely professional.
