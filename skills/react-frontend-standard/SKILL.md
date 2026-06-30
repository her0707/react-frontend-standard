---
name: react-frontend-standard
description: Shared architecture and coding standard for React frontend repositories centered on thin route-facing screens, feature ownership, and shared UI primitives. Use when Codex needs to scaffold a new React frontend project, align an existing repository to a consistent structure, install or refresh the local standard skill, create a thin AGENTS.md router, optionally generate starter architecture/coding-pattern documents, or review whether code is placed in the right layer. Treat routing frameworks and data access technology such as React Router, Next.js, Remix, TanStack Router, REST, GraphQL, React Query, Apollo, SWR, React Server Components, server actions, route loaders, Cache Components, and generated clients as implementation details rather than the architectural center.
---

# React Frontend Standard

Use this skill to apply the same React frontend structure and coding rules across repositories without rewriting the guidance from scratch each time.

## Core Contract

- `features` are the ownership center.
- framework route files are routing shells.
- `screens` are route-facing UI composition.
- router-config projects such as React Router should route to screens directly unless a thin route shell is needed.
- `pages` must not become a parallel page-composition layer beside `screens`.
- shared `components` are generic and domain-free.
- optional feature files appear only when they clarify a real boundary.
- feature-root role files use `<Feature>.<role>.ts`; role-only names such as `api.ts`, `schema.ts`, `type.ts`, `types.ts`, `action.ts`, and `actions.ts` are not part of this standard.
- reusable modules use named exports by default; framework route entries and route-facing screens may use default exports when they are single-entry files.
- TypeScript/TSX safety rules and existing-file change guardrails live in `references/coding-patterns-template.md`.
- local project docs describe project-specific facts and intentional exceptions.
- this installed skill is the reusable standard source of truth.

Repository-only `examples/` can help maintain this package, but downstream projects must be able to apply the standard from the installed skill and thin `AGENTS.md` router alone. Optional generated docs are scaffolds for project notes, not a second copy of the standard.

## Workflow

1. Inspect the current repository shape with file search.
2. Read local docs if present: `AGENTS.md`, README, product specs, and project-specific notes.
3. If `.react-frontend-standard/manifest.json` exists, use `npx -y react-frontend-standard@latest check .` or `sync .` when the installed standard may be stale.
4. Treat `ARCHITECTURE.md` and `docs/coding-patterns.md` as optional project notes when they exist, not as newer copies of this reusable standard.
5. Verify local docs against actual files, commands, route entries, providers, and feature folders.
6. Identify routing framework boundaries using `references/routing-framework-notes.md`.
7. For Next.js App Router or RSC projects, check `references/rsc-next-app-router-notes.md`.
8. Map feature ownership from backend domains or stable frontend use cases.
9. Check data-access and side-effect boundaries using `references/data-boundary-notes.md`.
10. Check feature-root role filenames; rename role-only files to `<Feature>.<role>.ts`.
11. Check export style; prefer named exports for reusable modules and reserve default exports for route entries and screens.
12. When writing, refactoring, or reviewing code, check TS/TSX safety rules and existing-file change rules in `references/coding-patterns-template.md`.
13. Check test placement and verification commands using `references/testing-notes.md`.
14. Record only project-specific commands, routing setup, feature map, and intentional exceptions in local docs.

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

Framework route directories such as `src/app`, `src/pages`, route modules, or router config files may exist alongside this structure. Treat them as routing shells. In router-config projects such as React Router or TanStack Router, prefer route entries that render `src/screens/*Screen.tsx` directly unless a thin route shell is needed for params, metadata, providers, loaders, actions, or another routing boundary.

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
- `<Feature>.action.ts`
- `<Feature>.store.ts`
- `<Feature>.adapter.ts`
- `<Feature>.fragment.ts`

Do not use role-only feature-root filenames such as `api.ts`, `service.ts`, `schema.ts`, `type.ts`, `types.ts`, `query.ts`, `server.ts`, `client.ts`, `action.ts`, `actions.ts`, `store.ts`, or `adapter.ts`.

## Ownership Rules

- framework route files connect params, metadata, providers, framework prefetching, and screens
- route-facing screen components go in `screens`
- React Router-style route config usually renders screens directly instead of adding `pages` wrappers
- business-owned UI goes in `features/<feature>/components`
- raw HTTP and transport details go in `<Feature>.api.ts`
- use-case orchestration goes in `<Feature>.service.ts`
- cache/query identity can go in `<Feature>.query.ts`
- server-only feature access can go in `<Feature>.server.ts`
- browser/client feature access can go in `<Feature>.client.ts`
- framework-specific mutations and server actions can go in `<Feature>.action.ts`
- browser-only state and side effects can go in `<Feature>.store.ts` or `<Feature>.adapter.ts`
- screen-facing state connection goes in feature `hooks/`
- generic reusable UI goes in `components`
- reusable components, hooks, services, utilities, schemas, actions, stores, adapters, and query helpers use named exports by default
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
- `references/rsc-next-app-router-notes.md`
- `references/data-boundary-notes.md`
- `references/testing-notes.md`
- `references/document-sync-checklist.md`
