---
id: LegacyRowModelOptions
title: LegacyRowModelOptions
---

# Interface: LegacyRowModelOptions\<TData\>

Defined in: [useLegacyTable.ts:194](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L194)

Legacy v8-style row model options

## Type Parameters

### TData

`TData` *extends* `RowData`

## Properties

### ~~aggregationFns?~~

```ts
optional aggregationFns: AggregationFns;
```

Defined in: [useLegacyTable.ts:254](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L254)

Additional aggregation functions to apply to the table.

#### Deprecated

Use the `groupedRowModel`/`aggregationFns` slots on the `features` option with `createGroupedRowModel()` instead.

***

### ~~filterFns?~~

```ts
optional filterFns: FilterFns;
```

Defined in: [useLegacyTable.ts:244](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L244)

Additional filter functions to apply to the table.

#### Deprecated

Use the `filteredRowModel`/`filterFns` slots on the `features` option with `createFilteredRowModel()` instead.

***

### ~~getCoreRowModel?~~

```ts
optional getCoreRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:199](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L199)

Returns the core row model for the table.

#### Deprecated

This option is no longer needed in v9. The core row model is always created automatically.

***

### ~~getExpandedRowModel?~~

```ts
optional getExpandedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:219](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L219)

Returns the expanded row model for the table.

#### Deprecated

Use the `expandedRowModel` slot on the `features` option with `createExpandedRowModel()` instead.

***

### ~~getFacetedMinMaxValues?~~

```ts
optional getFacetedMinMaxValues: FacetedMinMaxValuesFactory<TData>;
```

Defined in: [useLegacyTable.ts:234](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L234)

Returns the faceted min/max values for a column.

#### Deprecated

Use the `facetedMinMaxValues` slot on the `features` option with `createFacetedMinMaxValues()` instead.

***

### ~~getFacetedRowModel?~~

```ts
optional getFacetedRowModel: FacetedRowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:229](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L229)

Returns the faceted row model for a column.

#### Deprecated

Use the `facetedRowModel` slot on the `features` option with `createFacetedRowModel()` instead.

***

### ~~getFacetedUniqueValues?~~

```ts
optional getFacetedUniqueValues: FacetedUniqueValuesFactory<TData>;
```

Defined in: [useLegacyTable.ts:239](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L239)

Returns the faceted unique values for a column.

#### Deprecated

Use the `facetedUniqueValues` slot on the `features` option with `createFacetedUniqueValues()` instead.

***

### ~~getFilteredRowModel?~~

```ts
optional getFilteredRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:204](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L204)

Returns the filtered row model for the table.

#### Deprecated

Use the `filteredRowModel`/`filterFns` slots on the `features` option with `createFilteredRowModel()` instead.

***

### ~~getGroupedRowModel?~~

```ts
optional getGroupedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:224](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L224)

Returns the grouped row model for the table.

#### Deprecated

Use the `groupedRowModel`/`aggregationFns` slots on the `features` option with `createGroupedRowModel()` instead.

***

### ~~getPaginationRowModel?~~

```ts
optional getPaginationRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:214](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L214)

Returns the paginated row model for the table.

#### Deprecated

Use the `paginatedRowModel` slot on the `features` option with `createPaginatedRowModel()` instead.

***

### ~~getSortedRowModel?~~

```ts
optional getSortedRowModel: RowModelFactory<TData>;
```

Defined in: [useLegacyTable.ts:209](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L209)

Returns the sorted row model for the table.

#### Deprecated

Use the `sortedRowModel`/`sortFns` slots on the `features` option with `createSortedRowModel()` instead.

***

### ~~sortFns?~~

```ts
optional sortFns: SortFns;
```

Defined in: [useLegacyTable.ts:249](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L249)

Additional sort functions to apply to the table.

#### Deprecated

Use the `sortedRowModel`/`sortFns` slots on the `features` option with `createSortedRowModel()` instead.
