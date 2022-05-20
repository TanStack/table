---
title: Column
id: Column
---

These are **core** options and API properties for all columns. More options and API properties are available for other [table features](../guide/09-features.md).

## Column API

All column objects have the following properties:

#### `id`

```tsx
id: string
```

The resolved unique identifier for the column resolved in this priority:

- A manual `id` property from the column def
- The accessor key from the column def
- The header string from the column def

#### `depth`

```tsx
id: number
```

The depth of the column (if grouped) relative to the root column def array.

#### `accessorFn`

```tsx
accessorFn?: AccessorFn<TGenerics['Row']>
```

The resolved accessor function to use when extracting the value for the column from each row. Will only be defined if the column def has a valid accessor key or function defined.

#### `columnDef`

```tsx
columnDef: ColumnDef<TGenerics>
```

The original column def used to create the column.

#### `columnDefType`

```tsx
columnDefType: 'data' | 'display' | 'group'
```

The type of column def that was used to create the column. See the [`createTable()` API](../guide/tables.md#createtable) for more information.

#### `columns`

```tsx
type columns = ColumnDef<TGenerics>[]
```

The child column (if the column is a group column). Will be an empty array if the column is not a group column.

#### `parent`

```tsx
parent?: Column<TGenerics>
```

The parent column for this column. Will be undefined if this is a root column.

#### `getFlatColumns`

```tsx
type getFlatColumns = () => Column<TGenerics>[]
```

Returns the flattened array of this column and all child/grand-child columns for this column.

#### `getLeafColumns`

```tsx
type getLeafColumns = () => Column<TGenerics>[]
```

Returns an array of all leaf-node columns for this column. If a column has no children, it is considered the only leaf-node column.
