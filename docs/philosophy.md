# Philosophy

This standard prefers:

- thin route-entry screens
- feature ownership as the architectural center
- low layer count
- local clarity over speculative abstraction

This standard avoids:

- making `widgets` a default layer
- creating `pages` as a second page-composition layer beside `screens`
- placing raw transport logic in screens
- using role-only feature-root filenames such as `api.ts`, `schema.ts`, `type.ts`, `types.ts`, or `actions.ts`
- forcing structure to follow a specific routing or data library
