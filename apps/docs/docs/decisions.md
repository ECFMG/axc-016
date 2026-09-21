---
id: decisions
title: Decision records
---

# ADR: Azure Functions hosts the API

Status: accepted

`apps/api` is a thin composition root on `@cellix/api-core`. The process that serves HTTP is the Azure Functions host. Hono owns routing only, behind `@marplex/hono-azurefunc-adapter`. The host is not a standalone Hono server.

The first contract is `GET /health`, which returns HTTP 200:

```json
{
  "status": "ok",
  "service": "agentCourses-api",
  "projectCode": "axc",
  "environment": "local",
  "timestamp": "2026-09-21T15:04:05.000Z"
}
```

`environment` is `local`, `test`, or `production`. `pnpm run dev` and `pnpm run start` use `local`. `timestamp` is an ISO-8601 string.

Later MADR and SRTM records belong in this docs site. Domain, persistence, and Mongoose packages stay extension points until a feature needs them.
