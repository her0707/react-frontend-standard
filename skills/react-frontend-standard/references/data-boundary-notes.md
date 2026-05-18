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
