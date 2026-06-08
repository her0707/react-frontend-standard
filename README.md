# react-frontend-standard

Reusable structure, documentation, and agent skill for React frontend repositories.

## Quick Start

Install a thin `AGENTS.md` router, project-local skill, and version manifest into another React project:

```bash
npx react-frontend-standard init .
```

Install Codex / Claude Code session-start hooks as well:

```bash
npx react-frontend-standard init . --with-hooks
```

Skip project-local skill installation:

```bash
npx react-frontend-standard init . --without-skill
```

Generate optional architecture and coding-pattern starter docs:

```bash
npx react-frontend-standard init . --with-docs
```

Install the skill into your user environment instead:

```bash
npx react-frontend-standard init . --with-user-skill
```

For local use inside this repository:

```bash
node ./bin/react-frontend-standard.js
```

The wizard guides you through:

- target project path
- whether to install the skill
- whether the skill should be installed into the project or the user environment
- whether to install Codex and Claude Code SessionStart update hooks
- whether to generate optional architecture and coding-pattern docs
- how to handle existing files

If you prefer non-interactive usage, the CLI still supports:

```bash
node ./bin/react-frontend-standard.js init .
node ./bin/react-frontend-standard.js init . --with-hooks
node ./bin/react-frontend-standard.js init . --with-docs
node ./bin/react-frontend-standard.js init . --with-user-skill
node ./bin/react-frontend-standard.js init . --without-skill
node ./bin/react-frontend-standard.js init . --overwrite
node ./bin/react-frontend-standard.js check .
node ./bin/react-frontend-standard.js sync .
```

After package installation, both `react-frontend-standard` and `rfs` are exposed as
CLI aliases.

## Version Sync

`init` writes `.react-frontend-standard/manifest.json` into the target project.
That manifest records the installed package version, generated file hashes, skill
install mode, whether update hooks were installed, and whether optional docs were
installed.

Check whether a target project is behind the npm release:

```bash
npx -y react-frontend-standard@latest check .
```

Refresh safely from the latest package:

```bash
npx -y react-frontend-standard@latest sync .
```

`sync` refreshes the installed skill automatically. It updates generated hook files
and optional docs only when they still match the previously installed hash,
preserving local edits by reporting `skip modified: <path>`. Use `--overwrite`
only when the target project's local changes should be replaced.

When installed with `--with-hooks`, the target project receives:

- `.react-frontend-standard/hooks/session-start.mjs`
- `.codex/hooks.json`
- `.claude/settings.json`

Those hooks call `npx -y react-frontend-standard@latest sync .` when Codex or
Claude Code sessions start, so downstream projects can keep the installed skill
and managed assets current without manual checks.

## What This Repo Shape Is For

This directory packages the standards discussed in this project into a reusable skill-first bundle:

- thin route-entry `screens`
- feature-centered ownership
- shared generic `components`
- REST-friendly `<Feature>.api.ts -> <Feature>.service.ts -> hook -> component -> screen` layering
- feature-root role files named as `<Feature>.<role>.ts`
- named exports for reusable modules, with default exports reserved for route-facing entries
- router-config projects such as React Router route to screens directly unless a thin route shell is needed
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
|           |-- coding-patterns-template.md
|           |-- data-boundary-notes.md
|           |-- document-sync-checklist.md
|           |-- routing-framework-notes.md
|           `-- testing-notes.md
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

1. Run `npx react-frontend-standard init . --with-hooks` so the project receives the local skill, thin `AGENTS.md` router, manifest, and update hooks.
2. Define initial `features` from backend domains or stable user use cases.
3. Add thin route-entry `screens`.
4. In router-config projects such as React Router, point routes at screens directly unless a thin route shell is actually needed.
5. Add `--with-docs` only when the project wants starter `ARCHITECTURE.md` and `docs/coding-patterns.md` scaffolds.
6. Record project-specific commands, routing setup, and exceptions in local docs.

### Existing repository

1. Inspect current route entrypoints and domain folders.
2. Map code into `screens`, `features`, and shared `components`.
3. Move raw transport logic into feature `<Feature>.api.ts`, `<Feature>.service.ts`, and feature hooks where helpful.
4. Run `npx react-frontend-standard init . --with-hooks` once when no manifest exists.
5. Run `npx react-frontend-standard sync .` to refresh the installed skill while preserving modified local docs.
6. Add `--with-docs` only when the project wants optional generated docs managed by this package.

## Core Rules

- `screens` are route-entry components only.
- `pages`, `app`, `routes`, and route modules are routing shells, not a parallel page-composition layer.
- React Router-style route config should usually render `screens` directly.
- `features` are the ownership center.
- feature-root role files use `<Feature>.<role>.ts`, not role-only names such as `api.ts`, `schema.ts`, `type.ts`, or `types.ts`.
- `components` are shared generic UI primitives.
- reusable modules use named exports; route files and screens may use default exports.
- `widgets` are optional and only introduced for repeated, meaningful, cross-feature UI blocks.

## Source

This package was derived from the working standards used in the surrounding project and generalized for reuse.
