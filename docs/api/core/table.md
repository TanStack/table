---
title: Table
---

## `createTable`

```tsx
createTable: () => Table
```

Creates a new `Table` factory, from which you can set types, pre-set options and create column defs.

## `Table` API

### `createGroup`

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
) => ColumnDef<TData, TValue>
```

Call this function to create a grouping column. See [Creating Column Defs](../03-columns.md) for more details.

### `createDisplayColumn`

```tsx
createDisplayColumn: (
  column: Omit<ColumnDef<TData, TValue>, 'columns'>
) => ColumnDef<TData, TValue>
```

Call this function to create a display column. See [Creating Column Defs](../03-columns.md) for more details.

### `createDataColumn`

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

### `createOptions`

```tsx
createOptions: (
  options: TableOptions<TData>
) => TableOptions<TData>
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
