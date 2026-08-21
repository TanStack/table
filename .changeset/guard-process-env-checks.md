---
'@tanstack/table-core': patch
---

Guard the `process` global before reading `process.env.NODE_ENV` in development-only debug and validation checks. Raw `process.env.NODE_ENV` reads survived unguarded into the published ESM build, so any environment without a `process` global (e.g. vanilla JS loaded via an import map, or another bundler-less setup) threw `ReferenceError: process is not defined` the first time one of these checks ran. All ~14 call sites now go through a shared `isDevelopmentEnv()` helper that checks `typeof process !== 'undefined'` first.
