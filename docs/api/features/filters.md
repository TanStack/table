---
title: Filters
id: filters
---

## Can-Filter

The ability for a column to be **column** filtered is determined by the following:

- The column was defined with a valid `accessorKey`/`accessorFn`.
- `column.enableColumnFilter` is not set to `false`
- `options.enableColumnFilters` is not set to `false`
- `options.enableFilters` is not set to `false`

The ability for a column to be **globally** filtered is determined by the following:

- The column was defined a valid `accessorKey`/`accessorFn`.
- If provided, `options.getColumnCanGlobalFilter` returns `true` for the given column. If it is not provided, the column is assumed to be globally filterable.
- `column.enableColumnFilter` is not set to `false`
- `options.enableColumnFilters` is not set to `false`
- `options.enableFilters` is not set to `false`

## State

Filter state is stored on the table using the following shape:

```tsx
export type FiltersTableState = {
  columnFilters: ColumnFiltersState
  globalFilter: any
}

export type ColumnFiltersState = ColumnFilter[]

export type ColumnFilter = {
  id: string
  value: unknown
}
```

## Filter Functions

The following filter functions are built-in to the table core:

- `includesString`
  - Case-insensitive string inclusion
- `includesStringSensitive`
  - Case-sensitive string inclusion
- `equalsString`
  - Case-insensitive string equality
- `equalsStringSensitive`
  - Case-sensitive string equality
- `arrIncludes`
  - Item inclusion within an array
- `arrIncludesAll`
  - All items included in an array
- `arrIncludesSome`
  - Some items included in an array
- `equals`
  - Object/referential equality `Object.is`/`===`
- `weakEquals`
  - Weak object/referential equality `==`
- `inNumberRange`
  - Number range inclusion

Every filter function receives:

- The row to filter
- The columnId to use to retrieve the row's value
- The filter value

and should return `true` if the row should be included in the filtered rows, and `false` if it should be removed.

This is the type signature for every filter function:

```tsx
export type FilterFn<TData extends AnyData> = {
  (
    row: Row<TData>,
    columnId: string,
    filterValue: any,
    addMeta: (meta: any) => void
  ): boolean
  resolveFilterValue?: TransformFilterValueFn<TData>
  autoRemove?: ColumnFilterAutoRemoveTestFn<TData>
  addMeta?: (meta?: any) => void
}

export type TransformFilterValueFn<TData extends AnyData> = (
  value: any,
  column?: Column<TData>
) => unknown

export type ColumnFilterAutoRemoveTestFn<TData extends AnyData> = (
  value: any,
  column?: Column<TData>
) => boolean

export type CustomFilterFns<TData extends AnyData> = Record<
  string,
  FilterFn<TData>
>
```

### `filterFn.resolveFilterValue`

This optional "hanging" method on any given `filterFn` allows the filter function to transform/sanitize/format the filter value before it is passed to the filter function.

### `filterFn.autoRemove`

This optional "hanging" method on any given `filterFn` is passed a filter value and expected to return `true` if the filter value should be removed from the filter state. eg. Some boolean-style filters may want to remove the filter value from the table state if the filter value is set to `false`.

#### Using Filter Functions

Filter functions can be used/referenced/defined by passing the following to `columnDefinition.filterFn` or `options.globalFilterFn`:

- A `string` that references a built-in filter function
- A function directly provided to the `columnDefinition.filterFn` option

The final list of filter functions available for the `columnDef.filterFn` and ``tableOptions.globalFilterFn` options use the following type:

```tsx
export type FilterFnOption<TData extends AnyData> =
  | 'auto'
  | BuiltInFilterFn
  | FilterFn<TData>
```

#### Filter Meta

Filtering data can often expose additional information about the data that can be used to aid other future operations on the same data. A good exmaple of this concept is a ranking-system like that of [`match-sorter`](https://github.com/kentcdodds/match-sorter) that simutaneously ranks, filters and sorts data. While utilities like `match-sorter` make a lot of sense for single-dimensional filter+sort tasks, the decoupled filtering/sorting architecture of building a table makes them very difficult and unperformant to use.

To make a ranking/filtering/sorting system work with tables, `filterFn`s can optionally mark results with a **filter meta** value that can be used later to sort/group/etc the data to your liking. This is done by calling the `addMeta` function supplied to your custom `filterFn`.

Below is an example using our own `match-sorter-utils` package (a utility fork of `match-sorter`) to rank, filter, and sort the data

```tsx
import { sortingFns } from '@tanstack/react-table'

import { rankItem, compareItems } from '@tanstack/match-sorter-utils'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the ranking info
  addMeta(itemRank)

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]!,
      rowB.columnFiltersMeta[columnId]!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

## Column Def Options

### `filterFn`

```tsx
filterFn?: FilterFn | keyof BuiltInFilterFns
```

The filter function to use with this column.

Options:

- A `string` referencing a [built-in filter function](#filter-functions))
- A [custom filter function](#filter-functions)

### `enableColumnFilter`

```tsx
enableColumnFilter?: boolean
```

Enables/disables the **column** filter for this column. For option priority, see [Can-Filter Option Priority](../guide/filters#can-filter).

### `enableGlobalFilter`

```tsx
enableGlobalFilter?: boolean
```

Enables/disables the **global** filter for this column. For option priority, see [Can-Filter Option Priority](../guide/filters#can-filter).

## Column API

### `getCanFilter`

```tsx
getCanFilter: () => boolean
```

Returns whether or not the column can be **column** filtered.

### `getCanGlobalFilter`

```tsx
getCanGlobalFilter: () => boolean
```

Returns whether or not the column can be **globally** filtered.

### `getFilterIndex`

```tsx
getFilterIndex: () => number
```

Returns the index (including `-1`) of the column filter in the table's `state.columnFilters` array.

### `getIsFiltered`

```tsx
getIsFiltered: () => boolean
```

Returns whether or not the column is currently filtered.

### `getFilterValue`

```tsx
getFilterValue: () => unknown
```

Returns the current filter value of the column.

### `setFilterValue`

```tsx
setFilterValue: (updater: Updater<any>) => void
```

A function that sets the current filter value for the column. You can pass it a value or an updater function for immutability-safe operations on existing values.

### `getAutoFilterFn`

```tsx
getAutoFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

Returns an automatically calculated filter function for the column based off of the columns first known value.

### `getFilterFn`

```tsx
getFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

Returns the filter function (either user-defined or automatic, depending on configuration) for the columnId specified.

### `getFacetedRowModel`

```tsx
type getFacetedRowModel = () => RowModel<TData>
```

> ⚠️ Requires that you pass a valid `getFacetedRowModel` function to `options.facetedRowModel`. A default implementation is provided via the exported `getFacetedRowModel` function.

Returns the row model with all other column filters applied, excluding its own filter. Useful for displaying faceted result counts.

### `getFacetedUniqueValues`

```tsx
getFacetedUniqueValues: () => Map<any, number>
```

> ⚠️ Requires that you pass a valid `getFacetedUniqueValues` function to `options.getFacetedUniqueValues`. A default implementation is provided via the exported `getFacetedUniqueValues` function.

A function that **computes and returns** a `Map` of unique values and their occurences derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.

### `getFacetedMinMaxValues`

```tsx
getFacetedMinMaxValues: () => Map<any, number>
```

> ⚠️ Requires that you pass a valid `getFacetedMinMaxValues` function to `options.getFacetedMinMaxValues`. A default implementation is provided via the exported `getFacetedMinMaxValues` function.

A function that **computes and returns** a min/max tuple derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.

## Row API

### `columnFilters`

```tsx
columnFilters: Record<string, boolean>
```

The column filters map for the row. This object tracks whether a row is passing/failing specific filters by their column ID.

### `columnFiltersMeta`

```tsx
columnFiltersMeta: Record<string, any>
```

The column filters meta map for the row. This object tracks any filter meta for a row as optionally provided during the filtering process.

## Table Options

### `filterFromLeafRows`

```tsx
filterFromLeafRows?: boolean
```

By default, filtering is done from parent rows down (so if a parent row is filtered out, all of its children will be filtered out as well). Setting this option to `true` will cause filtering to be done from leaf rows up (which means parent rows will be included so long as one of their child or grand-child rows is also included).

### `enableFilters`

```tsx
enableFilters?: boolean
```

Enables/disables all filters for the table. For option priority, see [Can-Filter Option Priority](../guide/filters#can-filter).

### `manualFiltering`

```tsx
manualFiltering?: boolean
```

Disables the `getFilteredRowModel` from being used to filter data. This may be useful if your table needs to dynamically support both client-side and server-side filtering.

### `onColumnFiltersChange`

```tsx
onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
```

If provided, this function will be called with an `updaterFn` when `state.columnFilters` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

### `enableColumnFilters`

```tsx
enableColumnFilters?: boolean
```

Enables/disables **all** column filters for the table. For option priority, see [Can-Filter Option Priority](../guide/filters#can-filter).

### `getFilteredRowModel`

```tsx
getFilteredRowModel?: (
  table: Table<TData>
) => () => RowModel<TData>
```

If provided, this function is called **once** per table and should return a **new function** which will calculate and return the row model for the table when it's filtered.

- For server-side filtering, this function is unnecessary and can be ignored since the server should already return the filtered row model.
- For client-side filtering, this function is required. A default implementation is provided via any table adapter's `{ getFilteredRowModel }` export.

Example:

```tsx
import { getFilteredRowModel } from '@tanstack/[adapter]-table'


  getFilteredRowModel: getFilteredRowModel(),
})
```

### `getColumnFacetedRowModel`

```tsx
getColumnFacetedRowModel: (columnId: string) => RowModel<TData>
```

Returns the faceted row model for a given columnId.

### `globalFilterFn`

```tsx
globalFilterFn?: FilterFn | keyof BuiltInFilterFns
```

The filter function to use for global filtering.

Options:

- A `string` referencing a [built-in filter function](#filter-functions))
- A [custom filter function](#filter-functions)

### `onGlobalFilterChange`

```tsx
onGlobalFilterChange?: OnChangeFn<GlobalFilterState>
```

If provided, this function will be called with an `updaterFn` when `state.globalFilter` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

### `enableGlobalFilter`

```tsx
enableGlobalFilter?: boolean
```

Enables/disables the global filter for the table. For option priority, see [Can-Filter Option Priority](../guide/filters#can-filter).

### `getColumnCanGlobalFilter`

```tsx
getColumnCanGlobalFilter?: (column: Column<TData>) => boolean
```

If provided, this function will be called with the column and should return `true` or `false` to indicate whether this column should be used for global filtering.

## Table API API

### `setColumnFilters`

```tsx
setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
```

Sets or updates the `state.columnFilters` state.

### `resetColumnFilters`

```tsx
resetColumnFilters: (defaultState?: boolean) => void
```

Resets the **columnFilters** state to `initialState.columnFilters`, or `true` can be passed to force a default blank state reset to `[]`.

### `getPreFilteredRowModel`

```tsx
getPreFilteredRowModel: () => RowModel<TData>
```

Returns the row model for the table before any **column** filtering has been applied.

### `getFilteredRowModel`

```tsx
getFilteredRowModel: () => RowModel<TData>
```

Returns the row model for the table after **column** filtering has been applied.

### `setGlobalFilter`

```tsx
setGlobalFilter: (updater: Updater<any>) => void
```

Sets or updates the `state.globalFilter` state.

### `resetGlobalFilter`

```tsx
resetGlobalFilter: (defaultState?: boolean) => void
```

Resets the **globalFilter** state to `initialState.globalFilter`, or `true` can be passed to force a default blank state reset to `undefined`.

### `getGlobalAutoFilterFn`

```tsx
getGlobalAutoFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

Currently, this function returns the built-in `includesString` filter function. In future releases, it may return more dynamic filter functions based on the nature of the data provided.

### `getGlobalFilterFn`

```tsx
getGlobalFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

Returns the global filter function (either user-defined or automatic, depending on configuration) for the table.

### `getGlobalFacetedRowModel`

```tsx
getGlobalFacetedRowModel: () => RowModel<TData>
```

Returns the faceted row model for the global filter.

### `getGlobalFacetedUniqueValues`

```tsx
getGlobalFacetedUniqueValues: () => Map<any, number>
```

Returns the faceted unique values for the global filter.

### `getGlobalFacetedMinMaxValues`

```tsx
getGlobalFacetedMinMaxValues: () => [number, number]
```

Returns the faceted min and max values for the global filter.
