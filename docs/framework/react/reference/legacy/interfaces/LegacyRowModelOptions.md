---
id: LegacyRowModelOptions
title: LegacyRowModelOptions
---

# Interface: LegacyRowModelOptions\<TData\>

Defined in: [useLegacyTable.ts:191](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L191)

Legacy v8-style row model options

## Type Parameters

### TData

`TData` *extends* `RowData`

## Properties

### ~~getCoreRowModel?~~

```ts
optional getCoreRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:196](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L196)

Returns the core row model for the table.

#### Deprecated

This option is no longer needed in v9. The core row model is always created automatically.

***

### ~~getExpandedRowModel?~~

```ts
optional getExpandedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:216](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L216)

Returns the expanded row model for the table.

#### Deprecated

Use `_rowModels.expandedRowModel` with `createExpandedRowModel()` instead.

***

### ~~getFacetedMinMaxValues?~~

```ts
optional getFacetedMinMaxValues: FacetedMinMaxValuesFactory<TData>;
```

Defined in: [useLegacyTable.ts:231](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L231)

Returns the faceted min/max values for a column.

#### Deprecated

Use `_rowModels.facetedMinMaxValues` with `createFacetedMinMaxValues()` instead.

***

### ~~getFacetedRowModel?~~

```ts
optional getFacetedRowModel: FacetedRowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:226](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L226)

Returns the faceted row model for a column.

#### Deprecated

Use `_rowModels.facetedRowModel` with `createFacetedRowModel()` instead.

***

### ~~getFacetedUniqueValues?~~

```ts
optional getFacetedUniqueValues: FacetedUniqueValuesFactory<TData>;
```

Defined in: [useLegacyTable.ts:236](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L236)

Returns the faceted unique values for a column.

#### Deprecated

Use `_rowModels.facetedUniqueValues` with `createFacetedUniqueValues()` instead.

***

### ~~getFilteredRowModel?~~

```ts
optional getFilteredRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:201](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L201)

Returns the filtered row model for the table.

#### Deprecated

Use `_rowModels.filteredRowModel` with `createFilteredRowModel(filterFns)` instead.

***

### ~~getGroupedRowModel?~~

```ts
optional getGroupedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:221](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L221)

Returns the grouped row model for the table.

#### Deprecated

Use `_rowModels.groupedRowModel` with `createGroupedRowModel(aggregationFns)` instead.

***

### ~~getPaginationRowModel?~~

```ts
optional getPaginationRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:211](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L211)

Returns the paginated row model for the table.

#### Deprecated

Use `_rowModels.paginatedRowModel` with `createPaginatedRowModel()` instead.

***

### ~~getSortedRowModel?~~

```ts
optional getSortedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:206](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L206)

Returns the sorted row model for the table.

#### Deprecated

Use `_rowModels.sortedRowModel` with `createSortedRowModel(sortFns)` instead.
