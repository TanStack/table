---
'@tanstack/table-core': patch
---

Guard process.env.NODE_ENV checks with typeof to prevent ReferenceError in non-bundled environments
