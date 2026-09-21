# agentCourses (axc)

agentCourses is a dark software factory scaffold. Coding agents build functionality in isolated git worktrees, and every output passes automated quality, architecture, security, and BDD gates. The project exists to measure how harness engineering, agentic coding harnesses, and model selection affect software quality and delivery efficiency.

The organization slug is `agentcourses`. The project code is `axc`. Package names stay `@apps/*`, `@axc/*`, `@axc-verification/*`, and `@cellix/*`.

## Health contract

`GET /health` returns HTTP 200:

```json
{
  "status": "ok",
  "service": "agentCourses-api",
  "projectCode": "axc",
  "environment": "local",
  "timestamp": "2026-09-21T15:04:05.000Z"
}
```

- `status` is `ok`.
- `service` is `agentCourses-api`.
- `projectCode` is `axc`.
- `environment` is `local`, `test`, or `production`, and it matches the running mode. `pnpm run dev` and `pnpm run start` use `local`. Acceptance tests use `test`. `NODE_ENV=production` without an explicit mode uses `production`.
- `timestamp` is an ISO-8601 string produced by the server clock. The value above shows the shape only.

The same contract is implemented by the API, this README, the docs site, and the Serenity feature.

## Requirements

- Node.js 24 (see `.nvmrc`)
- pnpm 11. npm and yarn are not used, and dependency lifecycle scripts are not approved.
- A local JRE for the Serenity BDD HTML report
- The Snyk CLI on `PATH` when a real scan should run

## Commands

All of these go through Turborepo:

| Command | What it does |
| --- | --- |
| `pnpm run dev` | Builds the API, then starts the Azure Functions host through portless. The public hostname is `api.agentcourses.<worktree>.localhost`, where `<worktree>` comes from `WORKTREE_NAME` or the directory name. `GET /health` is served by `func start` on the Rolldown bundle. |
| `pnpm run test` | Unit tests plus the Serenity/Cucumber healthcheck acceptance test and HTML report. |
| `pnpm run verify` | Dependency script policy, Biome, TypeScript compilation, knip, `@e18e/cli`, architecture tests, unit tests, Serenity acceptance, `pnpm audit`, and a local Snyk attempt. |
| `pnpm run build` | Rolldown-bundles the API and writes `apps/api/build/agentCourses-api.zip` for Azure Functions run-from-package. `host.json` clears the `/api` prefix so the route is `/health`. |
| `pnpm run start` | Starts the built bundle with the Azure Functions host (`func start --script-root deploy/`). Environment is `local`. The port is `PORT` or 7071. |

Parallel git worktrees each get their own portless hostname. Set `WORKTREE_NAME` when the directory name is not the worktree label you want.

## Gates

Husky and lint-staged run the same checks on commit for feedback: dependency script policy, Biome, TypeScript compilation, knip, `@e18e/cli`, architecture tests, Serenity acceptance, `pnpm audit`, and Snyk. `pnpm run verify` and the GitHub Actions workflow are the enforcement boundary. CI runs `pnpm install --frozen-lockfile` and `pnpm run verify`.

Snyk is the local CLI only (`snyk test` and `snyk code test`). The organization passed to Snyk is `agentcourses`. The scaffold does not upload scan results and does not pass a remote repository location. Open-source findings fail the gate. When code scanning is unavailable for this organization, verify prints `Snyk: SKIPPED NON-BLOCKING: credentials unavailable (ERROR   Snyk Code is not enabled (SNYK-CODE-0005))` and continues. A scan that reports vulnerabilities fails the gate.

Dependency install scripts are not approved. Local and test MongoDB, when added, must use `mongodb-memory-server-core` rather than the package that downloads a binary during install. Deployed persistence uses Mongoose.

## Layout

- `apps/api` is a thin composition root. It calls `@cellix/api-core` to register one Azure Functions HTTP handler. Hono routing stays inside `@axc/rest` behind the Azure Functions adapter.
- `apps/docs` is the Docusaurus site for the health contract and later MADR/SRTM records.
- `packages/cellix/*` are the ported Cellix framework packages.
- `packages/axc/*` are the application layers. See `packages/axc/README.md`.
- `packages/axc-verification/acceptance-api` calls `GET /health` over HTTP against the Azure Functions host that loads the same composition root.
- `packages/axc-verification/archunit-tests` checks the layering rules with `@cellix/archunit-tests`.

## Agent tooling

Committed skills: Turborepo, portless, Serenity/JS, and BothyBoard (`.agents/skills`). MCP clients are `@e18e/mcp` and `https://bothyboard.com/api/mcp` in `.grok/config.toml`. BothyBoard needs a project-scoped personal access token before tasks can be planted.
