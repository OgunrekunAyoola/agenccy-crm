# Developer Copilot Guide (AI Assistant)

This document defines how AI assistants (LLMs) are used in the Agency CRM project.

## 1. Allowed Usage Scope 🛠️

AI assistants are primarily used for **development-time tasks**:

- **Architecture & Design**: Suggesting patterns, reviewing schemas, and verifying architectural consistency.
- **Scaffolding & Boilerplate**: Generating initial controllers, services, repositories, and DTOs following existing module patterns.
- **Test Generation**: Creating unit, integration, and frontend tests.
- **Documentation**: Updating READMEs, ARCHITECTURE.md, and creating walkthroughs of new features.

## 2. Prohibited Usage (Runtime) ⚠️

> [!IMPORTANT]
> AI models (LLMs) are **not** part of the runtime production logic.
> - **Do NOT** call LLM APIs (OpenAI, Gemini, etc.) during request processing.
> - **Do NOT** use LLMs for dynamic data transformation or decision-making at runtime.
> - The application logic must be deterministic and written in C# (.NET) or TypeScript (Next.js).

## 3. Recommended Prompting Patterns 📝

To get the best results when working on this project, use the following patterns:

### Implementing New Features
> "Implement [Feature Name] following the patterns in the [CRM/Auth/Invoicing] module. I need [Entities] in Domain, [DTOs/Services] in Application, and REST endpoints in the Api project. Ensure `tenant_id` scoping is applied."

### Refactoring
> "Refactor the logical flow in [FileName.cs] to improve [Readability/Performance/Consistency] without changing external behavior. Refer to `CODING_STANDARDS.md` and ensure existing tests remain green."

### Debugging Issues
> "I am seeing [Error Description/Stack Trace] in the [Link/Flow]. Analyze the interaction between [ServiceA] and [ServiceB]. Check `LogEnrichmentMiddleware` and ensure the `tenant_id` is correctly resolved from the context."

---

## 4. Integration
This document is linked from [AGENT_GUIDE.md](file:///c:/Users/F%20MORE/OneDrive/Desktop/agency%20CRM/AGENT_GUIDE.md) and should be the secondary source of truth for any AI assistant working on this project.
