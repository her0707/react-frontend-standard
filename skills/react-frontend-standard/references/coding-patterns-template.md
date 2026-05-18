# Coding Patterns Template

Use this template as the starting point for `docs/coding-patterns.md`.

## Purpose

This document defines the coding defaults used by this repository.

- `ARCHITECTURE.md` answers where code belongs.
- This document answers how code should usually be written inside that structure.

## Working Principles

1. Prefer clear code over clever code.
2. Prefer stable, predictable patterns over personal variation.
3. Prefer feature-local implementation before shared abstraction.
4. Add rules only when they solve repeated review problems.
5. Keep code easy for both humans and agents to read.

## Placement Defaults

- framework route files stay thin and delegate UI to screens
- route-facing top-level components go in `screens`
- feature-owned UI goes in `features/<feature>/components`
- shared generic UI goes in `components`
- feature-owned screen state and request state go in `features/<feature>/hooks`
- raw REST transport logic goes in `features/<feature>/*.api.ts`
- use-case orchestration goes in `features/<feature>/*.service.ts`

## Responsibility Table

| Layer | Responsibility | Put here | Avoid here |
|---|---|---|---|
| framework route files | routing shell | params, metadata, framework prefetch, providers, screen rendering | domain-heavy UI, storage details, large mapping |
| `screens` | route-facing composition | feature composition, page layout order, route-derived props | raw API calls, DTO shaping, large business logic |
| `features/<feature>/components` | feature-owned UI | forms, lists, detail panels, modals, domain sections | transport setup, generic shared primitive extraction |
| `features/<feature>/hooks` | screen-facing feature state | loading/error state, mutations, feature form state, derived values | JSX-heavy rendering, generic utilities |
| `features/<feature>/*.api.ts` | raw transport layer | endpoints, methods, params, headers, request and response calls | screen logic, JSX, business orchestration |
| `features/<feature>/*.service.ts` | use-case orchestration | response mapping, multi-call flow, reusable actions | route coupling, visual concerns |
| `features/<feature>/*.query.ts` | query/cache contract | query keys, query options, cache identity | rendering, raw component event logic |
| `features/<feature>/*.server.ts` | server-only feature access | server runtime calls, server-only secrets, server-side fetch wrappers | browser APIs, client-only state |
| `features/<feature>/*.client.ts` | client-side feature access | browser-safe fetch wrappers, client runtime calls | server-only secrets, framework route logic |
| `features/<feature>/*.store.ts` | feature-owned state boundary | feature persistence, subscriptions, browser-only side effects | JSX, route coupling, generic unrelated storage |
| `features/<feature>/*.adapter.ts` | boundary conversion | external-to-internal mapping, generated client adaptation | rendering, request orchestration |
| `features/<feature>/*.schema.ts` | validation and parsing | form validation, boundary validation, parsing | transport setup, rendering |
| `features/<feature>/*.type.ts` | feature contracts | DTO types, request types, view model types | execution logic |
| `components` | shared generic UI | Button, Modal, EmptyState, DataTable | feature ownership, backend-specific contracts |

## Optional Feature Files

Optional files should be added when they clarify a real boundary:

- add `*.query.ts` when cache identity, query keys, or query options are repeated or need tests
- add `*.server.ts` when server runtime behavior differs from browser behavior
- add `*.client.ts` when browser/client calls need a separate boundary
- add `*.store.ts` when a feature owns persistent state, subscriptions, or browser-only side effects
- add `*.adapter.ts` when external contracts need conversion before the feature uses them

Do not create every optional file by default.

## Browser-Only State And Side Effects

Browser-only APIs should be isolated behind feature-owned boundaries.

Use this rule:

- components render and handle user interaction
- hooks connect state to components
- stores or adapters hide browser-only persistence, subscriptions, and unavailable-runtime handling

The standard does not choose localStorage, IndexedDB, cookies, or any other backend. Pick storage in project-specific docs when the product requires it.

## Naming Defaults

- route-facing screens: `PascalCaseScreen.tsx`
- feature support files: `Feature.api.ts`, `Feature.service.ts`, `Feature.schema.ts`, `Feature.type.ts`, `Feature.util.ts`
- optional feature files: `Feature.query.ts`, `Feature.server.ts`, `Feature.client.ts`, `Feature.store.ts`, `Feature.adapter.ts`
- event handlers: `on...`
- booleans: `is...`, `has...`, `should...`, `can...`

## Screen Pattern

Screens should stay thin.

Example:

```tsx
const ReservationSearchScreen = () => {
  return <ReservationSearchForm />;
};

export default ReservationSearchScreen;
```

## REST Data Access Pattern

Use this chain by default:

1. framework route file or screen
2. feature component
3. feature hook
4. feature service
5. feature api

Keep raw transport details out of route files, screens, and feature components.

When the project uses server/client runtime separation or a query library, insert the optional feature files at the boundary they clarify:

- `*.query.ts` owns query keys and options
- `*.server.ts` owns server-only access
- `*.client.ts` owns client-side access
- `*.adapter.ts` owns external contract conversion

## Testing Defaults

- test pure feature mapping and utilities with unit tests near the feature files
- test query keys and option factories when cache identity affects behavior
- test API route handlers or transport boundaries where request validation and error mapping matter
- test browser-only stores with a controlled runtime or test double
- use end-to-end tests for user flows that cross routing, persistence, and network boundaries

## Extraction Rules

Split code when:

- a route file stops being a thin routing shell
- a screen stops being thin
- a component mixes transport logic and visual logic
- browser-only APIs leak into rendering code
- one feature file begins owning multiple unrelated responsibilities

Do not introduce `widgets` by default. Consider it only when a repeated, meaningful, cross-feature UI block appears and cannot be naturally owned by one feature.
