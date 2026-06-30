---
title: Expanding (Alpine) Guide
---

## Examples

Want to skip to the implementation? Check out these Alpine examples:

- [Expanding](../examples/expanding)
- [Sub Components](../examples/sub-components)

Read your reactive inputs such as `data` through a getter (for example backing them with `Alpine.reactive`) when creating the table, so the table sees updates.

### Expanding Setup

Here's how you set up your table to use expanding features. Adding the expanding feature enables the related APIs. Additionally, if using client-side expanding, you also need to set up `expandedRowModel` after its associated feature because row model slots are type-checked.

```ts
import {
  createExpandedRowModel,
  createTable,
  rowExpandingFeature,
  tableFeatures,
} from '@tanstack/alpine-table'

const features = tableFeatures({
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(), // if using client-side expanding
})

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
})
```

## Expanding Feature (Alpine) Guide

Expanding is a feature that allows you to show and hide additional rows of data related to a specific row. This can be useful in cases where you have hierarchical data and you want to allow users to drill down into the data from a higher level. Or it can be useful for showing additional information related to a row.

### Different use cases for Expanding Features

There are multiple use cases for expanding features in TanStack Table that will be discussed below.

1. Expanding sub-rows (child rows, aggregate rows, etc.)
2. Expanding custom UI (detail panels, sub-tables, etc.)

### Enable Client-Side Expanding

To use the client-side expanding features, add the `rowExpandingFeature` and the `expandedRowModel` factory to your features:

```ts
import {
  createExpandedRowModel,
  createTable,
  rowExpandingFeature,
  tableFeatures,
} from '@tanstack/alpine-table'

const features = tableFeatures({
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
})

const table = createTable({
  features,
  // other options...
})
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

const data: Person[] = [
  {
    id: 1,
    name: 'John',
    age: 30,
    children: [
      { id: 2, name: 'Jane', age: 5 },
      { id: 5, name: 'Jim', age: 10 },
    ],
  },
  {
    id: 3,
    name: 'Doe',
    age: 40,
    children: [{ id: 4, name: 'Alice', age: 10 }],
  },
]
```

Then you can use the getSubRows function to return the children array in each row as expanded rows. The table instance will now understand where to look for the sub rows on each row.

```ts
const table = createTable({
  features,
  getSubRows: (row) => row.children, // return the children array as sub-rows
  // other options...
})
```

> **Note:** You can have a complicated `getSubRows` function, but keep in mind that it will run for every row and every sub-row. This can be expensive if the function is not optimized. Async functions are not supported.

### Custom Expanding UI

In some cases, you may wish to show extra details or information, which may or may not be part of your table data object, such as expanded data for rows. This kind of expanding row UI has gone by many names over the years including "expandable rows", "detail panels", "sub-components", etc.

By default, the `row.getCanExpand()` row instance API will return false unless it finds `subRows` on a row. This can be overridden by implementing your own `getRowCanExpand` function in the table instance options.

Because Alpine does not initialize directives inside content set with `x-html`, render the detail panel content with `x-html`, while the expanded sub-row markup itself stays in your template. Use `x-if="row.getIsExpanded()"` to conditionally render the detail row.

```ts
Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(10, 5) })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    getRowCanExpand: () => true,
  })

  return {
    table,
    FlexRender,
    renderSubComponent(row) {
      return `<pre style="font-size:10px"><code>${JSON.stringify(
        row.original,
        null,
        2,
      )}</code></pre>`
    },
  }
})
```

```html
<template x-for="row in table.getRowModel().rows" :key="row.id">
  <tbody>
    <tr>
      <template x-for="cell in row.getAllCells()" :key="cell.id">
        <td x-html="FlexRender({ cell })"></td>
      </template>
    </tr>
    <!-- expanded detail sub-row -->
    <template x-if="row.getIsExpanded()">
      <tr>
        <td :colspan="row.getAllCells().length">
          <span x-html="renderSubComponent(row)"></span>
        </td>
      </tr>
    </template>
  </tbody>
</template>
```

### Expanded rows state

If you need access to the expanded state of the rows in other parts of your application, you can own the `expanded` state slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option. `@tanstack/store` is already a dependency of `@tanstack/alpine-table`, so `createAtom` is available. The atom can be read, written, or subscribed to anywhere in your app without making the table depend on component-local state.

```ts
import { createAtom } from '@tanstack/store'
import type { ExpandedState } from '@tanstack/alpine-table'

const expandedAtom = createAtom<ExpandedState>({})

// subscribe to the atom wherever you need the value
expandedAtom.subscribe(() => {
  // react to expanded changes
})

const table = createTable({
  features,
  // other options...
  atoms: {
    expanded: expandedAtom, // expanding APIs now update expandedAtom
  },
})
```

Alternatively, the v8-style `state.expanded` plus `onExpandedChange` pattern is still supported by owning the slice in `Alpine.reactive`. It can be convenient for simple integrations or when migrating v8 code. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const local = Alpine.reactive({ expanded: {} as ExpandedState })

const table = createTable({
  features,
  // other options...
  state: {
    get expanded() {
      return local.expanded // connect the reactive slice back down to the table
    },
  },
  onExpandedChange: (updater) => {
    local.expanded =
      typeof updater === 'function' ? updater(local.expanded) : updater
  },
})
```

You can read the current expanded value with `table.atoms.expanded.get()`. Inside an Alpine binding this is a reactive read; in event handlers it simply returns the current value.

The ExpandedState type is defined as follows:

```ts
type ExpandedState = true | Record<string, boolean>
```

If the ExpandedState is true, it means all rows are expanded. If it's a record, only the rows with IDs present as keys in the record and have their value set to true are expanded. For example, if the expanded state is { row1: true, row2: false }, it means the row with ID row1 is expanded and the row with ID row2 is not expanded. This state is used by the table to determine which rows are expanded and should display their subRows, if any.

### UI toggling handler for expanded rows

TanStack table will not add a toggling handler UI for expanded data to your table. You should manually add it within each row's UI to allow users to expand and collapse the row. Because Alpine does not initialize directives inside content set with `x-html`, the expander button cannot live inside an `x-html` cell. Instead, special-case the expander column by its column id directly in your markup and attach the handler returned by `getToggleExpandedHandler` to a real button.

```html
<td>
  <!-- expander cell: interactive expand button -->
  <template x-if="cell.column.id === 'expander'">
    <span>
      <button
        x-show="cell.row.getCanExpand()"
        style="cursor: pointer"
        @click="cell.row.getToggleExpandedHandler()($event)"
        x-text="cell.row.getIsExpanded() ? '👇' : '👉'"
      ></button>
      <span x-show="!cell.row.getCanExpand()">🔵</span>
    </span>
  </template>
  <!-- other cells -->
  <template x-if="cell.column.id !== 'expander'">
    <span x-html="FlexRender({ cell })"></span>
  </template>
</td>
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
const table = createTable({
  features,
  getSubRows: (row) => row.subRows,
  filterFromLeafRows: true, // search through the expanded rows
  maxLeafRowFilterDepth: 1, // limit the depth of the expanded rows that are searched
  // other options...
})
```

### Paginating Expanded Rows

By default, expanded rows are paginated along with the rest of the table (which means expanded rows may span multiple pages). If you want to disable this behavior (which means expanded rows will always render on their parents page. This also means more rows will be rendered than the set page size) you can use the `paginateExpandedRows` option.

```ts
const table = createTable({
  features,
  // other options...
  paginateExpandedRows: false,
})
```

### Pinning Expanded Rows

Pinning expanded rows works the same way as pinning regular rows. You can pin expanded rows to the top or bottom of the table. Please refer to the [Row Pinning Guide](./row-pinning) for more information on row pinning.

### Sorting Expanded Rows

By default, expanded rows are sorted along with the rest of the table.

### Auto Reset Expanded State

If you are also using the grouping feature, the `expanded` state is automatically reset whenever the grouped row model recomputes, such as when the `data` or the grouping state changes. This default is automatically disabled when `manualExpanding` is `true`, but it can be overridden by explicitly assigning a boolean value to the `autoResetExpanded` table option. There is also a global `autoResetAll` table option that disables (or enables) every auto-reset behavior at once.

A common reason to set `autoResetExpanded: false` is editing data while viewing the table (for example, inline cell editing). Every edit updates `data`, which recomputes the row models and would otherwise collapse the user's expanded rows. If you also use the pagination feature, pair it with `autoResetPageIndex: false` so the current page is kept as well.

```ts
const table = createTable({
  features,
  // other options...
  autoResetExpanded: false, // keep expanded state when data changes
  // autoResetAll: false, // or turn off all auto resets at once
})
```

### Manual Expanding (server-side)

If you are doing server-side expansion, you can enable manual row expansion by setting the manualExpanding option to true. This means that the `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model.

```ts
const features = tableFeatures({ rowExpandingFeature })

const table = createTable({
  features,
  // other options...
  manualExpanding: true,
})
```
