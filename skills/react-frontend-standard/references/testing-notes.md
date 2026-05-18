# Testing Notes

Use these notes to decide where tests belong when applying the standard.

## Test Placement

| Subject | Preferred test location | What to verify |
|---|---|---|
| feature utilities | next to the feature file | parsing, formatting, normalization, edge cases |
| feature services | next to the feature file | mapping, orchestration, multi-call behavior |
| query helpers | next to the feature file | query keys, normalized params, option behavior |
| API routes or transport boundaries | next to the route or boundary file | validation, error status, response shape |
| browser-only stores | next to the store file | unavailable runtime, persistence, subscription behavior |
| shared utilities | next to the utility file | pure behavior and boundary cases |
| end-to-end flows | `e2e/` or project test directory | user-visible flows across routing, network, and persistence |

## Testing Principles

- Test logic at the layer that owns it.
- Prefer unit tests for pure mapping and boundary code.
- Use integration or route tests when request validation and response mapping matter together.
- Use end-to-end tests for behavior that only becomes meaningful across screens, browser state, and navigation.
- Keep tests independent from storage and network backends by using controlled test doubles where practical.

## Verification Checklist

Before claiming a structural alignment is done, run the repository's available checks. Common commands include:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Use the commands that actually exist in the target project's `package.json`.
