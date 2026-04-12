# react-frontend-standard

## Repository Purpose

This repository packages reusable React frontend standard assets for other repositories.
It includes a Node.js ESM CLI, downstream document templates, a reusable local skill,
rationale docs, and examples that help agents and maintainers apply the standard in
other projects.

This root `AGENTS.md` is the maintenance guide for **this repository**.
`templates/AGENTS.md` is a downstream template that gets copied into generated or
aligned projects and should not be treated as the same contract.

## Key Repository Surfaces

- `bin/`
  - CLI entrypoint and copy/install behavior.
  - `bin/react-frontend-standard.js` copies `templates/AGENTS.md`,
    `templates/ARCHITECTURE.md`, and `templates/coding-patterns.md` into target
    repositories, and can also install `skills/react-frontend-standard/`.
- `templates/`
  - Downstream source templates for generated project docs.
  - Changes here affect what target repositories receive.
- `skills/react-frontend-standard/`
  - Reusable local skill and reference material for applying this frontend standard
    in other repositories.
- `docs/`
  - Rationale and decision documents for the standard itself.
  - Use these as deeper sources of truth instead of duplicating their content here.
- `examples/`
  - Example repository shapes and adoption-oriented references.
- `README.md`
  - Top-level packaging, usage, and workflow overview.

## Maintenance Guidance

### Lower-risk changes

Treat edits in `README.md`, `docs/`, and `examples/` as relatively lower-risk only when
those edits do **not** directly change generated/copied outputs or their expected
behavior.

Typical lower-risk work:
- clarifying wording
- improving explanations
- tightening examples without changing repo contracts
- fixing references when the underlying contract is unchanged

### Contract-sensitive changes

Treat changes in `bin/`, `templates/`, and `skills/` as contract-sensitive.
These surfaces define or describe what downstream repositories receive and how the
local skill is installed.

Before accepting contract-sensitive changes, verify:
- copied destinations remain correct:
  - `AGENTS.md`
  - `ARCHITECTURE.md`
  - `docs/coding-patterns.md`
- target paths remain correct
- project install behavior remains correct:
  - `.agents/skills/react-frontend-standard`
- user-environment install behavior remains correct:
  - the resolved user skill path from the CLI logic
- cross-file consistency remains intact across `README.md`, `templates/`, `skills/`,
  and any affected examples or docs

## Working Rules For Agents

- Prefer orientation and reference over duplication.
- Do not restate the full architecture or coding-pattern guidance in this file.
- If you change template behavior or installation behavior, review every affected
  surface together instead of editing one file in isolation.
- Keep the root guide aligned with actual CLI behavior.
- Preserve the distinction between:
  - root `AGENTS.md` for this repository
  - `templates/AGENTS.md` for downstream repositories

## Go Deeper Here

- `README.md`
- `docs/philosophy.md`
- `docs/decisions.md`
- `templates/AGENTS.md`
- `templates/ARCHITECTURE.md`
- `templates/coding-patterns.md`
- `skills/react-frontend-standard/SKILL.md`
