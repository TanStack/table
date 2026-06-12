---
title: Quick Start
---

TanStack Table is a headless table library. It manages your table's state and logic (sorting, filtering, pagination, selection, and more) while you keep 100% control over the markup and styles. The `@tanstack/vue-table` adapter wraps the framework-agnostic core with Vue reactivity, so table options can include refs and computed values. This page gets you from install to a rendering Vue table, then shows how to layer on your first feature.

## Installation

TanStack Table v9 is currently published under the `beta` tag:

```bash
npm install @tanstack/vue-table@beta
```

## Your First Table

The single-file component below is complete. Paste it into a Vue 3 app and you will see a working table.

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
import { FlexRender, tableFeatures, useTable } from '@tanstack/vue-table'
import type { ColumnDef } from '@tanstack/vue-table'

// 1. Define the shape of your data
type Person = {
  firstName: string
  lastName: string
  age: number
}

// 2. New in v9: declare which features this table uses (none yet)
const features = tableFeatures({})

// 3. Define your columns
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName', // accessorKey shorthand
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName, // accessorFn alternative with a custom id
    id: 'lastName',
    header: () => h('span', 'Last Name'),
    cell: (info) => h('i', info.getValue<string>()),
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
  },
]

// 4. Keep your data in a ref so the table reacts to changes
const data = ref<Array<Person>>([
  { firstName: 'tanner', lastName: 'linsley', age: 24 },
  { firstName: 'tandy', lastName: 'miller', age: 40 },
  { firstName: 'joe', lastName: 'dirte', age: 45 },
])

// 5. Create the table instance
const table = useTable({
  key: 'person-table', // registers this table with the devtools
  features,
  columns,
  data,
})
</script>

<!-- 6. Render markup from the table instance APIs -->
<template>
  <table>
    <thead>
      <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <th v-for="header in headerGroup.headers" :key="header.id">
          <FlexRender v-if="!header.isPlaceholder" :header="header" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in table.getRowModel().rows" :key="row.id">
        <td v-for="cell in row.getAllCells()" :key="cell.id">
          <FlexRender :cell="cell" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

A few things to note:

- `tableFeatures({})` declares which optional features the table uses. Registering only what you need keeps bundles small and gives TypeScript accurate types for the table instance.
- The core row model is always included. Feature row models (sorting, filtering, pagination) are registered directly on the features object when you need them.
- Passing the `data` ref directly keeps the table reactive: reassign `data.value` and the table updates.
- `FlexRender` renders the `header`, `cell`, and `footer` definitions from your columns, whether they are plain values, render functions using `h`, or Vue components.
- The `key` option is optional unless you use the [TanStack Table Devtools](../../devtools). The devtools identify tables by `key`, and you register a table by calling `useTanStackTableDevtools(table)` from `@tanstack/vue-table-devtools`.

See the full [Basic useTable example](./examples/basic-use-table) for a runnable version with more columns and a footer.

## Add a Feature: Sorting

Features are opt-in in v9. To make columns sortable, register `rowSortingFeature` and a `sortedRowModel` in `tableFeatures`, and wire the header click handler.

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
import {
  FlexRender,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'

const features = tableFeatures({
  rowSortingFeature, // enables sorting APIs and state
  sortedRowModel: createSortedRowModel(), // client-side sorting
  sortFns,
})

// columns and data unchanged from above

const table = useTable({
  key: 'person-table',
  features,
  columns,
  data,
})
</script>

<template>
  <table>
    <thead>
      <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <th
          v-for="header in headerGroup.headers"
          :key="header.id"
          :style="{
            cursor: header.column.getCanSort() ? 'pointer' : undefined,
          }"
          @click="header.column.getToggleSortingHandler()?.($event)"
        >
          <template v-if="!header.isPlaceholder">
            <FlexRender :header="header" />
            {{
              { asc: ' 🔼', desc: ' 🔽' }[
                header.column.getIsSorted() as string
              ]
            }}
          </template>
        </th>
      </tr>
    </thead>
    <!-- tbody unchanged from above -->
  </table>
</template>
```

Clicking a header now toggles between ascending, descending, and unsorted. Every other feature follows this same pattern: register the feature and its row model factory (if it has one) in `tableFeatures`, then use the APIs it adds to the table, columns, and rows. See the [Sorting Guide](./guide/sorting.md) and the [Sorting example](./examples/sorting) for custom sort functions, multi-sorting, and per-column options.

## Where to Go Next

**Table state.** In v9, table state is backed by TanStack Store atoms, and the Vue adapter wires them into Vue reactivity for you. You usually do not need to manage state yourself: set `initialState` for starting values and call feature APIs like `table.setSorting(...)` or `table.nextPage()`. When your app should own a state slice, or you want fine-grained subscriptions, read the [Table State Guide](./guide/table-state.md). It is the foundational guide for everything else.

**Feature guides.** Each feature has its own guide, such as [Column Filtering](./guide/column-filtering.md), [Pagination](./guide/pagination.md), [Row Selection](./guide/row-selection.md), and [Column Visibility](./guide/column-visibility.md).

**Composable tables.** When multiple tables in your app share features, row models, and component conventions, define them once with `createTableHook`:

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { useAppTable, createAppColumnHelper } = createTableHook({
  features,
})
```

See the [Composable Tables Guide](./guide/composable-tables.md) for the full pattern, including pre-bound cell and header components.

**Examples.** Browse the runnable [Vue examples](./examples/basic-use-table), from basic tables to feature demos, to see intended usage end to end.
