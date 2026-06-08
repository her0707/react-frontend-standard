# Adoption Checklist

Use this checklist when installing or applying the React frontend standard.

## New Repository

1. Confirm the project is React-based.
2. Install the thin `AGENTS.md` router, manifest, and local skill with `npx react-frontend-standard init .`.
3. Identify the routing framework and mark route files as routing shells.
4. Decide the initial feature map from backend domains or stable frontend use cases.
5. Add thin route-facing screens.
6. In router-config projects such as React Router, route directly to screens unless a thin route shell is needed.
7. Add feature-local `<Feature>.api.ts`, `<Feature>.service.ts`, and hook layers where the project uses explicit transport code.
8. Add optional feature files only when they clarify a real boundary.
9. Reject role-only feature-root filenames such as `api.ts`, `schema.ts`, `type.ts`, and `types.ts`.
10. Add `--with-hooks` when the project should receive SessionStart sync hooks.
11. Add `--with-docs` only when the project wants starter `ARCHITECTURE.md` and `docs/coding-patterns.md` scaffolds.
12. Record project-specific commands, routing setup, feature map, and exceptions in local docs.

## Existing Repository

1. Inspect route entrypoints and identify framework-owned routing shells.
2. Inspect current screens or page-level components.
3. Inspect domain folders and identify likely feature boundaries.
4. Collapse page wrappers when router config can render screens directly and the wrappers do no real route-shell work.
5. Move raw HTTP logic out of route files, screens, and feature components when possible.
6. Isolate browser-only side effects behind feature-owned stores or adapters when such side effects exist.
7. Rename role-only feature-root files to `<Feature>.<role>.ts` unless local docs intentionally define an exception.
8. Add or clarify optional feature files where current code mixes responsibilities.
9. Verify tests exist at the layer that owns the behavior.
10. If `.react-frontend-standard/manifest.json` exists, run `npx -y react-frontend-standard@latest check .` before refreshing the installed standard.
11. If no manifest exists, run `npx -y react-frontend-standard@latest init . --with-hooks` once, then `npx -y react-frontend-standard@latest sync .`.
12. Refresh only project-specific docs after checking actual files and commands.

## Applying To Another Project

1. Read local docs first.
2. If a manifest exists, run `npx -y react-frontend-standard@latest sync .` when the installed standard is stale.
3. Treat optional `ARCHITECTURE.md` and `docs/coding-patterns.md` as project notes, not as a duplicate source for the reusable standard.
4. Map route files, screens, features, and shared primitives.
5. Keep `pages` as routing shells only, and prefer route config to screens directly when the router allows it.
6. Keep features as the ownership center.
7. Check feature-root role files use `<Feature>.<role>.ts`, not role-only filenames.
8. Keep local docs concise and put detailed reusable guidance in the installed skill references.
9. Avoid adding `widgets` unless repeated cross-feature blocks justify it.
