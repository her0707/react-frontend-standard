# Architecture Template

Use this template as the starting point for a React frontend repository's `ARCHITECTURE.md`.

## Baseline Structure

```text
src/
|-- screens/
|-- features/
|-- components/
|-- hooks/
|-- lib/
|-- services/
|-- utils/
`-- types/
```

## Baseline Ownership Model

- `screens`: route entry only
- `features`: business domains or stable frontend use cases
- `components`: shared generic UI
- `hooks`: truly shared hooks
- `lib`: runtime setup and integrations

## Baseline Feature Structure

```text
features/<feature>/
|-- components/
|-- hooks/
|-- <Feature>.api.ts
|-- <Feature>.service.ts
|-- <Feature>.schema.ts
|-- <Feature>.type.ts
`-- <Feature>.util.ts
```
