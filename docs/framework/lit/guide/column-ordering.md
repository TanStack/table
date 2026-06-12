---
title: Column Ordering (Lit) Guide
---

## Examples

Want to skip to the implementation? Check out these Lit examples:

- [Column Ordering](../examples/column-ordering)

### Lit Setup

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TableController, tableFeatures, columnOrderingFeature } from '@tanstack/lit-table'

const features = tableFeatures({ columnOrderingFeature })

@customElement('my-table')
class MyTable extends LitElement {
  @state()
  private data = defaultData

  private tableController = new TableController(this)

  protected render() {
    const table = this.tableController.table({
      features,
      columns,
      data: this.data,
    })

    return html`...`
  }
}
```

## Column Ordering (Lit) Guide

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

const table = this.tableController.table({
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

```ts
import { createAtom } from '@tanstack/store'
import { TableController, tableFeatures, columnOrderingFeature } from '@tanstack/lit-table'
import type { ColumnOrderState } from '@tanstack/lit-table'

const features = tableFeatures({ columnOrderingFeature })

// create a stable atom at module scope (or in a shared store module)
const columnOrderAtom = createAtom<ColumnOrderState>([
  'columnId1',
  'columnId2',
  'columnId3',
])

const table = this.tableController.table({
  features,
  //...
  atoms: {
    columnOrder: columnOrderAtom,
  },
  //...
})

// read columnOrderAtom.get() (or subscribe to columnOrderAtom) wherever you need the value
```

Alternatively, the v8-style `state.columnOrder` plus `onColumnOrderChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const features = tableFeatures({ columnOrderingFeature })

@state()
private columnOrder: ColumnOrderState = ['columnId1', 'columnId2', 'columnId3']
//...
const table = this.tableController.table({
  features,
  //...
  state: {
    columnOrder: this.columnOrder,
    //...
  },
  onColumnOrderChange: (updater) => {
    this.columnOrder = typeof updater === 'function' ? updater(this.columnOrder) : updater
  },
  //...
})
```

### Reordering Columns

If the table has UI that allows the user to reorder columns, hook the drop event of your drag-and-drop solution up to `table.setColumnOrder`. With native drag events on the header cells, a handler can look like this:

```ts
// inside render(), where `table` is in scope
const handleDrop = (movingColumnId: string, targetColumnId: string) => {
  table.setColumnOrder((prevColumnOrder) => {
    const newColumnOrder = [...prevColumnOrder]
    newColumnOrder.splice(
      newColumnOrder.indexOf(targetColumnId),
      0,
      newColumnOrder.splice(newColumnOrder.indexOf(movingColumnId), 1)[0]!,
    )
    return newColumnOrder
  })
}
```

`table.setColumnOrder` works the same whether the table manages the `columnOrder` state internally, you control it with `state` + `onColumnOrderChange`, or you own it with an external atom. The official [Column Ordering example](../examples/column-ordering) uses `table.setColumnOrder` the same way (with a shuffle button instead of drag and drop).

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

#### Drag and Drop Column Reordering Suggestions (Lit)

TanStack Table is not opinionated about which drag-and-drop solution you use. There is no official Lit DnD example yet, but here are a few suggestions:

1. Consider native browser drag events (`@dragstart`, `@dragenter`, `@dragend` bindings in your templates) with your own state if you want zero dependencies. Lit's event bindings make this straightforward, but you will need to do extra work for proper touch support on mobile.

2. If you want a library, prefer framework-agnostic, DOM-based solutions, since they attach to real elements and do not assume any component framework. [SortableJS](https://sortablejs.github.io/Sortable/) and Atlassian's [Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop/about) both fit Lit well. Wire their drop callbacks up to `table.setColumnOrder` as shown above.

3. Avoid React-specific DnD libraries, including DnD Kit's React packages; they require a React renderer and will not work in a Lit app.
