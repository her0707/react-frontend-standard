# Decisions

## Why `screens`

`screens` maps cleanly to route-entry UI without implying a framework-specific routing system.

## Why `features` are central

Features track backend domains or stable frontend use cases more consistently than route or layout structure.

## Why `widgets` are optional

Many projects do not benefit from a separate `widgets` layer. It becomes useful only when repeated, meaningful, cross-feature blocks appear.

## Why REST uses `api -> service -> hook`

REST projects usually need explicit transport code, orchestration, and screen-facing state wiring. Keeping those layers visible improves readability and ownership clarity.
