---
id: Row_ColumnFiltering
title: Row_ColumnFiltering
---

# Interface: Row\_ColumnFiltering\<TFeatures, _TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:231](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L231)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### _TData

`_TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### columnFilters

```ts
columnFilters: Record<string, boolean>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:238](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L238)

The column filters map for the row. This object tracks whether a row is passing/failing specific filters by their column ID.

***

### columnFiltersMeta

```ts
columnFiltersMeta: Record<string, ExtractFilterMeta<TFeatures>>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:242](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L242)

The column filters meta map for the row. This object tracks any filter meta for a row as optionally provided during the filtering process.
