---
title: Column Ordering (Alpine) Guide
---

## Examples

Want to skip to the implementation? Check out these Alpine examples:

- [Column Ordering](../examples/column-ordering)

Read your reactive inputs such as `data` through a getter (for example backing them with `Alpine.reactive`) when creating the table, so the table sees updates.

### Column Ordering Setup

Here's how you set up your table to use column ordering features. Adding the column ordering feature enables the related APIs.

```ts
import {
  createTable,
  tableFeatures,
  columnOrderingFeature,
} from '@tanstack/alpine-table'

const features = tableFeatures({ columnOrderingFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
})
```

## Column Ordering (Alpine) Guide

By default, columns are ordered in the order they are defined in the `columns` array. However, you can manually specify the column order using the `columnOrder` state. Other features like column pinning and grouping can also affect the column order.

### What Affects Column Order

There are 3 table features that can reorder columns, which happen in the following order:

1. [Column Pinning](./column-pinning) - If pinning, columns are split into start, center (unpinned), and end pinned columns.
2. Manual **Column Ordering** - A manually specified column order is applied.
3. [Grouping](./grouping) - If grouping is enabled, a grouping state is active, and `tableOptions.groupedColumnMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

> [!NOTE]
> `columnOrder` state will only affect unpinned columns if used in conjunction with column pinning.

### Column Order State

If you don't provide a `columnOrder` state, TanStack Table will just use the order of the columns in the `columns` array. However, you can provide an array of string column ids to the `columnOrder` state to specify the order of the columns.

#### Default Column Order

If all you need to do is specify the initial column order, you can just specify the `columnOrder` state in the `initialState` table option.

```ts
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

> [!NOTE]
> If you are using the `state` table option to also specify the `columnOrder` state, the `initialState` will have no effect. Only specify particular states in either `initialState` or `state`, not both.

#### Managing Column Order State

If you need to dynamically change the column order, or set the column order after the table has been initialized, you can manage the `columnOrder` state just like any other table state.

In v9, the recommended way to own a state slice is with an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the column order without going through the component that owns the table. `@tanstack/store` is already a dependency of `@tanstack/alpine-table`, so `createAtom` is available.

```ts
import { createAtom } from '@tanstack/store'
import {
  createTable,
  tableFeatures,
  columnOrderingFeature,
} from '@tanstack/alpine-table'
import type { ColumnOrderState } from '@tanstack/alpine-table'

const features = tableFeatures({ columnOrderingFeature })

const columnOrderAtom = createAtom<ColumnOrderState>([
  'columnId1',
  'columnId2',
  'columnId3',
])

// subscribe wherever it is needed
columnOrderAtom.subscribe(() => {
  // react to column order changes
})

const table = createTable({
  features,
  //...
  atoms: {
    columnOrder: columnOrderAtom,
  },
  //...
})
```

Alternatively, the v8-style `state.columnOrder` plus `onColumnOrderChange` pattern is still supported by owning the slice in `Alpine.reactive`. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const features = tableFeatures({ columnOrderingFeature })

const local = Alpine.reactive({
  columnOrder: ['columnId1', 'columnId2', 'columnId3'] as ColumnOrderState,
})
//...
const table = createTable({
  features,
  //...
  state: {
    get columnOrder() {
      return local.columnOrder // connect the reactive slice back down to the table
    },
    //...
  },
  onColumnOrderChange: (updater) => {
    local.columnOrder =
      typeof updater === 'function' ? updater(local.columnOrder) : updater
  },
  //...
})
```

### Reordering Columns

If the table has UI that allows the user to reorder columns, hook the drop event of your drag-and-drop solution up to `table.setColumnOrder`. For example, with native browser drag events on the header cells. Keep the drag state in `Alpine.reactive` so the markup can react to it:

```ts
const local = Alpine.reactive({ movingColumnId: null as string | null })

// move the dragged column in front of the column it was dropped on
function handleDrop(targetColumnId: string) {
  const fromId = local.movingColumnId
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
  local.movingColumnId = null
}
```

`table.setColumnOrder` works the same whether the table manages the `columnOrder` state internally, you control it with `state` + `onColumnOrderChange`, or you own it with an external atom. The official [Column Ordering example](../examples/column-ordering) calls it with a full array of leaf column ids.

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
column.getIndex('start')
column.getIndex('center')
column.getIndex('end')

column.getIsFirstColumn()
column.getIsLastColumn()
```

These helpers are useful for styling column boundaries or building drag-and-drop targets that need to know the current rendered order.

#### Drag and Drop Column Reordering Suggestions (Alpine)

TanStack Table is not opinionated about which drag-and-drop solution you use. Here are a few suggestions:

1. Consider native browser drag events (`@dragstart`, `@dragenter`, `@dragend`) with your own `Alpine.reactive` state if you want zero dependencies. This can be very lightweight, but you will need to do extra work for proper touch support on mobile. [Material React Table](https://www.material-react-table.com/docs/examples/column-ordering) implements TanStack Table column ordering this way with no DnD dependencies; the approach translates directly to Alpine since it is just DOM events feeding `table.setColumnOrder`.

2. If you want a library, look at framework-agnostic options such as Atlassian's [Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop/about). Check maintenance status, bundle size, and how well they handle semantic `<table>` markup before committing.

3. Do NOT reach for React-only DnD libraries (including DnD Kit's `@dnd-kit/*` packages). They depend on React's component model and do not work with Alpine.
