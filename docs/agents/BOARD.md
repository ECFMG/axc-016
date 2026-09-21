# BothyBoard

Project: agentCourses (`prj_46f8cde01273cead`).

These cards are the scaffold breakdown. Paths below are the write roots each card owns.

| Card | Title | How it connects |
| --- | --- | --- |
| `tsk_5271fc1d343d1fa9` | Typecheck the shared TypeScript config package | `@cellix/config-typescript` is the TypeScript 6 base (`tsc`, no `tsgo`) used by every workspace package. |
| `tsk_98b19bc475453775` | Typecheck the shared TypeScript config package | Landed duplicate of the config package gate. |
| `tsk_2a68355286783f84` | Prove GET /health through the composed API | Acceptance and architecture tests call the Azure Functions host that loads `apps/api` through `@cellix/api-core`. |
| `tsk_b39b04c042d9833f` | Build the Azure Functions zip and serve it locally | `pnpm run build` writes `apps/api/build/agentCourses-api.zip`. `pnpm run start` serves that bundle with `func start`. |

`pnpm run dev` is the portless plus Azure Functions host for parallel git worktrees. `pnpm run verify` is the enforcement gate for the whole scaffold.
