---
name: table
id: table
---

## `createTable`

```tsx
createTable: () => Table
```

Creates a new `Table` factory, from which you can set types, pre-set options and create column defs.

## `Table` API

#### `setRowType`

> 🦺 This function is designed for TypeScript. If using JS, this is a noop.

```tsx
setRowType: <TRow>() => Table<Overwrite<TGenerics, { Row: TRow }>>
```

Call this function to set the type of rows in your table. The type you provide here will be used to autocomplete column def accessor keys and functions, among many other places where the row generic type is used.

```tsx
const table = createTable().setRowType<Row>()
```

#### `setTableMetaType`

> 🦺 This function is designed for TypeScript. If using JS, this is a noop.

```tsx
setTableMetaType: <TTableMeta>() => Table<
  Overwrite<TGenerics, { TableMeta: TTableMeta }>
>
```

Call this function to set the type of your `instanceOptions.meta` object that you will use to create your table instance.

#### `setColumnMetaType`

> 🦺 This function is designed for TypeScript. If using JS, this is a noop.

```tsx
setColumnMetaType: <TColumnMeta>() => Table<
  Overwrite<TGenerics, { ColumnMeta: TColumnMeta }>
>
```

Call this function to set the type of `columnDefinition.meta` objects that you can provide to your column defs.

#### `setFilterMetaType`

> 🦺 This function is designed for TypeScript. If using JS, this is a noop.

```tsx
setFilterMetaType: <TFilterMeta>() => Table<
  Overwrite<TGenerics, { FilterMeta: TFilterMeta }>
>
```

Call this function to set the type of the filter meta object that you can optionally provide during the row filtering process.

#### `setOptions`

```tsx
setOptions: <
  TFilterFns extends Record<string, FilterFn<TGenerics>>,
  TSortingFns extends Record<string, SortingFn<TGenerics>>,
  TAggregationFns extends Record<string, AggregationFn<TGenerics>>
>(
  options: CreateTableOptions<
    any,
    TFilterFns,
    TSortingFns,
    TAggregationFns,
    TGenerics
  >
) => Table<
  Overwrite<
    TGenerics,
    {
      FilterFns: IfDefined<TFilterFns, TGenerics['FilterFns']>
      SortingFns: IfDefined<TSortingFns, TGenerics['SortingFns']>
      AggregationFns: IfDefined<TAggregationFns, TGenerics['AggregationFns']>
    }
  >
>
```

Call this function to pre-set options for your table before creating your table instance. This is specifically useful for providing **custom `filterFns`, `sortingFns`, and `aggregationFns`** that you can reference by key to filter, sort, and aggregate your table data. These options will be autocompleted and type-checked in your column defs.

#### `createGroup`

```tsx
createGroup: (
  column: Overwrite<
    | Overwrite<
        ColumnDef<any>,
        {
          header: string
          id?: string
        }
      >
    | Overwrite<
        ColumnDef<any>,
        {
          id: string
          header?: string | ((...any: any) => any)
        }
      >,
    {
      accessorFn?: never
      accessorKey?: never
      columns?: ColumnDef<any>[]
    }
  >
) => ColumnDef<TGenerics>
```

Call this function to create a grouping column. See [Creating Column Defs](../03-columns.md) for more details.

#### `createDisplayColumn`

```tsx
createDisplayColumn: (
  column: Omit<ColumnDef<TGenerics>, 'columns'>
) => ColumnDef<TGenerics>
```

Call this function to create a display column. See [Creating Column Defs](../03-columns.md) for more details.

#### `createDataColumn`

Call this function to create a data column. See [Creating Column Defs](../03-columns.md) for more details.

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}
```

#### `createOptions`

```tsx
createOptions: (
  options: TableOptions<TGenerics>
) => TableOptions<TGenerics>
```

> 🦺 This function is designed for TypeScript. If using JS, this is merely an identity function.

Call this function to create an object of the `TableOptions` type using the generics from your table.

```tsx
const options = table.createOptions({
  data: [...],
  columns: [...],
  getCoreRowModel: getCoreRowModel()
})
```

The object returned from this function is functionally identical to the one you pass it, but it will be type-checked using the generics from your table.
