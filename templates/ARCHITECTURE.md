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

When a feature-root role file exists, it must use `<Feature>.<role>.ts`.
Do not use role-only names such as `api.ts`, `service.ts`, `schema.ts`, `type.ts`, `types.ts`, `query.ts`, `server.ts`, `client.ts`, `store.ts`, or `adapter.ts` inside `features/<feature>/`.

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

- keep raw HTTP calls in `<Feature>.api.ts`
- keep use-case orchestration in `<Feature>.service.ts`
- keep cache/query identity in `<Feature>.query.ts` when using a query library
- keep server-only access in `<Feature>.server.ts` when the framework has server execution
- keep client-side access in `<Feature>.client.ts` when browser calls differ from server calls
- keep screen-facing state connection in feature hooks
- do not place transport details inside route files, screens, or feature components

These files still use feature-prefixed names: `<Feature>.api.ts`, `<Feature>.service.ts`, `<Feature>.query.ts`, `<Feature>.server.ts`, and `<Feature>.client.ts`.

Projects using GraphQL, generated clients, server actions, loaders, or other data systems should keep the same ownership principle while adapting the concrete files.

## Browser-Only Boundary

Browser-only APIs such as `window`, local storage APIs, observers, or direct DOM integrations should not leak into route files, screens, or general feature UI.

When a feature owns browser-only persistence or subscriptions, isolate that behavior behind a feature-local boundary such as `<Feature>.store.ts` or `<Feature>.adapter.ts`. The standard does not choose a storage backend.

## Decision Checklist

Before adding or moving code, answer:

- is this required by the routing framework
- is this route-facing composition, feature-owned behavior, or a shared primitive
- which feature owns the business meaning
- does this code call transport, browser-only APIs, or external systems directly
- should this code live in `api`, `service`, `hook`, `query`, `server`, `client`, `store`, `adapter`, or `component`
- is a new layer actually needed, or does it only add indirection
