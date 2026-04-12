---
name: react-frontend-standard
description: Shared architecture and coding standard for React frontend repositories centered on thin route-entry screens, feature ownership, and shared UI primitives. Use when Codex needs to scaffold a new React frontend project, align an existing repository to a consistent structure, generate or refresh AGENTS.md / ARCHITECTURE.md / coding patterns documents, or review whether code is placed in the right layer. Treat routing frameworks and data access technology such as React Router, Next.js, REST, GraphQL, React Query, Apollo, SWR, and generated clients as implementation details rather than the architectural center.
---

# React Frontend Standard

Use this skill to apply the same React frontend structure and coding rules across multiple repositories without rewriting the guidance from scratch each time.

## Workflow

1. Inspect the current repository shape and identify whether local docs already exist.
2. Treat this skill as the reusable baseline, not as the final project contract.
3. Keep `screens` thin and `features` central.
4. Match feature ownership to backend domains or stable frontend use cases.
5. Generate or refresh local project documents so the repository contains its own source of truth.

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

## Ownership Rules

- route entry components go in `screens`
- business-owned UI goes in `features/<feature>/components`
- raw HTTP and transport details go in `*.api.ts`
- use-case orchestration goes in `*.service.ts`
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
