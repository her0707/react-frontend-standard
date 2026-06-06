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
- feature-root role files use `<Feature>.<role>.ts`; role-only names such as `api.ts`, `schema.ts`, `type.ts`, and `types.ts` are not part of this standard.
- reusable modules use named exports by default; framework route entries and route-facing screens may use default exports when they are single-entry files.
- local project docs win over reusable references when they conflict.

Repository-only `examples/` can help maintain this package, but downstream projects must be able to apply the standard from installed docs and installed skill references alone.

## Workflow

1. Inspect the current repository shape with file search.
2. Read local docs if present: `AGENTS.md`, `ARCHITECTURE.md`, `docs/coding-patterns.md`, README, and product specs.
3. Verify local docs against actual files, commands, route entries, providers, and feature folders.
4. Identify routing framework boundaries using `references/routing-framework-notes.md`.
5. Map feature ownership from backend domains or stable frontend use cases.
6. Check data-access and side-effect boundaries using `references/data-boundary-notes.md`.
7. Check feature-root role filenames; rename role-only files to `<Feature>.<role>.ts`.
8. Check export style; prefer named exports for reusable modules and reserve default exports for route entries and screens.
9. Check test placement and verification commands using `references/testing-notes.md`.
10. Generate or refresh local project documents so the repository contains its own source of truth.
11. Keep generated docs concise and put detailed reusable reasoning in installed skill references.

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

Do not use role-only feature-root filenames such as `api.ts`, `service.ts`, `schema.ts`, `type.ts`, `types.ts`, `query.ts`, `server.ts`, `client.ts`, `store.ts`, or `adapter.ts`.

## Ownership Rules

- framework route files connect params, metadata, providers, framework prefetching, and screens
- route-facing screen components go in `screens`
- business-owned UI goes in `features/<feature>/components`
- raw HTTP and transport details go in `<Feature>.api.ts`
- use-case orchestration goes in `<Feature>.service.ts`
- cache/query identity can go in `<Feature>.query.ts`
- server-only feature access can go in `<Feature>.server.ts`
- browser/client feature access can go in `<Feature>.client.ts`
- browser-only state and side effects can go in `<Feature>.store.ts` or `<Feature>.adapter.ts`
- screen-facing state connection goes in feature `hooks/`
- generic reusable UI goes in `components`
- reusable components, hooks, services, utilities, schemas, stores, adapters, and query helpers use named exports by default
- framework route entries and screen files may use default exports when the file represents one route-facing entry

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
