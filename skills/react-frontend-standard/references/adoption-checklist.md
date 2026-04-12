# Adoption Checklist

## New Repository

1. Confirm the project is React-based.
2. Create `AGENTS.md`, `ARCHITECTURE.md`, and `docs/coding-patterns.md`.
3. Decide the initial feature map from backend domains or stable frontend use cases.
4. Add thin route-entry screens.
5. Add feature-local `api/service/hook` layers where the project uses REST or other explicit transport code.

## Existing Repository

1. Inspect route entrypoints and identify the current screen layer.
2. Inspect domain folders and identify likely feature boundaries.
3. Move raw HTTP logic out of screens and feature components when possible.
4. Add or clarify feature `api/service/hook` files where the current code is mixed.
5. Write project-specific docs before large structural rewrites.

## Applying To Another Project

1. Map backend domains and stable user use cases.
2. Define `features` from that map.
3. Define thin route-entry `screens`.
4. Move generic primitives to `components`.
5. Avoid adding `widgets` unless repeated cross-feature blocks justify it.
