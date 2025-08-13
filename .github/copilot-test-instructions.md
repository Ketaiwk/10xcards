# AI Rules for 10xCards`

10xCards to aplikacja webowa, która automatyzuje proces tworzenia fiszek edukacyjnych za pomocą AI. Umożliwia użytkownikom generowanie, edytowanie i zarządzanie fiszkami w prosty i intuicyjny sposób. Produkt jest skierowany do osób uczących się, które chcą efektywnie korzystać z metody spaced repetition.

## Tech Stack

Frontend
- Astro 5
- React 19 
- TypeScript 5
- Tailwind 4
- Shadcn/ui 

Backend i baza danych 
- Supabase 

Komunikacja z modelami AI:
- Openrouter.ai

Testing:
- Vitest + RTL + MSW
- Playwright
- Lighthouse CI
- Axe + pa11y
- k6
- OpenTelemetry
- SonarCloud

CI/CD i Hosting:
- Github Actions
- CodeQL
- Dependabot
- DigitalOcean

## Project Structure

When introducing changes to the project, always follow the directory structure below:

- `./src` - source code
- `./src/layouts` - Astro layouts
- `./src/pages` - Astro pages
- `./src/pages/api` - API endpoints
- `./src/middleware/index.ts` - Astro middleware
- `./src/db` - Supabase clients and types
- `./src/types.ts` - Shared types for backend and frontend (Entities, DTOs)
- `./src/components` - Client-side components written in Astro (static) and React (dynamic)
- `./src/components/ui` - Client-side components from Shadcn/ui
- `./src/lib` - Services and helpers
- `./src/assets` - static internal assets
- `./public` - public assets

When modifying the directory structure, always update this section.

## TESTING

### Guidelines for UNIT

#### VITEST

- Leverage the `vi` object for test doubles - Use `vi.fn()` for function mocks, `vi.spyOn()` to monitor existing functions, and `vi.stubGlobal()` for global mocks. Prefer spies over mocks when you only need to verify interactions without changing behavior.
- Master `vi.mock()` factory patterns - Place mock factory functions at the top level of your test file, return typed mock implementations, and use `mockImplementation()` or `mockReturnValue()` for dynamic control during tests. Remember the factory runs before imports are processed.
- Create setup files for reusable configuration - Define global mocks, custom matchers, and environment setup in dedicated files referenced in your `vitest.config.ts`. This keeps your test files clean while ensuring consistent test environments.
- Use inline snapshots for readable assertions - Replace complex equality checks with `expect(value).toMatchInlineSnapshot()` to capture expected output directly in your test file, making changes more visible in code reviews.
- Monitor coverage with purpose and only when asked - Configure coverage thresholds in `vitest.config.ts` to ensure critical code paths are tested, but focus on meaningful tests rather than arbitrary coverage percentages.
- Make watch mode part of your workflow - Run `vitest --watch` during development for instant feedback as you modify code, filtering tests with `-t` to focus on specific areas under development.
- Explore UI mode for complex test suites - Use `vitest --ui` to visually navigate large test suites, inspect test results, and debug failures more efficiently during development.
- Handle optional dependencies with smart mocking - Use conditional mocking to test code with optional dependencies by implementing `vi.mock()` with the factory pattern for modules that might not be available in all environments.
- Configure jsdom for DOM testing - Set `environment: 'jsdom'` in your configuration for frontend component tests and combine with testing-library utilities for realistic user interaction simulation.
- Structure tests for maintainability - Group related tests with descriptive `describe` blocks, use explicit assertion messages, and follow the Arrange-Act-Assert pattern to make tests self-documenting.
- Leverage TypeScript type checking in tests - Enable strict typing in your tests to catch type errors early, use `expectTypeOf()` for type-level assertions, and ensure mocks preserve the original type signatures.


### Guidelines for E2E

#### PLAYWRIGHT

- Initialize configuration only with Chromium/Desktop Chrome browser
- Use browser contexts for isolating test environments
- Implement the Page Object Model for maintainable tests
- Use locators for resilient element selection
- Leverage API testing for backend validation
- Implement visual comparison with expect(page).toHaveScreenshot()
- Use the codegen tool for test recording
- Leverage trace viewer for debugging test failures
- Implement test hooks for setup and teardown
- Use expect assertions with specific matchers
- Leverage parallel execution for faster test runs


