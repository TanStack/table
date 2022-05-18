---
name: Column Ordering
id: column-ordering
---

## Examples

Want to skip to the implementation? Check out these examples:

- [column-ordering](../examples/column-ordering)

There are 3 table features that can reorder columns, which happen in the following order:

1. [Column Pinning](../column-pinning) - If pinning, columns are split into left, center (unpinned), and right pinned columns.
2. Manual **Column Ordering** - A manually specified column order is applied.
3. [Grouping](../grouping) - If grouping is enabled, a grouping state is active, and `tableOptions.columnGroupingMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

The API below described how to use the **manual column ordering** features.

## State

Column ordering state is stored on the table instance using the following shape:

```tsx
export type ColumnOrderTableState = {
  columnOrder: ColumnOrderState
}

export type ColumnOrderState = string[]
```

## Table Options

#### `onColumnOrderChange`

```tsx
onColumnOrderChange?: OnChangeFn<ColumnOrderState>
```

If provided, this function will be called with an `updaterFn` when `state.columnOrder` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

## Table Instance API

#### `setColumnOrder`

```tsx
setColumnOrder: (updater: Updater<ColumnOrderState>) => void
```

Sets or updates the `state.columnOrder` state.

#### `resetColumnOrder`

```tsx
resetColumnOrder: () => void
```

Resets the **columnOrder** state for the table.
