# react-frontend-standard

Reusable structure, documentation, and agent skill for React frontend repositories.

## Quick Start

Install into another React project with `npx`:

```bash
npx react-frontend-standard init .
```

Install the project-local agent skill as well:

```bash
npx react-frontend-standard init . --with-skill
```

Install the project-local skill and Codex / Claude Code session-start hooks:

```bash
npx react-frontend-standard init . --with-skill --with-hooks
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
- how to handle existing files

If you prefer non-interactive usage, the CLI still supports:

```bash
node ./bin/react-frontend-standard.js init .
node ./bin/react-frontend-standard.js init . --with-skill
node ./bin/react-frontend-standard.js init . --with-skill --with-hooks
node ./bin/react-frontend-standard.js init . --with-user-skill
node ./bin/react-frontend-standard.js init . --overwrite
node ./bin/react-frontend-standard.js check .
node ./bin/react-frontend-standard.js sync .
```

After package installation, both `react-frontend-standard` and `rfs` are exposed as
CLI aliases.

## Version Sync

`init` writes `.react-frontend-standard/manifest.json` into the target project.
That manifest records the installed package version, generated file hashes, skill
install mode, and whether update hooks were installed.

Check whether a target project is behind the npm release:

```bash
npx -y react-frontend-standard@latest check .
```

Refresh safely from the latest package:

```bash
npx -y react-frontend-standard@latest sync .
```

`sync` refreshes the installed skill automatically. It updates generated docs and
hook files only when they still match the previously installed hash, preserving
local edits by reporting `skip modified: <path>`. Use `--overwrite` only when the
target project's local changes should be replaced.

When installed with `--with-hooks`, the target project receives:

- `.react-frontend-standard/hooks/session-start.mjs`
- `.codex/hooks.json`
- `.claude/settings.json`

Those hooks call `npx -y react-frontend-standard@latest sync .` when Codex or
Claude Code sessions start, so downstream projects can keep the installed skill
and generated standard assets current without manual checks.

## What This Repo Shape Is For

This directory packages the standards discussed in this project into a reusable bundle:

- thin route-entry `screens`
- feature-centered ownership
- shared generic `components`
- REST-friendly `<Feature>.api.ts -> <Feature>.service.ts -> hook -> component -> screen` layering
- feature-root role files named as `<Feature>.<role>.ts`
- named exports for reusable modules, with default exports reserved for route-facing entries
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

1. Run `npx react-frontend-standard init .`, adding `--with-skill` and `--with-hooks` when agent support and automatic sync are wanted.
2. Define initial `features` from backend domains or stable user use cases.
3. Add thin route-entry `screens`.
4. Adjust local docs for project-specific commands and exceptions.

### Existing repository

1. Inspect current route entrypoints and domain folders.
2. Map code into `screens`, `features`, and shared `components`.
3. Move raw transport logic into feature `<Feature>.api.ts`, `<Feature>.service.ts`, and feature hooks where helpful.
4. Run `npx react-frontend-standard sync .` when a manifest exists, then document intentional exceptions before large refactors.

## Core Rules

- `screens` are route-entry components only.
- `features` are the ownership center.
- feature-root role files use `<Feature>.<role>.ts`, not role-only names such as `api.ts`, `schema.ts`, `type.ts`, or `types.ts`.
- `components` are shared generic UI primitives.
- reusable modules use named exports; route files and screens may use default exports.
- `widgets` are optional and only introduced for repeated, meaningful, cross-feature UI blocks.

## Source

This package was derived from the working standards used in the surrounding project and generalized for reuse.
