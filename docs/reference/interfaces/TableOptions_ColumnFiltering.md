---
id: TableOptions_ColumnFiltering
title: TableOptions_ColumnFiltering
---

# Interface: TableOptions\_ColumnFiltering\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L143)

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

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:150](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L150)

Enables/disables **column** filtering for all columns.

***

### enableFilters?

```ts
optional enableFilters: boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:154](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L154)

Enables/disables all filtering for the table.

***

### filterFromLeafRows?

```ts
optional filterFromLeafRows: boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:158](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L158)

By default, filtering is done from parent rows down (so if a parent row is filtered out, all of its children will be filtered out as well). Setting this option to `true` will cause filtering to be done from leaf rows up (which means parent rows will be included so long as one of their child or grand-child rows is also included).

***

### manualFiltering?

```ts
optional manualFiltering: boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:162](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L162)

Disables the `getFilteredRowModel` from being used to filter data. This may be useful if your table needs to dynamically support both client-side and server-side filtering.

***

### maxLeafRowFilterDepth?

```ts
optional maxLeafRowFilterDepth: number;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:168](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L168)

By default, filtering is done for all rows (max depth of 100), no matter if they are root level parent rows or the child leaf rows of a parent row. Setting this option to `0` will cause filtering to only be applied to the root level parent rows, with all sub-rows remaining unfiltered. Similarly, setting this option to `1` will cause filtering to only be applied to child leaf rows 1 level deep, and so on.

This is useful for situations where you want a row's entire child hierarchy to be visible regardless of the applied filter.

***

### onColumnFiltersChange?

```ts
optional onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:172](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L172)

If provided, this function will be called with an `updaterFn` when `state.columnFilters` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
