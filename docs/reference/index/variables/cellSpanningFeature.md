---
id: cellSpanningFeature
title: cellSpanningFeature
---

# Variable: cellSpanningFeature

```ts
const cellSpanningFeature: TableFeature;
```

Defined in: [features/cell-spanning/cellSpanningFeature.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.ts#L18)

Feature that merges adjacent cells that share a value into row-spanning
cells, and lets a column def declare column-spanning cells per row.

Stateless: spans are always derived from the rows that are currently
rendered, so there is nothing to persist and nothing to configure beyond the
column defs.
