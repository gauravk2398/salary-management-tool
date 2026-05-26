# AI Agent Collaboration & Engineering Trade-Offs

This document details my collaborative process using agentic AI tools to accelerate software construction, along with major engineering trade-offs and code decisions made during development.

---

## 1. AI Prompting & Iterative Code Reviews

I used an intentional, AI-driven development approach:
* **Initial Planning**: Prompted the AI to scaffold a Dockerized network with Rails in API-only mode and Vite + React, detailing testing frameworks (RSpec, Vitest) in a unified design system.
* **Iterative Design Reviews**: When configuring the user interface styling, I iteratively adjusted tailwind classes and custom theme configs to transition the portal from generic colorful pill containers to an ultra-sleek, minimalist greyscale design system.
* **Hot-Reloading ESM Imports**: Identified and resolved a subtle Vite native unbundled browser ESM bug (where directory module relative paths fail to resolve natively at runtime) by explicitly updating hook and component imports to reference `../types/index` using type-only `import type` syntax.

---

## 2. Engineering Trade-Offs & Decisions

### Trade-Off 1: SQLite vs. PostgreSQL 15
* **Decision**: Selected **PostgreSQL 15** over SQLite.
* **Rationale**: Although SQLite is lightweight, managing composite database indexes and sub-second aggregate calculations across 10,000+ employee records is best solved using a production-ready relational engine like PostgreSQL, which supports advanced query plans and memory-buffered composite index-only scans.

### Trade-Off 2: Batch `insert_all!` vs. Active Record Validations on Seed
* **Decision**: Batched database bulk seeds using `insert_all!` in slices of 2,500 records.
* **Rationale**: Standard model validation loops in seeds perform 10,000 separate SQL queries, taking minutes. By constructing raw hashes and writing them in large batches, I bypassed validation roundtrips to achieve a **0.6-second seed time**. Model validations are still safely enforced inside controller specs, request parameters, and database schemas.

### Trade-Off 3: Modular Hook-Based React State vs. Context Monolith
* **Decision**: Decoupled network calls and React states into discrete custom hooks (`useEmployees`, `useInsights`).
* **Rationale**: Placing state hooks directly inside components makes testing them difficult. Wrapping everything in a global Context can lead to unnecessary re-renders. Storing state in simple, specialized hooks is easy to read, test, and maintain.
