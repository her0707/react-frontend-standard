# Adoption Checklist

Use this checklist when installing or applying the React frontend standard.

## New Repository

1. Confirm the project is React-based.
2. Create `AGENTS.md`, `ARCHITECTURE.md`, and `docs/coding-patterns.md`.
3. Identify the routing framework and mark route files as routing shells.
4. Decide the initial feature map from backend domains or stable frontend use cases.
5. Add thin route-facing screens.
6. Add feature-local `api/service/hook` layers where the project uses explicit transport code.
7. Add optional feature files only when they clarify a real boundary.
8. Record project-specific commands and exceptions in local docs.

## Existing Repository

1. Inspect route entrypoints and identify framework-owned routing shells.
2. Inspect current screens or page-level components.
3. Inspect domain folders and identify likely feature boundaries.
4. Move raw HTTP logic out of route files, screens, and feature components when possible.
5. Isolate browser-only side effects behind feature-owned stores or adapters when such side effects exist.
6. Add or clarify optional feature files where current code mixes responsibilities.
7. Verify tests exist at the layer that owns the behavior.
8. Refresh project docs after checking actual files and commands.

## Applying To Another Project

1. Read local docs first.
2. Verify local docs against actual files before relying on them.
3. Map route files, screens, features, and shared primitives.
4. Keep features as the ownership center.
5. Keep generated docs concise and put detailed reusable guidance in the installed skill references.
6. Avoid adding `widgets` unless repeated cross-feature blocks justify it.
