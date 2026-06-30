# Decisions

## Why `screens`

`screens` maps cleanly to route-entry UI without implying a framework-specific routing system.

## Why route files stay shells

Routing frameworks need different file shapes and config objects. Keep framework route files thin and let them render screens. In router-config projects such as React Router, prefer rendering screens directly unless a thin route shell is needed for params, loaders, providers, or another framework boundary.

## Why `features` are central

Features track backend domains or stable frontend use cases more consistently than route or layout structure.

## Why `widgets` are optional

Many projects do not benefit from a separate `widgets` layer. It becomes useful only when repeated, meaningful, cross-feature blocks appear.

## Why REST uses `api -> service -> hook`

REST projects usually need explicit transport code, orchestration, and screen-facing state wiring. Keeping those layers visible improves readability and ownership clarity.

## Why feature files repeat the feature name

Feature-root support files use names such as `Reservation.api.ts` or `Reservation.action.ts` instead of role-only names such as `api.ts` or `actions.ts`. Repeating the feature name keeps imports, editor tabs, search results, and agent refactors clear even when many feature folders contain the same roles.

## Why exports are mostly named

Reusable modules use named exports by default because stable import names make search, editor tabs, automated imports, and agent refactors more predictable. Default exports are still acceptable for framework route files and route-facing screens because those files act as single entry points.
