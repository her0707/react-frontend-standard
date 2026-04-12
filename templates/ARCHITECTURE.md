# ARCHITECTURE.md

## Purpose

This document defines the frontend architecture rules used by this repository and intended to be portable across similar React projects.

- It explains where code belongs.
- It defines ownership and layer boundaries.
- It describes the default change unit for feature work.
- It does not define detailed coding style.

Detailed implementation defaults live in `docs/coding-patterns.md`.

## Document Roles

- `AGENTS.md`: short entry map for Codex and humans
- `ARCHITECTURE.md`: source of truth for structure, ownership, and boundaries
- `docs/coding-patterns.md`: source of truth for coding defaults and responsibility rules

Keep `AGENTS.md` short. Keep structural rules here. Keep coding rules separate.

## Architecture Goals

This repository uses a feature-centered React frontend architecture with these goals:

1. Keep most changes inside one feature folder.
2. Keep route entry components thin.
3. Match feature ownership to backend domains or clear frontend use cases.
4. Prefer domain-local code before promoting logic to shared layers.
5. Keep the structure simple enough to reuse across other repositories.

## Core Principle

The stable center of the architecture is `features`, not the routing framework.

That means:

- `features` own business domains and frontend use cases
- `screens` own route entry only
- `components` own shared generic UI
- routing implementation may differ by framework

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

- `routes/`
- `styles/`
- `constants/`
- `tests/`
- `__generated__/`

## Directory Responsibilities

### `src/screens`

Own route-matching top-level screen components.

Rules:

- each screen should correspond to a route or route-like page entry
- screens should stay thin
- screens compose feature components and feature hooks
- screens should not become a second feature layer

### `src/features`

Own business domains or clear frontend use cases.

Features are usually derived from one of these:

- backend API domain
- backend resource ownership
- stable user use case

### `src/components`

Own shared generic UI primitives reused across features.

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

- `<Feature>.store.ts`
- `<Feature>.query.ts`
- `<Feature>.fragment.ts`
- `<Feature>.adapter.ts`

## Ownership Model

### Put code in `screens` when

- it is the route entry component
- it mainly composes feature components
- it reads route params or page-level search params

### Put code in `features/<feature>/components` when

- it is domain-specific UI
- one feature clearly owns it
- it uses that feature's hooks, services, or data contracts

### Put code in `components` when

- it has no domain meaning
- it is reusable across unrelated features

## What About Widgets

`widgets` is not part of the default structure.

Only consider a separate `widgets` layer when all of the following are true:

- the UI block combines multiple features
- the block is meaningful as one reusable unit
- the same block repeats across multiple screens
- ownership is genuinely hard to assign to one feature

## Layer Model

Use this dependency direction as the default rule:

1. `screens`
2. `features/*/components`
3. `features/*/hooks`
4. `features/*/(api|service|schema|type|util|optional files)`
5. shared `components`, `hooks`, `lib`, `services`, `utils`, `types`
6. optional generated artifacts

## REST and Data Access

For REST-oriented projects:

- keep raw HTTP calls in `*.api.ts`
- keep use-case orchestration in `*.service.ts`
- keep screen-facing state connection in feature hooks
- do not place transport details inside screens or feature components

## Screen Design Rule

Screens should stay thin.

Good screen responsibilities:

- connect route to screen
- read route params
- compose feature components
- place sections in the right order

Bad screen responsibilities:

- raw API calls
- large data normalization logic
- transport-specific request setup

## Decision Checklist

Before adding or moving code, answer:

- is this a route entry, a feature responsibility, or a shared primitive
- which feature owns the business meaning
- does this code call HTTP directly
- should this code live in `api`, `service`, `hook`, or `component`
- is a new layer actually needed, or does it only add indirection
