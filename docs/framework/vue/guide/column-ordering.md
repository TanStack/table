---
title: Column Ordering (Vue) Guide
---

## Examples

Want to skip to the implementation? Check out these Vue examples:

- [Column Ordering](../examples/column-ordering)

Vue refs can be passed directly where the adapter expects reactive table options.

### Vue Setup

```ts
import { useTable, tableFeatures, columnOrderingFeature } from '@tanstack/vue-table'

const features = tableFeatures({ columnOrderingFeature })

const table = useTable({
  features,
  columns,
  data,
})
```

## Column Ordering (Vue) Guide

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

```ts
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

In v9, the recommended way to own a state slice is with an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the column order without depending on the table instance.

```ts
import { createAtom, useSelector } from '@tanstack/vue-store'
import { useTable, tableFeatures, columnOrderingFeature } from '@tanstack/vue-table'
import type { ColumnOrderState } from '@tanstack/vue-table'

const features = tableFeatures({ columnOrderingFeature })

const columnOrderAtom = createAtom<ColumnOrderState>([
  'columnId1',
  'columnId2',
  'columnId3',
])

const columnOrder = useSelector(columnOrderAtom) // subscribe wherever it is needed (a Vue ref)

const table = useTable({
  features,
  //...
  atoms: {
    columnOrder: columnOrderAtom,
  },
  //...
})
```

Alternatively, the v8-style `state.columnOrder` plus `onColumnOrderChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. Pass the current ref value through a getter so the adapter can track it. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const features = tableFeatures({ columnOrderingFeature })

const columnOrder = ref<ColumnOrderState>(['columnId1', 'columnId2', 'columnId3'])
//...
const table = useTable({
  features,
  //...
  state: {
    get columnOrder() {
      return columnOrder.value
    },
    //...
  },
  onColumnOrderChange: (updater) => {
    columnOrder.value = updater instanceof Function ? updater(columnOrder.value) : updater
  },
  //...
})
```

### Reordering Columns

If the table has UI that allows the user to reorder columns, hook the drop event of your drag-and-drop solution up to `table.setColumnOrder`. It accepts either a new array or an updater function that receives the previous order:

```ts
// reorder columns after drag & drop (or any other interaction)
function handleColumnDrop(movingColumnId: string, targetColumnId: string) {
  table.setColumnOrder((prevColumnOrder) => {
    const newColumnOrder = [...prevColumnOrder]
    const fromIndex = newColumnOrder.indexOf(movingColumnId)
    const toIndex = newColumnOrder.indexOf(targetColumnId)
    newColumnOrder.splice(toIndex, 0, newColumnOrder.splice(fromIndex, 1)[0]!)
    return newColumnOrder
  })
}
```

`table.setColumnOrder` works the same whether the table manages the `columnOrder` state internally, you control it with `state` + `onColumnOrderChange`, or you own it with an external atom. The official Vue [Column Ordering example](../examples/column-ordering) uses `table.setColumnOrder` to shuffle the column order with a button click.

### Column Ordering APIs

Use `table.setColumnOrder` to update the column order state directly. Use `table.resetColumnOrder` to reset the order to `initialState.columnOrder`, or pass `true` to clear the order state.

```ts
table.setColumnOrder(['lastName', 'firstName', 'age'])
table.resetColumnOrder()
table.resetColumnOrder(true)
```

Columns expose helpers for reading their current position after column pinning, manual ordering, and grouping have been applied.

```ts
column.getIndex()
column.getIndex('left')
column.getIndex('center')
column.getIndex('right')

column.getIsFirstColumn()
column.getIsLastColumn()
```

These helpers are useful for styling column boundaries or building drag-and-drop targets that need to know the current rendered order.

#### Drag and Drop Column Reordering Suggestions (Vue)

TanStack Table is not opinionated about which drag-and-drop solution you use, and there is not currently an official Vue drag-and-drop column reordering example. Here are a few suggestions:

1. Use a SortableJS-based Vue wrapper such as [`vuedraggable`](https://github.com/SortableJS/vue.draggable.next) or [`vue-draggable-plus`](https://vue-draggable-plus.pages.dev/) if you want a library with idiomatic Vue components. Hook its drop/end event up to `table.setColumnOrder` as shown above, and verify it handles semantic `<table>` markup the way you need.

2. Consider native browser drag events (`@dragstart`, `@dragenter`, `@dragend`) with your own refs if you want zero dependencies. This can be very lightweight, but you will need to do extra work for proper touch support on mobile.

3. Atlassian's [Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop/about) is framework-agnostic (its core has no React dependency) and works well with Vue. Avoid React-specific DnD libraries (including DnD Kit); they will not work in a Vue app.
