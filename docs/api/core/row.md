---
title: Row
---

These are **core** options and API properties for all rows. More options and API properties are available for other [table features](../guide/09-features.md).

## Row API

All row objects have the following properties:

### `id`

```tsx
id: string
```

The resolved unique identifier for the row resolved via the `instanceOptions.getRowId` option. Defaults to the row's index (or relative index if it is a subRow)

### `depth`

```tsx
id: number
```

The depth of the row (if nested or grouped) relative to the root row array.

### `index`

```tsx
index: number
```

The index of the row within its parent array (or the root data array)

### `original`

```tsx
original?: TGenerics['Row']
```

The original row object provided to the table instance

### `getValue`

```tsx
getValue: (columnId: string) => any
```

Returns the value from the row for a given columnId

### `subRows`

```tsx
type subRows = Row<TGenerics>[]
```

An array of subRows for the row as returned and created by the `instanceOptions.getSubRows` option.

### `getLeafRows`

```tsx
type getLeafRows = () => Row<TGenerics>[]
```

Returns the leaf rows for the row, not including any parent rows.

### `originalSubRows`

```tsx
originalSubRows?: TGenerics['Row'][]
```

An array of the original subRows as returned by the `instanceOptions.getSubRows` option.

### `getAllCells`

```tsx
type getAllCells = () => Cell<TGenerics>[]
```

Returns all of the [Cells](./Cell.md) for the row.
