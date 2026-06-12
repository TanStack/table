---
title: Column Ordering (Solid) Guide
---

## Examples

Want to skip to the implementation? Check out these Solid examples:

- [Column Ordering](../examples/column-ordering)

Use getters for reactive inputs such as `data` when passing Solid signals to `createTable`.

### Solid Setup

```tsx
import { createTable, tableFeatures, columnOrderingFeature } from '@tanstack/solid-table'

const features = tableFeatures({ columnOrderingFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

## Column Ordering (Solid) Guide

By default, columns are ordered in the order they are defined in the `columns` array. However, you can manually specify the column order using the `columnOrder` state. Other features like column pinning and grouping can also affect the column order.

### What Affects Column Order

There are 3 table features that can reorder columns, which happen in the following order:

1. [Column Pinning](./column-pinning) - If pinning, columns are split into left, center (unpinned), and right pinned columns.
2. Manual **Column Ordering** - A manually specified column order is applied.
3. [Grouping](./grouping) - If grouping is enabled, a grouping state is active, and `tableOptions.groupedColumnMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

> **Note:** `columnOrder` state will only affect unpinned columns if used in conjunction with column pinning.

### Column Order State

If you don't provide a `columnOrder` state, TanStack Table will just use the order of the columns in the `columns` array. However, you can provide an array of string column ids to the `columnOrder` state to specify the order of the columns.

#### Default Column Order

If all you need to do is specify the initial column order, you can just specify the `columnOrder` state in the `initialState` table option.

```tsx
const features = tableFeatures({ columnOrderingFeature })

const table = createTable({
  features,
  //...
  initialState: {
    columnOrder: ['columnId1', 'columnId2', 'columnId3'],
  },
  //...
})
```

> **Note:** If you are using the `state` table option to also specify the `columnOrder` state, the `initialState` will have no effect. Only specify particular states in either `initialState` or `state`, not both.

#### Managing Column Order State

If you need to dynamically change the column order, or set the column order after the table has been initialized, you can manage the `columnOrder` state just like any other table state.

In v9, the recommended way to own a state slice is with an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the column order without going through the component that owns the table.

```tsx
import { createAtom, useSelector } from '@tanstack/solid-store'
import { createTable, tableFeatures, columnOrderingFeature } from '@tanstack/solid-table'
import type { ColumnOrderState } from '@tanstack/solid-table'

const features = tableFeatures({ columnOrderingFeature })

const columnOrderAtom = createAtom<ColumnOrderState>([
  'columnId1',
  'columnId2',
  'columnId3',
])

const columnOrder = useSelector(columnOrderAtom) // subscribe wherever it is needed

const table = createTable({
  features,
  //...
  atoms: {
    columnOrder: columnOrderAtom,
  },
  //...
})
```

Alternatively, the v8-style `state.columnOrder` plus `onColumnOrderChange` pattern is still supported with Solid signals. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```tsx
const features = tableFeatures({ columnOrderingFeature })

const [columnOrder, setColumnOrder] = createSignal<ColumnOrderState>(['columnId1', 'columnId2', 'columnId3'])
//...
const table = createTable({
  features,
  //...
  state: {
    get columnOrder() {
      return columnOrder() // connect the signal back down to the table
    },
    //...
  },
  onColumnOrderChange: setColumnOrder,
  //...
})
```

### Reordering Columns

If the table has UI that allows the user to reorder columns, hook the drop event of your drag-and-drop solution up to `table.setColumnOrder`. For example, with native browser drag events on the header cells:

```tsx
const [movingColumnId, setMovingColumnId] = createSignal<string | null>(null)

// move the dragged column in front of the column it was dropped on
const handleDrop = (targetColumnId: string) => {
  const fromId = movingColumnId()
  if (!fromId || fromId === targetColumnId) return
  table.setColumnOrder((prevColumnOrder) => {
    const newColumnOrder = [...prevColumnOrder]
    newColumnOrder.splice(
      newColumnOrder.indexOf(targetColumnId),
      0,
      newColumnOrder.splice(newColumnOrder.indexOf(fromId), 1)[0]!,
    )
    return newColumnOrder
  })
  setMovingColumnId(null)
}
```

`table.setColumnOrder` works the same whether the table manages the `columnOrder` state internally, you control it with `state` + `onColumnOrderChange`, or you own it with an external atom. The official [Column Ordering example](../examples/column-ordering) calls it with a full array of leaf column ids.

### Column Ordering APIs

Use `table.setColumnOrder` to update the column order state directly. Use `table.resetColumnOrder` to reset the order to `initialState.columnOrder`, or pass `true` to clear the order state.

```tsx
table.setColumnOrder(['lastName', 'firstName', 'age'])
table.resetColumnOrder()
table.resetColumnOrder(true)
```

Columns expose helpers for reading their current position after column pinning, manual ordering, and grouping have been applied.

```tsx
column.getIndex()
column.getIndex('left')
column.getIndex('center')
column.getIndex('right')

column.getIsFirstColumn()
column.getIsLastColumn()
```

These helpers are useful for styling column boundaries or building drag-and-drop targets that need to know the current rendered order.

#### Drag and Drop Column Reordering Suggestions (Solid)

TanStack Table is not opinionated about which drag-and-drop solution you use, and there is no official Solid DnD example yet. Here are a few suggestions:

1. Consider native browser drag events (`onDragStart`, `onDragEnter`, `onDragEnd`) with your own signals if you want zero dependencies. This can be very lightweight, but you will need to do extra work for proper touch support on mobile. [Material React Table](https://www.material-react-table.com/docs/examples/column-ordering) implements TanStack Table column ordering this way with no DnD dependencies; the approach translates directly to Solid since it is just DOM events feeding `table.setColumnOrder`.

2. If you want a library, look at Solid-specific options such as [`@thisbeyond/solid-dnd`](https://solid-dnd.com/), or framework-agnostic ones such as Atlassian's [Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop/about). Check maintenance status, bundle size, and how well they handle semantic `<table>` markup before committing.

3. Do NOT reach for React-only DnD libraries (including DnD Kit's `@dnd-kit/*` packages). They depend on React's component model and do not work with Solid.
