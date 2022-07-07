---
title: Cell
---

These are **core** options and API properties for all cells. More options and API properties are available for other [table features](../guide/features.md).

## Cell API

All cell objects have the following properties:

### `id`

```tsx
id: string
```

The unique ID for the cell across the entire table.

### `getValue`

```tsx
getValue: () => any
```

Returns the value for the cell, accessed via the associated column's accessor key or accessor function.

### `row`

```tsx
row: Row<TData>
```

The associated Row object for the cell.

### `column`

```tsx
column: Column<TData>
```

The associated Column object for the cell.

### `renderCell`

```tsx
renderCell: () => unknown
```

Returns the rendered cell value using the associated column's `cell` template. The exact return type of this function depends on the adapter being used.
