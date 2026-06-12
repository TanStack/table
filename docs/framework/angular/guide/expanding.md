---
title: Expanding (Angular) Guide
---

## Examples

Want to skip to the implementation? Check out these Angular examples:

- [Expanding](../examples/expanding)

### Angular Setup

```ts
import { signal } from '@angular/core'
import { injectTable, tableFeatures, rowExpandingFeature, createExpandedRowModel } from '@tanstack/angular-table'

const features = tableFeatures({
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
})

export class App {
  readonly data = signal(defaultData)

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
  }))
}
```

## Expanding Feature (Angular) Guide

Expanding is a feature that allows you to show and hide additional rows of data related to a specific row. This can be useful in cases where you have hierarchical data and you want to allow users to drill down into the data from a higher level. Or it can be useful for showing additional information related to a row.

### Different use cases for Expanding Features

There are multiple use cases for expanding features in TanStack Table that will be discussed below.

1. Expanding sub-rows (child rows, aggregate rows, etc.)
2. Expanding custom UI (detail panels, sub-tables, etc.)

### Enable Client-Side Expanding

To use the client-side expanding features, add the `rowExpandingFeature` and the `expandedRowModel` factory to your features:

```ts
import {
  injectTable,
  tableFeatures,
  rowExpandingFeature,
  createExpandedRowModel,
} from '@tanstack/angular-table'

const features = tableFeatures({
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
})

readonly table = injectTable(() => ({
  features,
  // other options...
}))
```

Expanded data can either contain table rows or any other data you want to display. We will discuss how to handle both cases in this guide.

### Table rows as expanded data

Expanded rows are essentially child rows that inherit the same column structure as their parent rows. If your data object already includes these expanded rows data, you can utilize the `getSubRows` function to specify these child rows. However, if your data object does not contain the expanded rows data, they can be treated as custom expanded data, which is discussed in next section.

For example, if you have a data object like this:

```ts
type Person = {
  id: number
  name: string
  age: number
  children?: Person[] | undefined
}

const data: Person[] =  [
  { id: 1, 
  name: 'John', 
  age: 30, 
  children: [
      { id: 2, name: 'Jane', age: 5 },
      { id: 5, name: 'Jim', age: 10 }
    ] 
  },
  { id: 3,
   name: 'Doe', 
   age: 40, 
    children: [
      { id: 4, name: 'Alice', age: 10 }
    ] 
  },
]
```

Then you can use the getSubRows function to return the children array in each row as expanded rows. The table instance will now understand where to look for the sub rows on each row.

```ts
readonly table = injectTable(() => ({
  features,
  getSubRows: (row) => row.children, // return the children array as sub-rows
  // other options...
}))
```

> **Note:** You can have a complicated `getSubRows` function, but keep in mind that it will run for every row and every sub-row. This can be expensive if the function is not optimized. Async functions are not supported.

### Custom Expanding UI

In some cases, you may wish to show extra details or information, which may or may not be part of your table data object, such as expanded data for rows. This kind of expanding row UI has gone by many names over the years including "expandable rows", "detail panels", "sub-components", etc.

By default, the `row.getCanExpand()` row instance API will return false unless it finds `subRows` on a row. This can be overridden by implementing your own `getRowCanExpand` function in the table instance options.

```html
<tbody>
  @for (row of table.getRowModel().rows; track row.id) {
    <tr>
      @for (cell of row.getVisibleCells(); track cell.id) {
        <td>
          <ng-container *flexRenderCell="cell; let renderCell">{{ renderCell }}</ng-container>
        </td>
      }
    </tr>
    @if (row.getIsExpanded()) {
      <tr>
        <td [attr.colSpan]="row.getAllCells().length">
          <!-- Your custom UI goes here -->
        </td>
      </tr>
    }
  }
</tbody>
```

### Expanded rows state

If you need access to the expanded state of the rows in other parts of your application, you can own the `expanded` state slice yourself. The recommended way in v9 is an external atom (created with `createAtom` from `@tanstack/angular-store`) passed through the `atoms` table option. Atoms preserve fine-grained subscriptions, and the expanded value can be read anywhere in your app without re-running the `injectTable` options initializer on every change.

```ts
import { createAtom } from '@tanstack/angular-store'

export class App {
  readonly expandedAtom = createAtom<ExpandedState>({})

  readonly table = injectTable(() => ({
    features,
    // other options...
    atoms: {
      expanded: this.expandedAtom, // expanding APIs now update expandedAtom
    },
  }))

  // read this.expandedAtom.get() wherever you need the value
}
```

Alternatively, the v8-style `state.expanded` plus `onExpandedChange` pattern is still supported. In Angular this means owning the slice with an Angular signal, as shown in the [Basic External State example](../examples/basic-external-state). It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
readonly expanded = signal<ExpandedState>({})

readonly table = injectTable(() => ({
  features,
  // other options...
  state: {
    expanded: this.expanded(),
  },
  onExpandedChange: (updater) =>
    typeof updater === 'function'
      ? this.expanded.update(updater)
      : this.expanded.set(updater),
}))
```

The ExpandedState type is defined as follows:

```ts
type ExpandedState = true | Record<string, boolean>
```

If the ExpandedState is true, it means all rows are expanded. If it's a record, only the rows with IDs present as keys in the record and have their value set to true are expanded.  For example, if the expanded state is { row1: true, row2: false }, it means the row with ID row1 is expanded and the row with ID row2 is not expanded. This state is used by the table to determine which rows are expanded and should display their subRows, if any.

### UI toggling handler for expanded rows

TanStack table will not add a toggling handler UI for expanded data to your table. You should manually add it within each row's UI to allow users to expand and collapse the row. For example, you can add a button UI within the columns definition.

```ts
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    header: 'Children',
    cell: ({ row }) => row.getCanExpand(),
  },
]
```

```html
@if (row.getCanExpand()) {
  <button
    type="button"
    (click)="row.getToggleExpandedHandler()?.($event)"
    style="cursor: pointer"
  >
    {{ row.getIsExpanded() ? 'Expanded' : 'Collapsed' }}
  </button>
}
```

### Expanding APIs

Rows expose helpers for reading and toggling their expanded state:

```ts
row.getCanExpand()
row.getIsExpanded()
row.getIsAllParentsExpanded()
row.getToggleExpandedHandler()
row.toggleExpanded()
```

The table instance exposes helpers for reading and toggling aggregate expanded state:

```ts
table.getCanSomeRowsExpand()
table.getIsAllRowsExpanded()
table.getIsSomeRowsExpanded()
table.getExpandedDepth()
table.getToggleAllRowsExpandedHandler()
table.toggleAllRowsExpanded()
table.resetExpanded()
```

Use `table.setExpanded` to update the expanded state directly. `table.resetExpanded()` resets to `initialState.expanded`, while `table.resetExpanded(true)` clears the expanded state.

### Filtering Expanded Rows

By default, the filtering process starts from the parent rows and moves downwards. This means if a parent row is excluded by the filter, all its child rows will also be excluded. However, you can change this behavior by using the `filterFromLeafRows` option. When this option is enabled, the filtering process starts from the leaf (child) rows and moves upwards. This ensures that a parent row will be included in the filtered results as long as at least one of its child or grandchild rows meets the filter criteria. Additionally, you can control how deep into the child hierarchy the filter process goes by using the `maxLeafRowFilterDepth` option. This option allows you to specify the maximum depth of child rows that the filter should consider.

```ts
const features = tableFeatures({
  columnFilteringFeature,
  rowExpandingFeature,
  filteredRowModel: createFilteredRowModel(),
  expandedRowModel: createExpandedRowModel(),
  filterFns,
})

//...
readonly table = injectTable(() => ({
  features,
  getSubRows: (row) => row.subRows,
  filterFromLeafRows: true, // search through the expanded rows
  maxLeafRowFilterDepth: 1, // limit the depth of the expanded rows that are searched
  // other options...
}))
```

### Paginating Expanded Rows

By default, expanded rows are paginated along with the rest of the table (which means expanded rows may span multiple pages). If you want to disable this behavior (which means expanded rows will always render on their parents page. This also means more rows will be rendered than the set page size) you can use the `paginateExpandedRows` option.

```ts
readonly table = injectTable(() => ({
  features,
  // other options...
  paginateExpandedRows: false,
}))
```

### Pinning Expanded Rows

Pinning expanded rows works the same way as pinning regular rows. You can pin expanded rows to the top or bottom of the table. Please refer to the [Row Pinning Guide](./row-pinning) for more information on row pinning.

### Sorting Expanded Rows

By default, expanded rows are sorted along with the rest of the table.

### Auto Reset Expanded State

If you are also using the grouping feature, the `expanded` state is automatically reset whenever the grouped row model recomputes, such as when the `data` or the grouping state changes. This default is automatically disabled when `manualExpanding` is `true`, but it can be overridden by explicitly assigning a boolean value to the `autoResetExpanded` table option. There is also a global `autoResetAll` table option that disables (or enables) every auto-reset behavior at once.

A common reason to set `autoResetExpanded: false` is editing data while viewing the table (for example, inline cell editing). Every edit updates `data`, which recomputes the row models and would otherwise collapse the user's expanded rows. If you also use the pagination feature, pair it with `autoResetPageIndex: false` so the current page is kept as well.

```ts
const features = tableFeatures({
  rowExpandingFeature,
  columnGroupingFeature,
  expandedRowModel: createExpandedRowModel(),
  // the auto-reset only fires when the grouped row model recomputes
  groupedRowModel: createGroupedRowModel(),
  aggregationFns,
})

export class App {
  readonly table = injectTable(() => ({
    features,
    // other options...
    autoResetExpanded: false, // keep expanded state when data changes
    // autoResetAll: false, // or turn off all auto resets at once
  }))
}
```

### Manual Expanding (server-side)

If you are doing server-side expansion, you can enable manual row expansion by setting the manualExpanding option to true. This means that the `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model.

```ts
const features = tableFeatures({ rowExpandingFeature })

readonly table = injectTable(() => ({
  features,
  // other options...
  manualExpanding: true,
}))
```
