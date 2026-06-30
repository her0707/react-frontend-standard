# RSC Next App Router Notes

Use these notes when applying the standard to a Next.js App Router project with React Server Components, Server Functions or Actions, Suspense streaming, Cache Components, or Partial Prerendering.

## Core Translation

Keep the standard's ownership model intact:

- `app/**/page.tsx`, layouts, and route segments are framework route shells
- `screens` own route-facing composition and loading sequence decisions
- `features/<feature>/components` own domain UI, including async server components
- feature support files use `<Feature>.<role>.ts` names

Do not turn an async `page.tsx` into a route-level data loader that fetches every feature's data and prop-drills it through the tree. Prefer feature-owned server components that fetch the data they need, then let route-facing composition place Suspense and error boundaries around those regions.

## Server Component Data Ownership

For RSC projects, async server components are a good default for domain-owned read UI.

Do this:

- pass minimal stable props such as `id`, `slug`, or `handle` into feature server components
- let the feature component call feature-owned query/server helpers for the data it renders
- pass already-loaded parent data downward when the parent genuinely owns the collection, such as a feed passing each `post` object to a post item
- keep external DTO shaping and cache/query identity in `<Feature>.query.ts`, `<Feature>.server.ts`, or `<Feature>.adapter.ts` when those responsibilities need names or tests
- rely on the framework or React request cache only as a dedupe tool, not as a reason to scatter unrelated reads

Avoid this:

- awaiting all page data at the route shell just because the page can be async
- passing large loader-shaped prop bundles through screens and feature components
- making each child refetch data the parent already loaded
- letting server-only reads leak into client components

## Actions And Mutations

Use `<Feature>.action.ts` when a feature owns framework-specific mutations such as Server Functions or Actions, invalidation, refresh behavior, or action-level input validation.

Keep actions feature-prefixed and feature-owned:

- `Post.action.ts`, not `actions.ts`
- `Reservation.action.ts`, not `mutation.ts`

Client components should stay small and import or receive only the action surface they need according to the framework and local project convention. Put optimistic UI state in the smallest client component that owns the interaction; lift it only when another visible region must react before revalidation.

## Client Boundary

Push `"use client"` as deep as possible.

Use client components for hooks, event handlers, browser APIs, or client-only state. Keep server components as parents when they can render data and static markup without browser JavaScript. If a feature needs browser persistence, subscriptions, or DOM APIs, isolate them behind `<Feature>.client.ts`, `<Feature>.store.ts`, or `<Feature>.adapter.ts`.

## Suspense, Skeletons, And Errors

Feature components provide content and matching loading shapes. Route-facing composition decides where the user waits.

Use this pattern:

- export `Name` and `NameSkeleton` from the same feature component file when the skeleton only exists for that component
- keep skeleton dimensions and outer layout classes in sync with the real component
- place `<Suspense>` in the screen or route shell around user-meaningful regions
- group Suspense boundaries by loading experience, not by file structure
- add local error boundaries around regions that can fail independently

Avoid wrapping the whole page in one fallback by default. Keep static chrome, headers, and layout visible when possible, then stream data-dependent regions behind deliberate boundaries.

## Route Params And Static Shells

In Next.js versions where `params` or `searchParams` are Promises, keep route shells synchronous when preserving the static shell matters, especially with Cache Components or Partial Prerendering.

Prefer resolving params at the narrowest route-facing boundary that needs them. A route shell may use `params.then(...)` inside a Suspense-covered region, or a small framework-specific wrapper, when that keeps static page chrome outside the async work. Record any project-wide convention in local docs.

## Cache Components

Cache Components, `"use cache"`, cache tags, cache lifetimes, and Partial Prerendering are project-specific Next.js choices.

When a project enables them:

- keep dynamic data regions behind Suspense boundaries
- keep static layout and chrome outside those boundaries
- put cache tags and invalidation decisions in feature-owned query/action boundaries
- do not add cache directives to the reusable standard by default

## Decision Check

Before adding RSC-specific code, ask:

- Is this required by the App Router route shell, or does it belong to a screen or feature?
- Can the route-facing composition stay mostly synchronous while only data regions suspend?
- Which feature owns the read, mutation, cache identity, or invalidation?
- Does this component need browser JavaScript, or can it remain a server component?
- Does the skeleton live close enough to the component to stay in sync?
