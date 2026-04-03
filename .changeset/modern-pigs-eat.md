---
'@tanstack/angular-table': patch
---

fix conditional flexRenderComponent rendering

Solve a rendering issue with flexRenderDirective that doesn't re-render component while using conditional `flexRenderComponent` in the same cell column configuration (same cell reference in template, so it's a case where you are not updating table state but relies on external data outside of table scope)
