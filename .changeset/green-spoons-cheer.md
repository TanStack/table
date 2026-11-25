---
'@tanstack/table-core': patch
---

fix(table-core): guard `process.env` reads so the package works in bundler-less environments without a `process` global
