# Coding Patterns

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

## TypeScript And TSX Rules

These rules exist to prevent type holes, runtime surprises, and React rendering bugs.
Use project-specific docs for preferences that are only stylistic.

- use `.tsx` only for files that contain JSX; use `.ts` for non-JSX TypeScript
- do not add `any` in handwritten code
- use `unknown` for unknown external values, then narrow them in schema, guard, parser, or adapter code before use
- isolate generated code and temporary migration exceptions with a short comment
- do not use `@ts-ignore` or `@ts-nocheck`
- if a TypeScript suppression is unavoidable, use `@ts-expect-error` with a reason and keep it next to the smallest affected line
- avoid non-null assertions such as `value!`
- prefer guards, early returns, optional chaining, or nullish coalescing before using a non-null assertion
- use `const` unless reassignment is required; do not use `var`
- use `import type` for imports used only as types
- use `??` when a fallback should apply only to `null` or `undefined`; use `||` only when every falsy value should fall back
- exported async functions and boundary functions in api, service, query, server, client, store, and adapter files should declare return types
- local implementation details may rely on inference when the inferred type is clear
- prefer discriminated unions for multi-state async or workflow state
- do not model mutually exclusive states as several booleans that can contradict each other
- render list items with stable keys from data; do not generate keys during render

## Function And Component Defaults

These are defaults, not reasons to rewrite unrelated existing code.

- prefer function declarations for exported functions, hooks, services, utilities, and React components when either style works
- use arrow functions for callbacks, event handlers, array methods, closures, typed function expressions, wrappers, and concise local logic
- do not use anonymous default exports
- name a component or function first, then export it
- component prop types should use `<ComponentName>Props` when the component has named props
- React components and hooks must not mutate props, state, context, or module-level values during render
- use effects to synchronize with external systems
- do not use effects for values that can be calculated during render or for event-specific work

## Placement Defaults

- framework route files stay thin and delegate UI to screens
- route-facing top-level components go in `screens`
- router-config projects such as React Router usually route directly to screens
- create `pages` only when they are thin routing shells, not parallel page-composition files
- feature-owned UI goes in `features/<feature>/components`
- shared generic UI goes in `components`
- feature-owned screen state and request state go in `features/<feature>/hooks`
- raw REST transport logic goes in `features/<feature>/<Feature>.api.ts`
- use-case orchestration goes in `features/<feature>/<Feature>.service.ts`

## Required Feature File Naming

Feature-root support files must include the feature name before the role suffix.

Use this pattern:

- `Reservation.api.ts`, not `api.ts`
- `Reservation.service.ts`, not `service.ts`
- `Reservation.schema.ts`, not `schema.ts`
- `Reservation.type.ts`, not `type.ts` or `types.ts`

This applies to every feature-root role file when it exists:

- `Feature.api.ts`
- `Feature.service.ts`
- `Feature.schema.ts`
- `Feature.type.ts`
- `Feature.util.ts`
- `Feature.query.ts`
- `Feature.server.ts`
- `Feature.client.ts`
- `Feature.action.ts`
- `Feature.store.ts`
- `Feature.adapter.ts`
- `Feature.fragment.ts`

Do not create role-only filenames in `features/<feature>/`, such as `api.ts`, `service.ts`, `schema.ts`, `type.ts`, `types.ts`, `util.ts`, `utils.ts`, `query.ts`, `server.ts`, `client.ts`, `action.ts`, `actions.ts`, `store.ts`, or `adapter.ts`.

Use the feature-name prefix even when the folder already names the feature. This keeps imports, editor tabs, search results, and agent refactors unambiguous.

## Responsibility Table

| Layer | Responsibility | Put here | Avoid here |
|---|---|---|---|
| framework route files | routing shell | params, metadata, framework prefetch, providers, screen rendering | page composition, domain-heavy UI, storage details, large mapping |
| `screens` | route-facing composition | feature composition, page layout order, route-derived props | raw API calls, DTO shaping, large business logic |
| `features/<feature>/components` | feature-owned UI | forms, lists, detail panels, modals, domain sections | transport setup, generic shared primitive extraction |
| `features/<feature>/hooks` | screen-facing feature state | loading/error state, mutations, feature form state, derived values | JSX-heavy rendering, generic utilities |
| `features/<feature>/<Feature>.api.ts` | raw transport layer | endpoints, methods, params, headers, request and response calls | screen logic, JSX, business orchestration |
| `features/<feature>/<Feature>.service.ts` | use-case orchestration | response mapping, multi-call flow, reusable actions | route coupling, visual concerns |
| `features/<feature>/<Feature>.query.ts` | query/cache contract | query keys, query options, cache identity | rendering, raw component event logic |
| `features/<feature>/<Feature>.server.ts` | server-only feature access | server runtime calls, server-only secrets, server-side fetch wrappers | browser APIs, client-only state |
| `features/<feature>/<Feature>.client.ts` | client-side feature access | browser-safe fetch wrappers, client runtime calls | server-only secrets, framework route logic |
| `features/<feature>/<Feature>.action.ts` | framework mutation boundary | server actions, input validation, invalidation, refresh behavior | rendering, broad use-case orchestration |
| `features/<feature>/<Feature>.store.ts` | feature-owned state boundary | feature persistence, subscriptions, browser-only side effects | JSX, route coupling, generic unrelated storage |
| `features/<feature>/<Feature>.adapter.ts` | boundary conversion | external-to-internal mapping, generated client adaptation | rendering, request orchestration |
| `features/<feature>/<Feature>.schema.ts` | validation and parsing | form validation, boundary validation, parsing | transport setup, rendering |
| `features/<feature>/<Feature>.type.ts` | feature contracts | DTO types, request types, view model types | execution logic |
| `components` | shared generic UI | Button, Modal, EmptyState, DataTable | feature ownership, backend-specific contracts |

## Optional Feature Files

Optional files should be added when they clarify a real boundary:

- add `<Feature>.query.ts` when cache identity, query keys, or query options are repeated or need tests
- add `<Feature>.server.ts` when server runtime behavior differs from browser behavior
- add `<Feature>.client.ts` when browser/client calls need a separate boundary
- add `<Feature>.action.ts` when server actions or framework mutations need validation, invalidation, or runtime directives
- add `<Feature>.store.ts` when a feature owns persistent state, subscriptions, or browser-only side effects
- add `<Feature>.adapter.ts` when external contracts need conversion before the feature uses them

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
- optional feature files: `Feature.query.ts`, `Feature.server.ts`, `Feature.client.ts`, `Feature.action.ts`, `Feature.store.ts`, `Feature.adapter.ts`
- event handlers: `on...`
- booleans: `is...`, `has...`, `should...`, `can...`

## Export Defaults

Prefer named exports for reusable modules:

- feature components in `features/<feature>/components`
- shared generic components in `components`
- hooks, services, utilities, schemas, actions, stores, adapters, and query helpers

Use default exports only for files that are naturally a single route-facing entry:

- framework-required route files such as page files, route modules, layouts, loaders, or route config entries
- route modules when the framework expects a default export
- screen files in `screens`

Do not create default-export page files solely to wrap a screen in a router-config project that can render the screen directly.

Keep exported names aligned with file and component names. Do not use default exports to import the same component under different names across the codebase.

Example reusable component:

```tsx
export const ReservationSearchForm = () => {
  return <form>{/* ... */}</form>;
};
```

## Screen Pattern

Screens should stay thin. They may use default exports because each screen is a single route-facing entry.

In React Router-style route config, prefer `element: <ReservationSearchScreen />` over adding a `pages/ReservationSearchPage.tsx` wrapper. Add a page wrapper only when it has real route-shell work.

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

- `<Feature>.query.ts` owns query keys and options
- `<Feature>.server.ts` owns server-only access
- `<Feature>.client.ts` owns client-side access
- `<Feature>.action.ts` owns framework mutations when actions need a named feature boundary
- `<Feature>.adapter.ts` owns external contract conversion

## RSC And Suspense Pattern

In Next.js App Router or other RSC projects, do not turn route files into page-wide data loaders by default. Feature-owned async server components may fetch the data they render through feature-owned query or server helpers.

Use this pattern when the project streams server-rendered regions:

- feature component files export both `Name` and `NameSkeleton` when the skeleton belongs only to that component
- route-facing screens or framework route shells place `<Suspense>` around user-meaningful regions
- static chrome, layout, and headings stay outside Suspense boundaries when possible
- client components with `"use client"` stay as small and deep in the tree as the interaction allows

## Testing Defaults

- test pure feature mapping and utilities with unit tests near the feature files
- test query keys and option factories when cache identity affects behavior
- test API route handlers or transport boundaries where request validation and error mapping matter
- test browser-only stores with a controlled runtime or test double
- use end-to-end tests for user flows that cross routing, persistence, and network boundaries

## Existing File Change Rules

Use these rules for feature improvements, bug fixes, and refactors in existing code.

- read the current owner, layer, and local pattern before editing
- keep behavior changes, mechanical formatting, and broad refactors separate when practical
- change the smallest owned surface that safely solves the task
- avoid opportunistic moves, renames, rewrites, or formatting churn outside the touched behavior
- do not rewrite arrow functions to declarations, declarations to arrows, or export style solely to match defaults when the change is unrelated
- preserve exported names, route paths, query keys, storage keys, component props, and public import paths unless the contract change is intentional
- search usages before changing a public contract
- when a feature improvement exposes a boundary leak, fix the smallest related boundary instead of carrying the leak forward
- move raw transport logic out of screens and components when the touched code already depends on that transport behavior
- move browser-only persistence or subscriptions behind a feature store or adapter when the touched rendering code directly owns them
- do not create a shared abstraction from a single use unless it clarifies an existing boundary
- promote shared code only after repeated use or clear cross-feature ownership
- update tests at the layer that owns the changed behavior
- add a regression test for bug fixes when the behavior can be tested locally
- for refactors, keep verification focused on proving behavior stayed the same
- document intentional architectural exceptions in local project docs when they become part of the project contract

## Extraction Rules

Split code when:

- a route file stops being a thin routing shell
- a screen stops being thin
- a component mixes transport logic and visual logic
- browser-only APIs leak into rendering code
- a route file fetches unrelated feature data just to pass it down through props
- one feature file begins owning multiple unrelated responsibilities

Do not introduce `widgets` by default. Consider it only when a repeated, meaningful, cross-feature UI block appears and cannot be naturally owned by one feature.
