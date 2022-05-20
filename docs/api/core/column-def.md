---
title: ColumnDef
---

Column definitions are created using various helpers [available on the `table` object](./Table.md).

## Options

#### `id`

```tsx
id: string
```

The unique identifier for the column.

> 🧠 A column ID is optional when:
>
> - A data column is created with an object key accessor
> - The column header is defined as a string

#### `accessorKey`

```tsx
accessorKey?: string & typeof TGenerics['Row']
```

> ⚠️ While column defs _are_ just objects and this is a valid option, you should probably be using the [`table.createDataColumn()` utility](../guide/tables.md) instead, which will provide much better type safety and autocomplete.

The key of the row object to use when extracting the value for the column.

#### `accessorFn`

```tsx
accessorFn?: (originalRow: TGenerics['Row'], index: number) => any
```

> ⚠️ While column defs _are_ just objects and this is a valid option, you should probably be using the [`table.createDataColumn()` utility](../guide/tables.md) instead, which will provide much better type safety and autocomplete.

The accessor function to use when extracting the value for the column from each row.

#### `columns`

```tsx
columns?: ColumnDef<TGenerics>[]
```

> ⚠️ While column defs _are_ just objects and this is a valid option, you should probably be using the [`table.createGroup()` utility](../guide/tables.md) instead, which will provide much better type safety and autocomplete.

The child column defs to include in a group column.

#### `header`

```tsx
header?:
  | string
  | ((props: {
      instance: TableInstance<TGenerics>
      header: Header<TGenerics>
      column: Column<TGenerics>
    }) => TGenerics['Rendered'])
```

The header to display for the column. If a string is passed, it can be used as a default for the column ID. If a function is passed, it will be passed a props object for the header and should return the rendered header value (the exact type depends on the adapter being used).

#### `footer`

```tsx
footer?:
  | string
  | ((props: {
      instance: TableInstance<TGenerics>
      header: Header<TGenerics>
      column: Column<TGenerics>
    }) => TGenerics['Rendered'])
```

The footer to display for the column. If a function is passed, it will be passed a props object for the header and should return the rendered header value (the exact type depends on the adapter being used).

#### `cell`

```tsx
cell?: ((props: {
  instance: TableInstance<TGenerics>
  row: Row<TGenerics>
  column: Column<TGenerics>
  cell: Cell<TGenerics>
  getValue: () => TGenerics['Value']
}) => TGenerics['Rendered'])
```

The cell to display each row for the column. If a function is passed, it will be passed a props object for the header and should return the rendered header value (the exact type depends on the adapter being used).

#### `meta`

```tsx
meta?: TGenerics['ColumnMeta']
```

The meta data to associate with the column as defined with [`table.setColumnMeta<MetaType>()`](../guide/tables.md#setcolumnmeta). This is useful for providing additional information about the column in a typesafe way.
