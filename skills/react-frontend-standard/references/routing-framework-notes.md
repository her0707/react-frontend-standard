# Routing Framework Notes

Use these notes when applying the standard to a project with framework-owned routing.

## Core Rule

The routing framework is not the architecture center. Route files are shells that connect framework requirements to screen components.

Router-config projects such as React Router or TanStack Router usually do not need a separate `pages` layer. Prefer route entries that render `src/screens/*Screen.tsx` directly unless a thin route shell is needed.

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
| React Router or TanStack Router config entry | route config | render a `src/screens/*Screen.tsx` component directly |
| `src/app/**/page.tsx` | routing shell | render a `src/screens/*Screen.tsx` component; for RSC projects also read `rsc-next-app-router-notes.md` |
| `src/pages/*.tsx` | routing shell | render a `src/screens/*Screen.tsx` component |
| `src/pages/*.tsx` in a router-config project | optional routing shell | keep only when it owns real route-shell work; otherwise route directly to the screen |
| route module with loader/action | routing shell and framework boundary | keep feature logic in feature services or adapters |
| nested layout route | routing shell or layout integration | keep reusable layout components outside domain features unless one feature owns them |

## Decision Check

Ask these questions before adding logic to a route file:

- Does the framework require this code to live here?
- Can this router config render the screen directly?
- Can data-dependent regions suspend below the route shell instead of turning the route file into a page-wide loader?
- Can this be named as a feature use case?
- Would this logic be useful without knowing the route path?
- Can this be unit tested more easily in a feature file?

If the answer points away from the framework, move the logic into a screen, feature hook, service, adapter, or utility.
