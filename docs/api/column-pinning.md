---
name: Column Pinning
route: /api/column-pinning
menu: API
---

## Examples

Want to skip to the implementation? Check out these examples:

- [column-pinning](../examples/column-pinning)

There are 3 table features that can reorder columns, which happen in the following order:

1. **Column Pinning** - If pinning, columns are split into left, center (unpinned), and right pinned columns.
2. Manual [**Column Ordering**](../column-ordering) - A manually specified column order is applied.
3. [**Grouping**](../grouping) - If grouping is enabled, a grouping state is active, and `tableOptions.columnGroupingMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

The API below described how to use the **Column Pinning** features.

## State

Column pinning state is stored on the table instance using the following shape:

```tsx
export type ColumnPinningPosition = false | 'left' | 'right'

export type ColumnPinningState = {
  left?: string[]
  right?: string[]
}

export type ColumnPinningTableState = {
  columnPinning: ColumnPinningState
}
```

## Table Options

### `enablePinning`

```tsx
enablePinning?: boolean
```

Enables/disables all pinning for the table.

### `onColumnPinningChange`

```tsx
onColumnPinningChange?: OnChangeFn<ColumnPinningState>
```

If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

## Column Definition Options

### `enablePinning`

```tsx
enablePinning?: boolean
```

Enables/disables pinning for the column.

### `defaultCanPin`

```tsx
defaultCanPin?: boolean
```

If set, will serve as a fallback for enabling/disabling **all** pinning for this column.

## Table Instance API

### `setColumnPinning`

```tsx
setColumnPinning: (updater: Updater<ColumnPinningState>) => void
```

Sets or updates the `state.columnPinning` state.

### `resetColumnPinning`

```tsx
resetColumnPinning: () => void
```

Resets the **columnPinning** state for the table back to its initial state.

### `pinColumn`

```tsx
pinColumn: (columnId: string, position: ColumnPinningPosition) => void
```

Pins a column to the `'left'` or `'right'`, or unpins the column to the center if `false` is passed.

### `getColumnCanPin`

```tsx
getColumnCanPin: (columnId: string) => boolean
```

Returns whether or not the column can be pinned.

### `getColumnIsPinned`

```tsx
getColumnIsPinned: (columnId: string) => ColumnPinningPosition
```

Returns the pinned position of the column. (`'left'`, `'right'` or `false`)

### `getColumnPinnedIndex`

```tsx
getColumnPinnedIndex: (columnId: string) => number
```

Returns the numeric pinned index of the column within a pinned column group.

### `getIsSomeColumnsPinned`

```tsx
getIsSomeColumnsPinned: () => boolean
```

Returns whether or not any columns are pinned.

_Note: Does not account for column visibility_

### `getLeftLeafColumns`

```tsx
getLeftLeafColumns: () => Column < TGenerics > []
```

Returns all left pinned leaf columns.

### `getRightLeafColumns`

```tsx
getRightLeafColumns: () => Column < TGenerics > []
```

Returns all right pinned leaf columns.

### `getCenterLeafColumns`

```tsx
getCenterLeafColumns: () => Column < TGenerics > []
```

Returns all center pinned (unpinned) leaf columns.

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

### `getLeftVisibleCells`

```tsx
getLeftVisibleCells: () => Cell < TGenerics > []
```

Returns all left pinned leaf cells in the row.

### `getRightVisibleCells`

```tsx
getRightVisibleCells: () => Cell < TGenerics > []
```

Returns all right pinned leaf cells in the row.

### `getCenterVisibleCells`

```tsx
getCenterVisibleCells: () => Cell < TGenerics > []
```

Returns all center pinned (unpinned) leaf cells in the row.
