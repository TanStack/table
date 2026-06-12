---
title: Column Ordering (React) Guide
---

## Examples

Want to skip to the implementation? Check out these React examples:

- [Column Ordering](../examples/column-ordering)
- [Column DnD](../examples/column-dnd)
### React Setup

```tsx
import { useTable, tableFeatures, columnOrderingFeature } from '@tanstack/react-table'

const features = tableFeatures({ columnOrderingFeature })

const table = useTable({
  features,
  columns,
  data,
})
```

## Column Ordering (React) Guide

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
import { useCreateAtom, useSelector } from '@tanstack/react-store'
import { useTable, tableFeatures, columnOrderingFeature } from '@tanstack/react-table'
import type { ColumnOrderState } from '@tanstack/react-table'

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

If the table has UI that allows the user to reorder columns, hook the drop event of your drag-and-drop solution up to `table.setColumnOrder`. The official [Column DnD example](../examples/column-dnd) does this with DnD Kit's `arrayMove` utility:

```tsx
import { arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'

// reorder columns after drag & drop
function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event
  if (over && active.id !== over.id) {
    table.setColumnOrder((prevColumnOrder) => {
      const oldIndex = prevColumnOrder.indexOf(active.id as string)
      const newIndex = prevColumnOrder.indexOf(over.id as string)
      return arrayMove(prevColumnOrder, oldIndex, newIndex) // splice util
    })
  }
}
```

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

#### Drag and Drop Column Reordering Suggestions (React)

TanStack Table is not opinionated about which drag-and-drop solution you use. Here are a few suggestions:

1. Use [DnD Kit](https://dndkit.com/) if you want a library. It is what the official [Column DnD](../examples/column-dnd) and [Row DnD](../examples/row-dnd) examples use (the `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/modifiers`, and `@dnd-kit/utilities` packages). It is modular, works with React Strict Mode, and plays well with semantic `<table>` markup.

2. Consider native browser drag events (`onDragStart`, `onDragEnter`, `onDragEnd`) with your own state if you want zero dependencies. This can be very lightweight, but you will need to do extra work for proper touch support on mobile. [Material React Table](https://www.material-react-table.com/docs/examples/column-ordering) implements TanStack Table column ordering this way with no DnD dependencies, and its source code is a good reference.

3. If you evaluate other DnD libraries, check their maintenance status, React version compatibility (especially with Strict Mode), bundle size, and how well they handle `<table>` markup before committing. Older libraries such as `react-dnd` and `react-beautiful-dnd` are no longer actively developed; Atlassian's [Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop/about) is the actively maintained successor to `react-beautiful-dnd` if you prefer that family of APIs.
