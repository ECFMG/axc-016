---
name: serenity-js
description: >
  Write and run Serenity/JS Cucumber acceptance tests for agentCourses.
  Use when editing packages/axc-verification/acceptance-api, Gherkin features,
  Screenplay tasks, or the Serenity HTML report.
---

# Serenity/JS

`pnpm dlx skills add serenity-js/serenity-js` found no SKILL.md in that repository. This project skill records the local convention.

- Acceptance tests live in `packages/axc-verification/acceptance-api`.
- Drive the API over HTTP against the process started from `@apps/api` (`dist/serve.js`). Do not construct `@axc/rest`, Hono, or application services inside the acceptance package.
- Use `@cellix/serenity-framework` (`ProcessTestServer`, `registerManagedSerenityWorld`, `SerenityCast`) with `@serenity-js/cucumber` and `@serenity-js/serenity-bdd`.
- Cucumber's stdout formatter is `serenity-formatter.cjs`, the CommonJS `@serenity-js/cucumber` listener. `src/serenity.ts` attaches `ArtifactArchiver` and `SerenityBDDReporter` to that stage. The ESM listener emits different event classes, and the reporter then records 0 tests.
- Generate the HTML report with the Serenity BDD CLI after Cucumber. Java is required. `scripts/serenity-html.mjs` fails unless `index.html` includes the passed `GET /health` scenario.
- The health scenario must assert `GET /health` returns status `ok`, service `agentCourses-api`, projectCode `axc`, the running environment, and an ISO-8601 timestamp.
