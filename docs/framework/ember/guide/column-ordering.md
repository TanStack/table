---
title: Column Ordering (Ember) Guide
---

## Examples

Want to skip to the implementation? Check out these Ember examples:

- [Column Ordering](../examples/column-ordering)

### Column Ordering Setup

Here's how you set up your table to use column ordering features. Adding the column ordering feature enables the related APIs.

```ts
import {
  useTable,
  tableFeatures,
  columnOrderingFeature,
} from '@tanstack/ember-table'

const features = tableFeatures({ columnOrderingFeature })

const table = useTable(() => ({
  features,
  columns,
  data,
}))
```

## Column Ordering (Ember) Guide

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

const table = useTable(() => ({
  features,
  //...
  initialState: {
    columnOrder: ['columnId1', 'columnId2', 'columnId3'],
  },
  //...
}))
```

> [!NOTE]
> If you are using the `state` table option to also specify the `columnOrder` state, the `initialState` will have no effect. Only specify particular states in either `initialState` or `state`, not both.

#### Managing Column Order State

If you need to dynamically change the column order, or set the column order after the table has been initialized, you can manage the `columnOrder` state just like any other table state.

In v9, the recommended way to own a state slice is with an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the column order without re-rendering the component that owns the table.

```ts
import {
  useTable,
  tableFeatures,
  columnOrderingFeature,
  createAtom,
  type ColumnOrderState,
} from '@tanstack/ember-table'

const features = tableFeatures({ columnOrderingFeature })

const columnOrderAtom = createAtom<ColumnOrderState>([
  'columnId1',
  'columnId2',
  'columnId3',
])

const columnOrder = columnOrderAtom.get() // read the atom wherever it is needed

const table = useTable(() => ({
  features,
  //...
  atoms: {
    columnOrder: columnOrderAtom,
  },
  //...
}))
```

Alternatively, the v8-style `state.columnOrder` plus `onColumnOrderChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const features = tableFeatures({ columnOrderingFeature })

// inside your Glimmer component class
@tracked columnOrder: ColumnOrderState = ['columnId1', 'columnId2', 'columnId3']

table = useTable(() => ({
  features,
  //...
  state: {
    columnOrder: this.columnOrder,
    //...
  },
  onColumnOrderChange: (updater) => {
    this.columnOrder =
      typeof updater === 'function' ? updater(this.columnOrder) : updater
  },
}))
```

### Reordering Columns

If the table has UI that allows the user to reorder columns, hook the drop event of your drag-and-drop solution up to `table.setColumnOrder`. Here is a splice-based reorder helper you can call from a drop handler:

```ts
import type { Table } from '@tanstack/ember-table'

// reorder columns after a drag and drop interaction
const handleColumnDrop = (
  table: Table<typeof features, Person>,
  activeId: string,
  overId: string,
) => {
  if (activeId !== overId) {
    table.setColumnOrder((prevColumnOrder) => {
      const columnOrder = [...prevColumnOrder]
      const oldIndex = columnOrder.indexOf(activeId)
      const newIndex = columnOrder.indexOf(overId)
      columnOrder.splice(newIndex, 0, columnOrder.splice(oldIndex, 1)[0]!)
      return columnOrder // splice util
    })
  }
}
```

`table.setColumnOrder` works the same whether the table manages the `columnOrder` state internally, you control it with `state` + `onColumnOrderChange`, or you own it with an external atom.

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

#### Drag and Drop Column Reordering Suggestions

TanStack Table is not opinionated about which drag-and-drop solution you use. Here are a few suggestions:

1. Native browser drag events (`dragstart`, `dragover`, `drop`) wired up with the `{{on}}` modifier and your own `@tracked` state are the lightest option and need no dependencies. This is the approach the [Row DnD](../examples/row-dnd) example uses. It is very lightweight, but you will need to do extra work for proper touch support on mobile.

2. Use an Ember drag-and-drop addon if you want a library to handle pointer and touch input, autoscrolling, and accessibility for you. Whichever you choose, hook its drop event up to `table.setColumnOrder` as shown above.

3. If you evaluate a DnD library, check its maintenance status, Ember and Glint compatibility, bundle size, and how well it handles semantic `<table>` markup before committing.
