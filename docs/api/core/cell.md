---
title: Cell
---

These are **core** options and API properties for all cells. More options and API properties are available for other [table features](../guide/09-features.md).

## Cell API

All cell objects have the following properties:

#### `id`

```tsx
id: string
```

The unique ID for the cell across the entire table instance.

#### `getValue`

```tsx
getValue: () => TGenerics['Value']
```

Returns the value for the cell, accessed via the associated column's accessor key or accessor function.

#### `row`

```tsx
row: Row<TGenerics>
```

The associated Row object for the cell.

#### `column`

```tsx
column: Column<TGenerics>
```

The associated Column object for the cell.

#### `renderCell`

```tsx
renderCell: () => string | null | TGenerics['Rendered']
```

Returns the rendered cell value using the associated column's `cell` template. The exact return type of this function depends on the adapter being used.
