# react-frontend-standard

Reusable structure, documentation, and agent skill for React frontend repositories.

## Quick Start

Recommended naming:

- GitHub repository: `react-frontend-standard`
- CLI aliases: `react-frontend-standard` and `rfs`

For local use inside this repository:

```bash
node ./bin/react-frontend-standard.js
```

The wizard guides you through:

- target project path
- whether to install the skill
- whether the skill should be installed into the project or the user environment
- how to handle existing files

If you prefer non-interactive usage, the CLI still supports:

```bash
node ./bin/react-frontend-standard.js init .
node ./bin/react-frontend-standard.js init . --with-skill
```

After package installation, a short alias such as `rfs` can also be exposed.

## What This Repo Shape Is For

This directory packages the standards discussed in this project into a reusable bundle:

- thin route-entry `screens`
- feature-centered ownership
- shared generic `components`
- REST-friendly `api -> service -> hook -> component -> screen` layering
- optional, not default, `widgets`

## Structure

```text
react-frontend-standard/
|-- README.md
|-- skills/
|   `-- react-frontend-standard/
|       |-- SKILL.md
|       |-- agents/
|       |   `-- openai.yaml
|       `-- references/
|           |-- adoption-checklist.md
|           |-- agents-snippet.md
|           |-- architecture-template.md
|           `-- coding-patterns-template.md
|-- templates/
|   |-- AGENTS.md
|   |-- ARCHITECTURE.md
|   `-- coding-patterns.md
|-- examples/
|   |-- b2b-admin-example.md
|   |-- b2c-domain-aligned-example.md
|   `-- b2c-composition-heavy-example.md
`-- docs/
    |-- decisions.md
    `-- philosophy.md
```

## How To Use

### New repository

1. Copy `templates/AGENTS.md`, `templates/ARCHITECTURE.md`, and `templates/coding-patterns.md`.
2. Define initial `features` from backend domains or stable user use cases.
3. Add thin route-entry `screens`.
4. Copy `skills/react-frontend-standard/` into the repository's local skills directory if agent support is needed.

### Existing repository

1. Inspect current route entrypoints and domain folders.
2. Map code into `screens`, `features`, and shared `components`.
3. Move raw transport logic into feature `*.api.ts`, `*.service.ts`, and feature hooks where helpful.
4. Document intentional exceptions before large refactors.

## Core Rules

- `screens` are route-entry components only.
- `features` are the ownership center.
- `components` are shared generic UI primitives.
- `widgets` are optional and only introduced for repeated, meaningful, cross-feature UI blocks.

## Source

This package was derived from the working standards used in the surrounding project and generalized for reuse.

## Publishing Note

Publishing to npm is intentionally deferred for now.

Recommended sequence:

1. move this directory into its own repository
2. decide the final npm scope and package name when publishing is actually in scope
3. validate the CLI in isolation
4. publish only after the standalone repository structure is stable
