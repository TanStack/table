---
id: Row_ColumnFiltering
title: Row_ColumnFiltering
---

# Interface: Row\_ColumnFiltering\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:166](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L166)

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

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:173](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L173)

The column filters map for the row. This object tracks whether a row is passing/failing specific filters by their column ID.

***

### columnFiltersMeta

```ts
columnFiltersMeta: Record<string, ExtractFilterMeta<TFeatures>>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:177](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L177)

The column filters meta map for the row. This object tracks any filter meta for a row as optionally provided during the filtering process.
