# Coding Standards

## Backend (.NET 8)
- **Pattern:** Controller → Service → Repository.
  - Controllers: Route handling, input mapping, status codes.
  - Services: Business logic, multi-tenant scoping, authorization checks.
  - Repositories: EF Core queries, data persistence.
- **Naming:** PascalCase for classes, methods, and properties. camelCase for private fields (`_field`).
- **Error Handling:** Use a global middleware to catch exceptions and return structured `ProblemDetails` or custom error DTOs.
- **Logging:** Use `ILogger` interface. Avoid logging PII or sensitive tenant data.

## Frontend (Next.js)
- **Directory Structure:** `app/` router for pages; `components/` for reusable UI.
- **Types:** Strictly typed TypeScript. Prefer interfaces over types for public APIs.
- **Naming:** PascalCase for components (`ClientCard.tsx`); camelCase for hooks and utilities.
- **Data Fetching:** Prefer Server Components for initial page load. Use a centralized API client with error handling.

## General
- **Indentation:** 2 spaces for TS/CSS; 4 spaces for C#.
- **Comments:** Self-documenting code. Add comments for complex business rules or "why" decisions.
- **File Length:** Keep files under 250 lines when possible. Refactor into smaller components or services if they grow large.
