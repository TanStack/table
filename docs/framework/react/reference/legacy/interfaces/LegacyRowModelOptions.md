---
id: LegacyRowModelOptions
title: LegacyRowModelOptions
---

# Interface: LegacyRowModelOptions\<TData\>

Defined in: [useLegacyTable.ts:193](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L193)

Legacy v8-style row model options

## Type Parameters

### TData

`TData` *extends* `RowData`

## Properties

### ~~aggregationFns?~~

```ts
optional aggregationFns: AggregationFns;
```

Defined in: [useLegacyTable.ts:253](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L253)

Additional aggregation functions to apply to the table.

#### Deprecated

Use `_rowModels.groupedRowModel` with `createGroupedRowModel(aggregationFns)` instead.

***

### ~~filterFns?~~

```ts
optional filterFns: FilterFns;
```

Defined in: [useLegacyTable.ts:243](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L243)

Additional filter functions to apply to the table.

#### Deprecated

Use `_rowModels.filteredRowModel` with `createFilteredRowModel(filterFns)` instead.

***

### ~~getCoreRowModel?~~

```ts
optional getCoreRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:198](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L198)

Returns the core row model for the table.

#### Deprecated

This option is no longer needed in v9. The core row model is always created automatically.

***

### ~~getExpandedRowModel?~~

```ts
optional getExpandedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:218](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L218)

Returns the expanded row model for the table.

#### Deprecated

Use `_rowModels.expandedRowModel` with `createExpandedRowModel()` instead.

***

### ~~getFacetedMinMaxValues?~~

```ts
optional getFacetedMinMaxValues: FacetedMinMaxValuesFactory<TData>;
```

Defined in: [useLegacyTable.ts:233](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L233)

Returns the faceted min/max values for a column.

#### Deprecated

Use `_rowModels.facetedMinMaxValues` with `createFacetedMinMaxValues()` instead.

***

### ~~getFacetedRowModel?~~

```ts
optional getFacetedRowModel: FacetedRowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:228](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L228)

Returns the faceted row model for a column.

#### Deprecated

Use `_rowModels.facetedRowModel` with `createFacetedRowModel()` instead.

***

### ~~getFacetedUniqueValues?~~

```ts
optional getFacetedUniqueValues: FacetedUniqueValuesFactory<TData>;
```

Defined in: [useLegacyTable.ts:238](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L238)

Returns the faceted unique values for a column.

#### Deprecated

Use `_rowModels.facetedUniqueValues` with `createFacetedUniqueValues()` instead.

***

### ~~getFilteredRowModel?~~

```ts
optional getFilteredRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:203](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L203)

Returns the filtered row model for the table.

#### Deprecated

Use `_rowModels.filteredRowModel` with `createFilteredRowModel(filterFns)` instead.

***

### ~~getGroupedRowModel?~~

```ts
optional getGroupedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:223](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L223)

Returns the grouped row model for the table.

#### Deprecated

Use `_rowModels.groupedRowModel` with `createGroupedRowModel(aggregationFns)` instead.

***

### ~~getPaginationRowModel?~~

```ts
optional getPaginationRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:213](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L213)

Returns the paginated row model for the table.

#### Deprecated

Use `_rowModels.paginatedRowModel` with `createPaginatedRowModel()` instead.

***

### ~~getSortedRowModel?~~

```ts
optional getSortedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:208](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L208)

Returns the sorted row model for the table.

#### Deprecated

Use `_rowModels.sortedRowModel` with `createSortedRowModel(sortFns)` instead.

***

### ~~sortFns?~~

```ts
optional sortFns: SortFns;
```

Defined in: [useLegacyTable.ts:248](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L248)

Additional sort functions to apply to the table.

#### Deprecated

Use `_rowModels.sortedRowModel` with `createSortedRowModel(sortFns)` instead.
