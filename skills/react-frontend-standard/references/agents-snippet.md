# AGENTS.md Snippet

```md
## Shared React Frontend Standard

This repository uses the local `react-frontend-standard` skill as the reusable frontend standard.

## Read First

1. `README.md`, product specs, and project-specific docs when present
2. `.agents/skills/react-frontend-standard/SKILL.md` for the reusable frontend standard
3. `ARCHITECTURE.md` or `docs/coding-patterns.md` only when this project intentionally keeps local notes there

## How To Use The Standard

- Use the installed skill when bootstrapping, aligning structure, reviewing code placement, or refreshing frontend standards.
- Use local docs for project-specific facts: commands, package manager, routing setup, feature map, and intentional exceptions.
- If `.react-frontend-standard/manifest.json` exists, use `npx -y react-frontend-standard@latest check .` to check standard drift and `npx -y react-frontend-standard@latest sync .` to refresh the installed skill and managed assets safely. If either command reports `repair required`, use `npx -y react-frontend-standard@latest repair-hooks .` instead of a broad `sync --overwrite`.
- If local docs conflict with the reusable skill, treat local docs as project-specific exceptions.
- Before relying on project notes, verify that referenced files, commands, route entries, provider files, and feature folders still exist.

## Maintenance Rule

Keep this file short. Do not duplicate the reusable standard here; put durable standard guidance in the installed `react-frontend-standard` skill and project-specific exceptions in local docs.
```
