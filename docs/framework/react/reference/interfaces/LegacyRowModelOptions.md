---
id: LegacyRowModelOptions
title: LegacyRowModelOptions
---

# Interface: LegacyRowModelOptions\<TData\>

Defined in: [useLegacyTable.ts:184](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L184)

Legacy v8-style row model options

## Type Parameters

### TData

`TData` *extends* `RowData`

## Properties

### ~~getCoreRowModel?~~

```ts
optional getCoreRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:189](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L189)

Returns the core row model for the table.

#### Deprecated

This option is no longer needed in v9. The core row model is always created automatically.

***

### ~~getExpandedRowModel?~~

```ts
optional getExpandedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:209](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L209)

Returns the expanded row model for the table.

#### Deprecated

Use `_rowModels.expandedRowModel` with `createExpandedRowModel()` instead.

***

### ~~getFacetedMinMaxValues?~~

```ts
optional getFacetedMinMaxValues: FacetedMinMaxValuesFactory<TData>;
```

Defined in: [useLegacyTable.ts:224](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L224)

Returns the faceted min/max values for a column.

#### Deprecated

Use `_rowModels.facetedMinMaxValues` with `createFacetedMinMaxValues()` instead.

***

### ~~getFacetedRowModel?~~

```ts
optional getFacetedRowModel: FacetedRowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:219](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L219)

Returns the faceted row model for a column.

#### Deprecated

Use `_rowModels.facetedRowModel` with `createFacetedRowModel()` instead.

***

### ~~getFacetedUniqueValues?~~

```ts
optional getFacetedUniqueValues: FacetedUniqueValuesFactory<TData>;
```

Defined in: [useLegacyTable.ts:229](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L229)

Returns the faceted unique values for a column.

#### Deprecated

Use `_rowModels.facetedUniqueValues` with `createFacetedUniqueValues()` instead.

***

### ~~getFilteredRowModel?~~

```ts
optional getFilteredRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:194](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L194)

Returns the filtered row model for the table.

#### Deprecated

Use `_rowModels.filteredRowModel` with `createFilteredRowModel(filterFns)` instead.

***

### ~~getGroupedRowModel?~~

```ts
optional getGroupedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:214](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L214)

Returns the grouped row model for the table.

#### Deprecated

Use `_rowModels.groupedRowModel` with `createGroupedRowModel(aggregationFns)` instead.

***

### ~~getPaginationRowModel?~~

```ts
optional getPaginationRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:204](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L204)

Returns the paginated row model for the table.

#### Deprecated

Use `_rowModels.paginatedRowModel` with `createPaginatedRowModel()` instead.

***

### ~~getSortedRowModel?~~

```ts
optional getSortedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:199](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L199)

Returns the sorted row model for the table.

#### Deprecated

Use `_rowModels.sortedRowModel` with `createSortedRowModel(sortFns)` instead.
