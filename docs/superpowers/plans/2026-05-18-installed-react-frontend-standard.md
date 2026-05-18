# Installed React Frontend Standard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the CLI-installed project docs and local skill sufficient to apply the React frontend standard without relying on repository-only examples.

**Architecture:** Keep generated project documents concise and contractual, while putting detailed operational guidance in the installable skill references. Preserve existing CLI destination paths and avoid changing unrelated package metadata or examples.

**Tech Stack:** Markdown documentation, Node.js ESM CLI verification, local Codex skill files.

---

## Scope Check

The approved spec is one documentation and skill-packaging project. It touches one contract surface: installed guidance for downstream React repositories. It does not require changing CLI copy logic, package publishing metadata, or repository-only examples.

## File Structure

Modify these files:

- `templates/AGENTS.md`: short downstream entry map and drift warning.
- `templates/ARCHITECTURE.md`: concise architecture contract with routing framework boundaries and optional feature file roles.
- `templates/coding-patterns.md`: concise implementation defaults with optional feature file responsibilities, browser-only side-effect boundaries, and testing placement.
- `skills/react-frontend-standard/SKILL.md`: operational workflow for applying the standard after installation.
- `skills/react-frontend-standard/references/agents-snippet.md`: snippet equivalent of the downstream `AGENTS.md` guidance.
- `skills/react-frontend-standard/references/architecture-template.md`: detailed architecture reference aligned with the generated architecture document.
- `skills/react-frontend-standard/references/coding-patterns-template.md`: detailed coding-pattern reference aligned with the generated coding-pattern document.
- `skills/react-frontend-standard/references/adoption-checklist.md`: step-by-step checklist for new and existing repositories.

Create these files:

- `skills/react-frontend-standard/references/routing-framework-notes.md`: framework-neutral routing shell guidance.
- `skills/react-frontend-standard/references/data-boundary-notes.md`: API, service, query, server, client, adapter, and browser-only side-effect boundaries.
- `skills/react-frontend-standard/references/testing-notes.md`: test placement and verification guidance by layer.
- `skills/react-frontend-standard/references/document-sync-checklist.md`: checks for keeping copied docs aligned with real code.

Do not modify these files in this plan:

- `README.md`
- `package.json`
- `bin/react-frontend-standard.js`
- `examples/*`

Those files already have unrelated local changes or are not required for the installed guidance contract.

---

### Task 1: Downstream Entry Map

**Files:**
- Modify: `templates/AGENTS.md`
- Modify: `skills/react-frontend-standard/references/agents-snippet.md`

- [ ] **Step 1: Run the pre-change check**

Run:

```bash
rg -n "verify|drift|actual files|current files" templates/AGENTS.md skills/react-frontend-standard/references/agents-snippet.md
```

Expected: exit code `1` because the current files do not mention verifying the map against actual files.

- [ ] **Step 2: Replace `templates/AGENTS.md`**

Use `apply_patch` to replace the file content with:

```md
# AGENTS.md

## Shared React Frontend Standard

This repository uses local project documents together with the optional local skill `react-frontend-standard`.

## Read First

1. `ARCHITECTURE.md`: structure, ownership, routing boundaries, and layer rules
2. `docs/coding-patterns.md`: coding defaults, file responsibilities, and verification expectations
3. project-specific requirement docs, product specs, or README files when present

## How To Use The Standard

- Use local project documents for normal feature work.
- Use `react-frontend-standard` when bootstrapping a React repository, aligning an existing structure, reviewing code placement, or refreshing standard documents.
- If the reusable standard and local project docs conflict, local project docs win.
- Before relying on this map, verify that referenced files, commands, route entries, provider files, and feature folders still exist.

## Maintenance Rule

Keep this file short. Put structural rules in `ARCHITECTURE.md`, coding rules in `docs/coding-patterns.md`, and detailed reusable guidance in the installed `react-frontend-standard` skill references.
```

- [ ] **Step 3: Replace `skills/react-frontend-standard/references/agents-snippet.md`**

Use `apply_patch` to replace the file content with:

````md
# AGENTS.md Snippet

```md
## Shared React Frontend Standard

This repository uses local project documents together with the optional local skill `react-frontend-standard`.

## Read First

1. `ARCHITECTURE.md`: structure, ownership, routing boundaries, and layer rules
2. `docs/coding-patterns.md`: coding defaults, file responsibilities, and verification expectations
3. project-specific requirement docs, product specs, or README files when present

## How To Use The Standard

- Use local project documents for normal feature work.
- Use `react-frontend-standard` when bootstrapping a React repository, aligning an existing structure, reviewing code placement, or refreshing standard documents.
- If the reusable standard and local project docs conflict, local project docs win.
- Before relying on this map, verify that referenced files, commands, route entries, provider files, and feature folders still exist.

## Maintenance Rule

Keep this file short. Put structural rules in `ARCHITECTURE.md`, coding rules in `docs/coding-patterns.md`, and detailed reusable guidance in the installed `react-frontend-standard` skill references.
```
````

- [ ] **Step 4: Run the post-change checks**

Run:

```bash
rg -n "verify that referenced files|local project docs win|Keep this file short" templates/AGENTS.md skills/react-frontend-standard/references/agents-snippet.md
```

Expected: both files contain the new guidance.

Run:

```bash
git diff --check -- templates/AGENTS.md skills/react-frontend-standard/references/agents-snippet.md
```

Expected: no output.

- [ ] **Step 5: Commit**

Run:

```bash
git add templates/AGENTS.md skills/react-frontend-standard/references/agents-snippet.md
git commit -m "docs: clarify downstream standard entry map"
```

Expected: commit succeeds.

---

### Task 2: Architecture Contract

**Files:**
- Modify: `templates/ARCHITECTURE.md`
- Modify: `skills/react-frontend-standard/references/architecture-template.md`

- [ ] **Step 1: Run the pre-change check**

Run:

```bash
rg -n "routing shell|route modules|query.ts|server.ts|client.ts|store.ts|adapter.ts" templates/ARCHITECTURE.md skills/react-frontend-standard/references/architecture-template.md
```

Expected: exit code `1` or partial output only; the current files do not fully define routing shells and optional feature files.

- [ ] **Step 2: Replace `templates/ARCHITECTURE.md`**

Use `apply_patch` to replace the file content with:

```md
# ARCHITECTURE.md

## Purpose

This document defines the frontend architecture rules used by this repository.

- It explains where code belongs.
- It defines ownership and layer boundaries.
- It keeps routing frameworks as implementation details.
- It does not define detailed coding style.

Detailed implementation defaults live in `docs/coding-patterns.md`.

## Document Roles

- `AGENTS.md`: short entry map for agents and maintainers
- `ARCHITECTURE.md`: source of truth for structure, ownership, and boundaries
- `docs/coding-patterns.md`: source of truth for coding defaults and responsibility rules

Keep `AGENTS.md` short. Keep structural rules here. Keep coding rules separate.

## Architecture Goals

This repository uses a feature-centered React frontend architecture with these goals:

1. Keep most changes inside one feature folder.
2. Keep route entry components thin.
3. Match feature ownership to backend domains or stable frontend use cases.
4. Prefer domain-local code before promoting logic to shared layers.
5. Keep the structure simple enough to reuse across React routing and data libraries.

## Core Principle

The stable center of the architecture is `features`, not the routing framework.

That means:

- `features` own business domains and frontend use cases
- `screens` own route-facing UI composition
- `components` own shared generic UI
- framework route files remain routing shells

## Top-Level Structure

The baseline structure is:

```text
src/
|-- screens/
|-- features/
|-- components/
|-- hooks/
|-- lib/
|-- services/
|-- utils/
`-- types/
```

Optional top-level directories may exist when the project needs them, for example:

- `app/`, `pages/`, `routes/`, or framework route modules
- `layouts/`
- `styles/`
- `constants/`
- `tests/` or `e2e/`
- `__generated__/`

## Routing Framework Boundary

Framework route directories such as `src/app`, `src/pages`, or route modules are routing shells.

Route files may:

- read route params and search params
- prepare route metadata
- connect framework providers or layouts
- perform framework-level prefetching when the framework requires it
- render a screen component

Route files should avoid:

- domain-heavy UI
- raw transport setup in JSX
- large DTO mapping
- browser-only persistence details
- business workflows that belong to a feature

## Directory Responsibilities

### `src/screens`

Own route-facing top-level screen components.

Rules:

- each screen should correspond to a route or route-like page entry
- screens should stay thin
- screens compose feature components and feature hooks
- screens may receive route-derived props from framework route files
- screens should not become a second feature layer

### `src/features`

Own business domains or clear frontend use cases.

Features are usually derived from one of these:

- backend API domain
- backend resource ownership
- stable user use case

### `src/components`

Own shared generic UI primitives reused across unrelated features.

### `src/hooks`

Own truly shared hooks reused across multiple features.

### `src/lib`

Own runtime integrations and framework setup.

### `src/services`

Own cross-feature services only when they do not cleanly belong to a single feature.

### `src/utils`, `src/types`

Own shared support code and shared types.

## Feature Structure

A feature folder should usually follow this model:

```text
features/<feature>/
|-- components/
|-- hooks/
|-- <Feature>.api.ts
|-- <Feature>.service.ts
|-- <Feature>.schema.ts
|-- <Feature>.type.ts
`-- <Feature>.util.ts
```

Optional additions by project needs:

- `<Feature>.query.ts`: query keys, cache identity, and query option factories
- `<Feature>.server.ts`: server-only feature access
- `<Feature>.client.ts`: browser/client feature access
- `<Feature>.store.ts`: feature-owned state or browser-only side-effect boundary
- `<Feature>.adapter.ts`: conversion between external contracts and internal shapes
- `<Feature>.fragment.ts`: GraphQL fragments or query fragments when used

Optional files should appear when they clarify responsibilities, not because every feature must use every suffix.

## Ownership Model

### Put code in framework route files when

- it is required by the routing framework
- it reads route params or search params
- it connects route-level metadata, layouts, or providers
- it delegates UI to a screen

### Put code in `screens` when

- it is route-facing UI composition
- it mainly composes feature components
- it receives route-derived props
- it places sections in page order

### Put code in `features/<feature>/components` when

- it is domain-specific UI
- one feature clearly owns it
- it uses that feature's hooks, services, or data contracts

### Put code in `components` when

- it has no domain meaning
- it is reusable across unrelated features
- it can be understood without backend-specific contracts

## What About Widgets

`widgets` is not part of the default structure.

Only consider a separate `widgets` layer when all of the following are true:

- the UI block combines multiple features
- the block is meaningful as one reusable unit
- the same block repeats across multiple screens
- ownership is genuinely hard to assign to one feature

## Layer Model

Use this dependency direction as the default rule:

1. framework route files
2. `screens`
3. `features/*/components`
4. `features/*/hooks`
5. `features/*/(api|service|schema|type|util|query|server|client|store|adapter|optional files)`
6. shared `components`, `hooks`, `lib`, `services`, `utils`, `types`
7. optional generated artifacts

## REST and Data Access

For REST-oriented projects:

- keep raw HTTP calls in `*.api.ts`
- keep use-case orchestration in `*.service.ts`
- keep cache/query identity in `*.query.ts` when using a query library
- keep server-only access in `*.server.ts` when the framework has server execution
- keep client-side access in `*.client.ts` when browser calls differ from server calls
- keep screen-facing state connection in feature hooks
- do not place transport details inside route files, screens, or feature components

Projects using GraphQL, generated clients, server actions, loaders, or other data systems should keep the same ownership principle while adapting the concrete files.

## Browser-Only Boundary

Browser-only APIs such as `window`, local storage APIs, observers, or direct DOM integrations should not leak into route files, screens, or general feature UI.

When a feature owns browser-only persistence or subscriptions, isolate that behavior behind a feature-local boundary such as `*.store.ts` or `*.adapter.ts`. The standard does not choose a storage backend.

## Decision Checklist

Before adding or moving code, answer:

- is this required by the routing framework
- is this route-facing composition, feature-owned behavior, or a shared primitive
- which feature owns the business meaning
- does this code call transport, browser-only APIs, or external systems directly
- should this code live in `api`, `service`, `hook`, `query`, `server`, `client`, `store`, `adapter`, or `component`
- is a new layer actually needed, or does it only add indirection
```

- [ ] **Step 3: Replace `skills/react-frontend-standard/references/architecture-template.md`**

Use `apply_patch` to replace the reference with the architecture contract shown in Step 2. The final file must start with this exact heading and introductory sentence, then continue with the `## Purpose` section through the `## Decision Checklist` section exactly as shown in Step 2:

```md
# Architecture Template
```

Also add this sentence after the heading:

```md
Use this template as the starting point for a React frontend repository's `ARCHITECTURE.md`.
```

- [ ] **Step 4: Run the post-change checks**

Run:

```bash
rg -n "Routing Framework Boundary|Browser-Only Boundary|query.ts|server.ts|client.ts|store.ts|adapter.ts" templates/ARCHITECTURE.md skills/react-frontend-standard/references/architecture-template.md
```

Expected: both files contain the new sections and optional file names.

Run:

```bash
git diff --check -- templates/ARCHITECTURE.md skills/react-frontend-standard/references/architecture-template.md
```

Expected: no output.

- [ ] **Step 5: Commit**

Run:

```bash
git add templates/ARCHITECTURE.md skills/react-frontend-standard/references/architecture-template.md
git commit -m "docs: expand installed architecture contract"
```

Expected: commit succeeds.

---

### Task 3: Coding Patterns Contract

**Files:**
- Modify: `templates/coding-patterns.md`
- Modify: `skills/react-frontend-standard/references/coding-patterns-template.md`

- [ ] **Step 1: Run the pre-change check**

Run:

```bash
rg -n "Optional Feature Files|Browser-Only|Testing Defaults|server/client" templates/coding-patterns.md skills/react-frontend-standard/references/coding-patterns-template.md
```

Expected: exit code `1` because these sections are not fully present.

- [ ] **Step 2: Replace `templates/coding-patterns.md`**

Use `apply_patch` to replace the file content with:

```md
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
```

- [ ] **Step 3: Replace `skills/react-frontend-standard/references/coding-patterns-template.md`**

Use `apply_patch` to replace the reference with the coding-pattern contract shown in Step 2. The final file must start with this exact heading and introductory sentence, then continue with the `## Purpose` section through the extraction rule section exactly as shown in Step 2:

```md
# Coding Patterns Template
```

Also add this sentence after the heading:

```md
Use this template as the starting point for `docs/coding-patterns.md`.
```

- [ ] **Step 4: Run the post-change checks**

Run:

```bash
rg -n "Optional Feature Files|Browser-Only State And Side Effects|Testing Defaults|Feature.query.ts|Feature.store.ts" templates/coding-patterns.md skills/react-frontend-standard/references/coding-patterns-template.md
```

Expected: both files contain the new sections and optional file names.

Run:

```bash
git diff --check -- templates/coding-patterns.md skills/react-frontend-standard/references/coding-patterns-template.md
```

Expected: no output.

- [ ] **Step 5: Commit**

Run:

```bash
git add templates/coding-patterns.md skills/react-frontend-standard/references/coding-patterns-template.md
git commit -m "docs: expand installed coding patterns"
```

Expected: commit succeeds.

---

### Task 4: Detailed Skill References

**Files:**
- Create: `skills/react-frontend-standard/references/routing-framework-notes.md`
- Create: `skills/react-frontend-standard/references/data-boundary-notes.md`
- Create: `skills/react-frontend-standard/references/testing-notes.md`
- Create: `skills/react-frontend-standard/references/document-sync-checklist.md`
- Modify: `skills/react-frontend-standard/references/adoption-checklist.md`

- [ ] **Step 1: Run the pre-change check**

Run:

```bash
test ! -e skills/react-frontend-standard/references/routing-framework-notes.md
test ! -e skills/react-frontend-standard/references/data-boundary-notes.md
test ! -e skills/react-frontend-standard/references/testing-notes.md
test ! -e skills/react-frontend-standard/references/document-sync-checklist.md
```

Expected: all commands succeed because the files do not exist yet.

- [ ] **Step 2: Add `routing-framework-notes.md`**

Use `apply_patch` to create:

```md
# Routing Framework Notes

Use these notes when applying the standard to a project with framework-owned routing.

## Core Rule

The routing framework is not the architecture center. Route files are shells that connect framework requirements to screen components.

## Route Files May Own

- route params and search params
- metadata functions
- framework loaders, actions, or prefetch hooks
- layout and provider connection required by the framework
- rendering the route-facing screen

## Route Files Should Avoid

- domain-heavy JSX
- raw HTTP setup in component bodies
- DTO normalization
- browser-only persistence details
- feature workflows that can be named and tested inside `features/<feature>`

## Common Mappings

| Framework shape | Treat as | Preferred delegation |
|---|---|---|
| `src/app/**/page.tsx` | routing shell | render a `src/screens/*Screen.tsx` component |
| `src/pages/*.tsx` | routing shell | render a `src/screens/*Screen.tsx` component |
| route module with loader/action | routing shell and framework boundary | keep feature logic in feature services or adapters |
| nested layout route | routing shell or layout integration | keep reusable layout components outside domain features unless one feature owns them |

## Decision Check

Ask these questions before adding logic to a route file:

- Does the framework require this code to live here?
- Can this be named as a feature use case?
- Would this logic be useful without knowing the route path?
- Can this be unit tested more easily in a feature file?

If the answer points away from the framework, move the logic into a screen, feature hook, service, adapter, or utility.
```

- [ ] **Step 3: Add `data-boundary-notes.md`**

Use `apply_patch` to create:

```md
# Data Boundary Notes

Use these notes when a project needs guidance beyond the baseline `api -> service -> hook -> component -> screen` chain.

## Baseline REST Chain

1. route file or screen
2. feature component
3. feature hook
4. feature service
5. feature API

Keep raw transport details out of route files, screens, and feature components.

## Optional Boundaries

| File | Use when | Owns | Avoids |
|---|---|---|---|
| `Feature.query.ts` | cache identity or query options matter | query keys, option factories, normalized query params | JSX and button event logic |
| `Feature.server.ts` | server runtime access differs from browser access | server-only calls, secrets, server fetch wrappers | browser APIs |
| `Feature.client.ts` | browser-safe calls need a boundary | client fetch wrappers, client runtime behavior | server-only secrets |
| `Feature.store.ts` | feature-owned persistence or subscriptions exist | state boundary, storage adapter calls, subscriptions | rendering and route coupling |
| `Feature.adapter.ts` | external data shape differs from internal shape | mapping, generated client adaptation, DTO conversion | orchestration and visual concerns |

## Browser-Only State And Side Effects

Treat browser-only behavior as a boundary concern, not as a prescribed technology.

The standard does not choose localStorage, IndexedDB, cookies, memory storage, or a query library. Project-specific requirements choose those details.

Do this:

- hide browser-only APIs behind a feature-local store or adapter
- account for server rendering and tests where browser APIs may be unavailable
- keep parsing, fallback values, unavailable-runtime errors, and subscription fanout outside rendering code
- expose small functions or hooks that components can use without knowing the storage backend

Avoid this:

- reading or writing browser storage directly inside route files
- mixing persistence code into presentational components
- letting external DTO shapes spread through the feature UI
- forcing optional files into features that do not need them

## Data Library Neutrality

React Query, SWR, Apollo, generated REST clients, GraphQL clients, server actions, and route loaders are implementation details. Keep the ownership model stable even when the library changes.
```

- [ ] **Step 4: Add `testing-notes.md`**

Use `apply_patch` to create:

```md
# Testing Notes

Use these notes to decide where tests belong when applying the standard.

## Test Placement

| Subject | Preferred test location | What to verify |
|---|---|---|
| feature utilities | next to the feature file | parsing, formatting, normalization, edge cases |
| feature services | next to the feature file | mapping, orchestration, multi-call behavior |
| query helpers | next to the feature file | query keys, normalized params, option behavior |
| API routes or transport boundaries | next to the route or boundary file | validation, error status, response shape |
| browser-only stores | next to the store file | unavailable runtime, persistence, subscription behavior |
| shared utilities | next to the utility file | pure behavior and boundary cases |
| end-to-end flows | `e2e/` or project test directory | user-visible flows across routing, network, and persistence |

## Testing Principles

- Test logic at the layer that owns it.
- Prefer unit tests for pure mapping and boundary code.
- Use integration or route tests when request validation and response mapping matter together.
- Use end-to-end tests for behavior that only becomes meaningful across screens, browser state, and navigation.
- Keep tests independent from storage and network backends by using controlled test doubles where practical.

## Verification Checklist

Before claiming a structural alignment is done, run the repository's available checks. Common commands include:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Use the commands that actually exist in the target project's `package.json`.
```

- [ ] **Step 5: Add `document-sync-checklist.md`**

Use `apply_patch` to create:

```md
# Document Sync Checklist

Use this checklist before trusting, refreshing, or regenerating project docs.

## File Existence

- Every path mentioned in `AGENTS.md` exists or is intentionally described as optional.
- `ARCHITECTURE.md` and `docs/coding-patterns.md` exist when the standard has been installed.
- Provider, route, screen, feature, and shared component paths named in docs match actual files.

## Command Accuracy

- Commands listed in docs exist in `package.json`.
- Package manager examples match the target project.
- Verification commands are project-specific and runnable.

## Structure Accuracy

- Route entry descriptions match the actual routing framework.
- Screen files listed in docs are still route-facing composition files.
- Feature names in docs match `src/features`.
- Shared component paths in docs do not describe feature-owned UI as generic primitives.

## Standard Contract

- Generated docs still point to `AGENTS.md`, `ARCHITECTURE.md`, and `docs/coding-patterns.md`.
- Project skill install still points to `.agents/skills/react-frontend-standard`.
- Local docs remain the source of truth when they conflict with reusable references.
- Repository-only examples are not required to apply the standard after installation.

## Update Rule

When docs and code disagree, update the smallest affected local document. Do not keep outdated examples or copied text as authoritative.
```

- [ ] **Step 6: Replace `adoption-checklist.md`**

Use `apply_patch` to replace the file content with:

```md
# Adoption Checklist

Use this checklist when installing or applying the React frontend standard.

## New Repository

1. Confirm the project is React-based.
2. Create `AGENTS.md`, `ARCHITECTURE.md`, and `docs/coding-patterns.md`.
3. Identify the routing framework and mark route files as routing shells.
4. Decide the initial feature map from backend domains or stable frontend use cases.
5. Add thin route-facing screens.
6. Add feature-local `api/service/hook` layers where the project uses explicit transport code.
7. Add optional feature files only when they clarify a real boundary.
8. Record project-specific commands and exceptions in local docs.

## Existing Repository

1. Inspect route entrypoints and identify framework-owned routing shells.
2. Inspect current screens or page-level components.
3. Inspect domain folders and identify likely feature boundaries.
4. Move raw HTTP logic out of route files, screens, and feature components when possible.
5. Isolate browser-only side effects behind feature-owned stores or adapters when such side effects exist.
6. Add or clarify optional feature files where current code mixes responsibilities.
7. Verify tests exist at the layer that owns the behavior.
8. Refresh project docs after checking actual files and commands.

## Applying To Another Project

1. Read local docs first.
2. Verify local docs against actual files before relying on them.
3. Map route files, screens, features, and shared primitives.
4. Keep features as the ownership center.
5. Keep generated docs concise and put detailed reusable guidance in the installed skill references.
6. Avoid adding `widgets` unless repeated cross-feature blocks justify it.
```

- [ ] **Step 7: Run post-change checks**

Run:

```bash
rg -n "Routing Framework Notes|Data Boundary Notes|Testing Notes|Document Sync Checklist" skills/react-frontend-standard/references
```

Expected: each new reference heading appears.

Run:

```bash
rg -n "Repository-only examples are not required|browser-only side effects|optional feature files" skills/react-frontend-standard/references/adoption-checklist.md skills/react-frontend-standard/references/document-sync-checklist.md
```

Expected: adoption and document-sync guidance appears.

Run:

```bash
git diff --check -- skills/react-frontend-standard/references
```

Expected: no output.

- [ ] **Step 8: Commit**

Run:

```bash
git add skills/react-frontend-standard/references
git commit -m "docs: add installed standard reference notes"
```

Expected: commit succeeds.

---

### Task 5: Skill Workflow

**Files:**
- Modify: `skills/react-frontend-standard/SKILL.md`

- [ ] **Step 1: Run the pre-change check**

Run:

```bash
rg -n "document-sync-checklist|routing-framework-notes|data-boundary-notes|testing-notes|repository-only" skills/react-frontend-standard/SKILL.md
```

Expected: exit code `1` because the current skill does not reference the new operational notes.

- [ ] **Step 2: Replace `skills/react-frontend-standard/SKILL.md`**

Use `apply_patch` to replace the file content with:

```md
---
name: react-frontend-standard
description: Shared architecture and coding standard for React frontend repositories centered on thin route-facing screens, feature ownership, and shared UI primitives. Use when Codex needs to scaffold a new React frontend project, align an existing repository to a consistent structure, generate or refresh AGENTS.md / ARCHITECTURE.md / coding patterns documents, or review whether code is placed in the right layer. Treat routing frameworks and data access technology such as React Router, Next.js, Remix, TanStack Router, REST, GraphQL, React Query, Apollo, SWR, server actions, route loaders, and generated clients as implementation details rather than the architectural center.
---

# React Frontend Standard

Use this skill to apply the same React frontend structure and coding rules across repositories without rewriting the guidance from scratch each time.

## Core Contract

- `features` are the ownership center.
- framework route files are routing shells.
- `screens` are route-facing UI composition.
- shared `components` are generic and domain-free.
- optional feature files appear only when they clarify a real boundary.
- local project docs win over reusable references when they conflict.

Repository-only `examples/` can help maintain this package, but downstream projects must be able to apply the standard from installed docs and installed skill references alone.

## Workflow

1. Inspect the current repository shape with file search.
2. Read local docs if present: `AGENTS.md`, `ARCHITECTURE.md`, `docs/coding-patterns.md`, README, and product specs.
3. Verify local docs against actual files, commands, route entries, providers, and feature folders.
4. Identify routing framework boundaries using `references/routing-framework-notes.md`.
5. Map feature ownership from backend domains or stable frontend use cases.
6. Check data-access and side-effect boundaries using `references/data-boundary-notes.md`.
7. Check test placement and verification commands using `references/testing-notes.md`.
8. Generate or refresh local project documents so the repository contains its own source of truth.
9. Keep generated docs concise and put detailed reusable reasoning in installed skill references.

## Default Structure

```text
src/
|-- screens/
|-- features/
|-- components/
|-- hooks/
|-- lib/
|-- services/
|-- utils/
`-- types/
```

Framework route directories such as `src/app`, `src/pages`, route modules, or router config files may exist alongside this structure. Treat them as routing shells.

## Feature Structure

```text
features/<feature>/
|-- components/
|-- hooks/
|-- <Feature>.api.ts
|-- <Feature>.service.ts
|-- <Feature>.schema.ts
|-- <Feature>.type.ts
`-- <Feature>.util.ts
```

Optional additions by project needs:

- `<Feature>.query.ts`
- `<Feature>.server.ts`
- `<Feature>.client.ts`
- `<Feature>.store.ts`
- `<Feature>.adapter.ts`
- `<Feature>.fragment.ts`

## Ownership Rules

- framework route files connect params, metadata, providers, framework prefetching, and screens
- route-facing screen components go in `screens`
- business-owned UI goes in `features/<feature>/components`
- raw HTTP and transport details go in `*.api.ts`
- use-case orchestration goes in `*.service.ts`
- cache/query identity can go in `*.query.ts`
- server-only feature access can go in `*.server.ts`
- browser/client feature access can go in `*.client.ts`
- browser-only state and side effects can go in `*.store.ts` or `*.adapter.ts`
- screen-facing state connection goes in feature `hooks/`
- generic reusable UI goes in `components`

## Widget Rule

Do not introduce `widgets` by default.

Only consider a `widgets` layer when:

- a UI block combines multiple features
- the block is meaningful as one reusable unit
- it repeats across multiple screens
- ownership is genuinely hard to assign to one feature

## References

- `references/architecture-template.md`
- `references/coding-patterns-template.md`
- `references/adoption-checklist.md`
- `references/agents-snippet.md`
- `references/routing-framework-notes.md`
- `references/data-boundary-notes.md`
- `references/testing-notes.md`
- `references/document-sync-checklist.md`
```

- [ ] **Step 3: Run post-change checks**

Run:

```bash
rg -n "repository-only `examples/`|routing-framework-notes|data-boundary-notes|testing-notes|document-sync-checklist|framework route files are routing shells" skills/react-frontend-standard/SKILL.md
```

Expected: all new workflow references appear.

Run:

```bash
git diff --check -- skills/react-frontend-standard/SKILL.md
```

Expected: no output.

- [ ] **Step 4: Commit**

Run:

```bash
git add skills/react-frontend-standard/SKILL.md
git commit -m "docs: make frontend standard skill operational"
```

Expected: commit succeeds.

---

### Task 6: Installed Output Verification

**Files:**
- Read: `bin/react-frontend-standard.js`
- Read: `templates/AGENTS.md`
- Read: `templates/ARCHITECTURE.md`
- Read: `templates/coding-patterns.md`
- Read: `skills/react-frontend-standard/SKILL.md`
- Read: `skills/react-frontend-standard/references/*`

- [ ] **Step 1: Run CLI install into a temp project without skill**

Run:

```bash
rm -rf /tmp/rfs-install-check
node ./bin/react-frontend-standard.js init /tmp/rfs-install-check
find /tmp/rfs-install-check -maxdepth 4 -type f | sort
```

Expected output includes:

```text
/tmp/rfs-install-check/AGENTS.md
/tmp/rfs-install-check/ARCHITECTURE.md
/tmp/rfs-install-check/docs/coding-patterns.md
```

- [ ] **Step 2: Compare installed docs to templates**

Run:

```bash
diff -u templates/AGENTS.md /tmp/rfs-install-check/AGENTS.md
diff -u templates/ARCHITECTURE.md /tmp/rfs-install-check/ARCHITECTURE.md
diff -u templates/coding-patterns.md /tmp/rfs-install-check/docs/coding-patterns.md
```

Expected: no output.

- [ ] **Step 3: Run CLI install into a temp project with project skill**

Run:

```bash
rm -rf /tmp/rfs-install-check-skill
node ./bin/react-frontend-standard.js init /tmp/rfs-install-check-skill --with-skill
find /tmp/rfs-install-check-skill/.agents/skills/react-frontend-standard -maxdepth 3 -type f | sort
```

Expected output includes:

```text
/tmp/rfs-install-check-skill/.agents/skills/react-frontend-standard/SKILL.md
/tmp/rfs-install-check-skill/.agents/skills/react-frontend-standard/agents/openai.yaml
/tmp/rfs-install-check-skill/.agents/skills/react-frontend-standard/references/adoption-checklist.md
/tmp/rfs-install-check-skill/.agents/skills/react-frontend-standard/references/agents-snippet.md
/tmp/rfs-install-check-skill/.agents/skills/react-frontend-standard/references/architecture-template.md
/tmp/rfs-install-check-skill/.agents/skills/react-frontend-standard/references/coding-patterns-template.md
/tmp/rfs-install-check-skill/.agents/skills/react-frontend-standard/references/data-boundary-notes.md
/tmp/rfs-install-check-skill/.agents/skills/react-frontend-standard/references/document-sync-checklist.md
/tmp/rfs-install-check-skill/.agents/skills/react-frontend-standard/references/routing-framework-notes.md
/tmp/rfs-install-check-skill/.agents/skills/react-frontend-standard/references/testing-notes.md
```

- [ ] **Step 4: Compare installed skill to source skill**

Run:

```bash
diff -ru skills/react-frontend-standard /tmp/rfs-install-check-skill/.agents/skills/react-frontend-standard
```

Expected: no output.

- [ ] **Step 5: Verify installed files do not require repository-only examples**

Run:

```bash
rg -n 'examples/[A-Za-z0-9_.-]' templates skills/react-frontend-standard
```

Expected: no output. The word `examples` may appear as prose in installed guidance, but installed guidance must not point to a repository-only example file as a required path.

If the command outputs a required path reference such as `examples/foo.md`, remove that dependency from the installed guidance and rerun this step.

- [ ] **Step 6: Run whitespace checks**

Run:

```bash
git diff --check -- templates skills/react-frontend-standard
```

Expected: no output.

- [ ] **Step 7: Commit verification cleanup if any verification-only edits were needed**

Run:

```bash
git status --short
```

Expected: no unstaged changes from this task. If this task required a correction, commit only the corrected installed guidance files with:

```bash
git add templates skills/react-frontend-standard
git commit -m "docs: verify installed standard output"
```

Expected: commit succeeds only when there were corrections.

---

### Task 7: Final Review

**Files:**
- Read: `docs/superpowers/specs/2026-05-18-installed-react-frontend-standard-design.md`
- Read: all files modified or created by Tasks 1-6

- [ ] **Step 1: Confirm spec coverage**

Run:

```bash
rg -n 'Routing Framework Boundary|Optional Feature Files|Browser-Only State And Side Effects|Testing Defaults|Document Sync Checklist|repository-only `examples/`' templates skills/react-frontend-standard
```

Expected: each major spec area appears in installed docs or installed skill references.

- [ ] **Step 2: Confirm CLI destinations are unchanged**

Run:

```bash
rg -n "AGENTS.md|ARCHITECTURE.md|docs.*coding-patterns|\\.agents.*skills.*react-frontend-standard|resolveUserSkillPath" bin/react-frontend-standard.js
```

Expected: output still shows the original destination behavior:

```text
AGENTS.md
ARCHITECTURE.md
docs/coding-patterns.md
.agents/skills/react-frontend-standard
resolveUserSkillPath
```

- [ ] **Step 3: Confirm unrelated files were not modified by this plan**

Run:

```bash
git status --short
```

Expected: no new changes in `README.md`, `package.json`, `bin/react-frontend-standard.js`, or `examples/*` from this plan. Pre-existing unrelated changes may still appear and should not be reverted.

- [ ] **Step 4: Final commit if any review fixes were needed**

If Step 1 or Step 2 required corrections, commit only those corrections:

```bash
git add templates skills/react-frontend-standard
git commit -m "docs: align installed standard guidance"
```

Expected: commit succeeds only when corrections were made.

---

## Plan Self-Review

Spec coverage:

- Installed files sufficient without `examples/`: Tasks 1, 4, 5, 6, and 7.
- Concise generated documents with detailed skill references: Tasks 1, 2, 3, and 4.
- Optional feature files: Tasks 2, 3, 4, and 5.
- Browser-only state as boundary, not technology mandate: Tasks 2, 3, and 4.
- Document synchronization checks: Tasks 1, 4, 5, and 7.
- CLI destination preservation: Task 6 and Task 7.

Placeholder scan:

- The plan contains no deferred implementation markers.
- Every file creation step includes exact markdown content.
- Every replacement step includes exact markdown content or points to the exact preceding replacement inside the same task.
- Every verification step includes exact commands and expected results.

Type and name consistency:

- Optional file names consistently use `query`, `server`, `client`, `store`, and `adapter`.
- Installed reference filenames match the `SKILL.md` reference list.
- CLI install paths match the existing CLI behavior.
