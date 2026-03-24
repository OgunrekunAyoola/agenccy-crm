# Agent Guide

## Working with this Repo
You are assisting with the development of the Agency CRM. Follow these strict guidelines:

1. **Context First:** Read `ARCHITECTURE.md`, `CODING_STANDARDS.md`, `SECURITY_BASICS.md`, and `TESTING_GUIDELINES.md` before making any changes.
2. **Stack Discipline:** Do not introduce new frameworks or libraries without explicit approval. Stick to .NET 8, Next.js, and EF Core.
3. **Multi-Tenancy:** Ensure `tenant_id` is applied to every new record and query. Never bypass the multi-tenant scoping.
4. **Small Changes:** Prefer small, incremental PRs over large refactors.
5. **Add Tests:** Every feature or bug fix must include corresponding tests. Run `dotnet test` and `npm test` before concluding.
6. **No Breaking Changes:** Maintain backward compatibility for the API and schema during migrations.
7. **Explain:** Provide a summary of your changes and instructions on how to verify them.

## Workflow
- Propose a plan before writing code.
- Implement the baseline (DB -> API -> UI).
- Add tests.
- Verify using Docker.

Refer to [DEV_COPILOT.md](file:///c:/Users/F%20MORE/OneDrive/Desktop/agency%20CRM/DEV_COPILOT.md) for detailed guidelines on how to effectively use AI assistance for development tasks while respecting runtime boundaries.

