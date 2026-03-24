# Testing Guidelines

## Overview
We prioritize fast, deterministic tests that provide high confidence for core business logic and critical user flows.

## Backend (xUnit)
- **Unit Tests:** Focus on complex domain logic in services. Mock repositories using `Moq` or NSubstitute.
- **Integration Tests:** Use `WebApplicationFactory` to test API endpoints against a real or in-memory database.
- **Naming:** `MethodName_StateUnderTest_ExpectedBehavior` (e.g., `CreateLead_InvalidTenant_ReturnsUnauthorized`).

## Frontend (Vitest + Playwright)
- **Component Tests:** Vitest + React Testing Library for isolated UI logic.
- **End-to-End (E2E):** Playwright for critical paths (Login -> Create Lead -> Create Offer).
- **Mocks:** Use MSW (Mock Service Worker) for API mocking in component tests.

## Continuous Integration
- All tests must pass before merging.
- GitHub Actions (or similar) will run the full suite on PRs.
- Maintain at least 80% coverage on core application services.

## Commands
- **Backend:** `dotnet test`
- **Frontend:** `npm test` or `npm run e2e`
