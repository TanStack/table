---
id: LegacyRowModelOptions
title: LegacyRowModelOptions
---

# Interface: LegacyRowModelOptions\<TData\>

Defined in: [useLegacyTable.ts:190](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L190)

Legacy v8-style row model options

## Type Parameters

### TData

`TData` *extends* `RowData`

## Properties

### ~~getCoreRowModel?~~

```ts
optional getCoreRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:195](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L195)

Returns the core row model for the table.

#### Deprecated

This option is no longer needed in v9. The core row model is always created automatically.

***

### ~~getExpandedRowModel?~~

```ts
optional getExpandedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:215](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L215)

Returns the expanded row model for the table.

#### Deprecated

Use `_rowModels.expandedRowModel` with `createExpandedRowModel()` instead.

***

### ~~getFacetedMinMaxValues?~~

```ts
optional getFacetedMinMaxValues: FacetedMinMaxValuesFactory<TData>;
```

Defined in: [useLegacyTable.ts:230](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L230)

Returns the faceted min/max values for a column.

#### Deprecated

Use `_rowModels.facetedMinMaxValues` with `createFacetedMinMaxValues()` instead.

***

### ~~getFacetedRowModel?~~

```ts
optional getFacetedRowModel: FacetedRowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:225](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L225)

Returns the faceted row model for a column.

#### Deprecated

Use `_rowModels.facetedRowModel` with `createFacetedRowModel()` instead.

***

### ~~getFacetedUniqueValues?~~

```ts
optional getFacetedUniqueValues: FacetedUniqueValuesFactory<TData>;
```

Defined in: [useLegacyTable.ts:235](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L235)

Returns the faceted unique values for a column.

#### Deprecated

Use `_rowModels.facetedUniqueValues` with `createFacetedUniqueValues()` instead.

***

### ~~getFilteredRowModel?~~

```ts
optional getFilteredRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:200](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L200)

Returns the filtered row model for the table.

#### Deprecated

Use `_rowModels.filteredRowModel` with `createFilteredRowModel(filterFns)` instead.

***

### ~~getGroupedRowModel?~~

```ts
optional getGroupedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:220](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L220)

Returns the grouped row model for the table.

#### Deprecated

Use `_rowModels.groupedRowModel` with `createGroupedRowModel(aggregationFns)` instead.

***

### ~~getPaginationRowModel?~~

```ts
optional getPaginationRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:210](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L210)

Returns the paginated row model for the table.

#### Deprecated

Use `_rowModels.paginatedRowModel` with `createPaginatedRowModel()` instead.

***

### ~~getSortedRowModel?~~

```ts
optional getSortedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:205](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L205)

Returns the sorted row model for the table.

#### Deprecated

Use `_rowModels.sortedRowModel` with `createSortedRowModel(sortFns)` instead.
