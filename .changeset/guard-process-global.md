---
'@tanstack/table-core': patch
---

Guard the dev-only `process.env.NODE_ENV` checks with `typeof process !== 'undefined'` so the published ESM build runs in environments without a `process` global, such as browsers loading the package through an import map.
