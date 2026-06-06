# Document Sync Checklist

Use this checklist before trusting, refreshing, or regenerating project docs.

## File Existence

- Every path mentioned in `AGENTS.md` exists or is intentionally described as optional.
- `ARCHITECTURE.md` and `docs/coding-patterns.md` exist only when optional docs were installed or the project intentionally keeps local notes there.
- Provider, route, screen, feature, and shared component paths named in docs match actual files.

## Command Accuracy

- Commands listed in docs exist in `package.json`.
- Package manager examples match the target project.
- Verification commands are project-specific and runnable.

## Structure Accuracy

- Route entry descriptions match the actual routing framework.
- Screen files listed in docs are still route-facing composition files.
- Feature names in docs match `src/features`.
- Feature-root role files use `<Feature>.<role>.ts`; role-only filenames such as `api.ts`, `schema.ts`, `type.ts`, and `types.ts` are renamed or documented as intentional local exceptions.
- Shared component paths in docs do not describe feature-owned UI as generic primitives.

## Standard Contract

- Generated `AGENTS.md` still points to the installed `react-frontend-standard` skill as the reusable standard source.
- Optional generated docs remain project note scaffolds, not a duplicate authoritative copy of the reusable standard.
- Project skill install still points to `.agents/skills/react-frontend-standard`.
- Version tracking still points to `.react-frontend-standard/manifest.json`.
- Optional SessionStart hooks still point to `.react-frontend-standard/hooks/session-start.mjs`.
- Local docs remain the source of truth for project-specific facts and intentional exceptions.
- Repository-only examples are not required to apply the standard after installation.

## Update Rule

When docs and code disagree, update the smallest affected local document. Do not keep outdated examples or copied text as authoritative.

When `sync` reports `skip modified: <path>`, preserve the local edits unless the project owner explicitly wants the generated version restored with `--overwrite`.
