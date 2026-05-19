---
id: TableOptions_ColumnFiltering
title: TableOptions_ColumnFiltering
---

# Interface: TableOptions\_ColumnFiltering\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:149](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L149)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### enableColumnFilters?

```ts
optional enableColumnFilters: boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:156](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L156)

Enables column-specific filtering for all columns that also allow it.

***

### enableFilters?

```ts
optional enableFilters: boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:162](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L162)

Enables all filtering features for the table.

Set this to `false` to disable both column filtering and global filtering.

***

### filterFromLeafRows?

```ts
optional filterFromLeafRows: boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:166](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L166)

By default, filtering is done from parent rows down (so if a parent row is filtered out, all of its children will be filtered out as well). Setting this option to `true` will cause filtering to be done from leaf rows up (which means parent rows will be included so long as one of their child or grand-child rows is also included).

***

### manualFiltering?

```ts
optional manualFiltering: boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:170](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L170)

Disables the `getFilteredRowModel` from being used to filter data. This may be useful if your table needs to dynamically support both client-side and server-side filtering.

***

### maxLeafRowFilterDepth?

```ts
optional maxLeafRowFilterDepth: number;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:176](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L176)

By default, filtering is done for all rows (max depth of 100), no matter if they are root level parent rows or the child leaf rows of a parent row. Setting this option to `0` will cause filtering to only be applied to the root level parent rows, with all sub-rows remaining unfiltered. Similarly, setting this option to `1` will cause filtering to only be applied to child leaf rows 1 level deep, and so on.

This is useful for situations where you want a row's entire child hierarchy to be visible regardless of the applied filter.

***

### onColumnFiltersChange?

```ts
optional onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:182](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L182)

Called with an updater when column filter state changes. Pair this with
`state.columnFilters` when using external state; external atoms can own the
slice without this callback.
