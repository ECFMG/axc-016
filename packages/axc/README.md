# @axc workspace

agentCourses application code lives in this folder. `@apps/api` is the composition root and is the only place that wires infrastructure into `@axc/rest`.

| Package | Role |
| --- | --- |
| `@axc/domain` | Domain extension point. It must not import REST, Hono, Azure Functions, Mongoose, persistence implementations, or composition code. |
| `@axc/application-services` | Use cases. The health payload is built here. |
| `@axc/rest` | Hono routes. Dependencies are injected by `@apps/api`. |
| `@axc/persistence` | Persistence-port extension point. No Mongoose schemas yet. |
| `@axc/service-mongoose` | Re-exports `@cellix/mongoose-seedwork` and the `ServiceBase` contract for a future Mongoose infrastructure service. |

Framework packages under `packages/cellix` stay reusable. Do not copy their behavior into `@axc`.
