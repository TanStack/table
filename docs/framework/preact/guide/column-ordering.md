---
title: Column Ordering (Preact) Guide
---

## Examples

Want to skip to the implementation? Check out these Preact examples:

- [Column Ordering](../examples/column-ordering)
### Preact Setup

```tsx
import { useTable, tableFeatures, columnOrderingFeature } from '@tanstack/preact-table'

const features = tableFeatures({ columnOrderingFeature })

const table = useTable({
  features,
  columns,
  data,
})
```

## Column Ordering (Preact) Guide

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

const table = useTable({
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

In v9, the recommended way to own a state slice is with an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the column order without re-rendering the component that owns the table.

```tsx
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import { useTable, tableFeatures, columnOrderingFeature } from '@tanstack/preact-table'
import type { ColumnOrderState } from '@tanstack/preact-table'

const features = tableFeatures({ columnOrderingFeature })

const columnOrderAtom = useCreateAtom<ColumnOrderState>([
  'columnId1',
  'columnId2',
  'columnId3',
])

const columnOrder = useSelector(columnOrderAtom) // subscribe wherever it is needed

const table = useTable({
  features,
  //...
  atoms: {
    columnOrder: columnOrderAtom,
  },
  //...
})
```

Alternatively, the v8-style `state.columnOrder` plus `onColumnOrderChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```tsx
const features = tableFeatures({ columnOrderingFeature })

const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(['columnId1', 'columnId2', 'columnId3'])
//...
const table = useTable({
  features,
  //...
  state: {
    columnOrder,
    //...
  },
  onColumnOrderChange: setColumnOrder,
  //...
})
```

### Reordering Columns

If the table has UI that allows the user to reorder columns, hook the drop event of your drag-and-drop solution up to `table.setColumnOrder`. With native browser drag events, track which column is being dragged and splice it into place when it is dropped on a target column:

```tsx
import { useState } from 'preact/hooks'

const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null)

// reorder columns after drag & drop
const handleDrop = (targetColumnId: string) => {
  if (!draggedColumnId || draggedColumnId === targetColumnId) return
  table.setColumnOrder((prevColumnOrder) => {
    const newColumnOrder = [...prevColumnOrder]
    const [movedColumnId] = newColumnOrder.splice(
      newColumnOrder.indexOf(draggedColumnId),
      1,
    )
    newColumnOrder.splice(newColumnOrder.indexOf(targetColumnId), 0, movedColumnId)
    return newColumnOrder
  })
  setDraggedColumnId(null)
}

// wire up onDragStart={() => setDraggedColumnId(header.column.id)},
// onDragOver={(e) => e.preventDefault()}, and
// onDrop={() => handleDrop(header.column.id)} on your <th> elements
```

If you use a drag-and-drop library instead, call `table.setColumnOrder` from its drop callback in the same way (most libraries provide an `arrayMove`-style utility for the splice logic).

`table.setColumnOrder` works the same whether the table manages the `columnOrder` state internally, you control it with `state` + `onColumnOrderChange`, or you own it with an external atom.

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

#### Drag and Drop Column Reordering Suggestions (Preact)

TanStack Table is not opinionated about which drag-and-drop solution you use. There is no official Preact DnD example yet, but here are a few suggestions:

1. Native browser drag events (`onDragStart`, `onDragOver`, `onDrop`) with a little of your own state are often the simplest fit for Preact. This approach has zero dependencies and works directly with Preact's event handling, but you will need to do extra work for proper touch support on mobile. [Material React Table](https://www.material-react-table.com/docs/examples/column-ordering) implements TanStack Table column ordering this way with no DnD dependencies, and its splice logic translates directly to Preact.

2. [Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop/about) has a framework-agnostic core that attaches to plain DOM elements, so it works in Preact apps without any compatibility layer.

3. [DnD Kit](https://dndkit.com/) is a React library, but it can work in Preact apps that alias `react` to `preact/compat`. The official React [Column DnD example](https://tanstack.com/table/latest/docs/framework/react/examples/column-dnd) uses it and is a useful reference for the `arrayMove` + `table.setColumnOrder` pattern, even though there is no Preact port of that example yet.

4. If you evaluate other DnD libraries, check their maintenance status, whether they require `preact/compat`, bundle size, and how well they handle `<table>` markup before committing. Older React-ecosystem DnD libraries are mostly no longer actively developed and are not worth the compatibility effort.
