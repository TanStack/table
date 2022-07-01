---
title: ColumnDef
---

Column definitions are created using various helpers [available on the `table` object](./Table.md).

## Options

### `id`

```tsx
id: string
```

The unique identifier for the column.

> 🧠 A column ID is optional when:
>
> - A data column is created with an object key accessor
> - The column header is defined as a string

### `accessorKey`

```tsx
accessorKey?: string & typeof TData
```

The key of the row object to use when extracting the value for the column.

### `accessorFn`

```tsx
accessorFn?: (originalRow: TData, index: number) => any
```

The accessor function to use when extracting the value for the column from each row.

### `columns`

```tsx
columns?: ColumnDef<TData>[]
```

The child column defs to include in a group column.

### `header`

```tsx
header?:
  | string
  | ((props: {
      table: Table<TData>
      header: Header<TData>
      column: Column<TData>
    }) => unknown)
```

The header to display for the column. If a string is passed, it can be used as a default for the column ID. If a function is passed, it will be passed a props object for the header and should return the rendered header value (the exact type depends on the adapter being used).

### `footer`

```tsx
footer?:
  | string
  | ((props: {
      table: Table<TData>
      header: Header<TData>
      column: Column<TData>
    }) => unknown)
```

The footer to display for the column. If a function is passed, it will be passed a props object for the header and should return the rendered header value (the exact type depends on the adapter being used).

### `cell`

```tsx
cell?: ((props: {
  table: Table<TData>
  row: Row<TData>
  column: Column<TData>
  cell: Cell<TData>
  getValue: () => any
  renderValue: () => any
}) => unknown)
```

The cell to display each row for the column. If a function is passed, it will be passed a props object for the header and should return the rendered header value (the exact type depends on the adapter being used).

### `meta`

```tsx
meta?: unknown
```

The meta data to associated with the column.

> ⚠️ Due to generic limitations, This meta object must be typecast to the correct type before usage.
