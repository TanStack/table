---
'@tanstack/vue-table': patch
---

Render nothing instead of an empty string in `flexRender`, so a cell whose value is `''` no longer causes a hydration mismatch under SSR.
