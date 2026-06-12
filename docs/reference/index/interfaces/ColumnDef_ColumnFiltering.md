---
id: ColumnDef_ColumnFiltering
title: ColumnDef_ColumnFiltering
---

# Interface: ColumnDef\_ColumnFiltering\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L112)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### enableColumnFilter?

```ts
optional enableColumnFilter: boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L122)

Enables this column to participate in column-specific filtering.

Defaults to `true`; table-level `enableColumnFilters` and `enableFilters`
must also allow filtering.

***

### filterFn?

```ts
optional filterFn: FilterFnOption<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L126)

The filter function to use with this column. Can be the name of a built-in filter function or a custom filter function.
