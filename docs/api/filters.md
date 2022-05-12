---
name: Filters
route: /api/filtering
menu: API
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table Of Contents**

- [Examples](#examples)
- [Can-Filter](#can-filter)
- [State](#state)
- [Filter Functions](#filter-functions)
    - [`filterFn.resolveFilterValue`](#filterfnresolvefiltervalue)
    - [`filterFn.autoRemove`](#filterfnautoremove)
    - [Using Filter Functions](#using-filter-functions)
- [Column Definition Options](#column-definition-options)
    - [`filterFn`](#filterfn)
    - [`enableAllFilters`](#enableallfilters)
    - [`enableColumnFilter`](#enablecolumnfilter)
    - [`enableGlobalFilter`](#enableglobalfilter)
- [Column API](#column-api)
    - [`getCanColumnFilter`](#getcancolumnfilter)
    - [`getCanGlobalFilter`](#getcanglobalfilter)
    - [`getColumnFilterIndex`](#getcolumnfilterindex)
    - [`getColumnIsFiltered`](#getcolumnisfiltered)
    - [`getColumnFilterValue`](#getcolumnfiltervalue)
    - [`setColumnFilterValue`](#setcolumnfiltervalue)
    - [`getFacetedRowModel`](#getfacetedrowmodel)
    - [`getFacetedUniqueValues`](#getfaceteduniquevalues)
    - [`getFacetedMinMaxValues`](#getfacetedminmaxvalues)
- [Table Options](#table-options)
    - [`filterFromLeafRows`](#filterfromleafrows)
    - [`filterFns`](#filterfns)
    - [`enableFilters`](#enablefilters)
    - [`manualFiltering`](#manualfiltering)
    - [`onColumnFiltersChange`](#oncolumnfilterschange)
    - [`enableColumnFilters`](#enablecolumnfilters)
    - [`getFilteredRowModel`](#getfilteredrowmodel)
    - [`getColumnFacetedRowModel`](#getcolumnfacetedrowmodel)
    - [`globalFilterFn`](#globalfilterfn)
    - [`onGlobalFilterChange`](#onglobalfilterchange)
    - [`enableGlobalFilter`](#enableglobalfilter-1)
    - [`getColumnCanGlobalFilter`](#getcolumncanglobalfilter)
- [Table Instance API](#table-instance-api)
    - [`getColumnAutoFilterFn`](#getcolumnautofilterfn)
    - [`getColumnFilterFn`](#getcolumnfilterfn)
    - [`setColumnFilters`](#setcolumnfilters)
    - [`setColumnFilterValue`](#setcolumnfiltervalue-1)
    - [`resetColumnFilters`](#resetcolumnfilters)
    - [`getColumnCanColumnFilter`](#getcolumncancolumnfilter)
    - [`getColumnIsFiltered`](#getcolumnisfiltered-1)
    - [`getColumnFilterValue`](#getcolumnfiltervalue-1)
    - [`getColumnFilterIndex`](#getcolumnfilterindex-1)
    - [`getPreFilteredRowModel`](#getprefilteredrowmodel)
    - [`getFilteredRowModel`](#getfilteredrowmodel-1)
    - [`setGlobalFilter`](#setglobalfilter)
    - [`resetGlobalFilter`](#resetglobalfilter)
    - [`getGlobalAutoFilterFn`](#getglobalautofilterfn)
    - [`getGlobalFilterFn`](#getglobalfilterfn)
    - [`getColumnCanGlobalFilter`](#getcolumncanglobalfilter-1)
    - [`getGlobalFacetedRowModel`](#getglobalfacetedrowmodel)
    - [`getGlobalFacetedUniqueValues`](#getglobalfaceteduniquevalues)
    - [`getGlobalFacetedMinMaxValues`](#getglobalfacetedminmaxvalues)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Examples

Want to skip to the implementation? Check out these examples:

- [filters](../examples/filters) (includes faceting)
- [editable-data](../examples/editable-data)
- [expanding](../examples/expanding)
- [grouping](../examples/grouping)
- [pagination](../examples/pagination)
- [row-selection](../examples/row-selection)

Filters come in two flavors:

- Column filters
  - A filter that is applied to a single column's accessor value.
  - Stored in the `state.columnFilters` array as an object containing the columnId and the filter value.
- Global filters
  - A single filter value that is applied to all or some of columns' accessor values.
  - Stored in the `state.globalFilter` array as any value, usually a string.

## Can-Filter

The ability for a column to be **column** filtered is determined by the following:

- The column was defined with `createDataColumn` or a valid `accessorKey`/`accessorFn`.
- `column.enableColumnFilter` is not set to `false`
- `options.enableColumnFilters` is not set to `false`
- `options.enableFilters` is not set to `false`

The ability for a column to be **globally** filtered is determined by the following:

- The column was defined with `createDataColumn` or a valid `accessorKey`/`accessorFn`.
- If provided, `options.getColumnCanGlobalFilter` returns `true` for the given column. If it is not provided, the column is assumed to be globally filterable.
- `column.enableColumnFilter` is not set to `false`
- `options.enableColumnFilters` is not set to `false`
- `options.enableFilters` is not set to `false`

## State

Filter state is stored on the table instance using the following shape:

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
export type FilterFn<TGenerics extends TableGenerics> = {
  (row: Row<TGenerics>, columnId: string, filterValue: any): boolean
  resolveFilterValue?: TransformFilterValueFn<TGenerics>
  autoRemove?: ColumnFilterAutoRemoveTestFn<TGenerics>
}

export type TransformFilterValueFn<TGenerics extends TableGenerics> = (
  value: any,
  column?: Column<TGenerics>
) => unknown

export type ColumnFilterAutoRemoveTestFn<TGenerics extends TableGenerics> = (
  value: any,
  column?: Column<TGenerics>
) => boolean

export type CustomFilterFns<TGenerics extends TableGenerics> = Record<
  string,
  FilterFn<TGenerics>
>
```

#### `filterFn.resolveFilterValue`

This optional "hanging" method on any given `filterFn` allows the filter function to transform/sanitize/format the filter value before it is passed to the filter function.

#### `filterFn.autoRemove`

This optional "hanging" method on any given `filterFn` is passed a filter value and expected to return `true` if the filter value should be removed from the filter state. eg. Some boolean-style filters may want to remove the filter value from the table state if the filter value is set to `false`.

#### Using Filter Functions

Filter functions can be used/referenced/defined by passing the following to `columnDefinition.filterFn` or `options.globalFilterFn`:

- A `string` that references a built-in filter function
- A `string` that references a custom filter functions provided via the `tableOptions.filterFns` option
- A function directly provided to the `columnDefinition.filterFn` option

The final list of filter functions available for the `columnDefnition.filterFn` and ``tableOptions.globalFilterFn` options use the following type:

```tsx
export type FilterFnOption<TGenerics extends TableGenerics> =
  | 'auto'
  | BuiltInFilterFn
  | keyof TGenerics['FilterFns']
  | FilterFn<TGenerics>
```

## Column Definition Options

#### `filterFn`

```tsx
filterFn?: FilterFn | keyof TGenerics['FilterFns'] | keyof BuiltInFilterFns
```

The filter function to use with this column.

Options:

- A `string` referencing a [built-in filter function](#filter-functions))
- A `string` referencing a custom filter function defined on the `filterFns` table option
- A [custom filter function](#filter-functions)

#### `enableAllFilters`

```tsx
enableAllFilters?: boolean
```

Enables/disables **all** filters for this column. For option priority, see [Can-Filter Option Priority](../guides/filters#can-filter).

#### `enableColumnFilter`

```tsx
enableColumnFilter?: boolean
```

Enables/disables the **column** filter for this column. For option priority, see [Can-Filter Option Priority](../guides/filters#can-filter).

#### `enableGlobalFilter`

```tsx
enableGlobalFilter?: boolean
```

Enables/disables the **global** filter for this column. For option priority, see [Can-Filter Option Priority](../guides/filters#can-filter).

## Column API

#### `getCanColumnFilter`

```tsx
getCanColumnFilter: () => boolean
```

Returns whether or not the column can be **column** filtered.

#### `getCanGlobalFilter`

```tsx
getCanGlobalFilter: () => boolean
```

Returns whether or not the column can be **globally** filtered.

#### `getColumnFilterIndex`

```tsx
getColumnFilterIndex: () => number
```

Returns the index (including `-1`) of the column filter in the table's `state.columnFilters` array.

#### `getColumnIsFiltered`

```tsx
getColumnIsFiltered: () => boolean
```

Returns whether or not the column is currently filtered.

#### `getColumnFilterValue`

```tsx
getColumnFilterValue: () => unknown
```

Returns the current filter value of the column.

#### `setColumnFilterValue`

```tsx
setColumnFilterValue: (updater: Updater<any>) => void
```

A function that sets the current filter value for the column. You can pass it a value or an updater function for immutability-safe operations on existing values.

#### `getFacetedRowModel`

```tsx
type getFacetedRowModel = () => RowModel<TGenerics>
```

> ⚠️ Requires that you pass a valid `getFacetedRowModel` function to `options.facetedRowModel`. A default implementation is provided via the exported `getFacetedRowModel` function.

Returns the row model with all other column filters applied, excluding its own filter. Useful for displaying faceted result counts.

#### `getFacetedUniqueValues`

```tsx
getFacetedUniqueValues: () => Map<any, number>
```

> ⚠️ Requires that you pass a valid `getFacetedUniqueValues` function to `options.getFacetedUniqueValues`. A default implementation is provided via the exported `getFacetedUniqueValues` function.

A function that **computes and returns** a `Map` of unique values and their occurences derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.

#### `getFacetedMinMaxValues`

```tsx
getFacetedMinMaxValues: () => Map<any, number>
```

> ⚠️ Requires that you pass a valid `getFacetedMinMaxValues` function to `options.getFacetedMinMaxValues`. A default implementation is provided via the exported `getFacetedMinMaxValues` function.

A function that **computes and returns** a min/max tuple derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.

## Table Options

#### `filterFromLeafRows`

```tsx
filterFromLeafRows?: boolean
```

By default, filtering is done from parent rows down (so if a parent row is filtered out, all of its children will be filtered out as well). Setting this option to `true` will cause filtering to be done from leaf rows up (which means parent rows will be included so long as one of their child or grand-child rows is also included).

#### `filterFns`

```tsx
filterFns?: Record<string, FilterFn>
```

Normally set ahead of time when using the `createTable()` helper, this option allows you to define custom filter functions that can be referenced by their string key.

Example:

```tsx
const table = createTable().setOptions({
  filterFns: {
    myCustomFilterFn: (rows, columnIds, filterValue) => {
      // return the filtered rows
    },
  },
})

const column = table.createDataColumn('key', {
  filterFn: 'myCustomFilterFn',
})
```

#### `enableFilters`

```tsx
enableFilters?: boolean
```

Enables/disables all filters for the table. For option priority, see [Can-Filter Option Priority](../guides/filters#can-filter).

#### `manualFiltering`

```tsx
manualFiltering?: boolean
```

Disables the `getFilteredRowModel` from being used to filter data. This may be useful if your table needs to dynamically support both client-side and server-side filtering.

#### `onColumnFiltersChange`

```tsx
onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
```

If provided, this function will be called with an `updaterFn` when `state.columnFilters` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### `enableColumnFilters`

```tsx
enableColumnFilters?: boolean
```

Enables/disables **all** column filters for the table. For option priority, see [Can-Filter Option Priority](../guides/filters#can-filter).

#### `getFilteredRowModel`

```tsx
getFilteredRowModel?: (
  instance: TableInstance<TGenerics>
) => () => RowModel<TGenerics>
```

If provided, this function is called **once** per table instance and should return a **new function** which will calculate and return the row model for the table when it's filtered.

- For server-side filtering, this function is unnecessary and can be ignored since the server should already return the filtered row model.
- For client-side filtering, this function is required. A default implementation is provided via any table adapter's `{ getFilteredRowModel }` export.

Example:

```tsx
import { getFilteredRowModel } from '@tanstack/[adapter]-table'

useTable(table, {
  getFilteredRowModel: getFilteredRowModel(),
})
```

#### `getColumnFacetedRowModel`

```tsx
getColumnFacetedRowModel: (columnId: string) => RowModel<TGenerics>
```

Returns the faceted row model for a given columnId.

#### `globalFilterFn`

```tsx
globalFilterFn?: FilterFn | keyof TGenerics['FilterFns'] | keyof BuiltInFilterFns
```

The filter function to use for global filtering.

Options:

- A `string` referencing a [built-in filter function](#filter-functions))
- A `string` referencing a custom filter function defined on the `filterFns` table option
- A [custom filter function](#filter-functions)

#### `onGlobalFilterChange`

```tsx
onGlobalFilterChange?: OnChangeFn<GlobalFilterState>
```

If provided, this function will be called with an `updaterFn` when `state.globalFilter` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### `enableGlobalFilter`

```tsx
enableGlobalFilter?: boolean
```

Enables/disables the global filter for the table. For option priority, see [Can-Filter Option Priority](../guides/filters#can-filter).

#### `getColumnCanGlobalFilter`

```tsx
getColumnCanGlobalFilter?: (column: Column<TGenerics>) => boolean
```

If provided, this function will be called with the column and should return `true` or `false` to indicate whether this column should be used for global filtering.

## Table Instance API

#### `getColumnAutoFilterFn`

```tsx
getColumnAutoFilterFn: (columnId: string) => FilterFn<TGenerics> | undefined
```

Returns an automatically calculated filter function for the column based off of the columns first known value.

#### `getColumnFilterFn`

```tsx
getColumnFilterFn: (columnId: string) => FilterFn<TGenerics> | undefined
```

Returns the filter function (either user-defined or automatic, depending on configuration) for the columnId specified.

#### `setColumnFilters`

```tsx
setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
```

Sets or updates the `state.columnFilters` state.

#### `setColumnFilterValue`

```tsx
setColumnFilterValue: (columnId: string, updater: Updater<any>) => void
```

Sets or updates the filter value for the columnId specified.

#### `resetColumnFilters`

```tsx
resetColumnFilters: () => void
```

Resets the **column** filter state for the table.

#### `getColumnCanColumnFilter`

```tsx
getColumnCanColumnFilter: (columnId: string) => boolean
```

Returns if the column with specified columnId can be filtered.

#### `getColumnIsFiltered`

```tsx
getColumnIsFiltered: (columnId: string) => boolean
```

Returns if the column with the specified columnId is currently filtered.

#### `getColumnFilterValue`

```tsx
getColumnFilterValue: (columnId: string) => unknown
```

Returns the current filter value of the column.

#### `getColumnFilterIndex`

```tsx
getColumnFilterIndex: (columnId: string) => unknown
```

Returns the index (including `-1`) of the column filter with the specified columnId in the table's `state.columnFilters` array.

#### `getPreFilteredRowModel`

```tsx
getPreFilteredRowModel: () => RowModel<TGenerics>
```

Returns the row model for the table before any **column** filtering has been applied.

#### `getFilteredRowModel`

```tsx
getFilteredRowModel: () => RowModel<TGenerics>
```

Returns the row model for the table after **column** filtering has been applied.

#### `setGlobalFilter`

```tsx
setGlobalFilter: (updater: Updater<any>) => void
```

Sets or updates the `state.globalFilter` state.

#### `resetGlobalFilter`

```tsx
resetGlobalFilter: () => void
```

Resets the **global** filter state for the table.

#### `getGlobalAutoFilterFn`

```tsx
getGlobalAutoFilterFn: (columnId: string) => FilterFn<TGenerics> | undefined
```

Currently, this function returns the built-in `includesString` filter function. In future releases, it may return more dynamic filter functions based on the nature of the data provided.

#### `getGlobalFilterFn`

```tsx
getGlobalFilterFn: (columnId: string) => FilterFn<TGenerics> | undefined
```

Returns the global filter function (either user-defined or automatic, depending on configuration) for the table.

#### `getColumnCanGlobalFilter`

```tsx
getColumnCanGlobalFilter: (columnId: string) => boolean
```

Returns if the column with specified columnId can be **globally** filtered.

#### `getGlobalFacetedRowModel`

```tsx
getGlobalFacetedRowModel: () => RowModel<TGenerics>
```

Returns the faceted row model for the global filter.

#### `getGlobalFacetedUniqueValues`

```tsx
getGlobalFacetedUniqueValues: () => Map<any, number>
```

Returns the faceted unique values for the global filter.

#### `getGlobalFacetedMinMaxValues`

```tsx
getGlobalFacetedMinMaxValues: () => [number, number]
```

Returns the faceted min and max values for the global filter.
