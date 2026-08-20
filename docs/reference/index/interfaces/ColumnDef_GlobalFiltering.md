---
id: ColumnDef_GlobalFiltering
title: ColumnDef_GlobalFiltering
---

# Interface: ColumnDef\_GlobalFiltering

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L18)

## Properties

### enableGlobalFilter?

```ts
optional enableGlobalFilter: boolean;
```

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L25)

Allows this column to be scanned by global filtering.

Defaults to `true`; table-level global filtering and `enableFilters` must
also allow filtering.
