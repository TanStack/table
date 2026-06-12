---
title: Column Ordering (Angular) Guide
---

## Examples

Want to skip to the implementation? Check out these Angular examples:

- [Column Ordering](../examples/column-ordering)

### Angular Setup

```ts
import { signal } from '@angular/core'
import { injectTable, tableFeatures, columnOrderingFeature } from '@tanstack/angular-table'

const features = tableFeatures({ columnOrderingFeature })

export class App {
  readonly data = signal(defaultData)

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
  }))
}
```

## Column Ordering (Angular) Guide

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

readonly table = injectTable(() => ({
  features,
  //...
  initialState: {
    columnOrder: ['columnId1', 'columnId2', 'columnId3'],
  },
  //...
}))
```

> **Note:** If you are using the `state` table option to also specify the `columnOrder` state, the `initialState` will have no effect. Only specify particular states in either `initialState` or `state`, not both.

#### Managing Column Order State

If you need to dynamically change the column order, or set the column order after the table has been initialized, you can manage the `columnOrder` state just like any other table state.

In v9, the recommended way to own a state slice is with an external atom (created with `createAtom` from `@tanstack/angular-store`) passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the column order without re-running the `injectTable` options initializer on every change.

```ts
import { createAtom } from '@tanstack/angular-store'
import { injectTable, tableFeatures, columnOrderingFeature } from '@tanstack/angular-table'
import type { ColumnOrderState } from '@tanstack/angular-table'

const features = tableFeatures({ columnOrderingFeature })

export class App {
  readonly columnOrderAtom = createAtom<ColumnOrderState>([
    'columnId1',
    'columnId2',
    'columnId3',
  ])

  readonly table = injectTable(() => ({
    features,
    //...
    atoms: {
      columnOrder: this.columnOrderAtom,
    },
    //...
  }))

  // read this.columnOrderAtom.get() wherever you need the value
}
```

Alternatively, the v8-style `state.columnOrder` plus `onColumnOrderChange` pattern is still supported. In Angular this means owning the slice with an Angular signal. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const features = tableFeatures({ columnOrderingFeature })

readonly columnOrder = signal<ColumnOrderState>(['columnId1', 'columnId2', 'columnId3'])
//...
readonly table = injectTable(() => ({
  features,
  //...
  state: {
    columnOrder: this.columnOrder(),
    //...
  },
  onColumnOrderChange: (updater) =>
    typeof updater === 'function'
      ? this.columnOrder.update(updater)
      : this.columnOrder.set(updater),
  //...
}))
```

### Reordering Columns

If the table has UI that allows the user to reorder columns, hook the drop event of your drag-and-drop solution up to `table.setColumnOrder`. With Angular CDK's [drag-drop](https://material.angular.dev/cdk/drag-drop/overview) module (the same module the official [Row DnD example](../examples/row-dnd) uses to reorder rows), a horizontal `cdkDropList` over the header cells can drive the column order with `moveItemInArray`:

One prerequisite: the default `columnOrder` state is an empty array, and `moveItemInArray` on an empty array does nothing. Seed the order with the full list of column ids first, either in `initialState` (as below), in an external atom, or in your own signal.

```ts
import { moveItemInArray } from '@angular/cdk/drag-drop'
import type { CdkDragDrop } from '@angular/cdk/drag-drop'

const features = tableFeatures({ columnOrderingFeature })

export class App {
  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    initialState: {
      // seed the order with every column id so there is something to reorder
      columnOrder: columns.map((column) => column.id!),
    },
  }))

  // reorder columns after drag & drop
  dropColumn(event: CdkDragDrop<Array<string>>) {
    this.table.setColumnOrder((prevColumnOrder) => {
      const newColumnOrder = [...prevColumnOrder]
      moveItemInArray(newColumnOrder, event.previousIndex, event.currentIndex)
      return newColumnOrder
    })
  }
}
```

Once the order is initialized, `table.setColumnOrder` works the same whether the table manages the `columnOrder` state internally, you control it with `state` + `onColumnOrderChange`, or you own it with an external atom.

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

#### Drag and Drop Column Reordering Suggestions (Angular)

TanStack Table is not opinionated about which drag-and-drop solution you use. Here are a few suggestions:

1. Use [Angular CDK drag-drop](https://material.angular.dev/cdk/drag-drop/overview) (`@angular/cdk/drag-drop`) if you want a library. It is what the official Angular [Row DnD example](../examples/row-dnd) uses (`CdkDropList`, `CdkDrag`, and the `moveItemInArray` utility), it is maintained by the Angular team, and it handles touch support for you. There is no official Angular column DnD example yet, but the same directives work for reordering header cells in a horizontal drop list.

2. Consider native browser drag events (`dragstart`, `dragenter`, `dragend`) with your own signal or atom state if you want zero dependencies. This can be very lightweight, but you will need to do extra work for proper touch support on mobile.

3. If you evaluate other DnD libraries, check their maintenance status, framework compatibility, bundle size, and how well they handle semantic `<table>` markup before committing. Many popular DnD libraries (such as DnD Kit) are React-only and will not work with Angular.
