---
name: Column Pinning
id: column-pinning
---

## Can-Pin

The ability for a column to be **pinned** is determined by the following:

- `options.enablePinning` is not set to `false`
- `columnDefinition.enablePinning` is not set to `false`

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

#### `enablePinning`

```tsx
enablePinning?: boolean
```

Enables/disables all pinning for the table.

#### `onColumnPinningChange`

```tsx
onColumnPinningChange?: OnChangeFn<ColumnPinningState>
```

If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

## Column Def Options

#### `enablePinning`

```tsx
enablePinning?: boolean
```

Enables/disables pinning for the column.

## Table Instance API

#### `setColumnPinning`

```tsx
setColumnPinning: (updater: Updater<ColumnPinningState>) => void
```

Sets or updates the `state.columnPinning` state.

#### `resetColumnPinning`

```tsx
resetColumnPinning: (defaultState?: boolean) => void
```

Resets the **columnPinning** state to `initialState.columnPinning`, or `true` can be passed to force a default blank state reset to `{ left: [], right: [], }`.

#### `getIsSomeColumnsPinned`

```tsx
getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
```

Returns whether or not any columns are pinned. Optionally specify to only check for pinned columns in either the `left` or `right` position.

_Note: Does not account for column visibility_

#### `getLeftHeaderGroups`

```tsx
getLeftHeaderGroups: () => HeaderGroup < TGenerics > []
```

Returns the left pinned header groups for the table.

#### `getCenterHeaderGroups`

```tsx
getCenterHeaderGroups: () => HeaderGroup < TGenerics > []
```

Returns the unpinned/center header groups for the table.

#### `getRightHeaderGroups`

```tsx
getRightHeaderGroups: () => HeaderGroup < TGenerics > []
```

Returns the right pinned header groups for the table.

#### `getLeftFooterGroups`

```tsx
getLeftFooterGroups: () => HeaderGroup < TGenerics > []
```

Returns the left pinned footer groups for the table.

#### `getCenterFooterGroups`

```tsx
getCenterFooterGroups: () => HeaderGroup < TGenerics > []
```

Returns the unpinned/center footer groups for the table.

#### `getRightFooterGroups`

```tsx
getRightFooterGroups: () => HeaderGroup < TGenerics > []
```

Returns the right pinned footer groups for the table.

#### `getLeftFlatHeaders`

```tsx
getLeftFlatHeaders: () => Header < TGenerics > []
```

Returns a flat array of left pinned headers for the table, including parent headers.

#### `getCenterFlatHeaders`

```tsx
getCenterFlatHeaders: () => Header < TGenerics > []
```

Returns a flat array of unpinned/center headers for the table, including parent headers.

#### `getRightFlatHeaders`

```tsx
getRightFlatHeaders: () => Header < TGenerics > []
```

Returns a flat array of right pinned headers for the table, including parent headers.

#### `getLeftLeafHeaders`

```tsx
getLeftLeafHeaders: () => Header < TGenerics > []
```

Returns a flat array of leaf-node left pinned headers for the table.

#### `getCenterLeafHeaders`

```tsx
getCenterLeafHeaders: () => Header < TGenerics > []
```

Returns a flat array of leaf-node unpinned/center headers for the table.

#### `getRightLeafHeaders`

```tsx
getRightLeafHeaders: () => Header < TGenerics > []
```

Returns a flat array of leaf-node right pinned headers for the table.

#### `getLeftLeafColumns`

```tsx
getLeftLeafColumns: () => Column < TGenerics > []
```

Returns all left pinned leaf columns.

#### `getRightLeafColumns`

```tsx
getRightLeafColumns: () => Column < TGenerics > []
```

Returns all right pinned leaf columns.

#### `getCenterLeafColumns`

```tsx
getCenterLeafColumns: () => Column < TGenerics > []
```

Returns all center pinned (unpinned) leaf columns.

## Column API

#### `getCanPin`

```tsx
getCanPin: () => boolean
```

Returns whether or not the column can be pinned.

#### `getPinnedIndex`

```tsx
getPinnedIndex: () => number
```

Returns the numeric pinned index of the column within a pinned column group.

#### `getIsPinned`

```tsx
getIsPinned: () => ColumnPinningPosition
```

Returns the pinned position of the column. (`'left'`, `'right'` or `false`)

#### `pin`

```tsx
pin: (position: ColumnPinningPosition) => void
```

Pins a column to the `'left'` or `'right'`, or unpins the column to the center if `false` is passed.

## Row API

#### `getLeftVisibleCells`

```tsx
getLeftVisibleCells: () => Cell < TGenerics > []
```

Returns all left pinned leaf cells in the row.

#### `getRightVisibleCells`

```tsx
getRightVisibleCells: () => Cell < TGenerics > []
```

Returns all right pinned leaf cells in the row.

#### `getCenterVisibleCells`

```tsx
getCenterVisibleCells: () => Cell < TGenerics > []
```

Returns all center pinned (unpinned) leaf cells in the row.
