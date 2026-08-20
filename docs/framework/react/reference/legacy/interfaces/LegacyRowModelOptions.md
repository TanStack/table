---
id: LegacyRowModelOptions
title: LegacyRowModelOptions
---

# Interface: LegacyRowModelOptions\<TData\>

Defined in: [react-table/src/useLegacyTable.ts:208](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L208)

Legacy v8-style row model options

## Type Parameters

### TData

`TData` *extends* `RowData`

## Properties

### ~~aggregationFns?~~

```ts
optional aggregationFns: AggregationFns;
```

Defined in: [react-table/src/useLegacyTable.ts:268](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L268)

Additional aggregation functions to apply to the table.

#### Deprecated

Use `rowAggregationFeature` with the `aggregationFns` slot instead. Add `columnGroupingFeature` and `groupedRowModel` only when grouping rows.

***

### ~~filterFns?~~

```ts
optional filterFns: FilterFns;
```

Defined in: [react-table/src/useLegacyTable.ts:258](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L258)

Additional filter functions to apply to the table.

#### Deprecated

Use the `filteredRowModel`/`filterFns` slots on the `features` option with `createFilteredRowModel()` instead.

***

### ~~getCoreRowModel?~~

```ts
optional getCoreRowModel: RowModelFactory<TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:213](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L213)

Returns the core row model for the table.

#### Deprecated

This option is no longer needed in v9. The core row model is always created automatically.

***

### ~~getExpandedRowModel?~~

```ts
optional getExpandedRowModel: RowModelFactory<TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:233](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L233)

Returns the expanded row model for the table.

#### Deprecated

Use the `expandedRowModel` slot on the `features` option with `createExpandedRowModel()` instead.

***

### ~~getFacetedMinMaxValues?~~

```ts
optional getFacetedMinMaxValues: FacetedMinMaxValuesFactory<TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:248](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L248)

Returns the faceted min/max values for a column.

#### Deprecated

Use the `facetedMinMaxValues` slot on the `features` option with `createFacetedMinMaxValues()` instead.

***

### ~~getFacetedRowModel?~~

```ts
optional getFacetedRowModel: FacetedRowModelFactory<TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:243](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L243)

Returns the faceted row model for a column.

#### Deprecated

Use the `facetedRowModel` slot on the `features` option with `createFacetedRowModel()` instead.

***

### ~~getFacetedUniqueValues?~~

```ts
optional getFacetedUniqueValues: FacetedUniqueValuesFactory<TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:253](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L253)

Returns the faceted unique values for a column.

#### Deprecated

Use the `facetedUniqueValues` slot on the `features` option with `createFacetedUniqueValues()` instead.

***

### ~~getFilteredRowModel?~~

```ts
optional getFilteredRowModel: RowModelFactory<TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:218](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L218)

Returns the filtered row model for the table.

#### Deprecated

Use the `filteredRowModel`/`filterFns` slots on the `features` option with `createFilteredRowModel()` instead.

***

### ~~getGroupedRowModel?~~

```ts
optional getGroupedRowModel: RowModelFactory<TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:238](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L238)

Returns the grouped row model for the table.

#### Deprecated

Use `columnGroupingFeature` with the `groupedRowModel` slot and `createGroupedRowModel()` instead. Add `rowAggregationFeature` separately when grouped rows aggregate values.

***

### ~~getPaginationRowModel?~~

```ts
optional getPaginationRowModel: RowModelFactory<TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:228](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L228)

Returns the paginated row model for the table.

#### Deprecated

Use the `paginatedRowModel` slot on the `features` option with `createPaginatedRowModel()` instead.

***

### ~~getSortedRowModel?~~

```ts
optional getSortedRowModel: RowModelFactory<TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:223](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L223)

Returns the sorted row model for the table.

#### Deprecated

Use the `sortedRowModel`/`sortFns` slots on the `features` option with `createSortedRowModel()` instead.

***

### ~~sortFns?~~

```ts
optional sortFns: SortFns;
```

Defined in: [react-table/src/useLegacyTable.ts:263](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L263)

Additional sort functions to apply to the table.

#### Deprecated

Use the `sortedRowModel`/`sortFns` slots on the `features` option with `createSortedRowModel()` instead.
