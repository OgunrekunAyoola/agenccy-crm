---
trigger: always_on
---



This file defines **repo‑specific rules** for agents working on the Agency CRM for digital agencies.

Global rules from `GLOBAL_AGENT_RULES.md` apply in addition to this document.

---

## 1. Tech Stack (Do Not Change)

- Backend: **.NET 8 (ASP.NET Core Web API)**  
- Backend libraries: **EF Core + Npgsql** for PostgreSQL  
- Frontend: **Next.js (App Router, TypeScript)**  
- Database: **PostgreSQL**  
- Cache/queues (later phases): **Redis**  
- Hosting (dev): Docker + docker-compose

Do **not** introduce other backend frameworks, ORMs, or frontend meta‑frameworks unless explicitly requested.

---

## 2. Architecture and Modules

Follow the architecture described in `ARCHITECTURE.md`. Core domains:

- **Auth & Tenants** – users, roles, multi‑tenant context  
- **CRM** – clients, contacts, leads  
- **Offers / Deals** – pipelines, stages, quotes  
- **Projects & Tasks** – created from approved offers  
- **Contracts** – based on offers/projects, templates, versions  
- **Invoicing** – invoices from contracts/projects/time, basic multi‑currency  
- **Ads Metrics** – Google/Meta/TikTok metrics (stubbed in MVP)  
- **Integrations** – webhooks, API endpoints for external systems

Rules:

- Controllers must be thin; business logic lives in services (application layer).  
- Repositories live in infrastructure and should encapsulate data access.  
- Respect domain boundaries; don’t mix concerns across modules.

---

## 3. Multi‑Tenancy and Authorization

- The app is **multi‑tenant**: every business record (client, lead, offer, project, contract, invoice, etc.) must be associated with a `tenant_id`.  
- All queries must be filtered by the current user’s `tenant_id`. Never trust tenant data from the client.  
- Use roles for authorization (at minimum):  
  - `Admin`  
  - `SalesManager`  
  - `ProjectManager`  
  - `Accountant`

When adding endpoints:

- Require authentication except for explicit public endpoints.  
- Apply `[Authorize(Roles = "...")]` as appropriate.  
- Ensure tenant scoping is enforced in services/repositories.

---

## 4. API Design

- Use RESTful endpoints under `/api/*` (e.g. `/api/leads`, `/api/clients`, `/api/offers`, `/api/projects`, `/api/contracts`, `/api/invoices`).  
- Use clear, consistent DTOs for requests and responses.  
- For list endpoints, support pagination and basic filtering where sensible.  
- Return structured errors via the global error handler; do not throw raw exceptions from controllers.

Do not change existing route patterns without a strong reason and explicit instruction.

---

## 5. Frontend Conventions (Next.js)

- Use **App Router** with TypeScript.  
- Use server components where appropriate; keep client components lean and focused on interactivity.  
- Organize pages by feature: e.g. `/clients`, `/leads`, `/offers`, `/projects`, `/invoices`.  
- Use a shared API client that handles:  
  - base URL from env  
  - attaching JWT/cookies  
  - error handling

Match UI behavior to the backend contracts; do not invent new endpoints from the frontend side.

---

## 6. MVP Scope (Phase 1)

For the initial MVP, focus on:

- Authentication + multi‑tenant baseline  
- Core CRM: clients, contacts, leads  
- Offers with one pipeline view (basic Kanban/table)  
- Offer approval → automatic creation of project + tasks  
- Contract creation from approved offer  
- Invoice creation from contract or project (single currency is fine initially)

Ads platform integrations, advanced automation rules, client portal, and rich analytics are **phase 2+** and should be stubbed or left out unless explicitly requested.

---

## 7. Database and Migrations

- Use EF Core migrations for schema changes.  
- Keep migrations **additive and backward‑compatible** where possible.  
- Do not drop tables/columns or perform destructive changes without explicit instruction.  
- Ensure all entities include: `Id`, `TenantId`, timestamps (`CreatedAt`, `UpdatedAt`) as appropriate.

Always provide exact commands to create/apply migrations (`dotnet ef migrations add`, `dotnet ef database update`).

---

## 8. Docker and Local Environment

- The canonical way to run the project locally is:

  ```bash
  docker compose up --build
  ```

- Expectations:  
  - Postgres, API, and Next.js frontend all start via docker-compose.  
  - API reachable at `http://localhost:<api_port>` (e.g. 8000).  
  - Web app reachable at `http://localhost:<web_port>` (e.g. 3000).  
  - `/health` endpoint on the API verifies basic DB connectivity.

If you change ports, env vars, or service names, you **must** update `docker-compose.yml` and `README.md`.

---

## 9. Testing

- Follow `TESTING_GUIDELINES.md`.  
- Every new endpoint or feature must have at least:  
  - 1 integration test for the happy path.  
- Do not introduce new test frameworks; use the ones already configured for this repo.  
- Keep tests fast and deterministic (no external network calls).

---

## 10. Change Process

When implementing a change:

1. Read the four core docs (ARCHITECTURE, CODING_STANDARDS, SECURITY_BASICS, TESTING_GUIDELINES).  
2. Propose a short plan listing:  
   - what you will change,  
   - which files you will touch,  
   - any schema or API changes.  
3. Make small, focused commits.  
4. Run tests and ensure `docker compose up --build` still works.  
5. Update docs if setup or behavior changed.

Do not refactor unrelated areas without explicit request.

```

