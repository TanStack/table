---
title: Pinning
id: pinning
---

## Can-Pin

The ability for a column to be **pinned** is determined by the following:

- `options.enablePinning` is not set to `false`
- `options.enableColumnPinning` is not set to `false`
- `columnDefinition.enablePinning` is not set to `false`

The ability for a row to be **pinned** is determined by the following:

- `options.enableRowPinning` resolves to `true`
- `options.enablePinning` is not set to `false`

## State

Pinning state is stored on the table using the following shape:

```tsx
export type ColumnPinningPosition = false | 'left' | 'right'
export type RowPinningPosition = false | 'top' | 'bottom'

export type ColumnPinningState = {
  left?: string[]
  right?: string[]
}
export type RowPinningState = {
  top?: boolean
  bottom?: boolean
}

export type ColumnPinningTableState = {
  columnPinning: ColumnPinningState
}
export type RowPinningRowState = {
  rowPinning: RowPinningState
}
```

## Table Options

### `enablePinning`

```tsx
enablePinning?: boolean
```

Enables/disables all pinning for the table. Defaults to `true`.

### `enableColumnPinning`

```tsx
enableColumnPinning?: boolean
```

Enables/disables column pinning for all columns in the table.

### `enableRowPinning`

```tsx
enableRowPinning?: boolean | ((row: Row<TData>) => boolean)
```

Enables/disables row pinning for all rows in the table.

### `keepPinnedRows`

```tsx
keepPinnedRows?: boolean
```

When `false`, pinned rows will not be visible if they are filtered or paginated out of the table. When `true`, pinned rows will always be visible regardless of filtering or pagination. Defaults to `true`.

### `onColumnPinningChange`

```tsx
onColumnPinningChange?: OnChangeFn<ColumnPinningState>
```

If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will also need to supply `state.columnPinning` from your own managed state.

### `onRowPinningChange`

```tsx
onRowPinningChange?: OnChangeFn<RowPinningState>
```

If provided, this function will be called with an `updaterFn` when `state.rowPinning` changes. This overrides the default internal state management, so you will also need to supply `state.rowPinning` from your own managed state.

## Column Def Options

### `enablePinning`

```tsx
enablePinning?: boolean
```

Enables/disables pinning for the column.

## Table API

### `setColumnPinning`

```tsx
setColumnPinning: (updater: Updater<ColumnPinningState>) => void
```

Sets or updates the `state.columnPinning` state.

### `setRowPinning`

```tsx
setRowPinning: (updater: Updater<RowPinningState>) => void
```

Sets or updates the `state.rowPinning` state.

### `resetColumnPinning`

```tsx
resetColumnPinning: (defaultState?: boolean) => void
```

Resets the **columnPinning** state to `initialState.columnPinning`, or `true` can be passed to force a default blank state reset to `{ left: [], right: [], }`.

### `resetRowPinning`

```tsx
resetRowPinning: (defaultState?: boolean) => void
```

Resets the **rowPinning** state to `initialState.rowPinning`, or `true` can be passed to force a default blank state reset to `{}`.

### `getIsSomeColumnsPinned`

```tsx
getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
```

Returns whether or not any columns are pinned. Optionally specify to only check for pinned columns in either the `left` or `right` position.

_Note: Does not account for column visibility_

### `getIsSomeRowsPinned`

```tsx
getIsSomeRowsPinned: (position?: RowPinningPosition) => boolean
```

Returns whether or not any rows are pinned. Optionally specify to only check for pinned rows in either the `top` or `bottom` position.

### `getLeftHeaderGroups`

```tsx
getLeftHeaderGroups: () => HeaderGroup<TData>[]
```

Returns the left pinned header groups for the table.

### `getCenterHeaderGroups`

```tsx
getCenterHeaderGroups: () => HeaderGroup<TData>[]
```

Returns the unpinned/center header groups for the table.

### `getRightHeaderGroups`

```tsx
getRightHeaderGroups: () => HeaderGroup<TData>[]
```

Returns the right pinned header groups for the table.

### `getLeftFooterGroups`

```tsx
getLeftFooterGroups: () => HeaderGroup<TData>[]
```

Returns the left pinned footer groups for the table.

### `getCenterFooterGroups`

```tsx
getCenterFooterGroups: () => HeaderGroup<TData>[]
```

Returns the unpinned/center footer groups for the table.

### `getRightFooterGroups`

```tsx
getRightFooterGroups: () => HeaderGroup<TData>[]
```

Returns the right pinned footer groups for the table.

### `getLeftFlatHeaders`

```tsx
getLeftFlatHeaders: () => Header<TData>[]
```

Returns a flat array of left pinned headers for the table, including parent headers.

### `getCenterFlatHeaders`

```tsx
getCenterFlatHeaders: () => Header<TData>[]
```

Returns a flat array of unpinned/center headers for the table, including parent headers.

### `getRightFlatHeaders`

```tsx
getRightFlatHeaders: () => Header<TData>[]
```

Returns a flat array of right pinned headers for the table, including parent headers.

### `getLeftLeafHeaders`

```tsx
getLeftLeafHeaders: () => Header<TData>[]
```

Returns a flat array of leaf-node left pinned headers for the table.

### `getCenterLeafHeaders`

```tsx
getCenterLeafHeaders: () => Header<TData>[]
```

Returns a flat array of leaf-node unpinned/center headers for the table.

### `getRightLeafHeaders`

```tsx
getRightLeafHeaders: () => Header<TData>[]
```

Returns a flat array of leaf-node right pinned headers for the table.

### `getLeftLeafColumns`

```tsx
getLeftLeafColumns: () => Column<TData>[]
```

Returns all left pinned leaf columns.

### `getRightLeafColumns`

```tsx
getRightLeafColumns: () => Column<TData>[]
```

Returns all right pinned leaf columns.

### `getCenterLeafColumns`

```tsx
getCenterLeafColumns: () => Column<TData>[]
```

Returns all center pinned (unpinned) leaf columns.

### `getTopRows`

```tsx
getTopRows: () => Row<TData>[]
```

Returns all top pinned rows.

### `getBottomRows`

```tsx
getBottomRows: () => Row<TData>[]
```

Returns all bottom pinned rows.

### `getCenterRows`

```tsx
getCenterRows: () => Row<TData>[]
```

Returns all rows that are not pinned to the top or bottom.

## Column API

### `getCanPin`

```tsx
getCanPin: () => boolean
```

Returns whether or not the column can be pinned.

### `getPinnedIndex`

```tsx
getPinnedIndex: () => number
```

Returns the numeric pinned index of the column within a pinned column group.

### `getIsPinned`

```tsx
getIsPinned: () => ColumnPinningPosition
```

Returns the pinned position of the column. (`'left'`, `'right'` or `false`)

### `pin`

```tsx
pin: (position: ColumnPinningPosition) => void
```

Pins a column to the `'left'` or `'right'`, or unpins the column to the center if `false` is passed.

## Row API

### `pin`

```tsx
pin: (position: RowPinningPosition) => void
```

Pins a row to the `'top'` or `'bottom'`, or unpins the row to the center if `false` is passed.

### `getCanPin`

```tsx
getCanPin: () => boolean
```

Returns whether or not the row can be pinned.

### `getIsPinned`

```tsx
getIsPinned: () => RowPinningPosition
```

Returns the pinned position of the row. (`'top'`, `'bottom'` or `false`)

### `getPinnedIndex`

```tsx
getPinnedIndex: () => number
```

Returns the numeric pinned index of the row within a pinned row group.

### `getLeftVisibleCells`

```tsx
getLeftVisibleCells: () => Cell<TData>[]
```

Returns all left pinned leaf cells in the row.

### `getRightVisibleCells`

```tsx
getRightVisibleCells: () => Cell<TData>[]
```

Returns all right pinned leaf cells in the row.

### `getCenterVisibleCells`

```tsx
getCenterVisibleCells: () => Cell<TData>[]
```

Returns all center pinned (unpinned) leaf cells in the row.
