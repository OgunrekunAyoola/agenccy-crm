# Security Basics

## Authentication & Authorization
- **Identity:** Use custom JWT with strict HTTP-Only, Secure cookies. Do not expose tokens to frontend JavaScript.
- **RBAC:** Roles defined: `Admin`, `SalesManager`, `ProjectManager`, `Accountant`.
- **Enforcement:** Use `[Authorize(Roles = "...")]` in the API and layout-based checks in the frontend.

## Multi-Tenancy (Critical)
- **Tenant ID:** Every table must have a `TenantId` column (Guid/UUID).
- **Isolation:** The `TenantProvider` service must inject the `TenantId` from the context (e.g., JWT claim or header).
- **Query Filters:** Use EF Core Global Query Filters (`HasQueryFilter`) to ensure `TenantId` is always applied.

## Secrets Management
- **Local:** Use `user-secrets` for .NET and `.env.local` for Next.js.
- **Production:** Environment variables or Azure Key Vault/AWS Secrets Manager.
- **Rule:** Never commit `.env` or sensitive JSON config to Git.

## Data Protection
- Sanitization: Validate and sanitize all user inputs on both frontend and backend.
- SQL Injection: Covered by EF Core parameterization; use `FromSql` sparingly.
- XSS: Next.js/React handles most XSS by default; be cautious with `dangerouslySetInnerHTML`.
