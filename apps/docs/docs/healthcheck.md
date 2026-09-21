---
id: healthcheck
title: Healthcheck
slug: /
---

# GET /health

The API healthcheck is served by the Azure Functions host. `@apps/api` is the composition root: it initializes `@cellix/api-core`, then registers one HTTP function. That function adapts the Hono application from `@axc/rest` with `@marplex/hono-azurefunc-adapter`. The public path is `/health` (the Azure Functions `/api` prefix is cleared).

## Request

```http
GET /health
```

## Expected 200 response

```json
{
  "status": "ok",
  "service": "agentCourses-api",
  "projectCode": "axc",
  "environment": "local",
  "timestamp": "2026-09-21T15:04:05.000Z"
}
```

| Field | Value |
| --- | --- |
| `status` | `ok` |
| `service` | `agentCourses-api` |
| `projectCode` | `axc` |
| `environment` | `local`, `test`, or `production`, matching the running mode |
| `timestamp` | ISO-8601 string from the server clock |

`pnpm run dev` and `pnpm run start` use environment `local`. Acceptance tests set environment `test`. `NODE_ENV=production` without an explicit mode uses `production`.

The timestamp above is an example shape. A live response uses the current time, for example `2026-09-21T15:04:05.000Z`.
