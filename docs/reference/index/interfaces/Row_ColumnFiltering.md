---
id: Row_ColumnFiltering
title: Row_ColumnFiltering
---

# Interface: Row\_ColumnFiltering\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L129)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### columnFilters

```ts
columnFilters: Record<string, boolean>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L136)

The column filters map for the row. This object tracks whether a row is passing/failing specific filters by their column ID.

***

### columnFiltersMeta

```ts
columnFiltersMeta: Record<string, FilterMeta>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L140)

The column filters meta map for the row. This object tracks any filter meta for a row as optionally provided during the filtering process.
