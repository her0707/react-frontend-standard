# Coding Patterns

## Purpose

This document defines the coding defaults used by this repository and intended to be portable across similar React projects.

- `ARCHITECTURE.md` answers where code belongs.
- This document answers how code should usually be written inside that structure.

## Working Principles

1. Prefer clear code over clever code.
2. Prefer stable, predictable patterns over personal variation.
3. Prefer feature-local implementation before shared abstraction.
4. Add rules only when they solve repeated review problems.
5. Keep the code easy for both humans and agents to read.

## Placement Defaults

- route-matching top-level components go in `screens`
- feature-owned UI goes in `features/<feature>/components`
- shared generic UI goes in `components`
- feature-owned screen state and request state go in `features/<feature>/hooks`
- raw REST transport logic goes in `features/<feature>/*.api.ts`
- use-case orchestration goes in `features/<feature>/*.service.ts`

## Responsibility Table

| Layer | Responsibility | Put here | Avoid here |
|---|---|---|---|
| `screens` | route entry and top-level composition | route params, feature composition, page layout order | raw API calls, DTO shaping, large business logic |
| `features/<feature>/components` | feature-owned UI | forms, lists, detail panels, modals, domain sections | transport setup, generic shared primitive extraction |
| `features/<feature>/hooks` | screen-facing feature state | loading/error state, mutations, feature form state, derived values | JSX-heavy rendering, generic utilities |
| `features/<feature>/*.api.ts` | raw transport layer | endpoints, methods, params, headers, request and response calls | screen logic, JSX, business orchestration |
| `features/<feature>/*.service.ts` | use-case orchestration | response mapping, multi-call flow, reusable actions | route coupling, visual concerns |
| `features/<feature>/*.schema.ts` | validation and parsing | form validation, boundary validation, parsing | transport setup, rendering |
| `features/<feature>/*.type.ts` | feature contracts | DTO types, request types, view model types | execution logic |
| `components` | shared generic UI | Button, Modal, EmptyState, DataTable | feature ownership, backend-specific contracts |

## Naming Defaults

- route entry screens: `PascalCaseScreen.tsx`
- feature support files: `Feature.api.ts`, `Feature.service.ts`, `Feature.schema.ts`, `Feature.type.ts`, `Feature.util.ts`
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

1. `screen`
2. `feature component`
3. `feature hook`
4. `feature service`
5. `feature api`

Keep raw transport details out of screens and feature components.

## Extraction Rules

Split code when:

- a screen stops being thin
- a component mixes transport logic and visual logic
- one feature file begins owning multiple unrelated responsibilities

Do not introduce `widgets` by default. Consider it only when a repeated, meaningful, cross-feature UI block appears and cannot be naturally owned by one feature.
