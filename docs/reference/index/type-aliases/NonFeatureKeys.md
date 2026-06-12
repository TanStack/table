---
id: NonFeatureKeys
title: NonFeatureKeys
---

# Type Alias: NonFeatureKeys

```ts
type NonFeatureKeys = 
  | "aggregationFns"
  | "columnMeta"
  | "coreRowModel"
  | "expandedRowModel"
  | "facetedMinMaxValues"
  | "facetedRowModel"
  | "facetedUniqueValues"
  | "filterFns"
  | "filterMeta"
  | "filteredRowModel"
  | "groupedRowModel"
  | "paginatedRowModel"
  | "sortFns"
  | "sortedRowModel"
  | "tableMeta";
```

Defined in: [types/TableFeatures.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L39)

Keys of the `features` option that are not table features themselves.

These slots carry per-table types (`tableMeta`, `columnMeta`), row model
factories, and row model function registries. They are stripped from the
table's registered `_features` at runtime and excluded from feature-derived
options such as the generated `debug*` keys.
