# Installed React Frontend Standard Design

## Context

The `react-frontend-standard` package exists to install reusable React frontend
architecture guidance into downstream repositories. The installed output is the
important contract. Repository-only `examples/` can help maintainers, but those
files are not present after another project installs the standard and therefore
must not be required to apply the rules correctly.

The `her0707/cdri-books-heowonho` project shows a mature downstream shape:

- framework routing lives in `src/app`
- route-facing screens live in `src/screens`
- domain ownership lives in `src/features/book`
- reusable primitives live in `src/components`
- data flow is split across query, client, server, service, store, and utility
  files where useful
- unit tests sit near feature files and end-to-end tests live under `e2e/`

This design updates the standard so those practical lessons are available from
files that can be installed into a downstream project.

## Goals

1. Make installed files sufficient for agents and maintainers to apply the
   structure without needing this repository's `examples/` directory.
2. Keep generated project documents readable and contractual instead of turning
   them into long implementation manuals.
3. Put detailed operational guidance in the installable
   `react-frontend-standard` skill references.
4. Clarify optional extension files such as `*.query.ts`, `*.server.ts`,
   `*.client.ts`, `*.store.ts`, and `*.adapter.ts`.
5. Treat browser-only state and side effects as a boundary concern, not as a
   mandated storage technology.
6. Add document synchronization checks so downstream docs stay aligned with the
   actual code after the project evolves.

## Non-Goals

- Do not make `examples/` part of the downstream application contract.
- Do not prescribe Next.js as the default routing framework.
- Do not require localStorage, IndexedDB, React Query, or any specific state or
  data-fetching library.
- Do not duplicate every skill reference verbatim inside generated project
  documents.
- Do not change CLI destination paths.

## Installed Surfaces

The CLI must continue to install these project documents:

- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/coding-patterns.md`

When requested, the CLI must continue to install the local skill at:

- `.agents/skills/react-frontend-standard`

The skill must include enough reference material for an agent to apply the
standard after installation, without reading this package repository.

## Document Design

### `AGENTS.md`

`AGENTS.md` should stay short. It should act as a map, not as the full standard.

It should state:

- local project docs are the normal source of truth
- `react-frontend-standard` is used when bootstrapping, aligning, reviewing, or
  regenerating frontend structure guidance
- local docs win if they conflict with the reusable standard
- agents should verify that the map matches actual files before relying on it

This last point is important because downstream projects evolve. A copied
`AGENTS.md` can drift if route entries, providers, or feature folders are
renamed.

### `ARCHITECTURE.md`

`ARCHITECTURE.md` should define structural ownership and framework boundaries.
It should remain portable across React projects.

It should add clearer language for routing frameworks:

- framework route directories such as `src/app`, `src/pages`, or route modules
  are routing shells
- route entries may read params, prepare metadata, perform framework-level data
  prefetch, or connect providers when the framework requires it
- screens remain the route-facing UI composition layer
- features remain the stable ownership center
- generic components remain domain-free shared primitives

The architecture document should also list optional feature files and the reason
they exist:

- `*.query.ts` for cache/query options and query keys
- `*.server.ts` for server-only feature access
- `*.client.ts` for client-side feature access
- `*.store.ts` for feature-owned state or browser-only persistence boundaries
- `*.adapter.ts` for boundary conversion between external and internal shapes

These files are optional. They should appear when they clarify responsibilities,
not because every feature must use every suffix.

### `docs/coding-patterns.md`

`docs/coding-patterns.md` should describe implementation defaults inside the
architecture.

It should add:

- a responsibility table row or short section for optional feature files
- guidance for server/client boundary naming
- guidance for browser-only state and side effects
- guidance for tests by layer
- a reminder that screens and feature components should not directly own raw
  transport setup, browser storage details, or DTO normalization

The document should avoid technology mandates. For example, it can say "isolate
browser-only persistence behind a feature-owned boundary" but should not say
"use IndexedDB for favorites" or "use localStorage for histories."

## Skill Design

### `SKILL.md`

The skill workflow should become more operational. It should guide an agent
through:

1. Inspecting actual repository shape.
2. Reading local docs if present.
3. Identifying routing framework boundaries.
4. Mapping features from backend domains or stable frontend use cases.
5. Checking data-access and side-effect boundaries.
6. Checking test placement and verification commands.
7. Refreshing local docs only after understanding the existing project.

The skill should explicitly say that repository-only `examples/` are not needed
after installation. Any rules required in downstream projects must live in the
installed docs or the installed skill references.

### Skill References

The installable skill references should be the detailed rulebook. Existing
references should be expanded, and new references should be added:

- `architecture-template.md`
  - expanded structural contract and routing framework notes
- `coding-patterns-template.md`
  - expanded coding defaults and optional feature-file responsibilities
- `adoption-checklist.md`
  - step-by-step checks for new and existing repositories
- `routing-framework-notes.md`
  - framework-neutral guidance for `src/app`, `pages`, route modules, loaders,
    and route params
- `data-boundary-notes.md`
  - API, service, query, server, client, adapter, and browser-only boundary
    guidance
- `testing-notes.md`
  - unit, integration, API-route, store, utility, and end-to-end test placement
    guidance
- `document-sync-checklist.md`
  - checks that copied docs match real files, commands, providers, route
    entries, and feature folders

## Browser-Only State And Side Effects

Browser-only state should be documented as a boundary concern.

The standard should say:

- browser-only APIs such as `window`, localStorage, IndexedDB, observers, or
  direct DOM integrations should not leak into screens or general feature UI
- when a feature owns browser-only persistence or subscriptions, prefer a
  feature-local boundary such as `*.store.ts` or `*.adapter.ts`
- code should account for SSR, tests, and unavailable browser APIs
- parsing, fallback values, errors, and subscriptions should be isolated from
  rendering where practical

The standard should not choose a storage backend for the project.

## Data Boundary Guidance

The data boundary guidance should stay library-agnostic.

For REST projects, the baseline remains:

1. route or screen
2. feature component
3. feature hook
4. feature service
5. feature API

Optional files refine the chain:

- `*.query.ts` can own query keys, options, and cache identity
- `*.server.ts` can own server-only feature calls
- `*.client.ts` can own browser/client calls
- `*.service.ts` maps and orchestrates use cases
- `*.adapter.ts` converts external contracts into internal view models

Projects using GraphQL, generated clients, loaders, server actions, or other
data systems can keep the same ownership principle while changing the concrete
technology.

## Document Synchronization

The standard should include a sync check because copied docs can drift.

Before refreshing or trusting docs, agents should verify:

- referenced files exist
- command names in docs match `package.json`
- provider file names match actual code
- route entry descriptions match current route files
- feature names in docs match current `src/features`
- generated/copy destinations still match CLI behavior

When docs and code disagree, update the smallest affected installed document or
project-local document. Do not preserve outdated examples as authoritative.

## Verification

Implementation should verify:

- CLI still copies `templates/AGENTS.md` to `AGENTS.md`
- CLI still copies `templates/ARCHITECTURE.md` to `ARCHITECTURE.md`
- CLI still copies `templates/coding-patterns.md` to `docs/coding-patterns.md`
- project skill install still targets `.agents/skills/react-frontend-standard`
- user skill install still uses the existing resolved user skill path logic
- installed skill references contain the detailed guidance needed without
  `examples/`
- generated docs and skill references do not contradict each other

## Success Criteria

- A downstream project with only installed docs and the installed local skill can
  apply the standard correctly.
- `examples/` are optional maintainer aids, not required rule sources.
- The standard covers routing framework boundaries, optional feature files,
  data boundaries, browser-only side effects, testing, and document sync.
- The guidance remains project-agnostic and avoids prescribing storage or data
  libraries unnecessarily.
